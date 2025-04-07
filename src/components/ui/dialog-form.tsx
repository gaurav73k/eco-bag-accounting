
import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogContent as RadixDialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DialogFormProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

// Export as named export
export const DialogForm: React.FC<DialogFormProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  const sizeClasses = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-xl',
    lg: 'sm:max-w-3xl',
    xl: 'sm:max-w-5xl',
  };
  
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent>
          <DrawerHeader className="border-b border-border/40 pr-2">
            <div className="flex items-center justify-between">
              <div className="pr-8">
                <DrawerTitle>{title}</DrawerTitle>
                {description && <DrawerDescription>{description}</DrawerDescription>}
              </div>
              {showCloseButton && (
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 absolute right-4 top-4">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DrawerHeader>
          <div className="px-4 py-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 10rem)' }}>
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <RadixDialogContent className={`${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
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
      </RadixDialogContent>
    </Dialog>
  );
};

// Also maintain the default export for backward compatibility
export default DialogForm;
