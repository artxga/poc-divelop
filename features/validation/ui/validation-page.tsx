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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  FORM_SUBMISSIONS,
  FORM_TEMPLATES,
  PROJECTS,
} from "@/features/shared/api/mock-db";
import type { FormSubmission, FormStatus } from "@/features/forms/model/types";
import { KanbanCard } from "./kanban-card";
import {
  Circle,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const COLUMNS: { id: FormStatus; label: string; icon: React.ElementType; color: string }[] = [
  { id: "borrador", label: "Borrador", icon: Circle, color: "text-slate-400" },
  { id: "enviado", label: "Enviado a Revisión", icon: Clock, color: "text-blue-400" },
  { id: "observado", label: "Observado", icon: AlertTriangle, color: "text-amber-400" },
  { id: "aprobado", label: "Aprobado", icon: CheckCircle2, color: "text-emerald-400" },
];

export function ValidationPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>(FORM_SUBMISSIONS);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Filtros
  const [projectFilter, setProjectFilter] = useState<string>("todos");
  const [templateFilter, setTemplateFilter] = useState<string>("todos");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const filteredSubmissions = submissions.filter((e) => {
    if (projectFilter !== "todos" && e.projectId !== projectFilter) return false;
    if (templateFilter !== "todos" && e.templateId !== templateFilter) return false;
    return true;
  });

  const byStatus = (status: FormStatus) =>
    filteredSubmissions.filter((e) => e.status === status);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) { setActiveId(null); return; }

    const activeSubmission = submissions.find((e) => e.id === active.id);
    if (!activeSubmission) { setActiveId(null); return; }

    const targetColId = COLUMNS.find((c) => c.id === over.id)?.id;
    if (targetColId) {
      setSubmissions((prev) =>
        prev.map((e) => e.id === active.id ? { ...e, status: targetColId } : e)
      );
    } else {
      const targetSubmission = submissions.find((e) => e.id === over.id);
      if (targetSubmission && targetSubmission.status !== activeSubmission.status) {
        setSubmissions((prev) =>
          prev.map((e) => e.id === active.id ? { ...e, status: targetSubmission.status } : e)
        );
      }
    }
    setActiveId(null);
  }

  const activeSubmission = submissions.find((e) => e.id === activeId);

  // Derivar templates disponibles según proyecto seleccionado
  const availableTemplates = FORM_TEMPLATES.filter(
    (t) => projectFilter === "todos" || t.projectId === projectFilter
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
          <Select value={projectFilter} onValueChange={(val) => { setProjectFilter(val); setTemplateFilter("todos"); }}>
            <SelectTrigger className="w-[200px] h-8 text-xs border-transparent bg-secondary/50">
              <SelectValue placeholder="Proyecto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los proyectos</SelectItem>
              {PROJECTS.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={templateFilter} onValueChange={setTemplateFilter}>
            <SelectTrigger className="w-[200px] h-8 text-xs border-transparent bg-secondary/50">
              <SelectValue placeholder="Formulario (Plantilla)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los formularios</SelectItem>
              {availableTemplates.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
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
          {COLUMNS.map((col) => {
            const items = byStatus(col.id);
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
                    {items.map((submission) => (
                      <KanbanCard key={submission.id} submission={submission} />
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
          {activeSubmission && (
            <div className="rotate-2 scale-105 shadow-2xl shadow-black/40">
              <KanbanCard submission={activeSubmission} isDragging />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
