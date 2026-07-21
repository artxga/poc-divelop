"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  PROJECTS, 
  FORM_TEMPLATES, 
  FORM_SUBMISSIONS, 
  FORM_STATUS_CONFIG, 
  USERS,
  HISTORY
} from "@/features/shared/api/mock-db";
import { useAuth } from "@/features/auth/api/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  FileText, 
  User, 
  LayoutDashboard, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  History,
  Activity
} from "lucide-react";
import type { FormStatus } from "@/features/forms/model/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export function TemplateInstancesPage({ params }: { params: Promise<{ id: string, templateId: string }> }) {
  const { id, templateId } = use(params);
  const { user } = useAuth();
  
  const project = PROJECTS.find((p) => p.id === id);
  const template = FORM_TEMPLATES.find((t) => t.id === templateId);

  if (!project || !template) notFound();
  if (!user) return null;

  const isLeader = user.role === "admin" || user.role === "consultor" || user.role === "cliente";
  
  // Envíos específicos para este template y proyecto
  const submissions = FORM_SUBMISSIONS.filter((f) => {
    if (f.projectId !== id || f.templateId !== templateId) return false;
    if (isLeader) return true;
    return f.userEmail === user.email; // Usuario Cliente solo ve los suyos
  });

  // KPI Calculations
  const totalSubmissions = submissions.length;
  const approved = submissions.filter((s) => s.status === "aprobado").length;
  const pending = submissions.filter((s) => s.status === "enviado").length;
  const observed = submissions.filter((s) => s.status === "observado").length;
  const draft = submissions.filter((s) => s.status === "borrador").length;

  const averageProgress = totalSubmissions > 0 
    ? Math.round(submissions.reduce((acc, curr) => acc + curr.progress, 0) / totalSubmissions) 
    : 0;

  // Chart Data
  const chartData = [
    { name: "Borrador", value: draft, color: "#64748b" },
    { name: "En Revisión", value: pending, color: "#3b82f6" },
    { name: "Observado", value: observed, color: "#f59e0b" },
    { name: "Aprobado", value: approved, color: "#10b981" },
  ];

  // Traceability History
  const templateHistory = HISTORY.filter(h => 
    submissions.some(s => s.id === h.submissionId)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Link href={`/projects/${project.id}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Formularios de {project.name}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium truncate">{template.name}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{template.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Vista detallada del formulario y progreso de recolección
          </p>
        </div>
      </div>

      <Tabs defaultValue={isLeader ? "dashboard" : "instances"} className="w-full">
        <TabsList className="mb-4">
          {isLeader && (
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
          )}
          <TabsTrigger value="instances" className="gap-2">
            <Users className="w-4 h-4" />
            Usuarios Asignados
          </TabsTrigger>
        </TabsList>

        {isLeader && (
          <TabsContent value="dashboard" className="space-y-4">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardContent className="p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Aprobados</span>
                  </div>
                  <span className="text-2xl font-bold">{approved}</span>
                  <span className="text-xs text-muted-foreground">de {totalSubmissions} envíos</span>
                </CardContent>
              </Card>
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardContent className="p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">En Revisión</span>
                  </div>
                  <span className="text-2xl font-bold">{pending}</span>
                  <span className="text-xs text-muted-foreground">Esperando validación</span>
                </CardContent>
              </Card>
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardContent className="p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-amber-400 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Observados</span>
                  </div>
                  <span className="text-2xl font-bold">{observed}</span>
                  <span className="text-xs text-muted-foreground">Requieren atención</span>
                </CardContent>
              </Card>
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardContent className="p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-purple-400 mb-2">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm font-medium">Progreso Global</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">{averageProgress}%</span>
                  </div>
                  <Progress value={averageProgress} className="h-1.5 mt-2 bg-secondary" />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Chart */}
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                    Distribución de Estados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ background: "hsl(222 47% 14%)", border: "1px solid hsl(217 33% 22%)", borderRadius: "8px", fontSize: 12 }}
                          cursor={{ fill: "rgba(255,255,255,0.05)" }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* History */}
              <Card className="bg-card/60 backdrop-blur-sm border-border/50 flex flex-col">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-400" />
                    Trazabilidad Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {templateHistory.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No hay eventos registrados.</p>
                    ) : (
                      templateHistory.map((item) => {
                        const submission = submissions.find(s => s.id === item.submissionId);
                        const assignedUser = USERS.find(u => u.email === submission?.userEmail);
                        
                        return (
                          <div key={item.id} className="flex gap-3 text-sm">
                            <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500/50 shrink-0" />
                            <div>
                              <p className="text-foreground">{item.event}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span className="font-medium text-emerald-400">{item.author}</span>
                                <span>•</span>
                                <span>{item.date}</span>
                                {assignedUser && (
                                  <>
                                    <span>•</span>
                                    <span className="truncate max-w-[150px]">Instancia: {assignedUser.name}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        <TabsContent value="instances" className="space-y-4">
          {submissions.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border/50 rounded-xl bg-card/30">
              <p className="text-muted-foreground">No hay formularios asignados o enviados para este template.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {submissions.map((submission) => {
                const statusCfg = FORM_STATUS_CONFIG[submission.status as keyof typeof FORM_STATUS_CONFIG];
                const assignedUser = USERS.find(u => u.email === submission.userEmail);
                
                return (
                  <Link key={submission.id} href={`/forms/${submission.id}`} className="block group">
                    <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5">
                      <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                          <FileText className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="font-semibold text-base truncate">{template.name}</h2>
                            <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${statusCfg.color}`}>
                              {statusCfg.label}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            Asignado a: <span className="font-medium text-foreground">{assignedUser?.name || submission.userEmail}</span>
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
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
