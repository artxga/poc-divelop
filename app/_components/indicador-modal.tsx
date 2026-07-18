"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Indicador, IndicadorEstandar, IndicadorCategoria, IndicadorTipoDato } from "@/app/_lib/mock-data";

const ESTANDARES: IndicadorEstandar[] = ["GRI", "SASB", "ODS", "TCFD", "Manual"];
const CATEGORIAS: IndicadorCategoria[] = ["Ambiental", "Social", "Gobernanza"];
const TIPOS: IndicadorTipoDato[] = ["numero", "texto", "porcentaje", "booleano", "seleccion"];

const TIPO_LABELS: Record<IndicadorTipoDato, string> = {
  numero: "Número",
  texto: "Texto",
  porcentaje: "Porcentaje",
  booleano: "Sí / No (Booleano)",
  seleccion: "Selección Múltiple",
};

interface IndicadorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Indicador | null;
  onSave: (indicador: Omit<Indicador, "id">) => void;
}

export function IndicadorModal({ open, onOpenChange, initialData, onSave }: IndicadorModalProps) {
  const [form, setForm] = useState<Omit<Indicador, "id">>({
    codigo: "",
    nombre: "",
    descripcion: "",
    estandar: "Manual",
    categoria: "Ambiental",
    tipoDato: "numero",
    unidad: "",
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          codigo: initialData.codigo,
          nombre: initialData.nombre,
          descripcion: initialData.descripcion,
          estandar: initialData.estandar,
          categoria: initialData.categoria,
          tipoDato: initialData.tipoDato,
          unidad: initialData.unidad ?? "",
        });
      } else {
        setForm({
          codigo: "",
          nombre: "",
          descripcion: "",
          estandar: "Manual",
          categoria: "Ambiental",
          tipoDato: "numero",
          unidad: "",
        });
      }
    }
  }, [open, initialData]);

  const handleSave = () => {
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card border-border/50">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Indicador" : "Nuevo Indicador"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Modifica los datos del indicador existente." : "Define un nuevo indicador."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cod">Código</Label>
              <Input id="cod" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} placeholder="GRI 305-1" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="estandar-sel">Estándar</Label>
              <Select value={form.estandar} onValueChange={(v) => setForm({ ...form, estandar: v as IndicadorEstandar })}>
                <SelectTrigger id="estandar-sel"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ESTANDARES.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nombre-ind">Nombre del indicador</Label>
            <Input id="nombre-ind" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Consumo de energía..." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc-ind">Descripción</Label>
            <Textarea id="desc-ind" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={3} placeholder="Descripción detallada del indicador..." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cat-sel">Categoría</Label>
              <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v as IndicadorCategoria })}>
                <SelectTrigger id="cat-sel"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tipo-sel">Tipo de dato</Label>
              <Select value={form.tipoDato} onValueChange={(v) => setForm({ ...form, tipoDato: v as IndicadorTipoDato })}>
                <SelectTrigger id="tipo-sel"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIPOS.map((t) => <SelectItem key={t} value={t}>{TIPO_LABELS[t]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="unidad-ind">Unidad</Label>
              <Input id="unidad-ind" value={form.unidad ?? ""} onChange={(e) => setForm({ ...form, unidad: e.target.value })} placeholder="tCO₂e, m³..." />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
            onClick={handleSave}
            disabled={!form.nombre || !form.codigo}
          >
            {initialData ? "Guardar cambios" : "Crear indicador"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
