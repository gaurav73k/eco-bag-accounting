
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  FileText,
  ShoppingCart,
  ShoppingBag,
  BarChart4,
  Settings,
  BookOpen,
  CreditCard,
  Package,
  LayoutDashboard,
  Wallet,
  CalendarDays,
  PlusCircle,
  Cog,
  HelpCircle,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TooltipGuidance } from '@/components/ui/tooltip-guidance';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { X } from 'lucide-react';

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { state } = useSidebar();
  
  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard className="h-4 w-4" />,
      description: 'Overview of your business'
    },
    {
      name: 'Day Book',
      path: '/daybook',
      icon: <BookOpen className="h-4 w-4" />,
      description: 'Journal entries and transactions'
    },
    {
      name: 'CRM',
      path: '/sales',
      icon: <Users className="h-4 w-4" />,
      description: 'Customer relationship management'
    },
    {
      name: 'Workflow',
      path: '/daybook',
      icon: <List className="h-4 w-4" />,
      description: 'Manage work processes'
    },
    {
      name: 'Sales',
      path: '/sales',
      icon: <CreditCard className="h-4 w-4" />,
      description: 'Manage sales and revenue'
    },
    {
      name: 'Purchase',
      path: '/purchases',
      icon: <ShoppingCart className="h-4 w-4" />,
      description: 'Track and manage purchases'
    },
    {
      name: 'Accounting',
      path: '/ledger',
      icon: <FileText className="h-4 w-4" />,
      description: 'General ledger and accounts'
    },
    {
      name: 'Inventory',
      path: '/inventory',
      icon: <Package className="h-4 w-4" />,
      description: 'Manage stock and products'
    },
    {
      name: 'Reports',
      path: '/reporting',
      icon: <BarChart4 className="h-4 w-4" />,
      description: 'Financial reports and analysis'
    },
    {
      name: 'Configurations',
      path: '/settings',
      icon: <Cog className="h-4 w-4" />,
      description: 'Configure your account'
    },
  ];

  const backdropClasses = cn(
    "fixed inset-0 bg-black/50 z-30 transition-opacity",
    isMobile && isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
  );
  
  return (
    <>
      {/* Backdrop for mobile */}
      <div className={backdropClasses} onClick={onClose}></div>

      <Sidebar
        className={cn(
          "top-0 pt-16 z-40",
          isMobile ? (isOpen ? "left-0" : "-left-full") : "left-0"
        )}
      >
        <SidebarHeader className="p-4">
          <div className="flex justify-between items-center">
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
            
            <Button 
              variant="secondary"
              size="sm"
              className="w-full flex items-center gap-2"
              onClick={() => handleNavigate('/stock/new')}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create New</span>
            </Button>
          </div>
        </SidebarHeader>
  
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={
                        item.path === '/' 
                          ? location.pathname === '/' 
                          : location.pathname.startsWith(item.path)
                      }
                      onClick={() => handleNavigate(item.path)}
                      tooltip={item.description}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                      {!isMobile && state === "expanded" && (
                        <TooltipGuidance
                          content={item.description}
                          side="right"
                        >
                          <HelpCircle className="h-3 w-3 text-muted-foreground ml-auto" />
                        </TooltipGuidance>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="mt-auto px-3">
          <div className="text-xs text-muted-foreground py-2 text-center">
            © 2023 Om Ganapati Bag Udhyog
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default AppSidebar;
