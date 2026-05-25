import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { roleLabel } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, UserPlus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
      <div className="border-b border-blue-100 bg-blue-50/70 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-950">Account approvals</h3>
              <p className="text-xs font-medium text-blue-700">Review new dashboard access requests</p>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-700">{pendingRequests.length}</Badge>
        </div>
      </div>
      <div className="p-5">
      {pendingRequests.length === 0 ? (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-emerald-600" />
          <p className="mt-2 text-sm font-bold text-emerald-900">No pending account requests</p>
          <p className="mt-1 text-xs text-emerald-700">The access queue is clear.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {pendingRequests.map((u) => {
            const isWorking = workingId === u.id;
            return (
              <li key={u.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-950">
                    {u.name} <span className="text-slate-500 font-normal">- {u.email}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Requested role: <span className="font-bold text-blue-700">{roleLabel(u.role)}</span>
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50" onClick={() => void onReject(u.id)} disabled={Boolean(workingId)}>
                    <X className="mr-1 h-4 w-4" />
                    {isWorking ? "Working..." : "Reject"}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 text-white hover:bg-blue-700"
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
    </div>
  );
};

