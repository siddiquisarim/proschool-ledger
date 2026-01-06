import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { mockPayrollEntries, mockEmployees, mockOvertimeRequests } from '@/data/mockData';
import { PayrollEntry } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Printer, DollarSign, FileText, Calculator, Eye, Trash } from 'lucide-react';
import { format } from 'date-fns';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const currentYear = new Date().getFullYear();

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  processed: { label: 'Processed', variant: 'outline' },
  paid: { label: 'Paid', variant: 'default' },
};

export function HRPayrollPage() {
  const { currentUser } = useApp();
  const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>(mockPayrollEntries);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [showPayslipDialog, setShowPayslipDialog] = useState(false);
  const [showAddVariableDialog, setShowAddVariableDialog] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollEntry | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const [processForm, setProcessForm] = useState({
    month: format(new Date(), 'MMMM'),
    year: currentYear,
  });

  const [variableForm, setVariableForm] = useState({
    payrollId: '',
    type: 'benefit' as 'benefit' | 'deduction',
    name: '',
    amount: 0,
  });

  const isAccountant = currentUser?.role === 'accountant' || currentUser?.role === 'admin';

  const filteredEntries = payrollEntries.filter(entry => {
    if (activeTab === 'all') return true;
    return entry.status === activeTab;
  });

  const handleProcessPayroll = () => {
    const newEntries: PayrollEntry[] = mockEmployees.map(emp => {
      // Calculate approved overtime for this employee
      const approvedOvertime = mockOvertimeRequests.filter(
        ot => ot.employeeId === emp.id && ot.status === 'approved' && !ot.addedToPayroll
      );
      const overtimeHours = approvedOvertime.reduce((sum, ot) => sum + ot.hours, 0);
      const hourlyRate = emp.basicSalary / 160; // Assuming 160 working hours per month
      const overtimeAmount = overtimeHours * hourlyRate * 1.5; // 1.5x overtime rate

      const totalBenefits = emp.basicSalary + emp.mobileAllowance + emp.transportAllowance + overtimeAmount;
      
      return {
        id: `p${Date.now()}-${emp.id}`,
        employeeId: emp.id,
        employeeName: `Employee ${emp.employeeCode}`,
        month: processForm.month,
        year: processForm.year,
        basicSalary: emp.basicSalary,
        mobileAllowance: emp.mobileAllowance,
        transportAllowance: emp.transportAllowance,
        overtimeAmount,
        variableBenefits: [],
        variableDeductions: [],
        totalBenefits,
        totalDeductions: 0,
        netSalary: totalBenefits,
        status: 'draft' as const,
      };
    });

    setPayrollEntries([...newEntries, ...payrollEntries]);
    setShowProcessDialog(false);
  };

  const handleAddVariable = () => {
    if (!variableForm.payrollId) return;

    setPayrollEntries(payrollEntries.map(entry => {
      if (entry.id === variableForm.payrollId) {
        const updated = { ...entry };
        if (variableForm.type === 'benefit') {
          updated.variableBenefits = [...updated.variableBenefits, { name: variableForm.name, amount: variableForm.amount }];
          updated.totalBenefits += variableForm.amount;
          updated.netSalary += variableForm.amount;
        } else {
          updated.variableDeductions = [...updated.variableDeductions, { name: variableForm.name, amount: variableForm.amount }];
          updated.totalDeductions += variableForm.amount;
          updated.netSalary -= variableForm.amount;
        }
        return updated;
      }
      return entry;
    }));

    setShowAddVariableDialog(false);
    setVariableForm({ payrollId: '', type: 'benefit', name: '', amount: 0 });
  };

  const handleMarkAsPaid = (entry: PayrollEntry) => {
    setPayrollEntries(payrollEntries.map(e => 
      e.id === entry.id 
        ? { ...e, status: 'paid' as const, processedBy: currentUser?.name, processedAt: new Date().toISOString() } 
        : e
    ));
  };

  const stats = {
    draft: payrollEntries.filter(e => e.status === 'draft').length,
    processed: payrollEntries.filter(e => e.status === 'processed').length,
    paid: payrollEntries.filter(e => e.status === 'paid').length,
    totalPaid: payrollEntries.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.netSalary, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Payroll Management</h1>
          <p className="text-sm text-muted-foreground">Process payroll and generate payslips</p>
        </div>
        {isAccountant && (
          <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Calculator className="w-4 h-4" />
                Process Payroll
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Process Monthly Payroll</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select value={processForm.month} onValueChange={(v) => setProcessForm({ ...processForm, month: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select value={String(processForm.year)} onValueChange={(v) => setProcessForm({ ...processForm, year: Number(v) })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value={String(currentYear - 1)}>{currentYear - 1}</SelectItem>
                        <SelectItem value={String(currentYear)}>{currentYear}</SelectItem>
                        <SelectItem value={String(currentYear + 1)}>{currentYear + 1}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-md text-sm">
                  <p className="font-medium">This will:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>Create payroll entries for all active employees</li>
                    <li>Include fixed benefits (basic salary, allowances)</li>
                    <li>Auto-add approved overtime to payroll</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowProcessDialog(false)}>Cancel</Button>
                <Button onClick={handleProcessPayroll}>Process Payroll</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.draft}</p>
              <p className="text-sm text-muted-foreground">Draft</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.processed}</p>
              <p className="text-sm text-muted-foreground">Processed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.paid}</p>
              <p className="text-sm text-muted-foreground">Paid</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">${stats.totalPaid.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Paid</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Entries</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="processed">Processed</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.employeeName}</TableCell>
                      <TableCell>{entry.month} {entry.year}</TableCell>
                      <TableCell className="text-right">${entry.basicSalary.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${(entry.mobileAllowance + entry.transportAllowance).toLocaleString()}</TableCell>
                      <TableCell className="text-right">${entry.overtimeAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-red-600">-${entry.totalDeductions.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-semibold">${entry.netSalary.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[entry.status].variant}>
                          {statusConfig[entry.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => { setSelectedPayroll(entry); setShowPayslipDialog(true); }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {isAccountant && entry.status === 'draft' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => { 
                                  setVariableForm({ ...variableForm, payrollId: entry.id }); 
                                  setShowAddVariableDialog(true); 
                                }}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-emerald-600"
                                onClick={() => handleMarkAsPaid(entry)}
                              >
                                <DollarSign className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredEntries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No payroll entries found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payslip Dialog */}
      <Dialog open={showPayslipDialog} onOpenChange={setShowPayslipDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Payslip</span>
              <Button variant="outline" size="sm" className="gap-1">
                <Printer className="w-4 h-4" /> Print
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedPayroll && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <div className="text-center border-b pb-3">
                <h3 className="font-bold text-lg">ProSchool Academy</h3>
                <p className="text-sm text-muted-foreground">Payslip for {selectedPayroll.month} {selectedPayroll.year}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Employee</p>
                  <p className="font-medium">{selectedPayroll.employeeName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Period</p>
                  <p className="font-medium">{selectedPayroll.month} {selectedPayroll.year}</p>
                </div>
              </div>
              <div className="border-t pt-3">
                <h4 className="font-medium mb-2">Earnings</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Basic Salary</span>
                    <span>${selectedPayroll.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile Allowance</span>
                    <span>${selectedPayroll.mobileAllowance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport Allowance</span>
                    <span>${selectedPayroll.transportAllowance.toLocaleString()}</span>
                  </div>
                  {selectedPayroll.overtimeAmount > 0 && (
                    <div className="flex justify-between">
                      <span>Overtime</span>
                      <span>${selectedPayroll.overtimeAmount.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedPayroll.variableBenefits.map((b, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{b.name}</span>
                      <span>${b.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-medium border-t pt-1 mt-2">
                    <span>Total Earnings</span>
                    <span>${selectedPayroll.totalBenefits.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              {(selectedPayroll.totalDeductions > 0 || selectedPayroll.variableDeductions.length > 0) && (
                <div className="border-t pt-3">
                  <h4 className="font-medium mb-2">Deductions</h4>
                  <div className="space-y-1 text-sm">
                    {selectedPayroll.variableDeductions.map((d, i) => (
                      <div key={i} className="flex justify-between text-red-600">
                        <span>{d.name}</span>
                        <span>-${d.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-medium border-t pt-1 mt-2 text-red-600">
                      <span>Total Deductions</span>
                      <span>-${selectedPayroll.totalDeductions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Net Salary</span>
                  <span className="text-emerald-600">${selectedPayroll.netSalary.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Variable Dialog */}
      <Dialog open={showAddVariableDialog} onOpenChange={setShowAddVariableDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Benefit/Deduction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={variableForm.type} onValueChange={(v) => setVariableForm({ ...variableForm, type: v as 'benefit' | 'deduction' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="benefit">Benefit (Add)</SelectItem>
                  <SelectItem value="deduction">Deduction (Subtract)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                value={variableForm.name} 
                onChange={(e) => setVariableForm({ ...variableForm, name: e.target.value })}
                placeholder="e.g., Performance Bonus, Insurance"
              />
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input 
                type="number"
                value={variableForm.amount} 
                onChange={(e) => setVariableForm({ ...variableForm, amount: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddVariableDialog(false)}>Cancel</Button>
            <Button onClick={handleAddVariable} disabled={!variableForm.name || variableForm.amount <= 0}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}