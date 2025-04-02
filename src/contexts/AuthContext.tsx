
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

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
  loading: boolean;
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  useEffect(() => {
    console.log('AuthProvider mounted');
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        
        if (event === 'SIGNED_IN' && currentSession) {
          console.log('User signed in, fetching details');
          try {
            // Fetch user details including role
            const { data: userRoles, error: userRolesError } = await supabase
              .from('user_roles')
              .select(`
                role_id,
                roles (
                  id, name, permissions
                )
              `)
              .eq('user_id', currentSession.user.id)
              .single();
            
            if (userRolesError) {
              console.error('Error fetching user roles:', userRolesError);
              setLoading(false);
              return;
            }
            
            if (!userRoles) {
              console.error('No user role found');
              setLoading(false);
              return;
            }
            
            const { data: userData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();
            
            if (error || !userData) {
              console.error('Error fetching user data:', error);
              setLoading(false);
              return;
            }

            // Create user with role data
            const userWithRole: AuthUser = {
              id: userData.id,
              name: userData.name || currentSession.user.email?.split('@')[0] || '',
              email: currentSession.user.email || '',
              roleId: userRoles.role_id,
              role: {
                id: userRoles.roles.id,
                name: userRoles.roles.name,
                permissions: userRoles.roles.permissions as Permission[]
              }
            };
            
            console.log('User with role data:', userWithRole);
            setUser(userWithRole);
            
            // If the user was on login page, redirect to home
            if (window.location.pathname === '/login') {
              console.log('Redirecting from login to home');
              navigate('/');
            }
          } catch (error) {
            console.error('Error setting up user:', error);
          } finally {
            setLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    );

    // Initial session check
    const checkSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      console.log('Initial session check:', initialSession ? 'Has session' : 'No session');
      
      if (!initialSession) {
        setLoading(false);
      }
      // If there is a session, the onAuthStateChange handler will handle setting up the user
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        setLoading(false);
        return false;
      }
      
      console.log('Login successful:', data);
      toast.success('Successfully logged in');
      
      return true;
    } catch (error) {
      console.error('Login exception:', error);
      toast.error('Failed to log in');
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
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
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role_id: roleId })
        .eq('user_id', userId);
        
      if (error) {
        toast.error('Failed to update user role');
        throw error;
      }
      
      toast.success('User role updated');
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      hasPermission,
      resetPassword,
      updateUserRole,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
