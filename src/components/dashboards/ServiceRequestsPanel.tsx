/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { ClipboardList, Search, Users, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/api";

const isAssignableOperationalRole = (role?: string | null) => {
  const normalized = String(role || "").trim().toUpperCase();
  return ["COORDINATOR", "STAFF", "FIELD_OFFICER", "FIELD_STAFF", "MANAGER", "SUPERVISOR"].includes(normalized);
};

const srStatusCfg: Record<string, { bg: string; text: string; dot: string }> = {
  Pending: { bg: "bg-amber-50 border-amber-100", text: "text-amber-700", dot: "bg-amber-400" },
  Assigned: { bg: "bg-blue-50 border-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  "In Progress": { bg: "bg-indigo-50 border-indigo-100", text: "text-indigo-700", dot: "bg-indigo-500" },
  Completed: { bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  Cancelled: { bg: "bg-slate-100 border-slate-200", text: "text-slate-500", dot: "bg-slate-400" },
};

const StatusBadge = ({ label, cfg }: { label: string; cfg: { bg: string; text: string; dot: string } }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.text}`}
  >
    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
    {label}
  </span>
);

const AssignStaffDropdown = ({
  requestId,
  staffList,
  currentAssignedToId,
  onAssigned,
  viewerRole,
}: {
  requestId: string;
  staffList: any[];
  currentAssignedToId?: number | null;
  onAssigned: (staffId: number, staffName: string) => void;
  viewerRole: string;
}) => {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [srch, setSrch] = useState("");

  const assignable = useMemo(() => {
    const vRole = String(viewerRole || "").toUpperCase();
    return (staffList || [])
      .filter((s) => {
        const r = String(s.role || "").toUpperCase();
        const isStaff = ["STAFF", "USER", "FIELD_OFFICER", "FIELD_STAFF"].includes(r);
        if (vRole === "COORDINATOR") return isStaff;
        return isStaff || r === "COORDINATOR" || r === "SUPERVISOR" || r === "MANAGER";
      })
      .filter((s) => String(s.status || "").toUpperCase() !== "PENDING")
      .filter((s) => !srch || String(s.name || "").toLowerCase().includes(srch.toLowerCase()));
  }, [staffList, srch, viewerRole]);

  const doAssign = async (staffId: number, staffName: string) => {
    setLoading(true);
    try {
      await apiRequest(`/api/operations/service-requests/${requestId}/assign-staff`, {
        method: "PUT",
        token,
        body: { staff_id: staffId },
      });
      onAssigned(staffId, staffName);
      toast.success(`Assigned to ${staffName}`);
    } catch {
      toast.error("Failed to assign staff");
    } finally {
      setLoading(false);
      setOpen(false);
      setSrch("");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200/80 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50"
      >
        <Users className="h-3.5 w-3.5" />
        {loading ? "Assigning…" : "Assign Staff"}
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => {
              setOpen(false);
              setSrch("");
            }}
          />
          <div className="absolute right-0 top-full z-40 mt-1.5 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 p-2 bg-slate-50">
              <input
                autoFocus
                type="text"
                placeholder="Search staff…"
                value={srch}
                onChange={(e) => setSrch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-indigo-400"
              />
            </div>
            <div className="max-h-52 overflow-y-auto">
              {assignable.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-400">No assignable staff found</p>
              ) : (
                assignable.map((s) => {
                  const isCurrent = Number(s.id) === Number(currentAssignedToId);
                  return (
                    <button
                      key={s.id}
                      onClick={() => doAssign(Number(s.id), String(s.name))}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-xs transition hover:bg-slate-50 ${
                        isCurrent ? "bg-emerald-50" : ""
                      }`}
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                        {String(s.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900">{s.name}</p>
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">{s.role}</p>
                      </div>
                      {isCurrent && <span className="shrink-0 text-emerald-500">✓</span>}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const SRTableRow = ({
  row: initialRow,
  cfg,
  staffList,
  viewerRole,
}: {
  row: any;
  cfg: { bg: string; text: string; dot: string };
  staffList: any[];
  viewerRole: string;
}) => {
  const [row, setRow] = useState(initialRow);

  const handleAssigned = (staffId: number, staffName: string) => {
    setRow((prev: any) => ({
      ...prev,
      assignedTo: staffName,
      assignedToId: staffId,
      status: "Assigned",
    }));
  };

  const isAssigned = row.assignedTo !== "-" && !!row.assignedToId;
  const rowCfg = isAssigned ? srStatusCfg[row.status] || srStatusCfg["Assigned"] : cfg;

  return (
    <tr className="group transition-colors hover:bg-slate-50/50">
      <td className="px-5 py-4 font-mono text-[11px] text-slate-400">#{row.id}</td>
      <td className="px-5 py-4">
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
            {row.title}
          </span>
          <span className="mt-1.5 inline-flex w-fit items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
            {row.type}
          </span>
        </div>
      </td>
      <td className="px-5 py-4">
        <span className="text-sm font-medium text-slate-700">{row.customerName}</span>
      </td>
      <td className="px-5 py-4">
        {isAssigned ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600">
                {row.assignedTo.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700">{row.assignedTo}</span>
            </div>
            {viewerRole !== "staff" && (
              <AssignStaffDropdown
                requestId={row.id}
                staffList={staffList}
                currentAssignedToId={row.assignedToId}
                onAssigned={handleAssigned}
                viewerRole={viewerRole}
              />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 italic">Unassigned</span>
            {viewerRole !== "staff" && (
              <AssignStaffDropdown
                requestId={row.id}
                staffList={staffList}
                currentAssignedToId={null}
                onAssigned={handleAssigned}
                viewerRole={viewerRole}
              />
            )}
          </div>
        )}
      </td>
      <td className="px-5 py-4 text-xs font-semibold text-slate-500">{row.location || "-"}</td>
      <td className="px-5 py-4">
        <StatusBadge label={row.status} cfg={rowCfg} />
      </td>
      <td className="px-5 py-4 text-xs font-medium text-slate-400">{row.createdAt || "-"}</td>
    </tr>
  );
};

export const ServiceRequestsPanel = ({
  rows,
  staffList,
  viewerRole,
  initialStatusFilter = "all",
}: {
  rows: any[];
  staffList: any[];
  viewerRole: string;
  initialStatusFilter?: string;
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);

  const filtered = useMemo(() => {
    return (rows || []).filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.assignedTo.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "Assigned"
          ? r.status === "Assigned" ||
            r.status === "In Progress" ||
            (!!r.assignedToId && r.status !== "Completed" && r.status !== "Cancelled")
          : r.status === statusFilter);

      return matchSearch && matchStatus;
    });
  }, [rows, search, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: (rows || []).length };
    (rows || []).forEach((r) => {
      c[r.status] = (c[r.status] || 0) + 1;
    });
    c["Assigned"] = (rows || []).filter(
      (r) =>
        r.status === "Assigned" ||
        r.status === "In Progress" ||
        (!!r.assignedToId && r.status !== "Completed" && r.status !== "Cancelled")
    ).length;
    return c;
  }, [rows]);

  const statuses = ["all", "Pending", "Assigned", "In Progress", "Completed", "Cancelled"];

  const pending = (rows || []).filter(
    (r) => !r.assignedToId && r.status !== "Completed" && r.status !== "Cancelled"
  ).length;
  const assigned = (rows || []).filter(
    (r) => !!r.assignedToId && r.status !== "Completed" && r.status !== "Cancelled"
  ).length;
  const completed = (rows || []).filter((r) => r.status === "Completed").length;

  return (
    <div className="space-y-6">
      {/* KPI stats bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Pipeline</p>
          <p className="mt-1 text-2xl font-black text-slate-800">{rows?.length || 0}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Pending Assignment</p>
          <p className="mt-1 text-2xl font-black text-amber-700">{pending}</p>
        </div>
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Assigned / Active</p>
          <p className="mt-1 text-2xl font-black text-indigo-700">{assigned}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Successfully Closed</p>
          <p className="mt-1 text-2xl font-black text-emerald-700">{completed}</p>
        </div>
      </div>

      {/* Header and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Assigned Services</h3>
            <p className="text-xs text-slate-400">Track and dispatch field actions</p>
          </div>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by client, service type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {statuses.map((s) => {
          const isActive = statusFilter === s;
          const cfg =
            s === "all"
              ? { bg: "bg-slate-100/80 text-slate-700", border: "border-slate-200" }
              : {
                  bg: isActive ? srStatusCfg[s]?.bg : "bg-white",
                  text: isActive ? srStatusCfg[s]?.text : "text-slate-500",
                  border: isActive ? "border-current/25" : "border-slate-200",
                };
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                isActive ? "shadow-xs" : "hover:border-slate-300"
              } ${cfg.bg} ${cfg.text || ""} ${cfg.border}`}
            >
              <span>{s === "all" ? "All Requests" : s}</span>
              <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-[10px] font-black tracking-tight bg-current/10">
                {counts[s] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table grid */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-4 border border-slate-100">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">No matching requests</p>
            <p className="text-xs text-slate-400 mt-1">There are no operational requests matching the filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">ID</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Service Title</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Customer</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Assigned Agent</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Location</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Dispatched Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r) => (
                  <SRTableRow
                    key={r.id}
                    row={r}
                    cfg={srStatusCfg[r.status] || srStatusCfg["Pending"]}
                    staffList={staffList}
                    viewerRole={viewerRole}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
