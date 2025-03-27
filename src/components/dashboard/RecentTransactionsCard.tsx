
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  entityId?: string;
  entityType?: 'customer' | 'supplier' | 'employee' | 'inventory';
}

interface RecentTransactionsCardProps {
  transactions: Transaction[];
  className?: string;
  showViewButtons?: boolean;
  onEdit?: (transaction: Transaction) => void;
  onView?: (transaction: Transaction) => void;
}

const RecentTransactionsCard: React.FC<RecentTransactionsCardProps> = ({ 
  transactions,
  className,
  showViewButtons = false,
  onEdit,
  onView
}) => {
  const navigate = useNavigate();

  const handleView = (transaction: Transaction) => {
    if (onView) {
      onView(transaction);
    } else if (transaction.entityType && transaction.entityId) {
      // Navigate to the appropriate detail page based on entity type
      switch (transaction.entityType) {
        case 'customer':
        case 'supplier':
          navigate(`/ledger/${transaction.entityType}/${transaction.entityId}`);
          break;
        case 'inventory':
          navigate(`/inventory/product/${transaction.entityId}`);
          break;
        case 'employee':
          navigate(`/payroll/employee/${transaction.entityId}`);
          break;
      }
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between py-2 border-b border-border/60 last:border-0"
            >
              <div className="flex flex-col">
                <span className="font-medium">{transaction.description}</span>
                <span className="text-sm text-muted-foreground">{transaction.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className={cn(
                    "font-semibold",
                    transaction.type === 'income' ? "text-green-600" : "text-red-600"
                  )}
                >
                  {transaction.type === 'income' ? '+' : '-'} Rs. {transaction.amount.toLocaleString()}
                </span>
                <Badge variant={transaction.type === 'income' ? "default" : "destructive"}>
                  {transaction.type === 'income' ? 'Income' : 'Expense'}
                </Badge>
                
                {showViewButtons && (
                  <div className="flex gap-1 ml-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleView(transaction)}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {onEdit && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit(transaction)} 
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsCard;
