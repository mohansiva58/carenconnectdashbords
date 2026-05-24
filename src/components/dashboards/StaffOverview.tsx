/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Search, Users, ShieldCheck, UserCheck } from "lucide-react";
import { StaffAttendanceModal } from "./StaffAttendanceModal";
import type { DashboardViewData } from "@/lib/dashboardData";
import type { Role } from "@/lib/roles";

const ROLE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  MD: { label: "Managing Director", icon: ShieldCheck, color: "#4F46E5" },
  ADMIN: { label: "Admin", icon: ShieldCheck, color: "#2563EB" },
  REGIONAL_HEAD: { label: "Regional Head", icon: UserCheck, color: "#0D9488" },
  CLUSTER_HEAD: { label: "Cluster Head", icon: UserCheck, color: "#7C3AED" },
  COORDINATOR: { label: "Coordinator", icon: UserCheck, color: "#D97706" },
  STAFF: { label: "Staff", icon: Users, color: "#4B5563" },
  USER: { label: "Customer", icon: Users, color: "#6B7280" },
};

const normalizeDashboardRole = (role?: string | null) => {
  const normalized = String(role || "").trim().toUpperCase();
  if (normalized === "SUPER_ADMIN" || normalized === "CEO") return "MD";
  if (normalized === "REGIONAL") return "REGIONAL_HEAD";
  if (normalized === "CLUSTER") return "CLUSTER_HEAD";
  if (normalized === "MANAGER" || normalized === "SUPERVISOR") return "COORDINATOR";
  if (normalized === "FIELD_STAFF" || normalized === "FIELD_OFFICER") return "STAFF";
  if (normalized === "USER") return "USER";
  return normalized || "STAFF";
};

function getInitials(name: string) {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const StaffCard = ({
  member,
  cfg,
  data,
  onClick,
}: {
  member: any;
  cfg: any;
  data: DashboardViewData;
  onClick?: () => void;
}) => {
  const memberIdStr = String(member.id);
  const att = data.attendanceRows?.find(
    (a) => String(a.user) === `User #${memberIdStr}` || String(a.user) === memberIdStr
  );
  const isPresent = att?.status === "Present";
  const isAbsent = att?.status === "Absent";
  const isPending = String(member.status || "").toUpperCase() === "PENDING";

  const complaintsCount = data.complaintsRows?.filter(
    (c) => c.submittedBy === `User #${memberIdStr}` || c.submittedBy === memberIdStr
  ).length || 0;

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400 hover:shadow-md cursor-pointer"
    >
      {isPending && (
        <div className="absolute inset-x-0 top-0 bg-amber-50 px-4 py-1.5 border-b border-amber-100 flex items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">⏳ Pending Approval</span>
        </div>
      )}
      <div className={isPending ? "mt-4" : ""}>
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-base font-bold transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundColor: isPending ? "#FEF3C7" : `${cfg.color}15`,
                color: isPending ? "#D97706" : cfg.color,
              }}
            >
              {getInitials(member.name || "")}
            </div>
            {isPresent && (
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm" title="Present today" />
            )}
            {isAbsent && (
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-rose-500 shadow-sm" title="Absent today" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-bold text-slate-800 transition-colors group-hover:text-indigo-600">
              {member.name}
            </h4>
            <p className="truncate text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {member.employeeId || member.phone || "Staff Member"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Complaints</span>
          <span className="text-xs font-extrabold text-slate-700">{complaintsCount}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Status</span>
          <span
            className={`mt-0.5 inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase ${
              isPending
                ? "bg-amber-50 text-amber-700 border border-amber-100"
                : isPresent
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : isAbsent
                ? "bg-rose-50 text-rose-700 border border-rose-100"
                : "bg-slate-50 text-slate-500 border border-slate-100"
            }`}
          >
            {isPending ? "Pending" : isPresent ? "Active" : isAbsent ? "Away" : "Idle"}
          </span>
        </div>
      </div>
    </div>
  );
};

export const StaffOverview = ({
  staff,
  data,
  viewerRole,
}: {
  staff: any[];
  data: DashboardViewData;
  viewerRole: Role;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string | null>(null);
  const [selectedStaffForAttendance, setSelectedStaffForAttendance] = useState<any | null>(null);

  const filteredStaff = useMemo(() => {
    return (staff || []).filter((s) => {
      const roleName = normalizeDashboardRole(s.role);

      // Strict hierarchy: Coordinators and below cannot see higher administrative roles
      if (viewerRole === "coordinator") {
        const highRoles = ["MD", "ADMIN"];
        if (highRoles.includes(roleName)) return false;
      }

      const name = (s.name || "").toLowerCase();
      const email = (s.email || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      return name.includes(query) || email.includes(query) || roleName.toLowerCase().includes(query);
    });
  }, [staff, searchQuery, viewerRole]);

  const staffByRole = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredStaff.forEach((s) => {
      const r = normalizeDashboardRole(s.role);
      if (!groups[r]) groups[r] = [];
      groups[r].push(s);
    });
    return groups;
  }, [filteredStaff]);

  const roleStats = useMemo(() => {
    const stats: Record<string, number> = {};
    (staff || []).forEach((s) => {
      const r = normalizeDashboardRole(s.role);
      stats[r] = (stats[r] || 0) + 1;
    });
    return stats;
  }, [staff]);

  const sortedRoles = useMemo(() => {
    let roles = Object.keys(staffByRole);
    if (selectedRoleFilter) {
      roles = roles.filter((r) => r === selectedRoleFilter);
    }
    const order = ["MD", "ADMIN", "REGIONAL_HEAD", "CLUSTER_HEAD", "COORDINATOR", "STAFF", "USER"];
    return roles.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }, [staffByRole, selectedRoleFilter]);

  return (
    <div className="space-y-6">
      {/* Header section with Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Team Roster & Directory</h3>
            <p className="text-xs text-slate-400">Search and monitor active operational units</p>
          </div>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search roster..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Role filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {Object.entries(ROLE_CONFIG).map(([roleKey, cfg]) => {
          if (viewerRole === "coordinator" && ["MD", "ADMIN"].includes(roleKey)) return null;

          const count = roleStats[roleKey] || 0;
          if (count === 0 && roleKey !== "STAFF") return null;
          const isSelected = selectedRoleFilter === roleKey;
          return (
            <button
              key={roleKey}
              onClick={() => setSelectedRoleFilter(isSelected ? null : roleKey)}
              className={`flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50/50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
              }`}
              style={{ minWidth: "140px" }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${cfg.color}12`, color: cfg.color }}
              >
                <cfg.icon className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{cfg.label}</p>
                <p className="text-sm font-extrabold text-slate-800">{count}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Roster list grouped by Role */}
      <div className="space-y-8">
        {sortedRoles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50 p-6">
            <Users className="h-10 w-10 text-slate-300 mb-3" />
            <p className="text-sm font-semibold text-slate-500">No team members match your criteria</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the filters or modifying your search query.</p>
          </div>
        )}
        {sortedRoles.map((roleKey) => {
          const members = staffByRole[roleKey];
          const cfg = ROLE_CONFIG[roleKey] || ROLE_CONFIG.STAFF;
          return (
            <div key={roleKey} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded bg-slate-50 text-slate-600"
                  style={{ backgroundColor: `${cfg.color}10`, color: cfg.color }}
                >
                  <cfg.icon className="h-3.5 w-3.5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">{cfg.label}s</h4>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500">
                  {members.length}
                </span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {members.map((member) => (
                  <StaffCard
                    key={member.id}
                    member={member}
                    cfg={cfg}
                    data={data}
                    onClick={() => setSelectedStaffForAttendance(member)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedStaffForAttendance && (
        <StaffAttendanceModal
          member={selectedStaffForAttendance}
          onClose={() => setSelectedStaffForAttendance(null)}
        />
      )}
    </div>
  );
};
