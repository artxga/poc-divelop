"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { GripVertical, Trash2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormQuestion, QuestionType } from "@/features/forms/model/types";
import type { Indicator } from "@/features/indicators/model/types";
import { CATEGORY_CONFIG } from "@/features/shared/api/mock-db";
import { cn } from "@/lib/utils";

interface SortableQuestionProps {
  question: FormQuestion;
  indicators: Indicator[];
  onUpdate: (q: FormQuestion) => void;
  onRemove: () => void;
  onRemoveIndicator: (indicatorId: string) => void;
}

export function SortableQuestion({ 
  question, 
  indicators,
  onUpdate, 
  onRemove,
  onRemoveIndicator
}: SortableQuestionProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: question.id, data: { type: "question" } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Droppable zone for indicators inside this question
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `drop-${question.id}`,
    data: { type: "question-dropzone", questionId: question.id }
  });

  return (
    <Card
      ref={setSortableRef}
      style={style}
      className={cn(
        "relative flex flex-col bg-card border-border/50 shadow-sm transition-opacity group",
        isSortableDragging ? "opacity-50" : "opacity-100"
      )}
    >
      <div className="flex items-center gap-2 p-3 border-b border-border/50 bg-secondary/20">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground shrink-0"
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider flex-1">
          Configuración de Pregunta
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={onRemove}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Texto de la Pregunta</label>
            <Input
              value={question.text}
              onChange={(e) => onUpdate({ ...question, text: e.target.value })}
              placeholder="Ej. ¿Cuál es el consumo de energía?"
              className="bg-secondary/30"
            />
          </div>
          <div className="w-full sm:w-48 space-y-1.5 shrink-0">
            <label className="text-xs text-muted-foreground font-medium">Tipo de Respuesta</label>
            <Select 
              value={question.type} 
              onValueChange={(val: QuestionType) => onUpdate({ ...question, type: val })}
            >
              <SelectTrigger className="bg-secondary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="texto">Texto (Párrafo)</SelectItem>
                <SelectItem value="numero">Número</SelectItem>
                <SelectItem value="booleano">Sí / No</SelectItem>
                <SelectItem value="seleccion">Selección Múltiple</SelectItem>
                <SelectItem value="archivo">Archivo / Evidencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border/50">
          <label className="text-xs text-muted-foreground font-medium">
            Indicadores Asociados a esta pregunta
          </label>
          <div 
            ref={setDroppableRef}
            className={cn(
              "min-h-[80px] rounded-lg border-2 border-dashed p-3 transition-colors flex flex-col gap-2",
              isOver ? "border-emerald-500/50 bg-emerald-500/5" : "border-border/50 bg-card/30"
            )}
          >
            {indicators.length === 0 ? (
              <div className="m-auto text-xs text-muted-foreground text-center">
                Arrastra indicadores aquí para vincularlos
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {indicators.map(ind => {
                  const catCfg = CATEGORY_CONFIG[ind.category as keyof typeof CATEGORY_CONFIG];
                  return (
                    <div key={ind.id} className="flex items-center gap-1.5 bg-secondary/50 border border-border/50 rounded-md px-2 py-1 text-xs">
                      <span className="font-mono text-muted-foreground">{ind.code}</span>
                      <div className={`w-1.5 h-1.5 rounded-full ${catCfg?.dot || "bg-gray-400"}`} />
                      <span className="font-medium truncate max-w-[200px]">{ind.name}</span>
                      <button 
                        onClick={() => onRemoveIndicator(ind.id)}
                        className="ml-1 text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
