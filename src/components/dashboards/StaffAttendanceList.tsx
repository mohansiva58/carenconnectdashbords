import { useState } from "react";
import { DashboardViewData } from "@/lib/dashboardData";
import { roleLabel } from "@/lib/roles";
import { StaffAttendanceModal } from "./StaffAttendanceModal";

export const StaffAttendanceList = ({
  staff,
  data,
}: {
  staff: any[];
  data: DashboardViewData;
}) => {
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[800px] text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-500 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-bold">ID</th>
            <th className="px-6 py-4 font-bold">Employee</th>
            <th className="px-6 py-4 font-bold">Location</th>
            <th className="px-6 py-4 font-bold">Today's Status</th>
            <th className="px-6 py-4 font-bold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {staff.map((member) => {
            const memberIdStr = String(member.id);
            const att = data.attendanceRows.find(
              (a) => String(a.user) === `User #${memberIdStr}` || String(a.user) === memberIdStr
            );

            const isPresent = att?.status === "Present";
            const isAbsent = att?.status === "Absent";
            const isLate = att?.status === "Late";

            return (
              <tr
                key={member.id}
                className="group transition-colors hover:bg-slate-50/50 cursor-pointer"
                onClick={() => setSelectedStaff(member)}
              >
                <td className="px-6 py-4 font-medium text-slate-400">
                  {member.id}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 ring-1 ring-slate-200">
                      {getInitials(member.name || "")}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-slate-900">{member.name}</p>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">{roleLabel(member.role)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-600">
                  {member.mandal || member.district || member.state || "-"}
                </td>
                <td className="px-6 py-4">
                  {isPresent && (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      Present
                    </span>
                  )}
                  {isAbsent && (
                    <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-inset ring-rose-600/20">
                      Absent
                    </span>
                  )}
                  {isLate && (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                      Late
                    </span>
                  )}
                  {!att && (
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600 ring-1 ring-inset ring-slate-500/20">
                      Not Marked
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStaff(member);
                    }}
                    className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                  >
                    View Sheet
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedStaff && (
        <StaffAttendanceModal
          member={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </div>
  );
};
