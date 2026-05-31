import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { useAuth } from "@/lib/auth-context";
import { fetchDashboardViewData, clearDashboardCache, type DashboardViewData } from "@/lib/dashboardData";
import { MDDashboardView } from "./dashboards/MDDashboardView";
import { AdminDashboardView } from "./dashboards/AdminDashboardView";
import { CoordinatorStaffDashboardView } from "./dashboards/CoordinatorStaffDashboardView";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
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

const dashboardPathByRole: Record<Role, string> = {
  md: "/dashboard/md",
  admin: "/dashboard/admin",
  coordinator: "/dashboard/coordinator",
  regional_head: "/dashboard/regional-head",
  cluster_head: "/dashboard/cluster-head",
  staff: "/dashboard/staff",
};

const allowedTabs = [
  "overview",
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
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardViewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeOverviewTab, setActiveOverviewTab] = useState(role === "md" || role === "admin" ? "dashboard" : "quick-insights");
  const [activePeopleRoleTab, setActivePeopleRoleTab] = useState("all");
  const [workspaceTab, setWorkspaceTab] = useState<"tasks" | "approvals" | "notifications" | "activity">("tasks");

  const userId = useMemo(() => Number.parseInt(String(user?.id ?? ""), 10), [user?.id]);
  const dashboardBasePath = dashboardPathByRole[role];

  const goToDashboardTab = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`${dashboardBasePath}/${tabId}`);
  };

  const goToOverviewTab = (tabId: string) => {
    setActiveOverviewTab(tabId);
    const rolePath = tabId === "people" ? `/${activePeopleRoleTab}` : "";
    navigate(`${dashboardBasePath}/overview/${tabId}${rolePath}`);
  };

  const goToPeopleRoleTab = (tabId: string) => {
    setActivePeopleRoleTab(tabId);
    setActiveOverviewTab("people");
    navigate(`${dashboardBasePath}/overview/people/${tabId}`);
  };

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
    const baseParts = dashboardBasePath.split("/").filter(Boolean);
    const pathParts = location.pathname.split("/").filter(Boolean);
    const routeParts = pathParts.slice(baseParts.length);
    const routeTab = routeParts[0]?.toLowerCase();
    const routeOverviewTab = routeParts[1]?.toLowerCase();
    const routePeopleRoleTab = routeParts[2]?.toLowerCase();
    const hash = location.hash.toLowerCase().replace("#", "");

    if (routeTab && allowedTabs.includes(routeTab)) {
      setActiveTab(routeTab);
      if (routeTab === "overview") {
        const fallbackOverviewTab = role === "md" || role === "admin" ? "dashboard" : "quick-insights";
        setActiveOverviewTab(routeOverviewTab || fallbackOverviewTab);
        if (routeOverviewTab === "people" && routePeopleRoleTab) {
          setActivePeopleRoleTab(routePeopleRoleTab);
        }
      }
      if (routeTab === "workspace" && routeOverviewTab) {
        setWorkspaceTab(routeOverviewTab as typeof workspaceTab);
      }
      return;
    }

    if (!hash) {
      const defaultPath =
        role === "staff"
          ? `${dashboardBasePath}/attendance`
          : `${dashboardBasePath}/overview/${role === "md" || role === "admin" ? "dashboard" : "quick-insights"}`;
      setActiveTab(role === "staff" ? "attendance" : "overview");
      navigate(defaultPath, { replace: true });
      return;
    }

    if (allowedTabs.includes(hash)) {
      setActiveTab(hash);
      navigate(`${dashboardBasePath}/${hash}`, { replace: true });
    } else if (hash === "notifications") {
      setActiveTab("workspace");
      setWorkspaceTab("notifications");
      navigate(`${dashboardBasePath}/workspace/notifications`, { replace: true });
    }
  }, [dashboardBasePath, location.hash, location.pathname, navigate, role, workspaceTab]);

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
      <Tabs value={activeTab} onValueChange={goToDashboardTab} className="relative min-w-0">
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
            activeOverviewTab={activeOverviewTab}
            activePeopleRoleTab={activePeopleRoleTab}
            onOverviewTabChange={goToOverviewTab}
            onPeopleRoleTabChange={goToPeopleRoleTab}
            dashboardBasePath={dashboardBasePath}
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
            activeOverviewTab={activeOverviewTab}
            activePeopleRoleTab={activePeopleRoleTab}
            onOverviewTabChange={goToOverviewTab}
            onPeopleRoleTabChange={goToPeopleRoleTab}
            dashboardBasePath={dashboardBasePath}
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
            activeOverviewTab={activeOverviewTab}
            onOverviewTabChange={goToOverviewTab}
            dashboardData={dashboardData}
            user={user}
            refresh={refresh}
          />
        )}
      </Tabs>
    </DashboardShell>
  );
};
