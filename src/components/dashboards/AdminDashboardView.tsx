/* eslint-disable @typescript-eslint/no-explicit-any */
import { TabsContent } from "@/components/ui/tabs";
import { KpiCard } from "@/components/KpiCard";
import { TrendChart, AttendanceTrendChart, DistroPieChart } from "@/components/Charts";
import { ApprovalsPanel } from "@/components/Approvals";
import { LeaveApprovalsPanel } from "@/components/LeaveApprovalsPanel";
import { WorkflowWorkspace } from "@/components/WorkflowWorkspace";
import { SalesBoard } from "@/components/dashboards/SalesBoard";
import { StaffOverview } from "./StaffOverview";
import { ComplaintsPanel } from "./ComplaintsPanel";
import { ServiceRequestsPanel } from "./ServiceRequestsPanel";
import { WorkflowSection } from "@/components/layouts/WorkflowSection";
import { MetricsStrip } from "@/components/layouts/MetricsStrip";
import { SectionHeader } from "@/components/layouts/SectionHeader";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  CheckSquare,
  ClipboardList,
  Database,
  MapPinned,
  Settings,
  ShieldCheck,
  UserCheck,
  Users,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  PermissionScopeGrid,
  RBACPageHeader,
  RBACSection,
  RBACSectionHeader,
  RBACStatusStrip,
} from "./RBACPanelPrimitives";

export const AdminDashboardView = ({
  workspaceTab,
  dashboardData,
  user,
  refresh,
  handleApproveLead,
  handleRejectLead,
}: {
  activeTab: string;
  workspaceTab: any;
  dashboardData: any;
  user: any;
  refresh: (force: boolean) => void;
  handleApproveLead: (id: string) => Promise<boolean>;
  handleRejectLead: (id: string) => Promise<boolean>;
}) => {
  const firstName = user?.name?.split(" ")[0] ?? "Admin";

  return (
    <>
      <TabsContent value="overview" className="space-y-8 outline-none mt-0">
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION: Operations Summary
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <RBACPageHeader
          eyebrow="Admin RBAC Console"
          title={`Operational control room, ${firstName}`}
          description="A structured panel for users, approvals, regional assignments, service records, and controlled access review."
          icon={ShieldCheck}
          tone="blue"
        >
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-extrabold uppercase tracking-widest">Admin Scope</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-blue-950">Users, approvals, assignments, and regional workflows</p>
          </div>
        </RBACPageHeader>

        {/* Key Metrics */}
        <MetricsStrip
          grid={4}
          metrics={[
            {
              label: "Users Managed",
              value: dashboardData.staffList?.length || 0,
              icon: Users,
              tone: "primary",
            },
            {
              label: "Total Customers",
              value: dashboardData.kpis.totalCustomers || "0",
              icon: Database,
              tone: "success",
            },
            {
              label: "Open Complaints",
              value: dashboardData.kpis.openComplaints || "0",
              icon: AlertTriangle,
              tone: "danger",
            },
            {
              label: "Approval Queue",
              value: dashboardData.kpis.pendingApprovals || "0",
              icon: CheckSquare,
              tone: "warning",
            },
          ]}
        />

        <PermissionScopeGrid
          scopes={[
            {
              title: "User Administration",
              description: "Approve accounts, inspect staff status, and keep role assignments aligned.",
              icon: UserCheck,
              tone: "blue",
            },
            {
              title: "Operational Routing",
              description: "Coordinate service queues, field assignments, and complaint follow-through.",
              icon: MapPinned,
              tone: "emerald",
            },
            {
              title: "Permission Workspace",
              description: "Use the workspace tab for role-aware approvals, notifications, and activity review.",
              icon: Settings,
              tone: "slate",
            },
          ]}
        />

        {dashboardData.staffList && (
          <RBACSection>
            <RBACSectionHeader
              label="People Directory"
              title="Managed staff and access state"
              description="A roster for reviewing active users, pending users, attendance signals, and operational role health."
              icon={Users}
            />
            <StaffOverview staff={dashboardData.staffList} data={dashboardData} viewerRole="admin" />
          </RBACSection>
        )}

        <RBACSection>
          <RBACSectionHeader
            label="Administrative KPIs"
            title="Current operational load"
            description="Counters that show where admin attention is needed right now."
            icon={Settings}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Team Strength" value={String(dashboardData.staffList?.length || 0)} icon={Users} />
            <KpiCard label="Total Customers" value={dashboardData.kpis.totalCustomers || "0"} icon={Users} tone="secondary" />
            <KpiCard label="Open Complaints" value={dashboardData.kpis.openComplaints || "0"} icon={AlertTriangle} tone="warning" />
            <KpiCard label="Pending Approvals" value={dashboardData.kpis.pendingApprovals || "0"} icon={CheckSquare} tone="warning" />
          </div>
        </RBACSection>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            SECTION: Analytics & Operations
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="space-y-4">
          <SectionHeader
            subtitle="Operational Intelligence"
            title="Service Movement & Attendance Trends"
            description="Use these charts to balance queue handling with team availability."
            icon={TrendingUp}
            variant="h2"
          />
          
          <WorkflowSection
            variant="default"
            className="overflow-hidden"
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <TrendChart data={dashboardData.trendData} />
              <AttendanceTrendChart data={dashboardData.attendanceTrend} />
            </div>
          </WorkflowSection>

          <div className="grid gap-6 lg:grid-cols-3">
            <WorkflowSection
              title="Service Distribution"
              icon={Database}
              variant="default"
              className="lg:col-span-1"
            >
              <DistroPieChart data={dashboardData.distributionData} />
            </WorkflowSection>

            <WorkflowSection
              title="Control Panel Priorities"
              description="What needs attention right now"
              icon={Activity}
              variant="default"
              className="lg:col-span-2"
            >
              <p className="text-sm leading-6 text-slate-600 mb-4">
                This summary keeps approvals, staff availability, and service pressure visible before you assign work
                or adjust user permissions.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Pending Approvals</p>
                  <p className="mt-3 text-3xl font-extrabold text-amber-950">{dashboardData.kpis.pendingApprovals}</p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Today&apos;s Presence</p>
                  <p className="mt-3 text-3xl font-extrabold text-emerald-950">{dashboardData.kpis.todayAttendance}</p>
                </div>
              </div>
            </WorkflowSection>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="sales" className="outline-none mt-0">
        <SalesBoard leadsRows={dashboardData.leadsRows || []} />
      </TabsContent>

      <TabsContent value="approvals" className="space-y-6 outline-none mt-0">
        <RBACSectionHeader
          label="Governance Queue"
          title="Approvals and leave controls"
          description="Review pending accounts, leads, and leave requests from the same governance surface."
          icon={CheckSquare}
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <ApprovalsPanel />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <LeaveApprovalsPanel leaveRequests={dashboardData.leaveRequestsRows} onRefresh={() => refresh(true)} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="assigned-tasks" className="outline-none mt-0">
        <ServiceRequestsPanel
          rows={dashboardData.serviceRequestsRows}
          staffList={dashboardData.staffList || []}
          viewerRole="admin"
          initialStatusFilter="Assigned"
        />
      </TabsContent>

      <TabsContent value="complaints" className="outline-none mt-0">
        <ComplaintsPanel rows={dashboardData.complaintsRows} staffList={dashboardData.staffList || []} />
      </TabsContent>

      <TabsContent value="workspace" className="outline-none mt-0">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <WorkflowWorkspace
            role="admin"
            dashboardData={dashboardData}
            onApproveLead={handleApproveLead}
            onRejectLead={handleRejectLead}
            initialTab={workspaceTab}
          />
        </div>
      </TabsContent>
    </>
  );
};
