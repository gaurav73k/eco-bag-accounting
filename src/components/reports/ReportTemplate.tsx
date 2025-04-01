
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFiscalYear } from '@/contexts/FiscalYearContext';

interface ReportTemplateProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const ReportTemplate: React.FC<ReportTemplateProps> = ({ title, description, children }) => {
  const { fiscalYear } = useFiscalYear();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
        <p className="text-muted-foreground">Fiscal Year: {fiscalYear}</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportTemplate;
