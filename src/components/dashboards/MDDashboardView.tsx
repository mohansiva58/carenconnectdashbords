/* eslint-disable @typescript-eslint/no-explicit-any */
import { TabsContent } from "@/components/ui/tabs";
import { KpiCard } from "@/components/KpiCard";
import { TrendChart, AttendanceTrendChart, DistroPieChart } from "@/components/Charts";
import { ApprovalsPanel } from "@/components/Approvals";
import { LeaveApprovalsPanel } from "@/components/LeaveApprovalsPanel";
import { WorkflowWorkspace } from "@/components/WorkflowWorkspace";
import { SalesBoard } from "@/components/dashboards/SalesBoard";
import { MDOrganizationalChart } from "./MDOrganizationalChart";
import { StaffOverview } from "./StaffOverview";
import { ComplaintsPanel } from "./ComplaintsPanel";
import { ServiceRequestsPanel } from "./ServiceRequestsPanel";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  CheckSquare,
  ClipboardList,
  Database,
  GitBranch,
  Layers,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import {
  PermissionScopeGrid,
  RBACPageHeader,
  RBACSection,
  RBACSectionHeader,
  RBACStatusStrip,
} from "./RBACPanelPrimitives";

export const MDDashboardView = ({
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
  const firstName = user?.name?.split(" ")[0] ?? "MD";

  return (
    <>
      <TabsContent value="overview" className="space-y-8 outline-none mt-0">
        <RBACPageHeader
          eyebrow="MD RBAC Console"
          title={`Executive workspace, ${firstName}`}
          description="Full-system oversight for identity, hierarchy, approvals, service pipelines, and organization-wide reporting."
          icon={ShieldCheck}
          tone="indigo"
        >
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-extrabold uppercase tracking-widest">Global Access</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-emerald-950">All regions, roles, approvals, and analytics</p>
          </div>
        </RBACPageHeader>

        <RBACStatusStrip
          items={[
            { label: "Users in scope", value: dashboardData.staffList?.length || 0, icon: Users, tone: "indigo" },
            { label: "Customers", value: dashboardData.kpis.totalCustomers || "0", icon: Database, tone: "emerald" },
            { label: "Open complaints", value: dashboardData.kpis.openComplaints || "0", icon: AlertTriangle, tone: "rose" },
            { label: "Pending approvals", value: dashboardData.kpis.pendingApprovals || "0", icon: CheckSquare, tone: "amber" },
          ]}
        />

        <PermissionScopeGrid
          scopes={[
            {
              title: "Role Governance",
              description: "Create, review, and approve privileged users across the operational hierarchy.",
              icon: UserCog,
              tone: "indigo",
            },
            {
              title: "Hierarchy Control",
              description: "Monitor MD, admin, regional, cluster, coordinator, and staff reporting lines.",
              icon: GitBranch,
              tone: "blue",
            },
            {
              title: "Workflow Authority",
              description: "Audit approvals, service queues, complaint escalation, and reporting evidence.",
              icon: ClipboardList,
              tone: "emerald",
            },
          ]}
        />

        {dashboardData.staffList && (
          <RBACSection>
            <RBACSectionHeader
              label="Organization Map"
              title="Live hierarchy and control relationships"
              description="Use this area to understand reporting depth before changing permissions or assignments."
              icon={GitBranch}
            />
            <MDOrganizationalChart staff={dashboardData.staffList} />
          </RBACSection>
        )}

        {dashboardData.staffList && (
          <RBACSection>
            <RBACSectionHeader
              label="People Directory"
              title="Staff, roles, and operational status"
              description="A roster view for account state, attendance, and role review."
              icon={Users}
            />
            <StaffOverview staff={dashboardData.staffList} data={dashboardData} viewerRole="md" />
          </RBACSection>
        )}

        <RBACSection>
          <RBACSectionHeader
            label="Executive KPIs"
            title="System health at a glance"
            description="The highest-signal counters for current operational risk and throughput."
            icon={Layers}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Team Strength" value={String(dashboardData.staffList?.length || 0)} icon={Users} />
            <KpiCard label="Total Customers" value={dashboardData.kpis.totalCustomers || "0"} icon={Users} tone="secondary" />
            <KpiCard label="Open Complaints" value={dashboardData.kpis.openComplaints || "0"} icon={AlertTriangle} tone="warning" />
            <KpiCard label="Pending Approvals" value={dashboardData.kpis.pendingApprovals || "0"} icon={CheckSquare} tone="warning" />
          </div>
        </RBACSection>

        <RBACSection>
          <RBACSectionHeader
            label="Analytics"
            title="Service movement and attendance trends"
            description="Review system performance before approving structural or workflow changes."
            icon={BarChart3}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <TrendChart data={dashboardData.trendData} />
            <AttendanceTrendChart data={dashboardData.attendanceTrend} />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Service Request Distribution</h3>
              <DistroPieChart data={dashboardData.distributionData} />
            </div>
            <div className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Control Summary</p>
              <h3 className="mt-2 text-xl font-extrabold tracking-tight text-slate-950">Total system aggregates</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                This panel consolidates real-time metrics across regional teams so MD users can review risk,
                workforce coverage, and approval pressure in one place.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Escalated approvals</p>
                  <p className="mt-2 text-2xl font-extrabold text-amber-950">{dashboardData.kpis.pendingApprovals}</p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Today's attendance</p>
                  <p className="mt-2 text-2xl font-extrabold text-emerald-950">{dashboardData.kpis.todayAttendance}</p>
                </div>
              </div>
            </div>
          </div>
        </RBACSection>
      </TabsContent>

      <TabsContent value="reports" className="space-y-6 outline-none mt-0">
        <RBACSectionHeader
          label="Reports"
          title="Executive reporting"
          description="Trend, attendance, and distribution views for full-system review."
          icon={BarChart3}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <TrendChart data={dashboardData.trendData} />
          <AttendanceTrendChart data={dashboardData.attendanceTrend} />
        </div>
        <DistroPieChart data={dashboardData.distributionData} title="Service Pipeline Statistics" />
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
          viewerRole="md"
          initialStatusFilter="Assigned"
        />
      </TabsContent>

      <TabsContent value="complaints" className="outline-none mt-0">
        <ComplaintsPanel rows={dashboardData.complaintsRows} staffList={dashboardData.staffList || []} />
      </TabsContent>

      <TabsContent value="workspace" className="outline-none mt-0">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <WorkflowWorkspace
            role="md"
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
