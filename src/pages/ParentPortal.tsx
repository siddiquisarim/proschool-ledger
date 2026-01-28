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
  const { currentUser, setCurrentUser, language, setLanguage, isRTL, t } = useApp();
  const [selectedChild, setSelectedChild] = React.useState(mockChildren[0]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">{t('common.paid')}</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">{t('fee.partial')}</Badge>;
      case 'pending':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">{t('common.pending')}</Badge>;
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
          <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="font-semibold text-foreground">{t('parent.portal')}</h1>
              <p className="text-xs text-muted-foreground">{t('parent.welcome')}, {currentUser?.name}</p>
            </div>
          </div>
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            >
              <Languages className="w-4 h-4" />
              <span className={cn("text-xs", isRTL ? "mr-1" : "ml-1")}>{language === 'en' ? 'AR' : 'EN'}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className={cn("w-4 h-4", isRTL ? "ml-1" : "mr-1")} />
              <span className="hidden sm:inline">{t('common.logout')}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Child Selector */}
        {mockChildren.length > 1 && (
          <div className={cn("flex gap-2 overflow-x-auto pb-2", isRTL && "flex-row-reverse")}>
            {mockChildren.map((child) => (
              <Button
                key={child.id}
                variant={selectedChild.id === child.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedChild(child)}
                className="shrink-0"
              >
                <User className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
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
                <CardTitle className={cn("flex items-center gap-2 text-lg", isRTL && "flex-row-reverse")}>
                  <User className="w-5 h-5 text-primary" />
                  {t('student.info')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={cn("flex flex-col sm:flex-row gap-4", isRTL && "sm:flex-row-reverse")}>
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="grid gap-2 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className="text-xs text-muted-foreground">{t('student.fullName')}</p>
                        <p className="font-medium">{selectedChild.name}</p>
                      </div>
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className="text-xs text-muted-foreground">{t('student.id')}</p>
                        <p className="font-medium">{selectedChild.studentId}</p>
                      </div>
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className="text-xs text-muted-foreground">{t('student.grade')}</p>
                        <p className="font-medium">{selectedChild.grade}</p>
                      </div>
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className="text-xs text-muted-foreground">{t('student.section')}</p>
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
                <CardTitle className={cn("flex items-center gap-2 text-lg", isRTL && "flex-row-reverse")}>
                  <Calendar className="w-5 h-5 text-primary" />
                  {t('attendance.overview')}
                </CardTitle>
                <CardDescription>{t('attendance.currentYear')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-green-500/10 text-center">
                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{selectedChild.attendance.present}</p>
                    <p className="text-xs text-muted-foreground">{t('attendance.present')}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-red-500/10 text-center">
                    <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">{selectedChild.attendance.absent}</p>
                    <p className="text-xs text-muted-foreground">{t('attendance.absent')}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-500/10 text-center">
                    <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">{selectedChild.attendance.late}</p>
                    <p className="text-xs text-muted-foreground">{t('attendance.late')}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/10 text-center">
                    <AlertCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{selectedChild.attendance.excused}</p>
                    <p className="text-xs text-muted-foreground">{t('attendance.excused')}</p>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-muted/50">
                  <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
                    <span className="text-sm text-muted-foreground">{t('attendance.rate')}</span>
                    <span className="font-semibold text-primary">
                      {Math.round((selectedChild.attendance.present / selectedChild.attendance.total) * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full bg-primary rounded-full transition-all", isRTL && "ml-auto")}
                      style={{ width: `${(selectedChild.attendance.present / selectedChild.attendance.total) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fee Status Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
                  <CardTitle className={cn("flex items-center gap-2 text-lg", isRTL && "flex-row-reverse")}>
                    <DollarSign className="w-5 h-5 text-primary" />
                    {t('student.feeStatus')}
                  </CardTitle>
                  {getStatusBadge(selectedChild.fees.status)}
                </div>
                <CardDescription>
                  {selectedChild.fees.nextDueDate 
                    ? `${t('fee.nextDue')}: ${selectedChild.fees.nextDueDate}`
                    : t('fee.allPaid')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{t('fee.totalDue')}</p>
                    <p className="font-bold text-lg">${selectedChild.fees.totalDue.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{t('common.paid')}</p>
                    <p className="font-bold text-lg text-green-600">${selectedChild.fees.totalPaid.toLocaleString()}</p>
                  </div>
                  <div className={cn(
                    "p-3 rounded-lg text-center",
                    selectedChild.fees.balance > 0 ? "bg-red-500/10" : "bg-green-500/10"
                  )}>
                    <p className="text-xs text-muted-foreground mb-1">{t('common.balance')}</p>
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
                  <p className="text-sm font-medium">{t('fee.breakdown')}</p>
                  {selectedChild.fees.items.map((item, index) => (
                    <div key={index} className={cn("flex items-center justify-between p-3 rounded-lg border", isRTL && "flex-row-reverse")}>
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t('common.paid')}: ${item.paid.toLocaleString()} {t('common.of')} ${item.amount.toLocaleString()}
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
                <CardTitle className={cn("flex items-center gap-2 text-lg", isRTL && "flex-row-reverse")}>
                  <Bell className="w-5 h-5 text-primary" />
                  {t('parent.noticeBoard')}
                </CardTitle>
                <CardDescription>{t('parent.latestAnnouncements')}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px] lg:h-[600px]">
                  <div className="space-y-3 p-4 pt-0">
                    {mockAnnouncements.map((announcement) => (
                      <div 
                        key={announcement.id}
                        className={cn(
                          "p-4 rounded-lg border border-l-4 hover:bg-muted/50 transition-colors cursor-pointer",
                          getPriorityColor(announcement.priority),
                          isRTL && "border-l-0 border-r-4"
                        )}
                      >
                        <div className={cn("flex items-start justify-between gap-2 mb-2", isRTL && "flex-row-reverse")}>
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {announcement.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{announcement.date}</span>
                        </div>
                        <h4 className={cn("font-medium text-sm mb-1", isRTL && "text-right")}>{announcement.title}</h4>
                        <p className={cn("text-xs text-muted-foreground line-clamp-2", isRTL && "text-right")}>
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
