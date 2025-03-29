import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  PlusCircle, 
  Wallet, 
  Download, 
  Search, 
  Filter,
  FileText,
  PieChart,
  Edit,
  Trash
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportToCSV, getFormattedDate } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';
import { EntryDialog } from '@/components/ui/entry-dialog';
import ExpenseForm from '@/components/forms/ExpenseForm';
import { useAuth } from '@/contexts/AuthContext';

const expensesData = [
  { id: 'EXP-001', date: '2023-06-15', description: 'Purchase of Raw Materials', category: 'Raw Materials', amount: 25000, paymentMethod: 'Bank Transfer' },
  { id: 'EXP-002', date: '2023-06-14', description: 'Electricity Bill', category: 'Utilities', amount: 5000, paymentMethod: 'Cash' },
  { id: 'EXP-003', date: '2023-06-14', description: 'Staff Salaries', category: 'Salaries', amount: 45000, paymentMethod: 'Bank Transfer' },
  { id: 'EXP-004', date: '2023-06-13', description: 'Office Supplies', category: 'Office', amount: 3000, paymentMethod: 'Cash' },
  { id: 'EXP-005', date: '2023-06-12', description: 'Internet Bill', category: 'Utilities', amount: 2500, paymentMethod: 'Cash' },
  { id: 'EXP-006', date: '2023-06-12', description: 'Machine Maintenance', category: 'Maintenance', amount: 8000, paymentMethod: 'Cash' },
  { id: 'EXP-007', date: '2023-06-10', description: 'Transportation', category: 'Transport', amount: 4500, paymentMethod: 'Cash' },
  { id: 'EXP-008', date: '2023-06-08', description: 'Rent', category: 'Rent', amount: 15000, paymentMethod: 'Bank Transfer' },
];

const categories = [...new Set(expensesData.map(expense => expense.category))];

const expensesByCategory = categories.map(category => {
  const total = expensesData
    .filter(expense => expense.category === category)
    .reduce((sum, expense) => sum + expense.amount, 0);
  return { category, amount: total };
});

const Expenses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [expenses, setExpenses] = useState(expensesData);
  const [isNewExpenseDialogOpen, setIsNewExpenseDialogOpen] = useState(false);
  const [isEditExpenseDialogOpen, setIsEditExpenseDialogOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const params = useParams();
  const { hasPermission } = useAuth();

  const canEdit = hasPermission('edit_entry');
  const canDelete = hasPermission('delete_entry');

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (currentTab === 'all') return matchesSearch;
    if (currentTab === 'utilities') return matchesSearch && expense.category === 'Utilities';
    if (currentTab === 'materials') return matchesSearch && expense.category === 'Raw Materials';
    if (currentTab === 'salaries') return matchesSearch && expense.category === 'Salaries';
    return matchesSearch;
  });

  const handleNewExpense = () => {
    setCurrentExpense(null);
    setIsNewExpenseDialogOpen(true);
  };

  const handleEditExpense = (expense: any) => {
    setCurrentExpense(expense);
    setIsEditExpenseDialogOpen(true);
  };

  const handleDeleteExpense = (expenseId: string) => {
    const expenseName = expenses.find(e => e.id === expenseId)?.description;
    if (window.confirm(`Are you sure you want to delete expense: ${expenseName}?`)) {
      setExpenses(prevExpenses => prevExpenses.filter(e => e.id !== expenseId));
      toast({
        title: "Expense Deleted",
        description: `${expenseName} has been removed.`,
      });
    }
  };

  const handleSaveExpense = (data: any) => {
    if (currentExpense) {
      setExpenses(prevExpenses => 
        prevExpenses.map(expense => 
          expense.id === currentExpense.id 
            ? { ...expense, ...data }
            : expense
        )
      );
      setIsEditExpenseDialogOpen(false);
      toast({
        title: "Expense Updated",
        description: `${data.description} has been updated.`,
      });
    } else {
      const newExpense = {
        id: `EXP-${String(expenses.length + 1).padStart(3, '0')}`,
        ...data,
        date: data.date || new Date().toISOString().split('T')[0],
      };
      
      setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
      setIsNewExpenseDialogOpen(false);
      toast({
        title: "Expense Added",
        description: `${data.description} has been added.`,
      });
    }
  };

  const handleExport = (format: string) => {
    try {
      exportToCSV(
        filteredExpenses.map(expense => ({
          'Expense ID': expense.id,
          Date: expense.date,
          Description: expense.description,
          Category: expense.category,
          Amount: expense.amount,
          'Payment Method': expense.paymentMethod
        })),
        `expenses-data-${getFormattedDate()}`
      );
      
      toast({
        title: "Export Successful",
        description: `Expenses data exported as ${format.toUpperCase()} file.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the expenses data.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="Expenses Management" 
          description="Track and categorize all your business expenses"
          icon={<Wallet className="h-6 w-6" />}
        >
          <div className="flex gap-2">
            <Button size="sm" onClick={handleNewExpense}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Expense
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </PageTitle>
        
        <EntryDialog
          title="Add New Expense"
          description="Enter expense details"
          isOpen={isNewExpenseDialogOpen}
          onClose={() => setIsNewExpenseDialogOpen(false)}
          entityType="expense"
          entityName="expense entry"
          isCreate={true}
          hideFooter={true}
          size="lg"
        >
          <ExpenseForm
            onSave={handleSaveExpense}
            onCancel={() => setIsNewExpenseDialogOpen(false)}
          />
        </EntryDialog>

        <EntryDialog
          title="Edit Expense"
          description="Update expense details"
          isOpen={isEditExpenseDialogOpen}
          onClose={() => setIsEditExpenseDialogOpen(false)}
          entityType="expense"
          entityId={currentExpense?.id}
          entityName={currentExpense?.description}
          isEdit={true}
          hideFooter={true}
          size="lg"
        >
          <ExpenseForm
            initialData={currentExpense ? {
              description: currentExpense.description,
              amount: String(currentExpense.amount),
              category: currentExpense.category,
              date: currentExpense.date,
              paymentMethod: currentExpense.paymentMethod,
            } : {}}
            onSave={handleSaveExpense}
            onCancel={() => setIsEditExpenseDialogOpen(false)}
          />
        </EntryDialog>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Expenses</CardTitle>
              <CardDescription>Current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rs. {expenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From {expenses.length} expenses
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Largest Expense</CardTitle>
              <CardDescription>Current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                Rs. {Math.max(...expenses.map(expense => expense.amount)).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {expenses.find(expense => expense.amount === Math.max(...expenses.map(expense => expense.amount)))?.category}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Expense Categories</CardTitle>
              <CardDescription>Current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {categories.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Most significant: {
                  expensesByCategory.sort((a, b) => b.amount - a.amount)[0].category
                }
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Expense Breakdown by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-center">
                  <PieChart className="h-24 w-24 text-muted-foreground" />
                </div>
                <div>
                  {expensesByCategory.sort((a, b) => b.amount - a.amount).map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full bg-${
                          index === 0 ? 'red' : 
                          index === 1 ? 'blue' : 
                          index === 2 ? 'green' : 
                          index === 3 ? 'yellow' : 
                          'gray'
                        }-500 mr-2`}></div>
                        <span>{item.category}</span>
                      </div>
                      <div className="font-medium">
                        Rs. {item.amount.toLocaleString()} ({Math.round(item.amount / expenses.reduce((sum, expense) => sum + expense.amount, 0) * 100)}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Expense Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="mb-6" onValueChange={setCurrentTab}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Expenses</TabsTrigger>
                  <TabsTrigger value="utilities">Utilities</TabsTrigger>
                  <TabsTrigger value="materials">Raw Materials</TabsTrigger>
                  <TabsTrigger value="salaries">Salaries</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search expenses..."
                      className="w-[200px] pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{expense.id}</TableCell>
                          <TableCell>{expense.date}</TableCell>
                          <TableCell>{expense.description}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              expense.category === 'Raw Materials' ? 'bg-blue-100 text-blue-800' : 
                              expense.category === 'Utilities' ? 'bg-purple-100 text-purple-800' :
                              expense.category === 'Salaries' ? 'bg-green-100 text-green-800' :
                              expense.category === 'Office' ? 'bg-yellow-100 text-yellow-800' :
                              expense.category === 'Maintenance' ? 'bg-orange-100 text-orange-800' :
                              expense.category === 'Rent' ? 'bg-red-100 text-red-800' :
                              expense.category === 'Transport' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {expense.category}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium">Rs. {expense.amount.toLocaleString()}</TableCell>
                          <TableCell>{expense.paymentMethod}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              {canEdit && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditExpense(expense)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              {canDelete && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteExpense(expense.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredExpenses.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            No expenses found. Try adjusting your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="utilities" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses
                        .filter(expense => expense.category === 'Utilities')
                        .map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell>{expense.id}</TableCell>
                            <TableCell>{expense.date}</TableCell>
                            <TableCell>{expense.description}</TableCell>
                            <TableCell className="text-right font-medium">Rs. {expense.amount.toLocaleString()}</TableCell>
                            <TableCell>{expense.paymentMethod}</TableCell>
                          </TableRow>
                        ))}
                      {filteredExpenses.filter(expense => expense.category === 'Utilities').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No utility expenses found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="materials" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses
                        .filter(expense => expense.category === 'Raw Materials')
                        .map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell>{expense.id}</TableCell>
                            <TableCell>{expense.date}</TableCell>
                            <TableCell>{expense.description}</TableCell>
                            <TableCell className="text-right font-medium">Rs. {expense.amount.toLocaleString()}</TableCell>
                            <TableCell>{expense.paymentMethod}</TableCell>
                          </TableRow>
                        ))}
                      {filteredExpenses.filter(expense => expense.category === 'Raw Materials').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No raw material expenses found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="salaries" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses
                        .filter(expense => expense.category === 'Salaries')
                        .map((expense) => (
                          <TableRow key={expense.id}>
                            <TableCell>{expense.id}</TableCell>
                            <TableCell>{expense.date}</TableCell>
                            <TableCell>{expense.description}</TableCell>
                            <TableCell className="text-right font-medium">Rs. {expense.amount.toLocaleString()}</TableCell>
                            <TableCell>{expense.paymentMethod}</TableCell>
                          </TableRow>
                        ))}
                      {filteredExpenses.filter(expense => expense.category === 'Salaries').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            No salary expenses found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Expenses;
