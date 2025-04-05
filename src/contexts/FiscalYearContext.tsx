
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

type FiscalYearContextType = {
  fiscalYear: string;
  setFiscalYear: (year: string) => void;
  isCurrentFiscalYear: boolean;
  availableFiscalYears: string[];
  fiscalYearsData: any[];
  addFiscalYear: (year: string) => Promise<boolean>;
  deleteFiscalYear: (year: string) => Promise<boolean>;
  updateFiscalYearStatus: (id: string, updates: any) => Promise<boolean>;
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

// Get current fiscal year
const getCurrentFiscalYear = (): string => {
  const now = new Date();
  // In most organizations, fiscal year starts in April (month index 3) or July (month index 6)
  // For this implementation, we'll use July as the fiscal year start
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
  console.log("Current fiscal year:", currentFiscalYear);
  
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
          console.log("Fetched fiscal years:", data);
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
          // If no fiscal years in the database, use local data only
          const defaultYears = [
            currentFiscalYear,
            `${parseInt(currentFiscalYear.split('/')[0]) - 1}/${parseInt(currentFiscalYear.split('/')[1]) - 1}`
          ];
          setAvailableFiscalYears(defaultYears);
          toast.info('No fiscal years found. Please create fiscal years using the Fiscal Year selector');
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
      const startDate = `${firstYear}-07-01`;  // July 1st 
      const endDate = `${secondYear}-06-30`;   // June 30th
      
      console.log("Creating fiscal year:", {
        name: year,
        start_date: startDate,
        end_date: endDate,
        is_active: false
      });
      
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
        
        // Check if this is an RLS policy error
        if (error.code === '42501') {
          toast.error('Permission denied: You may not have permission to create fiscal years');
        } else {
          toast.error('Failed to create fiscal year: ' + error.message);
        }
        return false;
      }
      
      console.log("Fiscal year created:", data);
      
      // Update local state
      setFiscalYearsData(prev => [data, ...prev]);
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
  
  const updateFiscalYearStatus = async (id: string, updates: any): Promise<boolean> => {
    try {
      console.log("Updating fiscal year:", id, updates);
      
      // If setting a fiscal year to active, first deactivate all others
      if (updates.is_active) {
        // Deactivate all fiscal years first
        const { error: batchError } = await supabase
          .from('fiscal_years')
          .update({ is_active: false })
          .neq('id', id);
          
        if (batchError) {
          console.error('Error deactivating other fiscal years:', batchError);
          
          // Check if this is an RLS policy error
          if (batchError.code === '42501') {
            toast.error('Permission denied: You do not have permission to update fiscal years');
          }
          return false;
        }
      }
      
      // Update the specific fiscal year
      const { data, error } = await supabase
        .from('fiscal_years')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating fiscal year:', error);
        
        // Check if this is an RLS policy error
        if (error.code === '42501') {
          toast.error('Permission denied: You do not have permission to update fiscal years');
        } else {
          toast.error('Failed to update fiscal year: ' + error.message);
        }
        return false;
      }
      
      console.log("Fiscal year updated:", data);
      
      // Refetch fiscal years to get updated data
      const { data: refreshedData, error: refreshError } = await supabase
        .from('fiscal_years')
        .select('*')
        .order('start_date', { ascending: false });
        
      if (refreshError) {
        console.error('Error refreshing fiscal years:', refreshError);
      } else if (refreshedData) {
        setFiscalYearsData(refreshedData);
        
        // Update local state for current fiscal year if it was updated
        const currentFY = refreshedData.find(fy => fy.id === fiscalYearId);
        if (currentFY) {
          setFiscalYearData(currentFY);
        }
      }
      
      return true;
    } catch (e) {
      console.error('Error updating fiscal year:', e);
      toast.error('Failed to update fiscal year');
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
      
      // Check if this is the active fiscal year
      if (fyData.is_active) {
        toast.error('Cannot delete an active fiscal year');
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
      
      console.log("Deleting fiscal year:", fyData.id);
      
      // Delete the fiscal year from Supabase
      const { error } = await supabase
        .from('fiscal_years')
        .delete()
        .eq('id', fyData.id);
      
      if (error) {
        console.error('Error deleting fiscal year:', error);
        
        // Check if this is an RLS policy error
        if (error.code === '42501') {
          toast.error('Permission denied: You do not have permission to delete fiscal years');
        } else {
          toast.error('Failed to delete fiscal year: ' + error.message);
        }
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
  
  // Format the fiscal year for display
  const formattedFiscalYear = fiscalYear;

  return (
    <FiscalYearContext.Provider 
      value={{ 
        fiscalYear, 
        setFiscalYear,
        isCurrentFiscalYear,
        availableFiscalYears,
        fiscalYearsData,
        addFiscalYear,
        deleteFiscalYear,
        updateFiscalYearStatus,
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
