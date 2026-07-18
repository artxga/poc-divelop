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
  RESPUESTAS,
  INDICADORES,
  PROYECTOS,
  ESTADO_CONFIG,
  CATEGORIA_CONFIG,
  type RespuestaIndicador,
  type RespuestaEstado,
} from "@/app/_lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  GripVertical,
  Send,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const COLUMNAS: { id: RespuestaEstado; label: string; icon: React.ElementType; color: string }[] = [
  { id: "borrador", label: "Borrador", icon: Circle, color: "text-slate-400" },
  { id: "enviado", label: "Enviado", icon: Clock, color: "text-blue-400" },
  { id: "observado", label: "Observado", icon: AlertTriangle, color: "text-amber-400" },
  { id: "aprobado", label: "Aprobado", icon: CheckCircle2, color: "text-emerald-400" },
];

function getIndicador(id: string) {
  return INDICADORES.find((i) => i.id === id);
}
function getProyecto(id: string) {
  return PROYECTOS.find((p) => p.id === id);
}

interface KanbanCardProps {
  respuesta: RespuestaIndicador;
  isDragging?: boolean;
}

function KanbanCard({ respuesta, isDragging }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: respuesta.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const indicador = getIndicador(respuesta.indicadorId);
  const proyecto = getProyecto(respuesta.proyectoId);
  const catCfg = indicador ? CATEGORIA_CONFIG[indicador.categoria] : null;
  const [showCmt, setShowCmt] = useState(false);

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
          <div className="flex items-start gap-1.5 mb-1.5">
            <span className="font-mono text-xs text-muted-foreground shrink-0">
              {indicador?.codigo}
            </span>
          </div>
          <p className="text-xs font-medium leading-snug line-clamp-2">{indicador?.nombre}</p>
          {catCfg && (
            <div className={`flex items-center gap-1 mt-1.5 text-xs ${catCfg.color}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${catCfg.dot}`} />
              {indicador?.categoria}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1 truncate">{proyecto?.nombre}</p>

          {/* Comments */}
          {respuesta.comentarios.length > 0 && (
            <button
              className="flex items-center gap-1 mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowCmt(!showCmt)}
            >
              <MessageSquare className="w-3 h-3" />
              {respuesta.comentarios.length} comentario{respuesta.comentarios.length > 1 ? "s" : ""}
            </button>
          )}
          {showCmt && (
            <div className="mt-2 space-y-1.5">
              {respuesta.comentarios.map((c) => (
                <div key={c.id} className={`text-xs p-2 rounded-lg ${c.rol === "consultor" ? "bg-blue-500/10 border border-blue-500/20" : "bg-secondary/50"}`}>
                  <p className="font-semibold">{c.autor}</p>
                  <p className="text-muted-foreground">{c.texto}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ValidacionPage() {
  const [respuestas, setRespuestas] = useState<RespuestaIndicador[]>(RESPUESTAS);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const byEstado = (estado: RespuestaEstado) =>
    respuestas.filter((r) => r.estado === estado);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) { setActiveId(null); return; }

    const activeResp = respuestas.find((r) => r.id === active.id);
    if (!activeResp) { setActiveId(null); return; }

    // Detect if dropped over a column header
    const targetColId = COLUMNAS.find((c) => c.id === over.id)?.id;
    if (targetColId) {
      setRespuestas((prev) =>
        prev.map((r) => r.id === active.id ? { ...r, estado: targetColId } : r)
      );
    } else {
      // Dropped over another card — find its column
      const targetResp = respuestas.find((r) => r.id === over.id);
      if (targetResp && targetResp.estado !== activeResp.estado) {
        setRespuestas((prev) =>
          prev.map((r) => r.id === active.id ? { ...r, estado: targetResp.estado } : r)
        );
      }
    }
    setActiveId(null);
  }

  const activeResp = respuestas.find((r) => r.id === activeId);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Flujo de Validación</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Arrastra los indicadores entre columnas para cambiar su estado
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        {COLUMNAS.map((col) => {
          const count = byEstado(col.id).length;
          const cfg = ESTADO_CONFIG[col.id];
          return (
            <div key={col.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${cfg.color}`}>
              <col.icon className="w-3.5 h-3.5" />
              {cfg.label}: {count}
            </div>
          );
        })}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUMNAS.map((col) => {
            const items = byEstado(col.id);
            const Icon = col.icon;
            const cfg = ESTADO_CONFIG[col.id];
            return (
              <div
                key={col.id}
                id={col.id}
                className="flex flex-col rounded-xl border border-border/50 bg-secondary/20 backdrop-blur-sm overflow-hidden"
              >
                {/* Column header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
                  <Icon className={`w-4 h-4 ${col.color}`} />
                  <span className="font-semibold text-sm">{col.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
                    {items.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 p-3 space-y-2 min-h-[200px]">
                  <SortableContext
                    id={col.id}
                    items={items.map((r) => r.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {items.map((resp) => (
                      <KanbanCard key={resp.id} respuesta={resp} />
                    ))}
                  </SortableContext>

                  {items.length === 0 && (
                    <div className="flex items-center justify-center h-20 border border-dashed border-border/30 rounded-lg text-xs text-muted-foreground">
                      Sin indicadores
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeResp && (
            <div className="rotate-2 scale-105 shadow-2xl shadow-black/40">
              <KanbanCard respuesta={activeResp} isDragging />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
