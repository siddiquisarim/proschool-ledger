// Settings-related types for school configuration

export interface Level {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
}

export type ClassStatus = 'read_write' | 'read' | 'closed';

export interface AcademicClass {
  id: string;
  name: string;
  levelId: string;
  capacity: number;
  maxStudents: number;
  enrolledStudents: number;
  status: ClassStatus; // read_write: can enroll, read: reports only, closed: completely closed
  isActive: boolean;
}

export interface TransportLine {
  id: string;
  name: string;
  startLocation: string;
  endLocation: string;
  fee: number;
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

export interface FeeDiscount {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  applicableFees: string[]; // Fee IDs this discount applies to
  isActive: boolean;
}

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
