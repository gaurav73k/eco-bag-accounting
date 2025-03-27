
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  maxStock: number;
  status: 'low' | 'medium' | 'good';
}

interface InventorySummaryCardProps {
  items: InventoryItem[];
  className?: string;
}

const InventorySummaryCard: React.FC<InventorySummaryCardProps> = ({ 
  items,
  className 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'good':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'low':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'good':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Inventory Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => {
            const stockPercentage = Math.round((item.stock / item.maxStock) * 100);
            
            return (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.name}</span>
                  <Badge className={getStatusColor(item.status)}>
                    {item.stock} units
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={stockPercentage} 
                    className="h-2" 
                    indicatorClassName={getProgressColor(item.status)}
                  />
                  <span className="text-xs text-muted-foreground w-10 text-right">
                    {stockPercentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventorySummaryCard;
