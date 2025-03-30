import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TooltipGuidance } from '@/components/ui/tooltip-guidance';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tally1, Tally2, Tally3, Tally4, Tally5 } from 'lucide-react';
import { entryTypes, getAccountSuggestionsByEntryType } from '@/utils/tallyOperations';

// Mock accounts for demonstration - you can replace with your actual accounts data
const allAccounts = [
  { id: 'cash', name: 'Cash', type: 'asset' },
  { id: 'bank', name: 'Bank Account', type: 'asset' },
  { id: 'accounts_receivable', name: 'Accounts Receivable', type: 'asset' },
  { id: 'accounts_payable', name: 'Accounts Payable', type: 'liability' },
  { id: 'inventory', name: 'Inventory', type: 'asset' },
  { id: 'sales', name: 'Sales Revenue', type: 'revenue' },
  { id: 'sales_returns', name: 'Sales Returns', type: 'revenue' },
  { id: 'gst_output', name: 'GST Output', type: 'liability' },
  { id: 'gst_input', name: 'GST Input', type: 'asset' },
  { id: 'purchases', name: 'Purchases', type: 'expense' },
  { id: 'purchase_returns', name: 'Purchase Returns', type: 'expense' },
  { id: 'inventory_loss', name: 'Inventory Loss', type: 'expense' },
  { id: 'rent', name: 'Rent Expense', type: 'expense' },
  { id: 'salary', name: 'Salary Expense', type: 'expense' },
  { id: 'utilities', name: 'Utilities Expense', type: 'expense' },
  { id: 'interest_income', name: 'Interest Income', type: 'revenue' },
];

interface TallyEntryFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialType?: string;
}

const TallyEntryForm: React.FC<TallyEntryFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialType = 'journal'
}) => {
  const [formData, setFormData] = useState({
    transactionId: `TXN-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
    date: new Date().toISOString().split('T')[0],
    entryType: initialType,
    description: '',
    entries: [
      { accountId: '', type: 'debit', amount: '' },
      { accountId: '', type: 'credit', amount: '' }
    ],
    reference: '',
    notes: '',
    partyName: '',
    billNumber: '',
    isGstApplicable: false,
    gstType: 'igst',
    gstRate: '18',
    costCenter: '',
  });

  const [suggestedAccounts, setSuggestedAccounts] = useState<any[]>([]);
  
  // Update suggested accounts when entry type changes
  useEffect(() => {
    const suggestions = getAccountSuggestionsByEntryType(formData.entryType);
    setSuggestedAccounts(suggestions);
  }, [formData.entryType]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleEntryChange = (index: number, field: string, value: string) => {
    const updatedEntries = [...formData.entries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    
    // If changing entry type to debit/credit, adjust the counterpart accordingly
    if (field === 'type') {
      // Find the matching pair index (typically the next entry)
      const pairIndex = index === 0 ? 1 : 0;
      updatedEntries[pairIndex] = { 
        ...updatedEntries[pairIndex], 
        type: value === 'debit' ? 'credit' : 'debit' 
      };
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
  
  const addEntryRow = () => {
    setFormData(prev => ({
      ...prev,
      entries: [...prev.entries, { accountId: '', type: prev.entries.length % 2 === 0 ? 'debit' : 'credit', amount: '' }]
    }));
  };
  
  const removeEntryRow = (index: number) => {
    if (formData.entries.length <= 2) {
      toast.error("A transaction must have at least two entries");
      return;
    }
    
    const updatedEntries = formData.entries.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, entries: updatedEntries }));
  };

  const validateForm = () => {
    if (!formData.date) {
      toast.error("Please select a transaction date");
      return false;
    }
    
    if (!formData.entryType) {
      toast.error("Please select an entry type");
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
    
    // Check if debits equal credits
    const totalDebit = formData.entries
      .filter(entry => entry.type === 'debit')
      .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
      
    const totalCredit = formData.entries
      .filter(entry => entry.type === 'credit')
      .reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
      
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      toast.error("Debits must equal credits in a balanced transaction");
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const tallyEntry = {
      ...formData,
      entries: formData.entries.map(entry => ({
        ...entry,
        amount: parseFloat(entry.amount),
      })),
      createdAt: new Date().toISOString(),
    };
    
    onSubmit(tallyEntry);
  };

  // Helper function to get the appropriate icon for entry types
  const getEntryTypeIcon = (iconName: string) => {
    switch (iconName) {
      case 'tally-1': return <Tally1 className="h-4 w-4" />;
      case 'tally-2': return <Tally2 className="h-4 w-4" />;
      case 'tally-3': return <Tally3 className="h-4 w-4" />;
      case 'tally-4': return <Tally4 className="h-4 w-4" />;
      case 'tally-5': return <Tally5 className="h-4 w-4" />;
      default: return <Tally1 className="h-4 w-4" />;
    }
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="entryType">
          Entry Type <span className="text-red-500">*</span>
          <TooltipGuidance content="Type of accounting entry (affects account suggestions)" />
        </Label>
        <Select 
          value={formData.entryType} 
          onValueChange={(value) => handleSelectChange('entryType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select entry type" />
          </SelectTrigger>
          <SelectContent>
            {entryTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>
                <div className="flex items-center gap-2">
                  {getEntryTypeIcon(type.icon)}
                  <span>{type.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="partyName">
            Party Name
            <TooltipGuidance content="Customer/Vendor name" />
          </Label>
          <Input
            id="partyName"
            name="partyName"
            value={formData.partyName}
            onChange={handleChange}
            placeholder="Enter party name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="billNumber">
            Bill/Invoice No.
            <TooltipGuidance content="Reference invoice or bill number" />
          </Label>
          <Input
            id="billNumber"
            name="billNumber"
            value={formData.billNumber}
            onChange={handleChange}
            placeholder="Enter bill/invoice number"
          />
        </div>
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
          placeholder="E.g., Payment to supplier, Sales to customer, etc."
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="isGstApplicable">
            GST Applicable
            <TooltipGuidance content="Apply GST calculations to this transaction" />
          </Label>
          <input 
            type="checkbox" 
            id="isGstApplicable"
            name="isGstApplicable"
            checked={formData.isGstApplicable}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600"
          />
        </div>
        
        {formData.isGstApplicable && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <Label htmlFor="gstType">GST Type</Label>
              <Select 
                value={formData.gstType} 
                onValueChange={(value) => handleSelectChange('gstType', value)}
              >
                <SelectTrigger id="gstType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="igst">IGST</SelectItem>
                  <SelectItem value="cgst_sgst">CGST & SGST</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="gstRate">GST Rate (%)</Label>
              <Select 
                value={formData.gstRate} 
                onValueChange={(value) => handleSelectChange('gstRate', value)}
              >
                <SelectTrigger id="gstRate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0%</SelectItem>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="12">12%</SelectItem>
                  <SelectItem value="18">18%</SelectItem>
                  <SelectItem value="28">28%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Transaction Entries</h3>
            <TooltipGuidance 
              content="For double-entry bookkeeping, debits must equal credits" 
              side="right"
            />
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={addEntryRow}
          >
            Add Entry
          </Button>
        </div>
        
        <div className="space-y-4">
          {formData.entries.map((entry, index) => (
            <div 
              key={index} 
              className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 border rounded-md bg-muted/10"
            >
              <div className="space-y-2 md:col-span-5">
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
                    
                    {/* Show suggested accounts if available */}
                    {suggestedAccounts.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                          Suggested Accounts
                        </div>
                        {suggestedAccounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} ({account.type})
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground mt-2">
                          All Accounts
                        </div>
                      </>
                    )}
                    
                    {/* List all accounts */}
                    {allAccounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} ({account.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-3">
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
                    <SelectItem value="debit">
                      <Badge variant="outline">Dr</Badge> Debit
                    </SelectItem>
                    <SelectItem value="credit">
                      <Badge variant="outline">Cr</Badge> Credit
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-3">
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
              
              <div className="md:col-span-1 flex items-end justify-center">
                {formData.entries.length > 2 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeEntryRow(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    &times;
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Display totals */}
        <div className="flex justify-end gap-4 pt-2">
          <div className="text-sm">
            <span className="font-medium">Total Debit: </span> 
            Rs. {formData.entries
              .filter(entry => entry.type === 'debit')
              .reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0)
              .toFixed(2)}
          </div>
          <div className="text-sm">
            <span className="font-medium">Total Credit: </span>
            Rs. {formData.entries
              .filter(entry => entry.type === 'credit')
              .reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0)
              .toFixed(2)}
          </div>
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
        
        <div className="space-y-2">
          <Label htmlFor="costCenter">
            Cost Center
            <TooltipGuidance content="Department or cost center for this transaction" />
          </Label>
          <Select 
            value={formData.costCenter} 
            onValueChange={(value) => handleSelectChange('costCenter', value)}
          >
            <SelectTrigger id="costCenter">
              <SelectValue placeholder="Select cost center (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              <SelectItem value="admin">Administration</SelectItem>
              <SelectItem value="sales">Sales Department</SelectItem>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
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
          Create Entry
        </Button>
      </div>
    </form>
  );
};

export default TallyEntryForm;
