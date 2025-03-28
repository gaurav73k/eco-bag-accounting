
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History, X } from 'lucide-react';

interface HistoryEntry {
  id: string;
  action: 'create' | 'update' | 'delete';
  entityType: string;
  entityId: string;
  entityName: string;
  timestamp: Date;
  user: string;
  details?: string;
}

// Mock history data - in a real app this would come from a database
const mockHistoryData: HistoryEntry[] = [
  {
    id: '1',
    action: 'create',
    entityType: 'inventory',
    entityId: 'RM-001',
    entityName: 'Non-woven PP Fabric (White)',
    timestamp: new Date(2023, 9, 15, 9, 30),
    user: 'Admin User',
    details: 'Added initial stock of 250 kg'
  },
  {
    id: '2',
    action: 'update',
    entityType: 'inventory',
    entityId: 'RM-002',
    entityName: 'Non-woven PP Fabric (Green)',
    timestamp: new Date(2023, 9, 16, 11, 45),
    user: 'John Smith',
    details: 'Updated stock from 100 to 50 kg'
  },
  {
    id: '3',
    action: 'create',
    entityType: 'purchase',
    entityId: 'PO-2023-001',
    entityName: 'Purchase Order - Supplier XYZ',
    timestamp: new Date(2023, 9, 17, 14, 20),
    user: 'Admin User',
    details: 'Created purchase order for ₹15,000'
  },
  {
    id: '4',
    action: 'delete',
    entityType: 'expense',
    entityId: 'EXP-2023-005',
    entityName: 'Office Supplies',
    timestamp: new Date(2023, 9, 18, 16, 10),
    user: 'Sarah Jones',
    details: 'Removed duplicate expense entry'
  },
  {
    id: '5',
    action: 'create',
    entityType: 'ledger',
    entityId: 'LED-2023-042',
    entityName: 'Payment Receipt - Customer ABC',
    timestamp: new Date(2023, 9, 19, 10, 25),
    user: 'John Smith',
    details: 'Recorded payment of ₹25,000'
  },
  {
    id: '6',
    action: 'update',
    entityType: 'employee',
    entityId: 'EMP-012',
    entityName: 'Michael Lee',
    timestamp: new Date(2023, 9, 20, 11, 30),
    user: 'Admin User',
    details: 'Updated salary information'
  },
  {
    id: '7',
    action: 'create',
    entityType: 'inventory',
    entityId: 'FG-003',
    entityName: 'W-Cut Bags (Large)',
    timestamp: new Date(2023, 9, 21, 9, 15),
    user: 'Sarah Jones',
    details: 'Added 500 pcs to inventory'
  },
  {
    id: '8',
    action: 'update',
    entityType: 'purchase',
    entityId: 'PO-2023-002',
    entityName: 'Purchase Order - Supplier ABC',
    timestamp: new Date(2023, 9, 22, 14, 45),
    user: 'John Smith',
    details: 'Updated delivery date'
  }
];

const HistoryTracker: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredHistory = filterType 
    ? mockHistoryData.filter(entry => entry.entityType === filterType)
    : mockHistoryData;

  const sortedHistory = [...filteredHistory].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const entityTypes = Array.from(new Set(mockHistoryData.map(entry => entry.entityType)));

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="gap-1"
      >
        <History className="h-4 w-4" />
        History
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>System History Log</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex gap-2 mb-4 flex-wrap">
            <Button 
              variant={filterType === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilterType(null)}
            >
              All
            </Button>
            {entityTypes.map(type => (
              <Button 
                key={type}
                variant={filterType === type ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilterType(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(entry.timestamp)}
                    </TableCell>
                    <TableCell>{entry.user}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getActionColor(entry.action)}`}>
                        {entry.action}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{entry.entityName}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="capitalize">{entry.entityType}</span> · {entry.entityId}
                      </div>
                    </TableCell>
                    <TableCell>{entry.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HistoryTracker;
