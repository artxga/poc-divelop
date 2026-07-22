/**
 * Mock HTML report generator for ESG reports.
 * Generates styled HTML strings that can be downloaded as .html files
 * and open as professional-looking documents in any browser.
 */

export interface GeneratedReport {
  id: string;
  name: string;
  date: string;
  project: string;
  pages: number;
  templateId: string;
}

export const MOCK_GENERATED_REPORTS: GeneratedReport[] = [
  {
    id: "rep1",
    name: "Análisis ESG — Métricas Ambientales Sede Norte",
    date: "2025-03-14",
    project: "Reporte Sostenibilidad 2025",
    pages: 8,
    templateId: "ft1",
  },
  {
    id: "rep2",
    name: "Resumen Ejecutivo — Indicadores Sociales y de Gobernanza Q1",
    date: "2025-04-02",
    project: "Reporte Sostenibilidad 2025",
    pages: 5,
    templateId: "ft2",
  },
];

// ─── Shared CSS ───────────────────────────────────────────────────────────────
const BASE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #f8fafc; color: #1e293b; font-size: 14px; line-height: 1.6; }
  .page { max-width: 900px; margin: 0 auto; background: #fff; min-height: 100vh; }
  .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #064e3b 100%); padding: 48px 56px 40px; color: #fff; }
  .header-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
  .header-logo-icon { width: 40px; height: 40px; background: rgba(16,185,129,0.25); border: 1px solid rgba(16,185,129,0.4); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .header-logo-name { font-size: 16px; font-weight: 700; color: #10b981; letter-spacing: -0.02em; }
  .header-title { font-size: 28px; font-weight: 800; line-height: 1.2; letter-spacing: -0.03em; margin-bottom: 8px; }
  .header-subtitle { font-size: 14px; color: rgba(255,255,255,0.55); font-weight: 400; }
  .header-meta { display: flex; gap: 24px; margin-top: 28px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); }
  .header-meta-item { display: flex; flex-direction: column; gap: 2px; }
  .header-meta-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.4); }
  .header-meta-value { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.85); }
  .body { padding: 48px 56px; }
  .section { margin-bottom: 40px; }
  .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
  .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
  .kpi-label { font-size: 11px; color: #64748b; font-weight: 500; margin-bottom: 4px; }
  .kpi-value { font-size: 28px; font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
  .kpi-unit { font-size: 13px; font-weight: 400; color: #94a3b8; margin-left: 4px; }
  .kpi-delta { font-size: 12px; font-weight: 600; margin-top: 6px; }
  .green { color: #10b981; } .red { color: #ef4444; } .amber { color: #f59e0b; } .blue { color: #3b82f6; } .purple { color: #8b5cf6; }
  .table-wrap { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  thead { background: #f1f5f9; }
  th { padding: 10px 16px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #475569; }
  td { padding: 12px 16px; border-top: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; }
  tr:hover td { background: #f8fafc; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .badge-green { background: #d1fae5; color: #065f46; }
  .badge-amber { background: #fef3c7; color: #92400e; }
  .badge-blue  { background: #dbeafe; color: #1e40af; }
  .badge-purple{ background: #ede9fe; color: #5b21b6; }
  .badge-gray  { background: #f1f5f9; color: #475569; }
  .bar-container { background: #e2e8f0; border-radius: 4px; height: 8px; margin-top: 6px; }
  .bar-fill { height: 8px; border-radius: 4px; }
  .progress-row { margin-bottom: 14px; }
  .progress-label { display: flex; justify-content: space-between; font-size: 12px; color: #475569; margin-bottom: 4px; }
  .callout { background: #f0fdf4; border-left: 3px solid #10b981; border-radius: 0 8px 8px 0; padding: 16px 20px; margin-bottom: 16px; }
  .callout-title { font-size: 12px; font-weight: 700; color: #065f46; margin-bottom: 4px; }
  .callout-text { font-size: 13px; color: #166534; line-height: 1.5; }
  .callout.warn { background: #fffbeb; border-color: #f59e0b; }
  .callout.warn .callout-title { color: #92400e; }
  .callout.warn .callout-text { color: #78350f; }
  .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 56px; display: flex; justify-content: space-between; align-items: center; margin-top: 40px; }
  .footer-brand { font-size: 12px; font-weight: 700; color: #10b981; }
  .footer-note { font-size: 11px; color: #94a3b8; }
  .ai-badge { display: inline-flex; align-items: center; gap: 6px; background: #ede9fe; border: 1px solid #c4b5fd; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 600; color: #5b21b6; margin-bottom: 20px; }
  .divider { border: none; border-top: 1px solid #e2e8f0; margin: 32px 0; }
  p { margin-bottom: 12px; color: #334155; line-height: 1.7; }
`;

// ─── Report 1 ─────────────────────────────────────────────────────────────────
function generateReport1(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Análisis ESG — Métricas Ambientales Sede Norte | Divelop</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="header-logo">
      <div class="header-logo-icon">🌿</div>
      <span class="header-logo-name">Divelop ESG</span>
    </div>
    <div class="header-title">Análisis ESG<br/>Métricas Ambientales Sede Norte</div>
    <div class="header-subtitle">Generado por IA · Reporte de Sostenibilidad</div>
    <div class="header-meta">
      <div class="header-meta-item">
        <span class="header-meta-label">Proyecto</span>
        <span class="header-meta-value">Reporte Sostenibilidad 2025</span>
      </div>
      <div class="header-meta-item">
        <span class="header-meta-label">Cliente</span>
        <span class="header-meta-value">Minera Andina S.A.</span>
      </div>
      <div class="header-meta-item">
        <span class="header-meta-label">Período</span>
        <span class="header-meta-value">Enero — Marzo 2025</span>
      </div>
      <div class="header-meta-item">
        <span class="header-meta-label">Fecha de emisión</span>
        <span class="header-meta-value">14 de marzo, 2025</span>
      </div>
    </div>
  </div>

  <div class="body">
    <span class="ai-badge">✦ Generado con Inteligencia Artificial · Divelop AI Engine v1.0</span>

    <!-- KPIs -->
    <div class="section">
      <div class="section-title">Indicadores Clave del Período</div>
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Consumo de Energía (GRI 302-1)</div>
          <div class="kpi-value" style="color:#3b82f6">45,230 <span class="kpi-unit">GJ</span></div>
          <div class="kpi-delta red">↑ 11.6% vs 2024</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Energía Renovable (ODS 7.2)</div>
          <div class="kpi-value" style="color:#10b981">20 <span class="kpi-unit">%</span></div>
          <div class="kpi-delta green">↑ 8 pp vs 2024</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Supervisión Climática (TCFD-R1)</div>
          <div class="kpi-value" style="color:#10b981; font-size:18px; padding-top:6px">Implementada</div>
          <div class="kpi-delta green">✓ Conforme</div>
        </div>
      </div>
    </div>

    <hr class="divider"/>

    <!-- Resumen ejecutivo -->
    <div class="section">
      <div class="section-title">Resumen Ejecutivo</div>
      <p>Durante el primer trimestre de 2025, Minera Andina S.A. registró un consumo energético total de <strong>45,230 GJ</strong> en su Sede Norte, lo que representa un incremento del 11.6% respecto al mismo período del año anterior (51,200 GJ en 2024). Si bien el valor absoluto es superior, este aumento se explica principalmente por la expansión de operaciones y el incremento de turnos productivos.</p>
      <p>En materia de energías renovables, se logró un avance significativo: el <strong>20% del consumo energético</strong> fue cubierto mediante fuentes renovables (paneles solares propios), lo que implica un incremento de 8 puntos porcentuales frente al 12% registrado en 2024. Este resultado posiciona a la empresa en trayectoria de cumplimiento hacia el objetivo del 30% para 2026.</p>
      <p>Respecto a la gobernanza climática, el Consejo Directivo cuenta desde enero de 2025 con un mecanismo formal de supervisión de riesgos climáticos, en línea con las recomendaciones del estándar TCFD, lo que representa un avance estratégico relevante.</p>
    </div>

    <!-- Progreso por indicador -->
    <div class="section">
      <div class="section-title">Progreso vs. Objetivos 2025</div>
      <div class="progress-row">
        <div class="progress-label">
          <span>Energía Renovable (ODS 7.2) — Objetivo: 30%</span>
          <span class="amber">67% del objetivo</span>
        </div>
        <div class="bar-container"><div class="bar-fill green" style="width:67%; background:#10b981;"></div></div>
      </div>
      <div class="progress-row">
        <div class="progress-label">
          <span>Reducción Consumo Energético — Objetivo: 40,000 GJ</span>
          <span class="red">88% del límite (en riesgo)</span>
        </div>
        <div class="bar-container"><div class="bar-fill" style="width:88%; background:#f59e0b;"></div></div>
      </div>
      <div class="progress-row">
        <div class="progress-label">
          <span>Supervisión Climática TCFD — Objetivo: Implementada</span>
          <span class="green">100% — Cumplido</span>
        </div>
        <div class="bar-container"><div class="bar-fill" style="width:100%; background:#10b981;"></div></div>
      </div>
    </div>

    <!-- Respuestas recolectadas -->
    <div class="section">
      <div class="section-title">Respuestas Recolectadas — Detalle por Envío</div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Pregunta</th>
              <th>Indicador</th>
              <th>Respondido por</th>
              <th>Valor</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Consumo de energía eléctrica total</td>
              <td><span class="badge badge-green">GRI 302-1</span></td>
              <td>Juan Pérez</td>
              <td><strong>45,230</strong> GJ</td>
              <td><span class="badge badge-green">Aprobado</span></td>
            </tr>
            <tr>
              <td>Supervisión climática del Consejo</td>
              <td><span class="badge badge-purple">TCFD-R1</span></td>
              <td>Juan Pérez</td>
              <td><strong>Sí</strong></td>
              <td><span class="badge badge-green">Aprobado</span></td>
            </tr>
            <tr>
              <td>Origen y porcentaje de energías renovables</td>
              <td><span class="badge badge-amber">ODS 7.2</span> <span class="badge badge-green">GRI 305-1</span></td>
              <td>Juan Pérez</td>
              <td style="max-width:200px; font-style:italic; color:#475569">"El 20% provino de paneles solares propios, compensando las emisiones directas."</td>
              <td><span class="badge badge-green">Aprobado</span></td>
            </tr>
            <tr style="opacity:0.6">
              <td>Consumo de energía eléctrica total</td>
              <td><span class="badge badge-green">GRI 302-1</span></td>
              <td>Gabriela Tito</td>
              <td>—</td>
              <td><span class="badge badge-blue">Enviado</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Análisis cualitativo -->
    <div class="section">
      <div class="section-title">Análisis de Respuestas Cualitativas</div>
      <div class="callout">
        <div class="callout-title">✦ Síntesis generada por IA — Fuentes de Energía Renovable</div>
        <div class="callout-text">La respuesta recolectada indica que la operación utiliza paneles solares propios como principal fuente de energía renovable, cubriendo el 20% del consumo total. Se menciona explícitamente que esta generación solar compensa parcialmente las emisiones directas (Alcance 1), lo que sugiere una estrategia de mitigación integrada. Se recomienda cuantificar el tonelaje de CO₂e compensado para fortalecer el reporte de GRI 305-1.</div>
      </div>
      <div class="callout warn">
        <div class="callout-title">⚠ Brecha Identificada</div>
        <div class="callout-text">No se especificó el porcentaje exacto atribuible a fuentes de terceros vs. generación propia. Para cumplir con el nivel de divulgación GRI 302-1b, se recomienda solicitar un desglose más detallado en la siguiente iteración del formulario.</div>
      </div>
    </div>

    <!-- Recomendaciones -->
    <div class="section">
      <div class="section-title">Recomendaciones</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Acción Recomendada</th><th>Prioridad</th><th>Plazo</th></tr></thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Escalar el programa solar para alcanzar el 30% de participación renovable en 2026</td>
              <td><span class="badge badge-green">Alta</span></td>
              <td>Q3 2025</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Implementar un sistema de monitoreo en tiempo real del consumo energético por área</td>
              <td><span class="badge badge-amber">Media</span></td>
              <td>Q4 2025</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Cuantificar las emisiones de Alcance 2 para completar el inventario GRI 305</td>
              <td><span class="badge badge-amber">Media</span></td>
              <td>Q2 2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="footer">
    <span class="footer-brand">Divelop Sostenibilidad S.A.C.</span>
    <span class="footer-note">Reporte generado por Divelop AI Engine · Uso interno y confidencial</span>
  </div>
</div>
</body>
</html>`;
}

// ─── Report 2 ─────────────────────────────────────────────────────────────────
function generateReport2(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Resumen Ejecutivo — Indicadores Sociales y de Gobernanza Q1 | Divelop</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="header-logo">
      <div class="header-logo-icon">🌿</div>
      <span class="header-logo-name">Divelop ESG</span>
    </div>
    <div class="header-title">Resumen Ejecutivo<br/>Indicadores Sociales y de Gobernanza Q1</div>
    <div class="header-subtitle">Generado por IA · Reporte de Sostenibilidad</div>
    <div class="header-meta">
      <div class="header-meta-item">
        <span class="header-meta-label">Proyecto</span>
        <span class="header-meta-value">Reporte Sostenibilidad 2025</span>
      </div>
      <div class="header-meta-item">
        <span class="header-meta-label">Cliente</span>
        <span class="header-meta-value">Minera Andina S.A.</span>
      </div>
      <div class="header-meta-item">
        <span class="header-meta-label">Período</span>
        <span class="header-meta-value">Enero — Marzo 2025</span>
      </div>
      <div class="header-meta-item">
        <span class="header-meta-label">Fecha de emisión</span>
        <span class="header-meta-value">02 de abril, 2025</span>
      </div>
    </div>
  </div>

  <div class="body">
    <span class="ai-badge">✦ Generado con Inteligencia Artificial · Divelop AI Engine v1.0</span>

    <!-- KPIs -->
    <div class="section">
      <div class="section-title">Indicadores Clave del Período</div>
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Nuevas Contrataciones (GRI 401-1)</div>
          <div class="kpi-value" style="color:#3b82f6">145 <span class="kpi-unit">personas</span></div>
          <div class="kpi-delta green">↑ 48% vs 2024 (98)</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Eval. Anticorrupción (GRI 205-1)</div>
          <div class="kpi-value" style="color:#f59e0b">75 <span class="kpi-unit">%</span></div>
          <div class="kpi-delta amber">Pendiente completar</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Estado del Formulario</div>
          <div class="kpi-value" style="color:#f59e0b; font-size:18px; padding-top:6px">Observado</div>
          <div class="kpi-delta amber">75% completado</div>
        </div>
      </div>
    </div>

    <hr class="divider"/>

    <!-- Resumen ejecutivo -->
    <div class="section">
      <div class="section-title">Resumen Ejecutivo</div>
      <p>En el primer trimestre de 2025, Minera Andina S.A. registró <strong>145 nuevas contrataciones</strong>, lo que representa un crecimiento del 48% respecto al mismo período del año anterior (98 en Q1 2024). Este notable incremento refleja la expansión operativa de la compañía y su compromiso con la generación de empleo directo.</p>
      <p>En relación al indicador de Gobernanza <strong>GRI 205-1</strong> (Operaciones evaluadas por riesgos de corrupción), se reportó que el <strong>75% de las operaciones</strong> cuentan con evaluaciones vigentes de riesgo de corrupción. Si bien este valor supera la mediana del sector minero en Latinoamérica (68%), aún existe una brecha respecto al objetivo del 100% de cobertura establecido para finales de 2025.</p>
      <p>Cabe señalar que el formulario se encuentra actualmente en estado <strong>Observado</strong>, con una pregunta pendiente de completar. El consultor a cargo solicitó información adicional respecto a la metodología utilizada para la evaluación de riesgos. Se estima que el formulario será completado y enviado a revisión final en los próximos días.</p>
    </div>

    <!-- Respuestas recolectadas -->
    <div class="section">
      <div class="section-title">Respuestas Recolectadas — Detalle</div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Pregunta</th>
              <th>Indicador</th>
              <th>Respondido por</th>
              <th>Valor</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Número total de nuevas contrataciones en el periodo</td>
              <td><span class="badge badge-green">GRI 401-1</span></td>
              <td>Gabriela Tito</td>
              <td><strong>145</strong> personas</td>
              <td><span class="badge badge-amber">Observado</span></td>
            </tr>
            <tr style="opacity:0.55">
              <td>% operaciones evaluadas por riesgos de corrupción</td>
              <td><span class="badge badge-green">GRI 205-1</span></td>
              <td>Gabriela Tito</td>
              <td style="color:#94a3b8; font-style:italic">Sin respuesta</td>
              <td><span class="badge badge-amber">Pendiente</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Contexto sectorial -->
    <div class="section">
      <div class="section-title">Contexto Sectorial</div>
      <div class="callout">
        <div class="callout-title">✦ Benchmarking IA — Nuevas Contrataciones</div>
        <div class="callout-text">Con 145 nuevas contrataciones en el trimestre, Minera Andina S.A. supera el promedio del sector minero peruano para empresas de tamaño similar (estimado en ~90 contrataciones trimestrales según datos públicos MINEM 2024). Este desempeño destaca positivamente y refuerza el impacto social directo de la operación.</div>
      </div>
      <div class="callout warn">
        <div class="callout-title">⚠ Alerta — Datos Incompletos</div>
        <div class="callout-text">El indicador GRI 205-1 no cuenta con respuesta completa. Se requiere completar el porcentaje de operaciones evaluadas antes de emitir la versión definitiva de este reporte. El análisis de Gobernanza queda parcialmente incompleto hasta recibir dicha información.</div>
      </div>
    </div>

    <!-- Recomendaciones -->
    <div class="section">
      <div class="section-title">Recomendaciones</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Acción Recomendada</th><th>Prioridad</th><th>Plazo</th></tr></thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Completar la información de GRI 205-1 e indicar metodología de evaluación de riesgo utilizada</td>
              <td><span class="badge badge-green">Urgente</span></td>
              <td>Inmediato</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Documentar el plan para alcanzar el 100% de cobertura en evaluaciones anticorrupción en 2025</td>
              <td><span class="badge badge-amber">Media</span></td>
              <td>Q2 2025</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Ampliar datos de rotación de personal para complementar GRI 401-1 con tasas de desvinculación</td>
              <td><span class="badge badge-gray">Baja</span></td>
              <td>Q3 2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="footer">
    <span class="footer-brand">Divelop Sostenibilidad S.A.C.</span>
    <span class="footer-note">Reporte generado por Divelop AI Engine · Uso interno y confidencial</span>
  </div>
</div>
</body>
</html>`;
}

// ─── Public download function ─────────────────────────────────────────────────
const REPORT_GENERATORS: Record<string, () => string> = {
  rep1: generateReport1,
  rep2: generateReport2,
};

export function downloadReport(report: GeneratedReport): void {
  const generator = REPORT_GENERATORS[report.id];
  if (!generator) {
    alert("Reporte no disponible.");
    return;
  }
  const html = generator();
  const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${report.name.replace(/[^a-z0-9áéíóúñ\s]/gi, "").trim().replace(/\s+/g, "_")}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
