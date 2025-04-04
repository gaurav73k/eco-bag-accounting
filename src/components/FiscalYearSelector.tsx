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
import { Calendar, Plus, Trash2, X, Check, FileEdit } from 'lucide-react';
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
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
    
    if (!newFiscalYear.match(/^\d{4}\/\d{4}$/)) {
      toast.error('Fiscal year must be in format YYYY/YYYY');
      return;
    }
    
    const success = await addFiscalYear(newFiscalYear);
    if (success) {
      setNewFiscalYear('');
      setIsAddDialogOpen(false);
    }
  };
  
  const handleDeleteYear = async () => {
    if (!yearToDelete) return;
    const success = await deleteFiscalYear(yearToDelete);
    if (success) {
      setIsDeleteConfirmOpen(false);
    }
  };
  
  const handleEditYear = (yearData: any) => {
    setFiscalYearToEdit(yearData);
    setStartDate(yearData.start_date);
    setEndDate(yearData.end_date);
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
    
    try {
      await updateFiscalYearStatus(fiscalYearToEdit.id, {
        start_date: startDate,
        end_date: endDate
      });
      
      setIsEditDialogOpen(false);
      toast.success('Fiscal year updated successfully');
    } catch (error) {
      console.error('Error updating fiscal year:', error);
      toast.error('Failed to update fiscal year');
    }
  };
  
  const handleToggleActiveFiscalYear = async (yearData: any) => {
    try {
      await updateFiscalYearStatus(yearData.id, {
        is_active: !yearData.is_active
      });
      
      if (!yearData.is_active) {
        toast.success(`Fiscal year ${yearData.name} is now active`);
      } else {
        toast.success(`Fiscal year ${yearData.name} is now inactive`);
      }
    } catch (error) {
      console.error('Error toggling fiscal year status:', error);
      toast.error('Failed to update fiscal year status');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => setIsOpen(true)}
      >
        <Calendar className="h-4 w-4" />
        <span className="hidden md:inline">Fiscal Year:</span>
        <span className="font-medium">{fiscalYear}</span>
      </Button>
      
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
          
          <div className="py-4 space-y-4">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
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
                      {availableFiscalYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
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
                      <div className="max-h-40 overflow-y-auto mb-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Fiscal Year</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right w-[100px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {availableFiscalYears.length > 0 ? (
                              fiscalYearsData?.map((yearData: any) => (
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
                                        disabled={yearData.name === fiscalYear || yearData.is_active}
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
          
          <DialogFooter>
            <Button type="submit" onClick={handleSaveFiscalYear} disabled={loading}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
              Example: 2023/2024 for Gregorian fiscal year 2023/2024
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddNewYear}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateFiscalYear}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Fiscal Year</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete fiscal year {yearToDelete}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteYear} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FiscalYearSelector;
