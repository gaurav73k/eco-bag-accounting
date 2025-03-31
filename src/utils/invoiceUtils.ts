
import { toast } from 'sonner';
import { exportToCSV, getFormattedDate } from '@/utils/exportUtils';

/**
 * Utility functions for invoice operations
 */

export interface InvoiceData {
  id: string;
  date: string;
  customer: {
    name: string;
    address: string;
    contactNumber: string;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  totalAmount: number;
  taxAmount: number;
  grandTotal: number;
  notes?: string;
}

/**
 * Generate a printable view of the invoice and trigger browser print
 */
export const printInvoice = (invoiceData: InvoiceData): void => {
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
      <title>Invoice ${invoiceData.id}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #ddd;
        }
        .company-info {
          flex: 1;
        }
        .invoice-info {
          text-align: right;
        }
        .customer-details {
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          text-align: left;
        }
        th {
          background-color: #f5f5f5;
        }
        .amount-row {
          text-align: right;
        }
        .total-row {
          font-weight: bold;
        }
        .notes {
          margin-top: 30px;
          font-style: italic;
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
          body {
            padding: 0;
          }
          .invoice-container {
            border: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div class="company-info">
            <h2>NPL Accounts</h2>
            <p>123 Business Street</p>
            <p>Kathmandu, Nepal</p>
            <p>Phone: +977-1-1234567</p>
            <p>Email: info@nplaccounts.com</p>
          </div>
          <div class="invoice-info">
            <h1>INVOICE</h1>
            <p><strong>Invoice No:</strong> ${invoiceData.id}</p>
            <p><strong>Date:</strong> ${invoiceData.date}</p>
          </div>
        </div>
        
        <div class="customer-details">
          <h3>Bill To:</h3>
          <p><strong>${invoiceData.customer.name}</strong></p>
          <p>${invoiceData.customer.address}</p>
          <p>Contact: ${invoiceData.customer.contactNumber}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.items.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>Rs. ${item.unitPrice.toLocaleString()}</td>
                <td>Rs. ${item.amount.toLocaleString()}</td>
              </tr>
            `).join('')}
            <tr class="amount-row">
              <td colspan="4">Subtotal:</td>
              <td>Rs. ${invoiceData.totalAmount.toLocaleString()}</td>
            </tr>
            <tr class="amount-row">
              <td colspan="4">VAT (13%):</td>
              <td>Rs. ${invoiceData.taxAmount.toLocaleString()}</td>
            </tr>
            <tr class="amount-row total-row">
              <td colspan="4">Total:</td>
              <td>Rs. ${invoiceData.grandTotal.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        
        ${invoiceData.notes ? `
          <div class="notes">
            <p><strong>Notes:</strong></p>
            <p>${invoiceData.notes}</p>
          </div>
        ` : ''}
        
        <div class="footer">
          <p>Thank you for your business!</p>
        </div>
        
        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print();" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; cursor: pointer; font-size: 16px;">
            Print Invoice
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
};

/**
 * Download invoice as CSV
 */
export const downloadInvoice = (invoiceData: InvoiceData): void => {
  try {
    // Prepare data for CSV
    const invoiceHeader = {
      'Invoice Number': invoiceData.id,
      'Date': invoiceData.date,
      'Customer': invoiceData.customer.name,
      'Customer Address': invoiceData.customer.address,
      'Customer Contact': invoiceData.customer.contactNumber,
      'Subtotal': invoiceData.totalAmount,
      'Tax': invoiceData.taxAmount,
      'Grand Total': invoiceData.grandTotal,
      'Notes': invoiceData.notes || ''
    };
    
    // Convert items to CSV format
    const invoiceItems = invoiceData.items.map((item, index) => ({
      'Item Number': index + 1,
      'Item Name': item.name,
      'Quantity': item.quantity,
      'Unit Price': item.unitPrice,
      'Amount': item.amount
    }));
    
    // Combine header and items
    const csvData = [invoiceHeader, ...invoiceItems];
    
    // Export to CSV
    exportToCSV(csvData, `invoice-${invoiceData.id}-${getFormattedDate()}`);
    
    toast.success('Invoice downloaded successfully');
  } catch (error) {
    console.error('Failed to download invoice:', error);
    toast.error('Failed to download invoice');
  }
};
