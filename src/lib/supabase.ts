
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';
import type { Permission } from '@/contexts/AuthContext';

// Re-export for convenience
export type { Session, User } from '@supabase/supabase-js';

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user;
};

// Create user role if it doesn't exist
export const ensureUserHasRole = async (userId: string, defaultRoleId: string = '1') => {
  try {
    // Check if user role exists
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);
    
    if (checkError) {
      console.error('Error checking user role:', checkError);
      return null;
    }
    
    // If user doesn't have a role, assign the default one
    if (!existingRole || existingRole.length === 0) {
      console.log(`User ${userId} has no role, assigning default role ${defaultRoleId}`);
      
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: defaultRoleId
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error assigning default role:', error);
        return null;
      }
      
      return data;
    }
    
    return existingRole[0];
  } catch (err) {
    console.error('Error in ensureUserHasRole:', err);
    return null;
  }
};

// User profile management
export const createUserProfile = async (userId: string, name: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        name: name
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Error in createUserProfile:', err);
    return null;
  }
};

// User management functions
export const resetUserPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
    
    return true;
  } catch (err) {
    console.error('Error in resetUserPassword:', err);
    throw err;
  }
};

export const updateUserRole = async (userId: string, roleId: string) => {
  try {
    // Check if user_role entry exists
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);
    
    if (checkError) {
      console.error('Error checking user role:', checkError);
      throw checkError;
    }
    
    let result;
    
    // If entry exists, update it; otherwise, insert new entry
    if (existingRole && existingRole.length > 0) {
      const { data, error } = await supabase
        .from('user_roles')
        .update({ role_id: roleId })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating user role:', error);
        throw error;
      }
      
      result = data;
    } else {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role_id: roleId })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating user role:', error);
        throw error;
      }
      
      result = data;
    }
    
    toast.success('User role updated');
    return result;
  } catch (err) {
    console.error('Error in updateUserRole:', err);
    toast.error('Failed to update user role');
    throw err;
  }
};

// Settings related functions
export const getAppSettings = async () => {
  try {
    // Cast the result since the app_settings table might not be in the generated types yet
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching app settings:', error);
      return null;
    }
    
    return data as unknown as AppSettings;
  } catch (err) {
    console.error('Error in getAppSettings:', err);
    return null;
  }
};

export const updateAppSettings = async (settings: Partial<AppSettings>) => {
  try {
    // Cast the result since the app_settings table might not be in the generated types yet
    const { data, error } = await supabase
      .from('app_settings')
      .upsert(settings)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating app settings:', error);
      throw error;
    }
    
    return data as unknown as AppSettings;
  } catch (err) {
    console.error('Error in updateAppSettings:', err);
    throw err;
  }
};

// File storage functions
export const uploadLogo = async (file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `logo.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('settings')
      .upload(fileName, file, { upsert: true });
    
    if (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
    
    const { data } = supabase.storage
      .from('settings')
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  } catch (err) {
    console.error('Error in uploadLogo:', err);
    throw err;
  }
};

export const uploadFavicon = async (file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `favicon.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('settings')
      .upload(fileName, file, { upsert: true });
    
    if (error) {
      console.error('Error uploading favicon:', error);
      throw error;
    }
    
    const { data } = supabase.storage
      .from('settings')
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  } catch (err) {
    console.error('Error in uploadFavicon:', err);
    throw err;
  }
};

// Type definitions for app settings
export type AppSettings = {
  id?: string;
  site_title: string;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  company_name: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  tax_number: string;
  updated_at?: string;
};

// Fiscal Year functions
export const getFiscalYears = async () => {
  try {
    const { data, error } = await supabase
      .from('fiscal_years')
      .select('*')
      .order('start_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching fiscal years:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error in getFiscalYears:', err);
    throw err;
  }
};

export const createFiscalYear = async (fiscalYear: any) => {
  try {
    const { data, error } = await supabase
      .from('fiscal_years')
      .insert(fiscalYear)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating fiscal year:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error in createFiscalYear:', err);
    throw err;
  }
};

export const updateFiscalYear = async (id: string, fiscalYear: any) => {
  try {
    const { data, error } = await supabase
      .from('fiscal_years')
      .update(fiscalYear)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating fiscal year:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error in updateFiscalYear:', err);
    throw err;
  }
};

// Get currently active fiscal year
export const getActiveFiscalYear = async () => {
  try {
    const { data, error } = await supabase
      .from('fiscal_years')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No active fiscal year found
        return null;
      }
      console.error('Error fetching active fiscal year:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error in getActiveFiscalYear:', err);
    return null;
  }
};

// Transactions
export const getTransactions = async (fiscalYearId?: string) => {
  try {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        entries:transaction_entries(
          *,
          account:accounts(*)
        )
      `)
      .order('date', { ascending: false });
    
    if (fiscalYearId) {
      query = query.eq('fiscal_year_id', fiscalYearId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error in getTransactions:', err);
    throw err;
  }
};

export const createTransaction = async (transaction: any, entries: any[]) => {
  try {
    // First, create the transaction
    const { data: transactionData, error: transactionError } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();
    
    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      throw transactionError;
    }
    
    if (!transactionData) {
      throw new Error('No transaction data returned after insert');
    }
    
    // Then, create the transaction entries
    const entriesWithTransactionId = entries.map(entry => ({
      ...entry,
      transaction_id: transactionData.id
    }));
    
    const { data: entriesData, error: entriesError } = await supabase
      .from('transaction_entries')
      .insert(entriesWithTransactionId)
      .select();
    
    if (entriesError) {
      console.error('Error creating transaction entries:', entriesError);
      throw entriesError;
    }
    
    return { transaction: transactionData, entries: entriesData };
  } catch (err) {
    console.error('Error in createTransaction:', err);
    throw err;
  }
};

// Accounts
export const getAccounts = async () => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error in getAccounts:', err);
    throw err;
  }
};

export const createAccount = async (account: any) => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .insert(account)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating account:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error in createAccount:', err);
    throw err;
  }
};

export { supabase };
