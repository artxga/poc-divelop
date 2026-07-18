"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PROJECTS, FORM_TEMPLATES, FORM_SUBMISSIONS } from "@/features/shared/api/mock-db";
import { useAuth } from "@/features/auth/api/auth-context";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import { TemplateCard } from "./template-card";

export function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
            return (
              <TemplateCard 
                key={template.id} 
                template={template} 
                projectId={project.id} 
                submissions={templateSubmissions} 
                user={user} 
                isAdminOrConsultor={isAdminOrConsultor} 
              />
            );
          })
        )}
      </div>
    </div>
  );
}
