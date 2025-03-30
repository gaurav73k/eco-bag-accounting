
// Define entry types that match Tally's common transaction types
export const entryTypes = [
  { id: 'receipt', name: 'Receipt', icon: 'receipt' },
  { id: 'payment', name: 'Payment', icon: 'credit-card' },
  { id: 'contra', name: 'Contra', icon: 'repeat' },
  { id: 'journal', name: 'Journal', icon: 'book-open' },
  { id: 'sales', name: 'Sales', icon: 'shopping-cart' },
  { id: 'purchase', name: 'Purchase', icon: 'shopping-bag' },
  { id: 'credit_note', name: 'Credit Note (Sales Return)', icon: 'arrow-down-circle' },
  { id: 'debit_note', name: 'Debit Note (Purchase Return)', icon: 'arrow-up-circle' },
  { id: 'damage', name: 'Damage/Loss Entry', icon: 'x-circle' },
  { id: 'memo', name: 'Memorandum', icon: 'file-text' },
  { id: 'return', name: 'Return', icon: 'corner-up-left' },
  { id: 'wastage', name: 'Wastage', icon: 'trash-2' }
];

// Helper function to generate account suggestions based on entry type
export const getAccountSuggestionsByEntryType = (entryType: string) => {
  switch (entryType) {
    case 'receipt':
      return [
        { id: 'cash', name: 'Cash', type: 'asset' },
        { id: 'bank', name: 'Bank', type: 'asset' },
        { id: 'accounts_receivable', name: 'Accounts Receivable', type: 'asset' }
      ];
    case 'payment':
      return [
        { id: 'cash', name: 'Cash', type: 'asset' },
        { id: 'bank', name: 'Bank', type: 'asset' },
        { id: 'accounts_payable', name: 'Accounts Payable', type: 'liability' }
      ];
    case 'contra':
      return [
        { id: 'cash', name: 'Cash', type: 'asset' },
        { id: 'bank', name: 'Bank', type: 'asset' }
      ];
    case 'sales':
      return [
        { id: 'sales', name: 'Sales', type: 'revenue' },
        { id: 'gst_output', name: 'GST Output', type: 'liability' },
        { id: 'cash', name: 'Cash', type: 'asset' },
        { id: 'bank', name: 'Bank', type: 'asset' }
      ];
    case 'purchase':
      return [
        { id: 'purchases', name: 'Purchases', type: 'expense' },
        { id: 'gst_input', name: 'GST Input', type: 'asset' },
        { id: 'cash', name: 'Cash', type: 'asset' },
        { id: 'bank', name: 'Bank', type: 'asset' }
      ];
    case 'credit_note':
      return [
        { id: 'sales_returns', name: 'Sales Returns', type: 'revenue' },
        { id: 'gst_output', name: 'GST Output', type: 'liability' },
        { id: 'accounts_receivable', name: 'Accounts Receivable', type: 'asset' }
      ];
    case 'debit_note':
      return [
        { id: 'purchase_returns', name: 'Purchase Returns', type: 'expense' },
        { id: 'gst_input', name: 'GST Input', type: 'asset' },
        { id: 'accounts_payable', name: 'Accounts Payable', type: 'liability' }
      ];
    case 'damage':
      return [
        { id: 'inventory_loss', name: 'Inventory Loss', type: 'expense' },
        { id: 'inventory', name: 'Inventory', type: 'asset' }
      ];
    case 'return':
      return [
        { id: 'inventory', name: 'Inventory', type: 'asset' },
        { id: 'sales_returns', name: 'Sales Returns', type: 'revenue' },
        { id: 'purchase_returns', name: 'Purchase Returns', type: 'expense' },
        { id: 'accounts_receivable', name: 'Accounts Receivable', type: 'asset' },
        { id: 'accounts_payable', name: 'Accounts Payable', type: 'liability' }
      ];
    case 'wastage':
      return [
        { id: 'wastage_expense', name: 'Wastage Expense', type: 'expense' },
        { id: 'inventory', name: 'Inventory', type: 'asset' }
      ];
    default:
      return [];
  }
};
