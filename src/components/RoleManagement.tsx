
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { PlusCircle, Edit, Trash2, Save, CheckCircle, XCircle } from 'lucide-react';
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

// Define types
type Permission = {
  id: string;
  name: string;
  description: string;
};

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

// Initial sample data
const permissionsList: Permission[] = [
  { id: 'view_dashboard', name: 'View Dashboard', description: 'Can view the main dashboard' },
  { id: 'manage_sales', name: 'Manage Sales', description: 'Can create, edit, and delete sales' },
  { id: 'view_sales', name: 'View Sales', description: 'Can view sales data' },
  { id: 'manage_purchases', name: 'Manage Purchases', description: 'Can create, edit, and delete purchases' },
  { id: 'view_purchases', name: 'View Purchases', description: 'Can view purchases data' },
  { id: 'manage_inventory', name: 'Manage Inventory', description: 'Can add, edit, and remove inventory items' },
  { id: 'view_inventory', name: 'View Inventory', description: 'Can view inventory data' },
  { id: 'manage_ledger', name: 'Manage Ledger', description: 'Can create and edit ledger entries' },
  { id: 'view_ledger', name: 'View Ledger', description: 'Can view ledger data' },
  { id: 'manage_payroll', name: 'Manage Payroll', description: 'Can process payroll and manage employee compensation' },
  { id: 'view_payroll', name: 'View Payroll', description: 'Can view payroll information' },
  { id: 'manage_users', name: 'Manage Users', description: 'Can add, edit, and delete users' },
  { id: 'manage_roles', name: 'Manage Roles', description: 'Can define and edit roles and permissions' },
  { id: 'generate_reports', name: 'Generate Reports', description: 'Can generate and download reports' },
  { id: 'manage_settings', name: 'Manage Settings', description: 'Can modify system settings' },
];

// Initial roles
const initialRoles: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    permissions: permissionsList.reduce((acc, permission) => {
      acc[permission.id] = true;
      return acc;
    }, {} as Record<string, boolean>),
  },
  {
    id: '2',
    name: 'Accountant',
    description: 'Access to financial data and operations',
    permissions: {
      view_dashboard: true,
      view_sales: true,
      view_purchases: true,
      view_inventory: true,
      manage_ledger: true,
      view_ledger: true,
      view_payroll: true,
      generate_reports: true,
    },
  },
  {
    id: '3',
    name: 'Sales Manager',
    description: 'Manages sales and related data',
    permissions: {
      view_dashboard: true,
      manage_sales: true,
      view_sales: true,
      view_inventory: true,
      generate_reports: true,
    },
  },
  {
    id: '4',
    name: 'Inventory Manager',
    description: 'Manages inventory and stock',
    permissions: {
      view_dashboard: true,
      view_sales: true,
      view_purchases: true,
      manage_inventory: true,
      view_inventory: true,
      generate_reports: true,
    },
  },
];

// Initial users
const initialUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: '1', active: true },
  { id: '2', name: 'John Smith', email: 'john@example.com', role: '2', active: true },
  { id: '3', name: 'Sarah Jones', email: 'sarah@example.com', role: '3', active: true },
  { id: '4', name: 'Michael Lee', email: 'michael@example.com', role: '4', active: true },
  { id: '5', name: 'David Chen', email: 'david@example.com', role: '2', active: false },
];

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedTab, setSelectedTab] = useState<'roles' | 'users'>('roles');
  
  // Role dialog state
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  
  // User dialog state
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'role' | 'user', id: string } | null>(null);

  // Role handlers
  const handleAddRole = () => {
    setCurrentRole({
      id: `role-${Date.now()}`,
      name: '',
      description: '',
      permissions: {},
    });
    setIsRoleDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setCurrentRole({ ...role });
    setIsRoleDialogOpen(true);
  };

  const handleSaveRole = (role: Role) => {
    if (!role.name) {
      toast.error("Role name is required");
      return;
    }

    const updatedRoles = role.id
      ? roles.map((r) => (r.id === role.id ? role : r))
      : [...roles, role];
    
    setRoles(updatedRoles);
    setIsRoleDialogOpen(false);
    setCurrentRole(null);
    toast.success(`Role ${role.id ? 'updated' : 'created'} successfully`);
  };

  const handleTogglePermission = (roleId: string, permissionId: string, value: boolean) => {
    setRoles(
      roles.map((role) => {
        if (role.id === roleId) {
          return {
            ...role,
            permissions: {
              ...role.permissions,
              [permissionId]: value,
            },
          };
        }
        return role;
      })
    );
  };

  // User handlers
  const handleAddUser = () => {
    setCurrentUser({
      id: `user-${Date.now()}`,
      name: '',
      email: '',
      role: '',
      active: true,
    });
    setIsUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser({ ...user });
    setIsUserDialogOpen(true);
  };

  const handleSaveUser = (user: User) => {
    if (!user.name || !user.email || !user.role) {
      toast.error("Name, email, and role are required");
      return;
    }

    const updatedUsers = user.id
      ? users.map((u) => (u.id === user.id ? user : u))
      : [...users, user];
    
    setUsers(updatedUsers);
    setIsUserDialogOpen(false);
    setCurrentUser(null);
    toast.success(`User ${user.id ? 'updated' : 'created'} successfully`);
  };

  const handleToggleUserActive = (userId: string, active: boolean) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          return { ...user, active };
        }
        return user;
      })
    );
    toast.success(`User ${active ? 'activated' : 'deactivated'}`);
  };

  // Delete handlers
  const handleRequestDelete = (type: 'role' | 'user', id: string) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'role') {
      // Check if any users are using this role
      const usersWithRole = users.filter((user) => user.role === itemToDelete.id);
      if (usersWithRole.length > 0) {
        toast.error("Cannot delete role because it is assigned to users");
        setDeleteDialogOpen(false);
        setItemToDelete(null);
        return;
      }

      setRoles(roles.filter((role) => role.id !== itemToDelete.id));
      toast.success("Role deleted successfully");
    } else {
      setUsers(users.filter((user) => user.id !== itemToDelete.id));
      toast.success("User deleted successfully");
    }

    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

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
                        {Object.entries(role.permissions).filter(([_, hasPermission]) => hasPermission).map(([permId, _]) => {
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
                        {role.id !== '1' && ( // Prevent deleting Super Admin
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
                {users.map((user) => {
                  const userRole = roles.find((role) => role.id === user.role);
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{userRole?.name || 'Unknown Role'}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Switch
                            checked={user.active}
                            onCheckedChange={(checked) => handleToggleUserActive(user.id, checked)}
                            className="mr-2"
                          />
                          <span className={user.active ? 'text-green-600' : 'text-red-600'}>
                            {user.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.id !== '1' && ( // Prevent deleting main admin
                            <Button variant="ghost" size="icon" onClick={() => handleRequestDelete('user', user.id)}>
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
                    value={currentRole.description}
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
                          checked={!!currentRole.permissions[permission.id]}
                          onCheckedChange={(checked) => {
                            setCurrentRole({
                              ...currentRole,
                              permissions: {
                                ...currentRole.permissions,
                                [permission.id]: checked,
                              },
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
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={currentUser.role}
                  onValueChange={(value) => setCurrentUser({ ...currentUser, role: value })}
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
