
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description,
  icon: Icon,
  trend,
  trendValue,
  className 
}) => {
  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
            {trend && trendValue && (
              <div className="flex items-center mt-2">
                <span className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded",
                  trend === 'up' ? "bg-green-100 text-green-800" : 
                  trend === 'down' ? "bg-red-100 text-red-800" : 
                  "bg-gray-100 text-gray-800"
                )}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className="p-2 rounded-full bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
