import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, Briefcase, Calendar } from "lucide-react";
import type { Project, ProjectStatus } from "@/features/projects/model/types";
import { CLIENTS, FORM_SUBMISSIONS } from "@/features/shared/api/mock-db";
import type { User } from "@/features/auth/model/types";

const STATUS_CONFIG: Record<ProjectStatus, { label: string; class: string }> = {
  activo: { label: "Activo", class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  pausado: { label: "Pausado", class: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  completado: { label: "Completado", class: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
};

interface ProjectCardProps {
  project: Project;
  user: User;
}

export function ProjectCard({ project, user }: ProjectCardProps) {
  const statusCfg = STATUS_CONFIG[project.status];
  const client = CLIENTS.find((c) => c.id === project.clientId);
  
  const projectSubmissions = FORM_SUBMISSIONS.filter(f => f.projectId === project.id);
  const mySubmissions = (user.role === "cliente" || user.role === "usuario_cliente") 
    ? projectSubmissions.filter(f => f.userEmail === user.email)
    : projectSubmissions;

  // Si el cliente no tiene envíos asignados en este proyecto, y no es admin, no renderizamos
  if ((user.role === "cliente" || user.role === "usuario_cliente") && mySubmissions.length === 0) {
    return null;
  }

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5 h-full">
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
              <FolderOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${statusCfg.class}`}>
              {statusCfg.label}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-base mb-1 line-clamp-2">{project.name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              <span className="truncate">{client?.name}</span>
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {project.startDate}
            </span>
            <span className="font-medium text-emerald-400">
              {mySubmissions.length} Formularios
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
