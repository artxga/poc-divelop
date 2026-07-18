"use client";

import {
  RESPONSES,
  INDICATORS,
  PROJECTS,
  FORM_SUBMISSIONS,
  FORM_TEMPLATES,
  MONTHLY_DATA,
  CATEGORY_DATA,
  STANDARD_DATA,
  FORM_STATUS_CONFIG,
  STANDARD_CONFIG,
  CATEGORY_CONFIG,
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
  const rows = RESPONSES.map((r) => {
    const ind = INDICATORS.find((i) => i.id === r.indicatorId);
    const submission = FORM_SUBMISSIONS.find((f) => f.id === r.submissionId);
    const template = FORM_TEMPLATES.find((t) => t.id === submission?.templateId);
    const proy = PROJECTS.find((p) => p.id === submission?.projectId);

    return [
      proy?.name ?? "",
      `${template?.name} - ${submission?.userEmail}`,
      ind?.code ?? "",
      ind?.name ?? "",
      ind?.standard ?? "",
      ind?.category ?? "",
      submission?.status ?? "",
      String(r.value ?? ""),
      ind?.unit ?? "",
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

export default function ReportsPage() {
  const [projectFilter, setProjectFilter] = useState("todos");
  const [standardFilter, setStandardFilter] = useState("todos");

  const filteredResponses = RESPONSES.filter((r) => {
    const ind = INDICATORS.find((i) => i.id === r.indicatorId);
    const submission = FORM_SUBMISSIONS.find((f) => f.id === r.submissionId);

    const matchProy = projectFilter === "todos" || submission?.projectId === projectFilter;
    const matchEst = standardFilter === "todos" || ind?.standard === standardFilter;
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
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-56 border-emerald-500/30">
              <SelectValue placeholder="Seleccionar Proyecto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los Proyectos</SelectItem>
              {PROJECTS.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={exportCSV} className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
            <FileDown className="w-4 h-4" /> Exportar CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráficos simulados que en la realidad reaccionarían a filteredResponses */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <CardTitle className="text-base">Métricas por Categoría ESG</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={CATEGORY_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
              <LineChart data={MONTHLY_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
                  data={STANDARD_DATA}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={4}
                  dataKey="valor"
                  label={({ estandar, percent }: any) => `${estandar} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {STANDARD_DATA.map((entry, i) => (
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
              <Select value={standardFilter} onValueChange={setStandardFilter}>
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
              {filteredResponses.map((r) => {
                const ind = INDICATORS.find((i) => i.id === r.indicatorId);
                const submission = FORM_SUBMISSIONS.find((f) => f.id === r.submissionId);
                const template = FORM_TEMPLATES.find((t) => t.id === submission?.templateId);
                const estCfg = ind ? STANDARD_CONFIG[ind.standard as keyof typeof STANDARD_CONFIG] : null;
                const catCfg = ind ? CATEGORY_CONFIG[ind.category] : null;
                const statusCfg = submission ? FORM_STATUS_CONFIG[submission.status] : null;

                return (
                  <TableRow key={r.id} className="border-border/30 hover:bg-secondary/20">
                    <TableCell className="pl-6">
                      <div>
                        <p className="text-xs font-mono text-muted-foreground">{ind?.code}</p>
                        <p className="text-sm font-medium line-clamp-1">{ind?.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">
                      {template?.name} - {submission?.userEmail}
                    </TableCell>
                    <TableCell>
                      {estCfg && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${estCfg.border} ${estCfg.bg} ${estCfg.color} font-medium`}>
                          {ind?.standard}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {catCfg && (
                        <div className={`flex items-center gap-1.5 text-xs ${catCfg.color}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${catCfg.dot}`} />
                          {ind?.category}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {r.value === null || r.value === undefined ? (
                        <span className="text-muted-foreground">—</span>
                      ) : typeof r.value === "boolean" ? (
                        r.value ? "Sí" : "No"
                      ) : (
                        <span>{String(r.value)} {ind?.unit && <span className="text-xs text-muted-foreground">{ind.unit}</span>}</span>
                      )}
                    </TableCell>
                    <TableCell className="pr-6">
                      {statusCfg && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${statusCfg.color}`}>
                          {statusCfg.label}
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
