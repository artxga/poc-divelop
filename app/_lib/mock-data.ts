// ============================================================
// TIPOS
// ============================================================

export type UserRole = "admin" | "consultor" | "cliente";

export interface User {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: UserRole;
  avatar: string;
}

export type IndicadorEstandar = "GRI" | "SASB" | "ODS" | "TCFD" | "Manual";
export type IndicadorCategoria = "Ambiental" | "Social" | "Gobernanza";
export type IndicadorTipoDato = "numero" | "texto" | "porcentaje" | "booleano" | "seleccion";

export interface Indicador {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  estandar: IndicadorEstandar;
  categoria: IndicadorCategoria;
  tipoDato: IndicadorTipoDato;
  unidad?: string;
  opciones?: string[];
}

export type ProyectoEstado = "activo" | "pausado" | "completado";

export interface Proyecto {
  id: string;
  nombre: string;
  cliente: string;
  consultor: string;
  estado: ProyectoEstado;
  fechaInicio: string;
  fechaFin: string;
  estandares: IndicadorEstandar[];
  progreso: number;
}

export type RespuestaEstado = "borrador" | "enviado" | "observado" | "aprobado";

export interface Comentario {
  id: string;
  autor: string;
  rol: UserRole;
  texto: string;
  fecha: string;
}

export interface RespuestaIndicador {
  id: string;
  proyectoId: string;
  indicadorId: string;
  valor: string | number | boolean | null;
  estado: RespuestaEstado;
  ultimaEdicion: string;
  autor: string;
  comentarios: Comentario[];
}

// ============================================================
// USUARIOS MOCK
// ============================================================

export const USUARIOS: User[] = [
  {
    id: "u1",
    nombre: "Carlos Méndez",
    email: "admin@divelop.com",
    password: "admin123",
    rol: "admin",
    avatar: "CM",
  },
  {
    id: "u2",
    nombre: "Sofía Quispe",
    email: "consultor@divelop.com",
    password: "consultor123",
    rol: "consultor",
    avatar: "SQ",
  },
  {
    id: "u3",
    nombre: "Gabriela Tito",
    email: "cliente@divelop.com",
    password: "cliente123",
    rol: "cliente",
    avatar: "GT",
  },
];

// ============================================================
// INDICADORES MOCK
// ============================================================

export const INDICADORES: Indicador[] = [
  // GRI - Ambiental
  {
    id: "i1",
    codigo: "GRI 302-1",
    nombre: "Consumo de energía dentro de la organización",
    descripcion: "Energía consumida internamente, por tipo de combustible y fuente renovable/no renovable.",
    estandar: "GRI",
    categoria: "Ambiental",
    tipoDato: "numero",
    unidad: "GJ",
  },
  {
    id: "i2",
    codigo: "GRI 303-1",
    nombre: "Interacciones con el agua como recurso compartido",
    descripcion: "Volumen total de agua captada de todas las áreas y fuentes.",
    estandar: "GRI",
    categoria: "Ambiental",
    tipoDato: "numero",
    unidad: "m³",
  },
  {
    id: "i3",
    codigo: "GRI 305-1",
    nombre: "Emisiones directas de GEI (Alcance 1)",
    descripcion: "Emisiones directas de gases de efecto invernadero de la organización.",
    estandar: "GRI",
    categoria: "Ambiental",
    tipoDato: "numero",
    unidad: "tCO₂e",
  },
  {
    id: "i4",
    codigo: "GRI 305-2",
    nombre: "Emisiones indirectas de GEI (Alcance 2)",
    descripcion: "Emisiones indirectas de GEI provenientes de electricidad, calor, vapor adquiridos.",
    estandar: "GRI",
    categoria: "Ambiental",
    tipoDato: "numero",
    unidad: "tCO₂e",
  },
  {
    id: "i5",
    codigo: "GRI 306-3",
    nombre: "Residuos generados",
    descripcion: "Peso total de residuos generados, por tipo y método de disposición.",
    estandar: "GRI",
    categoria: "Ambiental",
    tipoDato: "numero",
    unidad: "toneladas",
  },
  // GRI - Social
  {
    id: "i6",
    codigo: "GRI 401-1",
    nombre: "Nuevas contrataciones y rotación de empleados",
    descripcion: "Número y tasa de nuevas contrataciones de empleados y rotación durante el período.",
    estandar: "GRI",
    categoria: "Social",
    tipoDato: "numero",
    unidad: "personas",
  },
  {
    id: "i7",
    codigo: "GRI 403-9",
    nombre: "Lesiones relacionadas con el trabajo",
    descripcion: "Número de lesiones relacionadas con el trabajo, incluyendo accidentes mortales.",
    estandar: "GRI",
    categoria: "Social",
    tipoDato: "numero",
    unidad: "casos",
  },
  {
    id: "i8",
    codigo: "GRI 405-1",
    nombre: "Diversidad en órganos de gobierno y empleados",
    descripcion: "Porcentaje de mujeres en posiciones de liderazgo y en la plantilla total.",
    estandar: "GRI",
    categoria: "Social",
    tipoDato: "porcentaje",
    unidad: "%",
  },
  // GRI - Gobernanza
  {
    id: "i9",
    codigo: "GRI 205-1",
    nombre: "Operaciones evaluadas por riesgos de corrupción",
    descripcion: "Número y porcentaje de operaciones evaluadas en relación con riesgos de corrupción.",
    estandar: "GRI",
    categoria: "Gobernanza",
    tipoDato: "porcentaje",
    unidad: "%",
  },
  // SASB
  {
    id: "i10",
    codigo: "SASB EM-MM-110a.1",
    nombre: "Intensidad de GEI por ingresos",
    descripcion: "Emisiones totales de GEI por millón de dólares de ingresos.",
    estandar: "SASB",
    categoria: "Ambiental",
    tipoDato: "numero",
    unidad: "tCO₂e/M$",
  },
  {
    id: "i11",
    codigo: "SASB HC-BP-140a.1",
    nombre: "Gasto en I+D para productos de salud",
    descripcion: "Gasto total en investigación y desarrollo de productos para la salud.",
    estandar: "SASB",
    categoria: "Social",
    tipoDato: "numero",
    unidad: "USD",
  },
  // ODS
  {
    id: "i12",
    codigo: "ODS 7.2",
    nombre: "Participación de energías renovables",
    descripcion: "Porcentaje de energía renovable en el consumo total de energía de la organización.",
    estandar: "ODS",
    categoria: "Ambiental",
    tipoDato: "porcentaje",
    unidad: "%",
  },
  {
    id: "i13",
    codigo: "ODS 8.5",
    nombre: "Empleos decentes y crecimiento económico",
    descripcion: "Número de empleos directos e indirectos generados por la organización.",
    estandar: "ODS",
    categoria: "Social",
    tipoDato: "numero",
    unidad: "personas",
  },
  {
    id: "i14",
    codigo: "ODS 13.1",
    nombre: "Resiliencia ante riesgos climáticos",
    descripcion: "¿La organización cuenta con un plan de adaptación al cambio climático?",
    estandar: "ODS",
    categoria: "Ambiental",
    tipoDato: "booleano",
  },
  {
    id: "i15",
    codigo: "ODS 16.6",
    nombre: "Instituciones eficaces y transparentes",
    descripcion: "Porcentaje de procesos con auditoría interna completada.",
    estandar: "ODS",
    categoria: "Gobernanza",
    tipoDato: "porcentaje",
    unidad: "%",
  },
  // TCFD
  {
    id: "i16",
    codigo: "TCFD-R1",
    nombre: "Supervisión del Consejo sobre riesgos climáticos",
    descripcion: "¿El Consejo supervisa formalmente los riesgos y oportunidades relacionados con el clima?",
    estandar: "TCFD",
    categoria: "Gobernanza",
    tipoDato: "booleano",
  },
  {
    id: "i17",
    codigo: "TCFD-M1",
    nombre: "Métricas de riesgo climático físico",
    descripcion: "Descripción de las métricas utilizadas para evaluar el riesgo climático físico.",
    estandar: "TCFD",
    categoria: "Ambiental",
    tipoDato: "texto",
  },
];

// ============================================================
// PROYECTOS MOCK
// ============================================================

export const PROYECTOS: Proyecto[] = [
  {
    id: "p1",
    nombre: "Reporte GRI 2025 — Minera Andina",
    cliente: "Minera Andina S.A.",
    consultor: "Sofía Quispe",
    estado: "activo",
    fechaInicio: "2025-01-15",
    fechaFin: "2025-06-30",
    estandares: ["GRI", "TCFD"],
    progreso: 72,
  },
  {
    id: "p2",
    nombre: "Diagnóstico ODS — Grupo Textil Perú",
    cliente: "Grupo Textil Perú SAC",
    consultor: "Sofía Quispe",
    estado: "activo",
    fechaInicio: "2025-02-01",
    fechaFin: "2025-07-31",
    estandares: ["ODS", "GRI"],
    progreso: 45,
  },
  {
    id: "p3",
    nombre: "SASB Assessment — Banco Inca",
    cliente: "Banco Inca S.A.",
    consultor: "Sofía Quispe",
    estado: "activo",
    fechaInicio: "2025-03-10",
    fechaFin: "2025-09-10",
    estandares: ["SASB", "TCFD"],
    progreso: 28,
  },
  {
    id: "p4",
    nombre: "Reporte ESG Integral — Inmobiliaria Sur",
    cliente: "Inmobiliaria Sur S.A.C.",
    consultor: "Sofía Quispe",
    estado: "pausado",
    fechaInicio: "2024-11-01",
    fechaFin: "2025-04-30",
    estandares: ["GRI", "SASB", "ODS"],
    progreso: 61,
  },
  {
    id: "p5",
    nombre: "Reporte GRI 2024 — Agroexportadora Norte",
    cliente: "Agroexportadora Norte SRL",
    consultor: "Sofía Quispe",
    estado: "completado",
    fechaInicio: "2024-06-01",
    fechaFin: "2024-12-31",
    estandares: ["GRI"],
    progreso: 100,
  },
];

// ============================================================
// RESPUESTAS MOCK
// ============================================================

export const RESPUESTAS: RespuestaIndicador[] = [
  // Proyecto p1 - Minera Andina
  { id: "r1", proyectoId: "p1", indicadorId: "i1", valor: 45230, estado: "aprobado", ultimaEdicion: "2025-03-15", autor: "Gabriela Tito", comentarios: [
    { id: "c1", autor: "Sofía Quispe", rol: "consultor", texto: "Confirmar si incluye consumo de sede administrativa.", fecha: "2025-03-10" },
    { id: "c2", autor: "Gabriela Tito", rol: "cliente", texto: "Sí, incluye todas las sedes operativas y administrativas.", fecha: "2025-03-12" },
  ]},
  { id: "r2", proyectoId: "p1", indicadorId: "i3", valor: 12450, estado: "aprobado", ultimaEdicion: "2025-03-18", autor: "Gabriela Tito", comentarios: [] },
  { id: "r3", proyectoId: "p1", indicadorId: "i4", valor: 8320, estado: "observado", ultimaEdicion: "2025-03-20", autor: "Gabriela Tito", comentarios: [
    { id: "c3", autor: "Sofía Quispe", rol: "consultor", texto: "El valor no coincide con la facturación eléctrica proporcionada. Favor verificar.", fecha: "2025-03-21" },
  ]},
  { id: "r4", proyectoId: "p1", indicadorId: "i5", valor: 340, estado: "enviado", ultimaEdicion: "2025-03-22", autor: "Gabriela Tito", comentarios: [] },
  { id: "r5", proyectoId: "p1", indicadorId: "i8", valor: 38, estado: "aprobado", ultimaEdicion: "2025-03-14", autor: "Gabriela Tito", comentarios: [] },
  { id: "r6", proyectoId: "p1", indicadorId: "i9", valor: 85, estado: "borrador", ultimaEdicion: "2025-03-25", autor: "Gabriela Tito", comentarios: [] },
  { id: "r7", proyectoId: "p1", indicadorId: "i16", valor: true, estado: "aprobado", ultimaEdicion: "2025-03-08", autor: "Gabriela Tito", comentarios: [] },
  { id: "r8", proyectoId: "p1", indicadorId: "i17", valor: "El Consejo de Directores recibe informes trimestrales sobre riesgos climáticos físicos y de transición.", estado: "enviado", ultimaEdicion: "2025-03-23", autor: "Gabriela Tito", comentarios: [] },

  // Proyecto p2 - Textil Perú
  { id: "r9", proyectoId: "p2", indicadorId: "i12", valor: 22, estado: "enviado", ultimaEdicion: "2025-04-05", autor: "Gabriela Tito", comentarios: [] },
  { id: "r10", proyectoId: "p2", indicadorId: "i13", valor: 1240, estado: "aprobado", ultimaEdicion: "2025-04-02", autor: "Gabriela Tito", comentarios: [] },
  { id: "r11", proyectoId: "p2", indicadorId: "i14", valor: false, estado: "observado", ultimaEdicion: "2025-04-07", autor: "Gabriela Tito", comentarios: [
    { id: "c4", autor: "Sofía Quispe", rol: "consultor", texto: "Se recomienda iniciar la elaboración del plan. Adjunto plantilla referencial.", fecha: "2025-04-08" },
  ]},
  { id: "r12", proyectoId: "p2", indicadorId: "i6", valor: null, estado: "borrador", ultimaEdicion: "2025-04-10", autor: "Gabriela Tito", comentarios: [] },

  // Proyecto p3 - Banco Inca
  { id: "r13", proyectoId: "p3", indicadorId: "i10", valor: 2.4, estado: "borrador", ultimaEdicion: "2025-05-01", autor: "Gabriela Tito", comentarios: [] },
  { id: "r14", proyectoId: "p3", indicadorId: "i11", valor: 450000, estado: "enviado", ultimaEdicion: "2025-05-03", autor: "Gabriela Tito", comentarios: [] },
];

// ============================================================
// DATOS PARA GRÁFICAS
// ============================================================

export const DATOS_MENSUALES = [
  { mes: "Ene", enviados: 8, aprobados: 5, observados: 2 },
  { mes: "Feb", enviados: 12, aprobados: 9, observados: 3 },
  { mes: "Mar", enviados: 18, aprobados: 14, observados: 4 },
  { mes: "Abr", enviados: 15, aprobados: 11, observados: 2 },
  { mes: "May", enviados: 22, aprobados: 16, observados: 5 },
  { mes: "Jun", enviados: 20, aprobados: 17, observados: 3 },
];

export const DATOS_CATEGORIA = [
  { categoria: "Ambiental", GRI: 8, SASB: 3, ODS: 4, TCFD: 2 },
  { categoria: "Social", GRI: 5, SASB: 2, ODS: 3, TCFD: 0 },
  { categoria: "Gobernanza", GRI: 3, SASB: 1, ODS: 2, TCFD: 2 },
];

export const DATOS_ESTANDAR = [
  { estandar: "GRI", valor: 16, fill: "#10b981" },
  { estandar: "SASB", valor: 6, fill: "#3b82f6" },
  { estandar: "ODS", valor: 8, fill: "#f59e0b" },
  { estandar: "TCFD", valor: 4, fill: "#8b5cf6" },
];

// ============================================================
// HELPERS
// ============================================================

export function getIndicadoresByEstandar(estandar: IndicadorEstandar): Indicador[] {
  return INDICADORES.filter((i) => i.estandar === estandar);
}

export function getRespuestasByProyecto(proyectoId: string): RespuestaIndicador[] {
  return RESPUESTAS.filter((r) => r.proyectoId === proyectoId);
}

export function getProgresoProyecto(proyectoId: string): {
  total: number;
  borrador: number;
  enviado: number;
  observado: number;
  aprobado: number;
  porcentaje: number;
} {
  const respuestas = getRespuestasByProyecto(proyectoId);
  const total = respuestas.length;
  const counts = {
    borrador: respuestas.filter((r) => r.estado === "borrador").length,
    enviado: respuestas.filter((r) => r.estado === "enviado").length,
    observado: respuestas.filter((r) => r.estado === "observado").length,
    aprobado: respuestas.filter((r) => r.estado === "aprobado").length,
  };
  const porcentaje = total > 0 ? Math.round((counts.aprobado / total) * 100) : 0;
  return { total, ...counts, porcentaje };
}

export const ESTADO_CONFIG = {
  borrador: { label: "Borrador", color: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
  enviado: { label: "Enviado", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  observado: { label: "Observado", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  aprobado: { label: "Aprobado", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
};

export const CATEGORIA_CONFIG = {
  Ambiental: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  Social: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-400" },
  Gobernanza: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", dot: "bg-purple-400" },
};

export const ESTANDAR_CONFIG = {
  GRI: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  SASB: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  ODS: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  TCFD: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  Manual: { color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20" },
};
