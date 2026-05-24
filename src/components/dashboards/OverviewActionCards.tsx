import type { LucideIcon } from "lucide-react";

type Tone = "cyan" | "purple" | "rose" | "amber";

type OverviewAction = {
  label: string;
  eyebrow?: string;
  value: string | number;
  href: string;
  icon: LucideIcon;
  tone: Tone;
};

const toneClasses: Record<Tone, { card: string; icon: string; text: string }> = {
  cyan: {
    card: "border-cyan-100 bg-cyan-50/70 hover:border-cyan-200",
    icon: "bg-cyan-100 text-cyan-700",
    text: "text-cyan-800",
  },
  purple: {
    card: "border-purple-100 bg-purple-50/70 hover:border-purple-200",
    icon: "bg-purple-100 text-purple-700",
    text: "text-purple-800",
  },
  rose: {
    card: "border-rose-100 bg-rose-50/70 hover:border-rose-200",
    icon: "bg-rose-100 text-rose-700",
    text: "text-rose-800",
  },
  amber: {
    card: "border-amber-100 bg-amber-50/70 hover:border-amber-200",
    icon: "bg-amber-100 text-amber-700",
    text: "text-amber-800",
  },
};

export const OverviewActionCards = ({ actions }: { actions: OverviewAction[] }) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {actions.map(({ label, eyebrow, value, href, icon: Icon, tone }) => {
      const classes = toneClasses[tone];

      return (
        <a
          key={label}
          href={href}
          className={`group flex min-h-28 items-center justify-between rounded-2xl border p-4 text-left shadow-sm transition-colors ${classes.card}`}
        >
          <div className="min-w-0">
            {eyebrow && <p className={`text-[10px] font-black uppercase tracking-widest ${classes.text}`}>{eyebrow}</p>}
            <h3 className="mt-1 text-sm font-extrabold text-slate-950">{label}</h3>
            <p className={`mt-3 text-3xl font-black tracking-tight ${classes.text}`}>{value}</p>
          </div>
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${classes.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
        </a>
      );
    })}
  </div>
);
