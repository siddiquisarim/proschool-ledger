import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { AuditActionCategory } from '@/types';
import { mockAuditLogs } from '@/data/auditData';

const actionColors: Record<string, string> = {
  login: 'text-blue-500',
  logout: 'text-slate-500',
  create: 'text-emerald-500',
  update: 'text-amber-500',
  delete: 'text-red-500',
  approve: 'text-green-500',
  reject: 'text-red-500',
  submit: 'text-indigo-500',
  finalize: 'text-purple-500',
};

export function AuditTrailPage() {
  const { t, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

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

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.entityName?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">{t('audit.title')}</h1>
          <p className="text-sm text-muted-foreground">{filteredLogs.length} {t('audit.entries')}</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          {t('common.export')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('audit.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40 h-9">
            <SelectValue placeholder={t('audit.filterCategory')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.all')}</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{t(`audit.category.${cat}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Log List */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="divide-y divide-border">
              {paginatedLogs.map((log) => (
                <div key={log.id} className="px-4 py-2.5 hover:bg-muted/30 font-mono text-sm">
                  <div className="flex flex-wrap items-start gap-x-3 gap-y-1">
                    <span className="text-muted-foreground text-xs shrink-0">
                      {format(new Date(log.timestamp), 'MMM dd HH:mm:ss')}
                    </span>
                    <Badge variant="outline" className="text-xs h-5 px-1.5 shrink-0">
                      {log.category}
                    </Badge>
                    <span className={`font-medium uppercase text-xs ${actionColors[log.action] || 'text-foreground'}`}>
                      {log.action}
                    </span>
                    <span className="text-foreground">
                      <span className="text-primary">{log.userName}</span>
                      <span className="text-muted-foreground"> ({log.userRole})</span>
                      <span className="mx-1.5">—</span>
                      {log.description}
                      {log.entityName && (
                        <span className="text-muted-foreground"> [{log.entityName}]</span>
                      )}
                    </span>
                  </div>
                  {log.details && (
                    <p className="text-xs text-muted-foreground mt-1 ml-20">
                      └─ {log.details}
                    </p>
                  )}
                </div>
              ))}
              {paginatedLogs.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  {t('audit.noLogs')}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredLogs.length)} / {filteredLogs.length}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-2">{currentPage}/{totalPages}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
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
