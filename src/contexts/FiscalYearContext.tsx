
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getCurrentFiscalYear, getFiscalYearOptions, isValidBSDate, formatNepaliBS } from '@/utils/nepaliDateConverter';
import { toast } from 'sonner';

type FiscalYearContextType = {
  fiscalYear: string;
  setFiscalYear: (year: string) => void;
  isCurrentFiscalYear: boolean;
  availableFiscalYears: string[];
  addFiscalYear: (year: string) => boolean;
  deleteFiscalYear: (year: string) => boolean;
  formattedFiscalYear: string; // Added formatted version for display
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
  
  const storedFiscalYear = localStorage.getItem('selectedFiscalYear');
  const [fiscalYear, setFiscalYearState] = useState(storedFiscalYear || currentFiscalYear);
  
  const [availableFiscalYears, setAvailableFiscalYears] = useState<string[]>(() => {
    const storedYears = localStorage.getItem('fiscalYears');
    if (storedYears) {
      try {
        return JSON.parse(storedYears);
      } catch (e) {
        console.error('Error parsing stored fiscal years:', e);
        return [currentFiscalYear];
      }
    } else {
      // Default to current fiscal year and previous fiscal year in Nepali format
      const [currentYear] = currentFiscalYear.split('/').map(Number);
      return [
        currentFiscalYear,
        `${currentYear - 1}/${currentYear}`
      ];
    }
  });

  const setFiscalYear = (year: string) => {
    localStorage.setItem('selectedFiscalYear', year);
    setFiscalYearState(year);
    
    localStorage.setItem('hasSelectedFiscalYear', 'true');
  };
  
  const addFiscalYear = (year: string): boolean => {
    if (!year) return false;
    
    // Validate Nepali fiscal year format: YYYY/YYYY
    if (!year.match(/^\d{4}\/\d{4}$/)) {
      toast.error('Fiscal year must be in format YYYY/YYYY');
      return false;
    }
    
    // Ensure the second year is exactly one more than the first
    const [firstYear, secondYear] = year.split('/').map(Number);
    if (secondYear !== firstYear + 1) {
      toast.error('The second year must be exactly one year after the first');
      return false;
    }
    
    if (availableFiscalYears.includes(year)) {
      toast.error('This fiscal year already exists');
      return false;
    }
    
    const updatedYears = [...availableFiscalYears, year].sort((a, b) => {
      const [yearA] = a.split('/').map(Number);
      const [yearB] = b.split('/').map(Number);
      return yearB - yearA; // Sort in descending order (newest first)
    });
    
    setAvailableFiscalYears(updatedYears);
    localStorage.setItem('fiscalYears', JSON.stringify(updatedYears));
    toast.success(`Added fiscal year ${year} BS`);
    return true;
  };
  
  const deleteFiscalYear = (year: string): boolean => {
    if (!year) return false;
    
    if (year === fiscalYear) {
      toast.error('Cannot delete currently active fiscal year');
      return false;
    }
    
    const updatedYears = availableFiscalYears.filter(y => y !== year);
    setAvailableFiscalYears(updatedYears);
    localStorage.setItem('fiscalYears', JSON.stringify(updatedYears));
    toast.success(`Deleted fiscal year ${year} BS`);
    return true;
  };

  const isCurrentFiscalYear = fiscalYear === currentFiscalYear;
  
  // Format the fiscal year for display (add BS notation)
  const formattedFiscalYear = `${fiscalYear} BS`;
  
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
        deleteFiscalYear,
        formattedFiscalYear
      }}
    >
      {children}
    </FiscalYearContext.Provider>
  );
};

export default FiscalYearProvider;
