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
import { Printer, Download, User } from 'lucide-react';
import { mockStudents, mockSettings } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function IDCardsPage() {
  const { t, isRTL } = useApp();
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');

  const grades = [...new Set(mockStudents.map(s => s.grade))].sort();
  const filteredStudents = mockStudents.filter(s => 
    s.status === 'active' && (gradeFilter === 'all' || s.grade === gradeFilter)
  );
  const selectedStudent = mockStudents.find(s => s.id === selectedStudentId);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t('nav.idCards')}</h1>
          <p className="text-sm text-muted-foreground">
            Generate and print student ID cards
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selection Panel */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-4">Select Student</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {grades.map(grade => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a student..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredStudents.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} ({student.studentId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Student List */}
            <div className="border rounded max-h-[400px] overflow-y-auto scrollbar-thin">
              {filteredStudents.map(student => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 text-left hover:bg-muted/50 border-b border-border last:border-b-0 transition-colors",
                    selectedStudentId === student.id && "bg-primary/5 border-l-2 border-l-primary"
                  )}
                >
                  <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{student.firstName} {student.lastName}</p>
                    <p className="text-xs text-muted-foreground">{student.studentId} • {student.grade}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* ID Card Preview */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">ID Card Preview</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={!selectedStudent}>
                  <Download className="w-4 h-4" />
                  Save
                </Button>
                <Button variant="enterprise" size="sm" disabled={!selectedStudent}>
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
              </div>
            </div>

            {selectedStudent ? (
              <div className="flex justify-center">
                <IDCardPreview student={selectedStudent} settings={mockSettings} isRTL={isRTL} />
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center bg-muted/30 rounded border-2 border-dashed border-border">
                <p className="text-muted-foreground text-sm">Select a student to preview ID card</p>
              </div>
            )}
          </Card>

          {/* Batch Print */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Batch Print</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Print ID cards for all students in the selected grade
            </p>
            <Button variant="outline" className="w-full" disabled={gradeFilter === 'all'}>
              <Printer className="w-4 h-4" />
              Print All {gradeFilter !== 'all' ? gradeFilter : ''} Students ({gradeFilter !== 'all' ? filteredStudents.length : 'Select grade'})
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface IDCardPreviewProps {
  student: typeof mockStudents[0];
  settings: typeof mockSettings;
  isRTL: boolean;
}

function IDCardPreview({ student, settings, isRTL }: IDCardPreviewProps) {
  return (
    <div 
      className="w-[320px] h-[200px] bg-gradient-to-br from-navy to-navy-dark rounded-lg shadow-lg overflow-hidden text-primary-foreground relative"
      style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
    >
      {/* Header */}
      <div className="bg-accent/20 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-foreground/20 rounded flex items-center justify-center">
            <span className="text-xs font-bold">PS</span>
          </div>
          <div>
            <p className="text-xs font-semibold">{settings.schoolName}</p>
            {settings.schoolNameArabic && (
              <p className="text-xxs opacity-80" dir="rtl">{settings.schoolNameArabic}</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xxs opacity-70">Academic Year</p>
          <p className="text-xs font-medium">{settings.schoolYear}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex gap-4">
        {/* Photo */}
        <div className="w-20 h-24 bg-primary-foreground/10 rounded flex items-center justify-center shrink-0">
          <User className="w-10 h-10 opacity-50" />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-1">
          <div>
            <p className="text-lg font-bold leading-tight">{student.firstName} {student.lastName}</p>
            {student.arabicName && (
              <p className="text-sm opacity-80" dir="rtl">{student.arabicName}</p>
            )}
          </div>
          <div className="pt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="opacity-70">ID:</span>
              <span className="font-mono font-medium">{student.studentId}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="opacity-70">Grade:</span>
              <span className="font-medium">{student.grade} - {student.section}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="opacity-70">DOB:</span>
              <span className="font-medium">{new Date(student.dateOfBirth).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-primary-foreground/10 px-4 py-1.5">
        <div className="flex justify-between items-center text-xxs">
          <span className="opacity-70">Valid for academic year {settings.schoolYear}</span>
          <div className="w-12 h-4 bg-primary-foreground/20 rounded" /> {/* Barcode placeholder */}
        </div>
      </div>
    </div>
  );
}
