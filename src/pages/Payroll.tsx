import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Download, 
  Filter, 
  Search, 
  User, 
  ChevronDown, 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  Eye,
  Users,
  Calendar,
  DollarSign,
  CheckSquare,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportToCSV, getFormattedDate } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';
import { EntryDialog } from '@/components/ui/entry-dialog';
import EmployeePayrollForm from '@/components/forms/EmployeePayrollForm';
import EmployeeForm from '@/components/forms/EmployeeForm';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
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
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Payroll: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('payroll');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const { toast: hookToast } = useToast();
  const { hasPermission } = useAuth();
  
  const [showAddEmployeeDialog, setShowAddEmployeeDialog] = useState(false);
  const [showEditEmployeeDialog, setShowEditEmployeeDialog] = useState(false);
  const [showProcessPayrollDialog, setShowProcessPayrollDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  
  const [employees, setEmployees] = useState<any[]>([]);
  const [payrollData, setPayrollData] = useState<any[]>([]);
  
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  const canEdit = hasPermission('edit_entry');
  const canDelete = hasPermission('delete_entry');
  const canBulkEdit = hasPermission('bulk_edit');
  const canBulkDelete = hasPermission('bulk_delete');

  const departments = [...new Set(employees.map(employee => employee.department))];

  const filteredData = currentTab === 'employees' 
    ? employees.filter(employee => {
        const matchesSearch = 
          employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.id?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (selectedDepartment === 'all') return matchesSearch;
        return matchesSearch && employee.department === selectedDepartment;
      })
    : payrollData.filter(entry => {
        const matchesSearch = 
          entry.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (selectedDepartment === 'all') return matchesSearch;
        const employeeDept = employees.find(e => e.id === entry.employeeId)?.department;
        return matchesSearch && employeeDept === selectedDepartment;
      });

  const handleExport = (format: string) => {
    try {
      if (currentTab === 'employees') {
        exportToCSV(
          filteredData.map(employee => ({
            'Employee ID': employee.id,
            Name: employee.name,
            Position: employee.position,
            Department: employee.department,
            'Joining Date': employee.joiningDate,
            'Basic Salary': employee.basicSalary
          })),
          `employees-data-${getFormattedDate()}`
        );
      } else {
        exportToCSV(
          filteredData.map((entry: any) => ({
            'Payroll ID': entry.id,
            'Employee ID': entry.employeeId,
            'Employee Name': entry.employeeName,
            Month: entry.month,
            'Basic Salary': entry.basicSalary,
            Overtime: entry.overtime,
            Bonus: entry.bonus,
            Deductions: entry.deductions,
            'Net Salary': entry.netSalary,
            Status: entry.status,
            'Payment Date': entry.paymentDate
          })),
          `payroll-data-${getFormattedDate()}`
        );
      }
      
      toast.success("Export Successful", {
        description: `Data exported as ${format.toUpperCase()} file.`
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export Failed", {
        description: "There was an error exporting the data."
      });
    }
  };

  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setShowEditEmployeeDialog(true);
  };

  const handleAddEmployee = (employeeData: any) => {
    const newId = `EMP-${String(employees.length + 1).padStart(3, '0')}`;
    const newEmployee = {
      ...employeeData,
      id: newId,
      position: employeeData.position || 'Staff',
      department: employeeData.department || 'General',
      joiningDate: employeeData.joinDate || new Date().toISOString().split('T')[0],
      basicSalary: parseInt(employeeData.salary) || 0
    };
    
    setEmployees(prev => [...prev, newEmployee]);
    toast.success("Employee Added", {
      description: `${employeeData.name} has been added successfully.`
    });
    setShowAddEmployeeDialog(false);
  };

  const handleUpdateEmployee = (employeeData: any) => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === selectedEmployee.id 
          ? {
              ...emp, 
              name: employeeData.name,
              position: employeeData.position || emp.position,
              department: employeeData.department || emp.department,
              joiningDate: employeeData.joinDate || emp.joiningDate,
              basicSalary: parseInt(employeeData.salary) || emp.basicSalary
            } 
          : emp
      )
    );
    
    toast.success("Employee Updated", {
      description: `${employeeData.name} has been updated successfully.`
    });
    setShowEditEmployeeDialog(false);
  };

  const handleProcessPayroll = (payrollData: any) => {
    const newPayrolls = employees.map((employee, index) => {
      const id = `PAY-${String(index + 1).padStart(3, '0')}`;
      const basicSalary = employee.basicSalary || 0;
      const overtime = Math.floor(Math.random() * 2000);
      const bonus = 0;
      const deductions = Math.floor(basicSalary * 0.05);
      const netSalary = basicSalary + overtime + bonus - deductions;
      
      return {
        id,
        employeeId: employee.id,
        employeeName: employee.name,
        month: payrollData.month,
        basicSalary,
        overtime,
        bonus,
        deductions,
        netSalary,
        status: 'pending',
        paymentDate: ''
      };
    });
    
    setPayrollData(newPayrolls);
    toast.success("Payroll Processed", {
      description: `Payroll for ${payrollData.month} has been processed successfully.`
    });
    setShowProcessPayrollDialog(false);
  };

  const toggleBulkMode = () => {
    setIsBulkMode(!isBulkMode);
    if (isBulkMode) {
      setSelectedItems([]);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map(item => item.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;

    if (currentTab === 'employees') {
      setEmployees(prev => prev.filter(employee => !selectedItems.includes(employee.id)));
      setPayrollData(prev => prev.filter(entry => {
        const employeeId = entry.employeeId;
        return !selectedItems.includes(employeeId);
      }));
    } else {
      setPayrollData(prev => prev.filter(entry => !selectedItems.includes(entry.id)));
    }

    setSelectedItems([]);
    setIsBulkDeleteDialogOpen(false);
    toast.success(`${selectedItems.length} ${currentTab === 'employees' ? 'employees' : 'payroll entries'} deleted successfully`);
  };

  const totalPayroll = payrollData.reduce((total, entry) => total + entry.netSalary, 0);

  const formatNumber = (value: number | undefined): string => {
    return value !== undefined ? value.toLocaleString() : '0';
  };

  const convertToFormValues = (employee: any) => {
    return {
      name: employee.name || '',
      position: employee.position || '',
      email: `${employee.name?.split(' ')[0].toLowerCase()}@example.com` || '',
      phone: '9800000000',
      salary: employee.basicSalary?.toString() || '',
      department: employee.department?.toLowerCase() || '',
      joinDate: employee.joiningDate || '',
      address: 'Kathmandu, Nepal',
      notes: ''
    };
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="Payroll Management" 
          description="Manage employee salaries and benefits"
          icon={<Users className="h-6 w-6" />}
        >
          <div className="flex gap-2">
            <Button 
              size="sm"
              onClick={() => currentTab === 'employees' 
                ? setShowAddEmployeeDialog(true)
                : setShowProcessPayrollDialog(true)
              }
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              {currentTab === 'employees' ? 'Add Employee' : 'Process Payroll'}
            </Button>
            
            {(canBulkEdit || canBulkDelete) && (
              <Button 
                size="sm" 
                variant={isBulkMode ? "default" : "outline"}
                onClick={toggleBulkMode}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                {isBulkMode ? "Exit Bulk Mode" : "Bulk Mode"}
              </Button>
            )}
            
            {isBulkMode && selectedItems.length > 0 && canBulkDelete && (
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => setIsBulkDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            )}
            
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Employees</CardTitle>
              <CardDescription>Current workforce</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {employees.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {departments.length} departments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Monthly Payroll</CardTitle>
              <CardDescription>Current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rs. {totalPayroll.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                For {payrollData.length} employees
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Next Payday</CardTitle>
              <CardDescription>Upcoming payment schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                <div className="text-lg font-bold">
                  {new Date(new Date().setDate(new Date().getDate() + 15)).toLocaleDateString()}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                15 days from now
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Employee Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="payroll" className="mb-6" onValueChange={setCurrentTab}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="payroll">Payroll</TabsTrigger>
                  <TabsTrigger value="employees">Employees</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={currentTab === 'employees' ? "Search employees..." : "Search payroll..."}
                      className="w-[200px] pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(department => (
                        <SelectItem key={department} value={department}>{department}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <TabsContent value="payroll" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {isBulkMode && (
                          <TableHead className="w-[50px]">
                            <Checkbox 
                              checked={filteredData.length > 0 && selectedItems.length === filteredData.length} 
                              onCheckedChange={handleToggleSelectAll}
                            />
                          </TableHead>
                        )}
                        <TableHead>Payroll ID</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">Basic Salary</TableHead>
                        <TableHead className="text-right">Overtime</TableHead>
                        <TableHead className="text-right">Bonus</TableHead>
                        <TableHead className="text-right">Deductions</TableHead>
                        <TableHead className="text-right">Net Salary</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((entry: any) => (
                        <TableRow key={entry.id}>
                          {isBulkMode && (
                            <TableCell>
                              <Checkbox 
                                checked={selectedItems.includes(entry.id)} 
                                onCheckedChange={() => handleToggleSelect(entry.id)}
                              />
                            </TableCell>
                          )}
                          <TableCell>{entry.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{entry.employeeName}</div>
                            <div className="text-xs text-muted-foreground">{entry.employeeId}</div>
                          </TableCell>
                          <TableCell>{entry.month}</TableCell>
                          <TableCell className="text-right">Rs. {formatNumber(entry.basicSalary)}</TableCell>
                          <TableCell className="text-right">Rs. {formatNumber(entry.overtime)}</TableCell>
                          <TableCell className="text-right">Rs. {formatNumber(entry.bonus)}</TableCell>
                          <TableCell className="text-right">Rs. {formatNumber(entry.deductions)}</TableCell>
                          <TableCell className="text-right font-bold">Rs. {formatNumber(entry.netSalary)}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {entry.status === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredData.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={isBulkMode ? 10 : 9} className="text-center py-8">
                            No payroll data found. Try adjusting your search or process a new payroll.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="employees" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {isBulkMode && (
                          <TableHead className="w-[50px]">
                            <Checkbox 
                              checked={filteredData.length > 0 && selectedItems.length === filteredData.length} 
                              onCheckedChange={handleToggleSelectAll}
                            />
                          </TableHead>
                        )}
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Joining Date</TableHead>
                        <TableHead className="text-right">Basic Salary</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((employee: any) => (
                        <TableRow key={employee.id}>
                          {isBulkMode && (
                            <TableCell>
                              <Checkbox 
                                checked={selectedItems.includes(employee.id)} 
                                onCheckedChange={() => handleToggleSelect(employee.id)}
                              />
                            </TableCell>
                          )}
                          <TableCell>{employee.id}</TableCell>
                          <TableCell className="font-medium">{employee.name}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              employee.department === 'Production' ? 'bg-blue-100 text-blue-800' : 
                              employee.department === 'Quality' ? 'bg-green-100 text-green-800' :
                              employee.department === 'Logistics' ? 'bg-purple-100 text-purple-800' :
                              employee.department === 'Finance' ? 'bg-amber-100 text-amber-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {employee.department}
                            </span>
                          </TableCell>
                          <TableCell>{employee.joiningDate}</TableCell>
                          <TableCell className="text-right font-medium">Rs. {formatNumber(employee.basicSalary)}</TableCell>
                          <TableCell className="text-right">
                            {!isBulkMode ? (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEditEmployee(employee)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            ) : (
                              <span className="text-center block text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredData.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={isBulkMode ? 8 : 7} className="text-center py-8">
                            No employees found. Try adjusting your search or add new employees.
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

      <EntryDialog
        title="Add New Employee"
        description="Enter employee details to add to the system"
        isOpen={showAddEmployeeDialog}
        onClose={() => setShowAddEmployeeDialog(false)}
        size="lg"
        entityType="employee"
        isCreate={true}
        hideFooter={true}
      >
        <EmployeeForm 
          onSubmit={handleAddEmployee} 
          onCancel={() => setShowAddEmployeeDialog(false)} 
        />
      </EntryDialog>

      <EntryDialog
        title="Edit Employee Information"
        description="Update employee details"
        isOpen={showEditEmployeeDialog}
        onClose={() => setShowEditEmployeeDialog(false)}
        size="lg"
        entityType="employee"
        entityId={selectedEmployee?.id}
        entityName={selectedEmployee?.name}
        isEdit={true}
        hideFooter={true}
      >
        {selectedEmployee && (
          <EmployeeForm 
            defaultValues={convertToFormValues(selectedEmployee)}
            onSubmit={handleUpdateEmployee} 
            onCancel={() => setShowEditEmployeeDialog(false)} 
          />
        )}
      </EntryDialog>

      <EntryDialog
        title="Process Payroll"
        description="Generate payroll for the current period"
        isOpen={showProcessPayrollDialog}
        onClose={() => setShowProcessPayrollDialog(false)}
        size="md"
        entityType="payroll"
        isCreate={true}
        onSave={() => handleProcessPayroll({
          month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
          totalEmployees: employees.length,
          totalAmount: totalPayroll
        })}
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Payroll Period</label>
            <Select defaultValue="current">
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">
                  {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                </SelectItem>
                <SelectItem value="next">
                  {new Date(new Date().setMonth(new Date().getMonth() + 1))
                    .toLocaleString('default', { month: 'long', year: 'numeric' })}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Include Employees</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Select employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept.toLowerCase()}>{dept} Department</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="rounded-md bg-muted/50 p-4">
            <div className="text-sm font-medium mb-2">Summary</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Total Employees:</div>
              <div className="font-medium">{employees.length}</div>
              <div>Estimated Total:</div>
              <div className="font-medium">Rs. {employees.reduce((sum, emp) => sum + (emp.basicSalary || 0), 0).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </EntryDialog>

      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete multiple items</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedItems.length} {currentTab === 'employees' ? 'employees' : 'payroll entries'}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
              Delete {selectedItems.length} items
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Payroll;
