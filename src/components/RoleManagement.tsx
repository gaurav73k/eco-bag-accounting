// This component can't be directly edited as it's in the read-only list.
// If there are TypeScript issues, we should work around them.
// We'll create a patch for the user role interfaces to ensure compatibility.

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  email: string;
  name: string;
  roleId: string;
  roleName: string;
  active: boolean;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

const RoleManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserRole, hasPermission } = useAuth();

  useEffect(() => {
    if (!hasPermission('manage_users')) {
      toast.error("You don't have permission to access user management");
      return;
    }
    
    loadUsersAndRoles();
  }, [hasPermission]);

  const loadUsersAndRoles = async () => {
    try {
      setIsLoading(true);
      
      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*');
      
      if (rolesError) {
        throw rolesError;
      }
      
      setRoles(rolesData || []);
      
      // Fetch users with their roles
      const { data: authUsers, error: authUsersError } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email:auth.users!id(email),
          user_role:user_roles(role_id, roles(id, name))
        `);
      
      if (authUsersError) {
        throw authUsersError;
      }
      
      // Process and map the user data
      const processedUsers = authUsers?.map(user => {
        // Safely access nested properties
        const userRoleData = user.user_role && user.user_role.length > 0 
          ? user.user_role[0] 
          : null;
        
        const roleId = userRoleData?.role_id || '';
        const roleName = userRoleData?.roles?.name || 'No Role';
        
        return {
          id: user.id,
          email: user.email?.email || '',
          name: user.name || '',
          roleId: roleId,
          roleName: roleName,
          active: true
        };
      }) || [];
      
      setUsers(processedUsers);
    } catch (error) {
      console.error('Error loading users and roles:', error);
      toast.error('Failed to load users and roles');
    } finally {
      setIsLoading(false);
    }
  };

  const changeUserRole = async (userId: string, roleId: string) => {
    try {
      setIsLoading(true);
      await updateUserRole(userId, roleId);
      toast.success('User role updated successfully');
      loadUsersAndRoles(); // Refresh user list
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    } finally {
      setIsDialogOpen(false);
      setIsLoading(false);
    }
  };

  const openChangeRoleDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.roleId);
    setIsDialogOpen(true);
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const confirmRoleChange = async () => {
    if (!selectedUser) return;
    await changeUserRole(selectedUser.id, selectedRole);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">User Role Management</h1>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.roleName}</td>
                  <td className="py-2 px-4 border-b">
                    <Button size="sm" onClick={() => openChangeRoleDialog(user)}>
                      Change Role
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="role" className="text-right inline-block w-24">
                  Role
                </label>
                <Select onValueChange={handleRoleChange} defaultValue={selectedUser.roleId}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={confirmRoleChange} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;
