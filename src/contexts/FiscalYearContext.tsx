
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

type FiscalYearContextType = {
  fiscalYear: string;
  setFiscalYear: (year: string) => void;
  isCurrentFiscalYear: boolean;
  availableFiscalYears: string[];
  addFiscalYear: (year: string) => Promise<boolean>;
  deleteFiscalYear: (year: string) => Promise<boolean>;
  formattedFiscalYear: string;
  fiscalYearId: string | null;
  fiscalYearData: any | null;
  loading: boolean;
};

const FiscalYearContext = createContext<FiscalYearContextType | undefined>(undefined);

export const useFiscalYear = () => {
  const context = useContext(FiscalYearContext);
  if (context === undefined) {
    throw new Error('useFiscalYear must be used within a FiscalYearProvider');
  }
  return context;
};

// Get current fiscal year in Gregorian format
const getCurrentFiscalYear = (): string => {
  const now = new Date();
  // In Nepal, fiscal year starts in July (month index 6)
  // If current month is July or later, fiscal year is current year/next year
  // Otherwise it's previous year/current year
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  if (currentMonth >= 6) { // July or later
    return `${currentYear}/${currentYear + 1}`;
  } else {
    return `${currentYear - 1}/${currentYear}`;
  }
};

export const FiscalYearProvider = ({ children }: { children: ReactNode }) => {
  const currentFiscalYear = getCurrentFiscalYear();
  console.log("Current Gregorian fiscal year:", currentFiscalYear);
  
  const storedFiscalYear = localStorage.getItem('selectedFiscalYear');
  const storedFiscalYearId = localStorage.getItem('selectedFiscalYearId');
  
  const [fiscalYear, setFiscalYearState] = useState(storedFiscalYear || currentFiscalYear);
  const [fiscalYearId, setFiscalYearId] = useState<string | null>(storedFiscalYearId || null);
  const [fiscalYearData, setFiscalYearData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [availableFiscalYears, setAvailableFiscalYears] = useState<string[]>([]);
  const [fiscalYearsData, setFiscalYearsData] = useState<any[]>([]);

  // Fetch fiscal years from Supabase
  useEffect(() => {
    const fetchFiscalYears = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('fiscal_years')
          .select('*')
          .order('start_date', { ascending: false });
        
        if (error) {
          console.error('Error fetching fiscal years:', error);
          toast.error('Failed to load fiscal years');
          return;
        }
        
        if (data && data.length > 0) {
          setFiscalYearsData(data);
          
          const years = data.map(fy => fy.name);
          setAvailableFiscalYears(years);
          
          // If no fiscal year is selected, select the first one
          if (!storedFiscalYear) {
            const defaultFY = data.find(fy => fy.is_active) || data[0];
            setFiscalYearState(defaultFY.name);
            setFiscalYearId(defaultFY.id);
            localStorage.setItem('selectedFiscalYear', defaultFY.name);
            localStorage.setItem('selectedFiscalYearId', defaultFY.id);
            setFiscalYearData(defaultFY);
          } else {
            // Find the fiscal year data for the selected fiscal year
            const fyData = data.find(fy => fy.name === fiscalYear);
            if (fyData) {
              setFiscalYearId(fyData.id);
              setFiscalYearData(fyData);
              localStorage.setItem('selectedFiscalYearId', fyData.id);
            }
          }
        } else {
          // If no fiscal years in the database, use local data
          const defaultYears = [
            currentFiscalYear,
            `${parseInt(currentFiscalYear.split('/')[0]) - 1}/${parseInt(currentFiscalYear.split('/')[1]) - 1}`
          ];
          setAvailableFiscalYears(defaultYears);
          
          // Create fiscal years in the database
          console.log("No fiscal years found in database, creating defaults");
          const startYear = parseInt(currentFiscalYear.split('/')[0]);
          const endYear = parseInt(currentFiscalYear.split('/')[1]);
          
          await addFiscalYear(`${startYear}/${endYear}`);
          await addFiscalYear(`${startYear-1}/${endYear-1}`);
        }
      } catch (e) {
        console.error('Error in fiscal year initialization:', e);
        toast.error('Failed to initialize fiscal years');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFiscalYears();
  }, []);

  const setFiscalYear = (year: string) => {
    // Find the fiscal year data for the selected year
    const fyData = fiscalYearsData.find(fy => fy.name === year);
    
    localStorage.setItem('selectedFiscalYear', year);
    setFiscalYearState(year);
    
    if (fyData) {
      setFiscalYearId(fyData.id);
      setFiscalYearData(fyData);
      localStorage.setItem('selectedFiscalYearId', fyData.id);
    } else {
      console.warn(`No fiscal year data found for ${year}`);
      setFiscalYearId(null);
      setFiscalYearData(null);
      localStorage.removeItem('selectedFiscalYearId');
    }
    
    localStorage.setItem('hasSelectedFiscalYear', 'true');
    toast.success(`Switched to fiscal year ${year}`);
  };
  
  const addFiscalYear = async (year: string): Promise<boolean> => {
    if (!year) return false;
    
    // Validate fiscal year format: YYYY/YYYY
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
    
    try {
      // Create fiscal year in Supabase
      const startDate = `${firstYear}-07-01`;
      const endDate = `${secondYear}-06-30`;
      
      const { data, error } = await supabase
        .from('fiscal_years')
        .insert({
          name: year,
          start_date: startDate,
          end_date: endDate,
          is_active: false
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating fiscal year:', error);
        toast.error('Failed to create fiscal year');
        return false;
      }
      
      // Update local state
      setFiscalYearsData(prev => [...prev, data]);
      setAvailableFiscalYears(prev => [...prev, year].sort((a, b) => {
        const [yearA] = a.split('/').map(Number);
        const [yearB] = b.split('/').map(Number);
        return yearB - yearA; // Sort in descending order (newest first)
      }));
      
      toast.success(`Added fiscal year ${year}`);
      return true;
    } catch (e) {
      console.error('Error adding fiscal year:', e);
      toast.error('Failed to add fiscal year');
      return false;
    }
  };
  
  const deleteFiscalYear = async (year: string): Promise<boolean> => {
    if (!year) return false;
    
    if (year === fiscalYear) {
      toast.error('Cannot delete currently active fiscal year');
      return false;
    }
    
    try {
      // Find the fiscal year ID
      const fyData = fiscalYearsData.find(fy => fy.name === year);
      if (!fyData) {
        toast.error('Fiscal year not found');
        return false;
      }
      
      // Check if there are any transactions using this fiscal year
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .select('count')
        .eq('fiscal_year_id', fyData.id)
        .single();
        
      if (transactionError) {
        console.error('Error checking transactions:', transactionError);
      } else if (transactionData && transactionData.count > 0) {
        toast.error('Cannot delete fiscal year with existing transactions');
        return false;
      }
      
      // Delete the fiscal year from Supabase
      const { error } = await supabase
        .from('fiscal_years')
        .delete()
        .eq('id', fyData.id);
      
      if (error) {
        console.error('Error deleting fiscal year:', error);
        toast.error('Failed to delete fiscal year');
        return false;
      }
      
      // Update local state
      setFiscalYearsData(prev => prev.filter(fy => fy.id !== fyData.id));
      setAvailableFiscalYears(prev => prev.filter(y => y !== year));
      
      toast.success(`Deleted fiscal year ${year}`);
      return true;
    } catch (e) {
      console.error('Error deleting fiscal year:', e);
      toast.error('Failed to delete fiscal year');
      return false;
    }
  };

  const isCurrentFiscalYear = fiscalYear === currentFiscalYear;
  
  // Format the fiscal year for display (no BS notation)
  const formattedFiscalYear = fiscalYear;

  return (
    <FiscalYearContext.Provider 
      value={{ 
        fiscalYear, 
        setFiscalYear,
        isCurrentFiscalYear,
        availableFiscalYears,
        addFiscalYear,
        deleteFiscalYear,
        formattedFiscalYear,
        fiscalYearId,
        fiscalYearData,
        loading
      }}
    >
      {children}
    </FiscalYearContext.Provider>
  );
};

export default FiscalYearProvider;
