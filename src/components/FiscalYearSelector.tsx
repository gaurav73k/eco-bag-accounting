
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useFiscalYear } from '@/contexts/FiscalYearContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Calendar, Plus, Trash2, X, Check, FileEdit, CalendarDays, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from 'date-fns';

const FiscalYearSelector = () => {
  const { 
    fiscalYear, 
    setFiscalYear, 
    formattedFiscalYear, 
    availableFiscalYears, 
    addFiscalYear, 
    deleteFiscalYear,
    fiscalYearData,
    loading,
    updateFiscalYearStatus,
    fiscalYearsData
  } = useFiscalYear();
  
  const { hasPermission } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [newFiscalYear, setNewFiscalYear] = useState('');
  const [localFiscalYear, setLocalFiscalYear] = useState(fiscalYear);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [yearToDelete, setYearToDelete] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [fiscalYearToEdit, setFiscalYearToEdit] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const canManageFiscalYear = hasPermission('manage_fiscal_year');
  
  useEffect(() => {
    const hasSelectedFiscalYear = localStorage.getItem('hasSelectedFiscalYear');
    if (!hasSelectedFiscalYear) {
      setIsOpen(true);
    }
  }, []);
  
  useEffect(() => {
    if (fiscalYear) {
      setLocalFiscalYear(fiscalYear);
    }
  }, [fiscalYear]);
  
  const handleSaveFiscalYear = () => {
    if (!localFiscalYear) {
      toast.error('Please select a fiscal year');
      return;
    }
    
    setFiscalYear(localFiscalYear);
    localStorage.setItem('hasSelectedFiscalYear', 'true');
    setIsOpen(false);
    toast.success(`Fiscal year set to ${localFiscalYear}`);
  };
  
  const handleAddNewYear = async () => {
    if (!newFiscalYear) {
      toast.error('Please enter a valid fiscal year');
      return;
    }
    
    setIsSaving(true);
    try {
      const success = await addFiscalYear(newFiscalYear);
      if (success) {
        setNewFiscalYear('');
        setIsAddDialogOpen(false);
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteYear = async () => {
    if (!yearToDelete) return;
    
    setIsSaving(true);
    try {
      const success = await deleteFiscalYear(yearToDelete);
      if (success) {
        setIsDeleteConfirmOpen(false);
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleEditYear = (yearData: any) => {
    setFiscalYearToEdit(yearData);
    setStartDate(yearData.start_date || '');
    setEndDate(yearData.end_date || '');
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateFiscalYear = async () => {
    if (!fiscalYearToEdit) return;
    
    if (!startDate || !endDate) {
      toast.error('Both start and end dates are required');
      return;
    }
    
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    if (startDateObj >= endDateObj) {
      toast.error('End date must be after start date');
      return;
    }
    
    setIsSaving(true);
    try {
      const success = await updateFiscalYearStatus(fiscalYearToEdit.id, {
        start_date: startDate,
        end_date: endDate
      });
      
      if (success) {
        setIsEditDialogOpen(false);
        toast.success('Fiscal year updated successfully');
      }
    } catch (error) {
      console.error('Error updating fiscal year:', error);
      toast.error('Failed to update fiscal year');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleToggleActiveFiscalYear = async (yearData: any) => {
    setIsSaving(true);
    try {
      const success = await updateFiscalYearStatus(yearData.id, {
        is_active: !yearData.is_active
      });
      
      if (success) {
        if (!yearData.is_active) {
          toast.success(`Fiscal year ${yearData.name} is now active`);
        } else {
          toast.success(`Fiscal year ${yearData.name} is now inactive`);
        }
      }
    } catch (error) {
      console.error('Error toggling fiscal year status:', error);
      toast.error('Failed to update fiscal year status');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Content for both Dialog and Drawer
  const FiscalYearContent = () => (
    <div className="py-4 space-y-4">
      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Label htmlFor="fiscal-year" className="text-right">
              Current Fiscal Year
            </Label>
            <Select
              value={localFiscalYear}
              onValueChange={setLocalFiscalYear}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select fiscal year" />
              </SelectTrigger>
              <SelectContent>
                {availableFiscalYears.length > 0 ? (
                  availableFiscalYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No fiscal years available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          {fiscalYearData && (
            <div className="p-3 bg-muted/30 rounded-md text-sm">
              <p><strong>Start Date:</strong> {formatDate(fiscalYearData.start_date)}</p>
              <p><strong>End Date:</strong> {formatDate(fiscalYearData.end_date)}</p>
              <p><strong>Status:</strong> {fiscalYearData.is_active ? 
                <span className="text-green-600 font-medium">Active</span> : 
                <span className="text-muted-foreground">Inactive</span>}
              </p>
            </div>
          )}
          
          {canManageFiscalYear && (
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Manage Fiscal Years</CardTitle>
                <CardDescription>Add, edit or remove fiscal years</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className={`${isMobile ? 'max-h-[40vh]' : 'max-h-80'} overflow-y-auto mb-2`}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fiscal Year</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fiscalYearsData?.length > 0 ? (
                        fiscalYearsData.map((yearData: any) => (
                          <TableRow key={yearData.id}>
                            <TableCell>{yearData.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <div 
                                  className={`h-2 w-2 rounded-full mr-2 ${yearData.is_active ? 'bg-green-500' : 'bg-gray-300'}`} 
                                />
                                {yearData.is_active ? 'Active' : 'Inactive'}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  title={yearData.is_active ? 'Deactivate' : 'Activate'}
                                  onClick={() => handleToggleActiveFiscalYear(yearData)}
                                  disabled={isSaving}
                                >
                                  {yearData.is_active ? 
                                    <X className="h-4 w-4 text-red-500" /> : 
                                    <Check className="h-4 w-4 text-green-500" />
                                  }
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  title="Edit fiscal year"
                                  onClick={() => handleEditYear(yearData)}
                                  disabled={isSaving}
                                >
                                  <FileEdit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setYearToDelete(yearData.name);
                                    setIsDeleteConfirmOpen(true);
                                  }}
                                  disabled={yearData.name === fiscalYear || yearData.is_active || isSaving}
                                  title={yearData.name === fiscalYear ? "Can't delete current fiscal year" : yearData.is_active ? "Can't delete active fiscal year" : "Delete fiscal year"}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                            No fiscal years found. Add one to get started.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => setIsAddDialogOpen(true)}
                  disabled={isSaving}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add New Fiscal Year
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
  
  // Selector button
  const SelectorButton = () => (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1"
      onClick={() => setIsOpen(true)}
    >
      <CalendarDays className="h-4 w-4" />
      <span className="hidden md:inline">Fiscal Year:</span>
      <span className="font-medium">{fiscalYear}</span>
    </Button>
  );

  return (
    <>
      <SelectorButton />
      
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={(open) => {
          if (!open && localStorage.getItem('hasSelectedFiscalYear')) {
            setIsOpen(false);
          }
        }}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Select Fiscal Year</DrawerTitle>
              <DrawerDescription>
                Choose a fiscal year to work with. All transactions will be recorded under this fiscal year.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              <FiscalYearContent />
            </div>
            <DrawerFooter>
              <Button 
                onClick={handleSaveFiscalYear} 
                disabled={loading || isSaving || availableFiscalYears.length === 0}
              >
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Save Changes
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={(open) => {
          if (!open && localStorage.getItem('hasSelectedFiscalYear')) {
            setIsOpen(false);
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Fiscal Year</DialogTitle>
              <DialogDescription>
                Choose a fiscal year to work with. All transactions will be recorded under this fiscal year.
              </DialogDescription>
            </DialogHeader>
            
            <FiscalYearContent />
            
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleSaveFiscalYear} 
                disabled={loading || isSaving || availableFiscalYears.length === 0}
              >
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add New Fiscal Year Dialog - keep this as dialog on both mobile and desktop */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[325px]">
          <DialogHeader>
            <DialogTitle>Add New Fiscal Year</DialogTitle>
            <DialogDescription>
              Enter the fiscal year in YYYY/YYYY format.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="new-fiscal-year">Fiscal Year</Label>
            <Input
              id="new-fiscal-year"
              placeholder="e.g. 2023/2024"
              value={newFiscalYear}
              onChange={(e) => setNewFiscalYear(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Example: 2023/2024 for fiscal year 2023/2024
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddNewYear} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Fiscal Year Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Fiscal Year</DialogTitle>
            <DialogDescription>
              Update the date range for fiscal year {fiscalYearToEdit?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Note: Changing these dates will affect which transactions are available in reports and dashboards.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleUpdateFiscalYear} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Fiscal Year</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete fiscal year {yearToDelete}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteYear} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FiscalYearSelector;
