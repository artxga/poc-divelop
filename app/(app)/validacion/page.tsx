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
  FORMULARIOS,
  PROYECTOS,
  ESTADO_FORM_CONFIG,
  type Formulario,
  type FormEstado,
} from "@/app/_lib/mock-data";
import {
  GripVertical,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Clock,
  FileText,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const COLUMNAS: { id: FormEstado; label: string; icon: React.ElementType; color: string }[] = [
  { id: "borrador", label: "Borrador", icon: Circle, color: "text-slate-400" },
  { id: "enviado", label: "Enviado a Revisión", icon: Clock, color: "text-blue-400" },
  { id: "observado", label: "Observado", icon: AlertTriangle, color: "text-amber-400" },
  { id: "aprobado", label: "Aprobado", icon: CheckCircle2, color: "text-emerald-400" },
];

interface KanbanCardProps {
  formulario: Formulario;
  isDragging?: boolean;
}

function KanbanCard({ formulario, isDragging }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: formulario.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const proyecto = PROYECTOS.find((p) => p.id === formulario.proyectoId);

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
            <span className="font-medium text-xs truncate">{formulario.nombre}</span>
          </div>
          
          <p className="text-xs text-muted-foreground truncate mb-2">{proyecto?.nombre}</p>

          <div className="flex flex-col gap-1.5 mt-2 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-3 h-3" />
              <span className="truncate">{formulario.asignados.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={cn("h-full", formulario.progreso >= 80 ? "bg-emerald-500" : formulario.progreso >= 50 ? "bg-amber-500" : "bg-red-500")} 
                  style={{ width: `${formulario.progreso}%` }} 
                />
              </div>
              <span className="text-[10px] font-medium">{formulario.progreso}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ValidacionPage() {
  const [formularios, setFormularios] = useState<Formulario[]>(FORMULARIOS);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const byEstado = (estado: FormEstado) =>
    formularios.filter((f) => f.estado === estado);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) { setActiveId(null); return; }

    const activeForm = formularios.find((f) => f.id === active.id);
    if (!activeForm) { setActiveId(null); return; }

    const targetColId = COLUMNAS.find((c) => c.id === over.id)?.id;
    if (targetColId) {
      setFormularios((prev) =>
        prev.map((f) => f.id === active.id ? { ...f, estado: targetColId } : f)
      );
    } else {
      const targetForm = formularios.find((f) => f.id === over.id);
      if (targetForm && targetForm.estado !== activeForm.estado) {
        setFormularios((prev) =>
          prev.map((f) => f.id === active.id ? { ...f, estado: targetForm.estado } : f)
        );
      }
    }
    setActiveId(null);
  }

  const activeForm = formularios.find((f) => f.id === activeId);

  return (
    <div className="space-y-5 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Flujo de Validación</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Arrastra los formularios completos entre columnas para cambiar su estado
        </p>
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
                    {items.map((form) => (
                      <KanbanCard key={form.id} formulario={form} />
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
          {activeForm && (
            <div className="rotate-2 scale-105 shadow-2xl shadow-black/40">
              <KanbanCard formulario={activeForm} isDragging />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
