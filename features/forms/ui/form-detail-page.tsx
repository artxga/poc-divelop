"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  FORM_SUBMISSIONS,
  FORM_TEMPLATES,
  PROJECTS,
  INDICATORS,
  RESPONSES,
  COMMENTS,
  HISTORY,
  STANDARD_CONFIG,
  CATEGORY_CONFIG,
  FORM_STATUS_CONFIG,
  USERS,
} from "@/features/shared/api/mock-db";
import type { QuestionResponse } from "@/features/forms/model/types";
import type { Indicator } from "@/features/indicators/model/types";
import { useAuth } from "@/features/auth/api/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  Send,
  MessageSquare,
  Paperclip,
  History,
  CheckCircle2,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

export function FormDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  
  const submission = FORM_SUBMISSIONS.find((f) => f.id === id);
  if (!submission) notFound();
  if (!user) return null;

  const template = FORM_TEMPLATES.find(t => t.id === submission.templateId);
  const project = PROJECTS.find((p) => p.id === submission.projectId);
  const assignedUser = USERS.find(u => u.email === submission.userEmail);
  
  const [activeTab, setActiveTab] = useState<string>("indicadores");
  
  // Respuestas State
  const [responses, setResponses] = useState<Record<string, QuestionResponse>>(() => {
    const map: Record<string, QuestionResponse> = {};
    RESPONSES.filter((r) => r.submissionId === id).forEach((r) => { map[r.questionId] = r as any; });
    return map;
  });

  // Trazabilidad State
  const [comments, setComments] = useState(COMMENTS.filter((c) => c.submissionId === id));
  const [history] = useState(HISTORY.filter((h) => h.submissionId === id));
  const [commentInput, setCommentInput] = useState("");

  const statusCfg = FORM_STATUS_CONFIG[submission.status as keyof typeof FORM_STATUS_CONFIG];
  const disabled = submission.status === "aprobado" || submission.status === "enviado";

  function updateValue(questionId: string, value: string | number | boolean) {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] ?? { id: `new-${questionId}`, submissionId: id, questionId }),
        value,
      },
    }));
  }

  function addComment(isEvidence: boolean = false) {
    if (!commentInput.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        submissionId: id,
        author: user!.name,
        role: user!.role,
        text: commentInput,
        date: new Date().toISOString().split("T")[0],
        isEvidence,
        fileName: isEvidence ? "evidencia_adjunta.pdf" : undefined,
      },
    ]);
    setCommentInput("");
  }



  return (
    <div className="space-y-5 h-full flex flex-col">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 shrink-0">
        <Link href={`/projects/${submission.projectId}/forms/${template?.id}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Envíos de {template?.name}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium truncate">{assignedUser?.name || submission.userEmail}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold">{template?.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <User className="w-4 h-4" /> Asignado a: <span className="font-medium text-foreground">{assignedUser?.name || submission.userEmail}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 text-sm font-medium rounded-full border ${statusCfg.color}`}>
            Estado: {statusCfg.label}
          </span>
          <Button 
            disabled={disabled}
            className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2"
          >
            <Send className="w-4 h-4" /> Enviar a Revisión
          </Button>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="bg-secondary/50 shrink-0">
          <TabsTrigger value="indicadores" className="gap-2">
            <CheckCircle2 className="w-4 h-4" /> Llenado de Indicadores
          </TabsTrigger>
          <TabsTrigger value="trazabilidad" className="gap-2">
            <MessageSquare className="w-4 h-4" /> Conversaciones y Evidencias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="indicadores" className="flex-1 min-h-0 mt-4 data-[state=active]:flex flex-col gap-4">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-10">
            {(() => {
              if (!template?.questions || template.questions.length === 0) {
                return (
                  <p className="text-sm text-muted-foreground p-4 text-center border border-dashed border-border/50 rounded-lg bg-card/30">
                    No hay preguntas configuradas en este formulario.
                  </p>
                );
              }

              // Group questions by their indicatorIds signature
              const groups: Record<string, typeof template.questions> = {};
              template.questions.forEach((q) => {
                const sig = [...q.indicatorIds].sort().join(",");
                if (!groups[sig]) groups[sig] = [];
                groups[sig].push(q);
              });

              return Object.entries(groups).map(([sig, questions], idx) => {
                const groupIndicators = sig 
                  ? sig.split(",").map(id => INDICATORS.find(i => i.id === id)).filter(Boolean) as Indicator[]
                  : [];

                return (
                  <Card key={`group-${idx}`} className="border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
                    {groupIndicators.length > 0 && (
                      <div className="bg-secondary/30 border-b border-border/50 p-3 px-4 flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-semibold text-muted-foreground mr-2">INDICADORES ASOCIADOS:</span>
                        {groupIndicators.map(ind => {
                          const catCfg = CATEGORY_CONFIG[ind.category as keyof typeof CATEGORY_CONFIG];
                          return (
                            <div key={ind.id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs ${catCfg.bg} ${catCfg.border} ${catCfg.color}`}>
                              <span className="font-mono opacity-70">{ind.code}</span>
                              <span className="font-medium">{ind.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <CardContent className="p-0">
                      <div className="divide-y divide-border/30">
                        {questions.map((q, qIdx) => (
                          <div key={q.id} className="p-5 flex flex-col sm:flex-row gap-6 hover:bg-secondary/10 transition-colors">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-foreground">
                                <span className="text-muted-foreground mr-2">{qIdx + 1}.</span>
                                {q.text}
                              </p>
                            </div>
                            <div className="w-full sm:w-80 shrink-0">
                              {(() => {
                                const value = responses[q.id]?.value;
                                switch (q.type) {
                                  case "numero":
                                    return (
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        value={(value as number) ?? ""}
                                        disabled={disabled}
                                        onChange={(e) => updateValue(q.id, parseFloat(e.target.value) || 0)}
                                      />
                                    );
                                  case "texto":
                                    return (
                                      <Textarea
                                        placeholder="Escribe tu respuesta..."
                                        value={(value as string) ?? ""}
                                        disabled={disabled}
                                        onChange={(e) => updateValue(q.id, e.target.value)}
                                        rows={3}
                                      />
                                    );
                                  case "booleano":
                                    return (
                                      <div className="flex items-center gap-4 h-10">
                                        {[true, false].map((v) => (
                                          <label key={String(v)} className="flex items-center gap-2 cursor-pointer">
                                            <Checkbox
                                              checked={value === v}
                                              disabled={disabled}
                                              onCheckedChange={() => updateValue(q.id, v)}
                                            />
                                            <span className="text-sm font-medium">{v ? "Sí" : "No"}</span>
                                          </label>
                                        ))}
                                      </div>
                                    );
                                  case "seleccion":
                                    return (
                                      <Select
                                        value={(value as string) ?? ""}
                                        disabled={disabled}
                                        onValueChange={(v) => updateValue(q.id, v)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecciona una opción..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {(q.options ?? []).map((opt) => (
                                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    );
                                  case "archivo":
                                    return (
                                      <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" disabled={disabled} className="w-full justify-start text-muted-foreground border-dashed">
                                          <Paperclip className="w-4 h-4 mr-2" /> 
                                          {value ? "Cambiar archivo adjunto" : "Subir evidencia (PDF, Imagen)"}
                                        </Button>
                                      </div>
                                    );
                                  default:
                                    return null;
                                }
                              })()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              });
            })()}
          </div>
        </TabsContent>

        <TabsContent value="trazabilidad" className="flex-1 min-h-0 mt-4 data-[state=active]:flex flex-col md:flex-row gap-4">
          {/* Chat / Comentarios */}
          <Card className="flex-1 border-border/50 bg-card/60 backdrop-blur-sm flex flex-col min-h-0">
            <div className="p-4 border-b border-border/50 flex items-center gap-2 shrink-0">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <h2 className="font-semibold text-sm">Conversación del Formulario</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.map((c) => (
                <div key={c.id} className={cn("flex flex-col max-w-[85%]", c.author === user.name ? "ml-auto" : "mr-auto")}>
                  <div className="flex items-baseline gap-2 mb-1 px-1">
                    <span className="text-xs font-semibold">{c.author}</span>
                    <span className="text-[10px] text-muted-foreground">{c.date}</span>
                  </div>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm",
                    c.author === user.name 
                      ? "bg-blue-600 text-white rounded-tr-sm" 
                      : c.role === "consultor" || c.role === "admin" 
                        ? "bg-secondary text-foreground rounded-tl-sm border border-border/50"
                        : "bg-emerald-500/15 text-emerald-100 rounded-tl-sm border border-emerald-500/20"
                  )}>
                    {c.text}
                    {c.isEvidence && (
                      <div className="mt-2 flex items-center gap-2 bg-black/20 p-2 rounded-lg text-xs">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span className="truncate font-medium">{c.fileName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border/50 bg-card/50 shrink-0">
              <div className="flex gap-2">
                <Input 
                  placeholder="Escribe un comentario..." 
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addComment(false)}
                />
                <Button variant="outline" size="icon" onClick={() => addComment(true)} title="Adjuntar evidencia">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-500 text-white" onClick={() => addComment(false)}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Historial */}
          <Card className="w-full md:w-80 border-border/50 bg-card/60 backdrop-blur-sm flex flex-col shrink-0 min-h-[300px]">
            <div className="p-4 border-b border-border/50 flex items-center gap-2 shrink-0">
              <History className="w-5 h-5 text-amber-400" />
              <h2 className="font-semibold text-sm">Historial de Cambios</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {history.map((h, i) => (
                  <div key={h.id} className="relative pl-6">
                    {i !== history.length - 1 && (
                      <div className="absolute left-[11px] top-5 bottom-[-16px] w-px bg-border/50" />
                    )}
                    <div className="absolute left-1.5 top-1.5 w-2 h-2 rounded-full bg-amber-400 ring-4 ring-card" />
                    <p className="text-xs font-semibold text-foreground">{h.event}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                      <span>{h.author}</span>
                      <span>&middot;</span>
                      <span>{h.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
