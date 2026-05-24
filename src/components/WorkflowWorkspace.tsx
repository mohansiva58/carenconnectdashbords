import { useCallback, useEffect, useState } from "react";
import type { DashboardViewData, LeadRow } from "@/lib/dashboardData";
import type { Role } from "@/lib/roles";
import { useAuth } from "@/lib/auth";
import { API_PATHS, apiRequest, replacePathParams } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type PendingLeadRowProps = {
  lead: LeadRow;
  onApproveLead: (id: string) => Promise<boolean> | boolean;
  onRejectLead: (id: string) => Promise<boolean> | boolean;
};

const PendingLeadRow = ({ lead, onApproveLead, onRejectLead }: PendingLeadRowProps) => {
  const [processingAction, setProcessingAction] = useState<"approve" | "reject" | null>(null);

  const handleReject = async () => {
    setProcessingAction("reject");
    try {
      const ok = await onRejectLead(lead.id);
      if (ok) toast.success("Lead rejected");
      else toast.error("Failed to reject lead");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reject lead");
    } finally {
      setProcessingAction(null);
    }
  };

  const handleApprove = async () => {
    setProcessingAction("approve");
    try {
      const ok = await onApproveLead(lead.id);
      if (ok) toast.success("Lead approved");
      else toast.error("Failed to approve lead");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to approve lead");
    } finally {
      setProcessingAction(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-semibold">{lead.name}</p>
        <p className="text-xs text-muted-foreground">{lead.category ?? "Lead"} - {lead.date ?? "-"}</p>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleReject}
          disabled={processingAction !== null}
        >
          {processingAction === "reject" ? "Rejecting..." : "Reject"}
        </Button>
        <Button
          size="sm"
          onClick={handleApprove}
          disabled={processingAction !== null}
        >
          {processingAction === "approve" ? "Approving..." : "Approve"}
        </Button>
      </div>
    </div>
  );
};

type NotificationRow = {
  id: number;
  title?: string | null;
  body?: string | null;
  is_read?: boolean;
  created_at?: string | null;
};

type NotificationResponse = {
  data?: NotificationRow[];
};

export const WorkflowWorkspace = ({
  role,
  dashboardData,
  onApproveLead,
  onRejectLead,
  initialTab = "tasks",
}: {
  role: Role;
  dashboardData: DashboardViewData;
  onApproveLead: (id: string) => Promise<boolean> | boolean;
  onRejectLead: (id: string) => Promise<boolean> | boolean;
  initialTab?: "tasks" | "approvals" | "notifications" | "activity";
}) => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const canApprove = role !== "staff";
  const leadsRows = Array.isArray(dashboardData?.leadsRows) ? dashboardData.leadsRows : [];
  const pendingLeadsRows = Array.isArray(dashboardData?.pendingLeadsRows) ? dashboardData.pendingLeadsRows : [];
  const complaintsRows = Array.isArray(dashboardData?.complaintsRows) ? dashboardData.complaintsRows : [];
  const attendanceRows = Array.isArray(dashboardData?.attendanceRows) ? dashboardData.attendanceRows : [];

  const loadNotifications = useCallback(async () => {
    if (!token) return;
    try {
      setIsLoadingNotifications(true);
      const [list, unread] = await Promise.all([
        apiRequest<NotificationResponse>(`${API_PATHS.notifications}?limit=20&page=1`, { token }),
        apiRequest<{ unread?: number }>(API_PATHS.notificationsUnreadCount, { token }),
      ]);
      setNotifications(Array.isArray(list?.data) ? list.data : []);
      setUnreadCount(Number.isFinite(Number(unread?.unread)) ? Number(unread?.unread) : 0);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load notifications");
    } finally {
      setIsLoadingNotifications(false);
    }
  }, [token]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const markOneRead = async (id: number) => {
    if (!token) return;
    try {
      const path = replacePathParams(API_PATHS.markNotificationRead, { id: String(id) });
      await apiRequest(path, { method: "PUT", token });
      await loadNotifications();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to mark notification");
    }
  };

  const markAllRead = async () => {
    if (!token) return;
    try {
      await apiRequest(API_PATHS.markAllNotificationsRead, { method: "PUT", token });
      await loadNotifications();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to mark all notifications");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Operations Workspace</h2>
        <Badge variant="outline">{role.replace("_", " ").toUpperCase()}</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/70 p-1">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          {canApprove ? <TabsTrigger value="approvals">Approvals</TabsTrigger> : null}
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Visible leads</p>
              <p className="mt-1 text-2xl font-extrabold">{leadsRows.length}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Visible complaints</p>
              <p className="mt-1 text-2xl font-extrabold">{complaintsRows.length}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Attendance rows</p>
              <p className="mt-1 text-2xl font-extrabold">{attendanceRows.length}</p>
            </div>
          </div>
        </TabsContent>

        {canApprove ? (
          <TabsContent value="approvals" className="space-y-2">
            {pendingLeadsRows.length === 0 ? (
              <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                No pending lead approvals in your scope.
              </p>
            ) : (
              pendingLeadsRows.map((lead) => (
                <PendingLeadRow
                  key={lead.id}
                  lead={lead}
                  onApproveLead={onApproveLead}
                  onRejectLead={onRejectLead}
                />
              ))
            )}
          </TabsContent>
        ) : null}

        <TabsContent value="notifications" className="space-y-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => void markAllRead()} disabled={isLoadingNotifications || unreadCount === 0}>
              Mark all as read
            </Button>
            <Badge>{unreadCount} unread</Badge>
          </div>

          {isLoadingNotifications ? (
            <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">No notifications found.</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className={`rounded-lg border p-4 ${notification.is_read ? "border-border" : "border-primary/40 bg-primary/5"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{notification.title ?? "Notification"}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{notification.body ?? "-"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{notification.created_at ? new Date(notification.created_at).toLocaleString() : "-"}</p>
                  </div>
                  {!notification.is_read ? (
                    <Button size="sm" variant="outline" onClick={() => void markOneRead(notification.id)}>
                      Mark read
                    </Button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-2">
          {leadsRows.slice(0, 5).map((lead) => (
            <div key={lead.id} className="rounded-lg border border-border p-3">
              <p className="font-medium">{lead.name}</p>
              <p className="text-xs text-muted-foreground">Lead status: {lead.status ?? "-"} - {lead.location ?? "-"}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
