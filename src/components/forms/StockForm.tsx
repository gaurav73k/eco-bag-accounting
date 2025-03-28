
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TooltipGuidance } from '@/components/ui/tooltip-guidance';
import { toast } from 'sonner';

type StockFormProps = {
  type: 'rawMaterials' | 'finishedGoods';
  onSubmit: (formData: any) => void;
  onCancel: () => void;
};

const StockForm: React.FC<StockFormProps> = ({ type, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    stock: '',
    unit: type === 'rawMaterials' ? 'Rolls' : 'Pieces',
    reorderLevel: '',
    minStock: type === 'rawMaterials' ? '50' : '',
    maxStock: type === 'rawMaterials' ? '500' : '',
    location: '',
    notes: ''
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
    
    // Basic validation
    if (!formData.name || !formData.stock) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    onSubmit({
      id: Math.random().toString(36).substring(2, 9),
      ...formData,
      stock: parseInt(formData.stock),
      reorderLevel: parseInt(formData.reorderLevel),
      minStock: type === 'rawMaterials' ? parseInt(formData.minStock) : undefined,
      maxStock: type === 'rawMaterials' ? parseInt(formData.maxStock) : undefined,
      status: 'normal'
    });
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
              {type === 'rawMaterials' ? (
                <>
                  <SelectItem value="Rolls">Rolls</SelectItem>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="L">Liters</SelectItem>
                  <SelectItem value="pcs">Pieces</SelectItem>
                  <SelectItem value="m">Meters</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="Pieces">Pieces</SelectItem>
                  <SelectItem value="Boxes">Boxes</SelectItem>
                  <SelectItem value="Packs">Packs</SelectItem>
                  <SelectItem value="Sets">Sets</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reorderLevel">
            Reorder Level <span className="text-red-500">*</span>
            <TooltipGuidance content="Set the minimum quantity before reordering" />
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
        
        {type === 'rawMaterials' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="minStock">
                Minimum Stock
                <TooltipGuidance content="Minimum stock level to maintain" />
              </Label>
              <Input
                id="minStock"
                name="minStock"
                type="number"
                min="0"
                value={formData.minStock}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxStock">
                Maximum Stock
                <TooltipGuidance content="Maximum stock level capacity" />
              </Label>
              <Input
                id="maxStock"
                name="maxStock"
                type="number"
                min="0"
                value={formData.maxStock}
                onChange={handleChange}
              />
            </div>
          </>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="location">
            Storage Location
            <TooltipGuidance content="Where this item is stored" />
          </Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">
          Notes
          <TooltipGuidance content="Any additional information about this item" />
        </Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="min-h-[100px]"
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

export default StockForm;
