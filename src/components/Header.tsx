
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  BellRing,
  ChevronDown,
  HelpCircle,
  History,
  LogOut,
  Settings,
  UserCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TooltipGuidance } from '@/components/ui/tooltip-guidance';
import HistoryTracker from '@/components/HistoryTracker';

const Header: React.FC = () => {
  const { isMobile } = useIsMobile();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Mock notifications
  const notifications = [
    { id: 1, text: "New invoice received from supplier XYZ", time: "10 minutes ago" },
    { id: 2, text: "Stock level for 'Non-woven PP Fabric' is low", time: "2 hours ago" },
    { id: 3, text: "Monthly financial report is ready for review", time: "Yesterday" },
  ];

  return (
    <header className="flex items-center justify-between bg-background/95 backdrop-blur border-b border-border px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center">
        <Logo size={isMobile ? 'sm' : 'md'} />
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="relative"
          >
            <BellRing className="h-5 w-5" />
            <span className="absolute top-0 right-0 rounded-full bg-red-500 w-2 h-2"></span>
            <TooltipGuidance content="Notifications" side="bottom" />
          </Button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card border rounded-md shadow-md z-10">
              <div className="p-3 border-b">
                <h3 className="font-medium">Notifications</h3>
              </div>
              <div className="divide-y max-h-[300px] overflow-auto">
                {notifications.map(notification => (
                  <div key={notification.id} className="p-3 hover:bg-accent/50 cursor-pointer">
                    <p className="text-sm">{notification.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t text-center">
                <Button variant="link" size="sm" className="text-xs">
                  View all notifications
                </Button>
              </div>
            </div>
          )}
        </div>

        <HistoryTracker />

        <Button 
          variant="ghost" 
          size="icon"
          asChild
        >
          <Link to="/help">
            <HelpCircle className="h-5 w-5" />
            <TooltipGuidance content="Help & User Manual" side="bottom" />
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-x-2 max-w-[180px]">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/avatar.jpg" />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
              {!isMobile && (
                <>
                  <span className="text-sm font-medium truncate">Admin User</span>
                  <ChevronDown className="h-4 w-4 ml-auto" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="rounded-full bg-slate-500 text-white p-0.5">
                <UserCircle className="h-5 w-5" />
              </div>
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@example.com</p>
              </div>
            </div>
            <DropdownMenuItem asChild>
              <Link to="/account-settings">
                <Settings className="w-4 h-4 mr-2" />
                <span>Account Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
