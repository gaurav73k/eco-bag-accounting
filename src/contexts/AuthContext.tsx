
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase, User, Session } from '@/lib/supabase';

export type Permission = 
  | 'create_entry' 
  | 'edit_entry' 
  | 'delete_entry' 
  | 'restore_entry' 
  | 'view_history'
  | 'manage_users'
  | 'manage_roles'
  | 'manage_fiscal_year'
  | 'bulk_edit'
  | 'bulk_delete'
  | 'print_invoice'
  | 'download_invoice';

export type UserRole = {
  id: string;
  name: string;
  permissions: Permission[];
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  role: UserRole;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  resetPassword: (email: string) => Promise<void>;
  updateUserRole: (userId: string, roleId: string) => Promise<void>;
};

// Define roles with permissions (will be moved to DB with Supabase)
const roles: Record<string, UserRole> = {
  'admin': {
    id: '1',
    name: 'Super Admin',
    permissions: [
      'create_entry', 
      'edit_entry', 
      'delete_entry', 
      'restore_entry', 
      'view_history', 
      'manage_users', 
      'manage_roles', 
      'manage_fiscal_year',
      'bulk_edit', 
      'bulk_delete',
      'print_invoice',
      'download_invoice'
    ]
  },
  'accountant': {
    id: '2',
    name: 'Accountant',
    permissions: ['create_entry', 'edit_entry', 'view_history', 'print_invoice', 'download_invoice']
  },
  'manager': {
    id: '3',
    name: 'Manager',
    permissions: ['create_entry', 'edit_entry', 'view_history', 'print_invoice']
  },
  'viewer': {
    id: '4',
    name: 'Viewer',
    permissions: ['view_history']
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (event === 'SIGNED_IN' && session) {
          try {
            // Fetch user details including role
            const { data: userData, error } = await supabase
              .from('users')
              .select('*, roles(*)')
              .eq('id', session.user.id)
              .single();
            
            if (error || !userData) {
              console.error('Error fetching user data:', error);
              // Fallback to existing role system until DB is set up
              const userWithRole: AuthUser = {
                id: session.user.id,
                name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || '',
                email: session.user.email || '',
                roleId: 'admin', // Default role
                role: roles['admin']
              };
              setUser(userWithRole);
            } else {
              // Map DB role to our format
              const userWithRole: AuthUser = {
                id: userData.id,
                name: userData.name || session.user.email?.split('@')[0] || '',
                email: userData.email,
                roleId: userData.role_id,
                // If roles are in DB, use that, otherwise use our hardcoded ones
                role: userData.roles || roles[userData.role_id] || roles['viewer']
              };
              setUser(userWithRole);
            }
          } catch (error) {
            console.error('Error setting up user:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Initial session check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Auth state change listener will handle setting up the user
      }
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success('Successfully logged in');
      navigate('/');
      return true;
    } catch (error) {
      toast.error('Failed to log in');
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user'); // Clean up old storage
    toast.success('Successfully logged out');
    navigate('/login');
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return user.role.permissions.includes(permission);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }
    
    toast.success('Password reset email sent');
  };

  const updateUserRole = async (userId: string, roleId: string) => {
    // This will be implemented with Supabase
    toast.success('User role updated');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      hasPermission,
      resetPassword,
      updateUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};
