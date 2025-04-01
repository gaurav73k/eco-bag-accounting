import React from 'react';
import ReportTemplate from './ReportTemplate';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { useFiscalYear } from '@/contexts/FiscalYearContext';
import { printReport, downloadReport } from '@/utils/reportUtils';

const TaxReturn = () => {
  const { fiscalYear } = useFiscalYear();

  // Empty tax data structure
  const taxData = {
    taxableIncome: 0,
    corporateTaxRate: 0,
    corporateTaxAmount: 0,
    deductions: [],
    adjustments: []
  };

  // Handle print and download - wrap object in an array to match expected type
  const handlePrint = () => {
    printReport({
      title: "Tax Return",
      data: [taxData], // Wrap in array to match expected type
      fiscalYear: Number(fiscalYear) // Convert to number
    });
  };

  const handleDownload = () => {
    downloadReport({
      title: "Tax Return",
      data: [taxData], // Wrap in array to match expected type
      fiscalYear: Number(fiscalYear) // Convert to number
    });
  };

  return (
    <ReportTemplate 
      title="Tax Return" 
      description="Annual tax filing summary and tax calculation"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-1 h-4 w-4" /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-1 h-4 w-4" /> Export
          </Button>
        </>
      }
    >
      <div className="space-y-4 py-6">
        <h3 className="text-xl font-semibold">Tax Return Summary</h3>
        <p className="text-muted-foreground">Fiscal Year {fiscalYear}</p>
        
        {taxData.taxableIncome === 0 ? (
          <div className="p-8 text-center bg-muted/30 rounded-md">
            <p className="text-muted-foreground">No tax data available. Please record income and expenses first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <div className="flex justify-between p-4 bg-muted/50 rounded-md">
                <span>Taxable Income:</span>
                <span className="font-medium">{taxData.taxableIncome.toLocaleString()} NPR</span>
              </div>
              <div className="flex justify-between p-4 bg-muted/50 rounded-md">
                <span>Corporate Tax Rate:</span>
                <span className="font-medium">{(taxData.corporateTaxRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between p-4 bg-primary/10 rounded-md font-semibold">
                <span>Corporate Tax Due:</span>
                <span>{taxData.corporateTaxAmount.toLocaleString()} NPR</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Tax Deductions & Adjustments</h4>
              
              {taxData.deductions.length > 0 ? (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-muted-foreground">Deductions</h5>
                  {taxData.deductions.map((item, i) => (
                    <div key={i} className="flex justify-between p-2 border-b">
                      <span>{item.name}:</span>
                      <span>{item.amount.toLocaleString()} NPR</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground p-2">No deductions recorded</div>
              )}
              
              {taxData.adjustments.length > 0 ? (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-muted-foreground">Adjustments</h5>
                  {taxData.adjustments.map((item, i) => (
                    <div key={i} className="flex justify-between p-2 border-b">
                      <span>{item.name}:</span>
                      <span 
                        className={item.amount < 0 ? "text-red-600" : undefined}
                      >{item.amount.toLocaleString()} NPR</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground p-2">No adjustments recorded</div>
              )}
            </div>
          </div>
        )}
      </div>
    </ReportTemplate>
  );
};

export default TaxReturn;
