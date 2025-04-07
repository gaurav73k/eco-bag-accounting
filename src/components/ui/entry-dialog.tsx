import React, { ReactNode, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import HistoryTracker from '@/components/HistoryTracker';
import { X, MoreVertical, History, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface DialogEntryProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showHistoryButton?: boolean;
  showSaveButton?: boolean;
  isSaving?: boolean;
  onSave?: () => void;
  entity?: any;
  entityType?: string;
  entityId?: string;
  returnPath?: string;
  historyEnabled?: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
  isCreate?: boolean;
  isEdit?: boolean;
  hideFooter?: boolean;
  entityName?: string;
}

export const DialogEntry: React.FC<DialogEntryProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children,
  size = 'md',
  showHistoryButton = false,
  showSaveButton = false,
  isSaving = false,
  onSave,
  entity,
  entityType,
  entityId,
  returnPath,
  historyEnabled = false,
  actions = [],
  isCreate = false,
  isEdit = false,
  hideFooter = false,
  entityName = '',
}) => {
  const sizeClasses = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-xl',
    lg: 'sm:max-w-3xl',
    xl: 'sm:max-w-5xl',
  };
  
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = React.useState(false);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showHistory) {
        e.stopPropagation();
        setShowHistory(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showHistory]);
  
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };
  
  const toggleHistory = () => {
    if (!entityId || !entityType) {
      toast.error('Entity ID or type not provided. History unavailable.');
      return;
    }
    
    setShowHistory(!showHistory);
  };
  
  const handleReturnToList = () => {
    if (returnPath) {
      navigate(returnPath);
    } else {
      onClose();
    }
  };
  
  const renderDialogContent = () => {
    if (showHistory && entityId && entityType) {
      return (
        <div className="relative h-full">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 z-10"
            onClick={() => setShowHistory(false)}
          >
            <X className="h-4 w-4 mr-1" />
            Close History
          </Button>
          <HistoryTracker entityId={entityId} entityType={entityType} />
        </div>
      );
    }
    
    return children;
  };

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent>
          <DrawerHeader className="flex flex-col space-y-0 border-b">
            <div className="flex items-center justify-between">
              <div className="pr-8 mb-0 pb-0">
                <DrawerTitle>{title}</DrawerTitle>
                {description && <DrawerDescription>{description}</DrawerDescription>}
              </div>
              <div className="flex items-center space-x-1">
                {showHistoryButton && historyEnabled && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleHistory}
                    className="h-8 w-8"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                )}
                
                {actions && actions.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions.map((action, index) => (
                        <DropdownMenuItem 
                          key={index} 
                          onClick={action.onClick}
                          disabled={action.disabled}
                        >
                          {action.icon && 
                            <span className="mr-2 h-4 w-4">
                              {action.icon}
                            </span>
                          }
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {showSaveButton && !hideFooter && (
              <div className="flex items-center justify-between mt-2 pt-2 border-t">
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={handleReturnToList}
                  disabled={isSaving}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSave}
                  size="sm"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            )}
          </DrawerHeader>
          <div className="px-4 py-4 overflow-y-auto h-[calc(100vh-12rem)]">
            {renderDialogContent()}
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
            {description && <DialogDescription>{description}</DialogDescription>}
          </div>
          <div className="flex items-center space-x-1">
            {showHistoryButton && historyEnabled && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleHistory}
                className="h-8 w-8"
              >
                <History className="h-4 w-4" />
              </Button>
            )}
            
            {actions && actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions.map((action, index) => (
                    <DropdownMenuItem 
                      key={index} 
                      onClick={action.onClick}
                      disabled={action.disabled}
                    >
                      {action.icon && 
                        <span className="mr-2 h-4 w-4">
                          {action.icon}
                        </span>
                      }
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        {showSaveButton && !hideFooter && (
          <div className="flex items-center justify-between pt-2 pb-4 border-b">
            <Button
              variant="outline" 
              size="sm"
              onClick={handleReturnToList}
              disabled={isSaving}
            >
              Back
            </Button>
            <Button 
              onClick={handleSave}
              size="sm"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        )}
        <div className="py-4">
          {renderDialogContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEntry;
