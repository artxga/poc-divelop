"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PROJECTS, FORM_TEMPLATES, FORM_SUBMISSIONS, USERS } from "@/app/_lib/mock-data";
import { useAuth } from "@/app/_lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, FolderOpen, Plus, Users, ChevronRight } from "lucide-react";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  
  const project = PROJECTS.find((p) => p.id === id);
  if (!project) notFound();
  if (!user) return null;

  const isAdminOrConsultor = user.role === "admin" || user.role === "consultor";
  
  // Encontrar qué templates tienen envíos para el proyecto actual
  const projectSubmissions = FORM_SUBMISSIONS.filter(f => f.projectId === id);
  const projectTemplates = FORM_TEMPLATES.filter(t => t.projectId === id);

  const filteredTemplates = projectTemplates.filter((template) => {
    if (isAdminOrConsultor) return true;
    // Si es cliente, solo ve el template si tiene al menos un envío asignado a su correo en este template
    return projectSubmissions.some(e => e.templateId === template.id && e.userEmail === user.email);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/projects" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Proyectos
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium truncate">{project.name}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Formularios del Proyecto</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Selecciona un formulario para ver los usuarios asignados
          </p>
        </div>
        {isAdminOrConsultor && (
          <Button asChild className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
            <Link href={`/projects/${id}/forms/create`}>
              <Plus className="w-4 h-4" /> Nuevo Formulario
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full p-8 text-center border border-dashed border-border/50 rounded-xl bg-card/30">
            <p className="text-muted-foreground">No hay formularios creados o asignados para este proyecto.</p>
          </div>
        ) : (
          filteredTemplates.map((template) => {
            const templateSubmissions = projectSubmissions.filter(e => e.templateId === template.id);
            const visibleSubmissions = isAdminOrConsultor 
              ? templateSubmissions 
              : templateSubmissions.filter(e => e.userEmail === user.email);
              
            const approved = visibleSubmissions.filter(e => e.status === "aprobado").length;
            const avgProgress = visibleSubmissions.length > 0
              ? Math.round(visibleSubmissions.reduce((acc, e) => acc + e.progress, 0) / visibleSubmissions.length)
              : 0;

            return (
              <Link key={template.id} href={`/projects/${project.id}/forms/${template.id}`} className="block group">
                <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5 h-full">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                        <FolderOpen className="w-5 h-5 text-emerald-400" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-base mb-1.5 truncate">{template.name}</h2>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="text-xs px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-medium">
                          {template.indicators.length} indicadores
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-4">
                        <Users className="w-3.5 h-3.5" />
                        {visibleSubmissions.length} {visibleSubmissions.length === 1 ? 'instancia asignada' : 'instancias asignadas'}
                      </p>
                    </div>
                    
                    <div className="w-full mt-auto pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-muted-foreground">
                          {approved} de {visibleSubmissions.length} aprobados
                        </span>
                        <span className={`text-xs font-semibold ${avgProgress >= 80 ? "text-emerald-400" : avgProgress >= 50 ? "text-amber-400" : "text-red-400"}`}>
                          {avgProgress}% promedio
                        </span>
                      </div>
                      <Progress value={avgProgress} className="h-2 bg-secondary" />
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
