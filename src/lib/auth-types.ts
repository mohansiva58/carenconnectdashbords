import type { Role } from "./roles";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  status: "approved" | "pending" | "rejected";
};

export type AuthCtx = {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; user?: AuthUser }>;
  signup: (data: Omit<AuthUser, "id" | "status"> & { password: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  pendingRequests: AuthUser[];
  approveRequest: (id: string) => Promise<{ ok: boolean; error?: string }>;
  rejectRequest: (id: string) => Promise<{ ok: boolean; error?: string }>;
  approveLead: (id: string) => Promise<{ ok: boolean; error?: string }>;
  rejectLead: (id: string) => Promise<{ ok: boolean; error?: string }>;
};
