"use client";

import { useState } from "react";
import {
  INDICADORES,
  CATEGORIA_CONFIG,
  ESTANDAR_CONFIG,
  type Indicador,
  type IndicadorEstandar,
  type IndicadorCategoria,
  type IndicadorTipoDato,
} from "@/app/_lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IndicadorModal } from "@/app/_components/indicador-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2, BookOpen, Filter } from "lucide-react";

const ESTANDARES: IndicadorEstandar[] = ["GRI", "SASB", "ODS", "TCFD", "Manual"];
const CATEGORIAS: IndicadorCategoria[] = ["Ambiental", "Social", "Gobernanza"];
const TIPOS: IndicadorTipoDato[] = ["numero", "texto", "porcentaje", "booleano", "seleccion"];
const TIPO_LABELS: Record<IndicadorTipoDato, string> = {
  numero: "Numérico",
  texto: "Texto",
  porcentaje: "Porcentaje",
  booleano: "Sí/No",
  seleccion: "Selección",
};

const EMPTY_FORM: Omit<Indicador, "id"> = {
  codigo: "",
  nombre: "",
  descripcion: "",
  estandar: "GRI",
  categoria: "Ambiental",
  tipoDato: "numero",
  unidad: "",
};

let nextId = 100;

export default function IndicadoresPage() {
  const [indicadores, setIndicadores] = useState<Indicador[]>(INDICADORES);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstandar, setFiltroEstandar] = useState<string>("todos");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Indicador | null>(null);
  const [form, setForm] = useState<Omit<Indicador, "id">>(EMPTY_FORM);

  const filtrados = indicadores.filter((ind) => {
    const matchBusqueda =
      ind.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      ind.codigo.toLowerCase().includes(busqueda.toLowerCase());
    const matchEstandar = filtroEstandar === "todos" || ind.estandar === filtroEstandar;
    const matchCategoria = filtroCategoria === "todos" || ind.categoria === filtroCategoria;
    return matchBusqueda && matchEstandar && matchCategoria;
  });

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(ind: Indicador) {
    setEditTarget(ind);
    setForm({ codigo: ind.codigo, nombre: ind.nombre, descripcion: ind.descripcion, estandar: ind.estandar, categoria: ind.categoria, tipoDato: ind.tipoDato, unidad: ind.unidad ?? "" });
    setModalOpen(true);
  }

  function saveIndicador() {
    if (editTarget) {
      setIndicadores((prev) =>
        prev.map((i) => (i.id === editTarget.id ? { ...i, ...form } : i))
      );
    } else {
      setIndicadores((prev) => [
        { id: `custom-${nextId++}`, ...form },
        ...prev,
      ]);
    }
    setModalOpen(false);
  }

  function deleteIndicador(id: string) {
    setIndicadores((prev) => prev.filter((i) => i.id !== id));
    setDeleteId(null);
  }

  const countByEstandar = (est: string) => indicadores.filter((i) => i.estandar === est).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Biblioteca de Indicadores</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gestiona el repositorio de indicadores ESG disponibles para los proyectos
          </p>
        </div>
        <Button
          id="btn-crear-indicador"
          onClick={openCreate}
          className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo indicador
        </Button>
      </div>

      {/* Stats mini */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {ESTANDARES.filter((e) => e !== "Manual").map((est) => {
          const cfg = ESTANDAR_CONFIG[est];
          return (
            <div
              key={est}
              className={`flex items-center gap-3 p-3 rounded-xl border ${cfg.border} ${cfg.bg} cursor-pointer transition-all hover:scale-[1.02]`}
              onClick={() => setFiltroEstandar(filtroEstandar === est ? "todos" : est)}
            >
              <div className="flex-1">
                <p className={`text-lg font-bold ${cfg.color}`}>{countByEstandar(est)}</p>
                <p className="text-xs text-muted-foreground">{est} indicators</p>
              </div>
              <BookOpen className={`w-5 h-5 ${cfg.color} opacity-60`} />
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="busqueda-indicadores"
                placeholder="Buscar por nombre o código..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filtroEstandar} onValueChange={setFiltroEstandar}>
              <SelectTrigger id="filtro-estandar" className="w-40">
                <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Estándar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estándares</SelectItem>
                {ESTANDARES.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger id="filtro-categoria" className="w-40">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las categorías</SelectItem>
                {CATEGORIAS.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Indicadores ({filtrados.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="pl-6">Código</TableHead>
                <TableHead>Indicador</TableHead>
                <TableHead>Estándar</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Tipo de dato</TableHead>
                <TableHead className="pr-6 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.map((ind) => {
                const estCfg = ESTANDAR_CONFIG[ind.estandar];
                const catCfg = CATEGORIA_CONFIG[ind.categoria];
                return (
                  <TableRow key={ind.id} className="border-border/30 hover:bg-secondary/20">
                    <TableCell className="pl-6 font-mono text-xs text-muted-foreground font-medium">
                      {ind.codigo}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium leading-snug">{ind.nombre}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{ind.descripcion}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${estCfg.border} ${estCfg.bg} ${estCfg.color} font-medium`}>
                        {ind.estandar}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1.5 text-xs`}>
                        <div className={`w-2 h-2 rounded-full ${catCfg.dot}`} />
                        <span className={catCfg.color}>{ind.categoria}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {TIPO_LABELS[ind.tipoDato]}
                        {ind.unidad && <span className="ml-1 text-foreground/50">({ind.unidad})</span>}
                      </div>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          id={`edit-ind-${ind.id}`}
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 hover:text-blue-400 hover:bg-blue-500/10"
                          onClick={() => openEdit(ind)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          id={`delete-ind-${ind.id}`}
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => setDeleteId(ind.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <IndicadorModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        initialData={editTarget}
        onSave={saveIndicador}
      />

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm bg-card border-border/50">
          <DialogHeader>
            <DialogTitle>Eliminar indicador</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. ¿Confirmas la eliminación de este indicador de la biblioteca?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancelar</Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteIndicador(deleteId)}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
