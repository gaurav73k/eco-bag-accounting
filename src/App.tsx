
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Index from "./pages/Index";
import DayBook from "./pages/DayBook";
import StockManagement from "./pages/StockManagement";
import Sales from "./pages/Sales";
import Purchases from "./pages/Purchases";
import Inventory from "./pages/Inventory";
import Ledger from "./pages/Ledger";
import Payroll from "./pages/Payroll";
import Expenses from "./pages/Expenses";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Invoicing from "./pages/Invoicing";
import AccountSettings from "./pages/AccountSettings";
import RoleManagement from "./components/RoleManagement";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Admin route component that requires specific permissions
const AdminRoute = ({ children, requiredPermission }: { children: React.ReactNode, requiredPermission: string }) => {
  const { isAuthenticated, hasPermission } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!hasPermission(requiredPermission as any)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Main app without auth context (needed to avoid context before router issue)
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/daybook" element={<ProtectedRoute><DayBook /></ProtectedRoute>} />
      <Route path="/stock" element={<ProtectedRoute><StockManagement /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
      <Route path="/invoicing" element={<ProtectedRoute><Invoicing /></ProtectedRoute>} />
      <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/inventory/product/:productId" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/ledger" element={<ProtectedRoute><Ledger /></ProtectedRoute>} />
      <Route path="/ledger/:entityType/:entityId" element={<ProtectedRoute><Ledger /></ProtectedRoute>} />
      <Route path="/ledger/:entityType/new-transaction/:entityId" element={<ProtectedRoute><Ledger /></ProtectedRoute>} />
      <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
      <Route path="/payroll/employee/:employeeId" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
      <Route path="/user-management" element={
        <AdminRoute requiredPermission="manage_users">
          <RoleManagement />
        </AdminRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Main App component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
