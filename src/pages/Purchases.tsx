
import React from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

const Purchases: React.FC = () => {
  return (
    <Layout>
      <PageTitle 
        title="Purchases Management" 
        description="Track and manage all your purchase transactions"
        icon={<ShoppingCart className="h-6 w-6" />}
      />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Purchases Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center max-w-md">
                This module is under development. Soon you'll be able to manage all your purchases,
                track expenses, and manage your suppliers here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Purchases;
