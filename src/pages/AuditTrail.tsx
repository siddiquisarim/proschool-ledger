import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  LogIn,
  LogOut,
  UserPlus,
  Edit,
  CreditCard,
  Percent,
  DollarSign,
  CalendarCheck,
  CheckSquare,
  Ticket,
  Briefcase,
  Calendar,
  Clock,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import { AuditLog, AuditActionCategory } from '@/types';
import { mockAuditLogs } from '@/data/auditData';

const categoryIcons: Record<AuditActionCategory, React.ComponentType<{ className?: string }>> = {
  authentication: LogIn,
  student: UserPlus,
  payment: CreditCard,
  discount: Percent,
  fee: DollarSign,
  attendance: CalendarCheck,
  verification: CheckSquare,
  ticket: Ticket,
  employee: Briefcase,
  leave: Calendar,
  overtime: Clock,
  payroll: DollarSign,
  user: UserCog,
  settings: Settings,
};

const categoryColors: Record<AuditActionCategory, string> = {
  authentication: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  student: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  payment: 'bg-green-500/10 text-green-600 border-green-500/20',
  discount: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  fee: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  attendance: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  verification: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  ticket: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  employee: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
  leave: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
  overtime: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  payroll: 'bg-lime-500/10 text-lime-600 border-lime-500/20',
  user: 'bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-500/20',
  settings: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
};

const actionColors: Record<string, string> = {
  login: 'bg-blue-500/10 text-blue-600',
  logout: 'bg-slate-500/10 text-slate-600',
  create: 'bg-emerald-500/10 text-emerald-600',
  update: 'bg-amber-500/10 text-amber-600',
  delete: 'bg-red-500/10 text-red-600',
  approve: 'bg-green-500/10 text-green-600',
  reject: 'bg-red-500/10 text-red-600',
  submit: 'bg-indigo-500/10 text-indigo-600',
  finalize: 'bg-purple-500/10 text-purple-600',
};

export function AuditTrailPage() {
  const { t, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Only admin can access
  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t('common.accessDenied')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categories: AuditActionCategory[] = [
    'authentication', 'student', 'payment', 'discount', 'fee', 'attendance',
    'verification', 'ticket', 'employee', 'leave', 'overtime', 'payroll', 'user', 'settings'
  ];

  const actions = ['login', 'logout', 'create', 'update', 'delete', 'approve', 'reject', 'submit', 'finalize'];

  // Filter logs
  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.entityName?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = log.timestamp.startsWith(format(new Date(), 'yyyy-MM-dd'));
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(log.timestamp) >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = new Date(log.timestamp) >= monthAgo;
    }

    return matchesSearch && matchesCategory && matchesAction && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getActionIcon = (action: string) => {
    if (action === 'login') return <LogIn className="w-3.5 h-3.5" />;
    if (action === 'logout') return <LogOut className="w-3.5 h-3.5" />;
    if (action === 'create') return <UserPlus className="w-3.5 h-3.5" />;
    if (action === 'update') return <Edit className="w-3.5 h-3.5" />;
    return null;
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">{t('audit.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('audit.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            {t('common.export')}
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('common.refresh')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t('audit.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder={t('audit.filterCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')} {t('audit.categories')}</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{t(`audit.category.${cat}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder={t('audit.filterAction')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')} {t('audit.actions')}</SelectItem>
                {actions.map(action => (
                  <SelectItem key={action} value={action}>{t(`audit.action.${action}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-36">
                <SelectValue placeholder={t('audit.filterDate')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')} {t('audit.time')}</SelectItem>
                <SelectItem value="today">{t('audit.today')}</SelectItem>
                <SelectItem value="week">{t('audit.lastWeek')}</SelectItem>
                <SelectItem value="month">{t('audit.lastMonth')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader className="py-3 px-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t('audit.logs')}</CardTitle>
            <span className="text-sm text-muted-foreground">
              {filteredLogs.length} {t('audit.entries')}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-380px)]">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-44">{t('audit.timestamp')}</TableHead>
                  <TableHead className="w-36">{t('audit.user')}</TableHead>
                  <TableHead className="w-32">{t('audit.category')}</TableHead>
                  <TableHead className="w-28">{t('audit.action')}</TableHead>
                  <TableHead>{t('audit.description')}</TableHead>
                  <TableHead className="w-28">{t('audit.ipAddress')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log) => {
                  const CategoryIcon = categoryIcons[log.category];
                  return (
                    <TableRow key={log.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{log.userName}</p>
                          <p className="text-xs text-muted-foreground">{log.userRole}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${categoryColors[log.category]} text-xs gap-1`}
                        >
                          <CategoryIcon className="w-3 h-3" />
                          {t(`audit.category.${log.category}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={`${actionColors[log.action] || 'bg-muted'} text-xs gap-1`}
                        >
                          {getActionIcon(log.action)}
                          {t(`audit.action.${log.action}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{log.description}</p>
                        {log.entityName && (
                          <p className="text-xs text-muted-foreground">
                            {log.entityType}: {log.entityName}
                          </p>
                        )}
                        {log.details && (
                          <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {log.ipAddress}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {paginatedLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                      {t('audit.noLogs')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t('common.showing')} {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredLogs.length)} {t('common.of')} {filteredLogs.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
