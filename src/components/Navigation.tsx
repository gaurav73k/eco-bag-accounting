import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart3,
  CreditCard,
  FileText,
  Home,
  Settings,
  Users,
  X,
  BookOpen,
  Building,
  Landmark,
  Receipt,
  FileSpreadsheet,
  FileCog,
  FileBarChart,
  FileCheck,
  FileSearch,
  FileText2,
  FileWarning,
  FilePlus,
  FileQuestion,
  FileX,
  FileArchive,
  FileUp,
  FileDown,
  FileLock,
  FileKey,
  FileSignature,
  FileOutput,
  FileInput,
  FileStack,
  FileSymlink,
  FileTerminal,
  FileDigit,
  FileCode,
  FileJson,
  FileSearch2,
  FileWarning2,
  FileX2,
  FilePlus2,
  FileQuestion2,
  FileArchive2,
  FileUp2,
  FileDown2,
  FileLock2,
  FileKey2,
  FileSignature2,
  FileOutput2,
  FileInput2,
  FileStack2,
  FileSymlink2,
  FileTerminal2,
  FileDigit2,
  FileCode2,
  FileJson2,
} from 'lucide-react';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Navigation = ({ isOpen, onClose }: NavigationProps) => {
  const location = useLocation();
  const { hasPermission } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/',
      icon: Home,
      permission: null,
    },
    {
      title: 'Transactions',
      href: '/transactions',
      icon: CreditCard,
      permission: null,
    },
    {
      title: 'Accounts',
      href: '/accounts',
      icon: Landmark,
      permission: null,
    },
    {
      title: 'Reports',
      href: '/reports',
      icon: BarChart3,
      permission: null,
    },
    {
      title: 'Invoices',
      href: '/invoices',
      icon: Receipt,
      permission: null,
    },
    {
      title: 'Documents',
      href: '/documents',
      icon: FileText,
      permission: null,
    },
    {
      title: 'Users',
      href: '/users',
      icon: Users,
      permission: 'manage_users',
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      permission: null,
    },
    {
      title: 'Help',
      href: '/help',
      icon: BookOpen,
      permission: null,
    },
  ];

  const filteredItems = navigationItems.filter(
    (item) => item.permission === null || hasPermission(item.permission)
  );

  const NavigationContent = () => (
    <div className="flex flex-col h-full" data-sidebar>
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="font-semibold">Navigation</div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          <nav className="space-y-1">
            {filteredItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={isMobile ? onClose : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  location.pathname === item.href
                    ? 'bg-accent text-accent-foreground'
                    : 'transparent'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </ScrollArea>
      <div className="mt-auto p-4 text-xs text-muted-foreground border-t">
        <p>© {new Date().getFullYear()} NPL Accounts</p>
        <p>Version 1.0.0</p>
      </div>
    </div>
  );

  return isMobile ? (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 w-[240px]">
        <NavigationContent />
      </SheetContent>
    </Sheet>
  ) : (
    <aside className="fixed inset-y-0 left-0 z-20 hidden md:flex flex-col w-[240px] border-r bg-background pt-16">
      <NavigationContent />
    </aside>
  );
};

export default Navigation;
