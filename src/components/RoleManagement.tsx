
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Edit, Trash2, Save, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client';
import { useAuth, Permission } from '@/contexts/AuthContext';

// Define types
type Role = {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
};

type User = {
  id: string;
  name: string;
  email: string;
  role_id: string;
  active: boolean;
};

// Define permission options
const permissionsList: { id: Permission; name: string; description: string }[] = [
  { id: 'create_entry', name: 'Create Entry', description: 'Can create new entries' },
  { id: 'edit_entry', name: 'Edit Entry', description: 'Can edit existing entries' },
  { id: 'delete_entry', name: 'Delete Entry', description: 'Can delete entries' },
  { id: 'restore_entry', name: 'Restore Entry', description: 'Can restore deleted entries' },
  { id: 'view_history', name: 'View History', description: 'Can view entry history' },
  { id: 'manage_users', name: 'Manage Users', description: 'Can add, edit, and delete users' },
  { id: 'manage_roles', name: 'Manage Roles', description: 'Can define and edit roles and permissions' },
  { id: 'manage_fiscal_year', name: 'Manage Fiscal Year', description: 'Can create and manage fiscal years' },
  { id: 'bulk_edit', name: 'Bulk Edit', description: 'Can edit multiple entries at once' },
  { id: 'bulk_delete', name: 'Bulk Delete', description: 'Can delete multiple entries at once' },
  { id: 'print_invoice', name: 'Print Invoice', description: 'Can print invoices' },
  { id: 'download_invoice', name: 'Download Invoice', description: 'Can download invoices' },
];

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTab, setSelectedTab] = useState<'roles' | 'users'>('roles');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Role dialog state
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  
  // User dialog state
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'role' | 'user', id: string } | null>(null);

  // Fetch roles and users from Supabase
  useEffect(() => {
    const fetchRolesAndUsers = async () => {
      setLoading(true);
      try {
        // Fetch roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('*');
        
        if (rolesError) {
          console.error('Error fetching roles:', rolesError);
          toast.error('Failed to load roles');
        } else if (rolesData) {
          const formattedRoles = rolesData.map((role) => ({
            ...role,
            permissions: role.permissions as Permission[]
          }));
          setRoles(formattedRoles);
        }
        
        // Fetch users with their roles - updated query with proper join strategy
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select(`
            id,
            name,
            user_roles!inner (role_id)
          `);
        
        if (userError) {
          console.error('Error fetching users:', userError);
          toast.error('Failed to load users');
        } else if (userData) {
          // Now get email data separately to avoid nested query issues
          const userIds = userData.map(user => user.id);
          
          // Get all user roles to map them
          const { data: userRolesData } = await supabase
            .from('user_roles')
            .select('user_id, role_id')
            .in('user_id', userIds);
            
          // Get user emails from auth
          const { data: authData } = await supabase.auth.admin.listUsers();
          const emailMap = new Map();
          
          if (authData) {
            authData.users.forEach(user => {
              emailMap.set(user.id, {
                email: user.email || '',
                active: !user.banned
              });
            });
          }
          
          // Map user roles to users
          const roleMap = new Map();
          if (userRolesData) {
            userRolesData.forEach(ur => {
              roleMap.set(ur.user_id, ur.role_id);
            });
          }
          
          // Transform the data structure
          const formattedUsers = userData.map((user) => {
            const userAuth = emailMap.get(user.id) || { email: '', active: true };
            const role_id = roleMap.get(user.id) || '';
            
            return {
              id: user.id,
              name: user.name || '',
              email: userAuth.email,
              role_id: role_id,
              active: userAuth.active
            };
          });
          
          setUsers(formattedUsers);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('An unexpected error occurred while loading data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRolesAndUsers();
  }, []);

  // Role handlers
  const handleAddRole = () => {
    setCurrentRole({
      id: '',
      name: '',
      description: '',
      permissions: [],
    });
    setIsRoleDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setCurrentRole({ ...role });
    setIsRoleDialogOpen(true);
  };

  const handleSaveRole = async (role: Role) => {
    if (!role.name) {
      toast.error("Role name is required");
      return;
    }

    try {
      let result;
      
      if (role.id) {
        // Update existing role
        const { data, error } = await supabase
          .from('roles')
          .update({ 
            name: role.name, 
            permissions: role.permissions,
            description: role.description
          })
          .eq('id', role.id)
          .select()
          .single();
          
        if (error) throw error;
        if (!data) throw new Error('No data returned from update');
        
        result = data;
        
        // Update local state
        setRoles(roles.map(r => r.id === role.id ? { ...result, permissions: result.permissions as Permission[] } : r));
        toast.success(`Role ${role.name} updated successfully`);
      } else {
        // Create new role
        const { data, error } = await supabase
          .from('roles')
          .insert({ 
            name: role.name, 
            permissions: role.permissions,
            description: role.description 
          })
          .select()
          .single();
          
        if (error) throw error;
        if (!data) throw new Error('No data returned from insert');
        
        result = data;
        
        // Update local state
        setRoles([...roles, { ...result, permissions: result.permissions as Permission[] }]);
        toast.success(`Role ${role.name} created successfully`);
      }
      
      setIsRoleDialogOpen(false);
      setCurrentRole(null);
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error('Failed to save role');
    }
  };

  // User handlers
  const handleAddUser = () => {
    setCurrentUser({
      id: '',
      name: '',
      email: '',
      role_id: '',
      active: true,
    });
    setIsUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser({ ...user });
    setIsUserDialogOpen(true);
  };

  const handleSaveUser = async (user: User) => {
    if (!user.name || !user.email || !user.role_id) {
      toast.error("Name, email, and role are required");
      return;
    }

    try {
      if (user.id) {
        // Update existing user's role
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role_id: user.role_id })
          .eq('user_id', user.id);
          
        if (roleError) throw roleError;
        
        // Update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ name: user.name })
          .eq('id', user.id);
          
        if (profileError) throw profileError;
        
        // Update local state
        setUsers(users.map(u => u.id === user.id ? user : u));
        toast.success(`User ${user.name} updated successfully`);
      } else {
        // Creating new users would require admin access to auth API
        // This should be handled through an edge function
        toast.error('Creating new users directly is not supported. Please invite users through Supabase admin panel.');
        return;
      }
      
      setIsUserDialogOpen(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };

  const handleToggleUserActive = async (userId: string, active: boolean) => {
    try {
      // Toggling user active status would require admin access to auth API
      // This should be handled through an edge function
      toast.info('Toggling user active status is not implemented in this demo.');
      
      // Update local state for the demo
      setUsers(
        users.map((user) => {
          if (user.id === userId) {
            return { ...user, active };
          }
          return user;
        })
      );
    } catch (error) {
      console.error('Error toggling user active status:', error);
      toast.error('Failed to update user status');
    }
  };

  // Delete handlers
  const handleRequestDelete = (type: 'role' | 'user', id: string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'role') {
        // Check if any users are using this role
        const { data: usersWithRole, error: checkError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role_id', itemToDelete.id);
          
        if (checkError) throw checkError;
        
        if (usersWithRole && usersWithRole.length > 0) {
          toast.error("Cannot delete role because it is assigned to users");
          setDeleteDialogOpen(false);
          setItemToDelete(null);
          return;
        }

        // Delete role
        const { error } = await supabase
          .from('roles')
          .delete()
          .eq('id', itemToDelete.id);
          
        if (error) throw error;
        
        // Update local state
        setRoles(roles.filter((role) => role.id !== itemToDelete.id));
        toast.success("Role deleted successfully");
      } else {
        // Deleting users would require admin access to auth API
        // This should be handled through an edge function
        toast.error('Deleting users directly is not supported in this demo.');
        return;
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${
            selectedTab === 'roles'
              ? 'border-b-2 border-primary font-medium'
              : 'text-muted-foreground'
          }`}
          onClick={() => setSelectedTab('roles')}
        >
          Roles & Permissions
        </button>
        <button
          className={`px-4 py-2 ${
            selectedTab === 'users'
              ? 'border-b-2 border-primary font-medium'
              : 'text-muted-foreground'
          }`}
          onClick={() => setSelectedTab('users')}
        >
          User Management
        </button>
      </div>

      {selectedTab === 'roles' ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Role Management</CardTitle>
            <Button onClick={handleAddRole}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((permId) => {
                          const permission = permissionsList.find((p) => p.id === permId);
                          return permission ? (
                            <span key={permId} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              {permission.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditRole(role)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {role.name !== 'Super Admin' && ( // Prevent deleting Super Admin
                          <Button variant="ghost" size="icon" onClick={() => handleRequestDelete('role', role.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <Button onClick={handleAddUser}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userData) => {
                  const userRole = roles.find((role) => role.id === userData.role_id);
                  return (
                    <TableRow key={userData.id}>
                      <TableCell className="font-medium">{userData.name}</TableCell>
                      <TableCell>{userData.email}</TableCell>
                      <TableCell>{userRole?.name || 'No Role'}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Switch
                            checked={userData.active}
                            onCheckedChange={(checked) => handleToggleUserActive(userData.id, checked)}
                            className="mr-2"
                          />
                          <span className={userData.active ? 'text-green-600' : 'text-red-600'}>
                            {userData.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditUser(userData)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {userData.id !== user?.id && ( // Prevent deleting current user
                            <Button variant="ghost" size="icon" onClick={() => handleRequestDelete('user', userData.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{currentRole?.id ? 'Edit Role' : 'Create New Role'}</DialogTitle>
          </DialogHeader>
          {currentRole && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    value={currentRole.name}
                    onChange={(e) => setCurrentRole({ ...currentRole, name: e.target.value })}
                    placeholder="Enter role name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={currentRole.description || ''}
                    onChange={(e) => setCurrentRole({ ...currentRole, description: e.target.value })}
                    placeholder="Enter role description"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Permissions</h3>
                <div className="border rounded-md p-4 max-h-[400px] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {permissionsList.map((permission) => (
                      <div key={permission.id} className="flex items-start space-x-2 p-2 border rounded hover:bg-muted/30">
                        <Switch
                          id={`perm-${permission.id}`}
                          checked={currentRole.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => {
                            const updatedPermissions = checked
                              ? [...currentRole.permissions, permission.id]
                              : currentRole.permissions.filter(p => p !== permission.id);
                              
                            setCurrentRole({
                              ...currentRole,
                              permissions: updatedPermissions,
                            });
                          }}
                        />
                        <div>
                          <Label
                            htmlFor={`perm-${permission.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {permission.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleSaveRole(currentRole)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Role
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* User Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentUser?.id ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                  placeholder="Enter user name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  placeholder="Enter user email"
                  disabled={!!currentUser.id} // Can't edit email of existing users
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={currentUser.role_id}
                  onValueChange={(value) => setCurrentUser({ ...currentUser, role_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={currentUser.active}
                  onCheckedChange={(checked) => setCurrentUser({ ...currentUser, active: checked })}
                />
                <Label htmlFor="active" className="cursor-pointer">
                  Active Account
                </Label>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleSaveUser(currentUser)}>
                  <Save className="h-4 w-4 mr-2" />
                  Save User
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              {itemToDelete?.type === 'role' ? ' role' : ' user'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoleManagement;
