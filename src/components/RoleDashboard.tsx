import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { useAuth } from "@/lib/auth";
import { fetchDashboardViewData, clearDashboardCache, type DashboardViewData } from "@/lib/dashboardData";
import { MDDashboardView } from "./dashboards/MDDashboardView";
import { AdminDashboardView } from "./dashboards/AdminDashboardView";
import { CoordinatorStaffDashboardView } from "./dashboards/CoordinatorStaffDashboardView";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { Tabs } from "@/components/ui/tabs";
import type { Role } from "@/lib/roles";

const titleByRole: Record<Role, string> = {
  md: "System Overview",
  admin: "Admin Overview",
  coordinator: "Team Coordination",
  regional_head: "Regional Oversight",
  cluster_head: "Cluster Management",
  staff: "My Tasks",
};

const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-44 rounded-3xl bg-slate-100 border border-slate-200/50" />
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-28 rounded-2xl bg-slate-100 border border-slate-200/50" />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="col-span-1 h-80 rounded-2xl bg-slate-100 border border-slate-200/50" />
      <div className="col-span-2 h-80 rounded-2xl bg-slate-100 border border-slate-200/50" />
    </div>
  </div>
);

export const RoleDashboard = ({ role }: { role: Role }) => {
  const { user, token, approveLead, rejectLead } = useAuth();
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState<DashboardViewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [workspaceTab, setWorkspaceTab] = useState<"tasks" | "approvals" | "notifications" | "activity">("tasks");

  const userId = useMemo(() => Number.parseInt(String(user?.id ?? ""), 10), [user?.id]);

  // ── Handlers (untouched logic) ───────────────────────────────────────────
  const handleApproveLead = async (id: string) => {
    const result = await approveLead(id);
    if (result.ok) {
      toast.success("Lead approved successfully");
      void refresh();
      return true;
    } else {
      toast.error(result.error ?? "Failed to approve lead");
      return false;
    }
  };

  const handleRejectLead = async (id: string) => {
    const result = await rejectLead(id);
    if (result.ok) {
      toast.success("Lead rejected successfully");
      void refresh();
      return true;
    } else {
      toast.error(result.error ?? "Failed to reject lead");
      return false;
    }
  };

  const refresh = (force = false) => {
    if (!user || !Number.isFinite(userId)) return;
    if (force) clearDashboardCache();
    setIsLoading(true);
    setLoadError(null);
    void fetchDashboardViewData({ userId, role, token, forceRefresh: force })
      .then((payload) => {
        setDashboardData(payload);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Failed to load live dashboard data.";
        setLoadError(message);
        setDashboardData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // ── Effects (untouched fetching logic) ────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    if (!user) {
      setDashboardData(null);
      setLoadError("You are not signed in.");
      setIsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    if (!Number.isFinite(userId)) {
      setDashboardData(null);
      setLoadError("Session is missing a valid user ID. Please sign out and sign in again.");
      setIsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setIsLoading(true);
    setLoadError(null);

    void fetchDashboardViewData({ userId, role, token })
      .then((payload) => {
        if (cancelled) return;
        setDashboardData(payload);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Failed to load live dashboard data.";
        setLoadError(message);
        setDashboardData(null);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [role, token, user, userId]);

  useEffect(() => {
    const hash = location.hash.toLowerCase().replace("#", "");
    if (!hash) {
      setActiveTab("overview");
      return;
    }

    const allowedTabs = [
      "overview",
      "sales",
      "assignments",
      "customers",
      "attendance",
      "daily",
      "remarks",
      "complaints",
      "approvals",
      "workspace",
      "assigned-tasks",
    ];

    if (allowedTabs.includes(hash)) {
      setActiveTab(hash);
    } else if (hash === "notifications") {
      setActiveTab("workspace");
      setWorkspaceTab("notifications");
    }
  }, [location.hash]);

  // ── Guard states ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <DashboardShell title={titleByRole[role]}>
        <div className="flex items-center gap-2 mb-6">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading your workspace</p>
        </div>
        <LoadingSkeleton />
      </DashboardShell>
    );
  }

  if (loadError || !dashboardData) {
    return (
      <DashboardShell title={titleByRole[role]}>
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-rose-800">Unable to load dashboard</p>
              <p className="mt-1 text-sm text-rose-600">{loadError ?? "An unexpected error occurred."}</p>
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title={titleByRole[role]}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="relative min-w-0">
        {/* Floating Utility Controls (Refresh Trigger) */}
        <div className="mb-3 flex w-full justify-end lg:fixed lg:right-6 lg:top-24 lg:z-30 lg:mb-0 lg:w-auto">
          <button
            onClick={() => refresh(true)}
            className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 active:scale-95"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Systems
          </button>
        </div>

        {/* ── Sub-dashboard router ── */}
        {role === "md" && (
          <MDDashboardView
            activeTab={activeTab}
            workspaceTab={workspaceTab}
            dashboardData={dashboardData}
            user={user}
            refresh={refresh}
            handleApproveLead={handleApproveLead}
            handleRejectLead={handleRejectLead}
          />
        )}

        {role === "admin" && (
          <AdminDashboardView
            activeTab={activeTab}
            workspaceTab={workspaceTab}
            dashboardData={dashboardData}
            user={user}
            refresh={refresh}
            handleApproveLead={handleApproveLead}
            handleRejectLead={handleRejectLead}
          />
        )}

        {role !== "md" && role !== "admin" && (
          <CoordinatorStaffDashboardView
            role={role}
            activeTab={activeTab}
            dashboardData={dashboardData}
            user={user}
            refresh={refresh}
          />
        )}
      </Tabs>
    </DashboardShell>
  );
};
