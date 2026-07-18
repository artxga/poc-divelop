import type { UserRole } from "@/features/auth/model/types";

export interface FormTemplate {
  id: string;
  projectId: string;
  name: string;
  indicators: string[];
}

export type FormStatus = "borrador" | "enviado" | "observado" | "aprobado";

export interface FormSubmission {
  id: string;
  templateId: string;
  projectId: string;
  userEmail: string;
  status: FormStatus;
  progress: number;
}

export interface IndicatorResponse {
  id: string;
  submissionId: string;
  indicatorId: string;
  value: string | number | boolean | null;
}

export interface Comment {
  id: string;
  submissionId: string;
  author: string;
  role: UserRole;
  text: string;
  date: string;
  isEvidence?: boolean;
  fileName?: string;
}

export interface HistoryEvent {
  id: string;
  submissionId: string;
  event: string;
  author: string;
  date: string;
}
