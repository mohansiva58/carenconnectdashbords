/**
 * DashboardShell — Redesigned Premium SaaS Layout
 */

import { ReactNode, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { roleLabel, type Role } from "@/lib/roles";
import { BrandLogo } from "./BrandLogo";
import {
  Bell,
  CheckSquare,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MapPinned,
  ShieldCheck,
  Menu,
  X,
  UserCheck,
  AlertTriangle,
  Plus,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AddProjectModal } from "./AddProjectModal";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  section?: "workspace" | "operations" | "governance";
};

/* ─────────────────────────────────────────────
   Nav config — Identical targets but categorized
   ───────────────────────────────────────────── */
const navByRole: Record<Role, NavItem[]> = {
  md: [
    { to: "/dashboard/md/overview/dashboard", label: "Overview", icon: LayoutDashboard, section: "workspace" },
    { to: "/dashboard/md/assigned-tasks", label: "Assigned Tasks", icon: ClipboardList, section: "operations" },
    { to: "/dashboard/md/complaints", label: "Complaints", icon: AlertTriangle, section: "operations" },
    { to: "/dashboard/md/approvals", label: "Approvals", icon: CheckSquare, section: "governance" },
  ],
  admin: [
    { to: "/dashboard/admin/overview/dashboard", label: "Regional Data", icon: LayoutDashboard, section: "workspace" },
    { to: "/dashboard/admin/assigned-tasks", label: "Assigned Tasks", icon: ClipboardList, section: "operations" },
    { to: "/dashboard/admin/complaints", label: "Complaints", icon: AlertTriangle, section: "operations" },
    { to: "/dashboard/admin/workspace", label: "Permissions & Roles", icon: ShieldCheck, section: "governance" },
    { to: "/dashboard/admin/approvals", label: "Approvals", icon: CheckSquare, section: "governance" },
  ],
  regional_head: [
    { to: "/dashboard/regional-head/overview/quick-insights", label: "Cluster Data", icon: LayoutDashboard, section: "workspace" },
    { to: "/dashboard/regional-head/assignments", label: "Assign Coordinators", icon: MapPinned, section: "operations" },
    { to: "/dashboard/regional-head/attendance", label: "Attendance", icon: UserCheck, section: "operations" },
    { to: "/dashboard/regional-head/assigned-tasks", label: "Assigned Tasks", icon: ClipboardList, section: "operations" },
    { to: "/dashboard/regional-head/complaints", label: "Complaints", icon: AlertTriangle, section: "operations" },
  ],
  cluster_head: [
    { to: "/dashboard/cluster-head/overview/quick-insights", label: "Coordinator Data", icon: LayoutDashboard, section: "workspace" },
    { to: "/dashboard/cluster-head/assignments", label: "Assign Field Offices", icon: MapPinned, section: "operations" },
    { to: "/dashboard/cluster-head/attendance", label: "Attendance", icon: UserCheck, section: "operations" },
    { to: "/dashboard/cluster-head/assigned-tasks", label: "Assigned Tasks", icon: ClipboardList, section: "operations" },
    { to: "/dashboard/cluster-head/complaints", label: "Complaints", icon: AlertTriangle, section: "operations" },
  ],
  coordinator: [
    { to: "/dashboard/coordinator/overview/quick-insights", label: "Total Summary", icon: LayoutDashboard, section: "workspace" },
    { to: "/dashboard/coordinator/assignments", label: "Assign Locations", icon: MapPinned, section: "operations" },
    { to: "/dashboard/coordinator/attendance", label: "Attendance", icon: UserCheck, section: "operations" },
    { to: "/dashboard/coordinator/assigned-tasks", label: "Assigned Tasks", icon: ClipboardList, section: "operations" },
    { to: "/dashboard/coordinator/complaints", label: "Complaints", icon: AlertTriangle, section: "operations" },
  ],
  staff: [
    { to: "/dashboard/staff/attendance", label: "Attendance", icon: UserCheck, section: "workspace" },
    { to: "/dashboard/staff/assigned-tasks", label: "Assigned Tasks", icon: ClipboardList, section: "operations" },
    { to: "/dashboard/staff/complaints", label: "Complaints", icon: AlertTriangle, section: "operations" },
  ],
};

const roleMeta: Record<string, { colour: string; bg: string; border: string; accent: string; gradient: string }> = {
  md: {
    colour: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-150",
    accent: "bg-indigo-600",
    gradient: "from-indigo-600 to-indigo-800",
  },
  admin: {
    colour: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-150",
    accent: "bg-blue-600",
    gradient: "from-blue-600 to-blue-800",
  },
  coordinator: {
    colour: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-150",
    accent: "bg-amber-600",
    gradient: "from-amber-500 to-amber-700",
  },
  regional_head: {
    colour: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-150",
    accent: "bg-teal-600",
    gradient: "from-teal-500 to-teal-700",
  },
  cluster_head: {
    colour: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-150",
    accent: "bg-violet-600",
    gradient: "from-violet-500 to-violet-700",
  },
  staff: {
    colour: "text-slate-700",
    bg: "bg-slate-50",
    border: "border-slate-150",
    accent: "bg-slate-600",
    gradient: "from-slate-500 to-slate-700",
  },
};

const Initials = ({
  name,
  size = "md",
  accentClass = "bg-gradient-to-br from-indigo-500 to-indigo-700",
}: {
  name: string;
  size?: "xs" | "sm" | "md";
  accentClass?: string;
}) => {
  const letters =
    name
      .trim()
      .split(/\s+/)
      .filter((s) => s.length > 0)
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-bold text-white shadow-sm ring-2 ring-white",
        accentClass,
        size === "xs" ? "h-7 w-7 text-[10px]" : size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"
      )}
    >
      {letters}
    </div>
  );
};

const SideNavItem = ({
  item,
  location,
  expanded,
}: {
  item: NavItem;
  location: ReturnType<typeof useLocation>;
  expanded: boolean;
}) => {
  const [path, hash] = item.to.split("#");
  const overviewBase = path.includes("/overview/") ? path.slice(0, path.indexOf("/overview/") + "/overview".length) : null;

  return (
    <NavLink
      to={item.to}
      end
      aria-label={item.label}
      className={({ isActive }) => {
        const active = hash
          ? location.pathname === path && location.hash === `#${hash}`
          : isActive || (overviewBase ? location.pathname.startsWith(overviewBase) : false);
        return cn(
          "group relative flex min-h-[42px] items-center rounded-xl transition-all duration-200",
          expanded ? "mx-3 gap-3 px-3.5 py-2.5" : "mx-auto h-11 w-11 justify-center",
          active
            ? "bg-indigo-50 text-indigo-900 border border-indigo-100/30"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        );
      }}
    >
      {({ isActive }) => {
        const active = hash
          ? location.pathname === path && location.hash === `#${hash}`
          : isActive || (overviewBase ? location.pathname.startsWith(overviewBase) : false);
        return (
          <>
            {/* Left Accent indicator bar */}
            {active && expanded && (
              <span className="absolute left-0 top-1/2 -mt-3.5 h-7 w-[3px] rounded-r-full bg-indigo-600" />
            )}
            {/* Active dot when collapsed */}
            {active && !expanded && (
              <span className="absolute -right-0.5 top-1/2 -mt-1.5 h-3 w-[3px] rounded-l-full bg-indigo-600" />
            )}
            <item.icon
              className={cn(
                "h-4.5 w-4.5 shrink-0 transition-all duration-200",
                active ? "text-indigo-600 scale-105" : "text-slate-400 group-hover:text-slate-600"
              )}
            />
            {expanded && <span className="truncate text-sm font-semibold tracking-tight">{item.label}</span>}
            {/* Tooltip when collapsed */}
            {!expanded && (
              <span className="pointer-events-none absolute left-full ml-3.5 z-50 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-xl transition-all duration-200 group-hover:opacity-100">
                {item.label}
              </span>
            )}
          </>
        );
      }}
    </NavLink>
  );
};

const SidebarContent = ({
  items,
  user,
  location,
  onSignOut,
  onAddProject,
  expanded,
  onToggleExpand,
}: {
  items: NavItem[];
  user: { name: string; role: Role };
  location: ReturnType<typeof useLocation>;
  onSignOut: () => void;
  onAddProject?: () => void;
  expanded: boolean;
  onToggleExpand: () => void;
}) => {
  const meta = roleMeta[user.role] ?? roleMeta.staff;
  const isMD = user.role === "md";

  // Group items by section
  const workspaceItems = items.filter((it) => !it.section || it.section === "workspace");
  const operationsItems = items.filter((it) => it.section === "operations");
  const governanceItems = items.filter((it) => it.section === "governance");

  const renderSectionHeader = (title: string) => {
    if (!expanded) return <div className="h-px bg-slate-100 my-4 mx-4" />;
    return (
      <p className="px-6 pt-5 pb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
        {title}
      </p>
    );
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* ── Logo + Expand toggle ── */}
      <div
        className={cn(
          "flex items-center border-b border-slate-150 py-4.5",
          expanded ? "justify-between px-5" : "justify-center"
        )}
      >
        {expanded ? (
          <BrandLogo />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 shadow-md">
            <span className="text-xs font-black text-white tracking-tighter">OX</span>
          </div>
        )}
        <button
          onClick={onToggleExpand}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors border border-transparent hover:border-slate-200/50",
            !expanded && "hidden"
          )}
          aria-label="Collapse sidebar"
        >
          <ChevronRight className="h-4.5 w-4.5 rotate-180" />
        </button>
      </div>

      {/* ── Nav content ── */}
      <nav className="flex-1 overflow-y-auto space-y-0.5 py-3" aria-label="Sidebar navigation">
        {/* Workspace Section */}
        {workspaceItems.length > 0 && (
          <>
            {renderSectionHeader("Workspace")}
            {workspaceItems.map((item, i) => (
              <SideNavItem key={`ws-${i}`} item={item} location={location} expanded={expanded} />
            ))}
          </>
        )}

        {/* Operations Section */}
        {operationsItems.length > 0 && (
          <>
            {renderSectionHeader("Operations")}
            {operationsItems.map((item, i) => (
              <SideNavItem key={`op-${i}`} item={item} location={location} expanded={expanded} />
            ))}
          </>
        )}

        {/* Governance Section */}
        {governanceItems.length > 0 && (
          <>
            {renderSectionHeader("Governance")}
            {governanceItems.map((item, i) => (
              <SideNavItem key={`gov-${i}`} item={item} location={location} expanded={expanded} />
            ))}
          </>
        )}
      </nav>

      {/* ── Add Project Callout ── */}
      {isMD && onAddProject && (
        <div className={cn("px-3 pb-3", !expanded && "flex justify-center px-0")}>
          {expanded ? (
            <button
              onClick={onAddProject}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-50/70 border border-indigo-200/50 px-4 py-3 text-xs font-bold text-indigo-700 transition duration-200 hover:bg-indigo-50 hover:border-indigo-300"
            >
              <Plus className="h-4 w-4" />
              Generate Lead
            </button>
          ) : (
            <button
              onClick={onAddProject}
              title="Generate Lead"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50/70 border border-indigo-200/50 text-indigo-700 transition duration-200 hover:bg-indigo-50 hover:border-indigo-300"
            >
              <Plus className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
      )}

      {/* ── Profile Block ── */}
      <div
        className={cn(
          "border-t border-slate-100 py-4.5",
          expanded ? "px-4.5 space-y-2.5" : "flex flex-col items-center gap-3.5 px-0"
        )}
      >
        {expanded ? (
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
            <Initials name={user.name} size="sm" accentClass={cn("bg-gradient-to-br", meta.gradient)} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
              <span
                className={cn(
                  "inline-flex items-center rounded-md px-1.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider mt-1 border",
                  meta.bg,
                  meta.colour,
                  meta.border || "border-transparent"
                )}
              >
                {roleLabel(user.role)}
              </span>
            </div>
          </div>
        ) : (
          <div title={`${user.name} (${roleLabel(user.role)})`} className="cursor-pointer">
            <Initials name={user.name} size="xs" accentClass={cn("bg-gradient-to-br", meta.gradient)} />
          </div>
        )}

        <button
          onClick={onSignOut}
          className={cn(
            "group flex items-center gap-2 rounded-xl text-xs font-bold text-slate-500 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600",
            expanded ? "w-full px-3.5 py-2.5" : "h-9 w-9 justify-center"
          )}
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="h-4 w-4 shrink-0 transition-colors group-hover:text-rose-600" />
          {expanded && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );
};

export const DashboardShell = ({
  children,
  title,
  hasUnread = false,
}: {
  children: ReactNode;
  title: string;
  hasUnread?: boolean;
}) => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  if (!user) return null;

  const items = navByRole[user.role] ?? [];
  const meta = roleMeta[user.role] ?? roleMeta.staff;

  const handleSignOut = () => {
    logout();
    nav("/login");
  };

  const sidebarW = sidebarExpanded ? "lg:w-64" : "lg:w-[76px]";

  return (
    <div style={{ display: "contents" }}>
      <AddProjectModal
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onSuccess={() => {}}
      />

      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
        {/* ── Desktop sidebar ── */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-slate-150 bg-white shadow-xs transition-all duration-300 ease-in-out lg:flex",
            sidebarW
          )}
        >
          <SidebarContent
            items={items}
            user={user}
            location={location}
            onSignOut={handleSignOut}
            onAddProject={() => setShowAddProjectModal(true)}
            expanded={sidebarExpanded}
            onToggleExpand={() => setSidebarExpanded((v) => !v)}
          />
        </aside>

        {/* ── Collapse panel switch overlay (minimalist) ── */}
        {!sidebarExpanded && (
          <button
            onClick={() => setSidebarExpanded(true)}
            aria-label="Expand sidebar"
            className="fixed left-[76px] top-1/2 z-30 hidden -translate-y-1/2 h-8 w-4.5 items-center justify-center rounded-r-lg border border-l-0 border-slate-200 bg-white text-slate-400 shadow-sm transition hover:bg-slate-50 hover:text-slate-600 lg:flex"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        )}

        {/* ── Mobile Drawer ── */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-all duration-300"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white shadow-2xl lg:hidden">
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 border border-transparent hover:border-slate-150"
                aria-label="Close menu"
              >
                <X className="h-4.5 w-4.5" />
              </button>
              <SidebarContent
                items={items}
                user={user}
                location={location}
                onSignOut={handleSignOut}
                onAddProject={() => setShowAddProjectModal(true)}
                expanded
                onToggleExpand={() => setMobileOpen(false)}
              />
            </aside>
          </>
        )}

        {/* ── Main content block ── */}
        <div
          className={cn(
            "min-w-0 transition-all duration-300 ease-in-out",
            sidebarExpanded ? "lg:pl-64" : "lg:pl-[76px]"
          )}
        >
          {/* Header */}
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="flex min-w-0 items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
              {/* Hamburger drawer trigger (mobile) */}
              <div className="flex min-w-0 flex-1 items-center gap-3.5">
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 lg:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-4.5 w-4.5" />
                </button>

                <div className="min-w-0 lg:hidden">
                  <BrandLogo compact />
                </div>

                {/* Page Title */}
                <div className="min-w-0">
                  <p className={cn("text-[9px] font-extrabold uppercase tracking-[0.25em]", meta.colour)}>
                    {roleLabel(user.role)}
                  </p>
                  <h1 className="truncate text-base font-black tracking-tight text-slate-800 sm:text-lg">
                    {title}
                  </h1>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex shrink-0 items-center gap-3">
                <button
                  aria-label="Notifications"
                  onClick={() => nav(`${location.pathname.split("/").slice(0, 3).join("/")}/workspace/notifications`)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                >
                  <Bell className="h-4.5 w-4.5" />
                  {hasUnread && (
                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                  )}
                </button>

                <div className="hidden h-5 w-px bg-slate-200 sm:block mx-1.5" />

                {/* Micro User stats */}
                <div className="flex items-center gap-2.5">
                  <Initials name={user.name} size="sm" accentClass={cn("bg-gradient-to-br", meta.gradient)} />
                  <div className="hidden flex-col sm:flex text-left">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {user.name.split(" ")[0]}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400">
                      <Sparkles className="h-2.5 w-2.5 text-indigo-500 shrink-0" />
                      Online
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile bottom nav strip (touch optimized) */}
            <nav
              className="scrollbar-none flex max-w-full gap-2 overflow-x-auto px-4 pb-3.5 pt-0.5 lg:hidden border-t border-slate-100/50"
              aria-label="Mobile navigation"
            >
              {items.map((it, i) => {
                const [path, hash] = it.to.split("#");
                const overviewBase = path.includes("/overview/")
                  ? path.slice(0, path.indexOf("/overview/") + "/overview".length)
                  : null;
                const isActive = hash
                  ? location.pathname === path && location.hash === `#${hash}`
                  : location.pathname === path || (overviewBase ? location.pathname.startsWith(overviewBase) : false);
                return (
                  <NavLink
                    key={`${it.label}-mobile-${i}`}
                    to={it.to}
                    end
                    aria-current={isActive ? "page" : undefined}
                    aria-label={it.label}
                    className={cn(
                      "inline-flex min-h-9 shrink-0 items-center gap-2 rounded-xl border px-4.5 py-2 text-xs font-bold transition-all duration-200",
                      isActive
                        ? "border-transparent bg-indigo-600 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <it.icon className="h-4 w-4" />
                    <span className="inline">{it.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </header>

          {/* Main Layout Workspace Content */}
          <main className="mx-auto min-w-0 max-w-[1600px] p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
