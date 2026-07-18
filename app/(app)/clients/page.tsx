"use client";

import { useState } from "react";
import Link from "next/link";
import { CLIENTS, USERS, PROJECTS } from "@/app/_lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users as UsersIcon, Briefcase, Plus, ChevronRight, Building } from "lucide-react";

export default function ClientsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");

  const handleSave = () => {
    // In a real app this would save to backend
    alert("Cliente creado con éxito");
    setModalOpen(false);
    setName("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Clientes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Administra las empresas y sus usuarios asociados
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2">
          <Plus className="w-4 h-4" /> Nuevo Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CLIENTS.map((client) => {
          const clientUsers = USERS.filter(u => u.clientId === client.id);
          const clientProjects = PROJECTS.filter(p => p.clientId === client.id);

          return (
            <Link key={client.id} href={`/clients/${client.id}`} className="block group">
              <Card className="border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5 h-full">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                      <Building className="w-5 h-5 text-blue-400" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-base mb-1 line-clamp-2">{client.name}</h2>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <UsersIcon className="w-3.5 h-3.5" /> 
                      {clientUsers.length} {clientUsers.length === 1 ? 'Usuario' : 'Usuarios'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {clientProjects.length} {clientProjects.length === 1 ? 'Proyecto' : 'Proyectos'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        {CLIENTS.length === 0 && (
          <div className="col-span-full p-8 text-center border border-dashed border-border/50 rounded-xl bg-card/30">
            <p className="text-muted-foreground">No hay clientes registrados en el sistema.</p>
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md bg-card border-border/50">
          <DialogHeader>
            <DialogTitle>Nuevo Cliente</DialogTitle>
            <DialogDescription>
              Registra una nueva empresa en el sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label>Razón Social / Nombre de la Empresa</Label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Ej: Minera Andina S.A..." 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-500 text-white" 
              onClick={handleSave}
              disabled={!name}
            >
              Crear Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
