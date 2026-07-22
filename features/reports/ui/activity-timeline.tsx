"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, UserPlus, Send, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type: "asignacion" | "envio" | "aprobacion" | "observacion";
  title: string;
  detail: string;
  date: string;
  actor: string;
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
}

const EVENT_CONFIG = {
  asignacion: {
    icon: UserPlus,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
    ring: "ring-blue-500/20",
    dot: "bg-blue-400",
  },
  envio: {
    icon: Send,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    ring: "ring-amber-500/20",
    dot: "bg-amber-400",
  },
  aprobacion: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    ring: "ring-emerald-500/20",
    dot: "bg-emerald-400",
  },
  observacion: {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/15",
    border: "border-red-500/30",
    ring: "ring-red-500/20",
    dot: "bg-red-400",
  },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" });
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  // Group events by month
  const grouped = events.reduce<Record<string, TimelineEvent[]>>((acc, ev) => {
    const month = new Date(ev.date + "T00:00:00").toLocaleDateString("es-PE", { month: "long", year: "numeric" });
    if (!acc[month]) acc[month] = [];
    acc[month].push(ev);
    return acc;
  }, {});

  return (
    <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          <CardTitle className="text-base">Línea de Tiempo de Actividad</CardTitle>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Registro cronológico de asignaciones, envíos, aprobaciones y observaciones del proyecto.
        </p>
      </CardHeader>
      <CardContent className="pt-5">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No hay eventos registrados.</p>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([month, monthEvents]) => (
              <div key={month}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 pl-10">
                  {month}
                </p>
                <div className="space-y-0">
                  {monthEvents.map((ev, i) => {
                    const cfg = EVENT_CONFIG[ev.type];
                    const Icon = cfg.icon;
                    const isLast = i === monthEvents.length - 1;
                    return (
                      <div key={ev.id} className="relative flex gap-4">
                        {/* Vertical line */}
                        {!isLast && (
                          <div className="absolute left-[19px] top-10 bottom-0 w-px bg-border/40" />
                        )}
                        {/* Icon */}
                        <div className={cn("relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ring-4 border", cfg.bg, cfg.border, cfg.ring)}>
                          <Icon className={cn("w-4 h-4", cfg.color)} />
                        </div>
                        {/* Content */}
                        <div className="flex-1 pb-6 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <p className="text-sm font-semibold text-foreground">{ev.title}</p>
                            <time className="text-xs text-muted-foreground shrink-0">{formatDate(ev.date)}</time>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{ev.detail}</p>
                          <p className="text-[10px] text-muted-foreground/70 mt-1">Por: {ev.actor}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
