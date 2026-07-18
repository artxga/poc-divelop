import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, ChevronRight, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { FormTemplate, FormSubmission } from "@/features/forms/model/types";
import type { User } from "@/features/auth/model/types";

interface TemplateCardProps {
  template: FormTemplate;
  projectId: string;
  submissions: FormSubmission[];
  user: User;
  isAdminOrConsultor: boolean;
}

export function TemplateCard({ template, projectId, submissions, user, isAdminOrConsultor }: TemplateCardProps) {
  const visibleSubmissions = isAdminOrConsultor 
    ? submissions 
    : submissions.filter(e => e.userEmail === user.email);
    
  const approved = visibleSubmissions.filter(e => e.status === "aprobado").length;
  const avgProgress = visibleSubmissions.length > 0
    ? Math.round(visibleSubmissions.reduce((acc, e) => acc + e.progress, 0) / visibleSubmissions.length)
    : 0;

  return (
    <Link href={`/projects/${projectId}/forms/${template.id}`} className="block group">
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
}
