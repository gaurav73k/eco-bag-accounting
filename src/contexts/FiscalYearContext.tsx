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
  
  const storedFiscalYear = localStorage.getItem('selectedFiscalYear');
  const [fiscalYear, setFiscalYearState] = useState(storedFiscalYear || currentFiscalYear);
  
  const [availableFiscalYears, setAvailableFiscalYears] = useState<string[]>(() => {
    const storedYears = localStorage.getItem('fiscalYears');
    return storedYears ? 
      JSON.parse(storedYears) : 
      [currentFiscalYear, (parseInt(currentFiscalYear.split('/')[0]) - 1) + '/' + (parseInt(currentFiscalYear.split('/')[1]) - 1)];
  });

  const setFiscalYear = (year: string) => {
    localStorage.setItem('selectedFiscalYear', year);
    setFiscalYearState(year);
    
    localStorage.setItem('hasSelectedFiscalYear', 'true');
  };
  
  const addFiscalYear = (year: string): boolean => {
    if (!year) return false;
    
    if (!year.match(/^\d{4}\/\d{2}$/)) {
      toast.error('Fiscal year must be in format YYYY/YY');
      return false;
    }
    
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
  
  const deleteFiscalYear = (year: string): boolean => {
    if (!year) return false;
    
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
