import type { UserRole } from "@/features/auth/model/types";

export type QuestionType = "texto" | "numero" | "booleano" | "seleccion" | "archivo";

export interface FormQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  indicatorIds: string[];
}

export interface FormTemplate {
  id: string;
  projectId: string;
  name: string;
  questions: FormQuestion[];
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

export interface QuestionResponse {
  id: string;
  submissionId: string;
  questionId: string;
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
