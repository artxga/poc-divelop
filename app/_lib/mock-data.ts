// ============================================================
// TIPOS
// ============================================================

export type UserRole = "admin" | "consultor" | "cliente" | "usuario_cliente";

export interface User {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: UserRole;
  avatar: string;
  clienteId?: string; // Para vincular usuarios de cliente a un cliente específico
}

export interface Cliente {
  id: string;
  nombre: string;
}

export type ProyectoEstado = "activo" | "pausado" | "completado";

export interface Proyecto {
  id: string;
  clienteId: string;
  nombre: string;
  estado: ProyectoEstado;
  fechaInicio: string;
  fechaFin: string;
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

export interface FormularioTemplate {
  id: string;
  proyectoId: string;
  nombre: string;
  indicadores: string[];
}

export type FormEstado = "borrador" | "enviado" | "observado" | "aprobado";

export interface FormularioEnviado {
  id: string;
  templateId: string;
  proyectoId: string;
  usuarioEmail: string;
  estado: FormEstado;
  progreso: number;
}

export interface RespuestaIndicador {
  id: string;
  envioId: string;
  indicadorId: string;
  valor: string | number | boolean | null;
}

export interface Comentario {
  id: string;
  envioId: string;
  autor: string;
  rol: UserRole;
  texto: string;
  fecha: string;
  isEvidencia?: boolean;
  fileName?: string;
}

export interface Historial {
  id: string;
  envioId: string;
  evento: string;
  autor: string;
  fecha: string;
}

// ============================================================
// MOCKS
// ============================================================

export const CLIENTES: Cliente[] = [
  { id: "c1", nombre: "Minera Andina S.A." },
  { id: "c2", nombre: "Grupo Textil Perú SAC" },
];

export const USUARIOS: User[] = [
  { id: "u1", nombre: "Carlos Méndez", email: "admin@divelop.com", password: "123", rol: "admin", avatar: "CM" },
  { id: "u2", nombre: "Sofía Quispe", email: "consultor@divelop.com", password: "123", rol: "consultor", avatar: "SQ" },
  { id: "u3", nombre: "Gabriela Tito", email: "cliente@mineraandina.com", password: "123", rol: "cliente", avatar: "GT", clienteId: "c1" },
  { id: "u4", nombre: "Juan Pérez", email: "operador@mineraandina.com", password: "123", rol: "usuario_cliente", avatar: "JP", clienteId: "c1" },
];

export const PROYECTOS: Proyecto[] = [
  { id: "p1", clienteId: "c1", nombre: "Reporte Sostenibilidad 2025", estado: "activo", fechaInicio: "2025-01-15", fechaFin: "2025-06-30" },
  { id: "p2", clienteId: "c2", nombre: "Diagnóstico ODS", estado: "activo", fechaInicio: "2025-02-01", fechaFin: "2025-07-31" },
];

export const FORMULARIO_TEMPLATES: FormularioTemplate[] = [
  { id: "ft1", proyectoId: "p1", nombre: "Métricas Ambientales Sede Norte", indicadores: ["i1", "i3", "i12", "i16"] },
  { id: "ft2", proyectoId: "p1", nombre: "Indicadores Sociales y de Gobernanza", indicadores: ["i6", "i9", "i16"] },
];

export const FORMULARIOS_ENVIADOS: FormularioEnviado[] = [
  { id: "fe1", templateId: "ft1", proyectoId: "p1", usuarioEmail: "operador@mineraandina.com", estado: "aprobado", progreso: 100 },
  { id: "fe2", templateId: "ft1", proyectoId: "p1", usuarioEmail: "cliente@mineraandina.com", estado: "enviado", progreso: 100 },
  { id: "fe3", templateId: "ft2", proyectoId: "p1", usuarioEmail: "cliente@mineraandina.com", estado: "observado", progreso: 75 },
];

export const INDICADORES: Indicador[] = [
  { id: "i1", codigo: "GRI 302-1", nombre: "Consumo de energía dentro de la organización", descripcion: "Energía consumida internamente.", estandar: "GRI", categoria: "Ambiental", tipoDato: "numero", unidad: "GJ" },
  { id: "i3", codigo: "GRI 305-1", nombre: "Emisiones directas de GEI (Alcance 1)", descripcion: "Emisiones directas de gases de efecto invernadero.", estandar: "GRI", categoria: "Ambiental", tipoDato: "numero", unidad: "tCO₂e" },
  { id: "i6", codigo: "GRI 401-1", nombre: "Nuevas contrataciones y rotación", descripcion: "Número de contrataciones.", estandar: "GRI", categoria: "Social", tipoDato: "numero", unidad: "personas" },
  { id: "i9", codigo: "GRI 205-1", nombre: "Operaciones evaluadas por riesgos de corrupción", descripcion: "Porcentaje de operaciones evaluadas.", estandar: "GRI", categoria: "Gobernanza", tipoDato: "porcentaje", unidad: "%" },
  { id: "i16", codigo: "TCFD-R1", nombre: "Supervisión del Consejo sobre riesgos climáticos", descripcion: "¿El Consejo supervisa formalmente los riesgos?", estandar: "TCFD", categoria: "Gobernanza", tipoDato: "booleano" },
  { id: "i12", codigo: "ODS 7.2", nombre: "Participación de energías renovables", descripcion: "Porcentaje de energía renovable.", estandar: "ODS", categoria: "Ambiental", tipoDato: "porcentaje", unidad: "%" },
];

export const RESPUESTAS: RespuestaIndicador[] = [
  { id: "r1", envioId: "fe1", indicadorId: "i1", valor: 45230 },
  { id: "r2", envioId: "fe1", indicadorId: "i3", valor: 12450 },
  { id: "r3", envioId: "fe1", indicadorId: "i16", valor: true },
  
  { id: "r4", envioId: "fe3", indicadorId: "i6", valor: 145 },
  { id: "r5", envioId: "fe3", indicadorId: "i9", valor: null },
];

export const COMENTARIOS: Comentario[] = [
  { id: "c1", envioId: "fe1", autor: "Juan Pérez", rol: "usuario_cliente", texto: "He subido la evidencia del consumo energético.", fecha: "2025-03-10", isEvidencia: true, fileName: "recibos_energia.pdf" },
  { id: "c2", envioId: "fe1", autor: "Sofía Quispe", rol: "consultor", texto: "Revisado, conforme.", fecha: "2025-03-12" },
  { id: "c3", envioId: "fe3", autor: "Sofía Quispe", rol: "consultor", texto: "Falta completar sección de Gobernanza.", fecha: "2025-03-15" },
];

export const HISTORIAL: Historial[] = [
  { id: "h1", envioId: "fe1", evento: "Formulario asignado a Juan Pérez", autor: "Sofía Quispe", fecha: "2025-02-01 10:00" },
  { id: "h2", envioId: "fe1", evento: "Cambiado a estado Enviado", autor: "Juan Pérez", fecha: "2025-03-10 15:30" },
  { id: "h3", envioId: "fe1", evento: "Cambiado a estado Aprobado", autor: "Sofía Quispe", fecha: "2025-03-12 09:15" },
];

// ============================================================
// HELPERS
// ============================================================

export const ESTADO_FORM_CONFIG = {
  borrador: { label: "Borrador", color: "bg-slate-500/20 text-slate-300 border-slate-500/30" },
  enviado: { label: "Enviado", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  observado: { label: "Observado", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  aprobado: { label: "Aprobado", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
};

export const ESTANDAR_CONFIG = {
  GRI: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  SASB: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  ODS: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  TCFD: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  Manual: { color: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/20" },
};

export const CATEGORIA_CONFIG = {
  Ambiental: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  Social: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-400" },
  Gobernanza: { color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", dot: "bg-purple-400" },
};

export const DATOS_MENSUALES = [
  { mes: "Ene", enviados: 8, aprobados: 5, observados: 2 },
  { mes: "Feb", enviados: 12, aprobados: 9, observados: 3 },
  { mes: "Mar", enviados: 18, aprobados: 14, observados: 4 },
];

export const DATOS_CATEGORIA = [
  { categoria: "Ambiental", GRI: 8, SASB: 3, ODS: 4, TCFD: 2 },
  { categoria: "Social", GRI: 5, SASB: 2, ODS: 3, TCFD: 0 },
  { categoria: "Gobernanza", GRI: 3, SASB: 1, ODS: 2, TCFD: 2 },
];

export const DATOS_ESTANDAR = [
  { estandar: "GRI", valor: 45, fill: "#10b981" },
  { estandar: "SASB", valor: 25, fill: "#3b82f6" },
  { estandar: "ODS", valor: 20, fill: "#f59e0b" },
  { estandar: "TCFD", valor: 10, fill: "#8b5cf6" },
];
