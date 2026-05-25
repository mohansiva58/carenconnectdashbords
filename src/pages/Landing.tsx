import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  ClipboardList,
  HeartPulse,
  LockKeyhole,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";

const trustItems = ["JWT-secure access", "RBAC by role", "Live region filters", "Approval workflows"];

const Landing = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const liveTime = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now),
    [now],
  );

  const liveDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      }).format(now),
    [now],
  );

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.12),transparent_34%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(214_38%_96%)_100%)]">
      <header className="container relative z-20 flex items-center justify-between py-5">
        <BrandLogo compact />
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link to="/login">
            <Button variant="ghost" className="cursor-pointer">
              Sign in
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="cursor-pointer bg-gradient-brand shadow-brand transition-opacity hover:opacity-95">
              Get started
            </Button>
          </Link>
        </nav>
      </header>

      <main>
        <section className="container relative grid gap-10 pb-12 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(430px,0.85fr)] lg:pb-20 lg:pt-16">
          <div className="relative z-10 flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-white/85 px-3 py-1.5 text-xs font-semibold text-primary shadow-card backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
              </span>
              Live care operations command center
            </div>

            <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Run every care request, visit, approval, and field team from one{" "}
              <span className="bg-gradient-brand bg-clip-text text-transparent">real-time dashboard.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Care and Connect gives MDs, admins, coordinators, and staff a clear live view of service requests,
              attendance, complaints, and assignments without losing role-based control.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/signup">
                <Button size="lg" className="cursor-pointer bg-gradient-brand shadow-brand transition-opacity hover:opacity-95">
                  Start monitoring live <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="cursor-pointer border-primary/20 bg-white/80">
                  Open dashboard
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
              {trustItems.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full border border-border bg-white/75 px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="absolute -right-14 top-8 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
            <div className="absolute -bottom-14 left-10 h-44 w-44 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_80px_-28px_hsl(var(--primary)/0.45)] backdrop-blur sm:p-8">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-brand">
                <LockKeyhole className="h-9 w-9" />
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Secure access only</p>
                <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground">
                  Real dashboard data stays private.
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Public visitors see a simple product preview. Counts, locations, staff activity, and customer records
                  appear only after authorized sign in.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-muted/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Radio className="h-4 w-4 text-secondary" />
                    Preview refreshed
                  </span>
                  <span className="text-sm font-bold text-primary">{liveTime}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{liveDate}</p>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  { label: "Protected by login", icon: ShieldCheck },
                  { label: "Role-based dashboard access", icon: Users },
                  { label: "Live items visible after approval", icon: Clock3 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                    <span className="rounded-lg bg-secondary/10 p-2 text-secondary">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border/80 bg-white/70 py-6 backdrop-blur">
          <div className="container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Roles supported", value: "7", icon: ShieldCheck },
              { label: "Daily field updates", value: "Private", icon: CalendarCheck2 },
              { label: "Customer records", value: "Private", icon: Users },
              { label: "Operational uptime", value: "Secure", icon: BarChart3 },
            ].map((metric) => (
              <div key={metric.label} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
                <span className="rounded-xl bg-secondary/10 p-2.5 text-secondary">
                  <metric.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-2xl font-extrabold">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container grid gap-6 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-4 w-4" />
              Built for field clarity
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Real-time items that help teams act faster.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
              The home view introduces the dashboard experience without exposing live assignments, active staff,
              escalation alerts, or customer work before secure login.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "Role-wise visibility", text: "Every dashboard adapts for MD, admin, coordinator, and staff access.", icon: ShieldCheck },
              { title: "Attendance pulse", text: "See who is checked in and where field capacity is available.", icon: HeartPulse },
              { title: "Complaint tracking", text: "Spot unresolved issues before SLA windows become a problem.", icon: BellRing },
              { title: "Assignment flow", text: "Move requests from pending to assigned to completed with less back-and-forth.", icon: ClipboardList },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-card transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex rounded-xl bg-gradient-brand p-3 text-primary-foreground shadow-brand">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="container border-t border-border py-8 text-sm text-muted-foreground">
        (c) 2026 Care and Connect Services - Connect. Mobilize. Deliver.
      </footer>
    </div>
  );
};

export default Landing;
