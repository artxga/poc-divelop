"use client";

import { useState } from "react";
import { PROJECTS } from "@/features/shared/api/mock-db";
import { useAuth } from "@/features/auth/api/auth-context";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import { ProjectCard } from "./project-card";
import { CreateProjectModal } from "./create-project-modal";

export function ProjectsPage() {
  const { user } = useAuth();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    clientId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  if (!user) return null;

  const handleSave = () => {
    // In a real app this would save to backend
    alert("Proyecto creado con éxito");
    setModalOpen(false);
  };

  // Filtrar proyectos según el rol
  const filteredProjects = PROJECTS.filter((p) => {
    if (user.role === "admin" || user.role === "consultor") return true;
    return p.clientId === user.clientId;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proyectos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Selecciona un proyecto para gestionar sus formularios y respuestas
          </p>
        </div>
        {(user.role === "admin" || user.role === "consultor") && (
          <Button onClick={() => setModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
            <FolderOpen className="w-4 h-4" /> Nuevo Proyecto
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((p) => (
          <ProjectCard key={p.id} project={p} user={user} />
        ))}
      </div>

      <CreateProjectModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        form={form} 
        onFormChange={setForm} 
        onSave={handleSave} 
      />
    </div>
  );
}
