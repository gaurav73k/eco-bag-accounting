import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Building,
  HelpCircle,
  X
} from 'lucide-react';
import { TooltipGuidance } from '@/components/ui/tooltip-guidance';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';

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
    name: 'Reporting',
    path: '/reporting',
    icon: <BarChart4 className="h-5 w-5" />,
    description: 'Financial reports and analysis'
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

interface NavigationProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isMobile && onClose && isOpen) {
      // We want to keep the menu open if the user navigates on mobile
      // This was previously closing the menu on any route change
    }
  }, [location.pathname, isMobile, onClose, isOpen]);

  // Handle the sidebar display based on device and state
  const sidebarClasses = cn(
    "fixed h-[calc(100vh-4rem)] top-16 bottom-0 border-r border-border/40 transition-all duration-300 ease-in-out z-40 bg-background",
    isCollapsed && !isMobile ? "w-[70px]" : "w-[240px]",
    isMobile ? (isOpen ? "left-0" : "-left-full") : "left-0"
  );

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Add backdrop for mobile when sidebar is open
  const backdropClasses = cn(
    "fixed inset-0 bg-black/50 z-30 transition-opacity",
    isMobile && isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
  );

  return (
    <>
      {/* Backdrop for mobile */}
      <div className={backdropClasses} onClick={onClose}></div>
      
      <aside className={sidebarClasses}>
        <div className="h-full flex flex-col py-4">
          <div className="px-4 mb-4 flex justify-between items-center">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="md:hidden"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
            
            {!isMobile && (
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded-full hover:bg-accent transition-colors ml-auto"
                aria-label={isCollapsed ? "Expand menu" : "Collapse menu"}
              >
                <ChevronRight className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  isCollapsed ? "rotate-180" : ""
                )} />
              </button>
            )}
          </div>
          
          <nav className="flex-1 overflow-auto scrollbar-hide">
            <ul className="space-y-1 px-2">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300 group relative text-left",
                      location.pathname === item.path 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-secondary"
                    )}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {(!isCollapsed || isMobile) && (
                      <span className="whitespace-nowrap overflow-hidden transition-all duration-300">
                        {item.name}
                      </span>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && !isMobile && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                    )}
                    
                    {((!isCollapsed && !isMobile) || isMobile) && (
                      <TooltipGuidance
                        content={item.description}
                        side="right"
                      >
                        <HelpCircle className="h-3 w-3 text-muted-foreground ml-auto" />
                      </TooltipGuidance>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-auto px-3">
            {(!isCollapsed || isMobile) && (
              <div className="text-xs text-muted-foreground py-2 text-center">
                © 2023 Om Ganapati Bag Udhyog
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navigation;
