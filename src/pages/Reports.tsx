import { useApp } from '@/contexts/AppContext';
import { MobileTabs, TabsContent } from '@/components/ui/mobile-tabs';
import { DollarSign, ClipboardCheck } from 'lucide-react';
import { FinancialReports } from '@/components/reports/FinancialReports';
import { SupervisorReports } from '@/components/reports/SupervisorReports';
import { cn } from '@/lib/utils';

export function ReportsPage() {
  const { t, isRTL } = useApp();

  const reportCategories = [
    { value: 'financial', label: t('reports.financial'), icon: <DollarSign className="w-4 h-4" /> },
    { value: 'supervisor', label: t('reports.supervisor'), icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page Header */}
      <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-xl font-semibold">{t('nav.reports')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('reports.generate')}
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
