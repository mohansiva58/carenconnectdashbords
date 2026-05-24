import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { ROLES } from "@/lib/roles";

export const Filters = () => {
  const today = new Date();
  const fromDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
  const toDate = today.toISOString().slice(0, 10);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
      <div className="flex items-center gap-2 px-2 text-sm font-medium text-muted-foreground">
        <Filter className="h-4 w-4" /> Filters
      </div>
      <Input type="date" className="w-auto" defaultValue={fromDate} aria-label="From date" />
      <Input type="date" className="w-auto" defaultValue={toDate} aria-label="To date" />
      <Select defaultValue="all">
        <SelectTrigger className="w-[140px]"><SelectValue placeholder="Role" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All roles</SelectItem>
          {ROLES.map((r) => (
            <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select defaultValue="all">
        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Region" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All regions / clusters</SelectItem>
          <SelectItem value="north">North</SelectItem>
          <SelectItem value="south">South</SelectItem>
          <SelectItem value="east">East</SelectItem>
          <SelectItem value="west">West</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="all">
        <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
