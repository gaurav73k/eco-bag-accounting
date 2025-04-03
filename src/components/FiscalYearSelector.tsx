
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
import { Calendar, Plus, Trash2, X } from 'lucide-react';
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

const FiscalYearSelector = () => {
  const { fiscalYear, setFiscalYear, formattedFiscalYear } = useFiscalYear();
  const { hasPermission } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [newFiscalYear, setNewFiscalYear] = useState('');
  const [localFiscalYear, setLocalFiscalYear] = useState(fiscalYear);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [yearToDelete, setYearToDelete] = useState('');
  
  const { availableFiscalYears, addFiscalYear, deleteFiscalYear } = useFiscalYear();
  
  const canManageFiscalYear = hasPermission('manage_fiscal_year');
  
  // Check if fiscal year has been selected
  useEffect(() => {
    // If user has just logged in and no fiscal year is set, show the selector
    const hasSelectedFiscalYear = localStorage.getItem('hasSelectedFiscalYear');
    if (!hasSelectedFiscalYear) {
      setIsOpen(true);
    }
  }, []);
  
  const handleSaveFiscalYear = () => {
    setFiscalYear(localFiscalYear);
    localStorage.setItem('hasSelectedFiscalYear', 'true');
    setIsOpen(false);
    toast.success(`Fiscal year set to ${localFiscalYear}`);
  };
  
  const handleAddNewYear = () => {
    if (!newFiscalYear) {
      toast.error('Please enter a valid fiscal year');
      return;
    }
    
    // Basic validation for YYYY/YYYY format
    if (!newFiscalYear.match(/^\d{4}\/\d{4}$/)) {
      toast.error('Fiscal year must be in format YYYY/YYYY');
      return;
    }
    
    // Add the fiscal year
    if (addFiscalYear(newFiscalYear)) {
      setNewFiscalYear('');
      setIsAddDialogOpen(false);
    }
  };
  
  const handleDeleteYear = () => {
    if (!yearToDelete) return;
    deleteFiscalYear(yearToDelete);
    setIsDeleteConfirmOpen(false);
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
        // Only allow closing if the user has already selected a fiscal year
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
            
            {canManageFiscalYear && (
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Manage Fiscal Years</CardTitle>
                  <CardDescription>Add or remove fiscal years</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="max-h-40 overflow-y-auto mb-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fiscal Year</TableHead>
                          <TableHead className="text-right w-[80px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availableFiscalYears.map((year) => (
                          <TableRow key={year}>
                            <TableCell>{year}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  setYearToDelete(year);
                                  setIsDeleteConfirmOpen(true);
                                }}
                                disabled={year === fiscalYear}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
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
          </div>
          
          <DialogFooter>
            <Button type="submit" onClick={handleSaveFiscalYear}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add fiscal year dialog */}
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
      
      {/* Delete confirmation dialog */}
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
