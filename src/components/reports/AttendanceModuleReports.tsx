import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  ClipboardList,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { mockStudents, mockAttendance } from '@/data/mockData';
import { mockLevels } from '@/data/settingsData';

const reportTabs = [
  { value: 'summary', label: 'Summary Report', icon: <ClipboardList className="w-4 h-4" /> },
  { value: 'details', label: 'Details Report', icon: <FileText className="w-4 h-4" /> },
  { value: 'statistics', label: 'Statistics', icon: <BarChart3 className="w-4 h-4" /> },
];

export function AttendanceModuleReports() {
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');

  const activeLevels = mockLevels.filter(l => l.isActive);

  // Calculate summary stats
  const totalRecords = mockAttendance.length;
  const presentCount = mockAttendance.filter(a => a.status === 'present').length;
  const absentCount = mockAttendance.filter(a => a.status === 'absent').length;
  const lateCount = mockAttendance.filter(a => a.status === 'late').length;
  const excusedCount = mockAttendance.filter(a => a.status === 'excused').length;

  return (
    <div className="space-y-4">
      <MobileTabs tabs={reportTabs} defaultValue="summary">
        {/* Summary Report */}
        <TabsContent value="summary" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
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
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="All Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  <SelectItem value="jan">January 2024</SelectItem>
                  <SelectItem value="feb">February 2024</SelectItem>
                  <SelectItem value="mar">March 2024</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1" />
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-accent">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Present</p>
              <p className="text-2xl font-semibold text-accent mt-1">{presentCount}</p>
              <p className="text-xs text-muted-foreground">
                {((presentCount / totalRecords) * 100).toFixed(1)}%
              </p>
            </Card>
            <Card className="p-4 border-l-4 border-l-destructive">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Absent</p>
              <p className="text-2xl font-semibold text-destructive mt-1">{absentCount}</p>
              <p className="text-xs text-muted-foreground">
                {((absentCount / totalRecords) * 100).toFixed(1)}%
              </p>
            </Card>
            <Card className="p-4 border-l-4 border-l-amber">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Late</p>
              <p className="text-2xl font-semibold text-amber mt-1">{lateCount}</p>
              <p className="text-xs text-muted-foreground">
                {((lateCount / totalRecords) * 100).toFixed(1)}%
              </p>
            </Card>
            <Card className="p-4 border-l-4 border-l-muted-foreground">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Excused</p>
              <p className="text-2xl font-semibold mt-1">{excusedCount}</p>
              <p className="text-xs text-muted-foreground">
                {((excusedCount / totalRecords) * 100).toFixed(1)}%
              </p>
            </Card>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class/Level</TableHead>
                    <TableHead className="text-center">Total Students</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-center">Absent</TableHead>
                    <TableHead className="text-center">Late</TableHead>
                    <TableHead className="text-center">Attendance %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeLevels.map(level => (
                    <TableRow key={level.id}>
                      <TableCell className="font-medium">{level.name}</TableCell>
                      <TableCell className="text-center">25</TableCell>
                      <TableCell className="text-center text-accent">22</TableCell>
                      <TableCell className="text-center text-destructive">2</TableCell>
                      <TableCell className="text-center text-amber">1</TableCell>
                      <TableCell className="text-center font-medium">92%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Details Report */}
        <TabsContent value="details" className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
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
              </div>
            </div>
          </Card>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Marked By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAttendance.slice(0, 15).map(record => {
                    const student = mockStudents.find(s => s.id === record.entityId);
                    return (
                      <TableRow key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell className="font-mono text-xs">{student?.studentId || '-'}</TableCell>
                        <TableCell>{student ? `${student.firstName} ${student.lastName}` : 'Unknown'}</TableCell>
                        <TableCell>{student?.grade} - {student?.section}</TableCell>
                        <TableCell>
                          <span className={`status-badge ${
                            record.status === 'present' ? 'status-paid' :
                            record.status === 'absent' ? 'status-overdue' :
                            record.status === 'late' ? 'status-pending' : 'status-partial'
                          }`}>
                            {record.status}
                          </span>
                        </TableCell>
                        <TableCell>{record.markedBy || 'System'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Statistics */}
        <TabsContent value="statistics" className="space-y-4">
          <Card className="p-8 text-center">
            <PieChart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Attendance statistics and charts will be displayed here</p>
            <p className="text-sm text-muted-foreground mt-2">Visual analytics including trends, patterns, and comparisons</p>
          </Card>
        </TabsContent>
      </MobileTabs>
    </div>
  );
}
