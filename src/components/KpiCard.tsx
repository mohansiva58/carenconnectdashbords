import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const KpiCard = ({
  label,
  value,
  delta,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  tone?: "primary" | "secondary" | "accent" | "warning";
}) => {
  const tones = {
    primary: "bg-indigo-50 text-indigo-600 border-indigo-100",
    secondary: "bg-emerald-50 text-emerald-600 border-emerald-100",
    accent: "bg-violet-50 text-violet-600 border-violet-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
  };

  const positive = delta?.startsWith("+");

  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5.5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            {label}
          </p>
          <p className="font-display text-3xl font-extrabold tracking-tight text-slate-800 transition-colors group-hover:text-indigo-900">
            {value}
          </p>
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105", tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {delta && (
        <div className="mt-3.5 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-extrabold",
              positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            )}
          >
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {delta}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">vs last week</span>
        </div>
      )}
    </div>
  );
};
