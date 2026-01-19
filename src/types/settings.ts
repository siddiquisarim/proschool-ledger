// Settings-related types for school configuration

export interface Level {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
}

export type ClassStatus = 'read_write' | 'read' | 'closed';

// Subject taught by a teacher in a class
export interface ClassSubjectTeacher {
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
}

export interface AcademicClass {
  id: string;
  name: string;
  levelId: string;
  capacity: number;
  maxStudents: number;
  enrolledStudents: number;
  status: ClassStatus; // read_write: can enroll, read: reports only, closed: completely closed
  isActive: boolean;
  teacherIds?: string[]; // Teacher IDs assigned to this class
  subjectTeachers?: ClassSubjectTeacher[]; // Subject-based teacher assignments (legacy)
}

// Subject definition for the school
export interface Subject {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

// ID Card customization settings
export interface IDCardSettings {
  primaryColor: string;
  secondaryColor: string;
  logoPosition: 'left' | 'center' | 'right';
  showLogo: boolean;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

// Transport Areas/Blocks - new structure for area-based transport fees
export interface TransportArea {
  id: string;
  name: string; // e.g., "Block 301", "Al Hidd Area"
  fee: number; // Fee for this area
  isActive: boolean;
}

export interface TransportLine {
  id: string;
  name: string;
  areaIds: string[]; // Areas/blocks covered by this transport line
  startLocation: string;
  endLocation: string;
  isActive: boolean;
}

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface AcademicYearEnrollment {
  academicYearId: string;
  classId: string;
  enrolledCount: number;
  leftCount: number;
  graduatedCount: number;
  transferredCount: number;
}

// Fee type categorization
export type FeeCategory = 'mandatory' | 'monthly' | 'optional';

export interface FeeType {
  id: string;
  name: string;
  amount: number;
  category: FeeCategory;
  levelIds?: string[]; // Which levels this fee applies to ('all' = all levels)
  dueDay?: number; // For monthly fees
  isActive: boolean;
}

// Predefined extra fees (admin-defined, cashier can add from list)
export interface PredefinedExtraFee {
  id: string;
  name: string;
  amount: number;
  description?: string;
  isActive: boolean;
}

export interface FeeDiscount {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  applicableFees: string[]; // Fee IDs this discount applies to
  isActive: boolean;
}

// Global Guardian registry (unique guardians)
export interface GlobalGuardian {
  id: string;
  serialNumber: string;
  name: string;
  mobile: string;
  cpr?: string; // CPR for uniqueness
  relationship: 'father' | 'mother' | 'guardian' | 'other';
  homeAddress: string;
  workAddress: string;
  email?: string;
  studentIds: string[]; // All students linked to this guardian
}

// Student-guardian link
export interface StudentGuardianLink {
  guardianId: string;
  isPrimary: boolean;
}

// Legacy Guardian type for compatibility
export interface Guardian {
  id: string;
  serialNumber: string;
  name: string;
  mobile: string;
  relationship: 'father' | 'mother' | 'guardian' | 'other';
  homeAddress: string;
  workAddress: string;
  email?: string;
  isPrimary: boolean;
}

export interface MedicalRecord {
  id: string;
  condition: string;
  description: string;
  medications?: string;
  allergies?: string;
  emergencyContact?: string;
  notes?: string;
  dateRecorded: string;
}

export interface RelatedStudent {
  id: string;
  studentId: string;
  relationship: 'sibling' | 'cousin' | 'other';
  notes?: string;
}

export interface StudentEnrollment {
  id: string;
  studentId: string;
  academicYearId: string;
  levelId: string;
  classId: string;
  enrollmentDate: string;
  status: 'active' | 'withdrawn' | 'graduated' | 'transferred';
  allowReRegistration: boolean; // Admin approval for re-registration
}

export interface FeePaymentRecord {
  id: string;
  studentId: string;
  academicYearId: string;
  feeId: string;
  feeName: string;
  amount: number;
  discountAmount: number;
  paidAmount: number;
  status: 'paid' | 'partial' | 'unpaid';
  dueDate: string;
  paidDate?: string;
  month?: string; // For monthly fees
}

export interface CustomFee {
  id: string;
  studentId: string;
  name: string;
  amount: number;
  description?: string;
  status: 'paid' | 'unpaid';
  createdAt: string;
  paidDate?: string;
}

// Applied discount for a student (supports multiple discounts)
export interface AppliedStudentDiscount {
  id: string;
  studentId: string;
  discountId: string;
  academicYearId: string;
  appliedDate: string;
}
