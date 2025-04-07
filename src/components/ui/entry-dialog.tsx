
import React, { ReactNode, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';
import { useHistory } from '@/hooks/use-history';
import { useAuth } from '@/contexts/AuthContext';
import { useFiscalYear } from '@/contexts/FiscalYearContext';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

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
  loading?: boolean;
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
  loading = false,
}) => {
  const sizeClasses = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-xl',
    lg: 'sm:max-w-3xl',
    xl: 'sm:max-w-5xl',
  };

  const { addHistoryEntry } = useHistory();
  const { hasPermission } = useAuth();
  const { fiscalYear } = useFiscalYear();
  const isMobile = useIsMobile();

  // Display current fiscal year in the dialog
  useEffect(() => {
    if (isCreate && isOpen) {
      console.log(`Creating new entry in fiscal year: ${fiscalYear}`);
    }
  }, [isOpen, isCreate, fiscalYear]);

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
          `Created new ${entityType} entry in fiscal year ${fiscalYear}`
        );
        toast.success(`Created ${entityName} successfully`);
      } else if (isEdit && entityName) {
        addHistoryEntry(
          'update', 
          entityType, 
          entityId, 
          entityName,
          `Updated ${entityType} entry details in fiscal year ${fiscalYear}`
        );
        toast.success(`Updated ${entityName} successfully`);
      }
    }
  };
  
  const canCreate = hasPermission('create_entry');
  const canEdit = hasPermission('edit_entry');
  
  // Determine if user should be able to save based on permissions and dialog type
  const canSave = (isCreate && canCreate) || (isEdit && canEdit) || (!isCreate && !isEdit);

  // Dialog content for both mobile and desktop
  const DialogContent = (
    <>
      {children}
      
      {onSave && !hideFooter && (
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={disabled || !canSave || loading}
            variant="default"
            className="mb-2 sm:mb-0"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saveLabel}
          </Button>
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent>
          <DrawerHeader className="border-b border-border/40 pr-2">
            <div className="flex items-center justify-between">
              <div className="pr-8">
                <DrawerTitle>{title}</DrawerTitle>
                {description && (
                  <DrawerDescription>
                    {description}
                    {isCreate && <span className="ml-1 text-primary font-medium">({fiscalYear})</span>}
                  </DrawerDescription>
                )}
              </div>
              {showCloseButton && (
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 absolute right-4 top-4">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DrawerHeader>
          <div className="px-4 py-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 10rem)' }}>
            {DialogContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>
                {description}
                {isCreate && <span className="ml-1 text-primary font-medium">({fiscalYear})</span>}
              </DialogDescription>
            )}
          </div>
          {showCloseButton && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          )}
        </DialogHeader>
        
        <div className="py-4">
          {DialogContent}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EntryDialog;
