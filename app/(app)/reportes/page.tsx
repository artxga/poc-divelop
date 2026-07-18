"use client";

import {
  RESPUESTAS,
  INDICADORES,
  PROYECTOS,
  DATOS_MENSUALES,
  DATOS_CATEGORIA,
  DATOS_ESTANDAR,
  ESTADO_CONFIG,
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
    const proy = PROYECTOS.find((p) => p.id === r.proyectoId);
    return [
      proy?.nombre ?? "",
      ind?.codigo ?? "",
      ind?.nombre ?? "",
      ind?.estandar ?? "",
      ind?.categoria ?? "",
      r.estado,
      String(r.valor ?? ""),
      ind?.unidad ?? "",
      r.ultimaEdicion,
    ].join(",");
  });
  const header = "Proyecto,Código,Indicador,Estándar,Categoría,Estado,Valor,Unidad,Última Edición";
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
    const matchProy = filtroProyecto === "todos" || r.proyectoId === filtroProyecto;
    const matchEst = filtroEstandar === "todos" || ind?.estandar === filtroEstandar;
    return matchProy && matchEst;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reportería y Análisis</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tableros analíticos consolidados y exportación de datos ESG
          </p>
        </div>
        <Button
          id="btn-exportar-csv"
          onClick={exportCSV}
          className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white gap-2"
        >
          <FileDown className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar chart por categoría */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <CardTitle className="text-base">Indicadores por Categoría ESG</CardTitle>
            </div>
            <CardDescription>Distribución por estándar y categoría</CardDescription>
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

        {/* Line chart tendencia */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <CardTitle className="text-base">Tendencia de Actividad</CardTitle>
            </div>
            <CardDescription>Evolución mensual de indicadores</CardDescription>
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

        {/* Pie chart */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-purple-400" />
              <CardTitle className="text-base">Distribución por Estándar</CardTitle>
            </div>
            <CardDescription>Total de indicadores en uso</CardDescription>
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

        {/* Radar chart */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <CardTitle className="text-base">Comparativo de Madurez ESG</CardTitle>
            </div>
            <CardDescription>Proyecto actual vs. año anterior</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Radar name="2025" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                <Radar name="2024" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Tooltip contentStyle={{ background: "hsl(222 47% 14%)", border: "1px solid hsl(217 33% 22%)", borderRadius: "8px", fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data table */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <CardTitle className="text-base">Datos Consolidados</CardTitle>
              <CardDescription>Vista detallada de todas las respuestas registradas</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={filtroProyecto} onValueChange={setFiltroProyecto}>
                <SelectTrigger id="reporte-filtro-proyecto" className="w-48 h-8 text-xs">
                  <SelectValue placeholder="Proyecto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los proyectos</SelectItem>
                  {PROYECTOS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.cliente}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filtroEstandar} onValueChange={setFiltroEstandar}>
                <SelectTrigger id="reporte-filtro-estandar" className="w-36 h-8 text-xs">
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
                <TableHead>Proyecto</TableHead>
                <TableHead>Estándar</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="pr-6">Última edición</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {respuestasFiltradas.map((r) => {
                const ind = INDICADORES.find((i) => i.id === r.indicadorId);
                const proy = PROYECTOS.find((p) => p.id === r.proyectoId);
                const estCfg = ind ? ESTANDAR_CONFIG[ind.estandar] : null;
                const catCfg = ind ? CATEGORIA_CONFIG[ind.categoria] : null;
                const estadoCfg = ESTADO_CONFIG[r.estado];
                return (
                  <TableRow key={r.id} className="border-border/30 hover:bg-secondary/20">
                    <TableCell className="pl-6">
                      <div>
                        <p className="text-xs font-mono text-muted-foreground">{ind?.codigo}</p>
                        <p className="text-sm font-medium line-clamp-1">{ind?.nombre}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">
                      {proy?.cliente}
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
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${estadoCfg.color}`}>
                        {estadoCfg.label}
                      </span>
                    </TableCell>
                    <TableCell className="pr-6 text-xs text-muted-foreground">{r.ultimaEdicion}</TableCell>
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
