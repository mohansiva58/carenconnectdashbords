import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
  variant?: "h1" | "h2" | "h3";
}

/**
 * SectionHeader - Visual header for dashboard sections
 * Provides clear hierarchy and organization of related content areas
 */
export const SectionHeader = ({
  title,
  subtitle,
  description,
  icon: Icon,
  action,
  className,
  variant = "h2",
}: SectionHeaderProps) => {
  const headingClasses = {
    h1: "text-3xl md:text-4xl font-black",
    h2: "text-2xl md:text-3xl font-bold",
    h3: "text-xl md:text-2xl font-bold",
  };

  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-center md:justify-between", className)}>
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <Icon className="h-5 w-5 text-slate-700" />
          </div>
        )}
        <div className="flex-1">
          {subtitle && <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">{subtitle}</p>}
          <h2 className={cn("text-slate-900", headingClasses[variant])}>{title}</h2>
          {description && <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">{description}</p>}
        </div>
      </div>

      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

export default SectionHeader;
