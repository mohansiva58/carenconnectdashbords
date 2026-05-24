/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
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
import { WorkflowSection } from "@/components/layouts/WorkflowSection";
import { MetricsStrip } from "@/components/layouts/MetricsStrip";
import { SectionHeader } from "@/components/layouts/SectionHeader";
import { OverviewTabsContainer } from "@/components/layouts/OverviewTabsContainer";
import { DataTableFilter } from "@/components/filters/DataTableFilter";
import { FilterChips } from "@/components/filters/FilterChips";
import { useFilters } from "@/hooks/useFilters";
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
  TrendingUp,
  Activity,
  PieChart,
  BarChart,
  Network,
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
  const [activeOverviewTab, setActiveOverviewTab] = useState('quick-insights');
  const staffFilters = useFilters();
  const analyticsFilters = useFilters();

  return (
    <>
      <TabsContent value="overview" className="space-y-6 outline-none mt-0">
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

        {/* Key Metrics */}
        <MetricsStrip
          grid={4}
          metrics={[
            {
              label: "Users in Scope",
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
              label: "Pending Approvals",
              value: dashboardData.kpis.pendingApprovals || "0",
              icon: CheckSquare,
              tone: "warning",
            },
          ]}
        />

        {/* Nested Overview Tabs */}
        <OverviewTabsContainer
          tabs={[
            {
              id: 'quick-insights',
              label: 'Quick Insights',
              icon: <ShieldCheck className="h-4 w-4" />,
              content: (
                <div className="space-y-6">
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
                </div>
              ),
            },
            {
              id: 'people',
              label: 'People',
              icon: <Users className="h-4 w-4" />,
              badge: dashboardData.staffList?.length || 0,
              content: (
                <div className="space-y-4">
                  <DataTableFilter
                    filters={staffFilters.filters}
                    onFiltersChange={staffFilters.updateFilters}
                    onReset={staffFilters.resetFilters}
                    hasActiveFilters={staffFilters.hasActiveFilters}
                    searchPlaceholder="Search staff by name or email..."
                    showSearch={true}
                  />
                  <FilterChips
                    chips={staffFilters.filterChips}
                    onClearAll={staffFilters.clearAllFilters}
                  />
                  
                  {dashboardData.staffList && (
                    <RBACSection>
                      <RBACSectionHeader
                        label="Organization Map"
                        title="Live hierarchy and control relationships"
                        description="Use this area to understand reporting depth before changing permissions or assignments."
                        icon={Network}
                      />
                      <MDOrganizationalChart staff={dashboardData.staffList} />
                    </RBACSection>
                  )}

                  {dashboardData.staffList && (
                    <RBACSection>
                      <RBACSectionHeader
                        label="Staff Roster"
                        title="Staff, roles, and operational status"
                        description="A roster view for account state, attendance, and role review."
                        icon={Users}
                      />
                      <StaffOverview staff={dashboardData.staffList} data={dashboardData} viewerRole="md" />
                    </RBACSection>
                  )}
                </div>
              ),
            },
            {
              id: 'analytics',
              label: 'Analytics',
              icon: <BarChart className="h-4 w-4" />,
              content: (
                <div className="space-y-6">
                  <DataTableFilter
                    filters={analyticsFilters.filters}
                    onFiltersChange={analyticsFilters.updateFilters}
                    onReset={analyticsFilters.resetFilters}
                    hasActiveFilters={analyticsFilters.hasActiveFilters}
                    searchPlaceholder="Filter analytics..."
                    showSearch={true}
                  />
                  <FilterChips
                    chips={analyticsFilters.filterChips}
                    onClearAll={analyticsFilters.clearAllFilters}
                  />

                  <div className="space-y-4">
                    <SectionHeader
                      subtitle="Performance Intelligence"
                      title="Service Movement & Attendance Trends"
                      description="Review system performance before approving structural or workflow changes."
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
                        icon={PieChart}
                        variant="default"
                        className="lg:col-span-1"
                      >
                        <DistroPieChart data={dashboardData.distributionData} />
                      </WorkflowSection>

                      <WorkflowSection
                        title="System Aggregates"
                        description="Real-time consolidation across all regional teams"
                        icon={Activity}
                        variant="default"
                        className="lg:col-span-2"
                      >
                        <p className="text-sm leading-6 text-slate-600 mb-4">
                          This panel consolidates real-time metrics across regional teams so you can review risk,
                          workforce coverage, and approval pressure in one place.
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Escalated Approvals</p>
                            <p className="mt-3 text-3xl font-extrabold text-amber-950">{dashboardData.kpis.pendingApprovals}</p>
                          </div>
                          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Today&apos;s Attendance</p>
                            <p className="mt-3 text-3xl font-extrabold text-emerald-950">{dashboardData.kpis.todayAttendance}</p>
                          </div>
                        </div>
                      </WorkflowSection>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
          defaultTab={activeOverviewTab}
          onTabChange={setActiveOverviewTab}
        />
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
