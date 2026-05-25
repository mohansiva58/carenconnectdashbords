/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { AlertTriangle, Search, Users, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { apiRequest } from "@/lib/api";

const isAssignableOperationalRole = (role?: string | null) => {
  const normalized = String(role || "").trim().toUpperCase();
  // Support supervisor, coordinator, manager, staff, field officer
  return ["COORDINATOR", "STAFF", "FIELD_OFFICER", "FIELD_STAFF", "MANAGER", "SUPERVISOR"].includes(normalized);
};

const complaintStatusCfg: Record<string, { bg: string; text: string; dot: string }> = {
  Open: { bg: "bg-rose-50 border-rose-100", text: "text-rose-700", dot: "bg-rose-500" },
  "In Progress": { bg: "bg-amber-50 border-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  Resolved: { bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  Closed: { bg: "bg-slate-100 border-slate-200", text: "text-slate-600", dot: "bg-slate-400" },
};

const StatusBadge = ({ label, cfg }: { label: string; cfg: { bg: string; text: string; dot: string } }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.text}`}
  >
    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
    {label}
  </span>
);

const AssignComplaintDropdown = ({
  complaintId,
  staffList,
  currentAssignedToId,
  isResolved,
  onAssigned,
}: {
  complaintId: string;
  staffList: any[];
  currentAssignedToId?: number | null;
  isResolved?: boolean;
  onAssigned: (staffId: number, staffName: string) => void;
}) => {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [srch, setSrch] = useState("");

  const assignable = useMemo(
    () =>
      (staffList || [])
        .filter((s) => {
          return isAssignableOperationalRole(s.role) && String(s.status || "").toUpperCase() !== "PENDING";
        })
        .filter((s) => !srch || String(s.name || "").toLowerCase().includes(srch.toLowerCase())),
    [staffList, srch]
  );

  const doAssign = async (staffId: number, staffName: string) => {
    setLoading(true);
    try {
      await apiRequest(`/api/operations/complaints/${complaintId}/assign`, {
        method: "PUT",
        token,
        body: { assigned_to: staffId, remarks: isResolved ? "Reassigned via Dashboard" : "Assigned via Dashboard" },
      });
      onAssigned(staffId, staffName);
      toast.success(isResolved ? `Complaint reassigned to ${staffName}` : `Complaint assigned to ${staffName}`);
    } catch {
      toast.error("Failed to assign complaint");
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
        {loading ? "Assigning..." : isResolved ? "Reassign Staff" : "Assign Staff"}
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

const ComplaintTableRow = ({
  row: initialRow,
  cfg,
  staffList,
}: {
  row: any;
  cfg: { bg: string; text: string; dot: string };
  staffList: any[];
}) => {
  const [row, setRow] = useState(initialRow);

  const handleAssigned = (staffId: number, staffName: string) => {
    setRow((prev: any) => ({
      ...prev,
      assignedTo: staffName,
      assignedToId: staffId,
      status: "In Progress",
    }));
  };

  const isAssigned = row.assignedTo !== "-" && !!row.assignedToId;
  const rowCfg = isAssigned ? complaintStatusCfg[row.status] || complaintStatusCfg["In Progress"] : cfg;

  return (
    <tr className="group transition-colors hover:bg-slate-50/50">
      <td className="px-5 py-4 font-mono text-[11px] text-slate-400">#{row.id}</td>
      <td className="px-5 py-4">
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
            {row.title}
          </span>
          {row.description && <span className="mt-1 line-clamp-1 text-xs text-slate-400">{row.description}</span>}
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
            {row.submittedBy.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-slate-700">{row.submittedBy}</span>
        </div>
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
            <AssignComplaintDropdown
              complaintId={row.id}
              staffList={staffList}
              currentAssignedToId={row.assignedToId}
              isResolved={row.status === "Resolved"}
              onAssigned={handleAssigned}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 italic">Unassigned</span>
            <AssignComplaintDropdown
              complaintId={row.id}
              staffList={staffList}
              currentAssignedToId={null}
              isResolved={row.status === "Resolved"}
              onAssigned={handleAssigned}
            />
          </div>
        )}
      </td>
      <td className="px-5 py-4">
        <StatusBadge label={row.status} cfg={rowCfg} />
      </td>
      <td className="px-5 py-4 text-xs font-medium text-slate-400">{row.createdAt || "-"}</td>
    </tr>
  );
};

export const ComplaintsPanel = ({ rows, staffList }: { rows: any[]; staffList: any[] }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return (rows || []).filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.submittedBy.toLowerCase().includes(q) ||
        r.assignedTo.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [rows, search, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: (rows || []).length };
    (rows || []).forEach((r) => {
      c[r.status] = (c[r.status] || 0) + 1;
    });
    return c;
  }, [rows]);

  const statuses = ["all", "Open", "In Progress", "Resolved", "Closed"];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Support Complaints</h3>
            <p className="text-xs text-slate-400">Resolve escalated client and operations issues</p>
          </div>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by issue title, assignee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {statuses.map((s) => {
          const isActive = statusFilter === s;
          const cfg =
            s === "all"
              ? { bg: "bg-slate-100/80 text-slate-700", border: "border-slate-200" }
              : {
                  bg: isActive ? complaintStatusCfg[s]?.bg : "bg-white",
                  text: isActive ? complaintStatusCfg[s]?.text : "text-slate-500",
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
              <span>{s === "all" ? "All Issues" : s}</span>
              <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-[10px] font-black tracking-tight bg-current/10">
                {counts[s] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-4 border border-slate-100">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">No matching issues</p>
            <p className="text-xs text-slate-400 mt-1">There are no complaints matching the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">ID</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Reporter</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Assignee</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Reported Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r) => (
                  <ComplaintTableRow
                    key={r.id}
                    row={r}
                    cfg={complaintStatusCfg[r.status] || complaintStatusCfg["Open"]}
                    staffList={staffList}
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
