
// Define entry types that match Tally's common transaction types
export const entryTypes = [
  { id: 'receipt', name: 'Receipt', icon: 'tally-1' },
  { id: 'payment', name: 'Payment', icon: 'tally-2' },
  { id: 'contra', name: 'Contra', icon: 'tally-3' },
  { id: 'journal', name: 'Journal', icon: 'tally-4' },
  { id: 'sales', name: 'Sales', icon: 'tally-5' },
  { id: 'purchase', name: 'Purchase', icon: 'tally-1' },
  { id: 'credit_note', name: 'Credit Note (Sales Return)', icon: 'tally-2' },
  { id: 'debit_note', name: 'Debit Note (Purchase Return)', icon: 'tally-3' },
  { id: 'damage', name: 'Damage/Loss Entry', icon: 'tally-4' },
  { id: 'memo', name: 'Memorandum', icon: 'tally-5' }
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
    default:
      return [];
  }
};
