
import { toast } from 'sonner';
import { exportToCSV, getFormattedDate } from '@/utils/exportUtils';

/**
 * Utility functions for report operations
 */

interface ReportData {
  title: string;
  data: any[];
  fiscalYear: number;
}

/**
 * Generate a printable view of a report and trigger browser print
 */
export const printReport = (reportData: ReportData): void => {
  try {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast.error("Unable to open print window. Please check your pop-up settings.");
      return;
    }
    
    // Generate HTML content for the print window
    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${reportData.title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .report-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
          }
          .report-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
          }
          h1 {
            color: #333;
            margin-bottom: 10px;
          }
          .fiscal-year {
            font-size: 16px;
            color: #666;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th, td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .category-header {
            background-color: #f9f9f9;
            font-weight: bold;
          }
          .total-row {
            font-weight: bold;
            border-top: 2px solid #ddd;
          }
          .amount {
            text-align: right;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          @media print {
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="report-header">
            <h1>${reportData.title}</h1>
            <div class="fiscal-year">Fiscal Year ${reportData.fiscalYear}</div>
            <div>NPL Accounts</div>
          </div>
          
          <div id="report-content">
            ${generateReportContent(reportData)}
          </div>
          
          <div class="footer">
            <p>Report generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="no-print" style="margin-top: 30px; text-align: center;">
            <button onclick="window.print();" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; cursor: pointer; font-size: 16px;">
              Print Report
            </button>
          </div>
        </div>
        <script>
          // Automatically trigger print dialog when the page loads
          window.onload = function() {
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;
    
    // Write content to the new window
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  } catch (error) {
    console.error('Failed to print report:', error);
    toast.error('Failed to print report');
  }
};

/**
 * Helper function to generate the HTML content for different report types
 */
const generateReportContent = (reportData: ReportData): string => {
  // Extract data based on report type/structure
  switch(reportData.title) {
    case "Balance Sheet":
      return generateBalanceSheetContent(reportData.data);
    case "Profit & Loss Statement":
      return generateProfitLossContent(reportData.data);
    case "Cash Flow Statement":
      return generateCashFlowContent(reportData.data);
    case "Trial Balance":
      return generateTrialBalanceContent(reportData.data);
    default:
      return `<p>No specialized format available for this report type.</p>`;
  }
};

const generateBalanceSheetContent = (data: any): string => {
  const { assets, liabilitiesAndEquity } = data;
  const totalAssets = calculateTotalFromCategories(assets);
  const totalLiabilitiesAndEquity = calculateTotalFromCategories(liabilitiesAndEquity);

  return `
    <h2>Assets</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 60%">Description</th>
          <th style="width: 40%" class="amount">Amount (NPR)</th>
        </tr>
      </thead>
      <tbody>
        ${assets.map(category => `
          <tr class="category-header">
            <td>${category.category}</td>
            <td></td>
          </tr>
          ${category.items.map(item => `
            <tr>
              <td style="padding-left: 30px">${item.name}</td>
              <td class="amount">${item.amount.toLocaleString()}</td>
            </tr>
          `).join('')}
        `).join('')}
        <tr class="total-row">
          <td>Total Assets</td>
          <td class="amount">${totalAssets.toLocaleString()} NPR</td>
        </tr>
      </tbody>
    </table>
    
    <h2>Liabilities & Equity</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 60%">Description</th>
          <th style="width: 40%" class="amount">Amount (NPR)</th>
        </tr>
      </thead>
      <tbody>
        ${liabilitiesAndEquity.map(category => `
          <tr class="category-header">
            <td>${category.category}</td>
            <td></td>
          </tr>
          ${category.items.map(item => `
            <tr>
              <td style="padding-left: 30px">${item.name}</td>
              <td class="amount">${item.amount.toLocaleString()}</td>
            </tr>
          `).join('')}
        `).join('')}
        <tr class="total-row">
          <td>Total Liabilities & Equity</td>
          <td class="amount">${totalLiabilitiesAndEquity.toLocaleString()} NPR</td>
        </tr>
      </tbody>
    </table>
  `;
};

const generateProfitLossContent = (data: any): string => {
  const { revenue, expenses } = data;
  const totalRevenue = revenue.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  return `
    <h2>Revenue</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 60%">Description</th>
          <th style="width: 40%" class="amount">Amount (NPR)</th>
        </tr>
      </thead>
      <tbody>
        ${revenue.map(item => `
          <tr>
            <td>${item.name}</td>
            <td class="amount">${item.amount.toLocaleString()}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td>Total Revenue</td>
          <td class="amount">${totalRevenue.toLocaleString()} NPR</td>
        </tr>
      </tbody>
    </table>
    
    <h2>Expenses</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 60%">Description</th>
          <th style="width: 40%" class="amount">Amount (NPR)</th>
        </tr>
      </thead>
      <tbody>
        ${expenses.map(item => `
          <tr>
            <td>${item.name}</td>
            <td class="amount">${item.amount.toLocaleString()}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td>Total Expenses</td>
          <td class="amount">${totalExpenses.toLocaleString()} NPR</td>
        </tr>
      </tbody>
    </table>
    
    <h2>Net Income</h2>
    <table>
      <tbody>
        <tr class="total-row">
          <td style="width: 60%">Net Income</td>
          <td style="width: 40%" class="amount ${netIncome >= 0 ? 'positive' : 'negative'}">${netIncome.toLocaleString()} NPR</td>
        </tr>
      </tbody>
    </table>
  `;
};

const generateCashFlowContent = (data: any): string => {
  const { operating, investing, financing } = data;
  const operatingTotal = operating.reduce((sum, item) => sum + item.amount, 0);
  const investingTotal = investing.reduce((sum, item) => sum + item.amount, 0);
  const financingTotal = financing.reduce((sum, item) => sum + item.amount, 0);
  const netCashFlow = operatingTotal + investingTotal + financingTotal;

  return `
    <h2>Operating Activities</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 60%">Description</th>
          <th style="width: 40%" class="amount">Amount (NPR)</th>
        </tr>
      </thead>
      <tbody>
        ${operating.map(item => `
          <tr>
            <td>${item.name}</td>
            <td class="amount">${item.amount.toLocaleString()}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td>Net Cash from Operating Activities</td>
          <td class="amount">${operatingTotal.toLocaleString()} NPR</td>
        </tr>
      </tbody>
    </table>
    
    <h2>Investing Activities</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 60%">Description</th>
          <th style="width: 40%" class="amount">Amount (NPR)</th>
        </tr>
      </thead>
      <tbody>
        ${investing.map(item => `
          <tr>
            <td>${item.name}</td>
            <td class="amount">${item.amount.toLocaleString()}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td>Net Cash from Investing Activities</td>
          <td class="amount">${investingTotal.toLocaleString()} NPR</td>
        </tr>
      </tbody>
    </table>
    
    <h2>Financing Activities</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 60%">Description</th>
          <th style="width: 40%" class="amount">Amount (NPR)</th>
        </tr>
      </thead>
      <tbody>
        ${financing.map(item => `
          <tr>
            <td>${item.name}</td>
            <td class="amount">${item.amount.toLocaleString()}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td>Net Cash from Financing Activities</td>
          <td class="amount">${financingTotal.toLocaleString()} NPR</td>
        </tr>
      </tbody>
    </table>
    
    <h2>Summary</h2>
    <table>
      <tbody>
        <tr class="total-row">
          <td style="width: 60%">Net Change in Cash</td>
          <td style="width: 40%" class="amount ${netCashFlow >= 0 ? 'positive' : 'negative'}">${netCashFlow.toLocaleString()} NPR</td>
        </tr>
      </tbody>
    </table>
  `;
};

const generateTrialBalanceContent = (data: any): string => {
  const totalDebit = data.reduce((sum, account) => sum + account.debit, 0);
  const totalCredit = data.reduce((sum, account) => sum + account.credit, 0);

  return `
    <table>
      <thead>
        <tr>
          <th>Account Code</th>
          <th>Account Name</th>
          <th class="amount">Debit (NPR)</th>
          <th class="amount">Credit (NPR)</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(account => `
          <tr>
            <td>${account.code}</td>
            <td>${account.name}</td>
            <td class="amount">${account.debit > 0 ? account.debit.toLocaleString() : ''}</td>
            <td class="amount">${account.credit > 0 ? account.credit.toLocaleString() : ''}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td colspan="2">Total</td>
          <td class="amount">${totalDebit.toLocaleString()}</td>
          <td class="amount">${totalCredit.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
    
    <div style="margin-top: 20px;">
      <p style="font-weight: bold; ${totalDebit === totalCredit ? 'color: green;' : 'color: red;'}">
        ${totalDebit === totalCredit 
          ? '✓ The trial balance is balanced. Debit equals credit.' 
          : '✗ The trial balance is not balanced. Please check your entries.'}
      </p>
    </div>
  `;
};

/**
 * Helper function to calculate total from categories with items
 */
const calculateTotalFromCategories = (categories: any[]): number => {
  return categories.reduce((total, category) => {
    const categoryTotal = category.items.reduce((catTotal: number, item: any) => catTotal + item.amount, 0);
    return total + categoryTotal;
  }, 0);
};

/**
 * Export report data to CSV
 */
export const downloadReport = (reportData: ReportData): void => {
  try {
    let csvData: any[] = [];
    
    switch(reportData.title) {
      case "Balance Sheet":
        csvData = prepareBalanceSheetCSV(reportData.data);
        break;
      case "Profit & Loss Statement":
        csvData = prepareProfitLossCSV(reportData.data);
        break;
      case "Cash Flow Statement":
        csvData = prepareCashFlowCSV(reportData.data);
        break;
      case "Trial Balance":
        csvData = prepareTrialBalanceCSV(reportData.data);
        break;
      default:
        csvData = reportData.data;
    }
    
    exportToCSV(csvData, `${reportData.title.toLowerCase().replace(/\s+/g, '-')}-${getFormattedDate()}`);
    toast.success(`${reportData.title} downloaded successfully`);
  } catch (error) {
    console.error('Failed to download report:', error);
    toast.error('Failed to download report');
  }
};

/**
 * Prepare CSV data for Balance Sheet
 */
const prepareBalanceSheetCSV = (data: any): any[] => {
  const { assets, liabilitiesAndEquity } = data;
  const csvData = [];
  
  // Add header row
  csvData.push({
    'Type': 'BALANCE SHEET',
    'Category': '',
    'Name': '',
    'Amount': '',
  });
  
  // Add assets data
  csvData.push({
    'Type': 'ASSETS',
    'Category': '',
    'Name': '',
    'Amount': '',
  });
  
  assets.forEach(category => {
    csvData.push({
      'Type': 'Assets',
      'Category': category.category,
      'Name': '',
      'Amount': '',
    });
    
    category.items.forEach(item => {
      csvData.push({
        'Type': '',
        'Category': '',
        'Name': item.name,
        'Amount': item.amount,
      });
    });
  });
  
  // Add total assets row
  const totalAssets = calculateTotalFromCategories(assets);
  csvData.push({
    'Type': 'Assets',
    'Category': 'TOTAL ASSETS',
    'Name': '',
    'Amount': totalAssets,
  });
  
  // Add empty row as separator
  csvData.push({
    'Type': '',
    'Category': '',
    'Name': '',
    'Amount': '',
  });
  
  // Add liabilities and equity data
  csvData.push({
    'Type': 'LIABILITIES & EQUITY',
    'Category': '',
    'Name': '',
    'Amount': '',
  });
  
  liabilitiesAndEquity.forEach(category => {
    csvData.push({
      'Type': 'Liabilities & Equity',
      'Category': category.category,
      'Name': '',
      'Amount': '',
    });
    
    category.items.forEach(item => {
      csvData.push({
        'Type': '',
        'Category': '',
        'Name': item.name,
        'Amount': item.amount,
      });
    });
  });
  
  // Add total liabilities and equity row
  const totalLiabilitiesAndEquity = calculateTotalFromCategories(liabilitiesAndEquity);
  csvData.push({
    'Type': 'Liabilities & Equity',
    'Category': 'TOTAL LIABILITIES & EQUITY',
    'Name': '',
    'Amount': totalLiabilitiesAndEquity,
  });
  
  return csvData;
};

/**
 * Prepare CSV data for Profit & Loss
 */
const prepareProfitLossCSV = (data: any): any[] => {
  const { revenue, expenses } = data;
  const csvData = [];
  const totalRevenue = revenue.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const netIncome = totalRevenue - totalExpenses;
  
  // Add header row
  csvData.push({
    'Type': 'PROFIT & LOSS STATEMENT',
    'Name': '',
    'Amount': '',
  });
  
  // Add revenue data
  csvData.push({
    'Type': 'REVENUE',
    'Name': '',
    'Amount': '',
  });
  
  revenue.forEach(item => {
    csvData.push({
      'Type': 'Revenue',
      'Name': item.name,
      'Amount': item.amount,
    });
  });
  
  // Add total revenue row
  csvData.push({
    'Type': 'Revenue',
    'Name': 'TOTAL REVENUE',
    'Amount': totalRevenue,
  });
  
  // Add empty row as separator
  csvData.push({
    'Type': '',
    'Name': '',
    'Amount': '',
  });
  
  // Add expenses data
  csvData.push({
    'Type': 'EXPENSES',
    'Name': '',
    'Amount': '',
  });
  
  expenses.forEach(item => {
    csvData.push({
      'Type': 'Expenses',
      'Name': item.name,
      'Amount': item.amount,
    });
  });
  
  // Add total expenses row
  csvData.push({
    'Type': 'Expenses',
    'Name': 'TOTAL EXPENSES',
    'Amount': totalExpenses,
  });
  
  // Add empty row as separator
  csvData.push({
    'Type': '',
    'Name': '',
    'Amount': '',
  });
  
  // Add net income
  csvData.push({
    'Type': 'SUMMARY',
    'Name': 'NET INCOME',
    'Amount': netIncome,
  });
  
  return csvData;
};

/**
 * Prepare CSV data for Cash Flow
 */
const prepareCashFlowCSV = (data: any): any[] => {
  const { operating, investing, financing } = data;
  const csvData = [];
  const operatingTotal = operating.reduce((sum, item) => sum + item.amount, 0);
  const investingTotal = investing.reduce((sum, item) => sum + item.amount, 0);
  const financingTotal = financing.reduce((sum, item) => sum + item.amount, 0);
  const netCashFlow = operatingTotal + investingTotal + financingTotal;
  
  // Add header row
  csvData.push({
    'Type': 'CASH FLOW STATEMENT',
    'Category': '',
    'Name': '',
    'Amount': '',
  });
  
  // Add operating activities
  csvData.push({
    'Type': 'OPERATING ACTIVITIES',
    'Category': '',
    'Name': '',
    'Amount': '',
  });
  
  operating.forEach(item => {
    csvData.push({
      'Type': 'Operating',
      'Category': '',
      'Name': item.name,
      'Amount': item.amount,
    });
  });
  
  csvData.push({
    'Type': 'Operating',
    'Category': 'NET CASH FROM OPERATING ACTIVITIES',
    'Name': '',
    'Amount': operatingTotal,
  });
  
  // Add empty row as separator
  csvData.push({
    'Type': '',
    'Category': '',
    'Name': '',
    'Amount': '',
  });
  
  // Add investing activities
  csvData.push({
    'Type': 'INVESTING ACTIVITIES',
    'Category': '',
    'Name': '',
    'Amount': '',
  });
  
  investing.forEach(item => {
    csvData.push({
      'Type': 'Investing',
      'Category': '',
      'Name': item.name,
      'Amount': item.amount,
    });
  });
  
  csvData.push({
    'Type': 'Investing',
    'Category': 'NET CASH FROM INVESTING ACTIVITIES',
    'Name': '',
    'Amount': investingTotal,
  });
  
  // Add empty row as separator
  csvData.push({
    'Type': '',
    'Category': '',
    'Name': '',
    'Amount': '',
  });
  
  // Add financing activities
  csvData.push({
    'Type': 'FINANCING ACTIVITIES',
    'Category': '',
    'Name': '',
    'Amount': '',
  });
  
  financing.forEach(item => {
    csvData.push({
      'Type': 'Financing',
      'Category': '',
      'Name': item.name,
      'Amount': item.amount,
    });
  });
  
  csvData.push({
    'Type': 'Financing',
    'Category': 'NET CASH FROM FINANCING ACTIVITIES',
    'Name': '',
    'Amount': financingTotal,
  });
  
  // Add empty row as separator
  csvData.push({
    'Type': '',
    'Category': '',
    'Name': '',
    'Amount': '',
  });
  
  // Add summary
  csvData.push({
    'Type': 'SUMMARY',
    'Category': 'NET CHANGE IN CASH',
    'Name': '',
    'Amount': netCashFlow,
  });
  
  return csvData;
};

/**
 * Prepare CSV data for Trial Balance
 */
const prepareTrialBalanceCSV = (data: any): any[] => {
  const csvData = [];
  
  // Add header row
  csvData.push({
    'Type': 'TRIAL BALANCE',
    'Account Code': '',
    'Account Name': '',
    'Debit': '',
    'Credit': '',
  });
  
  // Add account data
  data.forEach(account => {
    csvData.push({
      'Type': '',
      'Account Code': account.code,
      'Account Name': account.name,
      'Debit': account.debit,
      'Credit': account.credit,
    });
  });
  
  // Add total row
  const totalDebit = data.reduce((sum, account) => sum + account.debit, 0);
  const totalCredit = data.reduce((sum, account) => sum + account.credit, 0);
  
  csvData.push({
    'Type': 'TOTAL',
    'Account Code': '',
    'Account Name': '',
    'Debit': totalDebit,
    'Credit': totalCredit,
  });
  
  return csvData;
};
