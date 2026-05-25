import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { ROLES, Role } from "@/lib/roles";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const Signup = () => {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "staff" as Role });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const r = await signup(form);
    setIsSubmitting(false);

    if (!r.ok) {
      toast.error(r.error ?? "Signup failed");
      return;
    }

    setDone(true);
  };

  if (done) {
    return (
      <AuthShell
        title="Request submitted"
        footer={
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        }
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-secondary/10 p-4">
            <CheckCircle2 className="h-8 w-8 text-secondary" />
          </div>
          <p className="text-muted-foreground">
            Your account for <span className="font-semibold text-foreground">{form.email}</span> is awaiting approval from an admin.
            You&apos;ll be able to sign in once it&apos;s approved.
          </p>
          <Button className="mt-6 w-full bg-gradient-brand shadow-brand" onClick={() => nav("/login")}>Go to sign in</Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Pick the role you&apos;d like - an admin will approve your request."
      footer={
        <>
          Already have one?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Full name</Label>
          <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={isSubmitting} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              disabled={isSubmitting}
              placeholder="+91xxxxxxxxxx"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label>Requested role</Label>
          <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Role })} disabled={isSubmitting}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  <span className="font-medium">{r.label}</span>
                  <span className="text-muted-foreground"> - {r.description}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full bg-gradient-brand shadow-brand hover:opacity-95" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit request"}
        </Button>
      </form>
    </AuthShell>
  );
};

export default Signup;
