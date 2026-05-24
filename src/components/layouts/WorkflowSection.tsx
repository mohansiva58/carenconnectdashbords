import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorkflowSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  variant?: "default" | "compact" | "expanded";
}

/**
 * WorkflowSection - Reusable modular section component for organizing related workflows
 * Provides consistent card-based layout with optional icon, title, and description
 */
export const WorkflowSection = ({
  title,
  description,
  icon: Icon,
  children,
  className,
  variant = "default",
}: WorkflowSectionProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white shadow-sm",
        variant === "compact" && "border-slate-100 p-4",
        variant === "default" && "border-slate-150 p-6",
        variant === "expanded" && "border-slate-150 p-8",
        className
      )}
    >
      {/* Header */}
      {(title || Icon) && (
        <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-4">
          {Icon && <Icon className="h-5 w-5 text-slate-600 flex-shrink-0 mt-0.5" />}
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{title}</h3>
            {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
          </div>
        </div>
      )}

      {/* Content */}
      <div>{children}</div>
    </div>
  );
};

export default WorkflowSection;
