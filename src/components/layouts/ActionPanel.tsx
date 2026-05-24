import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActionPanelProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  action?: {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
    variant?: "primary" | "secondary" | "ghost";
  };
  empty?: boolean;
  emptyState?: {
    icon?: LucideIcon;
    title: string;
    description: string;
  };
  className?: string;
}

/**
 * ActionPanel - Standardized panel for displaying approval/workflow actions
 * Includes title, description, built-in action buttons, and empty state handling
 */
export const ActionPanel = ({
  title,
  description,
  icon: Icon,
  children,
  action,
  empty,
  emptyState,
  className,
}: ActionPanelProps) => {
  if (empty && emptyState) {
    const EmptyIcon = emptyState.icon;
    return (
      <div className={cn("rounded-2xl border border-slate-150 bg-white p-8 text-center", className)}>
        {EmptyIcon && <EmptyIcon className="mx-auto h-12 w-12 text-slate-300 mb-4" />}
        <h3 className="text-sm font-bold text-slate-900">{emptyState.title}</h3>
        <p className="mt-1 text-xs text-slate-500">{emptyState.description}</p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-2xl border border-slate-150 bg-white shadow-sm", className)}>
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 p-6">
        <div className="flex items-start gap-3">
          {Icon && <Icon className="h-5 w-5 text-slate-600 flex-shrink-0 mt-0.5" />}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{title}</h3>
            {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
          </div>
        </div>

        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              "ml-2 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              action.variant === "primary" && "bg-indigo-600 text-white hover:bg-indigo-700",
              action.variant === "secondary" && "bg-slate-100 text-slate-700 hover:bg-slate-200",
              (action.variant === "ghost" || !action.variant) && "text-slate-600 hover:bg-slate-50"
            )}
          >
            {action.icon && <action.icon className="h-4 w-4" />}
            {action.label}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default ActionPanel;
