export type Role = "md" | "admin" | "regional_head" | "cluster_head" | "coordinator" | "staff";

export const ROLES: { value: Role; label: string; description: string }[] = [
  { value: "md", label: "Managing Director (MD)", description: "Full system control and executive oversight" },
  { value: "admin", label: "Admin", description: "Operational control across all regions" },
  { value: "regional_head", label: "Regional Head", description: "Regional-level operations and team oversight" },
  { value: "cluster_head", label: "Cluster Head", description: "Cluster-level coordination and monitoring" },
  { value: "coordinator", label: "Coordinator", description: "Team-level task management and field coordination" },
  { value: "staff", label: "Staff", description: "Field operations and service delivery" },
];

export const roleLabel = (r: Role) => ROLES.find((x) => x.value === r)?.label ?? r;

export const roleHome: Record<Role, string> = {
  md: "/dashboard/md",
  admin: "/dashboard/admin",
  regional_head: "/dashboard/regional-head",
  cluster_head: "/dashboard/cluster-head",
  coordinator: "/dashboard/coordinator",
  staff: "/dashboard/staff",
};
