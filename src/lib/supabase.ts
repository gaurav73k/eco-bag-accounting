
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// You'll get these values from your Supabase dashboard after connecting
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Re-export for convenience
export type { Session, User } from '@supabase/supabase-js';

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user;
};

// Settings related functions
export const getAppSettings = async () => {
  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching app settings:', error);
    return null;
  }
  
  return data;
};

export const updateAppSettings = async (settings: any) => {
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
};

// User management functions
export const resetUserPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
  
  return true;
};

export const updateUserRole = async (userId: string, roleId: string) => {
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
};

// File storage functions
export const uploadLogo = async (file: File) => {
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
};

export const uploadFavicon = async (file: File) => {
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
