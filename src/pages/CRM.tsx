
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, UserCircle, Phone, Mail, Plus, FileText, Calendar, BarChart4, Trash } from 'lucide-react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { toast } from 'sonner';

// Mock data for customers
const mockCustomers = [
  { 
    id: '1', 
    name: 'Acme Corporation', 
    contactPerson: 'John Doe', 
    email: 'john@acmecorp.com', 
    phone: '+1 555-123-4567', 
    status: 'active', 
    totalSpent: '$15,230', 
    lastPurchase: '2025-03-20', 
    notes: 'Key client for manufacturing supplies'
  },
  { 
    id: '2', 
    name: 'TechStart Inc', 
    contactPerson: 'Jane Smith', 
    email: 'jane@techstart.com', 
    phone: '+1 555-987-6543', 
    status: 'lead', 
    totalSpent: '$0', 
    lastPurchase: 'N/A', 
    notes: 'Interested in our software solutions'
  },
  { 
    id: '3', 
    name: 'Global Traders', 
    contactPerson: 'Mike Johnson', 
    email: 'mike@globaltraders.com', 
    phone: '+1 555-456-7890', 
    status: 'inactive', 
    totalSpent: '$7,850', 
    lastPurchase: '2024-11-15', 
    notes: 'International shipping client'
  }
];

// Mock data for interactions
const mockInteractions = [
  { 
    id: '1', 
    customerId: '1', 
    type: 'call', 
    date: '2025-04-02', 
    summary: 'Discussed upcoming order requirements', 
    user: 'Sarah Anderson'
  },
  { 
    id: '2', 
    customerId: '1', 
    type: 'meeting', 
    date: '2025-03-15', 
    summary: 'Annual contract review meeting', 
    user: 'Michael Chen'
  },
  { 
    id: '3', 
    customerId: '2', 
    type: 'email', 
    date: '2025-04-01', 
    summary: 'Sent product catalog and pricing information', 
    user: 'Sarah Anderson'
  }
];

// Component for customer list
const CustomerList = ({ onViewCustomer }: { onViewCustomer: (id: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    status: 'lead',
    notes: ''
  });

  const filteredCustomers = mockCustomers.filter(
    customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = () => {
    // In a real app, you would make an API call to add the customer
    console.log('Adding new customer:', newCustomer);
    toast.success('Customer added successfully');
    setIsAddDialogOpen(false);
    setNewCustomer({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      status: 'lead',
      notes: ''
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'lead':
        return <Badge className="bg-blue-500">Lead</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-10" 
            placeholder="Search customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Enter the details of the new customer below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Company Name
                </Label>
                <Input 
                  id="name" 
                  className="col-span-3" 
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contactPerson" className="text-right">
                  Contact Person
                </Label>
                <Input 
                  id="contactPerson" 
                  className="col-span-3" 
                  value={newCustomer.contactPerson}
                  onChange={(e) => setNewCustomer({...newCustomer, contactPerson: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  className="col-span-3" 
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input 
                  id="phone" 
                  className="col-span-3" 
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Input 
                  id="notes" 
                  className="col-span-3" 
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCustomer}>Add Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Last Purchase</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                No customers found. Try adjusting your search or add a new customer.
              </TableCell>
            </TableRow>
          ) : (
            filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-muted-foreground">{customer.contactPerson}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" /> 
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> 
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(customer.status)}
                </TableCell>
                <TableCell>{customer.totalSpent}</TableCell>
                <TableCell>{customer.lastPurchase}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onViewCustomer(customer.id)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Component for customer details
const CustomerDetail = ({ customerId, onBack }: { customerId: string, onBack: () => void }) => {
  const customer = mockCustomers.find(c => c.id === customerId);
  const customerInteractions = mockInteractions.filter(i => i.customerId === customerId);
  const [activeTab, setActiveTab] = useState('overview');
  const [newInteraction, setNewInteraction] = useState({
    type: 'call',
    summary: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isAddInteractionOpen, setIsAddInteractionOpen] = useState(false);

  if (!customer) {
    return (
      <div className="p-10 text-center">
        <p>Customer not found</p>
        <Button onClick={onBack} className="mt-4">Back to Customer List</Button>
      </div>
    );
  }

  const handleAddInteraction = () => {
    // In a real app, you would make an API call to add the interaction
    console.log('Adding new interaction:', { ...newInteraction, customerId });
    toast.success('Interaction added successfully');
    setIsAddInteractionOpen(false);
    setNewInteraction({
      type: 'call',
      summary: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack}>
          Back to Customer List
        </Button>
        <Dialog open={isAddInteractionOpen} onOpenChange={setIsAddInteractionOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Log Interaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Customer Interaction</DialogTitle>
              <DialogDescription>
                Record details of your interaction with {customer.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <select 
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm col-span-3"
                  value={newInteraction.type}
                  onChange={(e) => setNewInteraction({...newInteraction, type: e.target.value})}
                >
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  className="col-span-3"
                  value={newInteraction.date}
                  onChange={(e) => setNewInteraction({...newInteraction, date: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="summary" className="text-right">Summary</Label>
                <textarea 
                  id="summary" 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm col-span-3"
                  value={newInteraction.summary}
                  onChange={(e) => setNewInteraction({...newInteraction, summary: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddInteractionOpen(false)}>Cancel</Button>
              <Button onClick={handleAddInteraction}>Save Interaction</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCircle className="h-6 w-6 mr-2" />
              {customer.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-medium">{customer.contactPerson}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{customer.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="font-medium">{customer.totalSpent}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Purchase</p>
                  <p className="font-medium">{customer.lastPurchase}</p>
                </div>
              </div>
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">Notes</p>
                <p>{customer.notes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Call Customer
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Interaction History</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Interaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {customerInteractions.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No interactions recorded yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsAddInteractionOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Log First Interaction
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Summary</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerInteractions.map((interaction) => (
                      <TableRow key={interaction.id}>
                        <TableCell>{interaction.date}</TableCell>
                        <TableCell className="capitalize">{interaction.type}</TableCell>
                        <TableCell>{interaction.summary}</TableCell>
                        <TableCell>{interaction.user}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invoices" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">No invoices found for this customer.</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">No orders found for this customer.</p>
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <BarChart4 className="h-16 w-16 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground mt-4">Customer analytics will be displayed here.</p>
                <p className="text-sm text-muted-foreground">Analytics feature coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Main CRM component
const CRM = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  
  const handleViewCustomer = (id: string) => {
    navigate(`/crm/customer/${id}`);
  };
  
  return (
    <Layout>
      <PageTitle 
        title="Customer Relationship Management" 
        description="Manage your customers, interactions and sales pipeline"
      />
      
      {customerId ? (
        <CustomerDetail 
          customerId={customerId} 
          onBack={() => navigate('/crm')} 
        />
      ) : (
        <CustomerList onViewCustomer={handleViewCustomer} />
      )}
    </Layout>
  );
};

export default CRM;
