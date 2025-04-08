import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { FiscalYearProvider } from "./contexts/FiscalYearContext";
import { SettingsProvider } from "./contexts/SettingsContext";

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
import SiteSettings from "./pages/SiteSettings";
import ResetPassword from "./pages/ResetPassword";
import RoleManagement from "./components/RoleManagement";
import Reporting from "./pages/Reporting";
import CRM from "./pages/CRM";
import Workflow from "./pages/Workflow";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// Admin route component that requires specific permissions
const AdminRoute = ({ children, requiredPermission }: { children: React.ReactNode, requiredPermission: string }) => {
  const { isAuthenticated, hasPermission, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!hasPermission(requiredPermission as any)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// AuthWrapper component to handle auth redirects
const AuthWrapper = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }
  
  if (isAuthenticated && 
      (location.pathname === '/login' || location.pathname === '/reset-password')) {
    return <Navigate to="/" replace />;
  }
  
  return <AppRoutes />;
};

// Main App component
const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AuthProvider>
      <FiscalYearProvider>
        <SettingsProvider>
          <AuthWrapper />
        </SettingsProvider>
      </FiscalYearProvider>
    </AuthProvider>
  </TooltipProvider>
);

// Main app routes component
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/daybook" element={<ProtectedRoute><DayBook /></ProtectedRoute>} />
      <Route path="/stock" element={<ProtectedRoute><StockManagement /></ProtectedRoute>} />
      <Route path="/stock/new" element={<ProtectedRoute><StockManagement /></ProtectedRoute>} />
      <Route path="/stock/edit/:id" element={<ProtectedRoute><StockManagement /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
      <Route path="/invoicing" element={<ProtectedRoute><Invoicing /></ProtectedRoute>} />
      <Route path="/invoicing/new" element={<ProtectedRoute><Invoicing /></ProtectedRoute>} />
      <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
      <Route path="/purchases/new" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
      <Route path="/purchases/edit/:id" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/inventory/new" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/inventory/product/:productId" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/ledger" element={<ProtectedRoute><Ledger /></ProtectedRoute>} />
      <Route path="/ledger/new" element={<ProtectedRoute><Ledger /></ProtectedRoute>} />
      <Route path="/ledger/:entityType/:entityId" element={<ProtectedRoute><Ledger /></ProtectedRoute>} />
      <Route path="/ledger/:entityType/new-transaction/:entityId" element={<ProtectedRoute><Ledger /></ProtectedRoute>} />
      <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
      <Route path="/payroll/new" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
      <Route path="/payroll/employee/:employeeId" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
      <Route path="/expenses/new" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
      <Route path="/expenses/edit/:id" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
      <Route path="/reporting" element={<ProtectedRoute><Reporting /></ProtectedRoute>} />
      <Route path="/reporting/:reportType" element={<ProtectedRoute><Reporting /></ProtectedRoute>} />
      <Route path="/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
      <Route path="/crm/customer/:customerId" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
      <Route path="/workflow" element={<ProtectedRoute><Workflow /></ProtectedRoute>} />
      <Route path="/workflow/:workflowId" element={<ProtectedRoute><Workflow /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
      <Route path="/site-settings" element={
        <AdminRoute requiredPermission="manage_users">
          <SiteSettings />
        </AdminRoute>
      } />
      <Route path="/user-management" element={
        <AdminRoute requiredPermission="manage_users">
          <RoleManagement />
        </AdminRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
