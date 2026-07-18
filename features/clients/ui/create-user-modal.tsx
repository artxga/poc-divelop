import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserRole } from "@/features/auth/model/types";
import type { Client } from "@/features/clients/model/types";

interface FormState {
  name: string;
  email: string;
  role: UserRole;
}

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: FormState;
  onFormChange: (form: FormState) => void;
  onSave: () => void;
  client: Client;
}

export function CreateUserModal({ open, onOpenChange, form, onFormChange, onSave, client }: CreateUserModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onChange={(e) => onFormChange({ ...form, name: e.target.value })} 
              placeholder="Ej: Juan Pérez" 
            />
          </div>
          <div className="space-y-1.5">
            <Label>Correo Electrónico</Label>
            <Input 
              type="email"
              value={form.email} 
              onChange={(e) => onFormChange({ ...form, email: e.target.value })} 
              placeholder="juan@empresa.com" 
            />
          </div>
          <div className="space-y-1.5">
            <Label>Rol del Usuario</Label>
            <Select value={form.role} onValueChange={(v) => onFormChange({ ...form, role: v as UserRole })}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-500 text-white" 
            onClick={onSave}
            disabled={!form.name || !form.email}
          >
            Crear Usuario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
