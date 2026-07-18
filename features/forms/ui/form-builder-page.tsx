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
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PROJECTS, INDICATORS, USERS } from "@/features/shared/api/mock-db";
import type { Indicator } from "@/features/indicators/model/types";
import { useAuth } from "@/features/auth/api/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Plus, Save, Send, LayoutList } from "lucide-react";
import { IndicatorModal } from "@/features/indicators/ui/indicator-modal";
import { cn } from "@/lib/utils";
import { DraggableIndicator } from "./dnd-components/draggable-indicator";
import { SortableIndicator } from "./dnd-components/sortable-indicator";

export function FormBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  
  const project = PROJECTS.find((p) => p.id === id);
  
  // State
  const [formName, setFormName] = useState("");
  const [formIndicators, setFormIndicators] = useState<Indicator[]>([]);
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);
  const [indicatorsBank, setIndicatorsBank] = useState<Indicator[]>(INDICATORS);
  
  // Modal state for new indicator
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  
  const clientUsers = USERS.filter(u => u.clientId === project?.clientId);

  // DnD Setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  
  const { setNodeRef: setDroppableRef } = useDroppable({ id: "canvas" });

  if (!project || !user) return null;

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
      const indicator = indicatorsBank.find(i => i.id === indId);
      if (indicator && !formIndicators.find(i => i.id === indId)) {
        setFormIndicators((prev) => [...prev, indicator]);
      }
      return;
    }

    // Reordering within canvas
    if (!activeIdStr.startsWith("bank-") && over.id !== "canvas") {
      if (active.id !== over.id) {
        setFormIndicators((items) => {
          const oldIndex = items.findIndex((i) => i.id === active.id);
          const newIndex = items.findIndex((i) => i.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
  }

  const handleSaveIndicator = (newIndicator: Omit<Indicator, "id">) => {
    const newInd: Indicator = { ...newIndicator, id: `new-ind-${Date.now()}` };
    setIndicatorsBank((prev) => [...prev, newInd]);
  };

  const handleSave = (status: "borrador" | "enviado") => {
    if (!formName || formIndicators.length === 0) {
      alert("Debes ingresar un nombre y agregar al menos un indicador.");
      return;
    }
    if (status === "enviado" && assignedUsers.length === 0) {
      alert("Debes seleccionar al menos un usuario para enviar.");
      return;
    }
    
    // Aquí en un entorno real se haría un POST al backend
    alert(`Formulario guardado como ${status}. Serás redirigido.`);
    router.push(`/projects/${project.id}`);
  };

  const activeIndicator = activeDragId?.startsWith("bank-") 
    ? indicatorsBank.find(i => i.id === activeDragId.replace("bank-", ""))
    : formIndicators.find(i => i.id === activeDragId);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/projects/${project.id}`} className="p-2 -ml-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Creador de Formulario</h1>
            <p className="text-sm text-muted-foreground">{project.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => handleSave("borrador")} className="gap-2">
            <Save className="w-4 h-4" /> Guardar Borrador
          </Button>
          <Button onClick={() => handleSave("enviado")} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
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
                {indicatorsBank.map((ind) => (
                  <DraggableIndicator key={ind.id} indicator={ind} />
                ))}
              </div>
            </div>
          </Card>

          {/* Panel Central: Lienzo del Formulario */}
          <Card className="flex-1 flex flex-col bg-card/40 border-border/50 min-h-[400px]">
            <div className="p-6 border-b border-border/50 shrink-0">
              <Input 
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
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
                {formIndicators.length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl text-muted-foreground bg-card/30">
                    <LayoutList className="w-8 h-8 mb-3 opacity-20" />
                    <p>Arrastra indicadores desde el panel izquierdo hacia aquí</p>
                  </div>
                ) : (
                  <SortableContext items={formIndicators.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    {formIndicators.map((ind) => (
                      <SortableIndicator 
                        key={ind.id} 
                        id={ind.id} 
                        indicator={ind} 
                        onRemove={() => setFormIndicators(prev => prev.filter(i => i.id !== ind.id))}
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
              
              {clientUsers.length === 0 ? (
                <p className="text-sm text-amber-400">No hay usuarios registrados para este cliente.</p>
              ) : (
                clientUsers.map(u => (
                  <label key={u.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-secondary/40 cursor-pointer transition-colors">
                    <Checkbox 
                      className="mt-0.5"
                      checked={assignedUsers.includes(u.email)}
                      onCheckedChange={(checked) => {
                        if (checked) setAssignedUsers(prev => [...prev, u.email]);
                        else setAssignedUsers(prev => prev.filter(email => email !== u.email));
                      }}
                    /> 
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{u.name}</span>
                      <span className="text-xs text-muted-foreground">{u.email}</span>
                      <span className="text-[10px] uppercase text-emerald-400 mt-1">{u.role.replace("_", " ")}</span>
                    </div>
                  </label>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Drag Overlay for visual feedback */}
        <DragOverlay dropAnimation={{ duration: 150, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
          {activeIndicator ? (
            <div className="opacity-90 rotate-2 scale-105 shadow-2xl">
              {activeDragId?.startsWith("bank-") ? (
                <DraggableIndicator indicator={activeIndicator} />
              ) : (
                <SortableIndicator id={activeIndicator.id} indicator={activeIndicator} onRemove={() => {}} />
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <IndicatorModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onSave={handleSaveIndicator} 
      />
    </div>
  );
}
