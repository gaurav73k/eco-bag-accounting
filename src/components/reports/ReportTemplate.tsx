
import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useFiscalYear } from '@/contexts/FiscalYearContext';

interface ReportTemplateProps {
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
}

const ReportTemplate: React.FC<ReportTemplateProps> = ({ 
  title, 
  description, 
  children,
  actions
}) => {
  const { fiscalYear } = useFiscalYear();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {actions && (
          <div className="flex space-x-2">
            {actions}
          </div>
        )}
      </div>
      
      <Card>
        <CardContent className="p-0 md:p-2">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportTemplate;
