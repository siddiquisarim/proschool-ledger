import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { mockEmployees } from '@/data/mockData';
import { Employee, EmploymentType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Eye, Search, Users, Briefcase, Clock, DollarSign } from 'lucide-react';

const employmentTypes: { value: EmploymentType; label: string }[] = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' },
];

const departments = ['Administration', 'Finance', 'Academic', 'IT', 'Maintenance', 'HR'];

export function HREmployeesPage() {
  const { currentUser } = useApp();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editMode, setEditMode] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Employee Management</h1>
          <p className="text-sm text-muted-foreground">Manage employee records and HR data</p>
        </div>
        {isAdmin && (
          <Dialog open={showAddDialog} onOpenChange={(open) => { setShowAddDialog(open); if (!open) { setEditMode(false); resetForm(); } }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editMode ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Employee Code</Label>
                  <Input value={formData.employeeCode} onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })} placeholder="EMP-XXX" />
                </div>
                <div className="space-y-2">
                  <Label>CPR</Label>
                  <Input value={formData.cpr} onChange={(e) => setFormData({ ...formData, cpr: e.target.value })} placeholder="CPR Number" />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>
                      {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Occupation</Label>
                  <Input value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} placeholder="Job Title" />
                </div>
                <div className="space-y-2">
                  <Label>Employment Type</Label>
                  <Select value={formData.employmentType} onValueChange={(v) => setFormData({ ...formData, employmentType: v as EmploymentType })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {employmentTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Working Hours/Week</Label>
                  <Input type="number" value={formData.workingHours} onChange={(e) => setFormData({ ...formData, workingHours: Number(e.target.value) })} />
                </div>
                <div className="col-span-2">
                  <h4 className="font-medium mb-3 mt-2">Leave & Benefits</h4>
                </div>
                <div className="space-y-2">
                  <Label>Yearly Leave Balance (Days)</Label>
                  <Input type="number" value={formData.yearlyLeaveBalance} onChange={(e) => setFormData({ ...formData, yearlyLeaveBalance: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Basic Salary</Label>
                  <Input type="number" value={formData.basicSalary} onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Mobile Allowance</Label>
                  <Input type="number" value={formData.mobileAllowance} onChange={(e) => setFormData({ ...formData, mobileAllowance: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Transport Allowance</Label>
                  <Input type="number" value={formData.transportAllowance} onChange={(e) => setFormData({ ...formData, transportAllowance: Number(e.target.value) })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                <Button onClick={handleSave}>{editMode ? 'Update' : 'Add'} Employee</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Employees</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <Briefcase className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active Employees</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.departments}</p>
              <p className="text-sm text-muted-foreground">Departments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search employees..." 
                className="pl-9"
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
                <TableHead>Code</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Leave Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                      {emp.yearlyLeaveBalance - emp.usedLeave} / {emp.yearlyLeaveBalance} days
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={emp.status === 'active' ? 'default' : 'secondary'}>
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
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

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Employee Code</Label>
                  <p className="font-mono">{selectedEmployee.employeeCode}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">CPR</Label>
                  <p className="font-mono">{selectedEmployee.cpr}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Department</Label>
                  <p>{selectedEmployee.department}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Occupation</Label>
                  <p>{selectedEmployee.occupation}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Employment Type</Label>
                  <p className="capitalize">{selectedEmployee.employmentType.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Working Hours</Label>
                  <p>{selectedEmployee.workingHours} hrs/week</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Compensation</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Basic Salary</Label>
                    <p className="font-semibold">${selectedEmployee.basicSalary.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Mobile Allowance</Label>
                    <p>${selectedEmployee.mobileAllowance}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Transport Allowance</Label>
                    <p>${selectedEmployee.transportAllowance}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Leave Balance</Label>
                    <p>{selectedEmployee.yearlyLeaveBalance - selectedEmployee.usedLeave} / {selectedEmployee.yearlyLeaveBalance} days</p>
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