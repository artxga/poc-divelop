"use client";

import Link from "next/link";
import { 
  PROJECTS, 
  FORM_TEMPLATES, 
  FORM_SUBMISSIONS, 
  FORM_STATUS_CONFIG
} from "@/features/shared/api/mock-db";
import { useAuth } from "@/features/auth/api/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, FolderOpen } from "lucide-react";

export function MyFormsPage() {
  const { user } = useAuth();
  
  if (!user) return null;

  // Solo mostrar los envíos asignados a este usuario
  const mySubmissions = FORM_SUBMISSIONS.filter((f) => f.userEmail === user.email);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mis Formularios</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Formularios que tienes asignados para responder o revisar
        </p>
      </div>

      <div className="grid gap-4">
        {mySubmissions.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border/50 rounded-xl bg-card/30">
            <p className="text-muted-foreground">No tienes formularios asignados en este momento.</p>
          </div>
        ) : (
          mySubmissions.map((submission) => {
            const project = PROJECTS.find(p => p.id === submission.projectId);
            const template = FORM_TEMPLATES.find(t => t.id === submission.templateId);
            const statusCfg = FORM_STATUS_CONFIG[submission.status as keyof typeof FORM_STATUS_CONFIG];
            
            return (
              <Link key={submission.id} href={`/forms/${submission.id}`} className="block group">
                <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5">
                  <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                      <FileText className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h2 className="font-semibold text-base truncate">{template?.name}</h2>
                        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${statusCfg?.color}`}>
                          {statusCfg?.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <FolderOpen className="w-4 h-4" />
                        Proyecto: <span className="font-medium text-foreground">{project?.name}</span>
                      </p>
                    </div>
                    <div className="w-full sm:w-48 shrink-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-muted-foreground">Progreso de llenado</span>
                        <span className={`text-xs font-semibold ${submission.progress >= 80 ? "text-emerald-400" : submission.progress >= 50 ? "text-amber-400" : "text-red-400"}`}>
                          {submission.progress}%
                        </span>
                      </div>
                      <Progress value={submission.progress} className="h-2 bg-secondary" />
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
