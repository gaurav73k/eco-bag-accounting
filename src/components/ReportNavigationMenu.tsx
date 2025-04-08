
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart4,
  BookOpen,
  FileText,
  DollarSign,
  Clock,
  FileSpreadsheet,
  Building,
  Receipt,
  LineChart,
  CreditCard,
  HelpCircle
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { TooltipGuidance } from '@/components/ui/tooltip-guidance';

const reportItems = [
  {
    name: 'Balance Sheet',
    path: '/reporting/balance-sheet',
    icon: <BookOpen className="h-4 w-4" />,
    description: 'View company assets, liabilities, and equity'
  },
  {
    name: 'Cash Flow',
    path: '/reporting/cash-flow',
    icon: <DollarSign className="h-4 w-4" />,
    description: 'Analyze cash inflows and outflows'
  },
  {
    name: 'Profit & Loss',
    path: '/reporting/profit-loss',
    icon: <LineChart className="h-4 w-4" />,
    description: 'Track revenue, expenses, and profit'
  },
  {
    name: 'Aged Receivables',
    path: '/reporting/aged-receivables',
    icon: <CreditCard className="h-4 w-4" />,
    description: 'View outstanding customer invoices by age'
  },
  {
    name: 'Aged Payables',
    path: '/reporting/aged-payables',
    icon: <Receipt className="h-4 w-4" />,
    description: 'Track vendor payments due by age'
  },
  {
    name: 'General Ledger',
    path: '/reporting/general-ledger',
    icon: <FileSpreadsheet className="h-4 w-4" />,
    description: 'View all accounting entries'
  },
  {
    name: 'Trial Balance',
    path: '/reporting/trial-balance',
    icon: <FileText className="h-4 w-4" />,
    description: 'Verify balanced debits and credits'
  },
  {
    name: 'Tax Return',
    path: '/reporting/tax-return',
    icon: <Building className="h-4 w-4" />,
    description: 'Prepare tax filing information'
  },
  {
    name: 'Asset Reconciliation',
    path: '/reporting/asset-reconciliation',
    icon: <Clock className="h-4 w-4" />,
    description: 'Verify physical assets against records'
  },
  {
    name: 'Analytic Items',
    path: '/reporting/analytic-items',
    icon: <BarChart4 className="h-4 w-4" />,
    description: 'Business performance analytics'
  }
];

const ReportNavigationMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <SidebarMenu>
      {reportItems.map((item) => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton
            isActive={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            tooltip={item.description}
          >
            {item.icon}
            <span>{item.name}</span>
            <TooltipGuidance
              content={item.description}
              side="right"
            >
              <HelpCircle className="h-3 w-3 text-muted-foreground ml-auto" />
            </TooltipGuidance>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default ReportNavigationMenu;
