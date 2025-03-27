
import React from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const Payroll: React.FC = () => {
  return (
    <Layout>
      <PageTitle 
        title="Payroll Management" 
        description="Manage employee salaries and benefits"
        icon={<Users className="h-6 w-6" />}
      />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payroll Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center max-w-md">
                This module is under development. Soon you'll be able to manage employee information,
                calculate salaries, track attendance, and generate payslips.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Payroll;
