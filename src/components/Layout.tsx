
import React, { useState, useEffect } from 'react';
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
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isSidebarOpen) {
        // Check if click is outside sidebar and not on menu button
        const sidebar = document.querySelector('aside');
        const menuButton = document.querySelector('button[aria-label="Toggle menu"]');
        
        if (sidebar && 
            !sidebar.contains(event.target as Node) && 
            menuButton && 
            !menuButton.contains(event.target as Node)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isSidebarOpen]);

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile, isSidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-background w-full">
      <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 relative overflow-hidden">
        <Navigation isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out min-h-screen pt-16",
          isMobile ? "w-full" : "ml-[240px]",
          className
        )}>
          <div className="container mx-auto p-2 md:p-6">
            {children}
          </div>
        </main>
      </div>
      <UserManual />
    </div>
  );
};

export default Layout;
