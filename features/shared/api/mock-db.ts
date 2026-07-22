import type { User } from "@/features/auth/model/types";
import type { Client } from "@/features/clients/model/types";
import type { Project } from "@/features/projects/model/types";
import type { Indicator } from "@/features/indicators/model/types";
import type { 
  FormTemplate, 
  FormSubmission, 
  QuestionResponse, 
  Comment, 
  HistoryEvent 
} from "@/features/forms/model/types";

// ============================================================
// MOCKS
// ============================================================

export const CLIENTS: Client[] = [
  { id: "c1", name: "Minera Andina S.A." },
  { id: "c2", name: "Grupo Textil Perú SAC" },
];

export const USERS: User[] = [
  { id: "u1", name: "Carlos Méndez", email: "admin@divelop.com", password: "123", role: "admin", avatar: "CM" },
  { id: "u2", name: "Sofía Quispe", email: "consultor@divelop.com", password: "123", role: "consultor", avatar: "SQ" },
  { id: "u3", name: "Gabriela Tito", email: "cliente@mineraandina.com", password: "123", role: "cliente", avatar: "GT", clientId: "c1" },
  { id: "u4", name: "Juan Pérez", email: "operador@mineraandina.com", password: "123", role: "usuario_cliente", avatar: "JP", clientId: "c1" },
];

export const PROJECTS: Project[] = [
  { id: "p1", clientId: "c1", name: "Reporte Sostenibilidad 2025", status: "activo", startDate: "2025-01-15", endDate: "2025-06-30" },
  { id: "p2", clientId: "c2", name: "Diagnóstico ODS", status: "activo", startDate: "2025-02-01", endDate: "2025-07-31" },
];

export const FORM_TEMPLATES: FormTemplate[] = [
  { 
    id: "ft1", 
    projectId: "p1", 
    name: "Métricas Ambientales Sede Norte", 
    questions: [
      { id: "q1", text: "Indique el consumo de energía eléctrica total (GJ)", type: "numero", indicatorIds: ["i1"] },
      { id: "q2", text: "¿Cuenta el Consejo con un mecanismo formal de supervisión climática?", type: "booleano", indicatorIds: ["i16"] },
      { id: "q3", text: "Describa el origen y porcentaje de las energías renovables utilizadas.", type: "texto", indicatorIds: ["i12", "i3"] }
    ] 
  },
  { 
    id: "ft2", 
    projectId: "p1", 
    name: "Indicadores Sociales y de Gobernanza", 
    questions: [
      { id: "q4", text: "Número total de nuevas contrataciones en el periodo", type: "numero", indicatorIds: ["i6"] },
      { id: "q5", text: "Porcentaje de operaciones que han sido evaluadas por riesgos de corrupción", type: "numero", indicatorIds: ["i9"] },
    ]
  },
];

export const FORM_SUBMISSIONS: FormSubmission[] = [
  { id: "fe1", templateId: "ft1", projectId: "p1", userEmail: "operador@mineraandina.com", status: "aprobado", progress: 100 },
  { id: "fe2", templateId: "ft1", projectId: "p1", userEmail: "cliente@mineraandina.com", status: "enviado", progress: 100 },
  { id: "fe3", templateId: "ft2", projectId: "p1", userEmail: "cliente@mineraandina.com", status: "observado", progress: 75 },
];

export const INDICATORS: Indicator[] = [
  { id: "i1", code: "GRI 302-1", name: "Consumo de energía dentro de la organización", description: "Energía consumida internamente.", standard: "GRI", category: "Ambiental", dataType: "numero", unit: "GJ" },
  { id: "i3", code: "GRI 305-1", name: "Emisiones directas de GEI (Alcance 1)", description: "Emisiones directas de gases de efecto invernadero.", standard: "GRI", category: "Ambiental", dataType: "numero", unit: "tCO₂e" },
  { id: "i6", code: "GRI 401-1", name: "Nuevas contrataciones y rotación", description: "Número de contrataciones.", standard: "GRI", category: "Social", dataType: "numero", unit: "personas" },
  { id: "i9", code: "GRI 205-1", name: "Operaciones evaluadas por riesgos de corrupción", description: "Porcentaje de operaciones evaluadas.", standard: "GRI", category: "Gobernanza", dataType: "porcentaje", unit: "%" },
  { id: "i16", code: "TCFD-R1", name: "Supervisión del Consejo sobre riesgos climáticos", description: "¿El Consejo supervisa formalmente los riesgos?", standard: "TCFD", category: "Gobernanza", dataType: "booleano" },
  { id: "i12", code: "ODS 7.2", name: "Participación de energías renovables", description: "Porcentaje de energía renovable.", standard: "ODS", category: "Ambiental", dataType: "porcentaje", unit: "%" },
];

export const RESPONSES: QuestionResponse[] = [
  { id: "r1", submissionId: "fe1", questionId: "q1", value: 45230 },
  { id: "r2", submissionId: "fe1", questionId: "q2", value: true },
  { id: "r3", submissionId: "fe1", questionId: "q3", value: "El 20% provino de paneles solares propios, compensando las emisiones directas." },
  
  { id: "r4", submissionId: "fe3", questionId: "q4", value: 145 },
  { id: "r5", submissionId: "fe3", questionId: "q5", value: null },
];

export const COMMENTS: Comment[] = [
  { id: "c1", submissionId: "fe1", author: "Juan Pérez", role: "usuario_cliente", text: "He subido la evidencia del consumo energético.", date: "2025-03-10", isEvidence: true, fileName: "recibos_energia.pdf" },
  { id: "c2", submissionId: "fe1", author: "Sofía Quispe", role: "consultor", text: "Revisado, conforme.", date: "2025-03-12" },
  { id: "c3", submissionId: "fe3", author: "Sofía Quispe", role: "consultor", text: "Falta completar sección de Gobernanza.", date: "2025-03-15" },
];

export const HISTORY: HistoryEvent[] = [
  { id: "h1", submissionId: "fe1", event: "Formulario asignado a Juan Pérez", author: "Sofía Quispe", date: "2025-02-01 10:00" },
  { id: "h2", submissionId: "fe1", event: "Cambiado a estado Enviado", author: "Juan Pérez", date: "2025-03-10 15:30" },
  { id: "h3", submissionId: "fe1", event: "Cambiado a estado Aprobado", author: "Sofía Quispe", date: "2025-03-12 09:15" },
];

// ============================================================
// HELPERS
// ============================================================

export const FORM_STATUS_CONFIG = {
  borrador: { label: "Borrador", color: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
  enviado: { label: "Enviado", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  observado: { label: "Observado", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  aprobado: { label: "Aprobado", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
};

export const STANDARD_CONFIG = {
  GRI: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  SASB: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  ODS: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  TCFD: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  Manual: { color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20" },
};

export const CATEGORY_CONFIG = {
  Ambiental: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  Social: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-400" },
  Gobernanza: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", dot: "bg-purple-400" },
};

export const MONTHLY_DATA = [
  { mes: "Ene", enviados: 8, aprobados: 5, observados: 2 },
  { mes: "Feb", enviados: 12, aprobados: 9, observados: 3 },
  { mes: "Mar", enviados: 18, aprobados: 14, observados: 4 },
];

export const CATEGORY_DATA = [
  { categoria: "Ambiental", GRI: 8, SASB: 3, ODS: 4, TCFD: 2 },
  { categoria: "Social", GRI: 5, SASB: 2, ODS: 3, TCFD: 0 },
  { categoria: "Gobernanza", GRI: 3, SASB: 1, ODS: 2, TCFD: 2 },
];

export const STANDARD_DATA = [
  { estandar: "GRI", valor: 45, fill: "#10b981" },
  { estandar: "SASB", valor: 25, fill: "#3b82f6" },
  { estandar: "ODS", valor: 20, fill: "#f59e0b" },
  { estandar: "TCFD", valor: 10, fill: "#8b5cf6" },
];

// ============================================================
// ENHANCED REPORTING DATA
// ============================================================

/** Target values for each numerical indicator (GAP Analysis) */
export const INDICATOR_TARGETS: Record<string, { target: number; unit: string; direction: "lower_is_better" | "higher_is_better" }> = {
  "i1": { target: 40000, unit: "GJ",      direction: "lower_is_better" },
  "i3": { target: 10000, unit: "tCO₂e",   direction: "lower_is_better" },
  "i6": { target: 200,   unit: "personas", direction: "higher_is_better" },
  "i9": { target: 100,   unit: "%",        direction: "higher_is_better" },
  "i12": { target: 30,   unit: "%",        direction: "higher_is_better" },
};

/** Historical responses from the previous reporting period (2024) for YoY comparison */
export const HISTORICAL_RESPONSES: Array<{ indicatorId: string; value: number; year: number }> = [
  { indicatorId: "i1",  value: 51200,  year: 2024 },
  { indicatorId: "i3",  value: 14800,  year: 2024 },
  { indicatorId: "i6",  value: 98,     year: 2024 },
  { indicatorId: "i9",  value: 62,     year: 2024 },
  { indicatorId: "i12", value: 12,     year: 2024 },

  { indicatorId: "i1",  value: 45230,  year: 2025 },
  { indicatorId: "i3",  value: 11200,  year: 2025 },
  { indicatorId: "i6",  value: 145,    year: 2025 },
  { indicatorId: "i9",  value: 75,     year: 2025 },
  { indicatorId: "i12", value: 20,     year: 2025 },
];

/** Timeline events for the activity view */
export const TIMELINE_EVENTS = [
  { id: "e1", projectId: "p1", type: "asignacion",  title: "Formulario asignado",            detail: "Métricas Ambientales → Juan Pérez",     date: "2025-02-01", actor: "Sofía Quispe"    },
  { id: "e2", projectId: "p1", type: "asignacion",  title: "Formulario asignado",            detail: "Métricas Ambientales → Gabriela Tito",  date: "2025-02-01", actor: "Sofía Quispe"    },
  { id: "e3", projectId: "p1", type: "envio",       title: "Formulario enviado",             detail: "Juan Pérez completó Métricas Ambientales", date: "2025-03-10", actor: "Juan Pérez"   },
  { id: "e4", projectId: "p1", type: "aprobacion",  title: "Formulario aprobado",            detail: "Métricas Ambientales — Juan Pérez",     date: "2025-03-12", actor: "Sofía Quispe"    },
  { id: "e5", projectId: "p1", type: "observacion", title: "Formulario con observación",     detail: "Falta completar Gobernanza",            date: "2025-03-15", actor: "Sofía Quispe"    },
  { id: "e6", projectId: "p1", type: "envio",       title: "Formulario enviado",             detail: "Gabriela Tito envió Métricas Ambientales", date: "2025-04-02", actor: "Gabriela Tito" },
];

