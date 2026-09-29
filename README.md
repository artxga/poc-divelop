# Divelop PoC - Frontend

Plataforma de reporte de sostenibilidad (ESG) para la gestión de indicadores bajo estándares (GRI, SASB, ODS, TCFD). Este proyecto sirve como Prueba de Concepto (PoC) para validar la usabilidad, arquitectura base y el modelado inicial del negocio desde el lado del cliente.

## 🚀 Tecnologías Principales

- **Framework:** [Next.js 14/15](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) / React 19
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Componentes UI:** [Radix UI](https://www.radix-ui.com/) (con aproximación de Shadcn)
- **Drag & Drop:** [@dnd-kit](https://docs.dndkit.com/) (para el constructor de formularios)
- **Gráficos:** [Recharts](https://recharts.org/)

## 📂 Arquitectura (Feature-Sliced Design - Lite)

El código fuente está estructurado organizando los módulos por "características" (features) de negocio, en lugar de agrupar por tipo de archivo, lo que permite un mejor encapsulamiento y escalabilidad.

- `app/`: Enrutamiento y layouts principales de Next.js.
- `components/`: Componentes genéricos e independientes del dominio (Botones, Inputs, Modales de UI base).
- `features/`: Lógica de negocio, dividida por módulos:
  - `auth`: Autenticación (mockeada actualmente).
  - `clients`: Gestión de clientes corporativos.
  - `dashboard`: Vistas de resúmenes.
  - `forms`: Generador dinámico de formularios (DnD).
  - `indicators`: Catálogo de indicadores y estándares ESG.
  - `projects`: Gestión de proyectos asignados a clientes.
  - `reports`: Motor de reporte, timeline y analítica.
  - `settings`: Configuración y roles.
  - `shared`: Contexto compartido (como la Base de Datos Mockeada actual).
  - `validation`: Tablero Kanban de validación de entregas.
- `lib/`: Utilidades genéricas (ej. `cn` para Tailwind).

## ⚙️ Configuración y Ejecución

1. **Instalar dependencias:**
   Recomendamos usar `pnpm`:
   ```bash
   pnpm install
   ```

2. **Ejecutar el servidor de desarrollo:**
   ```bash
   pnpm dev
   ```

3. Abrir el navegador en [http://localhost:3000](http://localhost:3000).

## 🛠 Comandos Útiles

- `pnpm dev`: Inicia el servidor de desarrollo.
- `pnpm build`: Construye la aplicación para producción.
- `pnpm start`: Inicia el servidor de producción.
- `pnpm lint`: Ejecuta ESLint para revisión de código estático.

## 📋 Estado Actual (PoC)

Esta aplicación funciona actualmente de manera estática y sincrónica mediante un servicio simulado (Mock DB). No requiere conexión a un backend real para operar sus características principales durante la fase de PoC. Para un despliegue en producción, se requiere reemplazar la capa de datos.

> Para revisar el detalle de mejoras técnicas pendientes y evaluación de la deuda técnica de este PoC, revisa el archivo `technical_debt_report.md`.
