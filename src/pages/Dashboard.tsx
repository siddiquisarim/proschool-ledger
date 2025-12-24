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
}

function StatCard({ title, value, subValue, icon: Icon, trend, trendValue, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: 'border-l-primary',
    success: 'border-l-accent',
    warning: 'border-l-amber',
    danger: 'border-l-destructive',
  };

  return (
    <Card className={cn("p-4 border-l-4", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-semibold mt-1 font-mono">{value}</p>
          {subValue && (
            <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>
          )}
          {trend && trendValue && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-xs font-medium",
              trend === 'up' ? 'text-accent' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
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

function RecentPaymentsTable() {
  const recentPayments = mockPayments.slice(0, 5);

  return (
    <Card>
      <div className="data-card-header flex items-center justify-between">
        <h3 className="text-sm font-semibold">Recent Transactions</h3>
        <Button variant="ghost" size="xs">View All</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Receipt #</th>
              <th>Student</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
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

function PendingVerificationsCard() {
  const pendingClosures = mockClosures.filter(c => c.status === 'pending' || c.status === 'supervisor_approved');

  return (
    <Card>
      <div className="data-card-header flex items-center justify-between">
        <h3 className="text-sm font-semibold">Verification Queue</h3>
        <span className="text-xs font-medium text-amber bg-amber/10 px-2 py-0.5 rounded">
          {pendingClosures.length} Pending
        </span>
      </div>
      <div className="divide-y divide-border">
        {pendingClosures.map((closure) => (
          <div key={closure.id} className="p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{closure.cashierName}</p>
                <p className="text-xs text-muted-foreground">{new Date(closure.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-medium">AED {closure.grandTotal.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{closure.transactionCount} transactions</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className={cn(
                "status-badge",
                closure.status === 'pending' && "status-pending",
                closure.status === 'supervisor_approved' && "status-partial"
              )}>
                {closure.status === 'pending' ? 'Awaiting Supervisor' : 'Awaiting Accountant'}
              </span>
            </div>
          </div>
        ))}
        {pendingClosures.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-accent" />
            <p className="text-sm">All verifications complete</p>
          </div>
        )}
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const { currentUser, t } = useApp();

  const totalStudents = mockStudents.filter(s => s.status === 'active').length;
  const totalCollected = mockPayments.filter(p => p.status === 'finalized').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = mockPayments.filter(p => p.status === 'pending').length;
  const pendingVerifications = mockClosures.filter(c => c.status === 'pending' || c.status === 'supervisor_approved').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t('nav.dashboard')}</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {currentUser?.name}. Here's your overview for today.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Today</p>
          <p className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Students"
          value={totalStudents}
          subValue="Enrolled this year"
          icon={Users}
          trend="up"
          trendValue="+12 this month"
          variant="default"
        />
        <StatCard
          title="Total Collected"
          value={`AED ${totalCollected.toLocaleString()}`}
          subValue="Current academic year"
          icon={DollarSign}
          trend="up"
          trendValue="+8.2% from last month"
          variant="success"
        />
        <StatCard
          title="Pending Payments"
          value={pendingPayments}
          subValue="Awaiting processing"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Verifications Queue"
          value={pendingVerifications}
          subValue="Closures pending review"
          icon={AlertTriangle}
          variant={pendingVerifications > 0 ? 'warning' : 'success'}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentPaymentsTable />
        </div>
        <div>
          <PendingVerificationsCard />
        </div>
      </div>

      {/* Quick Actions */}
      {(currentUser?.role === 'admin' || currentUser?.role === 'cashier') && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="enterprise" size="sm">
              <Users className="w-4 h-4" />
              Add Student
            </Button>
            <Button variant="enterprise-outline" size="sm">
              <DollarSign className="w-4 h-4" />
              Process Payment
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4" />
              Generate Report
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
