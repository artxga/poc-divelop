"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FORMULARIOS_ENVIADOS,
  FORMULARIO_TEMPLATES,
  PROYECTOS,
  USUARIOS,
  type FormularioEnviado,
  type FormEstado,
} from "@/app/_lib/mock-data";
import {
  GripVertical,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Clock,
  FileText,
  User,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const COLUMNAS: { id: FormEstado; label: string; icon: React.ElementType; color: string }[] = [
  { id: "borrador", label: "Borrador", icon: Circle, color: "text-slate-400" },
  { id: "enviado", label: "Enviado a Revisión", icon: Clock, color: "text-blue-400" },
  { id: "observado", label: "Observado", icon: AlertTriangle, color: "text-amber-400" },
  { id: "aprobado", label: "Aprobado", icon: CheckCircle2, color: "text-emerald-400" },
];

interface KanbanCardProps {
  envio: FormularioEnviado;
  isDragging?: boolean;
}

function KanbanCard({ envio, isDragging }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: envio.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const template = FORMULARIO_TEMPLATES.find(t => t.id === envio.templateId);
  const proyecto = PROYECTOS.find((p) => p.id === envio.proyectoId);
  const userAsignado = USUARIOS.find(u => u.email === envio.usuarioEmail);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-3 shadow-sm",
        "hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/5 transition-all",
        isDragging && "opacity-50 scale-95"
      )}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 text-emerald-400">
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium text-xs truncate">{template?.nombre}</span>
          </div>
          
          <p className="text-xs text-muted-foreground truncate mb-2">{proyecto?.nombre}</p>

          <div className="flex flex-col gap-1.5 mt-2 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <User className="w-3 h-3" />
              <span className="truncate">{userAsignado?.nombre || envio.usuarioEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn("h-full", envio.progreso >= 80 ? "bg-emerald-500" : envio.progreso >= 50 ? "bg-amber-500" : "bg-red-500")}
                  style={{ width: `${envio.progreso}%` }}
                />
              </div>
              <span className="text-[10px] font-medium">{envio.progreso}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ValidacionPage() {
  const [envios, setEnvios] = useState<FormularioEnviado[]>(FORMULARIOS_ENVIADOS);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Filtros
  const [filtroProyecto, setFiltroProyecto] = useState<string>("todos");
  const [filtroTemplate, setFiltroTemplate] = useState<string>("todos");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const enviosFiltrados = envios.filter((e) => {
    if (filtroProyecto !== "todos" && e.proyectoId !== filtroProyecto) return false;
    if (filtroTemplate !== "todos" && e.templateId !== filtroTemplate) return false;
    return true;
  });

  const byEstado = (estado: FormEstado) =>
    enviosFiltrados.filter((e) => e.estado === estado);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) { setActiveId(null); return; }

    const activeEnvio = envios.find((e) => e.id === active.id);
    if (!activeEnvio) { setActiveId(null); return; }

    const targetColId = COLUMNAS.find((c) => c.id === over.id)?.id;
    if (targetColId) {
      setEnvios((prev) =>
        prev.map((e) => e.id === active.id ? { ...e, estado: targetColId } : e)
      );
    } else {
      const targetEnvio = envios.find((e) => e.id === over.id);
      if (targetEnvio && targetEnvio.estado !== activeEnvio.estado) {
        setEnvios((prev) =>
          prev.map((e) => e.id === active.id ? { ...e, estado: targetEnvio.estado } : e)
        );
      }
    }
    setActiveId(null);
  }

  const activeEnvio = envios.find((e) => e.id === activeId);

  // Derivar templates disponibles según proyecto seleccionado
  const templatesDisponibles = FORMULARIO_TEMPLATES.filter(
    (t) => filtroProyecto === "todos" || t.proyectoId === filtroProyecto
  );

  return (
    <div className="space-y-5 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Flujo de Validación</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Filtra por proyecto y formulario para validar las respuestas de cada usuario.
          </p>
        </div>
        
        <Card className="flex items-center gap-3 p-2 bg-card/60 backdrop-blur-sm border-border/50 shrink-0">
          <Filter className="w-4 h-4 ml-2 text-muted-foreground" />
          <Select value={filtroProyecto} onValueChange={(val) => { setFiltroProyecto(val); setFiltroTemplate("todos"); }}>
            <SelectTrigger className="w-[200px] h-8 text-xs border-transparent bg-secondary/50">
              <SelectValue placeholder="Proyecto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los proyectos</SelectItem>
              {PROYECTOS.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filtroTemplate} onValueChange={setFiltroTemplate}>
            <SelectTrigger className="w-[200px] h-8 text-xs border-transparent bg-secondary/50">
              <SelectValue placeholder="Formulario (Plantilla)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los formularios</SelectItem>
              {templatesDisponibles.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 flex-1 min-h-0">
          {COLUMNAS.map((col) => {
            const items = byEstado(col.id);
            const Icon = col.icon;
            return (
              <div
                key={col.id}
                id={col.id}
                className="flex flex-col rounded-xl border border-border/50 bg-secondary/20 backdrop-blur-sm overflow-hidden min-h-[300px]"
              >
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-card/40">
                  <Icon className={`w-4 h-4 ${col.color}`} />
                  <span className="font-semibold text-sm">{col.label}</span>
                  <span className="ml-auto text-xs font-medium text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
                    {items.length}
                  </span>
                </div>

                {/* Body */}
                <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                  <SortableContext
                    id={col.id}
                    items={items.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {items.map((envio) => (
                      <KanbanCard key={envio.id} envio={envio} />
                    ))}
                  </SortableContext>

                  {items.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-24 border border-dashed border-border/30 rounded-lg text-xs text-muted-foreground bg-card/30">
                      Sin formularios
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeEnvio && (
            <div className="rotate-2 scale-105 shadow-2xl shadow-black/40">
              <KanbanCard envio={activeEnvio} isDragging />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
