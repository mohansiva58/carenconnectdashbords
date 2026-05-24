const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");
const trimLeadingSlash = (value: string) => value.replace(/^\/+/, "");
const envOrDefault = (value: string | undefined, fallback: string) => {
  const trimmed = value?.trim();
  return trimmed || fallback;
};

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
export const API_BASE_URL = trimTrailingSlash(RAW_BASE_URL);

export const API_PATHS = {
  login: envOrDefault(import.meta.env.VITE_API_LOGIN_PATH, "/auth/login"),
  signup: envOrDefault(import.meta.env.VITE_API_SIGNUP_PATH, "/auth/signup"),
  me: envOrDefault(import.meta.env.VITE_API_ME_PATH, "/users/me"),
  pendingUsers: envOrDefault(import.meta.env.VITE_API_PENDING_USERS_PATH, "/api/admin/pending-users"),
  approveUser: envOrDefault(import.meta.env.VITE_API_APPROVE_USER_PATH, "/api/admin/users/{id}/decision"),
  rejectUser: envOrDefault(import.meta.env.VITE_API_REJECT_USER_PATH, "/api/admin/users/{id}/decision"),
  approveLead: envOrDefault(import.meta.env.VITE_API_APPROVE_LEAD_PATH, "/api/operations/leads/{id}/approve"),
  rejectLead: envOrDefault(import.meta.env.VITE_API_REJECT_LEAD_PATH, "/api/operations/leads/{id}/reject"),
  notifications: envOrDefault(import.meta.env.VITE_API_NOTIFICATIONS_PATH, "/api/operations/notifications"),
  notificationsUnreadCount:
    envOrDefault(import.meta.env.VITE_API_NOTIFICATIONS_UNREAD_COUNT_PATH, "/api/operations/notifications/unread-count"),
  markNotificationRead: envOrDefault(import.meta.env.VITE_API_MARK_NOTIFICATION_READ_PATH, "/api/operations/notifications/{id}/read"),
  markAllNotificationsRead:
    envOrDefault(import.meta.env.VITE_API_MARK_ALL_NOTIFICATIONS_READ_PATH, "/api/operations/notifications/read-all"),
};

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  timeoutMs?: number;
};

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

const joinUrl = (base: string, path: string) => {
  if (isAbsoluteUrl(path)) return path;
  if (!base) return path;
  if (base.startsWith("/")) {
    return `${trimTrailingSlash(base)}/${trimLeadingSlash(path)}`;
  }
  return `${trimTrailingSlash(base)}/${trimLeadingSlash(path)}`;
};

export const apiUrl = (path: string) => joinUrl(API_BASE_URL, path);

export const replacePathParams = (template: string, params: Record<string, string>) =>
  Object.entries(params).reduce(
    (path, [key, value]) => path.replaceAll(`{${key}}`, encodeURIComponent(value)),
    template
  );

const parsePayload = (raw: string) => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

const extractErrorMessage = (payload: any) =>
  payload?.message ??
  payload?.error ??
  payload?.details?.message ??
  payload?.data?.message ??
  "Request failed";

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const url = apiUrl(path);
  const method = options.method ?? "GET";
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 15000;
  const timeout = timeoutMs > 0
    ? setTimeout(() => controller.abort(), timeoutMs)
    : null;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
      credentials: "include",
      signal: controller.signal,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });

    const raw = await res.text();
    const payload = parsePayload(raw);

    if (!res.ok) {
      throw new ApiError(extractErrorMessage(payload), res.status, payload);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Request timed out", 408, null);
    }
    throw error;
  } finally {
    if (timeout !== null) clearTimeout(timeout);
  }
}
