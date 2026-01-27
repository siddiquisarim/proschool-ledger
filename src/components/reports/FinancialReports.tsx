import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MobileTabs, TabsContent } from '@/components/ui/mobile-tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  FileText,
  Printer,
  Search,
  AlertTriangle,
  Tag,
  Receipt,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { mockStudents, mockPayments, mockFeeStructures } from '@/data/mockData';
import { cn } from '@/lib/utils';

const financialTabs = [
  { value: 'shortages', label: 'Shortages', icon: <AlertTriangle className="w-4 h-4" /> },
  { value: 'discounts', label: 'Discounts', icon: <Tag className="w-4 h-4" /> },
  { value: 'receipts', label: 'Receipts/Invoices', icon: <Receipt className="w-4 h-4" /> },
  { value: 'financial', label: 'Financial Reports', icon: <BarChart3 className="w-4 h-4" /> },
  { value: 'statistics', label: 'Statistics', icon: <PieChart className="w-4 h-4" /> },
];

export function FinancialReports() {
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const grades = [...new Set(mockStudents.map(s => s.grade))].sort();

  // Calculate student balances
  const getStudentBalance = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    if (!student) return 0;

    const mandatoryFees = mockFeeStructures.filter(f => f.type === 'mandatory');
    const monthlyFee = mockFeeStructures.find(f => 
      f.type === 'monthly' && f.grade.includes(student.grade)
    );

    const totalMandatory = mandatoryFees.reduce((sum, f) => sum + f.amount, 0);
    const monthlyTotal = monthlyFee ? monthlyFee.amount * 10 : 0;
    let totalDue = totalMandatory + monthlyTotal;

    if (student.discountType && student.discountType !== 'none' && student.discountValue) {
      totalDue = totalDue * (1 - student.discountValue / 100);
    }

    const totalPaid = mockPayments
      .filter(p => p.studentId === studentId && p.status === 'finalized')
      .reduce((sum, p) => sum + p.amount, 0);

    return totalDue - totalPaid;
  };

  const studentsWithBalance = mockStudents
    .filter(s => s.status === 'active' && (gradeFilter === 'all' || s.grade === gradeFilter))
    .map(s => ({ ...s, balance: getStudentBalance(s.id) }))
    .filter(s => s.balance > 0)
    .sort((a, b) => b.balance - a.balance);

  const studentsWithDiscount = mockStudents.filter(
    s => s.discountType && s.discountType !== 'none' && s.discountValue && s.discountValue > 0
  );

  const totalOutstanding = studentsWithBalance.reduce((sum, s) => sum + s.balance, 0);

  return (
    <div className="space-y-4">
      <MobileTabs tabs={financialTabs} defaultValue="shortages">
        {/* Shortages Report */}
        <TabsContent value="shortages" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search students..." className="pl-9 h-9" />
                </div>
              </div>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {grades.map(grade => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Export Excel</span>
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Export PDF</span>
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Print</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 border-l-4 border-l-destructive">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Outstanding</p>
              <p className="text-2xl font-semibold font-mono mt-1">
                AED {totalOutstanding.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{studentsWithBalance.length} students with balance</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-amber">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Overdue (&gt;30 days)</p>
              <p className="text-2xl font-semibold font-mono mt-1">
                AED {(totalOutstanding * 0.4).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">~40% of total</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-accent">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Collection Rate</p>
              <p className="text-2xl font-semibold font-mono mt-1">78.5%</p>
              <p className="text-xs text-muted-foreground mt-1">This academic year</p>
            </Card>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Parent Contact</TableHead>
                    <TableHead className="text-right">Outstanding Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsWithBalance.map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-xs">{student.studentId}</TableCell>
                      <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                      <TableCell>{student.grade} - {student.section}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{student.parentName}</p>
                          <p className="text-xs text-muted-foreground">{student.parentPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium text-destructive">
                        AED {student.balance.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className={cn("status-badge", {
                          "status-overdue": student.balance > 10000,
                          "status-pending": student.balance > 5000 && student.balance <= 10000,
                          "status-partial": student.balance <= 5000,
                        })}>
                          {student.balance > 10000 ? 'Critical' : student.balance > 5000 ? 'Overdue' : 'Pending'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Discounts Report */}
        <TabsContent value="discounts" className="space-y-4">
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

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Discount Type</TableHead>
                    <TableHead className="text-right">Discount %</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsWithDiscount.map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-xs">{student.studentId}</TableCell>
                      <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                      <TableCell>{student.grade} - {student.section}</TableCell>
                      <TableCell className="capitalize">{student.discountType?.replace('_', ' ')}</TableCell>
                      <TableCell className="text-right font-mono font-medium text-accent">
                        {student.discountValue}%
                      </TableCell>
                      <TableCell>
                        <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                          {student.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Receipts/Invoices Report */}
        <TabsContent value="receipts" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search by receipt number..." className="pl-9 h-9" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Export</span>
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Fee Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Cashier ID</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayments.slice(0, 15).map(payment => {
                    const student = mockStudents.find(s => s.id === payment.studentId);
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-xs">{payment.receiptNumber}</TableCell>
                        <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                        <TableCell>{student ? `${student.firstName} ${student.lastName}` : 'Unknown'}</TableCell>
                        <TableCell>{payment.feeType}</TableCell>
                        <TableCell className="text-right font-mono">AED {payment.amount.toLocaleString()}</TableCell>
                        <TableCell className="font-mono text-xs">{payment.cashierId}</TableCell>
                        <TableCell>
                          <Badge variant={payment.status === 'finalized' ? 'default' : 'secondary'}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Financial Reports */}
        <TabsContent value="financial" className="space-y-4">
          <Card className="p-8 text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Financial reports and analysis will be displayed here</p>
            <p className="text-sm text-muted-foreground mt-2">Income statements, cash flow, and revenue analysis</p>
          </Card>
        </TabsContent>

        {/* Statistics */}
        <TabsContent value="statistics" className="space-y-4">
          <Card className="p-8 text-center">
            <PieChart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Financial statistics and charts will be displayed here</p>
            <p className="text-sm text-muted-foreground mt-2">Collection trends, payment patterns, and forecasts</p>
          </Card>
        </TabsContent>
      </MobileTabs>
    </div>
  );
}
