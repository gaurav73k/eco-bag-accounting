
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

  // Close sidebar on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarOpen]);

  // Close sidebar on route change
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Navigation isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className={cn(
        "pt-16 transition-all duration-300 ease-in-out min-h-screen",
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
