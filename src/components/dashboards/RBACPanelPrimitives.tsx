import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "indigo" | "blue" | "emerald" | "amber" | "rose" | "slate";

const toneClasses: Record<Tone, { text: string; bg: string; border: string; icon: string }> = {
  indigo: {
    text: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    icon: "bg-indigo-600 text-white",
  },
  blue: {
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "bg-blue-600 text-white",
  },
  emerald: {
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: "bg-emerald-600 text-white",
  },
  amber: {
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "bg-amber-500 text-white",
  },
  rose: {
    text: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    icon: "bg-rose-600 text-white",
  },
  slate: {
    text: "text-slate-700",
    bg: "bg-slate-100",
    border: "border-slate-200",
    icon: "bg-slate-700 text-white",
  },
};

export const RBACPageHeader = ({
  eyebrow,
  title,
  description,
  icon: Icon,
  tone = "indigo",
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone?: Tone;
  children?: ReactNode;
}) => {
  const toneClass = toneClasses[tone];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", toneClass.icon)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className={cn("text-xs font-bold uppercase tracking-widest", toneClass.text)}>{eyebrow}</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
          </div>
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
    </section>
  );
};

export const RBACStatusStrip = ({
  items,
}: {
  items: Array<{ label: string; value: string | number; icon: LucideIcon; tone?: Tone }>;
}) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {items.map(({ label, value, icon: Icon, tone = "slate" }) => {
      const toneClass = toneClasses[tone];
      return (
        <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg border", toneClass.bg, toneClass.border)}>
              <Icon className={cn("h-4 w-4", toneClass.text)} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950">{value}</p>
        </div>
      );
    })}
  </div>
);

export const RBACSectionHeader = ({
  label,
  title,
  description,
  icon: Icon,
}: {
  label: string;
  title: string;
  description?: string;
  icon: LucideIcon;
}) => (
  <div className="flex flex-col gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
        <h3 className="mt-1 text-lg font-extrabold tracking-tight text-slate-950">{title}</h3>
        {description && <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>}
      </div>
    </div>
  </div>
);

export const RBACSection = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <section className={cn("space-y-4", className)}>{children}</section>;

export const PermissionScopeGrid = ({
  scopes,
}: {
  scopes: Array<{ title: string; description: string; icon: LucideIcon; tone?: Tone }>;
}) => (
  <div className="grid gap-3 md:grid-cols-3">
    {scopes.map(({ title, description, icon: Icon, tone = "slate" }) => {
      const toneClass = toneClasses[tone];
      return (
        <div key={title} className={cn("rounded-2xl border p-4", toneClass.bg, toneClass.border)}>
          <div className="flex items-center gap-3">
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", toneClass.icon)}>
              <Icon className="h-4 w-4" />
            </div>
            <p className={cn("text-sm font-extrabold", toneClass.text)}>{title}</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">{description}</p>
        </div>
      );
    })}
  </div>
);
