"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PROYECTOS, FORMULARIOS, ESTADO_FORM_CONFIG, ESTANDAR_CONFIG, USUARIOS } from "@/app/_lib/mock-data";
import { useAuth } from "@/app/_lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, FileText, Plus, Users } from "lucide-react";

export default function ProyectoDetailPage({ params }: PageProps<"/proyectos/[id]">) {
  const { id } = use(params);
  const { user } = useAuth();
  
  const proyecto = PROYECTOS.find((p) => p.id === id);
  if (!proyecto) notFound();
  if (!user) return null;

  const isAdminOrConsultor = user.rol === "admin" || user.rol === "consultor";
  
  const formsFiltrados = FORMULARIOS.filter((f) => {
    if (f.proyectoId !== id) return false;
    if (isAdminOrConsultor) return true;
    return f.asignados.includes(user.email);
  });

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/proyectos" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Proyectos
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium truncate">{proyecto.nombre}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Formularios del Proyecto</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Selecciona un formulario para responder o revisar los indicadores
          </p>
        </div>
        {isAdminOrConsultor && (
          <Button onClick={() => setModalOpen(true)} className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
            <Plus className="w-4 h-4" /> Nuevo Formulario
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {formsFiltrados.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border/50 rounded-xl bg-card/30">
            <p className="text-muted-foreground">No hay formularios asignados o creados para este proyecto.</p>
          </div>
        ) : (
          formsFiltrados.map((form) => {
            const estadoCfg = ESTADO_FORM_CONFIG[form.estado];
            return (
              <Link key={form.id} href={`/formularios/${form.id}`} className="block group">
                <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5">
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                      <FileText className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h2 className="font-semibold text-base truncate">{form.nombre}</h2>
                        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${estadoCfg.color}`}>
                          {estadoCfg.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {form.estandares.map((est) => {
                          const cfg = ESTANDAR_CONFIG[est as keyof typeof ESTANDAR_CONFIG];
                          return (
                            <span key={est} className={`text-xs px-2 py-0.5 rounded-full border ${cfg.border} ${cfg.bg} ${cfg.color} font-medium`}>
                              {est}
                            </span>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {form.asignados.join(", ")}
                      </p>
                    </div>
                    <div className="w-full sm:w-48 shrink-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-muted-foreground">Progreso de llenado</span>
                        <span className={`text-xs font-semibold ${form.progreso >= 80 ? "text-emerald-400" : form.progreso >= 50 ? "text-amber-400" : "text-red-400"}`}>
                          {form.progreso}%
                        </span>
                      </div>
                      <Progress value={form.progreso} className="h-2 bg-secondary" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md bg-card border-border/50">
          <DialogHeader>
            <DialogTitle>Nuevo Formulario</DialogTitle>
            <DialogDescription>
              Crea un formulario y asígnalo a los usuarios del cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Nombre del Formulario</Label>
              <Input placeholder="Ej: Métricas Hídricas..." />
            </div>
            <div className="space-y-1.5">
              <Label>Estándares a incluir</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {["GRI", "SASB", "ODS", "TCFD"].map((est) => (
                  <label key={est} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox /> <span className="text-sm">{est}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Usuarios Asignados</Label>
              <div className="space-y-2 mt-2 border border-border/50 rounded-lg p-3 bg-secondary/20">
                {USUARIOS.filter(u => u.clienteId === proyecto.clienteId).map(u => (
                  <label key={u.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox /> 
                    <div className="flex flex-col">
                      <span className="text-sm">{u.nombre}</span>
                      <span className="text-xs text-muted-foreground">{u.email}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white" onClick={() => setModalOpen(false)}>
              Crear Formulario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
