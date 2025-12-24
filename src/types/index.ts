export type UserRole = 'admin' | 'cashier' | 'supervisor' | 'accountant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  arabicName?: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  grade: string;
  section: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  address?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  photo?: string;
  discountType?: DiscountType;
  discountValue?: number;
}

export type DiscountType = 'none' | 'sibling' | 'staff' | 'scholarship' | 'custom';

export interface FeeStructure {
  id: string;
  name: string;
  type: 'mandatory' | 'monthly';
  amount: number;
  grade: string;
  dueDay?: number;
  description?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  originalAmount: number;
  discountApplied: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'check';
  feeType: 'mandatory' | 'monthly';
  monthsCovered?: string[];
  receiptNumber: string;
  cashierId: string;
  status: 'pending' | 'approved' | 'rejected' | 'finalized';
  notes?: string;
}

export interface DailyClosure {
  id: string;
  date: string;
  cashierId: string;
  cashierName: string;
  totalCash: number;
  totalCard: number;
  totalBankTransfer: number;
  totalCheck: number;
  grandTotal: number;
  transactionCount: number;
  status: 'pending' | 'supervisor_approved' | 'supervisor_rejected' | 'finalized' | 'deposited';
  supervisorId?: string;
  supervisorNotes?: string;
  accountantId?: string;
  accountantNotes?: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  entityType: 'student' | 'teacher';
  entityId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  markedBy: string;
  markedAt: string;
}

export interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  status: 'active' | 'inactive';
}

export interface SchoolSettings {
  schoolName: string;
  schoolNameArabic?: string;
  schoolYear: string;
  yearStartDate: string;
  yearEndDate: string;
  monthlyDueDay: number;
  prepayThreshold: number;
  logo?: string;
}

export type Language = 'en' | 'ar';

export interface AppState {
  currentUser: User | null;
  language: Language;
  sidebarCollapsed: boolean;
}
