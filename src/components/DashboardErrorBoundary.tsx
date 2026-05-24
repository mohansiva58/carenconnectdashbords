import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type DashboardErrorBoundaryProps = {
  children: ReactNode;
};

type DashboardErrorBoundaryState = {
  error: Error | null;
};

export class DashboardErrorBoundary extends Component<DashboardErrorBoundaryProps, DashboardErrorBoundaryState> {
  state: DashboardErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): DashboardErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Dashboard render failed", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="m-4 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-900 shadow-sm sm:m-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold">Dashboard section failed to render</p>
            <p className="mt-1 text-sm text-rose-700">
              Some API data is missing or temporarily unavailable. The page is protected from crashing; try refreshing the dashboard.
            </p>
            <p className="mt-2 break-words rounded-lg bg-white/70 px-3 py-2 text-xs text-rose-700">
              {this.state.error.message}
            </p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => this.setState({ error: null })}
            >
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
