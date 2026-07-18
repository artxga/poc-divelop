import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FormSubmission } from "@/features/forms/model/types";
import { FORM_TEMPLATES, PROJECTS, USERS } from "@/features/shared/api/mock-db";

interface KanbanCardProps {
  submission: FormSubmission;
  isDragging?: boolean;
}

export function KanbanCard({ submission, isDragging }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: submission.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const template = FORM_TEMPLATES.find(t => t.id === submission.templateId);
  const project = PROJECTS.find((p) => p.id === submission.projectId);
  const assignedUser = USERS.find(u => u.email === submission.userEmail);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-3 shadow-sm",
        "hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/5 transition-all",
        isDragging && "opacity-50 scale-95"
      )}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 text-emerald-400">
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium text-xs truncate">{template?.name}</span>
          </div>
          
          <p className="text-xs text-muted-foreground truncate mb-2">{project?.name}</p>

          <div className="flex flex-col gap-1.5 mt-2 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <User className="w-3 h-3" />
              <span className="truncate">{assignedUser?.name || submission.userEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn("h-full", submission.progress >= 80 ? "bg-emerald-500" : submission.progress >= 50 ? "bg-amber-500" : "bg-red-500")}
                  style={{ width: `${submission.progress}%` }}
                />
              </div>
              <span className="text-[10px] font-medium">{submission.progress}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
