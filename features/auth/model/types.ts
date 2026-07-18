export type UserRole = "admin" | "consultor" | "cliente" | "usuario_cliente";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar: string;
  clientId?: string; 
}
