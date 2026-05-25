/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { ApprovalsPanel } from "@/components/Approvals";
import { LeaveApprovalsPanel } from "@/components/LeaveApprovalsPanel";
import { WorkflowWorkspace } from "@/components/WorkflowWorkspace";
import { BrandWatermark } from "@/components/BrandWatermark";
import { PeopleRoleTabs } from "./PeopleRoleTabs";
import { OverviewActionCards } from "./OverviewActionCards";
import { ComplaintsPanel } from "./ComplaintsPanel";
import { ServiceRequestsPanel } from "./ServiceRequestsPanel";
import { MetricsStrip } from "@/components/layouts/MetricsStrip";
import { HorizontalTabsContainer } from "@/components/layouts/HorizontalTabsContainer";
import {
  AlertTriangle,
  CheckSquare,
  ClipboardList,
  Database,
  Users,
  Activity,
} from "lucide-react";
import {
  RBACSectionHeader,
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
  const [activeOverviewTab, setActiveOverviewTab] = useState('dashboard');
  const [activePeopleRoleTab, setActivePeopleRoleTab] = useState('all');
  const openPeopleTab = (roleTab: string) => {
    setActivePeopleRoleTab(roleTab);
    setActiveOverviewTab('people');
  };

  return (
    <>
      <TabsContent value="overview" className="outline-none mt-0">
        <BrandWatermark className="bg-white/35 p-0">
          {/* Horizontal Tab Navigation */}
          <HorizontalTabsContainer
            tabs={[
              {
                id: 'dashboard',
                label: 'Dashboard',
                icon: <Activity className="h-4 w-4" />,
                tone: 'indigo',
                content: (
                  <div className="space-y-6">
                    {/* Key Metrics */}
                    <MetricsStrip
                      grid={2}
                      metrics={[
                        {
                          label: "Users in Scope",
                          value: dashboardData.staffList?.length || 0,
                          icon: Users,
                          tone: "primary",
                          onClick: () => openPeopleTab('all'),
                        },
                        {
                          label: "Total Customers",
                          value: dashboardData.kpis.totalCustomers || "0",
                          icon: Database,
                          tone: "success",
                          onClick: () => openPeopleTab('customers'),
                        },
                      ]}
                    />

                  <OverviewActionCards
                    actions={[
                      {
                        label: "Assigned Tasks",
                        value: dashboardData.serviceRequestsRows?.length || 0,
                        href: "#assigned-tasks",
                        icon: ClipboardList,
                        tone: "purple",
                      },
                      {
                        label: "Complaints",
                        value: dashboardData.complaintsRows?.length || 0,
                        href: "#complaints",
                        icon: AlertTriangle,
                        tone: "rose",
                      },
                      {
                        label: "Approvals",
                        eyebrow: "Governance",
                        value: dashboardData.kpis.pendingApprovals || "0",
                        href: "#approvals",
                        icon: CheckSquare,
                        tone: "amber",
                      },
                    ]}
                  />

                </div>
              ),
            },
            {
              id: 'people',
              label: 'People',
              icon: <Users className="h-4 w-4" />,
              badge: dashboardData.staffList?.length || 0,
              tone: 'teal',
              content: (
                dashboardData.staffList ? (
                  <PeopleRoleTabs
                    staff={dashboardData.staffList}
                    dashboardData={dashboardData}
                    viewerRole="md"
                    label="Staff Directory"
                    title="All staff members and operational status"
                    description="Switch between MD, admin, regional head, cluster, and all-user views."
                    activeRoleTab={activePeopleRoleTab}
                    onRoleTabChange={setActivePeopleRoleTab}
                  />
                ) : null
              ),
            },
          ]}
          activeTab={activeOverviewTab}
          defaultTab={activeOverviewTab}
          onTabChange={setActiveOverviewTab}
          />
        </BrandWatermark>
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
