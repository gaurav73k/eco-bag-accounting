
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TooltipGuidance } from '@/components/ui/tooltip-guidance';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Mock raw materials for selection
const availableItems = [
  { id: 'RM-001', name: 'Non-woven PP Fabric (White)', unit: 'kg', price: 250 },
  { id: 'RM-002', name: 'Non-woven PP Fabric (Green)', unit: 'kg', price: 275 },
  { id: 'RM-003', name: 'Thread Spools (White)', unit: 'pcs', price: 120 },
  { id: 'RM-004', name: 'Thread Spools (Multi-color)', unit: 'pcs', price: 150 },
  { id: 'RM-005', name: 'Printing Ink (Black)', unit: 'L', price: 350 },
  { id: 'RM-006', name: 'Printing Ink (Assorted)', unit: 'L', price: 400 },
];

// Mock vendors
const vendors = [
  { id: 'V001', name: 'Textile Supplies Ltd.', email: 'orders@textiles.com' },
  { id: 'V002', name: 'Print Materials Inc.', email: 'sales@printmaterials.com' },
  { id: 'V003', name: 'Global Thread Company', email: 'info@globalthread.com' },
  { id: 'V004', name: 'PackMaster Suppliers', email: 'support@packmaster.com' },
];

interface PurchaseOrderFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    vendor: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: '',
    reference: `PO-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
    terms: 'Net 30',
    notes: '',
    items: [{ itemId: '', quantity: 1, unitPrice: 0, total: 0 }]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...formData.items];
    
    if (field === 'itemId' && value) {
      const selectedItem = availableItems.find(item => item.id === value);
      if (selectedItem) {
        updatedItems[index] = {
          ...updatedItems[index],
          itemId: value,
          unitPrice: selectedItem.price,
          total: selectedItem.price * updatedItems[index].quantity
        };
      }
    } else if (field === 'quantity') {
      const quantity = parseInt(value) || 0;
      updatedItems[index] = {
        ...updatedItems[index],
        quantity,
        total: quantity * updatedItems[index].unitPrice
      };
    } else {
      updatedItems[index] = { ...updatedItems[index], [field]: value };
    }
    
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { itemId: '', quantity: 1, unitPrice: 0, total: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: updatedItems }));
    } else {
      toast.error("Purchase order must have at least one item");
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.vendor) {
      toast.error("Please select a vendor");
      return;
    }
    
    if (!formData.expectedDelivery) {
      toast.error("Please specify an expected delivery date");
      return;
    }
    
    if (formData.items.some(item => !item.itemId)) {
      toast.error("Please select all items");
      return;
    }
    
    const purchaseOrder = {
      id: formData.reference,
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      total: calculateTotal()
    };
    
    onSubmit(purchaseOrder);
    toast.success("Purchase order created successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vendor">
            Vendor <span className="text-red-500">*</span>
            <TooltipGuidance content="Select the supplier for this purchase order" />
          </Label>
          <Select
            value={formData.vendor}
            onValueChange={(value) => handleSelectChange('vendor', value)}
          >
            <SelectTrigger id="vendor">
              <SelectValue placeholder="Select vendor" />
            </SelectTrigger>
            <SelectContent>
              {vendors.map(vendor => (
                <SelectItem key={vendor.id} value={vendor.id}>{vendor.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reference">
            PO Reference
            <TooltipGuidance content="Unique identifier for this purchase order" />
          </Label>
          <Input
            id="reference"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            disabled
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="orderDate">
            Order Date <span className="text-red-500">*</span>
            <TooltipGuidance content="Date when this order is placed" />
          </Label>
          <Input
            id="orderDate"
            name="orderDate"
            type="date"
            value={formData.orderDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expectedDelivery">
            Expected Delivery <span className="text-red-500">*</span>
            <TooltipGuidance content="When you expect to receive this order" />
          </Label>
          <Input
            id="expectedDelivery"
            name="expectedDelivery"
            type="date"
            value={formData.expectedDelivery}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="terms">
            Payment Terms
            <TooltipGuidance content="Payment terms for this purchase order" />
          </Label>
          <Select
            value={formData.terms}
            onValueChange={(value) => handleSelectChange('terms', value)}
          >
            <SelectTrigger id="terms">
              <SelectValue placeholder="Select terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Net 15">Net 15</SelectItem>
              <SelectItem value="Net 30">Net 30</SelectItem>
              <SelectItem value="Net 45">Net 45</SelectItem>
              <SelectItem value="Net 60">Net 60</SelectItem>
              <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Order Items</h3>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </div>
        
        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5 space-y-1">
                <Label htmlFor={`item-${index}`}>
                  {index === 0 && "Item"}
                </Label>
                <Select
                  value={item.itemId}
                  onValueChange={(value) => handleItemChange(index, 'itemId', value)}
                >
                  <SelectTrigger id={`item-${index}`}>
                    <SelectValue placeholder="Select item" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableItems.map(item => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} ({item.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2 space-y-1">
                <Label htmlFor={`quantity-${index}`}>
                  {index === 0 && "Quantity"}
                </Label>
                <Input
                  id={`quantity-${index}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                />
              </div>
              
              <div className="col-span-2 space-y-1">
                <Label htmlFor={`price-${index}`}>
                  {index === 0 && "Unit Price"}
                </Label>
                <Input
                  id={`price-${index}`}
                  value={item.unitPrice.toFixed(2)}
                  disabled
                />
              </div>
              
              <div className="col-span-2 space-y-1">
                <Label htmlFor={`total-${index}`}>
                  {index === 0 && "Total"}
                </Label>
                <Input
                  id={`total-${index}`}
                  value={item.total.toFixed(2)}
                  disabled
                />
              </div>
              
              <div className="col-span-1 flex items-center justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="h-9 w-9 p-0"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <div className="w-1/3 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span className="font-medium">₹{calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax:</span>
            <span className="font-medium">₹{(calculateTotal() * 0.18).toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between">
            <span className="font-medium">Grand Total:</span>
            <span className="font-bold">₹{(calculateTotal() * 1.18).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">
          Notes
          <TooltipGuidance content="Additional information or special instructions" />
        </Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Purchase Order
        </Button>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;
