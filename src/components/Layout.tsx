
import React from 'react';
import { cn } from '@/lib/utils';
import Header from './Header';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      <main className={cn(
        "pt-16 pl-[240px] min-h-screen transition-all duration-300 ease-cubic-bezier",
        className
      )}>
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
