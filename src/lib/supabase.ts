
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Determine if we're using environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock client if real credentials aren't available
const createMockClient = () => {
  console.warn('No Supabase credentials found. Using mock client.');
  
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => {
        toast.error('Authentication is not configured. Please set up Supabase credentials.');
        return { data: null, error: { message: 'Authentication not configured' } };
      },
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      resetPasswordForEmail: async () => {
        toast.error('Password reset is not configured. Please set up Supabase credentials.');
        return { error: { message: 'Not configured' } };
      }
    },
    from: () => ({
      select: () => ({
        single: async () => ({ data: null, error: null }),
        eq: () => ({
          select: () => ({
            single: async () => ({ data: null, error: null })
          })
        })
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: null, error: null })
          })
        })
      }),
      upsert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null })
        })
      })
    }),
    storage: {
      from: () => ({
        upload: async () => {
          toast.error('File upload is not configured. Please set up Supabase credentials.');
          return { error: { message: 'Not configured' } };
        },
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  };
};

// Create a single supabase client for interacting with your database
// Use mock client if credentials aren't available
export const supabase = supabaseUrl && supabaseAnonKey
  ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
  : createMockClient() as ReturnType<typeof createSupabaseClient>;

// Re-export for convenience
export type { Session, User } from '@supabase/supabase-js';

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user;
};

// Settings related functions
export const getAppSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching app settings:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Error in getAppSettings:', err);
    return null;
  }
};

export const updateAppSettings = async (settings: any) => {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .upsert(settings)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating app settings:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error in updateAppSettings:', err);
    throw err;
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
    const { data, error } = await supabase
      .from('users')
      .update({ role_id: roleId })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('Error in updateUserRole:', err);
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
