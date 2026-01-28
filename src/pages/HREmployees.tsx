import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { mockEmployees } from '@/data/mockData';
import { Employee, EmploymentType } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MobileTabs, TabsContent } from '@/components/ui/mobile-tabs';
import { Plus, Edit, Eye, Search, Users, Briefcase, Clock, BarChart3 } from 'lucide-react';
import { EmployeeDetailsReport } from '@/components/reports/HRModuleReports';
import { cn } from '@/lib/utils';

const departments = ['Administration', 'Finance', 'Academic', 'IT', 'Maintenance', 'HR'];

export function HREmployeesPage() {
  const { currentUser, t, isRTL } = useApp();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editMode, setEditMode] = useState(false);

  const employmentTypes: { value: EmploymentType; label: string }[] = [
    { value: 'full_time', label: t('hr.fullTime') },
    { value: 'part_time', label: t('hr.partTime') },
    { value: 'contract', label: t('hr.contract') },
    { value: 'temporary', label: t('hr.temporary') },
  ];

  const [formData, setFormData] = useState<Partial<Employee>>({
    employeeCode: '',
    cpr: '',
    department: '',
    occupation: '',
    employmentType: 'full_time',
    workingHours: 40,
    yearlyLeaveBalance: 25,
    usedLeave: 0,
    basicSalary: 0,
    mobileAllowance: 0,
    transportAllowance: 0,
    status: 'active',
  });

  const isAdmin = currentUser?.role === 'admin';

  const filteredEmployees = employees.filter(emp => 
    emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.occupation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (editMode && selectedEmployee) {
      setEmployees(employees.map(e => e.id === selectedEmployee.id ? { ...e, ...formData } as Employee : e));
    } else {
      const newEmployee: Employee = {
        ...formData as Employee,
        id: `e${Date.now()}`,
        userId: `u${Date.now()}`,
        joinDate: new Date().toISOString().split('T')[0],
      };
      setEmployees([...employees, newEmployee]);
    }
    setShowAddDialog(false);
    setEditMode(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      employeeCode: '',
      cpr: '',
      department: '',
      occupation: '',
      employmentType: 'full_time',
      workingHours: 40,
      yearlyLeaveBalance: 25,
      usedLeave: 0,
      basicSalary: 0,
      mobileAllowance: 0,
      transportAllowance: 0,
      status: 'active',
    });
  };

  const openEditDialog = (emp: Employee) => {
    setFormData(emp);
    setSelectedEmployee(emp);
    setEditMode(true);
    setShowAddDialog(true);
  };

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    departments: [...new Set(employees.map(e => e.department))].length,
  };

  const mainTabs = [
    { value: 'list', label: t('common.list'), icon: <Users className="w-4 h-4" /> },
    { value: 'reports', label: t('common.reports'), icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-2xl font-semibold text-foreground">{t('hr.employees')}</h1>
          <p className="text-sm text-muted-foreground">{t('hr.manageRecords')}</p>
        </div>
        {isAdmin && (
          <Dialog open={showAddDialog} onOpenChange={(open) => { setShowAddDialog(open); if (!open) { setEditMode(false); resetForm(); } }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                {t('hr.addEmployee')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editMode ? t('hr.editEmployee') : t('hr.addEmployee')}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>{t('hr.employeeCode')}</Label>
                  <Input value={formData.employeeCode} onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })} placeholder="EMP-XXX" />
                </div>
                <div className="space-y-2">
                  <Label>CPR</Label>
                  <Input value={formData.cpr} onChange={(e) => setFormData({ ...formData, cpr: e.target.value })} placeholder="CPR Number" />
                </div>
                <div className="space-y-2">
                  <Label>{t('hr.department')}</Label>
                  <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                    <SelectTrigger><SelectValue placeholder={t('hr.department')} /></SelectTrigger>
                    <SelectContent>
                      {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('hr.occupation')}</Label>
                  <Input value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} placeholder={t('hr.occupation')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('hr.employmentType')}</Label>
                  <Select value={formData.employmentType} onValueChange={(v) => setFormData({ ...formData, employmentType: v as EmploymentType })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {employmentTypes.map(type => <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('hr.workingHours')}/Week</Label>
                  <Input type="number" value={formData.workingHours} onChange={(e) => setFormData({ ...formData, workingHours: Number(e.target.value) })} />
                </div>
                <div className="col-span-2">
                  <h4 className="font-medium mb-3 mt-2">{t('hr.leaveBalance')} & {t('hr.compensation')}</h4>
                </div>
                <div className="space-y-2">
                  <Label>{t('hr.yearlyLeave')}</Label>
                  <Input type="number" value={formData.yearlyLeaveBalance} onChange={(e) => setFormData({ ...formData, yearlyLeaveBalance: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>{t('hr.basicSalary')}</Label>
                  <Input type="number" value={formData.basicSalary} onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>{t('hr.mobileAllowance')}</Label>
                  <Input type="number" value={formData.mobileAllowance} onChange={(e) => setFormData({ ...formData, mobileAllowance: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>{t('hr.transportAllowance')}</Label>
                  <Input type="number" value={formData.transportAllowance} onChange={(e) => setFormData({ ...formData, transportAllowance: Number(e.target.value) })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>{t('common.cancel')}</Button>
                <Button onClick={handleSave}>{editMode ? t('common.update') : t('common.add')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <MobileTabs tabs={mainTabs} defaultValue="list">
        <TabsContent value="list" className="space-y-6 mt-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className={cn("p-4 flex items-center gap-4", isRTL && "flex-row-reverse")}>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">{t('hr.totalEmployees')}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className={cn("p-4 flex items-center gap-4", isRTL && "flex-row-reverse")}>
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <Briefcase className="w-6 h-6 text-emerald-600" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-sm text-muted-foreground">{t('hr.activeEmployees')}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className={cn("p-4 flex items-center gap-4", isRTL && "flex-row-reverse")}>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-2xl font-bold">{stats.departments}</p>
                  <p className="text-sm text-muted-foreground">{t('hr.departments')}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Table */}
          <Card>
            <CardHeader className="pb-3">
              <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
                <div className="relative flex-1 max-w-sm">
                  <Search className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground", isRTL ? "right-3" : "left-3")} />
                  <Input 
                    placeholder={t('hr.searchEmployees')} 
                    className={isRTL ? "pr-9" : "pl-9"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('hr.employeeCode')}</TableHead>
                    <TableHead>{t('hr.department')}</TableHead>
                    <TableHead>{t('hr.occupation')}</TableHead>
                    <TableHead>{t('hr.employmentType')}</TableHead>
                    <TableHead>{t('hr.leaveBalance')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead className={cn(isRTL ? "text-left" : "text-right")}>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map(emp => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-mono text-sm">{emp.employeeCode}</TableCell>
                      <TableCell>{emp.department}</TableCell>
                      <TableCell>{emp.occupation}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {emp.employmentType.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {emp.yearlyLeaveBalance - emp.usedLeave} / {emp.yearlyLeaveBalance} {isRTL ? 'أيام' : 'days'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={emp.status === 'active' ? 'default' : 'secondary'}>
                          {emp.status === 'active' ? t('common.active') : t('common.inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell className={cn(isRTL ? "text-left" : "text-right")}>
                        <div className={cn("flex gap-1", isRTL ? "justify-start" : "justify-end")}>
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedEmployee(emp); setShowDetailDialog(true); }}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {isAdmin && (
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(emp)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <EmployeeDetailsReport />
        </TabsContent>
      </MobileTabs>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('hr.employeeDetails')}</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className={isRTL ? "text-right" : "text-left"}>
                  <Label className="text-xs text-muted-foreground">{t('hr.employeeCode')}</Label>
                  <p className="font-mono">{selectedEmployee.employeeCode}</p>
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <Label className="text-xs text-muted-foreground">CPR</Label>
                  <p className="font-mono">{selectedEmployee.cpr}</p>
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <Label className="text-xs text-muted-foreground">{t('hr.department')}</Label>
                  <p>{selectedEmployee.department}</p>
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <Label className="text-xs text-muted-foreground">{t('hr.occupation')}</Label>
                  <p>{selectedEmployee.occupation}</p>
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <Label className="text-xs text-muted-foreground">{t('hr.employmentType')}</Label>
                  <p className="capitalize">{selectedEmployee.employmentType.replace('_', ' ')}</p>
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <Label className="text-xs text-muted-foreground">{t('hr.workingHours')}</Label>
                  <p>{selectedEmployee.workingHours} hrs/week</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className={cn("font-medium mb-3", isRTL && "text-right")}>{t('hr.compensation')}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <Label className="text-xs text-muted-foreground">{t('hr.basicSalary')}</Label>
                    <p className="font-semibold">${selectedEmployee.basicSalary.toLocaleString()}</p>
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <Label className="text-xs text-muted-foreground">{t('hr.mobileAllowance')}</Label>
                    <p>${selectedEmployee.mobileAllowance}</p>
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <Label className="text-xs text-muted-foreground">{t('hr.transportAllowance')}</Label>
                    <p>${selectedEmployee.transportAllowance}</p>
                  </div>
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <Label className="text-xs text-muted-foreground">{t('hr.leaveBalance')}</Label>
                    <p>{selectedEmployee.yearlyLeaveBalance - selectedEmployee.usedLeave} / {selectedEmployee.yearlyLeaveBalance} {isRTL ? 'أيام' : 'days'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
