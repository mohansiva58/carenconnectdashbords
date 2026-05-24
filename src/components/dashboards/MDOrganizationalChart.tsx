import { useMemo } from "react";
import { ShieldCheck, MapPinned, Users, UserCheck } from "lucide-react";

const normalizeDashboardRole = (role?: string | null) => {
  const normalized = String(role || "").trim().toUpperCase();
  if (normalized === "SUPER_ADMIN" || normalized === "CEO") return "MD";
  if (normalized === "REGIONAL") return "REGIONAL_HEAD";
  if (normalized === "CLUSTER") return "CLUSTER_HEAD";
  if (normalized === "MANAGER" || normalized === "SUPERVISOR") return "COORDINATOR";
  if (normalized === "FIELD_STAFF" || normalized === "FIELD_OFFICER") return "STAFF";
  if (normalized === "USER") return "USER";
  return normalized || "STAFF";
};

export const MDOrganizationalChart = ({ staff }: { staff: any[] }) => {
  const counts = useMemo(() => {
    const stats: Record<string, number> = {
      MD: 0,
      ADMIN: 0,
      REGIONAL_HEAD: 0,
      CLUSTER_HEAD: 0,
      COORDINATOR: 0,
      STAFF: 0,
    };
    (staff || []).forEach((s) => {
      const r = normalizeDashboardRole(s.role);
      if (stats[r] !== undefined) stats[r]++;
    });
    return stats;
  }, [staff]);

  const tiers = [
    {
      id: "MD",
      label: "Managing Director",
      subtitle: "Executive Leadership",
      color: "bg-indigo-600",
      accent: "text-indigo-700 bg-indigo-50 border-indigo-200",
      ring: "ring-indigo-100/50 focus-within:ring-indigo-300",
      icon: ShieldCheck,
    },
    {
      id: "ADMIN",
      label: "Administrators",
      subtitle: "System & Policy Control",
      color: "bg-blue-600",
      accent: "text-blue-700 bg-blue-50 border-blue-200",
      ring: "ring-blue-100/50 focus-within:ring-blue-300",
      icon: ShieldCheck,
    },
    {
      id: "REGIONAL_HEAD",
      label: "Regional Heads",
      subtitle: "Territory Operations",
      color: "bg-teal-600",
      accent: "text-teal-700 bg-teal-50 border-teal-200",
      ring: "ring-teal-100/50 focus-within:ring-teal-300",
      icon: MapPinned,
    },
    {
      id: "CLUSTER_HEAD",
      label: "Cluster Heads",
      subtitle: "Zonal Orchestration",
      color: "bg-violet-600",
      accent: "text-violet-700 bg-violet-50 border-violet-200",
      ring: "ring-violet-100/50 focus-within:ring-violet-300",
      icon: Users,
    },
    {
      id: "COORDINATOR",
      label: "Coordinators",
      subtitle: "Field Coordination",
      color: "bg-amber-600",
      accent: "text-amber-700 bg-amber-50 border-amber-200",
      ring: "ring-amber-100/50 focus-within:ring-amber-300",
      icon: UserCheck,
    },
    {
      id: "STAFF",
      label: "Field Staff",
      subtitle: "Ground Operations",
      color: "bg-slate-600",
      accent: "text-slate-700 bg-slate-50 border-slate-200",
      ring: "ring-slate-100/50 focus-within:ring-slate-300",
      icon: Users,
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 h-72 w-72 rounded-full bg-indigo-500/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-72 w-72 rounded-full bg-teal-500/5 blur-3xl" />

      <div className="relative z-10 mb-8 text-center">
        <h3 className="text-xl font-extrabold tracking-tight text-slate-800">Organizational Hierarchy</h3>
        <p className="mt-1 text-xs text-slate-400 font-medium">Real-time resource and deployment flow</p>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Continuous Center Connector Line */}
        <div className="absolute top-8 bottom-8 left-1/2 w-0.5 -ml-[1px] rounded-full bg-gradient-to-b from-indigo-200 via-teal-200 to-slate-200 opacity-60" />

        <div className="flex w-full flex-col items-center gap-6">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const count = counts[tier.id] || 0;
            return (
              <div
                key={tier.id}
                className="group relative flex w-full max-w-sm items-center transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className={`relative flex w-full items-center justify-between overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-slate-100 ring-4 ${tier.ring} transition-all duration-300 hover:shadow-md`}>
                  {/* Hover background highlight */}
                  <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.02] ${tier.color}`} />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tier.color} text-white shadow-inner`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">{tier.label}</h4>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">{tier.subtitle}</p>
                    </div>
                  </div>
                  <div className={`relative z-10 flex h-9 min-w-[2.5rem] items-center justify-center rounded-xl border px-3 ${tier.accent}`}>
                    <span className="text-sm font-black tracking-tight">{count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
