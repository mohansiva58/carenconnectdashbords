import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricItemProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  tone?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
  onClick?: () => void;
}

export interface MetricsStripProps {
  metrics: MetricItemProps[];
  className?: string;
  grid?: 2 | 3 | 4 | 5 | 6;
}

const toneClasses: Record<string, string> = {
  primary: "text-indigo-600 bg-indigo-50",
  secondary: "text-slate-600 bg-slate-50",
  success: "text-emerald-600 bg-emerald-50",
  warning: "text-amber-600 bg-amber-50",
  danger: "text-rose-600 bg-rose-50",
  info: "text-blue-600 bg-blue-50",
};

const trendClasses: Record<string, string> = {
  up: "text-emerald-600",
  down: "text-rose-600",
  neutral: "text-slate-600",
};

/**
 * MetricsStrip - Display key metrics at a glance
 * Shows KPI cards with optional trends and status indicators
 */
const MetricItem = ({ label, value, icon: Icon, trend, trendValue, tone = "primary", onClick }: MetricItemProps) => {
  const baseClass = toneClasses[tone];

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-slate-150 p-4 text-left transition-all hover:shadow-md active:scale-95",
        onClick && "cursor-pointer hover:border-slate-300",
        !onClick && "cursor-default",
        baseClass
      )}
    >
      {/* Background accent */}
      <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full opacity-0 transition-opacity group-hover:opacity-5" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-75">{label}</span>
          {Icon && <Icon className="h-4 w-4 opacity-50" />}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold">{value}</span>
          {trend && trendValue && (
            <span className={cn("text-xs font-semibold", trendClasses[trend])}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export const MetricsStrip = ({ metrics, className, grid = 4 }: MetricsStripProps) => {
  const gridClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  }[grid] || "grid-cols-4";

  return (
    <div className={cn("grid gap-3 sm:gap-4", `sm:${gridClass}`, "grid-cols-1", className)}>
      {metrics.map((metric, idx) => (
        <MetricItem key={idx} {...metric} />
      ))}
    </div>
  );
};

export default MetricsStrip;
