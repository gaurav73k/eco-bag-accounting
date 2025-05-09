
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Check if essential database tables exist and have data
 */
export const checkEssentialTables = async () => {
  try {
    // Check roles table
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('count')
      .limit(1);
      
    if (rolesError) {
      console.error('Error checking roles table:', rolesError);
      return false;
    }
    
    // Check if there's at least one role
    if (!roles || roles.length === 0) {
      console.warn('No roles found in the database');
      return false;
    }
    
    // Check fiscal years table
    const { data: fiscalYears, error: fiscalYearsError } = await supabase
      .from('fiscal_years')
      .select('count')
      .limit(1);
      
    if (fiscalYearsError) {
      console.error('Error checking fiscal years table:', fiscalYearsError);
      return false;
    }
    
    // Check if there's at least one fiscal year
    if (!fiscalYears || fiscalYears.length === 0) {
      console.warn('No fiscal years found in the database');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking essential tables:', error);
    return false;
  }
};

/**
 * Setup default role for a user if they don't have one
 */
export const ensureUserRole = async (userId: string) => {
  try {
    // Check if user has a role
    const { data: userRoles, error: userRolesError } = await supabase
      .from('user_roles')
      .select('role_id')
      .eq('user_id', userId);
      
    if (userRolesError) {
      console.error('Error checking user roles:', userRolesError);
      return false;
    }
    
    // If user doesn't have a role, assign the default one (assuming role ID 1 is for admin/default)
    if (!userRoles || userRoles.length === 0) {
      // Get the ID of a role to assign (prefer 'Admin' or similar)
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .limit(1);
        
      if (roleError || !roleData || roleData.length === 0) {
        console.error('Error getting default role:', roleError);
        return false;
      }
      
      const defaultRoleId = roleData[0].id;
      
      // Assign role to user
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role_id: defaultRoleId });
        
      if (insertError) {
        console.error('Error assigning default role to user:', insertError);
        return false;
      }
      
      console.log(`Assigned default role ${defaultRoleId} to user ${userId}`);
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring user role:', error);
    return false;
  }
};

/**
 * Get current fiscal year
 */
const getCurrentFiscalYear = (): { name: string, startDate: string, endDate: string } => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  let fiscalYear: string;
  let startYear: number;
  let endYear: number;
  
  // Standard fiscal year starting in July (month index 6)
  if (currentMonth >= 6) { // July or later
    fiscalYear = `${currentYear}/${currentYear + 1}`;
    startYear = currentYear;
    endYear = currentYear + 1;
  } else {
    fiscalYear = `${currentYear - 1}/${currentYear}`;
    startYear = currentYear - 1;
    endYear = currentYear;
  }
  
  // Format dates in ISO format
  const startDate = `${startYear}-07-01`; // July 1st
  const endDate = `${endYear}-06-30`;    // June 30th
  
  return { name: fiscalYear, startDate, endDate };
};

/**
 * Ensure fiscal years exist in the database
 */
export const setupFiscalYears = async () => {
  try {
    // Check if fiscal years table has data
    const { data: fiscalYears, error: fiscalYearsError } = await supabase
      .from('fiscal_years')
      .select('*');
      
    if (fiscalYearsError) {
      console.error('Error checking fiscal years:', fiscalYearsError);
      return false;
    }
    
    // If no fiscal years exist, create default ones
    if (!fiscalYears || fiscalYears.length === 0) {
      const { name: currentFiscalYear, startDate: currentStartDate, endDate: currentEndDate } = getCurrentFiscalYear();
      const [startYear, endYear] = currentFiscalYear.split('/').map(Number);
      
      console.log(`Creating fiscal years with years ${startYear}/${endYear}`);
      
      try {
        // Try to use stored procedure or RPC if RLS is blocking direct inserts
        // This will depend on database setup, but for now we'll show a message
        // to the user that they need to create fiscal years through the UI
        toast.info('Please create fiscal years through the UI. Initial setup is restricted by security policies.');
        return false;
      } catch (insertError) {
        console.error('Error creating fiscal years:', insertError);
        toast.error('Could not create default fiscal years due to security restrictions');
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up fiscal years:', error);
    return false;
  }
};

/**
 * Setup default tables and data if they don't exist
 */
export const setupDefaultData = async () => {
  try {
    // Check if roles table has data
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('count');
      
    if (rolesError) {
      console.error('Error checking roles:', rolesError);
      toast.error('Error checking database setup');
      return false;
    }
    
    // If no roles exist, create default ones
    if (!roles || roles.length === 0) {
      // Create default roles
      const { error: insertError } = await supabase
        .from('roles')
        .insert([
          { 
            name: 'Admin', 
            permissions: [
              'create_entry', 'edit_entry', 'delete_entry', 'restore_entry',
              'view_history', 'manage_users', 'manage_roles', 'manage_fiscal_year',
              'bulk_edit', 'bulk_delete', 'print_invoice', 'download_invoice'
            ]
          },
          { 
            name: 'User', 
            permissions: [
              'create_entry', 'edit_entry', 'view_history', 
              'print_invoice', 'download_invoice'
            ]
          },
          { 
            name: 'Viewer', 
            permissions: ['view_history'] 
          }
        ]);
        
      if (insertError) {
        console.error('Error creating default roles:', insertError);
        toast.error('Error setting up default roles');
        return false;
      }
      
      toast.success('Default roles created');
    }
    
    // Setup fiscal years
    await setupFiscalYears();
    
    return true;
  } catch (error) {
    console.error('Error setting up default data:', error);
    toast.error('Database setup error');
    return false;
  }
};

/**
 * Initialize the database with essential data
 */
export const initializeDatabase = async (userId: string) => {
  const tablesExist = await checkEssentialTables();
  
  if (!tablesExist) {
    await setupDefaultData();
  }
  
  await ensureUserRole(userId);
};
