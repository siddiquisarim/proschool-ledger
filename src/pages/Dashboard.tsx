import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import {
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockStudents, mockPayments, mockClosures } from '@/data/mockData';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  isRTL?: boolean;
}

function StatCard({ title, value, subValue, icon: Icon, trend, trendValue, variant = 'default', isRTL }: StatCardProps) {
  const variantStyles = {
    default: 'border-l-primary',
    success: 'border-l-accent',
    warning: 'border-l-amber',
    danger: 'border-l-destructive',
  };

  return (
    <Card className={cn("p-4 border-l-4", variantStyles[variant], isRTL && "border-l-0 border-r-4")}>
      <div className={cn("flex items-start justify-between", isRTL && "flex-row-reverse")}>
        <div className={isRTL ? "text-right" : "text-left"}>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-semibold mt-1 font-mono">{value}</p>
          {subValue && (
            <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>
          )}
          {trend && trendValue && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-xs font-medium",
              trend === 'up' ? 'text-accent' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground',
              isRTL && "flex-row-reverse"
            )}>
              {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </Card>
  );
}

function RecentPaymentsTable({ t, isRTL }: { t: (key: string) => string; isRTL: boolean }) {
  const recentPayments = mockPayments.slice(0, 5);

  return (
    <Card>
      <div className={cn("data-card-header flex items-center justify-between", isRTL && "flex-row-reverse")}>
        <h3 className="text-sm font-semibold">{t('payment.recentTransactions')}</h3>
        <Button variant="ghost" size="xs">{t('common.viewAll')}</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>{t('payment.receipt')} #</th>
              <th>{t('student.name')}</th>
              <th>{t('common.amount')}</th>
              <th>{t('payment.method')}</th>
              <th>{t('common.status')}</th>
            </tr>
          </thead>
          <tbody>
            {recentPayments.map((payment) => {
              const student = mockStudents.find(s => s.id === payment.studentId);
              return (
                <tr key={payment.id}>
                  <td className="font-mono text-xs">{payment.receiptNumber}</td>
                  <td>{student?.firstName} {student?.lastName}</td>
                  <td className="font-mono">AED {payment.amount.toLocaleString()}</td>
                  <td className="capitalize">{payment.paymentMethod.replace('_', ' ')}</td>
                  <td>
                    <span className={cn(
                      "status-badge",
                      payment.status === 'finalized' && "status-paid",
                      payment.status === 'pending' && "status-pending",
                      payment.status === 'approved' && "status-partial",
                      payment.status === 'rejected' && "status-overdue"
                    )}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function PendingVerificationsCard({ t, isRTL }: { t: (key: string) => string; isRTL: boolean }) {
  const pendingClosures = mockClosures.filter(c => c.status === 'pending' || c.status === 'supervisor_approved');

  return (
    <Card>
      <div className={cn("data-card-header flex items-center justify-between", isRTL && "flex-row-reverse")}>
        <h3 className="text-sm font-semibold">{t('verification.queue')}</h3>
        <span className="text-xs font-medium text-amber bg-amber/10 px-2 py-0.5 rounded">
          {pendingClosures.length} {t('common.pending')}
        </span>
      </div>
      <div className="divide-y divide-border">
        {pendingClosures.map((closure) => (
          <div key={closure.id} className="p-4 hover:bg-muted/50 transition-colors">
            <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
              <div className={isRTL ? "text-right" : "text-left"}>
                <p className="text-sm font-medium">{closure.cashierName}</p>
                <p className="text-xs text-muted-foreground">{new Date(closure.date).toLocaleDateString()}</p>
              </div>
              <div className={isRTL ? "text-left" : "text-right"}>
                <p className="font-mono text-sm font-medium">AED {closure.grandTotal.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{closure.transactionCount} transactions</p>
              </div>
            </div>
            <div className={cn("mt-2 flex items-center gap-2", isRTL && "flex-row-reverse")}>
              <span className={cn(
                "status-badge",
                closure.status === 'pending' && "status-pending",
                closure.status === 'supervisor_approved' && "status-partial"
              )}>
                {closure.status === 'pending' ? t('closure.awaitingSupervisor') : t('closure.awaitingAccountant')}
              </span>
            </div>
          </div>
        ))}
        {pendingClosures.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-accent" />
            <p className="text-sm">{t('dashboard.allVerificationsComplete')}</p>
          </div>
        )}
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const { currentUser, t, isRTL } = useApp();

  const totalStudents = mockStudents.filter(s => s.status === 'active').length;
  const totalCollected = mockPayments.filter(p => p.status === 'finalized').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = mockPayments.filter(p => p.status === 'pending').length;
  const pendingVerifications = mockClosures.filter(c => c.status === 'pending' || c.status === 'supervisor_approved').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-xl font-semibold">{t('nav.dashboard')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('common.welcome')}, {currentUser?.name}. {t('dashboard.overview')}
          </p>
        </div>
        <div className={isRTL ? "text-left" : "text-right"}>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('common.today')}</p>
          <p className="text-sm font-medium">{new Date().toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('dashboard.activeStudents')}
          value={totalStudents}
          subValue={t('dashboard.enrolledThisYear')}
          icon={Users}
          trend="up"
          trendValue="+12 this month"
          variant="default"
          isRTL={isRTL}
        />
        <StatCard
          title={t('dashboard.totalCollected')}
          value={`AED ${totalCollected.toLocaleString()}`}
          subValue={t('dashboard.currentAcademicYear')}
          icon={DollarSign}
          trend="up"
          trendValue="+8.2% from last month"
          variant="success"
          isRTL={isRTL}
        />
        <StatCard
          title={t('payment.pendingPayments')}
          value={pendingPayments}
          subValue={t('payment.awaitingProcessing')}
          icon={Clock}
          variant="warning"
          isRTL={isRTL}
        />
        <StatCard
          title={t('dashboard.verificationsQueue')}
          value={pendingVerifications}
          subValue={t('closure.pendingReview')}
          icon={AlertTriangle}
          variant={pendingVerifications > 0 ? 'warning' : 'success'}
          isRTL={isRTL}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentPaymentsTable t={t} isRTL={isRTL} />
        </div>
        <div>
          <PendingVerificationsCard t={t} isRTL={isRTL} />
        </div>
      </div>

      {/* Quick Actions */}
      {(currentUser?.role === 'admin' || currentUser?.role === 'cashier') && (
        <Card className="p-4">
          <h3 className={cn("text-sm font-semibold mb-3", isRTL && "text-right")}>{t('dashboard.quickActions')}</h3>
          <div className={cn("flex flex-wrap gap-2", isRTL && "flex-row-reverse")}>
            <Button variant="enterprise" size="sm">
              <Users className="w-4 h-4" />
              {t('dashboard.addStudent')}
            </Button>
            <Button variant="enterprise-outline" size="sm">
              <DollarSign className="w-4 h-4" />
              {t('dashboard.processPayment')}
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4" />
              {t('dashboard.generateReport')}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
