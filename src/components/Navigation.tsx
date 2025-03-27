
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
  Wallet
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: 'Day Book',
    path: '/daybook',
    icon: <CalendarDays className="h-5 w-5" />,
  },
  {
    name: 'Sales',
    path: '/sales',
    icon: <Receipt className="h-5 w-5" />,
  },
  {
    name: 'Purchases',
    path: '/purchases',
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    name: 'Inventory',
    path: '/inventory',
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    name: 'Ledger',
    path: '/ledger',
    icon: <Home className="h-5 w-5" />,
  },
  {
    name: 'Payroll',
    path: '/payroll',
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: 'Expenses',
    path: '/expenses',
    icon: <Wallet className="h-5 w-5" />,
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
                    "flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300",
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
