import { createContext, useContext } from "react";
import type { AuthCtx } from "./auth-types";

export const AuthContext = createContext<AuthCtx | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
