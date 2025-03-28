
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Calculator, Printer, Send } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

// Mock products data
const products = [
  { id: '1', name: 'W-Cut Bags (Small)', sku: 'WCB-S-001', price: 40, stock: 1000 },
  { id: '2', name: 'W-Cut Bags (Medium)', sku: 'WCB-M-001', price: 50, stock: 800 },
  { id: '3', name: 'W-Cut Bags (Large)', sku: 'WCB-L-001', price: 60, stock: 600 },
  { id: '4', name: 'U-Cut Bags (Medium)', sku: 'UCB-M-001', price: 45, stock: 900 },
  { id: '5', name: 'Custom Printed Bags', sku: 'CPB-001', price: 75, stock: 500 },
];

// Mock customers data
const customers = [
  { id: '1', name: 'Kathmandu Retail Store', address: 'Thamel, Kathmandu', phone: '01-4567890', email: 'info@kathmanduretail.com' },
  { id: '2', name: 'Pokhara Gift Shop', address: 'Lakeside, Pokhara', phone: '061-456789', email: 'pokharagift@example.com' },
  { id: '3', name: 'Lalitpur Boutique', address: 'Jawalakhel, Lalitpur', phone: '01-5567890', email: 'boutique@example.com' },
  { id: '4', name: 'Bhaktapur Fashion', address: 'Durbar Square, Bhaktapur', phone: '01-6612345', email: 'bhaktapurfashion@example.com' },
  { id: '5', name: 'Thamel Souvenirs', address: 'Thamel, Kathmandu', phone: '01-4555555', email: 'souvenirs@example.com' },
];

const invoiceFormSchema = z.object({
  customerInfo: z.object({
    id: z.string().min(1, { message: "Please select a customer" }),
    name: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
  }),
  invoiceDate: z.string().min(1, { message: "Invoice date is required" }),
  dueDate: z.string().min(1, { message: "Due date is required" }),
  invoiceNumber: z.string().min(1, { message: "Invoice number is required" }),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string().min(1, { message: "Product is required" }),
      name: z.string().optional(),
      quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
      price: z.number().min(0, { message: "Price must be a positive number" }),
      total: z.number().optional(),
    })
  ).min(1, { message: "At least one item must be added" }),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormValues) => void;
  onCancel: () => void;
  onPreview?: (data: InvoiceFormValues) => void;
  onSendEmail?: (data: InvoiceFormValues) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ 
  onSubmit, 
  onCancel, 
  onPreview,
  onSendEmail 
}) => {
  const [lineItems, setLineItems] = useState<{id: string, quantity: number, price: number, total: number}[]>([
    { id: '', quantity: 1, price: 0, total: 0 }
  ]);
  
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      customerInfo: {
        id: '',
      },
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      invoiceNumber: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      paymentTerms: 'Net 15',
      notes: '',
      items: [{ id: '', quantity: 1, price: 0 }],
    },
  });

  const handleAddItem = () => {
    setLineItems([...lineItems, { id: '', quantity: 1, price: 0, total: 0 }]);
    const currentItems = form.getValues().items || [];
    form.setValue('items', [...currentItems, { id: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (lineItems.length > 1) {
      const updatedItems = [...lineItems];
      updatedItems.splice(index, 1);
      setLineItems(updatedItems);
      
      const currentItems = form.getValues().items || [];
      const updatedFormItems = [...currentItems];
      updatedFormItems.splice(index, 1);
      form.setValue('items', updatedFormItems);
    } else {
      toast.error("At least one item is required");
    }
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const updatedItems = [...lineItems];
      updatedItems[index] = {
        ...updatedItems[index],
        id: productId,
        price: product.price,
        total: product.price * updatedItems[index].quantity
      };
      setLineItems(updatedItems);
      
      const currentItems = form.getValues().items || [];
      const updatedFormItems = [...currentItems];
      updatedFormItems[index] = {
        ...updatedFormItems[index],
        id: productId,
        name: product.name,
        price: product.price,
        total: product.price * updatedFormItems[index].quantity
      };
      form.setValue('items', updatedFormItems);
    }
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity > 0) {
      const product = products.find(p => p.id === lineItems[index].id);
      if (product) {
        const updatedItems = [...lineItems];
        updatedItems[index] = {
          ...updatedItems[index],
          quantity,
          total: product.price * quantity
        };
        setLineItems(updatedItems);
        
        const currentItems = form.getValues().items || [];
        const updatedFormItems = [...currentItems];
        updatedFormItems[index] = {
          ...updatedFormItems[index],
          quantity,
          total: product.price * quantity
        };
        form.setValue('items', updatedFormItems);
      }
    }
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      form.setValue('customerInfo', {
        id: customer.id,
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
        email: customer.email
      });
    }
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const calculateVat = () => {
    return calculateSubtotal() * 0.13; // 13% VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVat();
  };

  const handleSubmit = (data: InvoiceFormValues) => {
    try {
      // Add calculated totals
      const completeData = {
        ...data,
        subtotal: calculateSubtotal(),
        vat: calculateVat(),
        total: calculateTotal()
      };
      
      onSubmit(completeData);
      toast.success("Invoice created successfully");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Customer Information</h3>
              
              <FormField
                control={form.control}
                name="customerInfo.id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleCustomerChange(value);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch('customerInfo.id') && (
                <div className="mt-4 text-sm space-y-1">
                  <p><strong>Address:</strong> {form.watch('customerInfo.address')}</p>
                  <p><strong>Phone:</strong> {form.watch('customerInfo.phone')}</p>
                  <p><strong>Email:</strong> {form.watch('customerInfo.email')}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-medium mb-4">Invoice Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select terms" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Net 15">Net 15</SelectItem>
                          <SelectItem value="Net 30">Net 30</SelectItem>
                          <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                          <SelectItem value="Cash on Delivery">Cash on Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="invoiceDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-md p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Line Items</h3>
            <Button type="button" onClick={handleAddItem} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Select 
                        value={item.id} 
                        onValueChange={(value) => handleProductChange(index, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(product => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        min="1" 
                        value={item.quantity} 
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                        className="w-[80px]"
                      />
                    </TableCell>
                    <TableCell>
                      Rs. {item.price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      Rs. {item.total.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-end">
            <div className="w-[300px] space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {calculateSubtotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (13%):</span>
                <span>Rs. {calculateVat().toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>Rs. {calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional notes for the invoice..." 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-between">
          <div className="space-x-2">
            {onPreview && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  if (form.formState.isValid) {
                    onPreview(form.getValues());
                  } else {
                    form.trigger();
                    toast.error("Please fix the form errors before previewing");
                  }
                }}
              >
                <Printer className="h-4 w-4 mr-2" />
                Preview
              </Button>
            )}
            
            {onSendEmail && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  if (form.formState.isValid) {
                    onSendEmail(form.getValues());
                  } else {
                    form.trigger();
                    toast.error("Please fix the form errors before sending");
                  }
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            )}
          </div>
          
          <div className="space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              <Calculator className="h-4 w-4 mr-2" />
              Complete Invoice
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default InvoiceForm;
