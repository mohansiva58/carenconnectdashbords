import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LeadRow } from "@/lib/dashboardData";

const statusTone: Record<string, string> = {
  Strong: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  Weak: "bg-slate-500/15 text-slate-700 border-slate-500/30",
  Open: "bg-blue-500/15 text-blue-700 border-blue-500/30",
};

export const SalesBoard = ({ leadsRows }: { leadsRows: LeadRow[] }) => {
  const strongLeads = leadsRows.filter((l) => l.status === "Strong").length;
  const totalLeads = leadsRows.length;
  const conversionRate = totalLeads ? ((strongLeads / totalLeads) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total Pipeline</p>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900">{totalLeads}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Strong Prospects</p>
          <p className="text-3xl font-extrabold tracking-tight text-emerald-600">{strongLeads}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Conversion Rate</p>
          <p className="text-3xl font-extrabold tracking-tight text-blue-600">{conversionRate}%</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Sales Pipeline</h3>
          <p className="text-sm text-slate-500">{totalLeads} active leads</p>
        </div>
        <div className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prospect Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Strength</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leadsRows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="font-mono text-xs">{r.contact}</TableCell>
                  <TableCell className="text-slate-500">{r.location}</TableCell>
                  <TableCell>{r.assignedTo}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={statusTone[r.status] || statusTone.Open}>
                      {r.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {leadsRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-slate-500">No leads found in pipeline.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
