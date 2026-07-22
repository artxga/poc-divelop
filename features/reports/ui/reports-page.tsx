"use client";

import { useState, useMemo } from "react";
import { MOCK_GENERATED_REPORTS, downloadReport } from "../api/mock-reports";
import {
  RESPONSES, INDICATORS, PROJECTS, FORM_SUBMISSIONS, FORM_TEMPLATES,
  TIMELINE_EVENTS, USERS, FORM_STATUS_CONFIG, STANDARD_CONFIG, CATEGORY_CONFIG,
} from "@/features/shared/api/mock-db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  FileDown, CheckCircle2, Clock, AlertTriangle, Activity, Sparkles,
  FolderSearch, FileText, Download, ChevronDown, ChevronUp,
} from "lucide-react";
import { useAuth } from "@/features/auth/api/auth-context";
import { ActivityTimeline } from "./activity-timeline";
import { cn } from "@/lib/utils";

export function ReportsPage() {
  const { user } = useAuth();
  const [projectId, setProjectId] = useState<string>("");
  const [templateId, setTemplateId] = useState<string>("");
  const [expandedSubmissions, setExpandedSubmissions] = useState<Set<string>>(new Set());

  if (!user) return null;

  // ── Access-scoped projects ───────────────────────────────────
  const accessProjects = PROJECTS.filter(p =>
    user.role === "admin" || user.role === "consultor" ? true : p.clientId === user.clientId
  );

  // ── Templates for selected project ──────────────────────────
  const templatesForProject = projectId
    ? FORM_TEMPLATES.filter(t => t.projectId === projectId)
    : [];

  // Reset template when project changes
  const handleProjectChange = (val: string) => {
    setProjectId(val);
    setTemplateId("");
  };

  // ── Data for the selected form ───────────────────────────────
  const selectedTemplate = FORM_TEMPLATES.find(t => t.id === templateId);
  const formSubmissions = templateId
    ? FORM_SUBMISSIONS.filter(s => s.templateId === templateId && s.projectId === projectId)
    : [];

  // Expand question responses to indicator responses
  const allResponses = useMemo(() => {
    if (!selectedTemplate) return [];
    return RESPONSES.flatMap(r => {
      const sub = formSubmissions.find(s => s.id === r.submissionId);
      if (!sub) return [];
      const question = selectedTemplate.questions.find(q => q.id === r.questionId);
      if (!question) return [];
      return [{
        ...r,
        questionText: question.text,
        questionType: question.type,
        indicatorIds: question.indicatorIds,
      }];
    });
  }, [templateId, projectId]);

  // ── Toggle submission expansion ──────────────────────────────
  const toggleSubmission = (id: string) => {
    setExpandedSubmissions(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Timeline filtered by project ─────────────────────────────
  const timelineEvents = TIMELINE_EVENTS.filter(e => e.projectId === projectId) as any[];

  const hasSelection = !!projectId && !!templateId;

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reportería</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Selecciona un proyecto y formulario para visualizar las respuestas recolectadas
        </p>
      </div>

      {/* ── Selectors ─────────────────────────────────────────── */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardContent className="pt-5 pb-5">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Proyecto</label>
              <Select value={projectId} onValueChange={handleProjectChange}>
                <SelectTrigger className="border-border/60 bg-secondary/30">
                  <SelectValue placeholder="Seleccionar proyecto..." />
                </SelectTrigger>
                <SelectContent>
                  {accessProjects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Formulario</label>
              <Select value={templateId} onValueChange={setTemplateId} disabled={!projectId}>
                <SelectTrigger className="border-border/60 bg-secondary/30">
                  <SelectValue placeholder={projectId ? "Seleccionar formulario..." : "Primero selecciona un proyecto"} />
                </SelectTrigger>
                <SelectContent>
                  {templatesForProject.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Empty state ───────────────────────────────────────── */}
      {!hasSelection && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-4">
          <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border/50 flex items-center justify-center">
            <FolderSearch className="w-7 h-7 opacity-40" />
          </div>
          <div>
            <p className="text-base font-medium text-foreground/60">Selecciona un proyecto y formulario</p>
            <p className="text-sm mt-1 text-muted-foreground">
              Los datos, el estado de los envíos y la actividad se mostrarán aquí.
            </p>
          </div>
        </div>
      )}

      {/* ── Content (only when both selected) ─────────────────── */}
      {hasSelection && (
        <>
          {/* ── Submission Status Cards ─────────────────────────── */}
          <div>
            <h2 className="text-base font-semibold mb-3">Estado de los Envíos</h2>
            {formSubmissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay envíos para este formulario.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {formSubmissions.map(sub => {
                  const u = USERS.find(u => u.email === sub.userEmail);
                  const statusCfg = FORM_STATUS_CONFIG[sub.status as keyof typeof FORM_STATUS_CONFIG];
                  return (
                    <Card key={sub.id} className="border-border/50 bg-card/60 backdrop-blur-sm">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{u?.name ?? sub.userEmail}</p>
                            <p className="text-xs text-muted-foreground">{sub.userEmail}</p>
                          </div>
                          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ml-2 ${statusCfg.color}`}>
                            {statusCfg.label}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progreso</span>
                            <span className={cn("font-semibold",
                              sub.progress >= 80 ? "text-emerald-400" :
                              sub.progress >= 50 ? "text-amber-400" : "text-red-400"
                            )}>{sub.progress}%</span>
                          </div>
                          <Progress value={sub.progress} className="h-2 bg-secondary" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Raw Responses per submission ───────────────────── */}
          <div>
            <h2 className="text-base font-semibold mb-3">Respuestas por Envío</h2>
            {formSubmissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay respuestas para mostrar.</p>
            ) : (
              <div className="space-y-3">
                {formSubmissions.map(sub => {
                  const u = USERS.find(u => u.email === sub.userEmail);
                  const statusCfg = FORM_STATUS_CONFIG[sub.status as keyof typeof FORM_STATUS_CONFIG];
                  const subResponses = allResponses.filter(r => r.submissionId === sub.id);
                  const isExpanded = expandedSubmissions.has(sub.id);
                  return (
                    <Card key={sub.id} className="border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
                      {/* Collapsible header */}
                      <button
                        onClick={() => toggleSubmission(sub.id)}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/20 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold">{u?.name ?? sub.userEmail}</p>
                            <p className="text-xs text-muted-foreground">{subResponses.length} respuestas registradas</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-4">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${statusCfg.color}`}>
                            {statusCfg.label}
                          </span>
                          {isExpanded
                            ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          }
                        </div>
                      </button>

                      {/* Expanded table */}
                      {isExpanded && (
                        <div className="border-t border-border/50">
                          {subResponses.length === 0 ? (
                            <p className="text-sm text-muted-foreground p-5">Este usuario aún no ha respondido.</p>
                          ) : (
                            <Table>
                              <TableHeader>
                                <TableRow className="border-border/40 hover:bg-transparent">
                                  <TableHead className="pl-5 text-xs">Pregunta</TableHead>
                                  <TableHead className="text-xs">Indicadores</TableHead>
                                  <TableHead className="text-xs">Tipo</TableHead>
                                  <TableHead className="pr-5 text-xs">Respuesta</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {subResponses.map((r, idx) => {
                                  const linkedIndicators = r.indicatorIds
                                    .map((id: string) => INDICATORS.find(i => i.id === id))
                                    .filter(Boolean);
                                  return (
                                    <TableRow key={idx} className="border-border/30 hover:bg-secondary/10 align-top">
                                      <TableCell className="pl-5 pt-3 max-w-[220px]">
                                        <p className="text-xs text-foreground leading-relaxed">{r.questionText}</p>
                                      </TableCell>
                                      <TableCell className="pt-3">
                                        <div className="flex flex-wrap gap-1">
                                          {linkedIndicators.map((ind: any) => {
                                            const estCfg = STANDARD_CONFIG[ind.standard as keyof typeof STANDARD_CONFIG];
                                            return (
                                              <span key={ind.id} className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${estCfg?.border ?? ""} ${estCfg?.bg ?? "bg-secondary"} ${estCfg?.color ?? "text-muted-foreground"}`}>
                                                {ind.code}
                                              </span>
                                            );
                                          })}
                                        </div>
                                      </TableCell>
                                      <TableCell className="pt-3">
                                        <span className="text-xs text-muted-foreground capitalize">{r.questionType}</span>
                                      </TableCell>
                                      <TableCell className="pr-5 pt-3 max-w-[280px]">
                                        {r.value === null || r.value === undefined ? (
                                          <span className="text-xs text-muted-foreground italic">Sin respuesta</span>
                                        ) : typeof r.value === "boolean" ? (
                                          <span className={cn("text-sm font-semibold", r.value ? "text-emerald-400" : "text-red-400")}>
                                            {r.value ? "Sí" : "No"}
                                          </span>
                                        ) : typeof r.value === "number" ? (
                                          <span className="text-sm font-semibold text-foreground">
                                            {r.value.toLocaleString()}
                                            <span className="text-xs font-normal text-muted-foreground ml-1">
                                              {linkedIndicators[0]?.unit ?? ""}
                                            </span>
                                          </span>
                                        ) : (
                                          <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                            {String(r.value)}
                                          </p>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── AI Analysis + Previous Reports ─────────────────── */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
            <CardHeader className="pb-3 border-b border-border/50 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Análisis con Inteligencia Artificial
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Genera un reporte completo con gráficos, resúmenes, detalle por indicador y recomendaciones a partir de las respuestas recolectadas.
                  </CardDescription>
                </div>
                <Button
                  disabled
                  className="shrink-0 gap-2 bg-purple-600/70 text-white cursor-not-allowed opacity-60 hover:bg-purple-600/70"
                  title="Próximamente disponible"
                >
                  <Sparkles className="w-4 h-4" />
                  Analizar con IA
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 relative">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Reportes Generados
              </p>
              {MOCK_GENERATED_REPORTS.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border/50 rounded-lg bg-card/30">
                  Aún no se han generado reportes para este formulario.
                </p>
              ) : (
                <div className="space-y-2">
                  {MOCK_GENERATED_REPORTS.map(rep => (
                    <div
                      key={rep.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-secondary/20 hover:bg-secondary/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/25 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{rep.name}</p>
                          <p className="text-xs text-muted-foreground">{rep.date} · {rep.pages} páginas</p>
                        </div>
                      </div>
                      <Button
                        variant="outline" size="sm"
                        className="shrink-0 ml-3 gap-1.5 text-xs border-border/50"
                        onClick={() => downloadReport(rep)}
                      >
                        <Download className="w-3.5 h-3.5" />
                        Descargar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Activity Timeline ───────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-purple-400" />
              <h2 className="text-base font-semibold">Actividad del Proyecto</h2>
            </div>
            <ActivityTimeline events={timelineEvents} />
          </div>
        </>
      )}
    </div>
  );
}
