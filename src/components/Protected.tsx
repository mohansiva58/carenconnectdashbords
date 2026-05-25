import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Role } from "@/lib/roles";
import { ReactNode } from "react";

export const Protected = ({ allow, children }: { allow: Role[]; children: ReactNode }) => {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (!allow.includes(user.role)) return <Navigate to="/forbidden" replace />;
  return <>{children}</>;
};
