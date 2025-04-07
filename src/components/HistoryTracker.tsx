
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History, X } from 'lucide-react';
import { useHistory, HistoryEntry } from '@/hooks/use-history';
import { useAuth } from '@/contexts/AuthContext';

interface HistoryTrackerProps {
  entityId?: string;
  entityType?: string;
}

const HistoryTracker: React.FC<HistoryTrackerProps> = ({ entityId, entityType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);
  const { history } = useHistory();
  const { hasPermission } = useAuth();

  const canViewHistory = hasPermission('view_history');

  const filteredHistory = filterType 
    ? history.filter(entry => entry.entityType === filterType)
    : history;

  const sortedHistory = [...filteredHistory].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'restore': return 'bg-purple-100 text-purple-800';
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

  const entityTypes = Array.from(new Set(history.map(entry => entry.entityType)));

  if (!canViewHistory) {
    return null;
  }

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
