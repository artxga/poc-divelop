"use client";

import { useState } from "react";
import Link from "next/link";
import { PROYECTOS, CLIENTES, FORMULARIOS_ENVIADOS } from "@/app/_lib/mock-data";
import { useAuth } from "@/app/_lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, ChevronRight, Calendar, User, Briefcase } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ESTADO = {
  activo: { label: "Activo", class: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  pausado: { label: "Pausado", class: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  completado: { label: "Completado", class: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
};

export default function ProyectosPage() {
  const { user } = useAuth();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    clienteId: "",
    fechaInicio: new Date().toISOString().split("T")[0],
    fechaFin: "",
  });

  if (!user) return null;

  const handleSave = () => {
    // In a real app this would save to backend
    alert("Proyecto creado con éxito");
    setModalOpen(false);
  };

  // Filtrar proyectos según el rol
  const proyectosFiltrados = PROYECTOS.filter((p) => {
    if (user.rol === "admin" || user.rol === "consultor") return true;
    return p.clienteId === user.clienteId;
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
        {(user.rol === "admin" || user.rol === "consultor") && (
          <Button onClick={() => setModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
            <FolderOpen className="w-4 h-4" /> Nuevo Proyecto
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proyectosFiltrados.map((p) => {
          const estadoCfg = ESTADO[p.estado];
          const cliente = CLIENTES.find((c) => c.id === p.clienteId);
          
          const enviosDelProyecto = FORMULARIOS_ENVIADOS.filter(f => f.proyectoId === p.id);
          const misEnvios = (user.rol === "cliente" || user.rol === "usuario_cliente") 
            ? enviosDelProyecto.filter(f => f.usuarioEmail === user.email)
            : enviosDelProyecto;

          // Si el cliente no tiene envíos asignados en este proyecto, y no es admin, no renderizamos
          if ((user.rol === "cliente" || user.rol === "usuario_cliente") && misEnvios.length === 0) {
            return null;
          }

          return (
            <Link key={p.id} href={`/proyectos/${p.id}`} className="block group">
              <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5 h-full">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                      <FolderOpen className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${estadoCfg.class}`}>
                      {estadoCfg.label}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-base mb-1 line-clamp-2">{p.nombre}</h2>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span className="truncate">{cliente?.nombre}</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {p.fechaInicio}
                    </span>
                    <span className="font-medium text-emerald-400">
                      {misEnvios.length} Formularios
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
                value={form.nombre} 
                onChange={(e) => setForm({ ...form, nombre: e.target.value })} 
                placeholder="Ej: Reporte Sostenibilidad 2026..." 
              />
            </div>
            <div className="space-y-1.5">
              <Label>Cliente</Label>
              <Select value={form.clienteId} onValueChange={(v) => setForm({ ...form, clienteId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {CLIENTES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Fecha Inicio</Label>
                <Input 
                  type="date" 
                  value={form.fechaInicio} 
                  onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })} 
                />
              </div>
              <div className="space-y-1.5">
                <Label>Fecha Fin</Label>
                <Input 
                  type="date" 
                  value={form.fechaFin} 
                  onChange={(e) => setForm({ ...form, fechaFin: e.target.value })} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-500 text-white" 
              onClick={handleSave}
              disabled={!form.nombre || !form.clienteId || !form.fechaInicio || !form.fechaFin}
            >
              Crear Proyecto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
