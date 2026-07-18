"use client";

import {
  RESPUESTAS,
  INDICADORES,
  PROYECTOS,
  FORMULARIOS,
  DATOS_MENSUALES,
  DATOS_CATEGORIA,
  DATOS_ESTANDAR,
  ESTADO_FORM_CONFIG,
  ESTANDAR_CONFIG,
  CATEGORIA_CONFIG,
} from "@/app/_lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { Download, BarChart3, TrendingUp, PieChart as PieIcon, Activity, FileDown } from "lucide-react";
import { useState } from "react";

function exportCSV() {
  const rows = RESPUESTAS.map((r) => {
    const ind = INDICADORES.find((i) => i.id === r.indicadorId);
    const form = FORMULARIOS.find((f) => f.id === r.formularioId);
    const proy = PROYECTOS.find((p) => p.id === form?.proyectoId);
    
    return [
      proy?.nombre ?? "",
      form?.nombre ?? "",
      ind?.codigo ?? "",
      ind?.nombre ?? "",
      ind?.estandar ?? "",
      ind?.categoria ?? "",
      form?.estado ?? "",
      String(r.valor ?? ""),
      ind?.unidad ?? "",
    ].join(",");
  });
  const header = "Proyecto,Formulario,Código,Indicador,Estándar,Categoría,Estado Formulario,Valor,Unidad";
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reporte-esg-divelop.csv";
  a.click();
  URL.revokeObjectURL(url);
}

const RADAR_DATA = [
  { subject: "Ambiental", A: 78, B: 55 },
  { subject: "Social", A: 62, B: 48 },
  { subject: "Gobernanza", A: 85, B: 72 },
  { subject: "Energía", A: 70, B: 60 },
  { subject: "Agua", A: 90, B: 40 },
];

export default function ReportesPage() {
  const [filtroProyecto, setFiltroProyecto] = useState("todos");
  const [filtroEstandar, setFiltroEstandar] = useState("todos");

  const respuestasFiltradas = RESPUESTAS.filter((r) => {
    const ind = INDICADORES.find((i) => i.id === r.indicadorId);
    const form = FORMULARIOS.find((f) => f.id === r.formularioId);
    
    const matchProy = filtroProyecto === "todos" || form?.proyectoId === filtroProyecto;
    const matchEst = filtroEstandar === "todos" || ind?.estandar === filtroEstandar;
    return matchProy && matchEst;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reportería y Análisis</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tableros analíticos filtrados por Proyecto
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filtroProyecto} onValueChange={setFiltroProyecto}>
            <SelectTrigger className="w-56 border-emerald-500/30">
              <SelectValue placeholder="Seleccionar Proyecto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los Proyectos</SelectItem>
              {PROYECTOS.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={exportCSV} className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
            <FileDown className="w-4 h-4" /> Exportar CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráficos simulados que en la realidad reaccionarían a respuestasFiltradas */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <CardTitle className="text-base">Métricas por Categoría ESG</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={DATOS_CATEGORIA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="categoria" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(222 47% 14%)", border: "1px solid hsl(217 33% 22%)", borderRadius: "8px", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Bar dataKey="GRI" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="SASB" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ODS" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="TCFD" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <CardTitle className="text-base">Progreso del Proyecto</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={DATOS_MENSUALES} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="mes" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(222 47% 14%)", border: "1px solid hsl(217 33% 22%)", borderRadius: "8px", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Line type="monotone" dataKey="enviados" name="Enviados" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6" }} />
                <Line type="monotone" dataKey="aprobados" name="Aprobados" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: "#10b981" }} />
                <Line type="monotone" dataKey="observados" name="Observados" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: "#f59e0b" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-purple-400" />
              <CardTitle className="text-base">Porcentaje de Respuestas por Estándar</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={DATOS_ESTANDAR}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={4}
                  dataKey="valor"
                  label={({ estandar, percent }: any) => `${estandar} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {DATOS_ESTANDAR.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(222 47% 14%)", border: "1px solid hsl(217 33% 22%)", borderRadius: "8px", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <CardTitle className="text-base">Madurez ESG del Proyecto</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Radar name="Año Actual" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                <Radar name="Año Anterior" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Tooltip contentStyle={{ background: "hsl(222 47% 14%)", border: "1px solid hsl(217 33% 22%)", borderRadius: "8px", fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <CardTitle className="text-base">Indicadores Recolectados</CardTitle>
              <CardDescription>Visualizando respuestas filtradas</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={filtroEstandar} onValueChange={setFiltroEstandar}>
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue placeholder="Estándar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {["GRI", "SASB", "ODS", "TCFD"].map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="pl-6">Indicador</TableHead>
                <TableHead>Formulario</TableHead>
                <TableHead>Estándar</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="pr-6">Estado del Form.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {respuestasFiltradas.map((r) => {
                const ind = INDICADORES.find((i) => i.id === r.indicadorId);
                const form = FORMULARIOS.find((f) => f.id === r.formularioId);
                const estCfg = ind ? ESTANDAR_CONFIG[ind.estandar as keyof typeof ESTANDAR_CONFIG] : null;
                const catCfg = ind ? CATEGORIA_CONFIG[ind.categoria] : null;
                const estadoCfg = form ? ESTADO_FORM_CONFIG[form.estado] : null;
                
                return (
                  <TableRow key={r.id} className="border-border/30 hover:bg-secondary/20">
                    <TableCell className="pl-6">
                      <div>
                        <p className="text-xs font-mono text-muted-foreground">{ind?.codigo}</p>
                        <p className="text-sm font-medium line-clamp-1">{ind?.nombre}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">
                      {form?.nombre}
                    </TableCell>
                    <TableCell>
                      {estCfg && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${estCfg.border} ${estCfg.bg} ${estCfg.color} font-medium`}>
                          {ind?.estandar}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {catCfg && (
                        <div className={`flex items-center gap-1.5 text-xs ${catCfg.color}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${catCfg.dot}`} />
                          {ind?.categoria}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {r.valor === null || r.valor === undefined ? (
                        <span className="text-muted-foreground">—</span>
                      ) : typeof r.valor === "boolean" ? (
                        r.valor ? "Sí" : "No"
                      ) : (
                        <span>{String(r.valor)} {ind?.unidad && <span className="text-xs text-muted-foreground">{ind.unidad}</span>}</span>
                      )}
                    </TableCell>
                    <TableCell className="pr-6">
                      {estadoCfg && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${estadoCfg.color}`}>
                          {estadoCfg.label}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
