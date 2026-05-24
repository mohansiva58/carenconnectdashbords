import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { Role } from "./roles";
import { apiRequest, API_PATHS, ApiError, replacePathParams } from "./api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  status: "approved" | "pending" | "rejected";
};

type AuthCtx = {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string, role: Role) => Promise<{ ok: boolean; error?: string; user?: AuthUser }>;
  signup: (data: Omit<AuthUser, "id" | "status"> & { password: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  pendingRequests: AuthUser[];
  approveRequest: (id: string) => Promise<{ ok: boolean; error?: string }>;
  rejectRequest: (id: string) => Promise<{ ok: boolean; error?: string }>;
  approveLead: (id: string) => Promise<{ ok: boolean; error?: string }>;
  rejectLead: (id: string) => Promise<{ ok: boolean; error?: string }>;
};

const Ctx = createContext<AuthCtx | null>(null);
const SESSION = "cac.session";
const TOKEN = "cac.token";

const asRecord = (value: unknown): Record<string, any> | null => {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, any>;
};

const normalizeRole = (value: unknown): Role | null => {
  const raw = String(value ?? "")
    .trim()
    .toUpperCase();

  if (raw === "MD") return "md";
  if (raw === "SUPER_ADMIN" || raw === "CEO") return "md";
  if (raw === "ADMIN") return "admin";
  if (raw === "REGIONAL_HEAD" || raw === "REGIONAL") return "regional_head";
  if (raw === "CLUSTER_HEAD" || raw === "CLUSTER") return "cluster_head";
  if (raw === "COORDINATOR") return "coordinator";
  if (raw === "FIELD_OFFICER" || raw === "STAFF") return "staff";

  // Handle legacy mappings for backward compatibility during transition
  if (raw === "USER") return "staff";

  return null;
};

const normalizeStatus = (value: unknown): AuthUser["status"] => {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase();
  if (raw === "pending") return "pending";
  if (raw === "rejected") return "rejected";
  return "approved";
};

const toAuthUser = (input: unknown): AuthUser | null => {
  const record = asRecord(input);
  if (!record) return null;

  const role = normalizeRole(record.role ?? record.userRole ?? record.type);
  if (!role) return null;

  const id = String(record.id ?? record._id ?? record.userId ?? record.uuid ?? "").trim();
  const name =
    String(
      record.name ??
        record.fullName ??
        [record.firstName, record.lastName].filter(Boolean).join(" ") ??
        ""
    ).trim() || "User";
  const email = String(record.email ?? record.username ?? "").trim();

  if (!id || !email) return null;

  return {
    id,
    name,
    email,
    phone: record.phone ? String(record.phone) : undefined,
    role,
    status: normalizeStatus(record.status ?? record.approvalStatus),
  };
};

const extractUser = (payload: unknown): AuthUser | null => {
  const root = asRecord(payload);
  if (!root) return null;

  return (
    toAuthUser(root.user) ??
    toAuthUser(root.data?.user) ??
    toAuthUser(root.data) ??
    toAuthUser(root.profile) ??
    toAuthUser(root)
  );
};

const extractToken = (payload: unknown): string | null => {
  const root = asRecord(payload);
  if (!root) return null;
  return (
    String(root.accessToken ?? root.token ?? root.jwt ?? root.data?.token ?? root.data?.accessToken ?? "").trim() || null
  );
};

const decodeJwtPayload = (token: string): Record<string, any> | null => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const raw = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = raw.length % 4 ? "=".repeat(4 - (raw.length % 4)) : "";
    const json = atob(raw + pad);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const getTokenExpiryMs = (token: string): number | null => {
  const payload = decodeJwtPayload(token);
  const exp = Number(payload?.exp);
  if (!Number.isFinite(exp) || exp <= 0) return null;
  return exp * 1000;
};

const isTokenExpired = (token: string) => {
  const expiryMs = getTokenExpiryMs(token);
  if (!expiryMs) return false;
  return Date.now() >= expiryMs;
};

const toUserFromToken = (token: string, emailInput: string): AuthUser | null => {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  const email = String(payload.sub ?? emailInput ?? "").trim();
  const role = normalizeRole(payload.role);

  if (!email || !role) return null;

  return {
    id: String(payload.userId ?? payload.id ?? email),
    name: String(payload.name ?? email.split("@")[0] ?? "User"),
    email,
    role,
    status: "approved",
  };
};

const extractPendingUsers = (payload: unknown): AuthUser[] => {
  const root = asRecord(payload);
  if (!root) return [];

  const rows =
    (Array.isArray(root) ? root : null) ??
    (Array.isArray(root.users) ? root.users : null) ??
    (Array.isArray(root.pendingUsers) ? root.pendingUsers : null) ??
    (Array.isArray(root.data?.users) ? root.data.users : null) ??
    (Array.isArray(root.data?.pendingUsers) ? root.data.pendingUsers : null) ??
    (Array.isArray(root.data) ? root.data : null) ??
    [];

  return rows
    .map((row: unknown) => toAuthUser(row))
    .filter((row: AuthUser | null): row is AuthUser => Boolean(row))
    .filter((row) => row.status === "pending");
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
};

const readSessionUser = (): AuthUser | null => {
  try {
    const token = localStorage.getItem(TOKEN);
    if (!token || isTokenExpired(token)) return null;
    const raw = localStorage.getItem(SESSION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const readToken = (): string | null => {
  try {
    const persisted = localStorage.getItem(TOKEN);
    if (!persisted) return null;
    if (isTokenExpired(persisted)) {
      localStorage.removeItem(TOKEN);
      localStorage.removeItem(SESSION);
      return null;
    }
    return persisted;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readSessionUser());
  const [token, setToken] = useState<string | null>(() => readToken());
  const [pendingRequests, setPendingRequests] = useState<AuthUser[]>([]);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    setPendingRequests([]);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION, JSON.stringify(user));
    else localStorage.removeItem(SESSION);
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN, token);
    else localStorage.removeItem(TOKEN);
  }, [token]);

  const refreshPendingRequests = useCallback(
    async (activeUser: AuthUser | null = user, activeToken: string | null = token) => {
      if (!API_PATHS.pendingUsers || !activeUser || !["admin", "md"].includes(activeUser.role)) {
        setPendingRequests([]);
        return;
      }

      try {
        const response = await apiRequest<any>(API_PATHS.pendingUsers, { token: activeToken });
        setPendingRequests(extractPendingUsers(response));
      } catch {
        setPendingRequests([]);
      }
    },
    [token, user]
  );

  useEffect(() => {
    let cancelled = false;
    const bootstrap = async () => {
      if (!user) {
        setPendingRequests([]);
        return;
      }

      try {
        if (API_PATHS.me) {
          const response = await apiRequest<any>(API_PATHS.me, { token });
          const current = extractUser(response);
          if (!cancelled && current) {
            setUser(current);
          }
        }
      } catch {
        // Keep the persisted session when /me endpoint is not available.
      }

      if (!cancelled) {
        await refreshPendingRequests();
      }
    };

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const login: AuthCtx["login"] = async (email, password, role) => {
    try {
      const response = await apiRequest<any>(API_PATHS.login, {
        method: "POST",
        body: { email, password },
      });

      const nextToken = extractToken(response);
      const nextUser = extractUser(response) ?? (nextToken ? toUserFromToken(nextToken, email) : null);

      if (!nextUser) {
        return { ok: false, error: "Login succeeded but user profile could not be derived from token/response." };
      }
      const roleMatches = nextUser.role === role;
      if (!roleMatches) {
        return { ok: false, error: "Selected role does not match this account." };
      }
      const effectiveUser: AuthUser = nextUser;
      if (nextUser.status === "pending") {
        return { ok: false, error: "Your account is awaiting admin approval." };
      }
      if (nextUser.status === "rejected") {
        return { ok: false, error: "Your account request was rejected." };
      }

      setUser(effectiveUser);
      setToken(nextToken);
      await refreshPendingRequests(effectiveUser, nextToken);

      return { ok: true, user: effectiveUser };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Login failed.") };
    }
  };

  const signup: AuthCtx["signup"] = async (data) => {
    try {
      await apiRequest(API_PATHS.signup, {
        method: "POST",
        body: data,
      });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Signup failed.") };
    }
  };

  const logout = () => {
    clearSession();
  };

  const approveRequest: AuthCtx["approveRequest"] = async (id) => {
    if (!API_PATHS.approveUser) {
      return { ok: false, error: "Approve endpoint is not configured for this backend." };
    }
    try {
      const path = replacePathParams(API_PATHS.approveUser, { id });
      await apiRequest(path, { method: "PUT", token, body: { decision: "APPROVE" } });
      await refreshPendingRequests();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Unable to approve request.") };
    }
  };

  const rejectRequest: AuthCtx["rejectRequest"] = async (id) => {
    if (!API_PATHS.rejectUser) {
      return { ok: false, error: "Reject endpoint is not configured for this backend." };
    }
    try {
      const path = replacePathParams(API_PATHS.rejectUser, { id });
      await apiRequest(path, { method: "PUT", token, body: { decision: "REJECT" } });
      await refreshPendingRequests();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Unable to reject request.") };
    }
  };

  const approveLead: AuthCtx["approveLead"] = async (id) => {
    if (!API_PATHS.approveLead) {
      return { ok: false, error: "Approve lead endpoint is not configured." };
    }
    try {
      const path = replacePathParams(API_PATHS.approveLead, { id });
      await apiRequest(path, { method: "PUT", token });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Unable to approve lead.") };
    }
  };

  const rejectLead: AuthCtx["rejectLead"] = async (id) => {
    if (!API_PATHS.rejectLead) {
      return { ok: false, error: "Reject lead endpoint is not configured." };
    }
    try {
      const path = replacePathParams(API_PATHS.rejectLead, { id });
      await apiRequest(path, { method: "PUT", token });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: getErrorMessage(error, "Unable to reject lead.") };
    }
  };

  useEffect(() => {
    void refreshPendingRequests();
  }, [refreshPendingRequests]);

  useEffect(() => {
    if (!token) return;
    const expiryMs = getTokenExpiryMs(token);
    if (!expiryMs) return;

    const timeoutMs = Math.max(expiryMs - Date.now(), 0);
    if (timeoutMs === 0) {
      clearSession();
      return;
    }

    const timer = window.setTimeout(() => {
      clearSession();
    }, timeoutMs);

    return () => window.clearTimeout(timer);
  }, [clearSession, token]);

  return (
    <Ctx.Provider value={{ user, token, login, signup, logout, pendingRequests, approveRequest, rejectRequest, approveLead, rejectLead }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
