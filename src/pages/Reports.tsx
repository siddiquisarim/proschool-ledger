import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { MobileTabs, TabsContent } from '@/components/ui/mobile-tabs';
import { DollarSign, ClipboardCheck } from 'lucide-react';
import { FinancialReports } from '@/components/reports/FinancialReports';
import { SupervisorReports } from '@/components/reports/SupervisorReports';

const reportCategories = [
  { value: 'financial', label: 'Financial Reports', icon: <DollarSign className="w-4 h-4" /> },
  { value: 'supervisor', label: 'Supervisor Reports', icon: <ClipboardCheck className="w-4 h-4" /> },
];

export function ReportsPage() {
  const { t } = useApp();

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t('nav.reports')}</h1>
          <p className="text-sm text-muted-foreground">
            Generate and export financial and academic reports
          </p>
        </div>
      </div>

      <MobileTabs tabs={reportCategories} defaultValue="financial">
        <TabsContent value="financial" className="mt-4">
          <FinancialReports />
        </TabsContent>

        <TabsContent value="supervisor" className="mt-4">
          <SupervisorReports />
        </TabsContent>
      </MobileTabs>
    </div>
  );
}
