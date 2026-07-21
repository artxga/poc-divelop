"use client";

import { useAuth } from "@/features/auth/api/auth-context";
import { CLIENTS } from "@/features/shared/api/mock-db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, Mail, Building, User as UserIcon } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador del Sistema",
  consultor: "Consultor Analista",
  cliente: "Cliente (Líder)",
  usuario_cliente: "Usuario Cliente",
};

export function ProfilePage() {
  const { user } = useAuth();
  
  if (!user) return null;

  const client = user.clientId ? CLIENTS.find(c => c.id === user.clientId) : null;
  const roleLabel = ROLE_LABELS[user.role] || user.role;

  return (
    <div className="space-y-6 max-w-3xl mx-auto mt-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Información personal y configuración de cuenta
        </p>
      </div>

      <Card className="bg-card/60 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-emerald-500/20 to-emerald-900/40 relative">
          <div className="absolute -bottom-10 left-6">
            <Avatar className="w-24 h-24 border-4 border-background">
              <AvatarFallback className="text-3xl bg-emerald-500/20 text-emerald-300 font-bold">
                {user.avatar}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <CardContent className="pt-14 pb-8 px-6">
          <div className="flex flex-col gap-1 mb-8">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <Shield className="w-4 h-4" />
              <span>{roleLabel}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Información de Contacto</h3>
              <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-lg border border-border/50">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <UserIcon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Nombre Completo</p>
                  <p className="font-medium text-sm">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-lg border border-border/50">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Correo Electrónico</p>
                  <p className="font-medium text-sm">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Información Corporativa</h3>
              <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-lg border border-border/50">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Empresa Asignada</p>
                  <p className="font-medium text-sm">
                    {client ? client.name : "Divelop (Personal Interno)"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
