import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, Download, User, Users, GraduationCap, FileText, Heart, UserPlus, UserX, UserCheck } from 'lucide-react';
import { mockStudents, mockPayments, mockFeeStructures } from '@/data/mockData';
import { mockLevels } from '@/data/settingsData';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Guardian, MedicalRecord, RelatedStudent } from '@/types/settings';
import { Student } from '@/types';

// Import tab components
import { StudentInfoTab } from '@/components/students/StudentInfoTab';
import { GuardiansTab } from '@/components/students/GuardiansTab';
import { AcademicFeesTab } from '@/components/students/AcademicFeesTab';
import { StatementTab } from '@/components/students/StatementTab';
import { MedicalHistoryTab } from '@/components/students/MedicalHistoryTab';
import { RelatedStudentsTab } from '@/components/students/RelatedStudentsTab';

export function StudentsPage() {
  const { t } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [students, setStudents] = useState(mockStudents);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || student.grade === levelFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const getStudentBalance = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return { totalDue: 0, totalPaid: 0, balance: 0 };

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

    return { totalDue, totalPaid, balance: totalDue - totalPaid };
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsViewDialogOpen(true);
  };

  const handleToggleStatus = (studentId: string) => {
    setStudents(students.map(s => 
      s.id === studentId 
        ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' as const }
        : s
    ));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t('student.list')}</h1>
          <p className="text-sm text-muted-foreground">Manage student records, enrollments, and fee status</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="w-4 h-4" />Export</Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="enterprise" size="sm"><Plus className="w-4 h-4" />{t('student.add')}</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t('student.add')}</DialogTitle>
              </DialogHeader>
              <StudentForm onClose={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9" />
            </div>
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="All Levels" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {mockLevels.filter(l => l.isActive).map(level => (
                <SelectItem key={level.id} value={level.name}>{level.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="graduated">Graduated</SelectItem>
              <SelectItem value="transferred">Transferred</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>{t('student.id')}</th>
                <th>{t('student.name')}</th>
                <th>Level</th>
                <th>Parent Contact</th>
                <th>Status</th>
                <th>Fee Status</th>
                <th>Balance</th>
                <th className="w-12">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const { totalDue, totalPaid, balance } = getStudentBalance(student.id);
                const paidPercentage = totalDue > 0 ? (totalPaid / totalDue) * 100 : 0;
                return (
                  <tr key={student.id} className="cursor-pointer" onClick={() => handleViewStudent(student)}>
                    <td className="font-mono text-xs">{student.studentId}</td>
                    <td>
                      <div>
                        <p className="font-medium">{student.firstName} {student.lastName}</p>
                        {student.arabicName && <p className="text-xs text-muted-foreground" dir="rtl">{student.arabicName}</p>}
                      </div>
                    </td>
                    <td>{student.grade} - {student.section}</td>
                    <td>
                      <div className="text-sm">
                        <p>{student.parentName}</p>
                        <p className="text-xs text-muted-foreground">{student.parentPhone}</p>
                      </div>
                    </td>
                    <td>
                      <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                        {student.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", paidPercentage >= 100 ? "bg-accent" : paidPercentage >= 50 ? "bg-status-partial" : "bg-destructive")} style={{ width: `${Math.min(paidPercentage, 100)}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{paidPercentage.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={cn("font-mono text-sm font-medium", balance <= 0 ? "text-accent" : "text-destructive")}>AED {balance.toLocaleString()}</span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewStudent(student)}>
                            <Eye className="w-4 h-4 mr-2" />View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/students/${student.id}`)}>
                            <Edit className="w-4 h-4 mr-2" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(student.id)}>
                            {student.status === 'active' ? (
                              <>
                                <UserX className="w-4 h-4 mr-2" />Set Inactive
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4 mr-2" />Set Active
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="p-8 text-center text-muted-foreground"><p className="text-sm">No students found matching your criteria</p></div>
        )}
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {filteredStudents.length} of {students.length} students</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>

      {/* View/Edit Student Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedStudent && `${selectedStudent.firstName} ${selectedStudent.lastName}`}
              {selectedStudent && (
                <Badge variant={selectedStudent.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                  {selectedStudent.status}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <StudentForm 
              onClose={() => setIsViewDialogOpen(false)} 
              student={selectedStudent}
              isEditMode={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface StudentFormProps {
  onClose: () => void;
  student?: Student;
  isEditMode?: boolean;
}

function StudentForm({ onClose, student, isEditMode = false }: StudentFormProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState({
    firstName: student?.firstName || '', 
    lastName: student?.lastName || '', 
    arabicName: student?.arabicName || '', 
    cprNumber: student?.cprNumber || '', 
    dateOfBirth: student?.dateOfBirth || '',
    gender: student?.gender || '', 
    enrollmentDate: student?.enrollmentDate || new Date().toISOString().split('T')[0], 
    levelId: student?.levelId || '',
    address: student?.address || '', 
    returnAddress: student?.returnAddress || '', 
    transportLineId: student?.transportLineId || '',
  });
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('ay-2024-25');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [relatedStudents, setRelatedStudents] = useState<RelatedStudent[]>([]);
  const [allowReRegistration, setAllowReRegistration] = useState(student?.allowReRegistration || false);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-6 w-full">
        <TabsTrigger value="info"><User className="w-4 h-4 mr-1" />Student Info</TabsTrigger>
        <TabsTrigger value="guardians"><Users className="w-4 h-4 mr-1" />Guardians</TabsTrigger>
        <TabsTrigger value="academic"><GraduationCap className="w-4 h-4 mr-1" />Academic & Fees</TabsTrigger>
        <TabsTrigger value="statement"><FileText className="w-4 h-4 mr-1" />Statement</TabsTrigger>
        <TabsTrigger value="medical"><Heart className="w-4 h-4 mr-1" />Medical</TabsTrigger>
        <TabsTrigger value="related"><UserPlus className="w-4 h-4 mr-1" />Related</TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="mt-4">
        <StudentInfoTab formData={formData} onChange={handleFormChange} />
      </TabsContent>

      <TabsContent value="guardians" className="mt-4">
        <GuardiansTab guardians={guardians} onGuardiansChange={setGuardians} />
      </TabsContent>

      <TabsContent value="academic" className="mt-4">
        <AcademicFeesTab
          levelId={formData.levelId}
          selectedAcademicYear={selectedAcademicYear}
          selectedClassId={selectedClassId}
          onAcademicYearChange={setSelectedAcademicYear}
          onClassChange={setSelectedClassId}
          allowReRegistration={allowReRegistration}
          onAllowReRegistrationChange={setAllowReRegistration}
          isEditMode={isEditMode}
          studentId={student?.id}
        />
      </TabsContent>

      <TabsContent value="statement" className="mt-4">
        <StatementTab studentId={student?.id} />
      </TabsContent>

      <TabsContent value="medical" className="mt-4">
        <MedicalHistoryTab medicalRecords={medicalRecords} onMedicalRecordsChange={setMedicalRecords} />
      </TabsContent>

      <TabsContent value="related" className="mt-4">
        <RelatedStudentsTab relatedStudents={relatedStudents} onRelatedStudentsChange={setRelatedStudents} />
      </TabsContent>

      <div className="flex justify-end gap-2 pt-4 border-t mt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="enterprise">{isEditMode ? 'Update Student' : 'Save Student'}</Button>
      </div>
    </Tabs>
  );
}