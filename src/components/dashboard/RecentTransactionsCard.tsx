
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

interface RecentTransactionsCardProps {
  transactions: Transaction[];
  className?: string;
}

const RecentTransactionsCard: React.FC<RecentTransactionsCardProps> = ({ 
  transactions,
  className 
}) => {
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
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsCard;
