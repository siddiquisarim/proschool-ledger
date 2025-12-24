import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
} from '@/components/ui/dropdown-menu';
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, FileDown, Download } from 'lucide-react';
import { mockStudents, mockPayments, mockFeeStructures } from '@/data/mockData';
import { Student } from '@/types';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

export function StudentsPage() {
  const { t } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || student.grade === gradeFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const grades = [...new Set(mockStudents.map(s => s.grade))].sort();

  const getStudentBalance = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    if (!student) return { totalDue: 0, totalPaid: 0, balance: 0 };

    const mandatoryFees = mockFeeStructures.filter(f => f.type === 'mandatory');
    const monthlyFee = mockFeeStructures.find(f => 
      f.type === 'monthly' && f.grade.includes(student.grade)
    );

    const totalMandatory = mandatoryFees.reduce((sum, f) => sum + f.amount, 0);
    const monthlyTotal = monthlyFee ? monthlyFee.amount * 10 : 0; // 10 months
    let totalDue = totalMandatory + monthlyTotal;

    // Apply discount
    if (student.discountType && student.discountType !== 'none' && student.discountValue) {
      totalDue = totalDue * (1 - student.discountValue / 100);
    }

    const totalPaid = mockPayments
      .filter(p => p.studentId === studentId && p.status === 'finalized')
      .reduce((sum, p) => sum + p.amount, 0);

    return { totalDue, totalPaid, balance: totalDue - totalPaid };
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t('student.list')}</h1>
          <p className="text-sm text-muted-foreground">
            Manage student records, enrollments, and fee status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="enterprise" size="sm">
                <Plus className="w-4 h-4" />
                {t('student.add')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t('student.add')}</DialogTitle>
              </DialogHeader>
              <StudentForm onClose={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
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

      {/* Students Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>{t('student.id')}</th>
                <th>{t('student.name')}</th>
                <th>{t('student.grade')}</th>
                <th>Parent Contact</th>
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
                  <tr key={student.id} className="cursor-pointer" onClick={() => navigate(`/students/${student.id}`)}>
                    <td className="font-mono text-xs">{student.studentId}</td>
                    <td>
                      <div>
                        <p className="font-medium">{student.firstName} {student.lastName}</p>
                        {student.arabicName && (
                          <p className="text-xs text-muted-foreground" dir="rtl">{student.arabicName}</p>
                        )}
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
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              paidPercentage >= 100 ? "bg-accent" :
                              paidPercentage >= 50 ? "bg-status-partial" :
                              "bg-destructive"
                            )}
                            style={{ width: `${Math.min(paidPercentage, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{paidPercentage.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={cn(
                        "font-mono text-sm font-medium",
                        balance <= 0 ? "text-accent" : "text-destructive"
                      )}>
                        AED {balance.toLocaleString()}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/students/${student.id}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
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
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-sm">No students found matching your criteria</p>
          </div>
        )}
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {filteredStudents.length} of {mockStudents.length} students</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
}

function StudentForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>First Name *</Label>
          <Input placeholder="Enter first name" />
        </div>
        <div className="space-y-2">
          <Label>Last Name *</Label>
          <Input placeholder="Enter last name" />
        </div>
        <div className="space-y-2">
          <Label>Arabic Name</Label>
          <Input placeholder="الاسم بالعربية" dir="rtl" />
        </div>
        <div className="space-y-2">
          <Label>Date of Birth *</Label>
          <Input type="date" />
        </div>
        <div className="space-y-2">
          <Label>Gender *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Grade *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'].map(g => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Section *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {['A', 'B', 'C'].map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Parent Name *</Label>
          <Input placeholder="Enter parent name" />
        </div>
        <div className="space-y-2">
          <Label>Parent Phone *</Label>
          <Input placeholder="+971-XX-XXX-XXXX" />
        </div>
        <div className="space-y-2">
          <Label>Parent Email</Label>
          <Input type="email" placeholder="email@example.com" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="enterprise">Save Student</Button>
      </div>
    </form>
  );
}
