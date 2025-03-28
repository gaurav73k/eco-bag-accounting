
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TooltipGuidance } from '@/components/ui/tooltip-guidance';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface EmployeePayrollFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const EmployeePayrollForm: React.FC<EmployeePayrollFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    employeeId: `EMP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    email: '',
    phone: '',
    department: '',
    position: '',
    joiningDate: '',
    salary: '',
    salaryType: 'monthly',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    taxInfo: '',
    address: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName) {
      toast.error("Please enter employee's name");
      return;
    }
    
    if (!formData.email) {
      toast.error("Please enter employee's email");
      return;
    }
    
    if (!formData.salary) {
      toast.error("Please enter employee's salary");
      return;
    }
    
    const employeeData = {
      ...formData,
      salary: parseFloat(formData.salary),
      fullName: `${formData.firstName} ${formData.lastName}`,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    onSubmit(employeeData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
                <TooltipGuidance content="Employee's first name" />
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
                <TooltipGuidance content="Employee's last name" />
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employeeId">
                Employee ID
                <TooltipGuidance content="Unique employee identifier" />
              </Label>
              <Input
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                disabled
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
                <TooltipGuidance content="Employee's email address" />
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number
                <TooltipGuidance content="Employee's contact number" />
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">
                Address
                <TooltipGuidance content="Employee's residential address" />
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Employment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">
                Department <span className="text-red-500">*</span>
                <TooltipGuidance content="Employee's department" />
              </Label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleSelectChange('department', value)}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="admin">Administration</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">
                Position <span className="text-red-500">*</span>
                <TooltipGuidance content="Employee's job title" />
              </Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="joiningDate">
                Joining Date <span className="text-red-500">*</span>
                <TooltipGuidance content="Employee's first day of work" />
              </Label>
              <Input
                id="joiningDate"
                name="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Salary & Banking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">
                Salary Amount <span className="text-red-500">*</span>
                <TooltipGuidance content="Employee's basic salary amount" />
              </Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                min="0"
                step="0.01"
                value={formData.salary}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salaryType">
                Salary Type <span className="text-red-500">*</span>
                <TooltipGuidance content="How often the employee is paid" />
              </Label>
              <Select
                value={formData.salaryType}
                onValueChange={(value) => handleSelectChange('salaryType', value)}
              >
                <SelectTrigger id="salaryType">
                  <SelectValue placeholder="Select salary type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bankName">
                Bank Name
                <TooltipGuidance content="Name of employee's bank" />
              </Label>
              <Input
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountNumber">
                Account Number
                <TooltipGuidance content="Employee's bank account number" />
              </Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ifscCode">
                IFSC Code
                <TooltipGuidance content="Bank branch IFSC code" />
              </Label>
              <Input
                id="ifscCode"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxInfo">
                Tax Information
                <TooltipGuidance content="Employee's PAN or tax identification" />
              </Label>
              <Input
                id="taxInfo"
                name="taxInfo"
                value={formData.taxInfo}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">
          Additional Notes
          <TooltipGuidance content="Any other relevant information about the employee" />
        </Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Employee
        </Button>
      </div>
    </form>
  );
};

export default EmployeePayrollForm;
