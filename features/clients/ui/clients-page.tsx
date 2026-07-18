"use client";

import { useState } from "react";
import { CLIENTS } from "@/features/shared/api/mock-db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ClientCard } from "./client-card";
import { CreateClientModal } from "./create-client-modal";

export function ClientsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSave = (name: string) => {
    // In a real app this would save to backend
    alert(`Cliente "${name}" creado con éxito`);
    setModalOpen(false);
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
        {CLIENTS.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
        {CLIENTS.length === 0 && (
          <div className="col-span-full p-8 text-center border border-dashed border-border/50 rounded-xl bg-card/30">
            <p className="text-muted-foreground">No hay clientes registrados en el sistema.</p>
          </div>
        )}
      </div>

      <CreateClientModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        onSave={handleSave} 
      />
    </div>
  );
}
