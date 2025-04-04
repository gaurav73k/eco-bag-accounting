
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CircleUser, Loader2 } from 'lucide-react';

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
      
      if (rolesData) {
        // Map the permissions from JSON to string array
        const typedRoles: Role[] = rolesData.map(role => ({
          id: role.id,
          name: role.name,
          permissions: Array.isArray(role.permissions) 
            ? role.permissions as string[] 
            : []
        }));
        
        setRoles(typedRoles);
      }
      
      // Fetch users with their emails
      const { data: authUsersData, error: authUsersError } = await supabase.auth.admin.listUsers();
      
      if (authUsersError) {
        console.error('Error fetching auth users:', authUsersError);
        // Continue with profiles fetch to get what we can
      }
      
      // Fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name');
      
      if (profilesError) {
        throw profilesError;
      }
      
      // Fetch user_roles
      const { data: userRolesData, error: userRolesError } = await supabase
        .from('user_roles')
        .select('user_id, role_id, roles (id, name)');
      
      if (userRolesError) {
        throw userRolesError;
      }
      
      // Process and map the user data
      const processedUsers: User[] = [];
      
      if (profilesData) {
        for (const profile of profilesData) {
          // Try to get email from auth users data
          let email = '';
          if (authUsersData?.users) {
            const authUser = authUsersData.users.find(u => u.id === profile.id);
            email = authUser?.email || '';
          }
          
          // Find role
          const userRole = userRolesData?.find(ur => ur.user_id === profile.id);
          const roleId = userRole?.role_id || '';
          const roleName = userRole?.roles?.name || 'No Role';
          
          processedUsers.push({
            id: profile.id,
            email,
            name: profile.name || '',
            roleId,
            roleName,
            active: true
          });
        }
      }
      
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">User Role Management</h1>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-card rounded-md shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Name</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Email</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Role</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/20">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30">
                      <td className="py-3 px-4 flex items-center gap-2">
                        <CircleUser className="h-5 w-5 text-muted-foreground" />
                        {user.name || 'Unnamed User'}
                      </td>
                      <td className="py-3 px-4">{user.email || 'No email'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted">
                          {user.roleName}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openChangeRoleDialog(user)}
                          disabled={!hasPermission('manage_users')}
                        >
                          Change Role
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {users.length > 0 && (
            <div className="py-3 px-4 bg-muted/20 text-xs text-muted-foreground">
              Showing {users.length} user{users.length !== 1 ? 's' : ''}
            </div>
          )}
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
                <p className="text-sm font-medium">User: {selectedUser.name || selectedUser.email}</p>
                <div className="space-y-1">
                  <label htmlFor="role" className="text-sm font-medium">
                    Role
                  </label>
                  <Select onValueChange={handleRoleChange} defaultValue={selectedUser.roleId}>
                    <SelectTrigger className="w-full">
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
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
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
