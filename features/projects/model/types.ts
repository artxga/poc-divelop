export type ProjectStatus = "activo" | "pausado" | "completado";

export interface Project {
  id: string;
  clientId: string;
  name: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
}
