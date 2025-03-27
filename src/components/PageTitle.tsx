
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageTitleProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  icon?: ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

const PageTitle: React.FC<PageTitleProps> = ({ 
  title, 
  description,
  children,
  className,
  icon,
  showBackButton,
  onBack
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={cn("mb-8 flex flex-col gap-1 md:flex-row md:items-center md:justify-between", className)}>
      <div className="flex items-center gap-2">
        {showBackButton && (
          <button 
            onClick={handleBack}
            className="p-1 rounded-full hover:bg-muted mr-1"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {icon && <div className="text-primary">{icon}</div>}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageTitle;
