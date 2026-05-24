import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { roleLabel } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { ApprovalQueueItem } from "@/lib/dashboardData";

export const ApprovalsPanel = () => {
  const { pendingRequests, approveRequest, rejectRequest } = useAuth();
  const [workingId, setWorkingId] = useState<string | null>(null);

  const onReject = async (id: string) => {
    if (workingId) return;
    setWorkingId(id);
    const result = await rejectRequest(id);
    setWorkingId(null);

    if (!result.ok) {
      toast.error(result.error ?? "Request rejected");
      return;
    }

    toast("Request rejected");
  };

  const onApprove = async (id: string) => {
    if (workingId) return;
    setWorkingId(id);
    const result = await approveRequest(id);
    setWorkingId(null);

    if (!result.ok) {
      toast.error(result.error ?? "Approve failed");
      return;
    }

    toast.success("Approved");
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold">Pending account approvals</h3>
        <Badge className="bg-accent text-accent-foreground">{pendingRequests.length}</Badge>
      </div>
      {pendingRequests.length === 0 ? (
        <p className="rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">No pending requests right now.</p>
      ) : (
        <ul className="space-y-2">
          {pendingRequests.map((u) => {
            const isWorking = workingId === u.id;
            return (
              <li key={u.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <p className="font-semibold">
                    {u.name} <span className="text-muted-foreground font-normal">- {u.email}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Requested role: <span className="font-medium text-foreground">{roleLabel(u.role)}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => void onReject(u.id)} disabled={Boolean(workingId)}>
                    <X className="mr-1 h-4 w-4" />
                    {isWorking ? "Working..." : "Reject"}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-brand shadow-brand"
                    onClick={() => void onApprove(u.id)}
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
  );
};

