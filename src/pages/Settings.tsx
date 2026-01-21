import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MobileTabs, TabsContent } from '@/components/ui/mobile-tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Building2,
  Calendar,
  DollarSign,
  Percent,
  Save,
  AlertCircle,
  RefreshCw,
  Layers,
  Bus,
  Plus,
  Edit,
  Trash2,
  Users,
  Check,
  X,
  MapPin,
} from 'lucide-react';
import { mockSettings, mockFeeStructures } from '@/data/mockData';
import { mockLevels, mockAcademicClasses, mockTransportLines, mockTransportAreas, mockAcademicYears, mockFeeDiscounts, mockAcademicYearEnrollments, mockFeeTypes, mockPredefinedExtraFees, mockSubjects } from '@/data/settingsData';
import { Level, AcademicClass, TransportLine, TransportArea, FeeDiscount, ClassStatus, PredefinedExtraFee, ClassSubjectTeacher, Subject } from '@/types/settings';
import { mockTeachers } from '@/data/mockData';

export function SettingsPage() {
  const { t } = useApp();
  const [settings, setSettings] = useState(mockSettings);
  const [feeStructures, setFeeStructures] = useState(mockFeeStructures);
  const [levels, setLevels] = useState(mockLevels);
  const [classes, setClasses] = useState(mockAcademicClasses);
  const [transportLines, setTransportLines] = useState(mockTransportLines);
  const [transportAreas, setTransportAreas] = useState(mockTransportAreas);
  const [discounts, setDiscounts] = useState(mockFeeDiscounts);
  const [predefinedExtraFees, setPredefinedExtraFees] = useState(mockPredefinedExtraFees);
  const [subjects, setSubjects] = useState(mockSubjects);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(mockAcademicYears.find(y => y.isCurrent)?.id || '');

  // Dialog states
  const [isLevelDialogOpen, setIsLevelDialogOpen] = useState(false);
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [isTransportDialogOpen, setIsTransportDialogOpen] = useState(false);
  const [isAreaDialogOpen, setIsAreaDialogOpen] = useState(false);
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [isExtraFeeDialogOpen, setIsExtraFeeDialogOpen] = useState(false);
  const [isTeacherAssignDialogOpen, setIsTeacherAssignDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [editingClass, setEditingClass] = useState<AcademicClass | null>(null);
  const [editingTransport, setEditingTransport] = useState<TransportLine | null>(null);
  const [editingArea, setEditingArea] = useState<TransportArea | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<FeeDiscount | null>(null);
  const [editingExtraFee, setEditingExtraFee] = useState<PredefinedExtraFee | null>(null);
  const [selectedClassForTeachers, setSelectedClassForTeachers] = useState<AcademicClass | null>(null);

  // Form states
  const [levelForm, setLevelForm] = useState({ name: '', order: 1 });
  const [classForm, setClassForm] = useState({ name: '', levelId: '', capacity: 25, maxStudents: 30, status: 'read_write' as ClassStatus });
  const [transportForm, setTransportForm] = useState({ name: '', startLocation: '', endLocation: '', areaIds: [] as string[] });
  const [areaForm, setAreaForm] = useState({ name: '', fee: 0 });
  const [discountForm, setDiscountForm] = useState({ name: '', description: '', type: 'percentage' as 'percentage' | 'fixed', value: 0, applicableFees: [] as string[] });
  const [extraFeeForm, setExtraFeeForm] = useState({ name: '', amount: 0, description: '' });

  const handleSettingChange = (key: keyof typeof settings, value: string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Level handlers
  const openLevelDialog = (level?: Level) => {
    if (level) {
      setEditingLevel(level);
      setLevelForm({ name: level.name, order: level.order });
    } else {
      setEditingLevel(null);
      setLevelForm({ name: '', order: levels.length + 1 });
    }
    setIsLevelDialogOpen(true);
  };

  const saveLevel = () => {
    if (editingLevel) {
      setLevels(levels.map(l => l.id === editingLevel.id ? { ...l, ...levelForm } : l));
    } else {
      const newLevel: Level = {
        id: `level-${Date.now()}`,
        name: levelForm.name,
        order: levelForm.order,
        isActive: true,
      };
      setLevels([...levels, newLevel]);
    }
    setIsLevelDialogOpen(false);
  };

  const deleteLevel = (id: string) => {
    setLevels(levels.filter(l => l.id !== id));
  };

  // Class handlers
  const openClassDialog = (cls?: AcademicClass) => {
    if (cls) {
      setEditingClass(cls);
      setClassForm({ name: cls.name, levelId: cls.levelId, capacity: cls.capacity, maxStudents: cls.maxStudents, status: cls.status });
    } else {
      setEditingClass(null);
      setClassForm({ name: '', levelId: '', capacity: 25, maxStudents: 30, status: 'read_write' });
    }
    setIsClassDialogOpen(true);
  };

  const saveClass = () => {
    if (editingClass) {
      setClasses(classes.map(c => c.id === editingClass.id ? { ...c, ...classForm } : c));
    } else {
      const newClass: AcademicClass = {
        id: `class-${Date.now()}`,
        name: classForm.name,
        levelId: classForm.levelId,
        capacity: classForm.capacity,
        maxStudents: classForm.maxStudents,
        enrolledStudents: 0,
        status: classForm.status,
        isActive: classForm.status !== 'closed',
      };
      setClasses([...classes, newClass]);
    }
    setIsClassDialogOpen(false);
  };

  const deleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  // Area handlers
  const openAreaDialog = (area?: TransportArea) => {
    if (area) {
      setEditingArea(area);
      setAreaForm({ name: area.name, fee: area.fee });
    } else {
      setEditingArea(null);
      setAreaForm({ name: '', fee: 0 });
    }
    setIsAreaDialogOpen(true);
  };

  const saveArea = () => {
    if (editingArea) {
      setTransportAreas(transportAreas.map(a => a.id === editingArea.id ? { ...a, ...areaForm } : a));
    } else {
      const newArea: TransportArea = {
        id: `area-${Date.now()}`,
        ...areaForm,
        isActive: true,
      };
      setTransportAreas([...transportAreas, newArea]);
    }
    setIsAreaDialogOpen(false);
  };

  // Transport handlers
  const openTransportDialog = (line?: TransportLine) => {
    if (line) {
      setEditingTransport(line);
      setTransportForm({ name: line.name, startLocation: line.startLocation, endLocation: line.endLocation, areaIds: line.areaIds });
    } else {
      setEditingTransport(null);
      setTransportForm({ name: '', startLocation: '', endLocation: '', areaIds: [] });
    }
    setIsTransportDialogOpen(true);
  };

  const saveTransport = () => {
    if (editingTransport) {
      setTransportLines(transportLines.map(t => t.id === editingTransport.id ? { ...t, ...transportForm } : t));
    } else {
      const newLine: TransportLine = {
        id: `trans-${Date.now()}`,
        ...transportForm,
        isActive: true,
      };
      setTransportLines([...transportLines, newLine]);
    }
    setIsTransportDialogOpen(false);
  };

  // Discount handlers
  const openDiscountDialog = (discount?: FeeDiscount) => {
    if (discount) {
      setEditingDiscount(discount);
      setDiscountForm({ name: discount.name, description: discount.description, type: discount.type, value: discount.value, applicableFees: discount.applicableFees });
    } else {
      setEditingDiscount(null);
      setDiscountForm({ name: '', description: '', type: 'percentage', value: 0, applicableFees: [] });
    }
    setIsDiscountDialogOpen(true);
  };

  const saveDiscount = () => {
    if (editingDiscount) {
      setDiscounts(discounts.map(d => d.id === editingDiscount.id ? { ...d, ...discountForm } : d));
    } else {
      const newDiscount: FeeDiscount = {
        id: `disc-${Date.now()}`,
        ...discountForm,
        isActive: true,
      };
      setDiscounts([...discounts, newDiscount]);
    }
    setIsDiscountDialogOpen(false);
  };

  // Extra Fee handlers
  const openExtraFeeDialog = (fee?: PredefinedExtraFee) => {
    if (fee) {
      setEditingExtraFee(fee);
      setExtraFeeForm({ name: fee.name, amount: fee.amount, description: fee.description || '' });
    } else {
      setEditingExtraFee(null);
      setExtraFeeForm({ name: '', amount: 0, description: '' });
    }
    setIsExtraFeeDialogOpen(true);
  };

  const saveExtraFee = () => {
    if (editingExtraFee) {
      setPredefinedExtraFees(predefinedExtraFees.map(f => f.id === editingExtraFee.id ? { ...f, ...extraFeeForm } : f));
    } else {
      const newFee: PredefinedExtraFee = {
        id: `extra-${Date.now()}`,
        ...extraFeeForm,
        isActive: true,
      };
      setPredefinedExtraFees([...predefinedExtraFees, newFee]);
    }
    setIsExtraFeeDialogOpen(false);
  };

  // Teacher Assignment handlers
  const openTeacherAssignDialog = (cls: AcademicClass) => {
    setSelectedClassForTeachers(cls);
    setIsTeacherAssignDialogOpen(true);
  };

  const addSubjectTeacher = (classId: string, subjectId: string, teacherId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    const teacher = mockTeachers.find(t => t.id === teacherId);
    if (!subject || !teacher) return;

    setClasses(classes.map(c => {
      if (c.id === classId) {
        const existing = c.subjectTeachers || [];
        // Check if subject already has a teacher
        const filtered = existing.filter(st => st.subjectId !== subjectId);
        return {
          ...c,
          subjectTeachers: [...filtered, {
            subjectId,
            subjectName: subject.name,
            teacherId,
            teacherName: `${teacher.firstName} ${teacher.lastName}`,
          }],
        };
      }
      return c;
    }));
  };

  const removeSubjectTeacher = (classId: string, subjectId: string) => {
    setClasses(classes.map(c => {
      if (c.id === classId) {
        return {
          ...c,
          subjectTeachers: (c.subjectTeachers || []).filter(st => st.subjectId !== subjectId),
        };
      }
      return c;
    }));
  };

  // Get enrollment stats for selected academic year
  const getYearEnrollmentStats = () => {
    return mockAcademicYearEnrollments.filter(e => e.academicYearId === selectedAcademicYear);
  };

  const getClassStatusBadge = (status: ClassStatus) => {
    switch (status) {
      case 'read_write':
        return <Badge variant="default" className="bg-accent">Open</Badge>;
      case 'read':
        return <Badge variant="secondary">Read Only</Badge>;
      case 'closed':
        return <Badge variant="destructive">Closed</Badge>;
    }
  };

  const getAreaNamesForLine = (areaIds: string[]) => {
    return areaIds.map(id => transportAreas.find(a => a.id === id)?.name).filter(Boolean).join(', ');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t('nav.settings')}</h1>
          <p className="text-sm text-muted-foreground">Configure school settings, levels, transport, and fee structures</p>
        </div>
        <Button variant="enterprise" size="sm"><Save className="w-4 h-4" />Save Changes</Button>
      </div>

      <MobileTabs
        tabs={[
          { value: "school", label: "School Info", icon: <Building2 className="w-4 h-4" /> },
          { value: "academic", label: "Academic Year", icon: <Calendar className="w-4 h-4" /> },
          { value: "levels", label: "Levels & Classes", icon: <Layers className="w-4 h-4" /> },
          { value: "transport", label: "Transport", icon: <Bus className="w-4 h-4" /> },
          { value: "fees", label: "Fee Structures", icon: <DollarSign className="w-4 h-4" /> },
          { value: "discounts", label: "Discounts", icon: <Percent className="w-4 h-4" /> },
        ]}
        defaultValue="school"
      >

        {/* School Info */}
        <TabsContent value="school">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">School Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>School Name (English)</Label>
                <Input value={settings.schoolName} onChange={(e) => handleSettingChange('schoolName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>School Name (Arabic)</Label>
                <Input value={settings.schoolNameArabic} onChange={(e) => handleSettingChange('schoolNameArabic', e.target.value)} dir="rtl" />
              </div>
              <div className="space-y-2">
                <Label>School Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline" size="sm">Upload Logo</Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Academic Year */}
        <TabsContent value="academic">
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Academic Year Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Current School Year</Label>
                  <Input value={settings.schoolYear} onChange={(e) => handleSettingChange('schoolYear', e.target.value)} placeholder="2024-2025" />
                </div>
                <div className="space-y-2">
                  <Label>Year Start Date</Label>
                  <Input type="date" value={settings.yearStartDate} onChange={(e) => handleSettingChange('yearStartDate', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Year End Date</Label>
                  <Input type="date" value={settings.yearEndDate} onChange={(e) => handleSettingChange('yearEndDate', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Monthly Due Day</Label>
                  <Select value={settings.monthlyDueDay.toString()} onValueChange={(v) => handleSettingChange('monthlyDueDay', parseInt(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 5, 10, 15, 20, 25].map(d => (<SelectItem key={d} value={d.toString()}>{d}th of month</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="flex items-center justify-between p-4 bg-amber/10 border border-amber/30 rounded">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber" />
                  <div>
                    <p className="font-medium">Year Rollover</p>
                    <p className="text-sm text-muted-foreground">Update fee structures for new academic year</p>
                  </div>
                </div>
                <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4" />Initiate Rollover</Button>
              </div>
            </Card>

            {/* Academic Year Enrollment Stats */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Enrollment Statistics by Year</h3>
                <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAcademicYears.map(year => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.name} {year.isCurrent && '(Current)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Level</th>
                    <th className="text-center">Enrolled</th>
                    <th className="text-center">Left</th>
                    <th className="text-center">Graduated</th>
                    <th className="text-center">Transferred</th>
                  </tr>
                </thead>
                <tbody>
                  {getYearEnrollmentStats().map(stat => {
                    const cls = classes.find(c => c.id === stat.classId);
                    const level = levels.find(l => l.id === cls?.levelId);
                    return (
                      <tr key={stat.classId}>
                        <td className="font-medium">{cls?.name}</td>
                        <td>{level?.name}</td>
                        <td className="text-center">
                          <Badge variant="default">{stat.enrolledCount}</Badge>
                        </td>
                        <td className="text-center">
                          <Badge variant="secondary">{stat.leftCount}</Badge>
                        </td>
                        <td className="text-center">
                          <Badge variant="outline" className="text-accent border-accent">{stat.graduatedCount}</Badge>
                        </td>
                        <td className="text-center">
                          <Badge variant="outline">{stat.transferredCount}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                  {getYearEnrollmentStats().length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-muted-foreground py-8">
                        No enrollment data for selected academic year
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          </div>
        </TabsContent>

        {/* Levels & Classes */}
        <TabsContent value="levels">
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Levels</h3>
                <Button variant="enterprise" size="sm" onClick={() => openLevelDialog()}>
                  <Plus className="w-4 h-4" />Add Level
                </Button>
              </div>
              <div className="space-y-2">
                {levels.map(level => (
                  <div key={level.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <Switch 
                        checked={level.isActive} 
                        onCheckedChange={(checked) => setLevels(levels.map(l => l.id === level.id ? { ...l, isActive: checked } : l))}
                      />
                      <span className="font-medium">{level.name}</span>
                      <span className="text-xs text-muted-foreground">Order: {level.order}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openLevelDialog(level)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteLevel(level.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Classes</h3>
                <Button variant="enterprise" size="sm" onClick={() => openClassDialog()}>
                  <Plus className="w-4 h-4" />Add Class
                </Button>
              </div>
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>Class Name</th>
                    <th>Level</th>
                    <th className="text-center">Max Students</th>
                    <th className="text-center">Enrolled</th>
                    <th className="text-center">Teachers</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map(cls => {
                    const level = levels.find(l => l.id === cls.levelId);
                    return (
                      <tr key={cls.id}>
                        <td className="font-medium">{cls.name}</td>
                        <td>{level?.name}</td>
                        <td className="text-center">{cls.maxStudents}</td>
                        <td className="text-center">
                          <span className={cls.enrolledStudents >= cls.maxStudents ? 'text-destructive font-medium' : ''}>
                            {cls.enrolledStudents}
                          </span>
                        </td>
                        <td className="text-center">
                          <Button variant="ghost" size="xs" onClick={() => openTeacherAssignDialog(cls)}>
                            <Users className="w-4 h-4 mr-1" />
                            {cls.subjectTeachers?.length || 0}
                          </Button>
                        </td>
                        <td>{getClassStatusBadge(cls.status)}</td>
                        <td>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="xs" onClick={() => openClassDialog(cls)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="xs" className="text-destructive" onClick={() => deleteClass(cls.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>
        </TabsContent>

        {/* Transport - Now with Areas */}
        <TabsContent value="transport">
          <div className="space-y-4">
            {/* Areas/Blocks Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Transport Areas / Blocks</h3>
                  <p className="text-sm text-muted-foreground">Define areas with transport fees. Students select area first, then available transport line.</p>
                </div>
                <Button variant="enterprise" size="sm" onClick={() => openAreaDialog()}>
                  <Plus className="w-4 h-4" />Add Area
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {transportAreas.map(area => (
                  <div key={area.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">{area.name}</span>
                        <p className="text-sm text-accent font-mono">AED {area.fee}/month</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Switch 
                        checked={area.isActive}
                        onCheckedChange={(checked) => setTransportAreas(transportAreas.map(a => a.id === area.id ? { ...a, isActive: checked } : a))}
                      />
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openAreaDialog(area)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setTransportAreas(transportAreas.filter(a => a.id !== area.id))}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Transport Lines Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Transport Lines</h3>
                  <p className="text-sm text-muted-foreground">Routes that cover multiple areas. Fee is determined by the student's selected area.</p>
                </div>
                <Button variant="enterprise" size="sm" onClick={() => openTransportDialog()}>
                  <Plus className="w-4 h-4" />Add Transport Line
                </Button>
              </div>
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>Route Name</th>
                    <th>Start Location</th>
                    <th>End Location</th>
                    <th>Areas Covered</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transportLines.map(line => (
                    <tr key={line.id}>
                      <td className="font-medium">{line.name}</td>
                      <td>{line.startLocation}</td>
                      <td>{line.endLocation}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {line.areaIds.slice(0, 3).map(areaId => {
                            const area = transportAreas.find(a => a.id === areaId);
                            return area ? (
                              <Badge key={areaId} variant="outline" className="text-xs">{area.name}</Badge>
                            ) : null;
                          })}
                          {line.areaIds.length > 3 && (
                            <Badge variant="secondary" className="text-xs">+{line.areaIds.length - 3} more</Badge>
                          )}
                        </div>
                      </td>
                      <td>
                        <Switch 
                          checked={line.isActive}
                          onCheckedChange={(checked) => setTransportLines(transportLines.map(t => t.id === line.id ? { ...t, isActive: checked } : t))}
                        />
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="xs" onClick={() => openTransportDialog(line)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="xs" className="text-destructive" onClick={() => setTransportLines(transportLines.filter(t => t.id !== line.id))}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </TabsContent>

        {/* Fee Structures */}
        <TabsContent value="fees">
          <div className="space-y-4">
            <Card>
              <div className="data-card-header flex items-center justify-between">
                <h3 className="text-lg font-semibold">Fee Structures</h3>
                <Button variant="enterprise" size="sm">Add Fee Type</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th>Fee Name</th>
                      <th>Category</th>
                      <th>Applicable Levels</th>
                      <th>Due Day</th>
                      <th className="text-right">Amount (AED)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeStructures.map((fee) => (
                      <tr key={fee.id}>
                        <td className="font-medium">{fee.name}</td>
                        <td>
                          <span className={`status-badge ${fee.type === 'mandatory' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                            {fee.type}
                          </span>
                        </td>
                        <td>{fee.grade === 'all' ? 'All Levels' : fee.grade}</td>
                        <td>{fee.dueDay ? `${fee.dueDay}th` : '-'}</td>
                        <td className="text-right font-mono">{fee.amount.toLocaleString()}</td>
                        <td><Button variant="ghost" size="xs">Edit</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Predefined Extra Fees */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Predefined Extra Fees</h3>
                  <p className="text-sm text-muted-foreground">Cashiers can add these fees to student accounts. Define them here.</p>
                </div>
                <Button variant="enterprise" size="sm" onClick={() => openExtraFeeDialog()}>
                  <Plus className="w-4 h-4" />Add Extra Fee
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {predefinedExtraFees.map(fee => (
                  <div key={fee.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <span className="font-medium">{fee.name}</span>
                      <p className="text-sm text-muted-foreground">{fee.description}</p>
                      <p className="text-sm text-accent font-mono">AED {fee.amount}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Switch 
                        checked={fee.isActive}
                        onCheckedChange={(checked) => setPredefinedExtraFees(predefinedExtraFees.map(f => f.id === fee.id ? { ...f, isActive: checked } : f))}
                      />
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openExtraFeeDialog(fee)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setPredefinedExtraFees(predefinedExtraFees.filter(f => f.id !== fee.id))}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Discounts */}
        <TabsContent value="discounts">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Discount Types</h3>
              <Button variant="enterprise" size="sm" onClick={() => openDiscountDialog()}>
                <Plus className="w-4 h-4" />Add Discount
              </Button>
            </div>
            <div className="space-y-4">
              {discounts.map((discount) => (
                <div key={discount.id} className="flex items-center justify-between p-4 border border-border rounded">
                  <div className="flex items-center gap-4">
                    <Switch 
                      checked={discount.isActive}
                      onCheckedChange={(checked) => setDiscounts(discounts.map(d => d.id === discount.id ? { ...d, isActive: checked } : d))}
                    />
                    <div>
                      <p className="font-medium">{discount.name}</p>
                      <p className="text-sm text-muted-foreground">{discount.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Applies to: {discount.applicableFees.length} fee type(s) • 
                        Type: <span className="capitalize">{discount.type}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium">
                      {discount.value}{discount.type === 'percentage' ? '%' : ' AED'}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDiscountDialog(discount)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDiscounts(discounts.filter(d => d.id !== discount.id))}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </MobileTabs>

      {/* Level Dialog */}
      <Dialog open={isLevelDialogOpen} onOpenChange={setIsLevelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLevel ? 'Edit Level' : 'Add Level'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Level Name *</Label>
              <Input value={levelForm.name} onChange={(e) => setLevelForm({ ...levelForm, name: e.target.value })} placeholder="e.g., Level 1" />
            </div>
            <div className="space-y-2">
              <Label>Order</Label>
              <Input type="number" value={levelForm.order} onChange={(e) => setLevelForm({ ...levelForm, order: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLevelDialogOpen(false)}>Cancel</Button>
            <Button variant="enterprise" onClick={saveLevel} disabled={!levelForm.name}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Class Dialog */}
      <Dialog open={isClassDialogOpen} onOpenChange={setIsClassDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClass ? 'Edit Class' : 'Add Class'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Class Name *</Label>
              <Input value={classForm.name} onChange={(e) => setClassForm({ ...classForm, name: e.target.value })} placeholder="e.g., KG1-A" />
            </div>
            <div className="space-y-2">
              <Label>Level *</Label>
              <Select value={classForm.levelId} onValueChange={(v) => setClassForm({ ...classForm, levelId: v })}>
                <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  {levels.filter(l => l.isActive).map(level => (
                    <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Input type="number" value={classForm.capacity} onChange={(e) => setClassForm({ ...classForm, capacity: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Max Students</Label>
                <Input type="number" value={classForm.maxStudents} onChange={(e) => setClassForm({ ...classForm, maxStudents: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={classForm.status} onValueChange={(v) => setClassForm({ ...classForm, status: v as ClassStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="read_write">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent" />
                      <span>Read/Write - Students can be enrolled</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="read">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>Read Only - Reports only, no enrollment</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="closed">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-destructive" />
                      <span>Closed - Completely closed</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClassDialogOpen(false)}>Cancel</Button>
            <Button variant="enterprise" onClick={saveClass} disabled={!classForm.name || !classForm.levelId}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Area Dialog */}
      <Dialog open={isAreaDialogOpen} onOpenChange={setIsAreaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingArea ? 'Edit Area' : 'Add Area'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Area/Block Name *</Label>
              <Input value={areaForm.name} onChange={(e) => setAreaForm({ ...areaForm, name: e.target.value })} placeholder="e.g., Block 301-305" />
            </div>
            <div className="space-y-2">
              <Label>Monthly Fee (AED) *</Label>
              <Input type="number" value={areaForm.fee} onChange={(e) => setAreaForm({ ...areaForm, fee: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAreaDialogOpen(false)}>Cancel</Button>
            <Button variant="enterprise" onClick={saveArea} disabled={!areaForm.name}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transport Dialog */}
      <Dialog open={isTransportDialogOpen} onOpenChange={setIsTransportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTransport ? 'Edit Transport Line' : 'Add Transport Line'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Route Name *</Label>
              <Input value={transportForm.name} onChange={(e) => setTransportForm({ ...transportForm, name: e.target.value })} placeholder="e.g., Route A" />
            </div>
            <div className="space-y-2">
              <Label>Start Location *</Label>
              <Input value={transportForm.startLocation} onChange={(e) => setTransportForm({ ...transportForm, startLocation: e.target.value })} placeholder="e.g., Al Hidd" />
            </div>
            <div className="space-y-2">
              <Label>End Location *</Label>
              <Input value={transportForm.endLocation} onChange={(e) => setTransportForm({ ...transportForm, endLocation: e.target.value })} placeholder="e.g., School Campus" />
            </div>
            <div className="space-y-2">
              <Label>Areas Covered *</Label>
              <div className="grid grid-cols-2 gap-2 p-3 border rounded bg-muted/30 max-h-48 overflow-y-auto">
                {transportAreas.filter(a => a.isActive).map(area => {
                  const isChecked = transportForm.areaIds.includes(area.id);
                  return (
                    <label key={area.id} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-muted/50">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTransportForm({ ...transportForm, areaIds: [...transportForm.areaIds, area.id] });
                          } else {
                            setTransportForm({ ...transportForm, areaIds: transportForm.areaIds.filter(id => id !== area.id) });
                          }
                        }}
                        className="rounded border-border"
                      />
                      <span className="text-sm">{area.name}</span>
                      <Badge variant="outline" className="text-xs ml-auto">AED {area.fee}</Badge>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransportDialogOpen(false)}>Cancel</Button>
            <Button variant="enterprise" onClick={saveTransport} disabled={!transportForm.name || !transportForm.startLocation || !transportForm.endLocation || transportForm.areaIds.length === 0}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Extra Fee Dialog */}
      <Dialog open={isExtraFeeDialogOpen} onOpenChange={setIsExtraFeeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingExtraFee ? 'Edit Extra Fee' : 'Add Extra Fee'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Fee Name *</Label>
              <Input value={extraFeeForm.name} onChange={(e) => setExtraFeeForm({ ...extraFeeForm, name: e.target.value })} placeholder="e.g., Sports Equipment" />
            </div>
            <div className="space-y-2">
              <Label>Amount (AED) *</Label>
              <Input type="number" value={extraFeeForm.amount} onChange={(e) => setExtraFeeForm({ ...extraFeeForm, amount: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={extraFeeForm.description} onChange={(e) => setExtraFeeForm({ ...extraFeeForm, description: e.target.value })} placeholder="Optional description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExtraFeeDialogOpen(false)}>Cancel</Button>
            <Button variant="enterprise" onClick={saveExtraFee} disabled={!extraFeeForm.name || extraFeeForm.amount <= 0}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discount Dialog */}
      <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingDiscount ? 'Edit Discount' : 'Add Discount'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Discount Name *</Label>
              <Input value={discountForm.name} onChange={(e) => setDiscountForm({ ...discountForm, name: e.target.value })} placeholder="e.g., Sibling Discount" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={discountForm.description} onChange={(e) => setDiscountForm({ ...discountForm, description: e.target.value })} placeholder="Description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={discountForm.type} onValueChange={(v) => setDiscountForm({ ...discountForm, type: v as 'percentage' | 'fixed' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (AED)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input type="number" value={discountForm.value} onChange={(e) => setDiscountForm({ ...discountForm, value: Number(e.target.value) })} />
              </div>
            </div>
            
            {/* Applicable Fee Types - Only show for percentage discounts */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Applicable Fee Types</Label>
                <span className="text-xs text-muted-foreground">
                  {discountForm.type === 'percentage' ? 'Select which fees this discount applies to' : 'Fixed discounts apply to all fees'}
                </span>
              </div>
              {discountForm.type === 'percentage' ? (
                <div className="grid grid-cols-2 gap-2 p-3 border rounded bg-muted/30">
                  {mockFeeTypes.map(fee => {
                    const isChecked = discountForm.applicableFees.includes(fee.id);
                    return (
                      <label key={fee.id} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-muted/50">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setDiscountForm({ ...discountForm, applicableFees: [...discountForm.applicableFees, fee.id] });
                            } else {
                              setDiscountForm({ ...discountForm, applicableFees: discountForm.applicableFees.filter(f => f !== fee.id) });
                            }
                          }}
                          className="rounded border-border"
                        />
                        <span className="text-sm">{fee.name}</span>
                        <Badge variant="outline" className="text-xs ml-auto">{fee.category}</Badge>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded">
                  Fixed amount discounts are applied directly to the total and are not restricted to specific fee types.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDiscountDialogOpen(false)}>Cancel</Button>
            <Button variant="enterprise" onClick={saveDiscount} disabled={!discountForm.name || (discountForm.type === 'percentage' && discountForm.applicableFees.length === 0)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Teacher Assignment Dialog */}
      <Dialog open={isTeacherAssignDialogOpen} onOpenChange={setIsTeacherAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Teachers - {selectedClassForTeachers?.name}</DialogTitle>
          </DialogHeader>
          {selectedClassForTeachers && (
            <div className="space-y-4">
              {/* Current Teachers */}
              {(selectedClassForTeachers.teacherIds?.length ?? 0) > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Assigned Teachers</Label>
                  <div className="space-y-2">
                    {selectedClassForTeachers.teacherIds?.map(teacherId => {
                      const teacher = mockTeachers.find(t => t.id === teacherId);
                      return teacher ? (
                        <div key={teacherId} className="flex items-center justify-between p-3 border rounded bg-muted/30">
                          <span className="text-sm">{teacher.firstName} {teacher.lastName}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => {
                              setClasses(prev => prev.map(c => 
                                c.id === selectedClassForTeachers.id 
                                  ? { ...c, teacherIds: c.teacherIds?.filter(id => id !== teacherId) || [] }
                                  : c
                              ));
                              setSelectedClassForTeachers(prev => prev ? {
                                ...prev,
                                teacherIds: prev.teacherIds?.filter(id => id !== teacherId) || []
                              } : null);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Add Teacher */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Add Teacher</Label>
                <Select
                  onValueChange={(teacherId) => {
                    setClasses(prev => prev.map(c => 
                      c.id === selectedClassForTeachers.id 
                        ? { ...c, teacherIds: [...(c.teacherIds || []), teacherId] }
                        : c
                    ));
                    setSelectedClassForTeachers(prev => prev ? {
                      ...prev,
                      teacherIds: [...(prev.teacherIds || []), teacherId]
                    } : null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeachers
                      .filter(t => !selectedClassForTeachers.teacherIds?.includes(t.id))
                      .map(teacher => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.firstName} {teacher.lastName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTeacherAssignDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
