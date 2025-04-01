
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

// Central accounts data store - empty initially
export const accounts: Account[] = [];

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
  operating: [],
  investing: [],
  financing: []
};

// Monthly financial data - empty initially
export const monthlyData = [
  { month: 'Jan', revenue: 0, expenses: 0, profit: 0, operating: 0, investing: 0, financing: 0, net: 0 },
  { month: 'Feb', revenue: 0, expenses: 0, profit: 0, operating: 0, investing: 0, financing: 0, net: 0 },
  { month: 'Mar', revenue: 0, expenses: 0, profit: 0, operating: 0, investing: 0, financing: 0, net: 0 },
  { month: 'Apr', revenue: 0, expenses: 0, profit: 0, operating: 0, investing: 0, financing: 0, net: 0 },
  { month: 'May', revenue: 0, expenses: 0, profit: 0, operating: 0, investing: 0, financing: 0, net: 0 },
  { month: 'Jun', revenue: 0, expenses: 0, profit: 0, operating: 0, investing: 0, financing: 0, net: 0 },
  { month: 'Jul', revenue: 0, expenses: 0, profit: 0, operating: 0, investing: 0, financing: 0, net: 0 },
  { month: 'Aug', revenue: 0, expenses: 0, profit: 0, operating: 0, investing: 0, financing: 0, net: 0 },
  { month: 'Sep', revenue: 0, expenses: 0, profit: 0, operating: 0, investing: 0, financing: 0, net: 0 },
  { month: 'Oct', revenue: 0, expenses: 0, profit: 0, operating: 0, investing: 0, financing: 0, net: 0 },
  { month: 'Nov', revenue: 0, expenses: 0, profit: 0, operating: 0, investing: 0, financing: 0, net: 0 },
  { month: 'Dec', revenue: 0, expenses: 0, profit: 0, operating: 0, investing: 0, financing: 0, net: 0 },
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
    (account.code.startsWith('15') || account.code.startsWith('16')) && 
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
