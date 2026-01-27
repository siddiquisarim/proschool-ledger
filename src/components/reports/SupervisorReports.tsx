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
  Tag,
  Clock,
  BarChart3,
  Users,
  Bus,
  CalendarCheck,
  Phone,
} from 'lucide-react';
import { mockStudents } from '@/data/mockData';
import { mockLevels, mockTransportAreas } from '@/data/settingsData';

const supervisorTabs = [
  { value: 'optional-fees', label: 'Optional Fees', icon: <Tag className="w-4 h-4" /> },
  { value: 'payments', label: 'Late/Advance', icon: <Clock className="w-4 h-4" /> },
  { value: 'statistics', label: 'Statistics', icon: <BarChart3 className="w-4 h-4" /> },
  { value: 'student-lists', label: 'Student Lists', icon: <Users className="w-4 h-4" /> },
  { value: 'transport', label: 'Transport', icon: <Bus className="w-4 h-4" /> },
  { value: 'attendance-sheets', label: 'Attendance Sheets', icon: <CalendarCheck className="w-4 h-4" /> },
  { value: 'contacts', label: 'Contact Lists', icon: <Phone className="w-4 h-4" /> },
];

export function SupervisorReports() {
  const activeLevels = mockLevels.filter(l => l.isActive);

  return (
    <div className="space-y-4">
      <MobileTabs tabs={supervisorTabs} defaultValue="optional-fees">
        {/* Optional/Extra Fees Student List */}
        <TabsContent value="optional-fees" className="space-y-4">
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
                    <TableHead>Optional Fee</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-xs">STU-001</TableCell>
                    <TableCell className="font-medium">Ahmed Mohammed</TableCell>
                    <TableCell>Grade 5 - A</TableCell>
                    <TableCell>School Bus</TableCell>
                    <TableCell className="text-right font-mono">AED 3,500</TableCell>
                    <TableCell><Badge variant="default">Paid</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">STU-002</TableCell>
                    <TableCell className="font-medium">Sara Ali</TableCell>
                    <TableCell>Grade 3 - B</TableCell>
                    <TableCell>Swimming Classes</TableCell>
                    <TableCell className="text-right font-mono">AED 1,200</TableCell>
                    <TableCell><Badge variant="secondary">Pending</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">STU-003</TableCell>
                    <TableCell className="font-medium">Omar Hassan</TableCell>
                    <TableCell>Grade 7 - A</TableCell>
                    <TableCell>Meal Plan</TableCell>
                    <TableCell className="text-right font-mono">AED 2,800</TableCell>
                    <TableCell><Badge variant="default">Paid</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Late/Advance Payments */}
        <TabsContent value="payments" className="space-y-4">
          <Card className="p-4">
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Export</span>
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-4 border-l-4 border-l-destructive">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Late Payments</p>
              <p className="text-2xl font-semibold text-destructive mt-1">23</p>
              <p className="text-xs text-muted-foreground">Students with overdue fees</p>
            </Card>
            <Card className="p-4 border-l-4 border-l-accent">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Advance Payments</p>
              <p className="text-2xl font-semibold text-accent mt-1">8</p>
              <p className="text-xs text-muted-foreground">Students paid in advance</p>
            </Card>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Days</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Ahmed Mohammed</TableCell>
                    <TableCell>Grade 5 - A</TableCell>
                    <TableCell><Badge variant="destructive">Late</Badge></TableCell>
                    <TableCell>Jan 15, 2024</TableCell>
                    <TableCell className="text-right font-mono">AED 5,000</TableCell>
                    <TableCell className="text-destructive">45 days late</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Sara Ali</TableCell>
                    <TableCell>Grade 3 - B</TableCell>
                    <TableCell><Badge variant="default">Advance</Badge></TableCell>
                    <TableCell>Apr 1, 2024</TableCell>
                    <TableCell className="text-right font-mono">AED 8,000</TableCell>
                    <TableCell className="text-accent">2 months early</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Statistics */}
        <TabsContent value="statistics" className="space-y-4">
          <Card className="p-8 text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Supervisor statistics will be displayed here</p>
            <p className="text-sm text-muted-foreground mt-2">Enrollment trends, payment patterns, attendance analytics</p>
          </Card>
        </TabsContent>

        {/* Student Lists */}
        <TabsContent value="student-lists" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {activeLevels.map(level => (
                    <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-1" />
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Export</span>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Guardian</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStudents.filter(s => s.status === 'active').slice(0, 10).map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-xs">{student.studentId}</TableCell>
                      <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>{student.section}</TableCell>
                      <TableCell>{student.parentName}</TableCell>
                      <TableCell>
                        <Badge variant="default">{student.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Transport Lists */}
        <TabsContent value="transport" className="space-y-4">
          <Card className="p-4">
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Export</span>
              </Button>
            </div>
          </Card>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area/Block</TableHead>
                    <TableHead>Transport Line</TableHead>
                    <TableHead className="text-center">Students</TableHead>
                    <TableHead className="text-right">Fee/Month</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTransportAreas.map(area => (
                    <TableRow key={area.id}>
                      <TableCell className="font-medium">{area.name}</TableCell>
                      <TableCell>Route {area.name.split(' ')[1]}</TableCell>
                      <TableCell className="text-center">15</TableCell>
                      <TableCell className="text-right font-mono">AED {area.fee.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={area.isActive ? 'default' : 'secondary'}>
                          {area.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Attendance Sheets */}
        <TabsContent value="attendance-sheets" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {activeLevels.map(level => (
                    <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-1" />
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Generate Sheet</span>
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Print</span>
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-8 text-center">
            <CalendarCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Printable attendance sheets will be generated here</p>
            <p className="text-sm text-muted-foreground mt-2">Select class and date range to generate sheets</p>
          </Card>
        </TabsContent>

        {/* Contact Lists */}
        <TabsContent value="contacts" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search contacts..." className="pl-9 h-9" />
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
                    <TableHead>Student</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Guardian Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Emergency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStudents.filter(s => s.status === 'active').slice(0, 10).map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                      <TableCell>{student.grade} - {student.section}</TableCell>
                      <TableCell>{student.parentName}</TableCell>
                      <TableCell className="font-mono text-sm">{student.parentPhone}</TableCell>
                      <TableCell>{student.parentEmail}</TableCell>
                      <TableCell className="font-mono text-sm">{student.parentPhone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </MobileTabs>
    </div>
  );
}
