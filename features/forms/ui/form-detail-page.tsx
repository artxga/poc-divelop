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
import type { IndicatorResponse } from "@/features/forms/model/types";
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
  const [responses, setResponses] = useState<Record<string, IndicatorResponse>>(() => {
    const map: Record<string, IndicatorResponse> = {};
    RESPONSES.filter((r) => r.submissionId === id).forEach((r) => { map[r.indicatorId] = r as any; });
    return map;
  });

  // Trazabilidad State
  const [comments, setComments] = useState(COMMENTS.filter((c) => c.submissionId === id));
  const [history] = useState(HISTORY.filter((h) => h.submissionId === id));
  const [commentInput, setCommentInput] = useState("");

  const statusCfg = FORM_STATUS_CONFIG[submission.status as keyof typeof FORM_STATUS_CONFIG];
  const disabled = submission.status === "aprobado" || submission.status === "enviado";

  function updateValue(indicatorId: string, value: string | number | boolean) {
    setResponses((prev) => ({
      ...prev,
      [indicatorId]: {
        ...(prev[indicatorId] ?? { id: `new-${indicatorId}`, submissionId: id, indicatorId }),
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

  function renderInput(ind: Indicator) {
    const value = responses[ind.id]?.value;

    switch (ind.dataType) {
      case "numero":
      case "porcentaje":
        return (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="0"
              value={(value as number) ?? ""}
              disabled={disabled}
              onChange={(e) => updateValue(ind.id, parseFloat(e.target.value) || 0)}
              className="w-48"
            />
            {ind.unit && <span className="flex items-center text-sm text-muted-foreground">{ind.unit}</span>}
          </div>
        );
      case "texto":
        return (
          <Textarea
            placeholder="Ingresa una descripción..."
            value={(value as string) ?? ""}
            disabled={disabled}
            onChange={(e) => updateValue(ind.id, e.target.value)}
            rows={3}
            className="max-w-xl"
          />
        );
      case "booleano":
        return (
          <div className="flex items-center gap-3">
            {[true, false].map((v) => (
              <label key={String(v)} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={value === v}
                  disabled={disabled}
                  onCheckedChange={() => updateValue(ind.id, v)}
                />
                <span className="text-sm">{v ? "Sí" : "No"}</span>
              </label>
            ))}
          </div>
        );
      case "seleccion":
        return (
          <Select
            value={(value as string) ?? ""}
            disabled={disabled}
            onValueChange={(v) => updateValue(ind.id, v)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecciona..." />
            </SelectTrigger>
            <SelectContent>
              {(ind.options ?? []).map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
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
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 pb-10">
            {INDICATORS.filter((i) => template?.indicators.includes(i.id)).map((ind) => {
              const catCfg = CATEGORY_CONFIG[ind.category as keyof typeof CATEGORY_CONFIG];
              return (
                <Card key={ind.id} className="border-border/50 bg-card/60 backdrop-blur-sm">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-xs text-muted-foreground">{ind.code}</span>
                          <div className={`flex items-center gap-1 text-xs ${catCfg.color}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${catCfg.dot}`} />
                            {ind.category}
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full border border-border/50 text-muted-foreground ml-auto">
                            {ind.standard}
                          </span>
                        </div>
                        <p className="font-medium text-sm">{ind.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{ind.description}</p>
                        
                        <div className="mt-4">
                          {renderInput(ind)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {(!template?.indicators || template.indicators.length === 0) && (
              <p className="text-sm text-muted-foreground p-4 text-center border border-dashed border-border/50 rounded-lg bg-card/30">
                No hay indicadores configurados en este formulario.
              </p>
            )}
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
