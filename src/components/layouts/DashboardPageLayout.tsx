import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DashboardPageLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * DashboardPageLayout - Standardized page wrapper for dashboard views
 * Provides consistent padding, spacing, and visual structure
 */
export const DashboardPageLayout = ({ children, className }: DashboardPageLayoutProps) => {
  return (
    <div className={cn("w-full", className)}>
      {children}
    </div>
  );
};

export default DashboardPageLayout;
