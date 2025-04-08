
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTitle from '@/components/PageTitle';
import Layout from '@/components/Layout';
import { useFiscalYear } from '@/contexts/FiscalYearContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, BarChart, CreditCard, LineChart, FileSpreadsheet, Calculator, FileCog } from 'lucide-react';
import { DialogForm } from '@/components/ui/dialog-form';

// Import report components
import BalanceSheet from '@/components/reports/BalanceSheet';
import ProfitLoss from '@/components/reports/ProfitLoss';
import CashFlow from '@/components/reports/CashFlow';
import ExecutiveSummary from '@/components/reports/ExecutiveSummary';
import TaxReturn from '@/components/reports/TaxReturn';
import GeneralLedger from '@/components/reports/GeneralLedger';
import TrialBalance from '@/components/reports/TrialBalance';
import JournalAudit from '@/components/reports/JournalAudit';
import PartnerLedger from '@/components/reports/PartnerLedger';
import AgedReceivables from '@/components/reports/AgedReceivables';
import AgedPayables from '@/components/reports/AgedPayables';
import InvoiceAnalysis from '@/components/reports/InvoiceAnalysis';
import DepreciationSchedule from '@/components/reports/DepreciationSchedule';
import DisallowedExpenses from '@/components/reports/DisallowedExpenses';
import LoanAnalysis from '@/components/reports/LoanAnalysis';
import DeferredRevenue from '@/components/reports/DeferredRevenue';
import DeferredExpense from '@/components/reports/DeferredExpense';
import LoanReconciliation from '@/components/reports/LoanReconciliation';
import AssetReconciliation from '@/components/reports/AssetReconciliation';
import AnalyticItems from '@/components/reports/AnalyticItems';

const Reporting = () => {
  const { fiscalYear } = useFiscalYear();
  const { reportType } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(reportType || "financial");
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Layout>
      <PageTitle title="Reporting & Analysis" description={`Financial Reports for Fiscal Year ${fiscalYear}`} />
      
      <Tabs 
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="w-full flex overflow-x-auto pb-1 mb-6">
          <TabsTrigger value="financial">Financial Statements</TabsTrigger>
          <TabsTrigger value="tax">Tax Reports</TabsTrigger>
          <TabsTrigger value="ledger">Ledger Reports</TabsTrigger>
          <TabsTrigger value="accounts">Accounts Analysis</TabsTrigger>
          <TabsTrigger value="assets">Asset Reports</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>
        
        {/* Financial Statement Reports */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReportCard 
              title="Balance Sheet" 
              icon={<FileText />} 
              description="Statement of financial position" 
              onClick={() => navigate('/reporting/balance-sheet')}
            />
            <ReportCard 
              title="Profit & Loss" 
              icon={<BarChart />} 
              description="Income statement" 
              onClick={() => navigate('/reporting/profit-loss')}
            />
            <ReportCard 
              title="Cash Flow" 
              icon={<CreditCard />} 
              description="Statement of cash flows" 
              onClick={() => navigate('/reporting/cash-flow')}
            />
            <ReportCard 
              title="Executive Summary" 
              icon={<FileSpreadsheet />} 
              description="Key financial metrics" 
              onClick={() => navigate('/reporting/executive-summary')}
            />
          </div>
        </TabsContent>
        
        {/* Tax Reports */}
        <TabsContent value="tax" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReportCard 
              title="Tax Return" 
              icon={<Calculator />} 
              description="Annual tax filing summary" 
              onClick={() => navigate('/reporting/tax-return')}
            />
            <ReportCard 
              title="Disallowed Expenses" 
              icon={<FileCog />} 
              description="Non-deductible expenses" 
              onClick={() => navigate('/reporting/disallowed-expenses')}
            />
          </div>
        </TabsContent>
        
        {/* Ledger Reports */}
        <TabsContent value="ledger" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReportCard 
              title="General Ledger" 
              icon={<FileText />} 
              description="Complete transaction history" 
              onClick={() => navigate('/reporting/general-ledger')}
            />
            <ReportCard 
              title="Trial Balance" 
              icon={<LineChart />} 
              description="Balances of all accounts" 
              onClick={() => navigate('/reporting/trial-balance')}
            />
            <ReportCard 
              title="Journal Audit" 
              icon={<FileSpreadsheet />} 
              description="Audit trail of journal entries" 
              onClick={() => navigate('/reporting/journal-audit')}
            />
            <ReportCard 
              title="Partner Ledger" 
              icon={<FileText />} 
              description="Partner account details" 
              onClick={() => navigate('/reporting/partner-ledger')}
            />
          </div>
        </TabsContent>
        
        {/* Accounts Analysis */}
        <TabsContent value="accounts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReportCard 
              title="Aged Receivables" 
              icon={<BarChart />} 
              description="Outstanding customer payments" 
              onClick={() => navigate('/reporting/aged-receivables')}
            />
            <ReportCard 
              title="Aged Payables" 
              icon={<BarChart />} 
              description="Outstanding vendor payments" 
              onClick={() => navigate('/reporting/aged-payables')}
            />
            <ReportCard 
              title="Invoice Analysis" 
              icon={<FileSpreadsheet />} 
              description="Invoice performance metrics" 
              onClick={() => navigate('/reporting/invoice-analysis')}
            />
            <ReportCard 
              title="Deferred Revenue" 
              icon={<LineChart />} 
              description="Revenue recognition schedule" 
              onClick={() => navigate('/reporting/deferred-revenue')}
            />
            <ReportCard 
              title="Deferred Expense" 
              icon={<LineChart />} 
              description="Expense recognition schedule" 
              onClick={() => navigate('/reporting/deferred-expense')}
            />
            <ReportCard 
              title="Analytic Items" 
              icon={<BarChart />} 
              description="Business performance analytics" 
              onClick={() => navigate('/reporting/analytic-items')}
            />
          </div>
        </TabsContent>
        
        {/* Asset Reports */}
        <TabsContent value="assets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReportCard 
              title="Depreciation Schedule" 
              icon={<LineChart />} 
              description="Asset depreciation details" 
              onClick={() => navigate('/reporting/depreciation-schedule')}
            />
            <ReportCard 
              title="Loan Analysis" 
              icon={<CreditCard />} 
              description="Loan payment details" 
              onClick={() => navigate('/reporting/loan-analysis')}
            />
          </div>
        </TabsContent>
        
        {/* Reconciliation Reports */}
        <TabsContent value="reconciliation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReportCard 
              title="Loan Reconciliation" 
              icon={<CreditCard />} 
              description="Loan balance verification" 
              onClick={() => navigate('/reporting/loan-reconciliation')}
            />
            <ReportCard 
              title="Asset Reconciliation" 
              icon={<FileSpreadsheet />} 
              description="Asset verification" 
              onClick={() => navigate('/reporting/asset-reconciliation')}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Render the appropriate report component based on the reportType parameter */}
      {reportType === 'balance-sheet' && <BalanceSheet />}
      {reportType === 'profit-loss' && <ProfitLoss />}
      {reportType === 'cash-flow' && <CashFlow />}
      {reportType === 'executive-summary' && <ExecutiveSummary />}
      {reportType === 'tax-return' && <TaxReturn />}
      {reportType === 'general-ledger' && <GeneralLedger />}
      {reportType === 'trial-balance' && <TrialBalance />}
      {reportType === 'journal-audit' && <JournalAudit />}
      {reportType === 'partner-ledger' && <PartnerLedger />}
      {reportType === 'aged-receivables' && <AgedReceivables />}
      {reportType === 'aged-payables' && <AgedPayables />}
      {reportType === 'invoice-analysis' && <InvoiceAnalysis />}
      {reportType === 'depreciation-schedule' && <DepreciationSchedule />}
      {reportType === 'disallowed-expenses' && <DisallowedExpenses />}
      {reportType === 'loan-analysis' && <LoanAnalysis />}
      {reportType === 'deferred-revenue' && <DeferredRevenue />}
      {reportType === 'deferred-expense' && <DeferredExpense />}
      {reportType === 'loan-reconciliation' && <LoanReconciliation />}
      {reportType === 'asset-reconciliation' && <AssetReconciliation />}
      {reportType === 'analytic-items' && <AnalyticItems />}
    </Layout>
  );
};

interface ReportCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  onClick: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, icon, description, onClick }) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-6 flex flex-col items-start">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            {icon}
          </div>
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
        <Button variant="link" className="mt-2 p-0">View Report</Button>
      </CardContent>
    </Card>
  );
};

export default Reporting;
