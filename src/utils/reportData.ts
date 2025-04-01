
/**
 * Central data store for financial reports
 * This provides a single source of truth for all reporting components
 */

// Account data structure shared across reports
export interface Account {
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance: number;
}

// Central accounts data store
export const accounts: Account[] = [
  { code: '1100', name: 'Cash', type: 'asset', balance: 125000 },
  { code: '1200', name: 'Accounts Receivable', type: 'asset', balance: 75000 },
  { code: '1300', name: 'Inventory', type: 'asset', balance: 95000 },
  { code: '1400', name: 'Prepaid Expenses', type: 'asset', balance: 15000 },
  { code: '1500', name: 'Property and Equipment', type: 'asset', balance: 350000 },
  { code: '1600', name: 'Accumulated Depreciation', type: 'asset', balance: -87500 },
  { code: '1700', name: 'Intangible Assets', type: 'asset', balance: 45000 },
  { code: '1800', name: 'Long-term Investments', type: 'asset', balance: 65000 },
  { code: '2100', name: 'Accounts Payable', type: 'liability', balance: 65000 },
  { code: '2200', name: 'Short-term Loans', type: 'liability', balance: 35000 },
  { code: '2300', name: 'Accrued Expenses', type: 'liability', balance: 25000 },
  { code: '2400', name: 'Long-term Debt', type: 'liability', balance: 180000 },
  { code: '2500', name: 'Deferred Tax Liabilities', type: 'liability', balance: 22500 },
  { code: '3100', name: 'Common Stock', type: 'equity', balance: 100000 },
  { code: '3200', name: 'Retained Earnings', type: 'equity', balance: 230000 },
  { code: '4100', name: 'Sales Revenue', type: 'revenue', balance: 850000 },
  { code: '4200', name: 'Service Revenue', type: 'revenue', balance: 150000 },
  { code: '4300', name: 'Other Revenue', type: 'revenue', balance: 25000 },
  { code: '5100', name: 'Cost of Goods Sold', type: 'expense', balance: 425000 },
  { code: '5200', name: 'Salary Expenses', type: 'expense', balance: 175000 },
  { code: '5300', name: 'Rent Expenses', type: 'expense', balance: 48000 },
  { code: '5400', name: 'Utilities Expenses', type: 'expense', balance: 36000 },
  { code: '5500', name: 'Marketing Expenses', type: 'expense', balance: 65000 },
  { code: '5600', name: 'Depreciation Expenses', type: 'expense', balance: 35000 },
  { code: '5700', name: 'Other Expenses', type: 'expense', balance: 42000 },
];

// Cash flow data
export interface CashFlowItem {
  name: string;
  amount: number;
  isSubtotal: boolean;
}

export interface CashFlowData {
  operating: CashFlowItem[];
  investing: CashFlowItem[];
  financing: CashFlowItem[];
}

export const cashFlowData: CashFlowData = {
  operating: [
    { name: 'Net Income', amount: 249000, isSubtotal: false },
    { name: 'Depreciation and Amortization', amount: 35000, isSubtotal: false },
    { name: 'Decrease in Accounts Receivable', amount: 18000, isSubtotal: false },
    { name: 'Increase in Inventory', amount: -25000, isSubtotal: false },
    { name: 'Increase in Accounts Payable', amount: 12000, isSubtotal: false },
  ],
  investing: [
    { name: 'Purchase of Property and Equipment', amount: -120000, isSubtotal: false },
    { name: 'Sale of Investments', amount: 35000, isSubtotal: false },
  ],
  financing: [
    { name: 'Proceeds from Long-term Debt', amount: 75000, isSubtotal: false },
    { name: 'Dividend Payments', amount: -45000, isSubtotal: false },
  ]
};

// Monthly financial data
export const monthlyData = [
  { month: 'Jan', revenue: 75000, expenses: 60000, profit: 15000, operating: 22500, investing: -8000, financing: 5000, net: 19500 },
  { month: 'Feb', revenue: 78000, expenses: 62000, profit: 16000, operating: 24000, investing: -10000, financing: 0, net: 14000 },
  { month: 'Mar', revenue: 82000, expenses: 64000, profit: 18000, operating: 26500, investing: -12000, financing: 0, net: 14500 },
  { month: 'Apr', revenue: 85000, expenses: 65000, profit: 20000, operating: 25000, investing: -15000, financing: 10000, net: 20000 },
  { month: 'May', revenue: 88000, expenses: 66000, profit: 22000, operating: 28000, investing: -20000, financing: 0, net: 8000 },
  { month: 'Jun', revenue: 90000, expenses: 67000, profit: 23000, operating: 30000, investing: -5000, financing: 0, net: 25000 },
  { month: 'Jul', revenue: 91000, expenses: 68000, profit: 23000, operating: 32000, investing: -10000, financing: 0, net: 22000 },
  { month: 'Aug', revenue: 89000, expenses: 67000, profit: 22000, operating: 30000, investing: -15000, financing: 15000, net: 30000 },
  { month: 'Sep', revenue: 87000, expenses: 66000, profit: 21000, operating: 28000, investing: -5000, financing: 0, net: 23000 },
  { month: 'Oct', revenue: 85000, expenses: 65000, profit: 20000, operating: 26000, investing: -10000, financing: 0, net: 16000 },
  { month: 'Nov', revenue: 86000, expenses: 64000, profit: 22000, operating: 24000, investing: -5000, financing: 0, net: 19000 },
  { month: 'Dec', revenue: 89000, expenses: 62000, profit: 27000, operating: 31500, investing: -5000, financing: 45000, net: 71500 },
];

// Helper functions to prepare data for financial reports

/**
 * Get balance sheet data from accounts
 */
export const getBalanceSheetData = () => {
  // Assets categories
  const currentAssets = accounts.filter(account => 
    account.code.startsWith('1') && 
    parseInt(account.code) < 1500 && 
    account.type === 'asset'
  ).map(account => ({
    name: account.name, 
    amount: Math.abs(account.balance) * (account.balance < 0 ? -1 : 1)
  }));
  
  const fixedAssets = accounts.filter(account => 
    account.code.startsWith('15') || account.code.startsWith('16') && 
    account.type === 'asset'
  ).map(account => ({
    name: account.name, 
    amount: Math.abs(account.balance) * (account.balance < 0 ? -1 : 1)
  }));
  
  const otherAssets = accounts.filter(account => 
    parseInt(account.code) >= 1700 && 
    account.type === 'asset'
  ).map(account => ({
    name: account.name, 
    amount: Math.abs(account.balance) * (account.balance < 0 ? -1 : 1)
  }));
  
  // Liabilities and Equity categories
  const currentLiabilities = accounts.filter(account => 
    account.code.startsWith('2') && 
    parseInt(account.code) < 2400 && 
    account.type === 'liability'
  ).map(account => ({
    name: account.name, 
    amount: Math.abs(account.balance)
  }));
  
  const longTermLiabilities = accounts.filter(account => 
    parseInt(account.code) >= 2400 && 
    account.type === 'liability'
  ).map(account => ({
    name: account.name, 
    amount: Math.abs(account.balance)
  }));
  
  const equity = accounts.filter(account => 
    account.type === 'equity'
  ).map(account => ({
    name: account.name, 
    amount: Math.abs(account.balance)
  }));
  
  return {
    assets: [
      { category: 'Current Assets', items: currentAssets },
      { category: 'Fixed Assets', items: fixedAssets },
      { category: 'Other Assets', items: otherAssets },
    ],
    liabilitiesAndEquity: [
      { category: 'Current Liabilities', items: currentLiabilities },
      { category: 'Long-term Liabilities', items: longTermLiabilities },
      { category: 'Equity', items: equity },
    ]
  };
};

/**
 * Get profit and loss data from accounts
 */
export const getProfitLossData = () => {
  // Revenue categories
  const revenue = accounts.filter(account => 
    account.type === 'revenue'
  ).map(account => ({
    name: account.name, 
    amount: Math.abs(account.balance)
  }));
  
  // Expense categories
  const expenses = accounts.filter(account => 
    account.type === 'expense'
  ).map(account => ({
    name: account.name, 
    amount: Math.abs(account.balance)
  }));
  
  return {
    revenue,
    expenses
  };
};

/**
 * Get trial balance data from accounts
 */
export const getTrialBalanceData = () => {
  return accounts.map(account => {
    if (account.type === 'asset' || account.type === 'expense') {
      return {
        code: account.code,
        name: account.name,
        debit: account.balance > 0 ? Math.abs(account.balance) : 0,
        credit: account.balance < 0 ? Math.abs(account.balance) : 0
      };
    } else {
      return {
        code: account.code,
        name: account.name,
        debit: account.balance < 0 ? Math.abs(account.balance) : 0,
        credit: account.balance > 0 ? Math.abs(account.balance) : 0
      };
    }
  });
};

/**
 * Get cash flow data
 */
export const getCashFlowData = () => {
  return cashFlowData;
};
