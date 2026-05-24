import { ReactNode } from "react";
import { BrandLogo } from "./BrandLogo";

export const AuthShell = ({ title, subtitle, children, footer }: {
  title: string; subtitle?: string; children: ReactNode; footer?: ReactNode;
}) => (
  <div className="min-h-screen bg-gradient-soft">
    <div className="container flex min-h-screen flex-col items-center justify-center py-10">
      <div className="mb-8"><BrandLogo /></div>
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-card">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <div className="mt-6 text-sm text-muted-foreground">{footer}</div>}
    </div>
  </div>
);
