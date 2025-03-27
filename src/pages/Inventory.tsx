
import React from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

const Inventory: React.FC = () => {
  return (
    <Layout>
      <PageTitle 
        title="Inventory Management" 
        description="Track and manage your inventory"
        icon={<ClipboardList className="h-6 w-6" />}
      />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center max-w-md">
                This module is under development. Soon you'll be able to manage all your inventory,
                track stock levels, and set up alerts for low stock items.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Inventory;
