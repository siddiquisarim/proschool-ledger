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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Check,
  X,
  Clock,
  AlertCircle,
  Save,
  Users,
  GraduationCap,
} from 'lucide-react';
import { mockStudents, mockTeachers, mockAttendance } from '@/data/mockData';
import { AttendanceRecord } from '@/types';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

const statusConfig: Record<AttendanceStatus, { icon: typeof Check; label: string; className: string }> = {
  present: { icon: Check, label: 'Present', className: 'bg-accent text-accent-foreground' },
  absent: { icon: X, label: 'Absent', className: 'bg-destructive text-destructive-foreground' },
  late: { icon: Clock, label: 'Late', className: 'bg-amber text-foreground' },
  excused: { icon: AlertCircle, label: 'Excused', className: 'bg-status-partial text-foreground' },
};

export function AttendancePage() {
  const { t } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});
  const [entityType, setEntityType] = useState<'student' | 'teacher'>('student');

  const grades = [...new Set(mockStudents.map(s => s.grade))].sort();
  
  const entities = entityType === 'student'
    ? mockStudents.filter(s => s.status === 'active' && (gradeFilter === 'all' || s.grade === gradeFilter))
    : mockTeachers.filter(t => t.status === 'active');

  const dateKey = format(selectedDate, 'yyyy-MM-dd');
  
  // Load existing attendance for selected date
  const existingAttendance = mockAttendance.filter(
    a => a.date === dateKey && a.entityType === entityType
  );

  const getAttendanceStatus = (entityId: string): AttendanceStatus | undefined => {
    if (attendanceData[entityId]) return attendanceData[entityId];
    const existing = existingAttendance.find(a => a.entityId === entityId);
    return existing?.status as AttendanceStatus | undefined;
  };

  const setStatus = (entityId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({ ...prev, [entityId]: status }));
  };

  const markAllPresent = () => {
    const newData: Record<string, AttendanceStatus> = {};
    entities.forEach(e => {
      newData[e.id] = 'present';
    });
    setAttendanceData(newData);
  };

  const getStats = () => {
    const total = entities.length;
    let present = 0, absent = 0, late = 0, excused = 0;
    
    entities.forEach(e => {
      const status = getAttendanceStatus(e.id);
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'late') late++;
      else if (status === 'excused') excused++;
    });

    return { total, present, absent, late, excused, unmarked: total - present - absent - late - excused };
  };

  const stats = getStats();

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t('attendance.mark')}</h1>
          <p className="text-sm text-muted-foreground">
            Mark daily attendance for students and teachers
          </p>
        </div>
        <Button variant="enterprise" size="sm">
          <Save className="w-4 h-4" />
          Save Attendance
        </Button>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Date:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-[180px] justify-start">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {format(selectedDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Entity Type Tabs */}
          <Tabs value={entityType} onValueChange={(v) => setEntityType(v as 'student' | 'teacher')}>
            <TabsList>
              <TabsTrigger value="student" className="text-xs">
                <GraduationCap className="w-3 h-3 mr-1" />
                Students
              </TabsTrigger>
              <TabsTrigger value="teacher" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                Teachers
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Grade Filter (Students only) */}
          {entityType === 'student' && (
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
          )}

          <div className="flex-1" />

          <Button variant="outline" size="sm" onClick={markAllPresent}>
            <Check className="w-4 h-4" />
            Mark All Present
          </Button>
        </div>
      </Card>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card className="p-3 text-center">
          <p className="text-2xl font-semibold">{stats.total}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
        </Card>
        <Card className="p-3 text-center border-l-4 border-l-accent">
          <p className="text-2xl font-semibold text-accent">{stats.present}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Present</p>
        </Card>
        <Card className="p-3 text-center border-l-4 border-l-destructive">
          <p className="text-2xl font-semibold text-destructive">{stats.absent}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Absent</p>
        </Card>
        <Card className="p-3 text-center border-l-4 border-l-amber">
          <p className="text-2xl font-semibold text-amber">{stats.late}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Late</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-2xl font-semibold text-muted-foreground">{stats.unmarked}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Unmarked</p>
        </Card>
      </div>

      {/* Attendance Grid */}
      <Card>
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                {entityType === 'student' && <th>Grade</th>}
                {entityType === 'teacher' && <th>Subject</th>}
                <th className="text-center">Present</th>
                <th className="text-center">Absent</th>
                <th className="text-center">Late</th>
                <th className="text-center">Excused</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {entities.map((entity) => {
                const id = entityType === 'student' 
                  ? (entity as typeof mockStudents[0]).studentId 
                  : (entity as typeof mockTeachers[0]).employeeId;
                const name = `${entity.firstName} ${entity.lastName}`;
                const detail = entityType === 'student'
                  ? `${(entity as typeof mockStudents[0]).grade} - ${(entity as typeof mockStudents[0]).section}`
                  : (entity as typeof mockTeachers[0]).subject;
                const status = getAttendanceStatus(entity.id);

                return (
                  <tr key={entity.id}>
                    <td className="font-mono text-xs">{id}</td>
                    <td className="font-medium">{name}</td>
                    <td>{detail}</td>
                    {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map((s) => (
                      <td key={s} className="text-center">
                        <button
                          onClick={() => setStatus(entity.id, s)}
                          className={cn(
                            "w-8 h-8 rounded flex items-center justify-center transition-all",
                            status === s ? statusConfig[s].className : "bg-muted hover:bg-muted/80"
                          )}
                        >
                          {React.createElement(statusConfig[s].icon, { className: "w-4 h-4" })}
                        </button>
                      </td>
                    ))}
                    <td>
                      {status ? (
                        <span className={cn("status-badge", {
                          "status-paid": status === 'present',
                          "status-overdue": status === 'absent',
                          "status-pending": status === 'late',
                          "status-partial": status === 'excused',
                        })}>
                          {statusConfig[status].label}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not marked</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// Need to import React for createElement
import React from 'react';
