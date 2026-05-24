/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
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
import { HorizontalTabsContainer } from "@/components/layouts/HorizontalTabsContainer";
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
  const [activeOverviewTab, setActiveOverviewTab] = useState('dashboard');
  const staffFilters = useFilters();
  const analyticsFilters = useFilters();
  const regionalFilters = useFilters();

  return (
    <>
      <TabsContent value="overview" className="outline-none mt-0">
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

        {/* Horizontal Tab Navigation */}
        <HorizontalTabsContainer
          tabs={[
            {
              id: 'dashboard',
              label: 'Dashboard',
              icon: <Activity className="h-4 w-4" />,
              content: (
                <div className="space-y-6">
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

                  {/* Governance Scopes */}
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

                  {/* System KPIs */}
                  <RBACSection>
                    <RBACSectionHeader
                      label="System Health"
                      title="Executive KPIs"
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
              id: 'regional',
              label: 'Regional Data',
              icon: <Database className="h-4 w-4" />,
              content: (
                <div className="space-y-6">
                  <DataTableFilter
                    filters={regionalFilters.filters}
                    onFiltersChange={regionalFilters.updateFilters}
                    onReset={regionalFilters.resetFilters}
                    hasActiveFilters={regionalFilters.hasActiveFilters}
                    searchPlaceholder="Search regional data..."
                    showSearch={true}
                  />
                  <FilterChips
                    chips={regionalFilters.filterChips}
                    onClearAll={regionalFilters.clearAllFilters}
                  />

                  <div className="space-y-4">
                    <SectionHeader
                      subtitle="Regional Performance"
                      title="Regional Operations Overview"
                      description="Performance metrics and data across all regions."
                      icon={BarChart3}
                      variant="h2"
                    />
                    
                    <WorkflowSection variant="default" className="overflow-hidden">
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
                        title="Regional Summary"
                        description="Consolidated metrics across all regions"
                        icon={Activity}
                        variant="default"
                        className="lg:col-span-2"
                      >
                        <p className="text-sm leading-6 text-slate-600 mb-4">
                          Monitor regional performance, resource allocation, and operational capacity across your organization.
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Active Regions</p>
                            <p className="mt-3 text-3xl font-extrabold text-blue-950">5</p>
                          </div>
                          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-purple-700">Regional Teams</p>
                            <p className="mt-3 text-3xl font-extrabold text-purple-950">{dashboardData.staffList?.length || 0}</p>
                          </div>
                        </div>
                      </WorkflowSection>
                    </div>
                  </div>
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
                        label="Staff Directory"
                        title="All staff members and operational status"
                        description="A comprehensive roster view for account state, attendance, and role management."
                        icon={Users}
                      />
                      <StaffOverview staff={dashboardData.staffList} data={dashboardData} viewerRole="md" />
                    </RBACSection>
                  )}
                </div>
              ),
            },
            {
              id: 'reports',
              label: 'Reports',
              icon: <BarChart className="h-4 w-4" />,
              content: (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <SectionHeader
                      subtitle="Performance Analytics"
                      title="System Trends & Analytics"
                      description="Comprehensive reporting on service movement and operational metrics."
                      icon={TrendingUp}
                      variant="h2"
                    />
                    
                    <WorkflowSection variant="default" className="overflow-hidden">
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
                        title="System Performance"
                        description="Real-time operational metrics"
                        icon={Activity}
                        variant="default"
                        className="lg:col-span-2"
                      >
                        <p className="text-sm leading-6 text-slate-600 mb-4">
                          Key performance indicators consolidated from all operational regions and teams.
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
