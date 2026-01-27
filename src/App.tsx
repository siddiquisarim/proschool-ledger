import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardPage } from "@/pages/Dashboard";
import { StudentsPage } from "@/pages/Students";
import { StudentProfile } from "@/pages/StudentProfile";
import { AttendancePage } from "@/pages/Attendance";
import { VerificationPage } from "@/pages/Verification";
import { ReportsPage } from "@/pages/Reports";
import { SettingsPage } from "@/pages/Settings";
import { IDCardsPage } from "@/pages/IDCards";
import { TicketsPage } from "@/pages/Tickets";
import { HREmployeesPage } from "@/pages/HREmployees";
import { HRLeavePage } from "@/pages/HRLeave";
import { HROvertimePage } from "@/pages/HROvertime";
import { HRPayrollPage } from "@/pages/HRPayroll";
import Login from "@/pages/Login";
import UserManagement from "@/pages/UserManagement";
import ParentPortal from "@/pages/ParentPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirect parent users to parent portal
  if (currentUser.role === 'parent') {
    return <Navigate to="/parent" replace />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/students/:id" element={<StudentProfile />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/id-cards" element={<IDCardsPage />} />
        <Route path="/tickets" element={<TicketsPage />} />
        <Route path="/hr/employees" element={<HREmployeesPage />} />
        <Route path="/hr/leave" element={<HRLeavePage />} />
        <Route path="/hr/overtime" element={<HROvertimePage />} />
        <Route path="/hr/payroll" element={<HRPayrollPage />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

function ParentRoute() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== 'parent') {
    return <Navigate to="/" replace />;
  }

  return <ParentPortal />;
}

function AppRoutes() {
  const { currentUser } = useApp();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={currentUser ? (currentUser.role === 'parent' ? <Navigate to="/parent" replace /> : <Navigate to="/" replace />) : <Login />} 
      />
      <Route path="/parent" element={<ParentRoute />} />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
