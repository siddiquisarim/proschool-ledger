export type UserRole = 'admin' | 'cashier' | 'supervisor' | 'accountant' | 'parent';

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
  cprNumber?: string;
  grade: string;
  section: string;
  levelId?: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  address?: string;
  returnAddress?: string;
  transportAreaId?: string; // Area/block for transport fee
  transportLineId?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  photo?: string;
  discountType?: DiscountType;
  discountValue?: number;
  allowReRegistration?: boolean; // Admin approval for re-registration across years
  appliedDiscountIds?: string[]; // Multiple discounts can be applied
}

export type DiscountType = 'none' | 'sibling' | 'staff' | 'scholarship' | 'custom';

export interface FeeStructure {
  id: string;
  name: string;
  type: 'mandatory' | 'monthly';
  amount: number;
  grade: string;
  levelIds?: string[];
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

// Ticket Management Types
export type TicketStatus = 'pending' | 'approved' | 'solved' | 'closed';
export type TicketCategory = 'technical' | 'financial' | 'administrative' | 'academic' | 'maintenance' | 'other';

export interface TicketHistory {
  id: string;
  ticketId: string;
  action: string;
  fromStatus?: TicketStatus;
  toStatus?: TicketStatus;
  userId: string;
  userName: string;
  notes?: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  assignedToUserId?: string;
  assignedToGroupId?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  resolvedReason?: string;
  history: TicketHistory[];
}

export interface UserGroup {
  id: string;
  name: string;
  description?: string;
  memberIds: string[];
}

// HR Management Types
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'temporary';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type OvertimeStatus = 'pending' | 'supervisor_confirmed' | 'approved' | 'rejected';

export interface Employee {
  id: string;
  userId: string;
  employeeCode: string;
  cpr: string;
  department: string;
  occupation: string;
  employmentType: EmploymentType;
  workingHours: number;
  yearlyLeaveBalance: number;
  usedLeave: number;
  basicSalary: number;
  mobileAllowance: number;
  transportAllowance: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  daysCount: number;
  approvedBy?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface OvertimeRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  hours: number;
  reason: string;
  status: OvertimeStatus;
  supervisorConfirmedBy?: string;
  approvedBy?: string;
  rejectionReason?: string;
  addedToPayroll: boolean;
  payrollMonth?: string;
  createdAt: string;
}

export interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  mobileAllowance: number;
  transportAllowance: number;
  overtimeAmount: number;
  variableBenefits: { name: string; amount: number }[];
  variableDeductions: { name: string; amount: number }[];
  totalBenefits: number;
  totalDeductions: number;
  netSalary: number;
  status: 'draft' | 'processed' | 'paid';
  processedBy?: string;
  processedAt?: string;
}

export interface PayslipPermission {
  employeeId: string;
  canViewPayslip: boolean;
}

export type Language = 'en' | 'ar';

// Audit Trail Types
export type AuditActionCategory = 
  | 'authentication' 
  | 'student' 
  | 'payment' 
  | 'discount' 
  | 'fee' 
  | 'attendance' 
  | 'verification' 
  | 'ticket' 
  | 'employee' 
  | 'leave' 
  | 'overtime' 
  | 'payroll' 
  | 'user' 
  | 'settings';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  category: AuditActionCategory;
  action: string;
  description: string;
  entityType?: string;
  entityId?: string;
  entityName?: string;
  details?: string;
  ipAddress: string;
}

export interface AppState {
  currentUser: User | null;
  language: Language;
  sidebarCollapsed: boolean;
}
