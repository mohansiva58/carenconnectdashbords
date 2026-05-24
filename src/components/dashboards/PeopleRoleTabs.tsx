/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Users, ShieldCheck, UserCheck, Network, Search, Headset, BriefcaseBusiness } from "lucide-react";
import { HorizontalTabsContainer } from "@/components/layouts/HorizontalTabsContainer";
import type { DashboardViewData } from "@/lib/dashboardData";
import type { Role } from "@/lib/roles";
import { RBACSection } from "./RBACPanelPrimitives";
import { StaffOverview } from "./StaffOverview";

const normalizeDashboardRole = (role?: string | null) => {
  const normalized = String(role || "").trim().toUpperCase();
  if (normalized === "SUPER_ADMIN" || normalized === "CEO") return "MD";
  if (normalized === "REGIONAL") return "REGIONAL_HEAD";
  if (normalized === "CLUSTER") return "CLUSTER_HEAD";
  if (normalized === "MANAGER" || normalized === "SUPERVISOR") return "COORDINATOR";
  if (normalized === "FIELD_STAFF" || normalized === "FIELD_OFFICER") return "STAFF";
  return normalized || "STAFF";
};

const roleTabs = [
  { id: "all", label: "All", roles: null, icon: Users, tone: "slate" as const },
  { id: "md", label: "MD", roles: ["MD"], icon: ShieldCheck, tone: "indigo" as const },
  { id: "admin", label: "Admin", roles: ["ADMIN"], icon: ShieldCheck, tone: "blue" as const },
  { id: "regional-heads", label: "Regional Heads", roles: ["REGIONAL_HEAD"], icon: UserCheck, tone: "teal" as const },
  { id: "clusters", label: "Clusters", roles: ["CLUSTER_HEAD"], icon: Network, tone: "violet" as const },
  { id: "coordinators", label: "Coordinators", roles: ["COORDINATOR"], icon: Headset, tone: "amber" as const },
  { id: "staff", label: "Staff", roles: ["STAFF"], icon: BriefcaseBusiness, tone: "emerald" as const },
  { id: "customers", label: "Customers", roles: ["USER"], icon: Users, tone: "rose" as const },
];

export const PeopleRoleTabs = ({
  staff,
  dashboardData,
  viewerRole,
  label = "People Directory",
  title = "Managed staff and access state",
  description = "Review one role group at a time without loading the full roster into every view.",
  activeRoleTab,
  onRoleTabChange,
}: {
  staff: any[];
  dashboardData: DashboardViewData;
  viewerRole: Role;
  label?: string;
  title?: string;
  description?: string;
  activeRoleTab?: string;
  onRoleTabChange?: (tabId: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const staffList = staff || [];

  const buildStaffForRoles = (roles: string[] | null) => {
    if (!roles) return staffList;
    return staffList.filter((member) => roles.includes(normalizeDashboardRole(member?.role)));
  };

  return (
    <RBACSection>
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Users className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
            <h3 className="mt-1 text-lg font-extrabold tracking-tight text-slate-950">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
          </div>
        </div>
        <div className="relative w-full lg:w-80">
          <input
            type="text"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      <div className="pt-1">
        <HorizontalTabsContainer
          variant="compact"
          activeTab={activeRoleTab}
          defaultTab={activeRoleTab || "all"}
          onTabChange={onRoleTabChange}
          tabs={roleTabs.map((tab) => {
            const scopedStaff = buildStaffForRoles(tab.roles);
            const Icon = tab.icon;

            return {
              id: tab.id,
              label: tab.label,
              icon: <Icon className="h-3.5 w-3.5" />,
              badge: scopedStaff.length,
              tone: tab.tone,
              content: (
                <StaffOverview
                  staff={scopedStaff}
                  data={dashboardData}
                  viewerRole={viewerRole}
                  showRoleFilters={false}
                  showHeader={false}
                  searchQuery={searchQuery}
                  onSearchQueryChange={setSearchQuery}
                />
              ),
            };
          })}
        />
      </div>
    </RBACSection>
  );
};
