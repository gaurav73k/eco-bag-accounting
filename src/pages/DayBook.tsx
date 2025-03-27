
import React from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Filter, Download, Calendar } from 'lucide-react';

// Mock data
const transactions = [
  { id: '1', date: '2023-06-15', description: 'Sale of W-Cut Bags', category: 'Sales', amount: 25000, type: 'income' },
  { id: '2', date: '2023-06-15', description: 'Purchase of Raw Materials', category: 'Purchase', amount: 15000, type: 'expense' },
  { id: '3', date: '2023-06-14', description: 'Sale of Custom Printed Bags', category: 'Sales', amount: 35000, type: 'income' },
  { id: '4', date: '2023-06-14', description: 'Electricity Bill', category: 'Utilities', amount: 5000, type: 'expense' },
  { id: '5', date: '2023-06-14', description: 'Staff Salaries', category: 'Salary', amount: 45000, type: 'expense' },
  { id: '6', date: '2023-06-13', description: 'Sale of U-Cut Bags', category: 'Sales', amount: 18000, type: 'income' },
  { id: '7', date: '2023-06-13', description: 'Office Supplies', category: 'Office', amount: 3000, type: 'expense' },
  { id: '8', date: '2023-06-12', description: 'Internet Bill', category: 'Utilities', amount: 2500, type: 'expense' },
  { id: '9', date: '2023-06-12', description: 'Sale of Coat Covers', category: 'Sales', amount: 22000, type: 'income' },
  { id: '10', date: '2023-06-12', description: 'Maintenance', category: 'Maintenance', amount: 8000, type: 'expense' },
];

const DayBook: React.FC = () => {
  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="Day Book" 
          description="Track daily income and expenses"
        >
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </PageTitle>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Transaction Log</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">June 2023</span>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="all">All Transactions</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                    <TabsTrigger value="expense">Expenses</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Search transactions..." 
                      className="max-w-[200px]"
                    />
                    <Select>
                      <SelectTrigger className="w-[140px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="amount">Amount</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <TabsContent value="all" className="mt-0">
                  <div className="rounded-md border animate-scale-in">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>{transaction.category}</TableCell>
                            <TableCell className="text-right">Rs. {transaction.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.type === 'income' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.type === 'income' ? 'Income' : 'Expense'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="income" className="mt-0">
                  <div className="rounded-md border animate-scale-in">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions
                          .filter(t => t.type === 'income')
                          .map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{transaction.date}</TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell>{transaction.category}</TableCell>
                              <TableCell className="text-right">Rs. {transaction.amount.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="expense" className="mt-0">
                  <div className="rounded-md border animate-scale-in">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions
                          .filter(t => t.type === 'expense')
                          .map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{transaction.date}</TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell>{transaction.category}</TableCell>
                              <TableCell className="text-right">Rs. {transaction.amount.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DayBook;
