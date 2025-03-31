
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreHorizontal, RotateCcw, Eye, CheckSquare } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHistory } from '@/hooks/use-history';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  onView?: () => void;
  entityType: string;
  entityId: string;
  entityName: string;
  showDelete?: boolean;
  showRestore?: boolean;
  isDeleted?: boolean;
  isBulkMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
  onRestore,
  onView,
  entityType,
  entityId,
  entityName,
  showDelete = true,
  showRestore = false,
  isDeleted = false,
  isBulkMode = false,
  isSelected = false,
  onToggleSelect,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const { hasPermission } = useAuth();
  const { addHistoryEntry } = useHistory();

  const canEdit = hasPermission('edit_entry') && onEdit && !isDeleted;
  const canDelete = hasPermission('delete_entry') && onDelete && !isDeleted && showDelete;
  const canRestore = hasPermission('restore_entry') && onRestore && isDeleted && showRestore;
  const canBulkEdit = hasPermission('bulk_edit');
  const canBulkDelete = hasPermission('bulk_delete');

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      addHistoryEntry('delete', entityType, entityId, entityName, `Deleted ${entityType} record`);
      toast.success(`${entityName} has been deleted`);
    }
    setDeleteDialogOpen(false);
  };

  const handleRestore = () => {
    if (onRestore) {
      onRestore();
      addHistoryEntry('restore', entityType, entityId, entityName, `Restored ${entityType} record`);
      toast.success(`${entityName} has been restored`);
    }
    setRestoreDialogOpen(false);
  };

  // If in bulk mode and user has bulk permissions, show checkbox
  if (isBulkMode && (canBulkEdit || canBulkDelete)) {
    return (
      <div className="flex items-center">
        <Checkbox 
          checked={isSelected} 
          onCheckedChange={onToggleSelect}
          aria-label={`Select ${entityName}`}
        />
      </div>
    );
  }

  if (!canEdit && !canDelete && !canRestore && !onView) {
    return null;
  }

  return (
    <>
      <div className="flex items-center space-x-1">
        {onView && (
          <Button variant="ghost" size="icon" onClick={onView} className="h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>
        )}
        
        {canEdit && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onEdit} 
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        
        {(canDelete || canRestore) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canDelete && (
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600" 
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
              {canRestore && (
                <DropdownMenuItem onClick={() => setRestoreDialogOpen(true)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restore
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete "{entityName}". This action can be reversed by an admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore confirmation dialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to restore?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore "{entityName}" and make it active again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore}>
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Component for bulk actions
export const BulkActionButtons: React.FC<{
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkEdit?: () => void;
  onClearSelection: () => void;
}> = ({ selectedCount, onBulkDelete, onBulkEdit, onClearSelection }) => {
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const { hasPermission } = useAuth();

  const canBulkEdit = hasPermission('bulk_edit') && onBulkEdit;
  const canBulkDelete = hasPermission('bulk_delete') && onBulkDelete;

  if (selectedCount === 0 || (!canBulkEdit && !canBulkDelete)) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
        <span className="text-sm font-medium">{selectedCount} item{selectedCount !== 1 ? 's' : ''} selected</span>
        
        {canBulkEdit && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBulkEdit} 
            className="h-8"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Selected
          </Button>
        )}
        
        {canBulkDelete && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setBulkDeleteDialogOpen(true)}
            className="h-8 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearSelection} 
          className="h-8 ml-auto"
        >
          Clear
        </Button>
      </div>

      {/* Bulk Delete confirmation dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete {selectedCount} items?</AlertDialogTitle>
            <AlertDialogDescription>
              This action can be reversed by an admin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onBulkDelete();
                setBulkDeleteDialogOpen(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete {selectedCount} items
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
