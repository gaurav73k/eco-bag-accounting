
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Button } from '@/components/ui/button';
import { BarChart4, Filter, Download, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useFiscalYear } from '@/contexts/FiscalYearContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Report Components
import BalanceSheet from '@/components/reports/BalanceSheet';
import CashFlow from '@/components/reports/CashFlow';
import ProfitLoss from '@/components/reports/ProfitLoss';
import TrialBalance from '@/components/reports/TrialBalance';
import GeneralLedger from '@/components/reports/GeneralLedger';
import ExecutiveSummary from '@/components/reports/ExecutiveSummary';
import TaxReturn from '@/components/reports/TaxReturn';
import JournalAudit from '@/components/reports/JournalAudit';
import PartnerLedger from '@/components/reports/PartnerLedger';
import DepreciationSchedule from '@/components/reports/DepreciationSchedule';
import InvoiceAnalysis from '@/components/reports/InvoiceAnalysis';
import AgedReceivables from '@/components/reports/AgedReceivables';
import AgedPayables from '@/components/reports/AgedPayables';
import DeferredRevenue from '@/components/reports/DeferredRevenue';
import DeferredExpense from '@/components/reports/DeferredExpense';
import LoanAnalysis from '@/components/reports/LoanAnalysis';
import LoanReconciliation from '@/components/reports/LoanReconciliation';
import DisallowedExpenses from '@/components/reports/DisallowedExpenses';
import AssetReconciliation from '@/components/reports/AssetReconciliation';
import AnalyticItems from '@/components/reports/AnalyticItems';
import ReportNavigationMenu from '@/components/ReportNavigationMenu';

const Reporting: React.FC = () => {
  const { reportType } = useParams<{ reportType: string }>();
  const navigate = useNavigate();
  const { fiscalYear, changeFiscalYear } = useFiscalYear();
  
  // Handle fiscal year change
  const handleFiscalYearChange = (newYear: string) => {
    changeFiscalYear(newYear);
    toast.success(`Fiscal year changed to ${newYear}`);
  };

  // Render the appropriate report component based on the reportType
  const renderReport = () => {
    switch (reportType) {
      case 'balance-sheet':
        return <BalanceSheet />;
      case 'cash-flow':
        return <CashFlow />;
      case 'profit-loss':
        return <ProfitLoss />;
      case 'trial-balance':
        return <TrialBalance />;
      case 'general-ledger':
        return <GeneralLedger />;
      case 'executive-summary':
        return <ExecutiveSummary />;
      case 'tax-return':
        return <TaxReturn />;
      case 'journal-audit':
        return <JournalAudit />;
      case 'partner-ledger':
        return <PartnerLedger />;
      case 'depreciation-schedule':
        return <DepreciationSchedule />;
      case 'invoice-analysis':
        return <InvoiceAnalysis />;
      case 'aged-receivables':
        return <AgedReceivables />;
      case 'aged-payables':
        return <AgedPayables />;
      case 'deferred-revenue':
        return <DeferredRevenue />;
      case 'deferred-expense':
        return <DeferredExpense />;
      case 'loan-analysis':
        return <LoanAnalysis />;
      case 'loan-reconciliation':
        return <LoanReconciliation />;
      case 'disallowed-expenses':
        return <DisallowedExpenses />;
      case 'asset-reconciliation':
        return <AssetReconciliation />;
      case 'analytic-items':
        return <AnalyticItems />;
      default:
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">Financial Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ReportCard
                title="Balance Sheet"
                description="Assets, liabilities and equity"
                onClick={() => navigate('/reporting/balance-sheet')}
              />
              <ReportCard
                title="Cash Flow"
                description="Cash inflows and outflows"
                onClick={() => navigate('/reporting/cash-flow')}
              />
              <ReportCard
                title="Profit & Loss"
                description="Income, expenses and profitability"
                onClick={() => navigate('/reporting/profit-loss')}
              />
              <ReportCard
                title="Aged Receivables"
                description="Outstanding customer invoices"
                onClick={() => navigate('/reporting/aged-receivables')}
              />
              <ReportCard
                title="Aged Payables"
                description="Outstanding vendor bills"
                onClick={() => navigate('/reporting/aged-payables')}
              />
              <ReportCard
                title="Trial Balance"
                description="List of all general ledger accounts"
                onClick={() => navigate('/reporting/trial-balance')}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title={reportType ? getReportTitle(reportType) : "Financial Reports"} 
          description="Generate and analyze financial reports"
          icon={<BarChart4 className="h-6 w-6" />}
        >
          {reportType && (
            <Button variant="outline" size="sm" onClick={() => navigate('/reporting')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          )}
          <Select value={fiscalYear} onValueChange={handleFiscalYearChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Fiscal Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => toast.info('Export functionality will be implemented soon')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => toast.info('Filter functionality will be implemented soon')}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </PageTitle>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-4">
          {!reportType && (
            <div className="hidden md:block">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-4">Report Categories</h3>
                  <ReportNavigationMenu />
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className={reportType ? "col-span-full" : "col-span-full md:col-span-3"}>
            {renderReport()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper component for report cards
const ReportCard: React.FC<{
  title: string;
  description: string;
  onClick: () => void;
}> = ({ title, description, onClick }) => {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-all" onClick={onClick}>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

// Helper function to get human-readable report title from URL slug
const getReportTitle = (reportType: string): string => {
  const titles: Record<string, string> = {
    'balance-sheet': 'Balance Sheet',
    'cash-flow': 'Cash Flow Statement',
    'profit-loss': 'Profit & Loss',
    'trial-balance': 'Trial Balance',
    'general-ledger': 'General Ledger',
    'executive-summary': 'Executive Summary',
    'tax-return': 'Tax Return',
    'journal-audit': 'Journal Audit',
    'partner-ledger': 'Partner Ledger',
    'depreciation-schedule': 'Depreciation Schedule',
    'invoice-analysis': 'Invoice Analysis',
    'aged-receivables': 'Aged Receivables',
    'aged-payables': 'Aged Payables',
    'deferred-revenue': 'Deferred Revenue',
    'deferred-expense': 'Deferred Expense',
    'loan-analysis': 'Loan Analysis',
    'loan-reconciliation': 'Loan Reconciliation',
    'disallowed-expenses': 'Disallowed Expenses',
    'asset-reconciliation': 'Asset Reconciliation',
    'analytic-items': 'Analytic Items',
  };
  
  return titles[reportType] || 'Report';
};

export default Reporting;
