
import React, { useState } from 'react';
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
  Users, 
  Download, 
  Search, 
  Filter,
  FileText,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportToCSV, getFormattedDate } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

// Mock data for employees
const employees = [
  { id: 'EMP-001', name: 'Rahul Sharma', position: 'Factory Supervisor', department: 'Production', joiningDate: '2020-04-15', basicSalary: 25000 },
  { id: 'EMP-002', name: 'Anjali Patel', position: 'Machine Operator', department: 'Production', joiningDate: '2021-02-10', basicSalary: 18000 },
  { id: 'EMP-003', name: 'Deepak Thapa', position: 'Machine Operator', department: 'Production', joiningDate: '2021-03-22', basicSalary: 18000 },
  { id: 'EMP-004', name: 'Priya Singh', position: 'Machine Operator', department: 'Production', joiningDate: '2021-05-18', basicSalary: 18000 },
  { id: 'EMP-005', name: 'Sanjay Kumar', position: 'Machine Operator', department: 'Production', joiningDate: '2021-08-05', basicSalary: 18000 },
  { id: 'EMP-006', name: 'Meera Gurung', position: 'Quality Control', department: 'Quality', joiningDate: '2022-01-12', basicSalary: 20000 },
  { id: 'EMP-007', name: 'Kamal Basnet', position: 'Delivery Rider', department: 'Logistics', joiningDate: '2022-03-08', basicSalary: 16000 },
  { id: 'EMP-008', name: 'Sunil Tamang', position: 'Delivery Rider', department: 'Logistics', joiningDate: '2022-04-22', basicSalary: 16000 },
  { id: 'EMP-009', name: 'Anita Rai', position: 'Accountant', department: 'Finance', joiningDate: '2020-06-15', basicSalary: 28000 },
  { id: 'EMP-010', name: 'Rajan Shrestha', position: 'Administrative Assistant', department: 'Admin', joiningDate: '2022-02-01', basicSalary: 22000 },
];

// Mock data for payroll
const payrollData = [
  { id: 'PAY-001', employeeId: 'EMP-001', employeeName: 'Rahul Sharma', month: 'June 2023', basicSalary: 25000, overtime: 2000, bonus: 0, deductions: 1500, netSalary: 25500, status: 'paid', paymentDate: '2023-06-30' },
  { id: 'PAY-002', employeeId: 'EMP-002', employeeName: 'Anjali Patel', month: 'June 2023', basicSalary: 18000, overtime: 1200, bonus: 0, deductions: 800, netSalary: 18400, status: 'paid', paymentDate: '2023-06-30' },
  { id: 'PAY-003', employeeId: 'EMP-003', employeeName: 'Deepak Thapa', month: 'June 2023', basicSalary: 18000, overtime: 900, bonus: 0, deductions: 800, netSalary: 18100, status: 'paid', paymentDate: '2023-06-30' },
  { id: 'PAY-004', employeeId: 'EMP-004', employeeName: 'Priya Singh', month: 'June 2023', basicSalary: 18000, overtime: 1500, bonus: 0, deductions: 800, netSalary: 18700, status: 'paid', paymentDate: '2023-06-30' },
  { id: 'PAY-005', employeeId: 'EMP-005', employeeName: 'Sanjay Kumar', month: 'June 2023', basicSalary: 18000, overtime: 800, bonus: 0, deductions: 800, netSalary: 18000, status: 'paid', paymentDate: '2023-06-30' },
  { id: 'PAY-006', employeeId: 'EMP-006', employeeName: 'Meera Gurung', month: 'June 2023', basicSalary: 20000, overtime: 0, bonus: 0, deductions: 1000, netSalary: 19000, status: 'paid', paymentDate: '2023-06-30' },
  { id: 'PAY-007', employeeId: 'EMP-007', employeeName: 'Kamal Basnet', month: 'June 2023', basicSalary: 16000, overtime: 1800, bonus: 500, deductions: 800, netSalary: 17500, status: 'paid', paymentDate: '2023-06-30' },
  { id: 'PAY-008', employeeId: 'EMP-008', employeeName: 'Sunil Tamang', month: 'June 2023', basicSalary: 16000, overtime: 2200, bonus: 500, deductions: 800, netSalary: 17900, status: 'paid', paymentDate: '2023-06-30' },
  { id: 'PAY-009', employeeId: 'EMP-009', employeeName: 'Anita Rai', month: 'June 2023', basicSalary: 28000, overtime: 0, bonus: 0, deductions: 1800, netSalary: 26200, status: 'paid', paymentDate: '2023-06-30' },
  { id: 'PAY-010', employeeId: 'EMP-010', employeeName: 'Rajan Shrestha', month: 'June 2023', basicSalary: 22000, overtime: 0, bonus: 0, deductions: 1200, netSalary: 20800, status: 'paid', paymentDate: '2023-06-30' },
];

// Get unique departments for filtering
const departments = [...new Set(employees.map(employee => employee.department))];

const Payroll: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('payroll');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const { toast } = useToast();

  // Filter data based on search term, current tab, and selected department
  const filteredData = currentTab === 'employees' 
    ? employees.filter(employee => {
        const matchesSearch = 
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.id.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (selectedDepartment === 'all') return matchesSearch;
        return matchesSearch && employee.department === selectedDepartment;
      })
    : payrollData.filter(entry => {
        const matchesSearch = 
          entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
        
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
      
      toast({
        title: "Export Successful",
        description: `Data exported as ${format.toUpperCase()} file.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data.",
        variant: "destructive"
      });
    }
  };

  // Calculate total payroll amount for the month
  const totalPayroll = payrollData.reduce((total, entry) => total + entry.netSalary, 0);

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="Payroll Management" 
          description="Manage employee salaries and benefits"
          icon={<Users className="h-6 w-6" />}
        >
          <div className="flex gap-2">
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              {currentTab === 'employees' ? 'Add Employee' : 'Process Payroll'}
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
              <CardDescription>June 2023</CardDescription>
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
                  July 30, 2023
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
                          <TableCell>{entry.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{entry.employeeName}</div>
                            <div className="text-xs text-muted-foreground">{entry.employeeId}</div>
                          </TableCell>
                          <TableCell>{entry.month}</TableCell>
                          <TableCell className="text-right">Rs. {entry.basicSalary.toLocaleString()}</TableCell>
                          <TableCell className="text-right">Rs. {entry.overtime.toLocaleString()}</TableCell>
                          <TableCell className="text-right">Rs. {entry.bonus.toLocaleString()}</TableCell>
                          <TableCell className="text-right">Rs. {entry.deductions.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-bold">Rs. {entry.netSalary.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {entry.status === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredData.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8">
                            No payroll data found. Try adjusting your search.
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
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Joining Date</TableHead>
                        <TableHead className="text-right">Basic Salary</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((employee: any) => (
                        <TableRow key={employee.id}>
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
                          <TableCell className="text-right font-medium">Rs. {employee.basicSalary.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      {filteredData.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No employees found. Try adjusting your search.
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

export default Payroll;
