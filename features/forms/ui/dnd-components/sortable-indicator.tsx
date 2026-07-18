import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Indicator } from "@/features/indicators/model/types";
import { CATEGORY_CONFIG } from "@/features/shared/api/mock-db";

interface SortableIndicatorProps {
  id: string;
  indicator: Indicator;
  onRemove: () => void;
}

export function SortableIndicator({ id, indicator, onRemove }: SortableIndicatorProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const catCfg = CATEGORY_CONFIG[indicator.category as keyof typeof CATEGORY_CONFIG];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-start gap-3 p-4 rounded-xl border bg-card shadow-sm",
        isDragging ? "border-emerald-500/50 shadow-md shadow-emerald-500/10 z-10" : "border-border/50"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-1 cursor-grab text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="w-5 h-5" />
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-muted-foreground">{indicator.code}</span>
          <div className={`flex items-center gap-1.5 text-xs ${catCfg.color}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${catCfg.dot}`} />
            {indicator.category}
          </div>
        </div>
        <p className="font-medium text-sm">{indicator.name}</p>
        <p className="text-xs text-muted-foreground mt-1">{indicator.description}</p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all shrink-0"
        onClick={onRemove}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
