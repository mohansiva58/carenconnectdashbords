import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { ROLES, Role, roleHome } from "@/lib/roles";
import { toast } from "sonner";

const Login = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("admin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loginRoles = ROLES.filter((r) => r.value !== "staff");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const r = await login(email, password, role);
    setIsSubmitting(false);

    if (!r.ok) {
      toast.error(r.error ?? "Login failed");
      return;
    }

    toast.success(`Welcome, ${r.user!.name}`);
    nav(roleHome[r.user!.role]);
  };

  return (
    <AuthShell
      title="Sign in to your dashboard"
      subtitle="Choose your role and enter your credentials."
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@cac.io"
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pwd">Password</Label>
          <Input
            id="pwd"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={role} onValueChange={(v) => setRole(v as Role)} disabled={isSubmitting}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {loginRoles.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full bg-gradient-brand shadow-brand hover:opacity-95" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
};

export default Login;
