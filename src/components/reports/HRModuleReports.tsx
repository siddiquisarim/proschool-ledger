import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FileSpreadsheet,
  Printer,
  Search,
  User,
} from 'lucide-react';
import { mockEmployees, mockLeaveRequests, mockOvertimeRequests, mockPayrollEntries } from '@/data/mockData';
import { format } from 'date-fns';

// Employee Details Report
export function EmployeeDetailsReport() {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search employees..." className="pl-9 h-9" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Export Excel</span>
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Print</span>
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>CPR</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Basic Salary</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEmployees.map(emp => (
                <TableRow key={emp.id}>
                  <TableCell className="font-mono text-sm">{emp.employeeCode}</TableCell>
                  <TableCell className="font-mono text-xs">{emp.cpr}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>{emp.occupation}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {emp.employmentType.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">${emp.basicSalary.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={emp.status === 'active' ? 'default' : 'secondary'}>
                      {emp.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

// Leave Summary Report
export function LeaveSummaryReport() {
  const stats = {
    pending: mockLeaveRequests.filter(r => r.status === 'pending').length,
    approved: mockLeaveRequests.filter(r => r.status === 'approved').length,
    rejected: mockLeaveRequests.filter(r => r.status === 'rejected').length,
    totalDays: mockLeaveRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.daysCount, 0),
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Export Excel</span>
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Print</span>
          </Button>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center border-l-4 border-l-amber">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-semibold text-amber mt-1">{stats.pending}</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-accent">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Approved</p>
          <p className="text-2xl font-semibold text-accent mt-1">{stats.approved}</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-destructive">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Rejected</p>
          <p className="text-2xl font-semibold text-destructive mt-1">{stats.rejected}</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-primary">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Days</p>
          <p className="text-2xl font-semibold text-primary mt-1">{stats.totalDays}</p>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead className="text-center">Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeaveRequests.map(req => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.employeeName}</TableCell>
                  <TableCell>
                    {format(new Date(req.startDate), 'MMM d')} - {format(new Date(req.endDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-center">{req.daysCount}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{req.reason}</TableCell>
                  <TableCell>
                    <Badge variant={
                      req.status === 'approved' ? 'default' : 
                      req.status === 'rejected' ? 'destructive' : 'secondary'
                    }>
                      {req.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

// Overtime Summary Report
export function OvertimeSummaryReport() {
  const stats = {
    pending: mockOvertimeRequests.filter(r => r.status === 'pending').length,
    confirmed: mockOvertimeRequests.filter(r => r.status === 'supervisor_confirmed').length,
    approved: mockOvertimeRequests.filter(r => r.status === 'approved').length,
    totalHours: mockOvertimeRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.hours, 0),
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Export Excel</span>
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Print</span>
          </Button>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center border-l-4 border-l-amber">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-semibold text-amber mt-1">{stats.pending}</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-blue-500">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Confirmed</p>
          <p className="text-2xl font-semibold text-blue-600 mt-1">{stats.confirmed}</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-accent">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Approved</p>
          <p className="text-2xl font-semibold text-accent mt-1">{stats.approved}</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-primary">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Hours</p>
          <p className="text-2xl font-semibold text-primary mt-1">{stats.totalHours}h</p>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Hours</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Payroll</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOvertimeRequests.map(req => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.employeeName}</TableCell>
                  <TableCell>{format(new Date(req.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-center">{req.hours}h</TableCell>
                  <TableCell className="max-w-[200px] truncate">{req.reason}</TableCell>
                  <TableCell>
                    {req.addedToPayroll ? (
                      <Badge variant="outline" className="text-accent">{req.payrollMonth}</Badge>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      req.status === 'approved' ? 'default' : 
                      req.status === 'rejected' ? 'destructive' : 
                      req.status === 'supervisor_confirmed' ? 'outline' : 'secondary'
                    }>
                      {req.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

// Payslip Report
export function PayslipReport() {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search payslips..." className="pl-9 h-9" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Export</span>
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Print All</span>
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Basic</TableHead>
                <TableHead className="text-right">Allowances</TableHead>
                <TableHead className="text-right">Overtime</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayrollEntries.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.employeeName}</TableCell>
                  <TableCell>{entry.month} {entry.year}</TableCell>
                  <TableCell className="text-right font-mono">${entry.basicSalary.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">${(entry.mobileAllowance + entry.transportAllowance).toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">${entry.overtimeAmount.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-destructive">-${entry.totalDeductions.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">${entry.netSalary.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={
                      entry.status === 'paid' ? 'default' : 
                      entry.status === 'processed' ? 'outline' : 'secondary'
                    }>
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Printer className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
