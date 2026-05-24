import { Link } from "react-router-dom";
import brandlogo from "@/assets/logo.png";

export const BrandLogo = ({ to = "/", compact = false }: { to?: string; compact?: boolean }) => (
  <Link to={to} className="flex min-w-0 items-center gap-2.5">
    <div className="flex h-12 w-28 shrink-0 items-center justify-start overflow-visible">
      <img
        src={brandlogo}
        alt="Care and Connect Services"
        className="h-full w-full object-contain object-left"
      />
    </div>
    <div className={compact ? "hidden leading-tight sm:block sm:min-w-0" : "min-w-0 leading-tight"}>
      <p className="font-display text-base font-extrabold tracking-tight text-foreground">Care and Connect</p>
      <p className="truncate text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Connect. Mobilize. Deliver.</p>
    </div>
  </Link>
);
