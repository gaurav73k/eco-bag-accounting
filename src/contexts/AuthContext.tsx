
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type Permission = 
  | 'create_entry' 
  | 'edit_entry' 
  | 'delete_entry' 
  | 'restore_entry' 
  | 'view_history'
  | 'manage_users'
  | 'manage_roles';

export type UserRole = {
  id: string;
  name: string;
  permissions: Permission[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
};

// Define roles with permissions
const roles: Record<string, UserRole> = {
  'admin': {
    id: '1',
    name: 'Super Admin',
    permissions: ['create_entry', 'edit_entry', 'delete_entry', 'restore_entry', 'view_history', 'manage_users', 'manage_roles']
  },
  'accountant': {
    id: '2',
    name: 'Accountant',
    permissions: ['create_entry', 'edit_entry', 'view_history']
  },
  'manager': {
    id: '3',
    name: 'Manager',
    permissions: ['create_entry', 'edit_entry', 'view_history']
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
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Ensure role object is properly attached
      const userWithRole = {
        ...parsedUser,
        role: roles[parsedUser.roleId] || roles['viewer']
      };
      setUser(userWithRole);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simple mock authentication - in a real app, this would call an API
    if (email && password) {
      // Determine role based on email for demo purposes
      let roleId = 'viewer';
      if (email.includes('admin')) {
        roleId = 'admin';
      } else if (email.includes('accountant')) {
        roleId = 'accountant';
      } else if (email.includes('manager')) {
        roleId = 'manager';
      }
      
      // Mock user data with role information
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email,
        roleId: roleId,
        role: roles[roleId]
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast.success('Successfully logged in');
      navigate('/');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Successfully logged out');
    navigate('/login');
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return user.role.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
