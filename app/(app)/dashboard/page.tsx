"use client";

import { PROYECTOS, FORMULARIOS_ENVIADOS, FORMULARIO_TEMPLATES, DATOS_MENSUALES, DATOS_ESTANDAR, ESTADO_FORM_CONFIG } from "@/app/_lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FolderOpen,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

// Compute global stats
const totalProyectos = PROYECTOS.filter((p) => p.estado === "activo").length;
const aprobados = FORMULARIOS_ENVIADOS.filter((f) => f.estado === "aprobado").length;
const pendientes = FORMULARIOS_ENVIADOS.filter((f) => f.estado === "enviado").length;
const observados = FORMULARIOS_ENVIADOS.filter((f) => f.estado === "observado").length;
const totalFormularios = FORMULARIOS_ENVIADOS.length;
const pctCompletado = totalFormularios > 0 ? Math.round((aprobados / totalFormularios) * 100) : 0;

const KPIS = [
  {
    label: "Proyectos Activos",
    value: totalProyectos,
    icon: FolderOpen,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    trend: "+1 este mes",
  },
  {
    label: "Indicadores Aprobados",
    value: `${pctCompletado}%`,
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    trend: `${aprobados} de ${totalFormularios}`,
  },
  {
    label: "Pendientes de Revisión",
    value: pendientes,
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    trend: "Requieren atención",
  },
  {
    label: "Con Observaciones",
    value: observados,
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    trend: "Acción requerida",
  },
];

const PROYECTO_ESTADO = {
  activo: { label: "Activo", class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  pausado: { label: "Pausado", class: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  completado: { label: "Completado", class: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard ESG</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Vista general del estado de tus proyectos de reporting
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 border border-border/50 rounded-lg px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Actualizado en tiempo real
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className={`border ${kpi.border} bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all`}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg ${kpi.bg} ${kpi.border} border flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${kpi.color}`} />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold tracking-tight">{kpi.value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{kpi.label}</p>
                <p className={`text-xs mt-1 ${kpi.color}`}>{kpi.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <Card className="lg:col-span-2 border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <CardTitle className="text-base">Actividad Mensual</CardTitle>
            </div>
            <CardDescription>Indicadores enviados, aprobados y observados</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={DATOS_MENSUALES} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="mes" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(222 47% 14%)", border: "1px solid hsl(217 33% 22%)", borderRadius: "8px", fontSize: 12 }}
                  labelStyle={{ color: "#f8fafc" }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <Bar dataKey="enviados" name="Enviados" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="aprobados" name="Aprobados" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="observados" name="Observados" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Por Estándar</CardTitle>
            <CardDescription>Distribución de indicadores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={DATOS_ESTANDAR}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="valor"
                >
                  {DATOS_ESTANDAR.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "hsl(222 47% 14%)", border: "1px solid hsl(217 33% 22%)", borderRadius: "8px", fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {DATOS_ESTANDAR.map((e) => (
                <div key={e.estandar} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: e.fill }} />
                  <span className="text-muted-foreground">{e.estandar}</span>
                  <span className="font-medium ml-auto">{e.valor}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forms table */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Estado de Formularios</CardTitle>
              <CardDescription>Progreso de llenado por formulario enviado</CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {FORMULARIOS_ENVIADOS.length} formularios
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {FORMULARIOS_ENVIADOS.map((form) => {
              const template = FORMULARIO_TEMPLATES.find((t) => t.id === form.templateId);
              const proyecto = PROYECTOS.find((p) => p.id === form.proyectoId);
              const estadoCfg = ESTADO_FORM_CONFIG[form.estado];
              return (
                <div key={form.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-all border border-transparent hover:border-border/50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{template?.nombre} - {form.usuarioEmail}</p>
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${estadoCfg.color}`}>
                        {estadoCfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{proyecto?.nombre}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template?.estandares.map((est) => (
                        <span key={est} className="text-xs bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">{est}</span>
                      ))}
                    </div>
                  </div>
                  <div className="w-full sm:w-48 shrink-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Progreso</span>
                      <span className={`text-xs font-semibold ${form.progreso >= 80 ? "text-emerald-400" : form.progreso >= 50 ? "text-amber-400" : "text-red-400"}`}>
                        {form.progreso}%
                      </span>
                    </div>
                    <Progress
                      value={form.progreso}
                      className="h-2 bg-secondary"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
