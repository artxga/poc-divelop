"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CLIENTS, USERS, PROJECTS, type UserRole } from "@/app/_lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Plus, User as UserIcon, Building, Briefcase, Mail, Shield, Users as UsersIcon } from "lucide-react";

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const client = CLIENTS.find(c => c.id === id);
  if (!client) notFound();

  const clientUsers = USERS.filter(u => u.clientId === client.id);
  const clientProjects = PROJECTS.filter(p => p.clientId === client.id);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "usuario_cliente" as UserRole,
  });

  const handleSave = () => {
    // In a real app this would save to backend
    alert(`Usuario ${form.name} creado y asignado a ${client.name}`);
    setModalOpen(false);
    setForm({ name: "", email: "", role: "usuario_cliente" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/clients" className="p-2 -ml-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
              <Building className="w-4 h-4" /> Perfil de Cliente
            </p>
          </div>
        </div>
        <Button onClick={() => setModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
          <Plus className="w-4 h-4" /> Nuevo Usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Column */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-5">
              <h2 className="font-semibold text-base mb-4">Resumen</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <UsersIcon className="w-4 h-4" /> Usuarios Activos
                  </span>
                  <span className="font-medium">{clientUsers.length}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Proyectos
                  </span>
                  <span className="font-medium">{clientProjects.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List Column */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm h-full">
            <CardContent className="p-0">
              <div className="p-4 border-b border-border/50">
                <h2 className="font-semibold text-base">Directorio de Usuarios</h2>
              </div>
              <div className="divide-y divide-border/50">
                {clientUsers.map(u => (
                  <div key={u.id} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <UserIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{u.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {u.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-[10px] uppercase px-2 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-medium flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {u.role === "cliente" ? "Cliente Líder" : "Usuario"}
                      </span>
                    </div>
                  </div>
                ))}
                {clientUsers.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground">Este cliente aún no tiene usuarios registrados.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md bg-card border-border/50">
          <DialogHeader>
            <DialogTitle>Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Crea un usuario y asígnale un rol dentro de {client.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Nombre Completo</Label>
              <Input 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                placeholder="Ej: Juan Pérez" 
              />
            </div>
            <div className="space-y-1.5">
              <Label>Correo Electrónico</Label>
              <Input 
                type="email"
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                placeholder="juan@empresa.com" 
              />
            </div>
            <div className="space-y-1.5">
              <Label>Rol del Usuario</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente">Cliente Líder (Administra envíos)</SelectItem>
                  <SelectItem value="usuario_cliente">Usuario Cliente (Solo llena formularios asignados)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-500 text-white" 
              onClick={handleSave}
              disabled={!form.name || !form.email}
            >
              Crear Usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
