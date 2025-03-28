
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  CalendarDays, 
  ChevronRight, 
  ClipboardList, 
  Home, 
  LayoutDashboard, 
  Receipt, 
  ShoppingCart, 
  Users,
  Wallet,
  Settings,
  FileText,
  BookOpen,
  CreditCard,
  BarChart4,
  Package,
  Building
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: <LayoutDashboard className="h-5 w-5" />,
    description: 'Overview of your business'
  },
  {
    name: 'Day Book',
    path: '/daybook',
    icon: <BookOpen className="h-5 w-5" />,
    description: 'Journal entries and transactions'
  },
  {
    name: 'Sales',
    path: '/sales',
    icon: <Receipt className="h-5 w-5" />,
    description: 'Manage sales and revenue'
  },
  {
    name: 'Invoicing',
    path: '/invoicing',
    icon: <FileText className="h-5 w-5" />,
    description: 'Create and manage invoices'
  },
  {
    name: 'Purchases',
    path: '/purchases',
    icon: <ShoppingCart className="h-5 w-5" />,
    description: 'Track and manage purchases'
  },
  {
    name: 'Inventory',
    path: '/inventory',
    icon: <Package className="h-5 w-5" />,
    description: 'Manage stock and products'
  },
  {
    name: 'Ledger',
    path: '/ledger',
    icon: <Home className="h-5 w-5" />,
    description: 'General ledger and accounts'
  },
  {
    name: 'Payroll',
    path: '/payroll',
    icon: <Users className="h-5 w-5" />,
    description: 'Manage employee payroll'
  },
  {
    name: 'Expenses',
    path: '/expenses',
    icon: <Wallet className="h-5 w-5" />,
    description: 'Track business expenses'
  },
  {
    name: 'Stock',
    path: '/stock',
    icon: <ClipboardList className="h-5 w-5" />,
    description: 'Raw materials and finished goods'
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: <Settings className="h-5 w-5" />,
    description: 'Configure your account'
  },
];

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "fixed h-[calc(100vh-4rem)] top-16 left-0 bottom-0 border-r border-border/40 glass-effect transition-all duration-300 ease-cubic-bezier z-40",
        isCollapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="h-full flex flex-col py-4">
        <div className="px-4 mb-4 flex justify-end">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-full hover:bg-accent transition-colors"
          >
            <ChevronRight className={cn(
              "h-4 w-4 transition-transform duration-300",
              isCollapsed ? "rotate-180" : ""
            )} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-auto scrollbar-hide">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300 group relative",
                    location.pathname === item.path 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-secondary"
                  )}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="whitespace-nowrap overflow-hidden transition-all duration-300">
                      {item.name}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-auto px-3">
          {!isCollapsed && (
            <div className="text-xs text-muted-foreground py-2 text-center">
              © 2023 Om Ganapati Bag Udhyog
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Navigation;
