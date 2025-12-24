import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileSpreadsheet, FileText, Printer, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { mockStudents, mockPayments, mockFeeStructures } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function ReportsPage() {
  const { t } = useApp();
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const grades = [...new Set(mockStudents.map(s => s.grade))].sort();

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

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t('nav.reports')}</h1>
          <p className="text-sm text-muted-foreground">
            Generate and export financial and academic reports
          </p>
        </div>
      </div>

      <Tabs defaultValue="dues" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dues">Fee Dues</TabsTrigger>
          <TabsTrigger value="students">Student List</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="shortages">Shortages</TabsTrigger>
        </TabsList>

        <TabsContent value="dues" className="space-y-4">
          {/* Filters & Actions */}
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
                  Export Excel
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
              </div>
            </div>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 border-l-4 border-l-destructive">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Outstanding</p>
              <p className="text-2xl font-semibold font-mono mt-1">
                AED {studentsWithBalance.reduce((sum, s) => sum + s.balance, 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{studentsWithBalance.length} students with balance</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-amber">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Overdue (&gt;30 days)</p>
              <p className="text-2xl font-semibold font-mono mt-1">
                AED {(studentsWithBalance.reduce((sum, s) => sum + s.balance, 0) * 0.4).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">~40% of total</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-accent">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Collection Rate</p>
              <p className="text-2xl font-semibold font-mono mt-1">78.5%</p>
              <p className="text-xs text-muted-foreground mt-1">This academic year</p>
            </Card>
          </div>

          {/* Report Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Grade</th>
                    <th>Parent Contact</th>
                    <th className="text-right">Outstanding Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsWithBalance.map((student) => (
                    <tr key={student.id}>
                      <td className="font-mono text-xs">{student.studentId}</td>
                      <td className="font-medium">{student.firstName} {student.lastName}</td>
                      <td>{student.grade} - {student.section}</td>
                      <td>
                        <div className="text-sm">
                          <p>{student.parentName}</p>
                          <p className="text-xs text-muted-foreground">{student.parentPhone}</p>
                        </div>
                      </td>
                      <td className="text-right font-mono font-medium text-destructive">
                        AED {student.balance.toLocaleString()}
                      </td>
                      <td>
                        <span className={cn("status-badge", {
                          "status-overdue": student.balance > 10000,
                          "status-pending": student.balance > 5000 && student.balance <= 10000,
                          "status-partial": student.balance <= 5000,
                        })}>
                          {student.balance > 10000 ? 'Critical' : student.balance > 5000 ? 'Overdue' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Student list report will be displayed here</p>
          </Card>
        </TabsContent>

        <TabsContent value="collections">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Collections report will be displayed here</p>
          </Card>
        </TabsContent>

        <TabsContent value="shortages">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Shortages report will be displayed here</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
