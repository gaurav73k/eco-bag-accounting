import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TooltipGuidance } from '@/components/ui/tooltip-guidance';
import { toast } from 'sonner';

// Mock accounts for demonstration
const accounts = [
  { id: 'ACC-1001', name: 'Cash', type: 'asset' },
  { id: 'ACC-1002', name: 'Bank Account', type: 'asset' },
  { id: 'ACC-2001', name: 'Accounts Receivable', type: 'asset' },
  { id: 'ACC-2002', name: 'Accounts Payable', type: 'liability' },
  { id: 'ACC-3001', name: 'Sales Revenue', type: 'revenue' },
  { id: 'ACC-3002', name: 'Interest Income', type: 'revenue' },
  { id: 'ACC-4001', name: 'Rent Expense', type: 'expense' },
  { id: 'ACC-4002', name: 'Salary Expense', type: 'expense' },
  { id: 'ACC-4003', name: 'Utilities Expense', type: 'expense' },
];

interface LedgerEntryFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const LedgerEntryForm: React.FC<LedgerEntryFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    transactionId: `TXN-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
    date: new Date().toISOString().split('T')[0],
    description: '',
    entries: [
      { accountId: '', type: 'debit', amount: '' },
      { accountId: '', type: 'credit', amount: '' }
    ],
    reference: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEntryChange = (index: number, field: string, value: string) => {
    const updatedEntries = [...formData.entries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    
    // If changing the entry type, toggle the other entry to maintain balance
    if (field === 'type' && index === 0) {
      updatedEntries[1] = { ...updatedEntries[1], type: value === 'debit' ? 'credit' : 'debit' };
    }
    
    setFormData(prev => ({ ...prev, entries: updatedEntries }));
  };

  const handleAmountChange = (index: number, value: string) => {
    const updatedEntries = [...formData.entries];
    updatedEntries[index] = { ...updatedEntries[index], amount: value };
    
    // Update the other entry's amount to match for double-entry bookkeeping
    if (index === 0 && value) {
      updatedEntries[1] = { ...updatedEntries[1], amount: value };
    } else if (index === 1 && value) {
      updatedEntries[0] = { ...updatedEntries[0], amount: value };
    }
    
    setFormData(prev => ({ ...prev, entries: updatedEntries }));
  };

  const validateForm = () => {
    if (!formData.date) {
      toast.error("Please select a transaction date");
      return false;
    }
    
    if (!formData.description) {
      toast.error("Please enter a transaction description");
      return false;
    }
    
    // Check if all accounts are selected
    if (formData.entries.some(entry => !entry.accountId)) {
      toast.error("Please select all accounts for this transaction");
      return false;
    }
    
    // Check if amounts are valid
    if (formData.entries.some(entry => !entry.amount || parseFloat(entry.amount) <= 0)) {
      toast.error("Please enter valid amounts for all entries");
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const ledgerEntry = {
      ...formData,
      entries: formData.entries.map(entry => ({
        ...entry,
        amount: parseFloat(entry.amount),
      })),
      createdAt: new Date().toISOString(),
    };
    
    onSubmit(ledgerEntry);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="transactionId">
            Transaction ID
            <TooltipGuidance content="Unique identifier for this transaction" />
          </Label>
          <Input
            id="transactionId"
            name="transactionId"
            value={formData.transactionId}
            onChange={handleChange}
            disabled
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">
            Date <span className="text-red-500">*</span>
            <TooltipGuidance content="Date of this transaction" />
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
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
            <TooltipGuidance content="Brief description of this transaction" />
          </Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-4 mt-6">
        <div className="flex items-center">
          <h3 className="text-lg font-medium">Transaction Entries</h3>
          <TooltipGuidance 
            content="For double-entry bookkeeping, debits must equal credits" 
            side="right"
          />
        </div>
        
        <div className="space-y-4">
          {formData.entries.map((entry, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 border rounded-md bg-muted/10">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`account-${index}`}>
                  Account <span className="text-red-500">*</span>
                  <TooltipGuidance content="Select the account for this entry" />
                </Label>
                <Select
                  value={entry.accountId}
                  onValueChange={(value) => handleEntryChange(index, 'accountId', value)}
                >
                  <SelectTrigger id={`account-${index}`}>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="" disabled>Select an account</SelectItem>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({account.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`type-${index}`}>
                  Type <span className="text-red-500">*</span>
                  <TooltipGuidance content="Debit or credit entry" />
                </Label>
                <Select
                  value={entry.type}
                  onValueChange={(value) => handleEntryChange(index, 'type', value)}
                >
                  <SelectTrigger id={`type-${index}`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debit">Debit</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`amount-${index}`}>
                  Amount <span className="text-red-500">*</span>
                  <TooltipGuidance content="Amount for this entry" />
                </Label>
                <Input
                  id={`amount-${index}`}
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={entry.amount}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="reference">
            Reference Number
            <TooltipGuidance content="Optional external reference number" />
          </Label>
          <Input
            id="reference"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">
          Notes
          <TooltipGuidance content="Additional information about this transaction" />
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
          Create Journal Entry
        </Button>
      </div>
    </form>
  );
};

export default LedgerEntryForm;
