
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getCurrentFiscalYear } from '@/utils/nepaliDateConverter';
import { toast } from 'sonner';

type FiscalYearContextType = {
  fiscalYear: string;
  setFiscalYear: (year: string) => void;
  isCurrentFiscalYear: boolean;
  availableFiscalYears: string[];
  addFiscalYear: (year: string) => boolean;
  deleteFiscalYear: (year: string) => boolean;
};

const FiscalYearContext = createContext<FiscalYearContextType | undefined>(undefined);

export const useFiscalYear = () => {
  const context = useContext(FiscalYearContext);
  if (context === undefined) {
    throw new Error('useFiscalYear must be used within a FiscalYearProvider');
  }
  return context;
};

export const FiscalYearProvider = ({ children }: { children: ReactNode }) => {
  const currentFiscalYear = getCurrentFiscalYear();
  
  // Get stored fiscal year or use the current one
  const storedFiscalYear = localStorage.getItem('selectedFiscalYear');
  const [fiscalYear, setFiscalYearState] = useState(storedFiscalYear || currentFiscalYear);
  
  // Get available fiscal years from local storage or set defaults
  const [availableFiscalYears, setAvailableFiscalYears] = useState<string[]>(() => {
    const storedYears = localStorage.getItem('fiscalYears');
    return storedYears ? 
      JSON.parse(storedYears) : 
      [currentFiscalYear, (parseInt(currentFiscalYear.split('/')[0]) - 1) + '/' + (parseInt(currentFiscalYear.split('/')[1]) - 1)];
  });

  // Update localStorage when fiscal year changes
  const setFiscalYear = (year: string) => {
    localStorage.setItem('selectedFiscalYear', year);
    setFiscalYearState(year);
    
    // Also mark that user has selected a fiscal year
    localStorage.setItem('hasSelectedFiscalYear', 'true');
  };
  
  // Add a new fiscal year
  const addFiscalYear = (year: string): boolean => {
    if (!year) return false;
    
    // Basic validation
    if (!year.match(/^\d{4}\/\d{2}$/)) {
      toast.error('Fiscal year must be in format YYYY/YY');
      return false;
    }
    
    // Check if already exists
    if (availableFiscalYears.includes(year)) {
      toast.error('This fiscal year already exists');
      return false;
    }
    
    const updatedYears = [...availableFiscalYears, year].sort();
    setAvailableFiscalYears(updatedYears);
    localStorage.setItem('fiscalYears', JSON.stringify(updatedYears));
    toast.success(`Added fiscal year ${year}`);
    return true;
  };
  
  // Delete a fiscal year
  const deleteFiscalYear = (year: string): boolean => {
    if (!year) return false;
    
    // Prevent deleting currently selected fiscal year
    if (year === fiscalYear) {
      toast.error('Cannot delete currently active fiscal year');
      return false;
    }
    
    const updatedYears = availableFiscalYears.filter(y => y !== year);
    setAvailableFiscalYears(updatedYears);
    localStorage.setItem('fiscalYears', JSON.stringify(updatedYears));
    toast.success(`Deleted fiscal year ${year}`);
    return true;
  };

  const isCurrentFiscalYear = fiscalYear === currentFiscalYear;
  
  // Save available fiscal years to localStorage if they change
  useEffect(() => {
    localStorage.setItem('fiscalYears', JSON.stringify(availableFiscalYears));
  }, [availableFiscalYears]);

  return (
    <FiscalYearContext.Provider 
      value={{ 
        fiscalYear, 
        setFiscalYear,
        isCurrentFiscalYear,
        availableFiscalYears,
        addFiscalYear,
        deleteFiscalYear
      }}
    >
      {children}
    </FiscalYearContext.Provider>
  );
};

export default FiscalYearProvider;
