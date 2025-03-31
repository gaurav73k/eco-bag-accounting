
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Header from './Header';
import Navigation from './Navigation';
import UserManual from './UserManual';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Navigation isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className={cn(
        "pt-16 transition-all duration-300 ease-cubic-bezier min-h-screen",
        isMobile ? "pl-0" : "pl-[240px]",
        className
      )}>
        <div className="container mx-auto p-2 md:p-6">
          {children}
        </div>
      </main>
      <UserManual />
    </div>
  );
};

export default Layout;
