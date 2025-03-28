
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface TooltipGuidanceProps {
  content: string | React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  children?: React.ReactNode;
}

export const TooltipGuidance = ({ content, side = 'top', children }: TooltipGuidanceProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center cursor-help ml-1">
            {children || <HelpCircle className="h-4 w-4 text-muted-foreground" />}
          </span>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-[300px] text-sm">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipGuidance;
