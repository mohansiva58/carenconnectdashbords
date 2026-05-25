import { useEffect, useState } from "react";
import { X, Printer, Download, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { apiRequest } from "@/lib/api";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

type StaffMember = any;
type AttendanceRow = {
  attendance_date: string;
  status: string;
};

export const StaffAttendanceModal = ({
  member,
  onClose,
}: {
  member: StaffMember;
  onClose: () => void;
}) => {
  const { token } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  useEffect(() => {
    if (!member?.id || !token) return;
    setIsLoading(true);
    apiRequest(`/api/staff/${member.id}/attendance`, { token })
      .then((data: any) => setAttendance(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to load attendance", err))
      .finally(() => setIsLoading(false));
  }, [member, token]);

  const yearRecords = attendance.filter((r) => {
    if (!r.attendance_date) return false;
    const dateObj = new Date(r.attendance_date);
    return dateObj.getFullYear() === year;
  });

  const getStatusInitial = (status?: string | null) => {
    const s = String(status || "").toUpperCase();
    if (s.includes("PRESENT")) return "P";
    if (s.includes("ABSENT")) return "A";
    if (s.includes("LEAVE") || s.includes("HOLIDAY")) return "H";
    if (s.includes("HALF")) return "L"; // Mapping Half Day to Late as a compromise
    return "";
  };

  const getStatusColor = (initial: string) => {
    switch (initial) {
      case "P": return "text-indigo-600 font-bold";
      case "A": return "text-rose-500 font-bold";
      case "L": return "text-amber-500 font-bold";
      case "H": return "text-slate-400 font-bold";
      default: return "";
    }
  };

  const getStatusBackground = (initial: string) => {
    switch (initial) {
      case "P": return "bg-indigo-50/50";
      case "A": return "bg-rose-50/50";
      case "L": return "bg-amber-50/50";
      case "H": return "bg-slate-50";
      default: return "";
    }
  };

  // Pre-compute map of MM-DD to initial
  const attendanceMap = new Map<string, string>();
  let totalPresent = 0, totalLate = 0, totalAbsent = 0, totalHoliday = 0;

  yearRecords.forEach(r => {
    const dateObj = new Date(r.attendance_date);
    if (!isNaN(dateObj.getTime())) {
      const month = dateObj.getMonth();
      const date = dateObj.getDate();
      const key = `${month}-${date}`;
      const initial = getStatusInitial(r.status);
      attendanceMap.set(key, initial);

      if (initial === "P") totalPresent++;
      else if (initial === "A") totalAbsent++;
      else if (initial === "L") totalLate++;
      else if (initial === "H") totalHoliday++;
    }
  });

  // Auto-fill missing days as Absent since tracking began (May 1, 2026), excluding Sundays
  const today = new Date();
  const trackingStart = new Date(2026, 4, 1); // May 1, 2026 (Month index 4)

  for (let m = 0; m < 12; m++) {
    for (let d = 1; d <= 31; d++) {
      const cellDate = new Date(year, m, d);
      // Verify valid date (avoid Feb 30 wrapping to March)
      if (cellDate.getDate() !== d) continue;

      const key = `${m}-${d}`;
      
      // If date is between our tracking start and today, and not Sunday
      if (cellDate >= trackingStart && cellDate <= today) {
        if (cellDate.getDay() !== 0) {
          if (!attendanceMap.has(key)) {
            attendanceMap.set(key, "A");
            totalAbsent++;
          }
        }
      }
    }
  }

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysInSelectedMonth = new Date(year, selectedMonth + 1, 0).getDate();
  const firstDayOffset = new Date(year, selectedMonth, 1).getDay();
  const selectedMonthDays = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);

  const selectedMonthStats = selectedMonthDays.reduce(
    (stats, day) => {
      const val = attendanceMap.get(`${selectedMonth}-${day}`) || "";
      if (val === "P") stats.present += 1;
      if (val === "L") stats.late += 1;
      if (val === "A") stats.absent += 1;
      if (val === "H") stats.holiday += 1;
      return stats;
    },
    { present: 0, late: 0, absent: 0, holiday: 0 }
  );

  const moveMonth = (direction: -1 | 1) => {
    const nextMonth = selectedMonth + direction;
    if (nextMonth < 0) {
      setSelectedMonth(11);
      setYear((current) => current - 1);
    } else if (nextMonth > 11) {
      setSelectedMonth(0);
      setYear((current) => current + 1);
    } else {
      setSelectedMonth(nextMonth);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="relative flex h-[90vh] w-[95vw] max-w-[1200px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-2xl font-bold text-blue-700 shadow-sm">
              {getInitials(member.name || "")}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{member.name}</h2>
              <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                <span className="font-medium text-slate-600">Department: <span className="text-indigo-600">{member.role}</span></span>
                <span>•</span>
                <span>ID: {member.id}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
              <Printer className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
              <Download className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/50 text-slate-500 hover:bg-slate-200 hover:text-slate-900">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-sm font-semibold text-slate-700">Total Present</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-2xl font-bold text-slate-900">{totalPresent}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-200"><span className="text-indigo-600 font-bold">P</span></div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-sm font-semibold text-slate-700">Total Late</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-2xl font-bold text-slate-900">{totalLate}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-200"><span className="text-amber-500 font-bold">L</span></div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-sm font-semibold text-slate-700">Total Absent</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-2xl font-bold text-slate-900">{totalAbsent}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-200"><span className="text-rose-500 font-bold">A</span></div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-sm font-semibold text-slate-700">Total Holiday</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-2xl font-bold text-slate-900">{totalHoliday}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-200"><span className="text-slate-400 font-bold">H</span></div>
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              <span className="flex items-center gap-1"><span className="text-indigo-600">Present:</span> P</span>
              <span className="flex items-center gap-1"><span className="text-amber-500">Late:</span> L</span>
              <span className="flex items-center gap-1"><span className="text-rose-500">Absent:</span> A</span>
              <span className="flex items-center gap-1"><span className="text-slate-500">Holiday:</span> H</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => moveMonth(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                <Calendar className="h-4 w-4 text-slate-500" />
                <select className="bg-transparent outline-none cursor-pointer" value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                  {months.map((month, index) => (
                    <option key={month} value={index}>{month}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">
                <Calendar className="h-4 w-4 text-slate-500" />
                <select className="bg-transparent outline-none cursor-pointer" value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  <option value={2026}>2026</option>
                  <option value={2025}>2025</option>
                  <option value={2024}>2024</option>
                </select>
              </div>
              <button
                onClick={() => moveMonth(1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">{months[selectedMonth]} {year}</h3>
                <p className="text-xs text-slate-500">Month view keeps every day visible without long scrolling.</p>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                <div className="rounded-lg bg-indigo-50 px-3 py-2 text-indigo-700">P {selectedMonthStats.present}</div>
                <div className="rounded-lg bg-amber-50 px-3 py-2 text-amber-700">L {selectedMonthStats.late}</div>
                <div className="rounded-lg bg-rose-50 px-3 py-2 text-rose-700">A {selectedMonthStats.absent}</div>
                <div className="rounded-lg bg-slate-100 px-3 py-2 text-slate-600">H {selectedMonthStats.holiday}</div>
              </div>
            </div>

            {isLoading ? (
              <div className="py-20 text-center text-sm text-slate-500">Loading attendance data...</div>
            ) : (
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => (
                  <div key={day} className="rounded-lg bg-slate-50 py-2 text-center text-xs font-bold uppercase tracking-wide text-slate-500">
                    {day}
                  </div>
                ))}
                {Array.from({ length: firstDayOffset }).map((_, index) => (
                  <div key={`blank-${index}`} className="min-h-16 rounded-xl bg-slate-50/40" />
                ))}
                {selectedMonthDays.map((day) => {
                  const val = attendanceMap.get(`${selectedMonth}-${day}`) || "";
                  return (
                    <div
                      key={day}
                      className={`flex min-h-16 flex-col justify-between rounded-xl border border-slate-100 p-3 ${getStatusBackground(val) || "bg-white"}`}
                    >
                      <span className="text-sm font-semibold text-slate-600">{day}</span>
                      <span className={`self-end text-lg ${getStatusColor(val) || "text-slate-300"}`}>
                        {val || "-"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
