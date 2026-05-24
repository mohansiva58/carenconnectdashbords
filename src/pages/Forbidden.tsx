import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";

const Forbidden = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-soft p-6 text-center">
    <div className="mb-6 rounded-2xl bg-destructive/10 p-5"><ShieldX className="h-10 w-10 text-destructive" /></div>
    <h1 className="font-display text-3xl font-extrabold">Access denied</h1>
    <p className="mt-2 max-w-md text-muted-foreground">
      Your role doesn't have permission to view this dashboard. RBAC is enforced on every route.
    </p>
    <Link to="/login" className="mt-6"><Button className="bg-gradient-brand shadow-brand">Back to sign in</Button></Link>
  </div>
);
export default Forbidden;
