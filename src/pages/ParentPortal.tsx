import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  User, 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  Bell, 
  LogOut,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for parent portal
const mockChildren = [
  {
    id: '1',
    name: 'Ahmed Ali',
    grade: 'Grade 5',
    section: 'A',
    studentId: 'STU-2024-001',
    photo: null,
    attendance: {
      present: 85,
      absent: 5,
      late: 8,
      excused: 2,
      total: 100
    },
    fees: {
      totalDue: 5000,
      totalPaid: 3500,
      balance: 1500,
      status: 'partial',
      nextDueDate: '2024-02-15',
      items: [
        { name: 'Tuition Fee', amount: 3000, paid: 2500, status: 'partial' },
        { name: 'Transport Fee', amount: 1500, paid: 1000, status: 'partial' },
        { name: 'Activity Fee', amount: 500, paid: 0, status: 'pending' },
      ]
    }
  },
  {
    id: '2',
    name: 'Fatima Ali',
    grade: 'Grade 3',
    section: 'B',
    studentId: 'STU-2024-002',
    photo: null,
    attendance: {
      present: 92,
      absent: 3,
      late: 4,
      excused: 1,
      total: 100
    },
    fees: {
      totalDue: 4500,
      totalPaid: 4500,
      balance: 0,
      status: 'paid',
      nextDueDate: null,
      items: [
        { name: 'Tuition Fee', amount: 3000, paid: 3000, status: 'paid' },
        { name: 'Transport Fee', amount: 1000, paid: 1000, status: 'paid' },
        { name: 'Activity Fee', amount: 500, paid: 500, status: 'paid' },
      ]
    }
  }
];

const mockAnnouncements = [
  {
    id: '1',
    title: 'Winter Break Schedule',
    content: 'School will be closed from December 20th to January 3rd for winter break. Classes resume on January 4th.',
    date: '2024-01-10',
    priority: 'high',
    category: 'Holiday'
  },
  {
    id: '2',
    title: 'Parent-Teacher Meeting',
    content: 'The next parent-teacher meeting is scheduled for January 25th. Please confirm your attendance.',
    date: '2024-01-08',
    priority: 'medium',
    category: 'Meeting'
  },
  {
    id: '3',
    title: 'Fee Payment Reminder',
    content: 'Kindly ensure all pending fees are cleared before the end of this month to avoid late payment charges.',
    date: '2024-01-05',
    priority: 'high',
    category: 'Finance'
  },
  {
    id: '4',
    title: 'Sports Day Event',
    content: 'Annual sports day will be held on February 10th. Students are encouraged to participate in various activities.',
    date: '2024-01-03',
    priority: 'low',
    category: 'Event'
  },
  {
    id: '5',
    title: 'New Library Hours',
    content: 'The school library will now be open from 8 AM to 5 PM on weekdays. Extended hours on Saturdays.',
    date: '2024-01-02',
    priority: 'low',
    category: 'General'
  }
];

const ParentPortal = () => {
  const { currentUser, setCurrentUser, language, setLanguage, isRTL } = useApp();
  const [selectedChild, setSelectedChild] = React.useState(mockChildren[0]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Paid</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Partial</Badge>;
      case 'pending':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Pending</Badge>;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Parent Portal</h1>
              <p className="text-xs text-muted-foreground">Welcome, {currentUser?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            >
              <Languages className="w-4 h-4" />
              <span className="ml-1 text-xs">{language === 'en' ? 'AR' : 'EN'}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Child Selector */}
        {mockChildren.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {mockChildren.map((child) => (
              <Button
                key={child.id}
                variant={selectedChild.id === child.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedChild(child)}
                className="shrink-0"
              >
                <User className="w-4 h-4 mr-2" />
                {child.name}
              </Button>
            ))}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Child Info & Attendance */}
          <div className="space-y-6 lg:col-span-2">
            {/* Student Info Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-primary" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="grid gap-2 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Full Name</p>
                        <p className="font-medium">{selectedChild.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Student ID</p>
                        <p className="font-medium">{selectedChild.studentId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Grade</p>
                        <p className="font-medium">{selectedChild.grade}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Section</p>
                        <p className="font-medium">{selectedChild.section}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  Attendance Overview
                </CardTitle>
                <CardDescription>Current academic year statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-green-500/10 text-center">
                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{selectedChild.attendance.present}</p>
                    <p className="text-xs text-muted-foreground">Present</p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-500/10 text-center">
                    <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">{selectedChild.attendance.absent}</p>
                    <p className="text-xs text-muted-foreground">Absent</p>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-500/10 text-center">
                    <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">{selectedChild.attendance.late}</p>
                    <p className="text-xs text-muted-foreground">Late</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/10 text-center">
                    <AlertCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{selectedChild.attendance.excused}</p>
                    <p className="text-xs text-muted-foreground">Excused</p>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Attendance Rate</span>
                    <span className="font-semibold text-primary">
                      {Math.round((selectedChild.attendance.present / selectedChild.attendance.total) * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(selectedChild.attendance.present / selectedChild.attendance.total) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fee Status Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Fee Status
                  </CardTitle>
                  {getStatusBadge(selectedChild.fees.status)}
                </div>
                <CardDescription>
                  {selectedChild.fees.nextDueDate 
                    ? `Next payment due: ${selectedChild.fees.nextDueDate}`
                    : 'All fees are paid'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Due</p>
                    <p className="font-bold text-lg">${selectedChild.fees.totalDue.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Paid</p>
                    <p className="font-bold text-lg text-green-600">${selectedChild.fees.totalPaid.toLocaleString()}</p>
                  </div>
                  <div className={cn(
                    "p-3 rounded-lg text-center",
                    selectedChild.fees.balance > 0 ? "bg-red-500/10" : "bg-green-500/10"
                  )}>
                    <p className="text-xs text-muted-foreground mb-1">Balance</p>
                    <p className={cn(
                      "font-bold text-lg",
                      selectedChild.fees.balance > 0 ? "text-red-600" : "text-green-600"
                    )}>
                      ${selectedChild.fees.balance.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <p className="text-sm font-medium">Fee Breakdown</p>
                  {selectedChild.fees.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Paid: ${item.paid.toLocaleString()} of ${item.amount.toLocaleString()}
                        </p>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Announcements */}
          <div className="lg:col-span-1">
            <Card className="h-fit lg:sticky lg:top-20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="w-5 h-5 text-primary" />
                  Notice Board
                </CardTitle>
                <CardDescription>Latest announcements and updates</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px] lg:h-[600px]">
                  <div className="space-y-3 p-4 pt-0">
                    {mockAnnouncements.map((announcement) => (
                      <div 
                        key={announcement.id}
                        className={cn(
                          "p-4 rounded-lg border border-l-4 hover:bg-muted/50 transition-colors cursor-pointer",
                          getPriorityColor(announcement.priority)
                        )}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {announcement.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{announcement.date}</span>
                        </div>
                        <h4 className="font-medium text-sm mb-1">{announcement.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {announcement.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentPortal;
