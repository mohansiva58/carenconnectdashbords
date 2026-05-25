import { ReactNode } from "react";
import brandLogo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

export const BrandWatermark = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("relative overflow-hidden rounded-3xl", className)}>
    <img
      src={brandLogo}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-44 w-auto -translate-x-1/2 -translate-y-1/2 select-none object-contain opacity-[0.055] sm:h-56 lg:h-72"
    />
    <div className="relative z-10">{children}</div>
  </div>
);
