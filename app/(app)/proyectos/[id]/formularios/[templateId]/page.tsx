"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  PROYECTOS, 
  FORMULARIO_TEMPLATES, 
  FORMULARIOS_ENVIADOS, 
  ESTADO_FORM_CONFIG, 
  USUARIOS 
} from "@/app/_lib/mock-data";
import { useAuth } from "@/app/_lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, FileText, User } from "lucide-react";

export default function TemplateInstancesPage({ params }: { params: Promise<{ id: string, templateId: string }> }) {
  const { id, templateId } = use(params);
  const { user } = useAuth();
  
  const proyecto = PROYECTOS.find((p) => p.id === id);
  const template = FORMULARIO_TEMPLATES.find((t) => t.id === templateId);

  if (!proyecto || !template) notFound();
  if (!user) return null;

  const isAdminOrConsultor = user.rol === "admin" || user.rol === "consultor";
  
  // Envíos específicos para este template y proyecto
  const envios = FORMULARIOS_ENVIADOS.filter((f) => {
    if (f.proyectoId !== id || f.templateId !== templateId) return false;
    if (isAdminOrConsultor) return true;
    return f.usuarioEmail === user.email; // Clientes solo ven los suyos
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Link href={`/proyectos/${proyecto.id}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Formularios de {proyecto.nombre}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium truncate">{template.nombre}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Envíos de Formulario</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Selecciona un formulario asignado para responder o revisar
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {envios.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border/50 rounded-xl bg-card/30">
            <p className="text-muted-foreground">No hay formularios asignados o enviados para este template.</p>
          </div>
        ) : (
          envios.map((envio) => {
            const estadoCfg = ESTADO_FORM_CONFIG[envio.estado];
            const userAsignado = USUARIOS.find(u => u.email === envio.usuarioEmail);
            
            return (
              <Link key={envio.id} href={`/formularios/${envio.id}`} className="block group">
                <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5">
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                      <FileText className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h2 className="font-semibold text-base truncate">{template.nombre}</h2>
                        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${estadoCfg.color}`}>
                          {estadoCfg.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        Asignado a: <span className="font-medium text-foreground">{userAsignado?.nombre || envio.usuarioEmail}</span>
                      </p>
                    </div>
                    <div className="w-full sm:w-48 shrink-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-muted-foreground">Progreso de llenado</span>
                        <span className={`text-xs font-semibold ${envio.progreso >= 80 ? "text-emerald-400" : envio.progreso >= 50 ? "text-amber-400" : "text-red-400"}`}>
                          {envio.progreso}%
                        </span>
                      </div>
                      <Progress value={envio.progreso} className="h-2 bg-secondary" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
