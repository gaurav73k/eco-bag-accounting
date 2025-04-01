
import React, { useState } from 'react';
import ReportTemplate from './ReportTemplate';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Printer } from 'lucide-react';

const TrialBalance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample data - replace with actual data from your API or database
  const accounts = [
    { code: '1100', name: 'Cash', debit: 125000, credit: 0 },
    { code: '1200', name: 'Accounts Receivable', debit: 75000, credit: 0 },
    { code: '1300', name: 'Inventory', debit: 95000, credit: 0 },
    { code: '1400', name: 'Prepaid Expenses', debit: 15000, credit: 0 },
    { code: '1500', name: 'Property and Equipment', debit: 350000, credit: 0 },
    { code: '1600', name: 'Accumulated Depreciation', debit: 0, credit: 87500 },
    { code: '1700', name: 'Intangible Assets', debit: 45000, credit: 0 },
    { code: '1800', name: 'Long-term Investments', debit: 65000, credit: 0 },
    { code: '2100', name: 'Accounts Payable', debit: 0, credit: 65000 },
    { code: '2200', name: 'Short-term Loans', debit: 0, credit: 35000 },
    { code: '2300', name: 'Accrued Expenses', debit: 0, credit: 25000 },
    { code: '2400', name: 'Long-term Debt', debit: 0, credit: 180000 },
    { code: '2500', name: 'Deferred Tax Liabilities', debit: 0, credit: 22500 },
    { code: '3100', name: 'Common Stock', debit: 0, credit: 100000 },
    { code: '3200', name: 'Retained Earnings', debit: 0, credit: 230000 },
    { code: '4100', name: 'Sales Revenue', debit: 0, credit: 850000 },
    { code: '4200', name: 'Service Revenue', debit: 0, credit: 150000 },
    { code: '4300', name: 'Other Revenue', debit: 0, credit: 25000 },
    { code: '5100', name: 'Cost of Goods Sold', debit: 425000, credit: 0 },
    { code: '5200', name: 'Salary Expenses', debit: 175000, credit: 0 },
    { code: '5300', name: 'Rent Expenses', debit: 48000, credit: 0 },
    { code: '5400', name: 'Utilities Expenses', debit: 36000, credit: 0 },
    { code: '5500', name: 'Marketing Expenses', debit: 65000, credit: 0 },
    { code: '5600', name: 'Depreciation Expenses', debit: 35000, credit: 0 },
    { code: '5700', name: 'Other Expenses', debit: 42000, credit: 0 },
  ];
  
  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(account => 
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.code.includes(searchTerm)
  );
  
  // Calculate totals
  const totalDebit = filteredAccounts.reduce((sum, account) => sum + account.debit, 0);
  const totalCredit = filteredAccounts.reduce((sum, account) => sum + account.credit, 0);
  const isBalanced = totalDebit === totalCredit;

  return (
    <ReportTemplate 
      title="Trial Balance"
      description="Listing of all general ledger accounts with their debit or credit balances"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="hidden md:flex space-x-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-1 h-4 w-4" /> Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-1 h-4 w-4" /> Export
            </Button>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%]">Account Code</TableHead>
              <TableHead className="w-[45%]">Account Name</TableHead>
              <TableHead className="text-right">Debit (NPR)</TableHead>
              <TableHead className="text-right">Credit (NPR)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.map((account) => (
              <TableRow key={account.code}>
                <TableCell>{account.code}</TableCell>
                <TableCell>{account.name}</TableCell>
                <TableCell className="text-right font-mono">
                  {account.debit > 0 ? account.debit.toLocaleString() : ''}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {account.credit > 0 ? account.credit.toLocaleString() : ''}
                </TableCell>
              </TableRow>
            ))}
            
            {/* Totals Row */}
            <TableRow className="font-bold border-t-2">
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right font-mono font-bold">
                {totalDebit.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-mono font-bold">
                {totalCredit.toLocaleString()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        {/* Balance status */}
        <div className={`p-4 rounded-lg ${isBalanced ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <p className="font-medium">
            {isBalanced 
              ? '✓ The trial balance is balanced. Debit equals credit.' 
              : '✗ The trial balance is not balanced. Please check your entries.'}
          </p>
        </div>
      </div>
    </ReportTemplate>
  );
};

export default TrialBalance;
