"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PROYECTOS, FORMULARIO_TEMPLATES, FORMULARIOS_ENVIADOS, ESTANDAR_CONFIG, USUARIOS } from "@/app/_lib/mock-data";
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
import { ChevronLeft, FolderOpen, Plus, Users, ChevronRight } from "lucide-react";

export default function ProyectoDetailPage({ params }: PageProps<"/proyectos/[id]">) {
  const { id } = use(params);
  const { user } = useAuth();
  
  const proyecto = PROYECTOS.find((p) => p.id === id);
  if (!proyecto) notFound();
  if (!user) return null;

  const isAdminOrConsultor = user.rol === "admin" || user.rol === "consultor";
  
  // Encontrar qué templates tienen envíos para el proyecto actual
  const enviosDelProyecto = FORMULARIOS_ENVIADOS.filter(f => f.proyectoId === id);
  const templatesDelProyecto = FORMULARIO_TEMPLATES.filter(t => t.proyectoId === id);

  const templatesFiltrados = templatesDelProyecto.filter((template) => {
    if (isAdminOrConsultor) return true;
    // Si es cliente, solo ve el template si tiene al menos un envío asignado a su correo en este template
    return enviosDelProyecto.some(e => e.templateId === template.id && e.usuarioEmail === user.email);
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
            Selecciona un formulario para ver los usuarios asignados
          </p>
        </div>
        {isAdminOrConsultor && (
          <Button onClick={() => setModalOpen(true)} className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
            <Plus className="w-4 h-4" /> Nuevo Formulario
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {templatesFiltrados.length === 0 ? (
          <div className="col-span-full p-8 text-center border border-dashed border-border/50 rounded-xl bg-card/30">
            <p className="text-muted-foreground">No hay formularios creados o asignados para este proyecto.</p>
          </div>
        ) : (
          templatesFiltrados.map((template) => {
            const enviosDeEsteTemplate = enviosDelProyecto.filter(e => e.templateId === template.id);
            const enviosVisibles = isAdminOrConsultor 
              ? enviosDeEsteTemplate 
              : enviosDeEsteTemplate.filter(e => e.usuarioEmail === user.email);
              
            const aprobados = enviosVisibles.filter(e => e.estado === "aprobado").length;
            const progresoPromedio = enviosVisibles.length > 0
              ? Math.round(enviosVisibles.reduce((acc, e) => acc + e.progreso, 0) / enviosVisibles.length)
              : 0;

            return (
              <Link key={template.id} href={`/proyectos/${proyecto.id}/formularios/${template.id}`} className="block group">
                <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5 h-full">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                        <FolderOpen className="w-5 h-5 text-emerald-400" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-base mb-1.5 truncate">{template.nombre}</h2>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {template.estandares.map((est) => {
                          const cfg = ESTANDAR_CONFIG[est as keyof typeof ESTANDAR_CONFIG];
                          return (
                            <span key={est} className={`text-xs px-2 py-0.5 rounded-full border ${cfg.border} ${cfg.bg} ${cfg.color} font-medium`}>
                              {est}
                            </span>
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-4">
                        <Users className="w-3.5 h-3.5" />
                        {enviosVisibles.length} {enviosVisibles.length === 1 ? 'instancia asignada' : 'instancias asignadas'}
                      </p>
                    </div>
                    
                    <div className="w-full mt-auto pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-muted-foreground">
                          {aprobados} de {enviosVisibles.length} aprobados
                        </span>
                        <span className={`text-xs font-semibold ${progresoPromedio >= 80 ? "text-emerald-400" : progresoPromedio >= 50 ? "text-amber-400" : "text-red-400"}`}>
                          {progresoPromedio}% promedio
                        </span>
                      </div>
                      <Progress value={progresoPromedio} className="h-2 bg-secondary" />
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
              Crea un formulario base y se generará una instancia para cada usuario seleccionado.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Nombre del Formulario (Plantilla)</Label>
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
              <Label>Usuarios a Enviar</Label>
              <div className="space-y-2 mt-2 border border-border/50 rounded-lg p-3 bg-secondary/20 max-h-[150px] overflow-y-auto">
                {USUARIOS.filter(u => u.clienteId === proyecto.clienteId).map(u => (
                  <label key={u.id} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-secondary/40 rounded">
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
              Crear y Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
