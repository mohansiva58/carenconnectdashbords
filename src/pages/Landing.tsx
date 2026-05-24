import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, BarChart3, Users, CheckCircle2 } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Nav */}
      <header className="container flex items-center justify-between py-6">
        <BrandLogo />
        <nav className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-gradient-brand shadow-brand hover:opacity-95">Get started</Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="container grid gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div className="flex flex-col justify-center">
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            Connect. Mobilize. Deliver.
          </span>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground lg:text-6xl">
            Role-based dashboards for{" "}
            <span className="bg-gradient-brand bg-clip-text text-transparent">care teams that move.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Care and Connect gives every role the right view — from Managing Director (MD) to Coordinator — with strict RBAC,
            real-time KPIs and approval workflows built in.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-brand shadow-brand hover:opacity-95">
                Create account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sign in
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["JWT-secure", "RBAC enforced", "Region filtering", "Approval workflows"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-secondary" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Hero card */}
        <div className="relative">
          <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">This week</p>
                <p className="font-display text-3xl font-bold">+18.4%</p>
              </div>
              <div className="rounded-full bg-gradient-brand p-3 shadow-brand">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { l: "Leads", v: "1,284", c: "bg-primary/10 text-primary" },
                { l: "Active", v: "842", c: "bg-secondary/10 text-secondary" },
                { l: "Pending", v: "24", c: "bg-accent/10 text-accent" },
              ].map((s) => (
                <div key={s.l} className={`rounded-xl p-3 ${s.c}`}>
                  <p className="text-xs">{s.l}</p>
                  <p className="font-display text-xl font-bold">{s.v}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 h-32 rounded-xl bg-gradient-to-tr from-primary/5 via-secondary/5 to-accent/10">
              <svg viewBox="0 0 300 120" className="h-full w-full">
                <path
                  d="M0,90 C40,70 70,30 110,40 C150,50 180,90 220,70 C250,55 280,30 300,20"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                />
                <path
                  d="M0,100 C40,95 70,80 110,75 C150,70 180,90 220,82 C250,75 280,60 300,55"
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="3"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { i: ShieldCheck, t: "Strict RBAC", d: "Each role sees only what it should — enforced end-to-end." },
          { i: Users, t: "7 roles", d: "MD, Admin, Regional Head, Cluster Head, Coordinator, Staff, Customer." },
          { i: BarChart3, t: "KPIs & charts", d: "Trends, distribution, comparisons — out of the box." },
        ].map((f) => (
          <div key={f.t} className="rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-brand">
            <div className="mb-4 inline-flex rounded-xl bg-gradient-brand p-3 shadow-brand">
              <f.i className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold">{f.t}</h3>
            <p className="mt-2 text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </section>

      <footer className="container border-t border-border py-8 text-sm text-muted-foreground">
        © 2026 Care and Connect Services · Connect. Mobilize. Deliver.
      </footer>
    </div>
  );
};

export default Landing;
