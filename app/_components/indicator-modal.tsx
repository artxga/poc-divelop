"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Indicator, IndicatorStandard, IndicatorCategory, IndicatorDataType } from "@/app/_lib/mock-data";

const STANDARDS: IndicatorStandard[] = ["GRI", "SASB", "ODS", "TCFD", "Manual"];
const CATEGORIES: IndicatorCategory[] = ["Ambiental", "Social", "Gobernanza"];
const TYPES: IndicatorDataType[] = ["numero", "texto", "porcentaje", "booleano", "seleccion"];

const TYPE_LABELS: Record<IndicatorDataType, string> = {
  numero: "Número",
  texto: "Texto",
  porcentaje: "Porcentaje",
  booleano: "Sí / No (Booleano)",
  seleccion: "Selección Múltiple",
};

interface IndicatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Indicator | null;
  onSave: (indicator: Omit<Indicator, "id">) => void;
}

export function IndicatorModal({ open, onOpenChange, initialData, onSave }: IndicatorModalProps) {
  const [form, setForm] = useState<Omit<Indicator, "id">>({
    code: "",
    name: "",
    description: "",
    standard: "Manual",
    category: "Ambiental",
    dataType: "numero",
    unit: "",
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          code: initialData.code,
          name: initialData.name,
          description: initialData.description,
          standard: initialData.standard,
          category: initialData.category,
          dataType: initialData.dataType,
          unit: initialData.unit ?? "",
        });
      } else {
        setForm({
          code: "",
          name: "",
          description: "",
          standard: "Manual",
          category: "Ambiental",
          dataType: "numero",
          unit: "",
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
              <Input id="cod" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="GRI 305-1" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="estandar-sel">Estándar</Label>
              <Select value={form.standard} onValueChange={(v) => setForm({ ...form, standard: v as IndicatorStandard })}>
                <SelectTrigger id="estandar-sel"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STANDARDS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
              <Label htmlFor="nombre-ind">Nombre del indicador</Label>
              <Input id="nombre-ind" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej: Consumo de energía..." />
          </div>
          <div className="space-y-1.5">
              <Label htmlFor="desc-ind">Descripción</Label>
              <Textarea id="desc-ind" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Descripción detallada del indicador..." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cat-sel">Categoría</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as IndicatorCategory })}>
                <SelectTrigger id="cat-sel"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tipo-sel">Tipo de dato</Label>
              <Select value={form.dataType} onValueChange={(v) => setForm({ ...form, dataType: v as IndicatorDataType })}>
                <SelectTrigger id="tipo-sel"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => <SelectItem key={t} value={t}>{TYPE_LABELS[t]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="unidad-ind">Unidad</Label>
              <Input id="unidad-ind" value={form.unit ?? ""} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="tCO₂e, m³..." />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
            onClick={handleSave}
            disabled={!form.name || !form.code}
          >
            {initialData ? "Guardar cambios" : "Crear indicador"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
