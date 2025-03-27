
import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({ className, size = "md" }) => {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div className={cn("text-primary font-bold tracking-tight flex items-center", sizeClasses[size])}>
          <span className="bg-primary text-white px-2 py-1 rounded">Om</span>
          <span className="ml-1">Ganapati</span>
        </div>
        <div className="text-xs text-muted-foreground absolute -bottom-3 right-0">
          Bag Udhyog
        </div>
      </div>
    </div>
  );
};

export default Logo;
