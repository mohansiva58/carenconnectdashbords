/* eslint-disable @typescript-eslint/no-explicit-any */
import { TabsContent } from "@/components/ui/tabs";
import { KpiCard } from "@/components/KpiCard";
import { TrendChart, AttendanceTrendChart } from "@/components/Charts";
import { AssignmentPanel } from "@/components/dashboards/AssignmentPanel";
import { LiveStaffMap } from "@/components/dashboards/LiveStaffMap";
import { StaffAttendanceList } from "@/components/dashboards/StaffAttendanceList";
import { AttendanceTable } from "@/components/Tables";
import { StaffOverview } from "./StaffOverview";
import { ComplaintsPanel } from "./ComplaintsPanel";
import { ServiceRequestsPanel } from "./ServiceRequestsPanel";
import { WorkflowSection } from "@/components/layouts/WorkflowSection";
import { MetricsStrip } from "@/components/layouts/MetricsStrip";
import { SectionHeader } from "@/components/layouts/SectionHeader";
import { Activity, Users, AlertTriangle, CheckSquare, MapPinned, UserCheck, ClipboardList, TrendingUp } from "lucide-react";

export const CoordinatorStaffDashboardView = ({
  role,
  activeTab,
  dashboardData,
  user,
  refresh,
}: {
  role: string;
  activeTab: string;
  dashboardData: any;
  user: any;
  refresh: (force: boolean) => void;
}) => {
  const isStaff = role === "staff";
  const isCoordinator = role === "coordinator";
  const isRegionalOrCluster = role === "regional_head" || role === "cluster_head";

  // Dashboard Headline Config
  const headline =
    role === "coordinator"
      ? "Team coordination screen for field execution, regional oversight, and service follow-through."
      : role === "regional_head"
      ? "Regional command view for multi-district operations and high-level oversight."
      : role === "cluster_head"
      ? "Operational management for district clusters and coordinated team execution."
      : "Field operations and daily assignments execution.";

  const nextAction =
    role === "coordinator"
      ? "Route work to field staff, balance workload, today."
      : role === "regional_head"
      ? "Review regional performance and resolve cluster bottlenecks."
      : role === "cluster_head"
      ? "Align district teams and monitor local service queues."
      : "Mark attendance and close assigned tasks today.";

  return (
    <>
      {/* ══════════════════════════════════════
          TAB: OVERVIEW
      ══════════════════════════════════════ */}
      <TabsContent value="overview" className="space-y-8 outline-none mt-0">
        {/* Premium Welcome Gradient Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-9 text-white shadow-xl shadow-slate-200/50">
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-teal-500/25 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-slate-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between z-10">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-teal-400">
                <Activity className="h-4.5 w-4.5 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-[0.25em]">Field Workspace</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight leading-tight">Welcome, {user?.name.split(" ")[0]}</h2>
              <p className="max-w-xl text-sm font-medium text-slate-400 leading-relaxed">{headline}</p>
            </div>
            <div className="shrink-0 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-md border border-white/5 shadow-inner">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-teal-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Suggested Action</span>
              </div>
              <p className="text-sm font-bold text-white">{nextAction}</p>
            </div>
          </div>
        </div>

        {/* Staff / Team Directory */}
        {!isStaff && dashboardData.staffList && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <StaffOverview staff={dashboardData.staffList} data={dashboardData} viewerRole={role as any} />
          </div>
        )}

        {/* Coordinator Overview panels */}
        {isCoordinator && (
          <div className="space-y-6">
            {/* Team Status Metrics */}
            <div>
              <SectionHeader
                subtitle="Team Operations"
                title="Team Status Metrics"
                icon={Users}
                variant="h3"
              />
            </div>

            <MetricsStrip
              grid={5}
              metrics={[
                {
                  label: "Active Today",
                  value: dashboardData.kpis.todayAttendance,
                  icon: UserCheck,
                  tone: "success",
                },
                {
                  label: "Total Scope",
                  value: dashboardData.hierarchySummary?.scopeSize ?? 0,
                  icon: Users,
                  tone: "primary",
                },
                {
                  label: "Total Customers",
                  value: dashboardData.kpis.totalCustomers || "0",
                  icon: Users,
                  tone: "info",
                },
                {
                  label: "Open Complaints",
                  value: dashboardData.kpis.openComplaints,
                  icon: AlertTriangle,
                  tone: "danger",
                },
                {
                  label: "Leave Pending",
                  value: dashboardData.kpis.pendingApprovals,
                  icon: CheckSquare,
                  tone: "warning",
                },
              ]}
            />

            {/* Detailed Performance Snapshot */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <WorkflowSection variant="compact" title="Monthly Avg">
                <p className="text-3xl font-black text-indigo-600">{dashboardData.hierarchySummary?.monthlyAvgAttendance ?? 0}%</p>
                <p className="mt-1 text-xs text-slate-500">Attendance</p>
              </WorkflowSection>
              <WorkflowSection variant="compact" title="Total Leaves">
                <p className="text-3xl font-black text-amber-600">{dashboardData.hierarchySummary?.totalLeaves ?? 0}</p>
                <p className="mt-1 text-xs text-slate-500">All Time</p>
              </WorkflowSection>
              <WorkflowSection variant="compact" title="Active Assignments">
                <p className="text-3xl font-black text-slate-700">{dashboardData.hierarchySummary?.activeAssignments ?? 0}</p>
                <p className="mt-1 text-xs text-slate-500">In Progress</p>
              </WorkflowSection>
              <WorkflowSection variant="compact" title="Completed Work">
                <p className="text-3xl font-black text-emerald-600">{dashboardData.hierarchySummary?.completedProjects ?? 0}</p>
                <p className="mt-1 text-xs text-slate-500">Projects</p>
              </WorkflowSection>
            </div>
          </div>
        )}

        {/* Staff Welcome overview message */}
        {isStaff && (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 text-indigo-900 shadow-xs">
            <h4 className="font-extrabold text-base mb-2">My Workspace</h4>
            <p className="text-sm leading-relaxed">
              Welcome to your daily dashboard. Use the navigation links to track your daily attendance check-ins, execute your assigned service tasks, and report support complaints.
            </p>
          </div>
        )}
      </TabsContent>

      {/* ══════════════════════════════════════
          TAB: ASSIGNMENTS
      ══════════════════════════════════════ */}
      {!isStaff && (
        <TabsContent value="assignments" className="outline-none mt-0">
          <AssignmentPanel
            staffList={dashboardData.staffList || []}
            viewerRole={role as any}
            onAssignSuccess={() => refresh(true)}
          />
        </TabsContent>
      )}

      {/* ══════════════════════════════════════
          TAB: ASSIGNED TASKS
      ══════════════════════════════════════ */}
      <TabsContent value="assigned-tasks" className="outline-none mt-0">
        <ServiceRequestsPanel
          rows={dashboardData.serviceRequestsRows}
          staffList={dashboardData.staffList || []}
          viewerRole={role}
          initialStatusFilter={isStaff ? "all" : "Assigned"}
        />
      </TabsContent>

      {/* ══════════════════════════════════════
          TAB: ATTENDANCE
      ══════════════════════════════════════ */}
      <TabsContent value="attendance" className="space-y-6 outline-none mt-0">
        {!isStaff && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Activity className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Avg</h4>
              </div>
              <p className="mt-1 text-2xl font-black text-slate-800">
                {dashboardData.hierarchySummary?.monthlyAvgAttendance ?? 0}%
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Today</h4>
              </div>
              <p className="mt-1 text-2xl font-black text-slate-800">{dashboardData.kpis.todayAttendance}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Leaves</h4>
              </div>
              <p className="mt-1 text-2xl font-black text-slate-800">
                {dashboardData.hierarchySummary?.totalLeaves ?? 0}
              </p>
            </div>
          </div>
        )}

        {isCoordinator && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <MapPinned className="h-4.5 w-4.5 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-800">Live Field Map</h4>
            </div>
            <LiveStaffMap />
          </div>
        )}

        {!isStaff && dashboardData.staffList && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4.5 w-4.5 text-slate-600" />
              <h4 className="text-sm font-bold text-slate-800">Staff Shift Approvals</h4>
            </div>
            <StaffAttendanceList
              staff={
                isCoordinator
                  ? dashboardData.staffList.filter(
                      (member: any) => String(member?.role || "").trim().toUpperCase() === "STAFF"
                    )
                  : dashboardData.staffList
              }
              data={{
                ...dashboardData,
                attendanceRows: isCoordinator
                  ? dashboardData.attendanceRows.filter((row: any) => String(row.role || "").trim().toUpperCase() === "STAFF")
                  : dashboardData.attendanceRows,
              }}
            />
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4.5 w-4.5 text-slate-600" />
            <h4 className="text-sm font-bold text-slate-800">Shift Check-in History</h4>
          </div>
          <AttendanceTable
            rows={
              isCoordinator
                ? dashboardData.attendanceRows.filter((row: any) => String(row.role || "").trim().toUpperCase() === "STAFF")
                : dashboardData.attendanceRows
            }
          />
        </div>
      </TabsContent>

      {/* ══════════════════════════════════════
          TAB: COMPLAINTS
      ══════════════════════════════════════ */}
      <TabsContent value="complaints" className="outline-none mt-0">
        <ComplaintsPanel rows={dashboardData.complaintsRows} staffList={dashboardData.staffList || []} />
      </TabsContent>
    </>
  );
};
