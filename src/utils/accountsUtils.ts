
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface Account {
  id: string;
  name: string;
  description: string | null;
  account_type: string;
  created_at?: string | null;
  updated_at?: string | null;
}

// Fetch all accounts
export const fetchAccounts = async (): Promise<Account[]> => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Error in fetchAccounts:', error);
    toast.error(`Failed to load accounts: ${error.message}`);
    return [];
  }
};

// Create a new account
export const createAccount = async (account: Omit<Account, 'id'>): Promise<Account | null> => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .insert([account])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating account:', error);
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Error in createAccount:', error);
    toast.error(`Failed to create account: ${error.message}`);
    return null;
  }
};

// Update an existing account
export const updateAccount = async (id: string, updates: Partial<Account>): Promise<Account | null> => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating account:', error);
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Error in updateAccount:', error);
    toast.error(`Failed to update account: ${error.message}`);
    return null;
  }
};

// Delete an account
export const deleteAccount = async (id: string): Promise<boolean> => {
  try {
    // First check if the account is used in any transactions
    const { data, error } = await supabase
      .from('transaction_entries')
      .select('count')
      .eq('account_id', id)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking transaction entries:', error);
      throw error;
    }
    
    if (data && data.count > 0) {
      toast.error('Cannot delete account that is used in transactions');
      return false;
    }
    
    const { error: deleteError } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);
      
    if (deleteError) {
      console.error('Error deleting account:', deleteError);
      throw deleteError;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error in deleteAccount:', error);
    toast.error(`Failed to delete account: ${error.message}`);
    return false;
  }
};

// Get account by ID
export const getAccountById = async (id: string): Promise<Account | null> => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching account:', error);
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Error in getAccountById:', error);
    return null;
  }
};
