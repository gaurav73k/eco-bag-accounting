
import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useHistory } from '@/hooks/use-history';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface EntryDialogProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  entityType: string;
  entityId?: string;
  entityName?: string;
  isCreate?: boolean;
  isEdit?: boolean;
  disabled?: boolean;
  saveLabel?: string;
  hideFooter?: boolean;
  showCloseButton?: boolean;
}

// Export as named export
export const EntryDialog: React.FC<EntryDialogProps> = ({
  title,
  description,
  isOpen,
  onClose,
  onSave,
  children,
  size = 'md',
  entityType,
  entityId = '',
  entityName = '',
  isCreate = false,
  isEdit = false,
  disabled = false,
  saveLabel = 'Save',
  hideFooter = false,
  showCloseButton = true,
}) => {
  const sizeClasses = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-xl',
    lg: 'sm:max-w-3xl',
    xl: 'sm:max-w-5xl',
  };

  const { addHistoryEntry } = useHistory();
  const { hasPermission } = useAuth();

  const handleSave = () => {
    if (onSave) {
      onSave();
      
      // Log action to history based on action type
      if (isCreate && entityName) {
        addHistoryEntry(
          'create', 
          entityType, 
          entityId || `new-${Date.now()}`, 
          entityName,
          `Created new ${entityType} entry`
        );
        toast.success(`Created ${entityName} successfully`);
      } else if (isEdit && entityName) {
        addHistoryEntry(
          'update', 
          entityType, 
          entityId, 
          entityName,
          `Updated ${entityType} entry details`
        );
        toast.success(`Updated ${entityName} successfully`);
      }
    }
  };
  
  const canCreate = hasPermission('create_entry');
  const canEdit = hasPermission('edit_entry');
  
  // Determine if user should be able to save based on permissions and dialog type
  const canSave = (isCreate && canCreate) || (isEdit && canEdit) || (!isCreate && !isEdit);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </div>
          {showCloseButton && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          )}
        </DialogHeader>
        
        <div className="py-4">
          {children}
        </div>
        
        {onSave && !hideFooter && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={disabled || !canSave}
            >
              {saveLabel}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EntryDialog;
