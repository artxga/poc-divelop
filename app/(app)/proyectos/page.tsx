import Link from "next/link";
import { PROYECTOS, ESTANDAR_CONFIG } from "@/app/_lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FolderOpen, ChevronRight, Calendar, User } from "lucide-react";

const ESTADO = {
  activo: { label: "Activo", class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  pausado: { label: "Pausado", class: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  completado: { label: "Completado", class: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
};

export default function ProyectosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Proyectos</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Selecciona un proyecto para registrar o revisar sus indicadores ESG
        </p>
      </div>

      <div className="grid gap-4">
        {PROYECTOS.map((p) => {
          const estadoCfg = ESTADO[p.estado];
          return (
            <Link key={p.id} href={`/proyectos/${p.id}`} className="block group">
              <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                      <FolderOpen className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-semibold text-sm truncate">{p.nombre}</h2>
                        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${estadoCfg.class}`}>
                          {estadoCfg.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {p.cliente}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {p.fechaInicio} → {p.fechaFin}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {p.estandares.map((est) => {
                          const cfg = ESTANDAR_CONFIG[est];
                          return (
                            <span key={est} className={`text-xs px-2 py-0.5 rounded-full border ${cfg.border} ${cfg.bg} ${cfg.color} font-medium`}>
                              {est}
                            </span>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={p.progreso} className="flex-1 h-1.5 bg-secondary" />
                        <span className={`text-xs font-semibold shrink-0 ${p.progreso >= 80 ? "text-emerald-400" : p.progreso >= 50 ? "text-amber-400" : "text-red-400"}`}>
                          {p.progreso}%
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-400 transition-colors shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
