
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
  | 'manage_roles'
  | 'bulk_edit'
  | 'bulk_delete';

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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
};

// Define roles with permissions
const roles: Record<string, UserRole> = {
  'admin': {
    id: '1',
    name: 'Super Admin',
    permissions: ['create_entry', 'edit_entry', 'delete_entry', 'restore_entry', 'view_history', 'manage_users', 'manage_roles', 'bulk_edit', 'bulk_delete']
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

// Hardcoded users for initial setup (in production, this would be from a database)
// WARNING: This is only for initial setup and should be replaced with a real backend
const authorizedUsers = [
  {
    email: "admin@example.com",
    password: "Admin@123!",  // In production, this would be hashed
    roleId: "admin",
    name: "System Administrator",
    id: "1"
  }
];

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
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure role object is properly attached
        const userWithRole = {
          ...parsedUser,
          role: roles[parsedUser.roleId] || roles['viewer']
        };
        setUser(userWithRole);
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Basic security check - in production, this would call a backend API with proper auth
    if (!email || !password) {
      toast.error('Please provide both email and password');
      return false;
    }
    
    // Find user (in production, this would be an API call)
    const foundUser = authorizedUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    
    if (foundUser) {
      // In a real system, the password would never be stored or transmitted client-side
      const { password: _, ...userWithoutPassword } = foundUser;
      
      const userObject: User = {
        ...userWithoutPassword,
        role: roles[foundUser.roleId]
      };
      
      setUser(userObject);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success('Successfully logged in');
      navigate('/');
      return true;
    } else {
      toast.error('Invalid credentials');
      return false;
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
