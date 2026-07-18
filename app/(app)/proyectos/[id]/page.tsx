"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  PROYECTOS,
  INDICADORES,
  RESPUESTAS,
  ESTANDAR_CONFIG,
  CATEGORIA_CONFIG,
  ESTADO_CONFIG,
  type RespuestaIndicador,
  type RespuestaEstado,
  type Indicador,
} from "@/app/_lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Circle,
  Plus,
  Save,
} from "lucide-react";

export default function ProyectoDetailPage({ params }: PageProps<"/proyectos/[id]">) {
  const { id } = use(params);
  const proyecto = PROYECTOS.find((p) => p.id === id);
  if (!proyecto) notFound();

  const [activeEstandar, setActiveEstandar] = useState<string>(proyecto.estandares[0]);
  const [respuestas, setRespuestas] = useState<Record<string, RespuestaIndicador>>(() => {
    const map: Record<string, RespuestaIndicador> = {};
    RESPUESTAS.filter((r) => r.proyectoId === id).forEach((r) => { map[r.indicadorId] = r; });
    return map;
  });
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  const indicadoresFiltrados = INDICADORES.filter((ind) => ind.estandar === activeEstandar);
  const totalInd = Object.keys(respuestas).length;
  const aprobados = Object.values(respuestas).filter((r) => r.estado === "aprobado").length;
  const pct = totalInd > 0 ? Math.round((aprobados / totalInd) * 100) : 0;

  function updateValor(indicadorId: string, valor: string | number | boolean) {
    setRespuestas((prev) => ({
      ...prev,
      [indicadorId]: {
        ...(prev[indicadorId] ?? {
          id: `new-${indicadorId}`,
          proyectoId: id,
          indicadorId,
          estado: "borrador",
          ultimaEdicion: new Date().toISOString().split("T")[0],
          autor: "Usuario",
          comentarios: [],
        }),
        valor,
        estado: "borrador",
        ultimaEdicion: new Date().toISOString().split("T")[0],
      },
    }));
  }

  function enviarIndicador(indicadorId: string) {
    setRespuestas((prev) => ({
      ...prev,
      [indicadorId]: { ...prev[indicadorId], estado: "enviado" },
    }));
  }

  function addComment(indicadorId: string) {
    const texto = commentInput[indicadorId]?.trim();
    if (!texto) return;
    setRespuestas((prev) => ({
      ...prev,
      [indicadorId]: {
        ...prev[indicadorId],
        comentarios: [
          ...(prev[indicadorId]?.comentarios ?? []),
          {
            id: `c-${Date.now()}`,
            autor: "Consultor Demo",
            rol: "consultor" as const,
            texto,
            fecha: new Date().toISOString().split("T")[0],
          },
        ],
      },
    }));
    setCommentInput((prev) => ({ ...prev, [indicadorId]: "" }));
  }

  function renderInput(ind: Indicador) {
    const respuesta = respuestas[ind.id];
    const valor = respuesta?.valor;
    const disabled = respuesta?.estado === "aprobado";

    switch (ind.tipoDato) {
      case "numero":
      case "porcentaje":
        return (
          <div className="flex gap-2">
            <Input
              id={`input-${ind.id}`}
              type="number"
              placeholder="0"
              value={(valor as number) ?? ""}
              disabled={disabled}
              onChange={(e) => updateValor(ind.id, parseFloat(e.target.value) || 0)}
              className="w-48"
            />
            {ind.unidad && <span className="flex items-center text-sm text-muted-foreground">{ind.unidad}</span>}
          </div>
        );
      case "texto":
        return (
          <Textarea
            id={`input-${ind.id}`}
            placeholder="Ingresa una descripción..."
            value={(valor as string) ?? ""}
            disabled={disabled}
            onChange={(e) => updateValor(ind.id, e.target.value)}
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
                  id={`chk-${ind.id}-${v}`}
                  checked={valor === v}
                  disabled={disabled}
                  onCheckedChange={() => updateValor(ind.id, v)}
                />
                <span className="text-sm">{v ? "Sí" : "No"}</span>
              </label>
            ))}
          </div>
        );
      case "seleccion":
        return (
          <Select
            value={(valor as string) ?? ""}
            disabled={disabled}
            onValueChange={(v) => updateValor(ind.id, v)}
          >
            <SelectTrigger id={`sel-${ind.id}`} className="w-48">
              <SelectValue placeholder="Selecciona..." />
            </SelectTrigger>
            <SelectContent>
              {(ind.opciones ?? []).map((opt) => (
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
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link href="/proyectos" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" />
          Proyectos
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium truncate">{proyecto.nombre}</span>
      </div>

      {/* Project header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-xl font-bold">{proyecto.nombre}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{proyecto.cliente} · {proyecto.consultor}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Avance general</p>
            <p className="text-2xl font-bold gradient-text">{proyecto.progreso}%</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <Progress value={proyecto.progreso} className="w-32 h-2 bg-secondary" />
        </div>
      </div>

      {/* Estandar tabs */}
      <Tabs value={activeEstandar} onValueChange={setActiveEstandar}>
        <TabsList className="bg-secondary/50 gap-1 h-auto flex-wrap">
          {proyecto.estandares.map((est) => {
            const cfg = ESTANDAR_CONFIG[est];
            return (
              <TabsTrigger
                key={est}
                value={est}
                id={`tab-${est}`}
                className={`data-[state=active]:${cfg.bg} data-[state=active]:${cfg.color} data-[state=active]:border data-[state=active]:${cfg.border}`}
              >
                {est}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {proyecto.estandares.map((est) => (
          <TabsContent key={est} value={est} className="mt-4 space-y-3">
            {INDICADORES.filter((i) => i.estandar === est).map((ind) => {
              const resp = respuestas[ind.id];
              const estado: RespuestaEstado = resp?.estado ?? "borrador";
              const estadoCfg = ESTADO_CONFIG[estado];
              const catCfg = CATEGORIA_CONFIG[ind.categoria];
              const showCmt = showComments[ind.id];

              return (
                <Card key={ind.id} className={`border-border/50 bg-card/60 backdrop-blur-sm transition-all ${estado === "observado" ? "border-amber-500/30" : ""}`}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-muted-foreground">{ind.codigo}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full border ${estadoCfg.color}`}>
                                {estadoCfg.label}
                              </span>
                              <div className={`flex items-center gap-1 text-xs ${catCfg.color}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${catCfg.dot}`} />
                                {ind.categoria}
                              </div>
                            </div>
                            <p className="font-medium text-sm">{ind.nombre}</p>
                            <p className="text-xs text-muted-foreground">{ind.descripcion}</p>
                          </div>
                        </div>

                        {/* Input */}
                        <div className="mt-3">
                          {renderInput(ind)}
                        </div>

                        {/* Last edit */}
                        {resp && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Última edición: {resp.ultimaEdicion} · {resp.autor}
                          </p>
                        )}

                        {/* Comments section */}
                        {showCmt && (
                          <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
                            {(resp?.comentarios ?? []).map((c) => (
                              <div key={c.id} className={`text-xs p-2.5 rounded-lg ${c.rol === "consultor" ? "bg-blue-500/10 border border-blue-500/20" : "bg-secondary/50"}`}>
                                <p className="font-semibold mb-0.5">{c.autor} <span className="text-muted-foreground font-normal">· {c.fecha}</span></p>
                                <p className="text-muted-foreground">{c.texto}</p>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <Input
                                placeholder="Agregar comentario..."
                                className="text-xs h-8"
                                value={commentInput[ind.id] ?? ""}
                                onChange={(e) => setCommentInput((p) => ({ ...p, [ind.id]: e.target.value }))}
                                onKeyDown={(e) => e.key === "Enter" && addComment(ind.id)}
                              />
                              <Button size="sm" variant="outline" className="h-8 px-3 shrink-0" onClick={() => addComment(ind.id)}>
                                <Send className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <Button
                          id={`btn-enviar-${ind.id}`}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white gap-1 text-xs"
                          disabled={!resp || estado === "aprobado" || estado === "enviado"}
                          onClick={() => enviarIndicador(ind.id)}
                        >
                          <Send className="w-3 h-3" />
                          Enviar
                        </Button>
                        <Button
                          id={`btn-comentar-${ind.id}`}
                          size="sm"
                          variant="outline"
                          className="gap-1 text-xs"
                          onClick={() => setShowComments((p) => ({ ...p, [ind.id]: !p[ind.id] }))}
                        >
                          <MessageSquare className="w-3 h-3" />
                          {resp?.comentarios?.length ?? 0}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
