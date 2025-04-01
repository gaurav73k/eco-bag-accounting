
import React, { useState } from 'react';
import ReportTemplate from './ReportTemplate';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Printer } from 'lucide-react';
import { getTrialBalanceData } from '@/utils/reportData';
import { useFiscalYear } from '@/contexts/FiscalYearContext';
import { printReport, downloadReport } from '@/utils/reportUtils';

const TrialBalance = () => {
  const { fiscalYear } = useFiscalYear();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get data from central store
  const accounts = getTrialBalanceData();
  
  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(account => 
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.code.includes(searchTerm)
  );
  
  // Calculate totals
  const totalDebit = filteredAccounts.reduce((sum, account) => sum + account.debit, 0);
  const totalCredit = filteredAccounts.reduce((sum, account) => sum + account.credit, 0);
  const isBalanced = totalDebit === totalCredit;

  // Handle print and download
  const handlePrint = () => {
    printReport({
      title: "Trial Balance",
      data: filteredAccounts,
      fiscalYear: fiscalYear
    });
  };

  const handleDownload = () => {
    downloadReport({
      title: "Trial Balance",
      data: filteredAccounts,
      fiscalYear: fiscalYear
    });
  };

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
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-1 h-4 w-4" /> Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-1 h-4 w-4" /> Export
            </Button>
          </div>
        </div>
        
        {accounts.length === 0 ? (
          <div className="p-8 text-center bg-muted/30 rounded-md">
            <p className="text-muted-foreground">No accounts available. Please add accounts and record transactions first.</p>
          </div>
        ) : (
          <>
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
            <div className={`p-4 rounded-lg ${isBalanced ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'}`}>
              <p className="font-medium">
                {isBalanced 
                  ? '✓ The trial balance is balanced. Debit equals credit.' 
                  : '✗ The trial balance is not balanced. Please check your entries.'}
              </p>
            </div>
          </>
        )}
      </div>
    </ReportTemplate>
  );
};

export default TrialBalance;
