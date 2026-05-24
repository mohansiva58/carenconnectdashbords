import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { Protected } from "@/components/Protected";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/NotFound.tsx";
import SuperAdminDashboard from "./pages/dashboards/SuperAdminDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import CoordinatorDashboard from "./pages/dashboards/CoordinatorDashboard";
import StaffDashboard from "./pages/dashboards/StaffDashboard";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="/dashboard/super-admin" element={<Navigate to="/dashboard/md" replace />} />
            <Route path="/dashboard/md" element={<Protected allow={["md"]}><SuperAdminDashboard /></Protected>} />
            <Route path="/dashboard/admin" element={<Protected allow={["admin", "md"]}><AdminDashboard /></Protected>} />
            <Route path="/dashboard/coordinator" element={<Protected allow={["coordinator", "admin", "md"]}><CoordinatorDashboard /></Protected>} />
            <Route path="/dashboard/staff" element={<Protected allow={["staff", "coordinator", "admin", "md"]}><StaffDashboard /></Protected>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
