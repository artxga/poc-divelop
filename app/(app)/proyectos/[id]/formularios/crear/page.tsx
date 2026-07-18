"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  PROYECTOS,
  INDICADORES,
  USUARIOS,
  ESTANDAR_CONFIG,
  CATEGORIA_CONFIG,
  type Indicador
} from "@/app/_lib/mock-data";
import { useAuth } from "@/app/_lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, GripVertical, Plus, Save, Send, Trash2, LayoutList, GripHorizontal } from "lucide-react";
import { IndicadorModal } from "@/app/_components/indicador-modal";
import { cn } from "@/lib/utils";

// --- Subcomponents for DnD ---

function DraggableIndicador({ indicador }: { indicador: Indicador }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bank-${indicador.id}`,
    data: { type: "Indicator", indicador },
  });

  const catCfg = CATEGORIA_CONFIG[indicador.categoria];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "p-3 rounded-lg border border-border/50 bg-card cursor-grab hover:border-emerald-500/30 transition-all text-left",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <GripHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="font-mono text-[10px] text-muted-foreground">{indicador.codigo}</span>
      </div>
      <p className="text-xs font-medium leading-snug line-clamp-2">{indicador.nombre}</p>
      <div className={`mt-2 flex items-center gap-1.5 text-[10px] ${catCfg.color}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${catCfg.dot}`} />
        {indicador.categoria}
      </div>
    </div>
  );
}

function SortableIndicador({ id, indicador, onRemove }: { id: string; indicador: Indicador; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const catCfg = CATEGORIA_CONFIG[indicador.categoria];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-start gap-3 p-4 rounded-xl border bg-card shadow-sm",
        isDragging ? "border-emerald-500/50 shadow-md shadow-emerald-500/10 z-10" : "border-border/50"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-1 cursor-grab text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="w-5 h-5" />
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-muted-foreground">{indicador.codigo}</span>
          <div className={`flex items-center gap-1.5 text-xs ${catCfg.color}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${catCfg.dot}`} />
            {indicador.categoria}
          </div>
        </div>
        <p className="font-medium text-sm">{indicador.nombre}</p>
        <p className="text-xs text-muted-foreground mt-1">{indicador.descripcion}</p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all shrink-0"
        onClick={onRemove}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

// --- Main Page Component ---

export default function CreadorFormularioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  
  const proyecto = PROYECTOS.find((p) => p.id === id);
  
  // State
  const [nombreForm, setNombreForm] = useState("");
  const [indicadoresForm, setIndicadoresForm] = useState<Indicador[]>([]);
  const [usuariosAsignados, setUsuariosAsignados] = useState<string[]>([]);
  const [bancoIndicadores, setBancoIndicadores] = useState<Indicador[]>(INDICADORES);
  
  // Modal state for new indicator
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  
  const usuariosCliente = USUARIOS.filter(u => u.clienteId === proyecto?.clienteId);

  // DnD Setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  
  const { setNodeRef: setDroppableRef } = useDroppable({ id: "canvas" });

  if (!proyecto || !user) return null;

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) return;

    const activeIdStr = String(active.id);

    // Dropped from bank to canvas
    if (activeIdStr.startsWith("bank-") && over.id === "canvas") {
      const indId = activeIdStr.replace("bank-", "");
      const indicador = bancoIndicadores.find(i => i.id === indId);
      if (indicador && !indicadoresForm.find(i => i.id === indId)) {
        setIndicadoresForm((prev) => [...prev, indicador]);
      }
      return;
    }

    // Reordering within canvas
    if (!activeIdStr.startsWith("bank-") && over.id !== "canvas") {
      if (active.id !== over.id) {
        setIndicadoresForm((items) => {
          const oldIndex = items.findIndex((i) => i.id === active.id);
          const newIndex = items.findIndex((i) => i.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
  }

  const handleSaveIndicador = (nuevo: Omit<Indicador, "id">) => {
    const newInd: Indicador = { ...nuevo, id: `new-ind-${Date.now()}` };
    setBancoIndicadores((prev) => [...prev, newInd]);
  };

  const handleGuardar = (estado: "borrador" | "enviado") => {
    if (!nombreForm || indicadoresForm.length === 0) {
      alert("Debes ingresar un nombre y agregar al menos un indicador.");
      return;
    }
    if (estado === "enviado" && usuariosAsignados.length === 0) {
      alert("Debes seleccionar al menos un usuario para enviar.");
      return;
    }
    
    // Aquí en un entorno real se haría un POST al backend
    alert(`Formulario guardado como ${estado}. Serás redirigido.`);
    router.push(`/proyectos/${proyecto.id}`);
  };

  const activeIndicador = activeDragId?.startsWith("bank-") 
    ? bancoIndicadores.find(i => i.id === activeDragId.replace("bank-", ""))
    : indicadoresForm.find(i => i.id === activeDragId);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/proyectos/${proyecto.id}`} className="p-2 -ml-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Creador de Formulario</h1>
            <p className="text-sm text-muted-foreground">{proyecto.nombre}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => handleGuardar("borrador")} className="gap-2">
            <Save className="w-4 h-4" /> Guardar Borrador
          </Button>
          <Button onClick={() => handleGuardar("enviado")} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
            <Send className="w-4 h-4" /> Enviar Formulario
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
          
          {/* Panel Izquierdo: Banco de Indicadores */}
          <Card className="w-full lg:w-72 flex flex-col bg-card/60 backdrop-blur-sm border-border/50 shrink-0">
            <div className="p-4 border-b border-border/50 flex flex-col gap-3">
              <h2 className="font-semibold text-sm flex items-center gap-2">
                <LayoutList className="w-4 h-4 text-emerald-400" /> 
                Banco de Indicadores
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Nuevo Indicador
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {bancoIndicadores.map((ind) => (
                  <DraggableIndicador key={ind.id} indicador={ind} />
                ))}
              </div>
            </div>
          </Card>

          {/* Panel Central: Lienzo del Formulario */}
          <Card className="flex-1 flex flex-col bg-card/40 border-border/50 min-h-[400px]">
            <div className="p-6 border-b border-border/50 shrink-0">
              <Input 
                value={nombreForm}
                onChange={(e) => setNombreForm(e.target.value)}
                placeholder="Nombre del formulario (Ej: Reporte Ambiental 2025)..."
                className="text-2xl font-bold h-14 bg-transparent border-transparent hover:border-border focus-visible:ring-0 focus-visible:border-emerald-500/50 px-2"
              />
            </div>
            
            <div 
              ref={setDroppableRef} 
              className={cn(
                "flex-1 p-6 overflow-y-auto bg-gradient-to-b from-transparent to-secondary/5",
                activeDragId?.startsWith("bank-") && "bg-emerald-500/5 border-2 border-dashed border-emerald-500/30 rounded-b-xl"
              )}
            >
              <div className="max-w-2xl mx-auto space-y-3 pb-20">
                {indicadoresForm.length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl text-muted-foreground bg-card/30">
                    <LayoutList className="w-8 h-8 mb-3 opacity-20" />
                    <p>Arrastra indicadores desde el panel izquierdo hacia aquí</p>
                  </div>
                ) : (
                  <SortableContext items={indicadoresForm.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    {indicadoresForm.map((ind) => (
                      <SortableIndicador 
                        key={ind.id} 
                        id={ind.id} 
                        indicador={ind} 
                        onRemove={() => setIndicadoresForm(prev => prev.filter(i => i.id !== ind.id))}
                      />
                    ))}
                  </SortableContext>
                )}
              </div>
            </div>
          </Card>

          {/* Panel Derecho: Configuración */}
          <Card className="w-full lg:w-72 flex flex-col bg-card/60 backdrop-blur-sm border-border/50 shrink-0">
            <div className="p-4 border-b border-border/50">
              <h2 className="font-semibold text-sm">Asignación de Usuarios</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <p className="text-xs text-muted-foreground mb-4">
                Selecciona los usuarios del cliente que deberán llenar este formulario. Se creará una instancia individual para cada uno.
              </p>
              
              {usuariosCliente.length === 0 ? (
                <p className="text-sm text-amber-400">No hay usuarios registrados para este cliente.</p>
              ) : (
                usuariosCliente.map(u => (
                  <label key={u.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-secondary/40 cursor-pointer transition-colors">
                    <Checkbox 
                      className="mt-0.5"
                      checked={usuariosAsignados.includes(u.email)}
                      onCheckedChange={(checked) => {
                        if (checked) setUsuariosAsignados(prev => [...prev, u.email]);
                        else setUsuariosAsignados(prev => prev.filter(email => email !== u.email));
                      }}
                    /> 
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{u.nombre}</span>
                      <span className="text-xs text-muted-foreground">{u.email}</span>
                      <span className="text-[10px] uppercase text-emerald-400 mt-1">{u.rol.replace("_", " ")}</span>
                    </div>
                  </label>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Drag Overlay for visual feedback */}
        <DragOverlay dropAnimation={{ duration: 150, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
          {activeIndicador ? (
            <div className="opacity-90 rotate-2 scale-105 shadow-2xl">
              {activeDragId?.startsWith("bank-") ? (
                <DraggableIndicador indicador={activeIndicador} />
              ) : (
                <SortableIndicador id={activeIndicador.id} indicador={activeIndicador} onRemove={() => {}} />
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <IndicadorModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onSave={handleSaveIndicador} 
      />
    </div>
  );
}
