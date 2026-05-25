import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { CalendarDays, Check, Umbrella, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";

export type LeaveRequestApproval = {
  id: string;
  staffName: string;
  staffEmail?: string;
  reason: string;
  fromDate: string;
  toDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedDays: number;
  isEmergency?: boolean;
  isPaid?: boolean;
};

type LeaveApprovalsPanelProps = {
  leaveRequests?: LeaveRequestApproval[];
  onRefresh?: () => void;
};

export const LeaveApprovalsPanel = ({ leaveRequests = [], onRefresh }: LeaveApprovalsPanelProps) => {
  const { token } = useAuth();
  const [workingId, setWorkingId] = useState<string | null>(null);

  const pendingLeaves = leaveRequests.filter(l => l.status === "PENDING");

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', { day: 'short', month: 'short', year: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const onRejectLeave = async (id: string) => {
    if (workingId) return;
    setWorkingId(id);
    try {
      await apiRequest(`/api/staff/leave-requests/${id}`, {
        method: "PATCH",
        token,
        body: { status: "REJECTED" },
      });
      toast.success("Leave request rejected");
      onRefresh?.();
    } catch (error) {
      console.error("[v0] Leave rejection error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to reject leave");
    } finally {
      setWorkingId(null);
    }
  };

  const onApproveLeave = async (id: string) => {
    if (workingId) return;
    setWorkingId(id);
    try {
      await apiRequest(`/api/staff/leave-requests/${id}`, {
        method: "PATCH",
        token,
        body: { status: "APPROVED" },
      });
      toast.success("Leave request approved");
      onRefresh?.();
    } catch (error) {
      console.error("[v0] Leave approval error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to approve leave");
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
      <div className="border-b border-amber-100 bg-amber-50/70 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <Umbrella className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-950">Leave approvals</h3>
              <p className="text-xs font-medium text-amber-700">Approve or reject staff leave requests</p>
            </div>
          </div>
          <Badge className="bg-amber-100 text-amber-700">{pendingLeaves.length}</Badge>
        </div>
      </div>
      <div className="p-5">
      {pendingLeaves.length === 0 ? (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 text-center">
          <CalendarDays className="mx-auto h-8 w-8 text-emerald-600" />
          <p className="mt-2 text-sm font-bold text-emerald-900">No pending leave requests</p>
          <p className="mt-1 text-xs text-emerald-700">The leave queue is clear.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {pendingLeaves.map((leave) => {
            const isWorking = workingId === leave.id;
            return (
              <li key={leave.id} className="flex flex-col gap-3 rounded-xl border border-amber-100 bg-amber-50/30 p-4 transition-colors hover:bg-amber-50/60">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">
                        {leave.staffName}
                        {leave.staffEmail && <span className="text-muted-foreground font-normal">({leave.staffEmail})</span>}
                      </p>
                      {leave.isEmergency && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                          Emergency
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{leave.reason}</p>
                    {leave.isPaid === false && (
                      <p className="text-xs text-orange-600 mt-1 font-medium">
                        ⚠️ Unpaid: Not applied within required notice period
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="ml-2 whitespace-nowrap">{leave.requestedDays} days</Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">{formatDate(leave.fromDate)}</span>
                  <span>→</span>
                  <span className="font-medium">{formatDate(leave.toDate)}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => void onRejectLeave(leave.id)} 
                    disabled={Boolean(workingId)}
                    className="flex-1 border-rose-200 text-rose-700 hover:bg-rose-50"
                  >
                    <X className="mr-1 h-4 w-4" />
                    {isWorking ? "Working..." : "Reject"}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => void onApproveLeave(leave.id)}
                    disabled={Boolean(workingId)}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    {isWorking ? "Working..." : "Approve"}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      </div>
    </div>
  );
};
