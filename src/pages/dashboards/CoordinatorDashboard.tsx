import { RoleDashboard } from "@/components/RoleDashboard";
import type { Role } from "@/lib/roles";

const Coordinator = ({ role = "coordinator" }: { role?: Extract<Role, "coordinator" | "regional_head" | "cluster_head"> }) => (
  <RoleDashboard role={role} />
);
export default Coordinator;
