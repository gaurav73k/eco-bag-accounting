
// Fix the TypeScript error on line 119
interface UserRoleData {
  id: string;
  user_id: string;
  role_id: string;
  created_at: string | null;
  user: {
    id: string;
    email: string;
    name: string | null;
  } | null;
  role: {
    id: string;
    name: string;
    permissions: string[];
  } | null;
}

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const RoleManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [userRolesData, setUserRolesData] = useState<UserRoleData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { updateUserRole } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*');
      
      if (usersError) throw usersError;
      
      // Fetch all roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*');
      
      if (rolesError) throw rolesError;
      
      // Fetch user roles with user and role data - fix the join
      const { data: userRoles, error: userRolesError } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role_id,
          created_at,
          user:profiles!user_id(id, email, name),
          role:roles(id, name, permissions)
        `);
      
      if (userRolesError) throw userRolesError;
      
      setUsers(usersData || []);
      setRoles(rolesData || []);
      
      // Use a type assertion with unknown as intermediary to satisfy TypeScript
      setUserRolesData(userRoles as unknown as UserRoleData[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch user and role data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, roleId: string) => {
    try {
      // Check if user already has a role
      const existingUserRole = userRolesData?.find(ur => ur.user_id === userId);
      
      if (existingUserRole) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role_id: roleId })
          .eq('id', existingUserRole.id);
        
        if (error) throw error;
      } else {
        // Create new role assignment
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role_id: roleId });
        
        if (error) throw error;
      }
      
      // Call context method to update user role if it's the current user
      await updateUserRole(userId, roleId);
      
      toast.success('User role updated successfully');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">User</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Current Role</TableHead>
              <TableHead>Assign Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => {
              const userRole = userRolesData?.find(ur => ur.user_id === user.id);
              
              return (
                <TableRow key={user.id}>
                  <TableCell className="font-medium truncate max-w-[150px]">
                    {user.name || "Unnamed User"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell truncate max-w-[200px]">
                    {user.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {userRole?.role ? (
                      <Badge variant="outline">{userRole.role.name}</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">No Role</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={userRole?.role_id || ""}
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RoleManagement;
