
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TooltipGuidance } from '@/components/ui/tooltip-guidance';
import { toast } from 'sonner';

interface ExpenseFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    expenseId: `EXP-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: '',
    vendor: '',
    receipt: '',
    status: 'pending',
    notes: '',
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
    if (!formData.category) {
      toast.error("Please select an expense category");
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid expense amount");
      return;
    }
    
    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      createdAt: new Date().toISOString(),
    };
    
    onSubmit(expenseData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expenseId">
            Expense ID
            <TooltipGuidance content="Unique identifier for this expense" />
          </Label>
          <Input
            id="expenseId"
            name="expenseId"
            value={formData.expenseId}
            onChange={handleChange}
            disabled
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
            <TooltipGuidance content="Type of expense" />
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange('category', value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="office">Office Supplies</SelectItem>
              <SelectItem value="travel">Travel</SelectItem>
              <SelectItem value="meals">Meals & Entertainment</SelectItem>
              <SelectItem value="advertising">Advertising</SelectItem>
              <SelectItem value="insurance">Insurance</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
              <SelectItem value="transport">Transportation</SelectItem>
              <SelectItem value="misc">Miscellaneous</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">
            Amount <span className="text-red-500">*</span>
            <TooltipGuidance content="Cost of the expense" />
          </Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">
            Date <span className="text-red-500">*</span>
            <TooltipGuidance content="When this expense occurred" />
          </Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">
            Payment Method
            <TooltipGuidance content="How this expense was paid" />
          </Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) => handleSelectChange('paymentMethod', value)}
          >
            <SelectTrigger id="paymentMethod">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="credit">Credit Card</SelectItem>
              <SelectItem value="debit">Debit Card</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="vendor">
            Vendor/Payee
            <TooltipGuidance content="Who received this payment" />
          </Label>
          <Input
            id="vendor"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">
            Status
            <TooltipGuidance content="Current status of this expense" />
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="receipt">
            Receipt Reference
            <TooltipGuidance content="Reference number for the receipt" />
          </Label>
          <Input
            id="receipt"
            name="receipt"
            value={formData.receipt}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-red-500">*</span>
          <TooltipGuidance content="Brief description of this expense" />
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">
          Additional Notes
          <TooltipGuidance content="Any other relevant details about this expense" />
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
          Add Expense
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
