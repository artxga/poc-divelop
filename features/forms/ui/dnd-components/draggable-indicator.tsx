import { useDraggable } from "@dnd-kit/core";
import { GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Indicator } from "@/features/indicators/model/types";
import { CATEGORY_CONFIG } from "@/features/shared/api/mock-db";

export function DraggableIndicator({ indicator }: { indicator: Indicator }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bank-${indicator.id}`,
    data: { type: "Indicator", indicator },
  });

  const catCfg = CATEGORY_CONFIG[indicator.category as keyof typeof CATEGORY_CONFIG];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "p-3 rounded-lg border border-border/50 bg-card cursor-grab hover:border-emerald-500/30 transition-all text-left",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <GripHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="font-mono text-[10px] text-muted-foreground">{indicator.code}</span>
      </div>
      <p className="text-xs font-medium leading-snug line-clamp-2">{indicator.name}</p>
      <div className={`mt-2 flex items-center gap-1.5 text-[10px] ${catCfg.color}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${catCfg.dot}`} />
        {indicator.category}
      </div>
    </div>
  );
}
