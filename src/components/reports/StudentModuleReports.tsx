import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MobileTabs, TabsContent } from '@/components/ui/mobile-tabs';
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
  Users,
  Receipt,
  History,
  AlertCircle,
  CalendarCheck,
} from 'lucide-react';
import { mockStudents, mockPayments } from '@/data/mockData';

const reportTabs = [
  { value: 'guardians', label: 'Students & Guardians', icon: <Users className="w-4 h-4" /> },
  { value: 'receipts', label: 'Reprint Receipts', icon: <Receipt className="w-4 h-4" /> },
  { value: 'transactions', label: 'Transactions', icon: <History className="w-4 h-4" /> },
  { value: 'incidents', label: 'Incidents', icon: <AlertCircle className="w-4 h-4" /> },
  { value: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
];

export function StudentModuleReports() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = mockStudents.filter(s =>
    s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const studentPayments = mockPayments.filter(p => p.status === 'finalized');

  return (
    <div className="space-y-4">
      <MobileTabs tabs={reportTabs} defaultValue="guardians">
        {/* Students & Guardians Report */}
        <TabsContent value="guardians" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </div>
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

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Guardian Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-xs">{student.studentId}</TableCell>
                      <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                      <TableCell>{student.grade} - {student.section}</TableCell>
                      <TableCell>{student.parentName}</TableCell>
                      <TableCell>{student.parentPhone}</TableCell>
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

        {/* Reprint Receipts/Invoices */}
        <TabsContent value="receipts" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search by receipt number or student..." className="pl-9 h-9" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentPayments.slice(0, 10).map(payment => {
                    const student = mockStudents.find(s => s.id === payment.studentId);
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-xs">{payment.receiptNumber}</TableCell>
                        <TableCell>{student ? `${student.firstName} ${student.lastName}` : 'Unknown'}</TableCell>
                        <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right font-mono">AED {payment.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="default">Finalized</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Printer className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Transactions History */}
        <TabsContent value="transactions" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search transactions..." className="pl-9 h-9" />
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
                    <TableHead>Date</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Type</TableHead>
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

        {/* Incidents */}
        <TabsContent value="incidents" className="space-y-4">
          <Card className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Student incidents report will be displayed here</p>
            <p className="text-sm text-muted-foreground mt-2">Track and manage student behavioral incidents and notes</p>
          </Card>
        </TabsContent>

        {/* Attendance */}
        <TabsContent value="attendance" className="space-y-4">
          <Card className="p-8 text-center">
            <CalendarCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Student attendance details will be displayed here</p>
            <p className="text-sm text-muted-foreground mt-2">View individual student attendance records and patterns</p>
          </Card>
        </TabsContent>
      </MobileTabs>
    </div>
  );
}
