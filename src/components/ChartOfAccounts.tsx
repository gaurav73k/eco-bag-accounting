
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ChevronDown,
  Plus,
  Pencil,
  Trash,
  FilePlus,
  Save,
  Loader2
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

// Account types
const ACCOUNT_TYPES = [
  'Assets',
  'Liabilities',
  'Equity',
  'Revenue',
  'Expenses'
];

interface Account {
  id: string;
  name: string;
  description: string | null;
  account_type: string;
}

const ChartOfAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const [newAccount, setNewAccount] = useState({
    name: '',
    description: '',
    account_type: 'Assets'
  });
  
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  
  const { hasPermission } = useAuth();
  const canManageAccounts = hasPermission('manage_fiscal_year');
  
  // Fetch accounts
  useEffect(() => {
    fetchAccounts();
  }, []);
  
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      setAccounts(data || []);
    } catch (error: any) {
      console.error('Error fetching accounts:', error);
      toast.error(`Failed to load accounts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddAccount = async () => {
    try {
      if (!newAccount.name) {
        toast.error('Account name is required');
        return;
      }
      
      const { data, error } = await supabase
        .from('accounts')
        .insert([
          {
            name: newAccount.name,
            description: newAccount.description || null,
            account_type: newAccount.account_type
          }
        ])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      setAccounts([...accounts, data]);
      setNewAccount({
        name: '',
        description: '',
        account_type: 'Assets'
      });
      setIsAddDialogOpen(false);
      
      toast.success('Account added successfully');
    } catch (error: any) {
      console.error('Error adding account:', error);
      toast.error(`Failed to add account: ${error.message}`);
    }
  };
  
  const handleEditAccount = async () => {
    try {
      if (!currentAccount) return;
      
      const { data, error } = await supabase
        .from('accounts')
        .update({
          name: currentAccount.name,
          description: currentAccount.description,
          account_type: currentAccount.account_type
        })
        .eq('id', currentAccount.id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      setAccounts(accounts.map(acc => acc.id === currentAccount.id ? data : acc));
      setIsEditDialogOpen(false);
      
      toast.success('Account updated successfully');
    } catch (error: any) {
      console.error('Error updating account:', error);
      toast.error(`Failed to update account: ${error.message}`);
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      if (!currentAccount) return;
      
      // Check if the account is used in any transactions
      const { data, error } = await supabase
        .from('transaction_entries')
        .select('count')
        .eq('account_id', currentAccount.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data && data.count > 0) {
        toast.error('Cannot delete account that is used in transactions');
        setIsDeleteDialogOpen(false);
        return;
      }
      
      const { error: deleteError } = await supabase
        .from('accounts')
        .delete()
        .eq('id', currentAccount.id);
        
      if (deleteError) {
        throw deleteError;
      }
      
      setAccounts(accounts.filter(acc => acc.id !== currentAccount.id));
      setIsDeleteDialogOpen(false);
      
      toast.success('Account deleted successfully');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error(`Failed to delete account: ${error.message}`);
    }
  };
  
  // Filter accounts by type
  const filteredAccounts = activeTab === 'all' 
    ? accounts 
    : accounts.filter(account => account.account_type === activeTab);
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Chart of Accounts</CardTitle>
            <CardDescription>Manage your general ledger accounts</CardDescription>
          </div>
          {canManageAccounts && (
            <Button 
              size="sm" 
              className="gap-1"
              onClick={() => {
                setNewAccount({
                  name: '',
                  description: '',
                  account_type: 'Assets'
                });
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              <span>Add Account</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Accounts</TabsTrigger>
            {ACCOUNT_TYPES.map(type => (
              <TabsTrigger key={type} value={type}>{type}</TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredAccounts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {activeTab === 'all' 
                  ? 'No accounts found. Add your first account to get started.' 
                  : `No ${activeTab} accounts found.`}
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      {canManageAccounts && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map(account => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.name}</TableCell>
                        <TableCell>{account.account_type}</TableCell>
                        <TableCell>{account.description || '-'}</TableCell>
                        {canManageAccounts && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost" 
                                size="icon"
                                onClick={() => {
                                  setCurrentAccount(account);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost" 
                                size="icon"
                                className="text-destructive"
                                onClick={() => {
                                  setCurrentAccount(account);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Add Account Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
            <DialogDescription>
              Create a new account in your chart of accounts.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newAccount.name}
                onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select 
                value={newAccount.account_type}
                onValueChange={(value) => setNewAccount({...newAccount, account_type: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newAccount.description}
                onChange={(e) => setNewAccount({...newAccount, description: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAccount}>Add Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Account Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>
              Update account details.
            </DialogDescription>
          </DialogHeader>
          {currentAccount && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={currentAccount.name}
                  onChange={(e) => setCurrentAccount({...currentAccount, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">
                  Type
                </Label>
                <Select 
                  value={currentAccount.account_type}
                  onValueChange={(value) => setCurrentAccount({...currentAccount, account_type: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  value={currentAccount.description || ''}
                  onChange={(e) => setCurrentAccount({...currentAccount, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditAccount}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Account Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the account <strong>{currentAccount?.name}</strong>. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ChartOfAccounts;
