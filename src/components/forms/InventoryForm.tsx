
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TooltipGuidance } from '@/components/ui/tooltip-guidance';

interface InventoryFormProps {
  type: 'raw' | 'finished';
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ type, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    stock: '',
    unit: type === 'raw' ? 'kg' : 'pcs',
    minStock: '',
    maxStock: '',
    reorderLevel: '',
    location: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem = {
      id: type === 'raw' ? `RM-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` : 
                          `FG-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...formData,
      stock: parseInt(formData.stock),
      minStock: type === 'raw' ? parseInt(formData.minStock) : undefined,
      maxStock: type === 'raw' ? parseInt(formData.maxStock) : undefined,
      reorderLevel: parseInt(formData.reorderLevel),
      status: 'normal',
    };
    
    onSubmit(newItem);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Item Name <span className="text-red-500">*</span>
            <TooltipGuidance content="Enter the full name of the inventory item" />
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stock">
            Initial Stock <span className="text-red-500">*</span>
            <TooltipGuidance content="Enter the quantity currently in stock" />
          </Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unit">
            Unit <span className="text-red-500">*</span>
            <TooltipGuidance content="Select the unit of measurement" />
          </Label>
          <Select
            value={formData.unit}
            onValueChange={(value) => handleSelectChange('unit', value)}
          >
            <SelectTrigger id="unit">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {type === 'raw' ? (
                <>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="L">Liters</SelectItem>
                  <SelectItem value="pcs">Pieces</SelectItem>
                  <SelectItem value="m">Meters</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="pcs">Pieces</SelectItem>
                  <SelectItem value="boxes">Boxes</SelectItem>
                  <SelectItem value="sets">Sets</SelectItem>
                  <SelectItem value="cartons">Cartons</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
        
        {type === 'raw' ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="minStock">
                Minimum Stock Level <span className="text-red-500">*</span>
                <TooltipGuidance content="Minimum level before stock is considered low" />
              </Label>
              <Input
                id="minStock"
                name="minStock"
                type="number"
                min="0"
                value={formData.minStock}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxStock">
                Maximum Stock Level <span className="text-red-500">*</span>
                <TooltipGuidance content="Maximum stock capacity" />
              </Label>
              <Input
                id="maxStock"
                name="maxStock"
                type="number"
                min="0"
                value={formData.maxStock}
                onChange={handleChange}
                required
              />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="reorderLevel">
              Reorder Level <span className="text-red-500">*</span>
              <TooltipGuidance content="Quantity at which to reorder" />
            </Label>
            <Input
              id="reorderLevel"
              name="reorderLevel"
              type="number"
              min="0"
              value={formData.reorderLevel}
              onChange={handleChange}
              required
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="location">
            Storage Location <span className="text-red-500">*</span>
            <TooltipGuidance content="Physical location where this item is stored" />
          </Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">
          Notes
          <TooltipGuidance content="Additional information about this item" />
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
          Add Item
        </Button>
      </div>
    </form>
  );
};

export default InventoryForm;
