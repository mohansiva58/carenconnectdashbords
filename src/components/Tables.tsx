import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ComplaintRow, AttendanceRow } from "@/lib/dashboardData";

const statusTone: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  Pending: "bg-amber-50 text-amber-700 border-amber-200/60",
  Closed: "bg-slate-50 text-slate-650 border-slate-200/60",
  Present: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  Absent: "bg-rose-50 text-rose-750 border-rose-200/60",
  Leave: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
  "Half Day": "bg-amber-50 text-amber-700 border-amber-200/60",
  Strong: "bg-emerald-50 text-emerald-750 border-emerald-200/60",
  Medium: "bg-indigo-50 text-indigo-750 border-indigo-200/60",
  Weak: "bg-slate-50 text-slate-650 border-slate-200/60",
  Open: "bg-rose-50 text-rose-750 border-rose-200/60",
  "In Progress": "bg-indigo-50 text-indigo-700 border-indigo-200/60",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
};

const Shell = ({ title, count, children }: { title: string; count: number; children: React.ReactNode }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h3>
      </div>
      <span className="rounded-full bg-slate-50 border border-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-400">
        {count} records
      </span>
    </div>
    <div className="overflow-x-auto">{children}</div>
  </div>
);

export const RecordsTable = ({ rows, title = "Recent records" }: { rows: any[]; title?: string }) => (
  <Shell title={title} count={rows.length}>
    <Table className="text-sm">
      <TableHeader>
        <TableRow className="border-b border-slate-100 hover:bg-transparent">
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ID</TableHead>
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Name</TableHead>
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Region</TableHead>
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
          <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-slate-50">
        {rows.map((r) => (
          <TableRow key={r.id} className="group hover:bg-slate-50/50">
            <TableCell className="font-mono text-[11px] text-slate-400">#{r.id}</TableCell>
            <TableCell className="font-semibold text-slate-750 group-hover:text-indigo-650 transition-colors">
              {r.name}
            </TableCell>
            <TableCell className="text-slate-550">{r.region}</TableCell>
            <TableCell>
              <Badge variant="outline" className={`font-bold uppercase tracking-wider text-[9px] ${statusTone[r.status] || "bg-slate-50 text-slate-550"}`}>
                {r.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right text-xs font-semibold text-slate-400">{r.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Shell>
);

export const TeamTable = ({ rows }: { rows: any[] }) => (
  <Shell title="Team members" count={rows.length}>
    <Table className="text-sm">
      <TableHeader>
        <TableRow className="border-b border-slate-100 hover:bg-transparent">
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ID</TableHead>
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Name</TableHead>
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</TableHead>
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Attendance</TableHead>
          <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Leads</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-slate-50">
        {rows.map((r) => (
          <TableRow key={r.id} className="group hover:bg-slate-50/50">
            <TableCell className="font-mono text-[11px] text-slate-400">#{r.id}</TableCell>
            <TableCell className="font-semibold text-slate-750 group-hover:text-indigo-650 transition-colors">
              {r.name}
            </TableCell>
            <TableCell className="text-slate-550">{r.role}</TableCell>
            <TableCell>
              <Badge variant="outline" className={`font-bold uppercase tracking-wider text-[9px] ${statusTone[r.attendance] || "bg-slate-50 text-slate-550"}`}>
                {r.attendance}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-bold text-slate-700">{r.leads}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Shell>
);

export const CustomersTable = ({ rows }: { rows: any[] }) => (
  <Shell title="Customers" count={rows.length}>
    <Table className="text-sm">
      <TableHeader>
        <TableRow className="border-b border-slate-100 hover:bg-transparent">
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ID</TableHead>
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Name</TableHead>
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email</TableHead>
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-slate-50">
        {rows.map((r) => (
          <TableRow key={r.id} className="group hover:bg-slate-50/50">
            <TableCell className="font-mono text-[11px] text-slate-400">#{r.id}</TableCell>
            <TableCell className="font-semibold text-slate-750 group-hover:text-indigo-650 transition-colors">
              {r.name}
            </TableCell>
            <TableCell className="text-slate-550 font-medium">{r.email}</TableCell>
            <TableCell className="text-slate-400 text-xs font-semibold">
              {[r.village, r.mandal, r.district, r.state].filter(Boolean).join(", ") || "Unassigned"}
            </TableCell>
          </TableRow>
        ))}
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8 text-slate-400 text-xs font-medium">
              No customers found in system scope.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </Shell>
);

export const ComplaintsTable = ({ rows, title = "Complaints" }: { rows: ComplaintRow[]; title?: string }) => (
  <Shell title={title} count={rows.length}>
    <Table className="text-sm">
      <TableHeader>
        <TableRow className="border-b border-slate-100 hover:bg-transparent">
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ID</TableHead>
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Title</TableHead>
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Submitted by</TableHead>
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
          <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned to</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-slate-50">
        {rows.map((r) => (
          <TableRow key={r.id} className="group hover:bg-slate-50/50">
            <TableCell className="font-mono text-[11px] text-slate-400">#{r.id}</TableCell>
            <TableCell className="font-semibold text-slate-750 group-hover:text-indigo-650 transition-colors">
              {r.title}
            </TableCell>
            <TableCell className="text-slate-550">{r.submittedBy}</TableCell>
            <TableCell>
              <Badge variant="outline" className={`font-bold uppercase tracking-wider text-[9px] ${statusTone[r.status] || "bg-slate-50 text-slate-550"}`}>
                {r.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-medium text-slate-650">{r.assignedTo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Shell>
);

export const AttendanceTable = ({ rows, title = "Attendance" }: { rows: AttendanceRow[]; title?: string }) => (
  <Shell title={title} count={rows.length}>
    <Table className="text-sm">
      <TableHeader>
        <TableRow className="border-b border-slate-100 hover:bg-transparent">
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">User</TableHead>
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</TableHead>
          <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Check-in Time</TableHead>
          <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-slate-50">
        {rows.map((r) => (
          <TableRow key={r.id} className="group hover:bg-slate-50/50">
            <TableCell className="font-semibold text-slate-750 group-hover:text-indigo-650 transition-colors">
              {r.user}
            </TableCell>
            <TableCell className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{r.role}</TableCell>
            <TableCell className="font-mono text-[11px] text-slate-400">{r.checkIn}</TableCell>
            <TableCell className="text-right">
              <Badge variant="outline" className={`font-bold uppercase tracking-wider text-[9px] ${statusTone[r.status] || "bg-slate-50 text-slate-550"}`}>
                {r.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Shell>
);
