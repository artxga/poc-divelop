import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CLIENTS } from "@/features/shared/api/mock-db";

interface FormState {
  name: string;
  clientId: string;
  startDate: string;
  endDate: string;
}

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: FormState;
  onFormChange: (form: FormState) => void;
  onSave: () => void;
}

export function CreateProjectModal({ open, onOpenChange, form, onFormChange, onSave }: CreateProjectModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onChange={(e) => onFormChange({ ...form, name: e.target.value })} 
              placeholder="Ej: Reporte Sostenibilidad 2026..." 
            />
          </div>
          <div className="space-y-1.5">
            <Label>Cliente</Label>
            <Select value={form.clientId} onValueChange={(v) => onFormChange({ ...form, clientId: v })}>
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
                onChange={(e) => onFormChange({ ...form, startDate: e.target.value })} 
              />
            </div>
            <div className="space-y-1.5">
              <Label>Fecha Fin</Label>
              <Input 
                type="date" 
                value={form.endDate} 
                onChange={(e) => onFormChange({ ...form, endDate: e.target.value })} 
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-500 text-white" 
            onClick={onSave}
            disabled={!form.name || !form.clientId || !form.startDate || !form.endDate}
          >
            Crear Proyecto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
