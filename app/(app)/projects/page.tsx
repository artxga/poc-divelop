"use client";

import { useState } from "react";
import Link from "next/link";
import { PROJECTS, CLIENTS, FORM_SUBMISSIONS } from "@/app/_lib/mock-data";
import { useAuth } from "@/app/_lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, ChevronRight, Calendar, User, Briefcase } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS = {
  activo: { label: "Activo", class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  pausado: { label: "Pausado", class: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  completado: { label: "Completado", class: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
};

export default function ProjectsPage() {
  const { user } = useAuth();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    clientId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  if (!user) return null;

  const handleSave = () => {
    // In a real app this would save to backend
    alert("Proyecto creado con éxito");
    setModalOpen(false);
  };

  // Filtrar proyectos según el rol
  const filteredProjects = PROJECTS.filter((p) => {
    if (user.role === "admin" || user.role === "consultor") return true;
    return p.clientId === user.clientId;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proyectos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Selecciona un proyecto para gestionar sus formularios y respuestas
          </p>
        </div>
        {(user.role === "admin" || user.role === "consultor") && (
          <Button onClick={() => setModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
            <FolderOpen className="w-4 h-4" /> Nuevo Proyecto
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((p) => {
          const statusCfg = STATUS[p.status];
          const client = CLIENTS.find((c) => c.id === p.clientId);
          
          const projectSubmissions = FORM_SUBMISSIONS.filter(f => f.projectId === p.id);
          const mySubmissions = (user.role === "cliente" || user.role === "usuario_cliente") 
            ? projectSubmissions.filter(f => f.userEmail === user.email)
            : projectSubmissions;

          // Si el cliente no tiene envíos asignados en este proyecto, y no es admin, no renderizamos
          if ((user.role === "cliente" || user.role === "usuario_cliente") && mySubmissions.length === 0) {
            return null;
          }

          return (
            <Link key={p.id} href={`/projects/${p.id}`} className="block group">
              <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5 h-full">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                      <FolderOpen className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${statusCfg.class}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-base mb-1 line-clamp-2">{p.name}</h2>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span className="truncate">{client?.name}</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {p.startDate}
                    </span>
                    <span className="font-medium text-emerald-400">
                      {mySubmissions.length} Formularios
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md bg-card border-border/50">
          <DialogHeader>
            <DialogTitle>Nuevo Proyecto</DialogTitle>
            <DialogDescription>
              Crea un nuevo proyecto y vincúlalo a un cliente existente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Nombre del Proyecto</Label>
              <Input 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                placeholder="Ej: Reporte Sostenibilidad 2026..." 
              />
            </div>
            <div className="space-y-1.5">
              <Label>Cliente</Label>
              <Select value={form.clientId} onValueChange={(v) => setForm({ ...form, clientId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {CLIENTS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Fecha Inicio</Label>
                <Input 
                  type="date" 
                  value={form.startDate} 
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })} 
                />
              </div>
              <div className="space-y-1.5">
                <Label>Fecha Fin</Label>
                <Input 
                  type="date" 
                  value={form.endDate} 
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-500 text-white" 
              onClick={handleSave}
              disabled={!form.name || !form.clientId || !form.startDate || !form.endDate}
            >
              Crear Proyecto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
