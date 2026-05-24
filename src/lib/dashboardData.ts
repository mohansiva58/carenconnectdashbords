import { ApiError, apiRequest } from "@/lib/api";
import type { Role } from "@/lib/roles";


export type ComplaintStatus = "Open" | "Resolved" | "Closed" | "In Progress";
export type AttendanceStatus = "Present" | "Leave" | "Half Day" | "Absent";

export interface ComplaintRow {
  id: string;
  title: string;
  submittedBy: string;
  status: ComplaintStatus;
  assignedTo: string;
  assignedToId?: number | null;
  createdAt?: string;
  description?: string;
}

export type ServiceRequestStatus = "Pending" | "Assigned" | "In Progress" | "Completed" | "Cancelled";

export interface ServiceRequestRow {
  id: string;
  title: string;
  type: string;
  customerName: string;
  submittedBy: string;
  submittedById?: number | null;
  assignedTo: string;
  assignedToId?: number | null;
  status: ServiceRequestStatus;
  createdAt: string;
  location?: string;
}

export interface AttendanceRow {
  id: string;
  user: string;
  role: string;
  checkIn: string;
  status: AttendanceStatus;
}

export interface LeadRow {
  id: string;
  name: string;
  category?: string;
  date?: string;
  status?: string;
  location?: string;
}


type DashboardSummary = {
  totalAttendance?: number;
  todayAttendance?: number;
  totalComplaints?: number;
  resolvedComplaints?: number;
  pendingLeaveRequests?: number | null;
};


type Paginated<T> = {
  data?: T[];
};



type ComplaintRecord = {
  id: number | string;
  user_id?: number;
  complaint_type?: string | null;
  complaint_description?: string | null;
  complaint_status?: string | null;
  reviewed_by?: number | null;
  assigned_to?: number | null;
  created_at?: string | null;
};

type ServiceRequestRecord = {
  id: number | string;
  user_id?: number | null;
  service_type?: string | null;
  description?: string | null;
  status?: string | null;
  assigned_to?: number | null;
  assigned_staff?: number | null;
  location?: string | null;
  village?: string | null;
  mandal?: string | null;
  district?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  form_data?: any | null;
  customer_name?: string | null;
  customer_village?: string | null;
  customer_mandal?: string | null;
  customer_district?: string | null;
  customer_state?: string | null;
  assigned_staff_name?: string | null;
};

type AttendanceRecord = {
  id: number | string;
  user_id?: number;
  status?: string | null;
  attendance_date?: string | null;
  check_in_time?: string | null;
  created_at?: string | null;
};

type LeaveRequestRecord = {
  id: number | string;
  user_id?: number | null;
  status?: string | null;
};

export interface DashboardViewData {
  kpis: {
    totalAttendance: string;
    todayAttendance: string;
    pendingApprovals: string;
    openComplaints: string;
    totalCustomers: string;
  };
  trendData: Array<{ name: string; complaints: number }>;
  attendanceTrend: Array<{ name: string; present: number; absent: number }>;
  distributionData: Array<{ name: string; value: number }>;
  complaintsRows: ComplaintRow[];
  attendanceRows: AttendanceRow[];
  serviceRequestsRows: ServiceRequestRow[];
  leaveRequestsRows: Array<{
    id: string;
    staffName: string;
    staffEmail?: string;
    reason: string;
    fromDate: string;
    toDate: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    requestedDays: number;
  }>;
  leadsRows?: LeadRow[];
  pendingLeadsRows?: LeadRow[];
  staffList?: any[];
  hierarchySummary?: {
    scopeSize: number;
    activeAssignments: number;
    inProgressProjects: number;
    completedProjects: number;
    monthlyAvgAttendance: number;
    totalLeaves: number;
  };
}

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const fmtCount = (value: number) => new Intl.NumberFormat("en-IN").format(Math.max(0, value));

const parseDate = (value?: string | null) => {
  if (!value) return null;
  const dt = new Date(value);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

const toDayKey = (value?: string | null) => {
  const dt = parseDate(value);
  return dt ? dt.toISOString().slice(0, 10) : null;
};

const toDisplayDate = (value?: string | null) => {
  const dt = parseDate(value);
  return dt ? dt.toISOString().slice(0, 10) : "-";
};

const toDisplayTime = (value?: string | null) => {
  const dt = parseDate(value);
  if (!dt) return "-";
  return dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
};


const toComplaintStatus = (value?: string | null): ComplaintStatus => {
  switch (String(value ?? "").toUpperCase()) {
    case "OPEN":
      return "Open";
    case "RESOLVED":
      return "Resolved";
    case "CLOSED":
      return "Closed";
    case "IN_PROGRESS":
    default:
      return "In Progress";
  }
};

const toAttendanceStatus = (value?: string | null): AttendanceStatus => {
  switch (String(value ?? "").toUpperCase()) {
    case "PRESENT":
      return "Present";
    case "LEAVE":
      return "Leave";
    case "HALF_DAY":
      return "Half Day";
    case "ABSENT":
    default:
      return "Absent";
  }
};

const getLastSevenDayBuckets = () => {
  const today = new Date();
  const buckets: Array<{ key: string; name: string }> = [];
  for (let i = 6; i >= 0; i -= 1) {
    const dt = new Date(today);
    dt.setHours(0, 0, 0, 0);
    dt.setDate(dt.getDate() - i);
    buckets.push({
      key: dt.toISOString().slice(0, 10),
      name: dt.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return buckets;
};

const extractRows = <T,>(payload: Paginated<T> | T[] | null | undefined): T[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
};

const normalizeRole = (value?: string | null) => String(value || "").trim().toUpperCase();

const optionalApiRequest = async <T,>(path: string, token: string | null, fallback: T): Promise<T> => {
  try {
    return await apiRequest<T>(path, { token, timeoutMs: 4000 });
  } catch {
    return fallback;
  }
};

const roleCanApproveLeads = (role: Role) => role !== "staff";

const dashboardCache = new Map<string, { expiresAt: number; data: DashboardViewData }>();
const dashboardInFlight = new Map<string, Promise<DashboardViewData>>();
const CACHE_MS = 30000;

// Hash function for token to prevent collisions
const hashToken = async (token: string): Promise<string> => {
  try {
    const buffer = new TextEncoder().encode(token);
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex.slice(0, 16); // Use first 16 chars of hash
  } catch {
    // Fallback: use simple hash if crypto not available
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
      const char = token.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }
};

// Periodic cache cleanup: remove expired entries every CACHE_MS/2 (browser only)
let cacheCleanupInterval: ReturnType<typeof setInterval> | null = null;
if (typeof window !== "undefined") {
  cacheCleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of dashboardCache.entries()) {
      if (value.expiresAt <= now) {
        dashboardCache.delete(key);
        dashboardInFlight.delete(key);
      }
    }
  }, CACHE_MS / 2);

  // Cleanup on module unload if possible
  if (window.addEventListener) {
    window.addEventListener("beforeunload", () => {
      if (cacheCleanupInterval !== null) {
        clearInterval(cacheCleanupInterval);
      }
    });
  }
}

const emptySummary: DashboardSummary = {
  totalAttendance: 0,
  todayAttendance: 0,
  totalComplaints: 0,
  resolvedComplaints: 0,
  pendingLeaveRequests: 0,
};

const emptyHierarchySummary = {
  scopeSize: 0,
  activeAssignments: 0,
  inProgressProjects: 0,
  completedProjects: 0,
  leadConversionRate: 0,
  monthlyAvgAttendance: 0,
  totalLeaves: 0,
};

const isRateLimited = (error: unknown) => error instanceof ApiError && error.status === 429;

const optionalAnalyticsRequest = async <T,>(path: string, token: string | null, fallback: T): Promise<T> => {
  try {
    return await apiRequest<T>(path, { token, timeoutMs: 8000 });
  } catch (error) {
    if (isRateLimited(error)) return fallback;
    return fallback;
  }
};

export function clearDashboardCache() {
  dashboardCache.clear();
  dashboardInFlight.clear();
}

export async function fetchDashboardViewData({
  userId,
  role,
  token,
  forceRefresh = false,
}: {
  userId: number;
  role: Role;
  token: string | null;
  forceRefresh?: boolean;
}): Promise<DashboardViewData> {
  const tokenHash = token ? await hashToken(token) : "anon";
  const cacheKey = `${userId}:${role}:${tokenHash}`;

  if (forceRefresh) {
    dashboardCache.delete(cacheKey);
    dashboardInFlight.delete(cacheKey);
  }

  const cached = dashboardCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  const inFlight = dashboardInFlight.get(cacheKey);
  if (inFlight) return inFlight;

  const request = buildDashboardViewData({ userId, role, token }).then((data) => {
    dashboardCache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_MS });
    dashboardInFlight.delete(cacheKey);
    return data;
  }).catch((error) => {
    dashboardInFlight.delete(cacheKey);
    throw error;
  });

  dashboardInFlight.set(cacheKey, request);
  return request;
}

async function buildDashboardViewData({
  userId,
  role,
  token,
}: {
  userId: number;
  role: Role;
  token: string | null;
}): Promise<DashboardViewData> {
  const needsHierarchySummary = role === "coordinator" || role === "regional_head" || role === "cluster_head" || role === "staff";
  const [summary, hierarchySummary] = await Promise.all([
    optionalAnalyticsRequest<DashboardSummary>(`/api/analytics/dashboard/${userId}`, token, emptySummary),
    needsHierarchySummary
      ? optionalAnalyticsRequest<any>(`/api/analytics/hierarchy-summary/${userId}`, token, emptyHierarchySummary)
      : Promise.resolve(emptyHierarchySummary),
  ]);

  const [complaintsPayload, attendancePayload, staffListPayload, serviceRequestsPayload, leaveRequestsPayload] = await Promise.all([
    optionalApiRequest<Paginated<ComplaintRecord>>("/api/operations/complaints?limit=50&page=1", token, { data: [] }),
    optionalApiRequest<Paginated<AttendanceRecord>>("/api/operations/attendance?limit=50&page=1", token, { data: [] }),
    optionalApiRequest<any[]>("/api/staff", token, []),
    optionalApiRequest<Paginated<ServiceRequestRecord>>("/api/operations/service-requests?limit=50&page=1", token, { data: [] }),
    optionalApiRequest<LeaveRequestRecord[]>("/api/staff/leave-requests", token, []),
  ]);

  let staffList = staffListPayload as any[];

  // Coordinator fallback: if the scope-based /api/staff returned ≤1 user (just themselves),
  // fetch all non-admin staff so the dashboard still shows useful team data.
  if (role === "coordinator" && staffList.length <= 1) {
    const fallback = await optionalApiRequest<any[]>("/api/admin/users", token, []);
    if (Array.isArray(fallback) && fallback.length > 0) {
      // Show COORDINATOR, STAFF roles only — hide MD/ADMIN from coordinator view
      const allowedRoles = ["STAFF"];
      staffList = fallback.filter((u: any) => allowedRoles.includes(String(u.role || "").toUpperCase()));
    }
  }

  // Build a quick id→name lookup map from staffList for enriching records
  if (role === "coordinator") {
    staffList = staffList.filter((member: any) => normalizeRole(member?.role) === "STAFF");
  }

  const visibleStaffIds = new Set(
    staffList
      .map((member: any) => Number(member?.id))
      .filter((id: number) => Number.isFinite(id) && id > 0),
  );

  const staffById = new Map<number, string>();
  for (const s of staffList) {
    if (s.id != null && s.name) staffById.set(Number(s.id), String(s.name));
  }
  const resolveStaffName = (id?: number | null, fallback = "-") =>
    id ? (staffById.get(Number(id)) ?? `User #${id}`) : fallback;

  const allComplaints = extractRows(complaintsPayload);
  const allAttendance = extractRows(attendancePayload);
  const leaveRequests = extractRows(leaveRequestsPayload);
  const scopedAttendance = role === "coordinator"
    ? allAttendance.filter((row) => visibleStaffIds.has(Number(row.user_id)))
    : allAttendance;


  const buckets = getLastSevenDayBuckets();
  const trendByDay = new Map(
    buckets.map((bucket) => [bucket.key, { name: bucket.name, complaints: 0 }])
  );
  const attendanceByDay = new Map(
    buckets.map((bucket) => [bucket.key, { name: bucket.name, present: 0, absent: 0 }])
  );


  for (const complaint of allComplaints) {
    const key = toDayKey(complaint.created_at);
    if (!key || !trendByDay.has(key)) continue;
    trendByDay.get(key)!.complaints += 1;
  }

  for (const att of scopedAttendance) {
    const key = toDayKey(att.attendance_date ?? att.created_at);
    if (!key || !attendanceByDay.has(key)) continue;
    const status = String(att.status ?? "").toUpperCase();
    if (status === "PRESENT") {
      attendanceByDay.get(key)!.present += 1;
    } else {
      attendanceByDay.get(key)!.absent += 1;
    }
  }

  const pendingApprovals = toNumber(summary.pendingLeaveRequests);
  const totalComplaints = toNumber(summary.totalComplaints);
  const resolvedComplaints = toNumber(summary.resolvedComplaints);
  const apiTotalCustomers = toNumber((summary as any).totalCustomers);
  const rosterCustomerTotal = staffList.filter((member: any) => normalizeRole(member?.role) === "USER").length;
  const totalCustomers = apiTotalCustomers > 0 ? apiTotalCustomers : rosterCustomerTotal;
  const todayKey = new Date().toISOString().slice(0, 10);
  const monthPrefix = todayKey.slice(0, 7);
  const coordinatorTodayAttendance = scopedAttendance.filter(
    (row) => normalizeRole(row.status) === "PRESENT" && toDayKey(row.attendance_date ?? row.created_at) === todayKey,
  ).length;
  const coordinatorTotalAttendance = scopedAttendance.filter(
    (row) => normalizeRole(row.status) === "PRESENT",
  ).length;
  const coordinatorMonthlyAttendance = scopedAttendance.filter(
    (row) => (toDayKey(row.attendance_date ?? row.created_at) || "").startsWith(monthPrefix),
  );
  const coordinatorMonthlyPresent = coordinatorMonthlyAttendance.filter(
    (row) => normalizeRole(row.status) === "PRESENT",
  ).length;
  const coordinatorMonthlyAvg = coordinatorMonthlyAttendance.length > 0
    ? Math.round((coordinatorMonthlyPresent * 100) / coordinatorMonthlyAttendance.length)
    : 0;
  const coordinatorTotalLeaves = role === "coordinator"
    ? leaveRequests.filter(
        (row) => normalizeRole(row.status) === "APPROVED" && visibleStaffIds.has(Number(row.user_id)),
      ).length
    : toNumber(hierarchySummary?.totalLeaves);

  const distributionData = [
    { name: "Complaints", value: totalComplaints },
    { name: "Resolved", value: resolvedComplaints },
  ];



  const complaintsRows: ComplaintRow[] = allComplaints.slice(0, 50).map((row) => ({
    id: String(row.id),
    title: row.complaint_type?.trim() || row.complaint_description?.trim() || "Complaint",
    submittedBy: resolveStaffName(row.user_id),
    status: toComplaintStatus(row.complaint_status),
    assignedTo: resolveStaffName(row.reviewed_by ?? row.assigned_to),
    assignedToId: (row.reviewed_by ?? row.assigned_to) ?? null,
    createdAt: toDisplayDate(row.created_at),
    description: row.complaint_description?.trim(),
  }));

  const toServiceRequestStatus = (value?: string | null): ServiceRequestStatus => {
    const s = String(value ?? "").toUpperCase();
    switch (s) {
      case "ASSIGNED":
        return "Assigned";
      case "IN_PROGRESS":
        return "In Progress";
      case "WORK_DONE":
      case "COMPLETED":
        return "Completed";
      case "REJECTED":
        return "Cancelled"; // Or add "Rejected" to enum if preferred
      case "CANCELLED":
        return "Cancelled";
      case "APPROVED":
        return "Pending"; // Usually means approved for assignment
      case "SUBMITTED":
      case "PENDING_REVIEW":
      case "CALLING_IN_PROGRESS":
      case "PENDING":
      default:
        return "Pending";
    }
  };

  const extractLoc = (row: ServiceRequestRecord) => {
    const fd = row.form_data;
    if (fd && typeof fd === "object") {
      const parts = [fd.village, fd.mandal, fd.district, fd.state].filter(Boolean);
      if (parts.length > 0) return parts.join(", ");
    }
    return [row.customer_village, row.customer_mandal, row.customer_district, row.customer_state].filter(Boolean).join(", ") || row.location || "-";
  };

  const allServiceRequests = extractRows(serviceRequestsPayload);
  const serviceRequestsRows: ServiceRequestRow[] = allServiceRequests.slice(0, 50).map((row) => ({
    id: String(row.id),
    title: (row.service_type ? row.service_type.charAt(0).toUpperCase() + row.service_type.slice(1) : "") || row.description?.trim() || "Service Request",
    type: row.service_type ? row.service_type.charAt(0).toUpperCase() + row.service_type.slice(1) : "General",
    customerName: row.customer_name?.trim() || "N/A",
    submittedBy: resolveStaffName(row.user_id),
    submittedById: row.user_id ?? null,
    assignedTo: row.assigned_staff_name?.trim() || resolveStaffName(row.assigned_to ?? row.assigned_staff),
    assignedToId: (row.assigned_to ?? row.assigned_staff) ?? null,
    status: toServiceRequestStatus(row.status),
    createdAt: toDisplayDate(row.created_at),
    location: extractLoc(row),
  }));

  const attendanceRows: AttendanceRow[] = scopedAttendance.slice(0, 50).map((row) => ({
    id: String(row.id),
    user: resolveStaffName(row.user_id, "Unknown user"),
    role: row.user_id ? (staffList.find(s => Number(s.id) === Number(row.user_id))?.role ?? "-") : "-",
    checkIn: toDisplayTime(row.check_in_time),
    status: toAttendanceStatus(row.status),
  }));

  const leaveRequestsRows = leaveRequests.slice(0, 50).map((row: any) => ({
    id: String(row.id),
    staffName: resolveStaffName(row.user_id, "Unknown"),
    staffEmail: row.user_email || undefined,
    reason: row.leave_reason?.trim() || row.reason?.trim() || "Leave request",
    fromDate: row.from_date || row.fromDate || "",
    toDate: row.to_date || row.toDate || "",
    status: (String(row.status || "").toUpperCase() || "PENDING") as "PENDING" | "APPROVED" | "REJECTED",
    requestedDays: toNumber(row.number_of_days || row.requestedDays || 1),
  }));

  return {
    kpis: {
      totalAttendance: fmtCount(role === "coordinator" ? coordinatorTotalAttendance : toNumber(summary.totalAttendance)),
      todayAttendance: fmtCount(role === "coordinator" ? coordinatorTodayAttendance : toNumber(summary.todayAttendance)),
      pendingApprovals: fmtCount(pendingApprovals),
      openComplaints: fmtCount(Math.max(totalComplaints - resolvedComplaints, 0)),
      totalCustomers: fmtCount(totalCustomers),
    },
    trendData: Array.from(trendByDay.values()),
    attendanceTrend: Array.from(attendanceByDay.values()),
    distributionData,
    complaintsRows,
    attendanceRows,
    serviceRequestsRows,
    leaveRequestsRows,
    staffList,
    hierarchySummary: {
      scopeSize: toNumber(hierarchySummary?.scopeSize),
      activeAssignments: toNumber(hierarchySummary?.activeAssignments),
      inProgressProjects: toNumber(hierarchySummary?.inProgressProjects),
      completedProjects: toNumber(hierarchySummary?.completedProjects),
      monthlyAvgAttendance: role === "coordinator" ? coordinatorMonthlyAvg : toNumber(hierarchySummary?.monthlyAvgAttendance),
      totalLeaves: coordinatorTotalLeaves,
    },
  };
}
