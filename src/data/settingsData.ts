import { Level, AcademicClass, TransportLine, AcademicYear, FeeDiscount, AcademicYearEnrollment } from '@/types/settings';

export const mockLevels: Level[] = [
  { id: 'level-1', name: 'Level 1', order: 1, isActive: true },
  { id: 'level-2', name: 'Level 2', order: 2, isActive: true },
  { id: 'level-3', name: 'Level 3', order: 3, isActive: true },
  { id: 'level-4', name: 'Level 4', order: 4, isActive: true },
  { id: 'level-5', name: 'Level 5', order: 5, isActive: true },
];

export const mockAcademicClasses: AcademicClass[] = [
  // Level 1 Classes
  { id: 'class-kg1-a', name: 'KG1-A', levelId: 'level-1', capacity: 25, maxStudents: 30, enrolledStudents: 22, status: 'read_write', isActive: true },
  { id: 'class-kg1-b', name: 'KG1-B', levelId: 'level-1', capacity: 25, maxStudents: 30, enrolledStudents: 25, status: 'read_write', isActive: true },
  { id: 'class-kg1-c', name: 'KG1-C', levelId: 'level-1', capacity: 25, maxStudents: 30, enrolledStudents: 18, status: 'read_write', isActive: true },
  // Level 2 Classes
  { id: 'class-kg2-a', name: 'KG2-A', levelId: 'level-2', capacity: 25, maxStudents: 28, enrolledStudents: 24, status: 'read_write', isActive: true },
  { id: 'class-kg2-b', name: 'KG2-B', levelId: 'level-2', capacity: 25, maxStudents: 28, enrolledStudents: 26, status: 'read', isActive: true },
  // Level 3 Classes
  { id: 'class-kg3-a', name: 'KG3-A', levelId: 'level-3', capacity: 25, maxStudents: 28, enrolledStudents: 20, status: 'read_write', isActive: true },
  { id: 'class-kg3-b', name: 'KG3-B', levelId: 'level-3', capacity: 25, maxStudents: 28, enrolledStudents: 0, status: 'closed', isActive: false },
  // Level 4 Classes
  { id: 'class-g1-a', name: 'Grade 1-A', levelId: 'level-4', capacity: 30, maxStudents: 35, enrolledStudents: 28, status: 'read_write', isActive: true },
  { id: 'class-g1-b', name: 'Grade 1-B', levelId: 'level-4', capacity: 30, maxStudents: 35, enrolledStudents: 30, status: 'read_write', isActive: true },
  // Level 5 Classes
  { id: 'class-g2-a', name: 'Grade 2-A', levelId: 'level-5', capacity: 30, maxStudents: 35, enrolledStudents: 27, status: 'read_write', isActive: true },
  { id: 'class-g2-b', name: 'Grade 2-B', levelId: 'level-5', capacity: 30, maxStudents: 35, enrolledStudents: 29, status: 'read_write', isActive: true },
];

export const mockTransportLines: TransportLine[] = [
  { id: 'trans-1', name: 'Route A', startLocation: 'Al Hidd', endLocation: 'School Campus', fee: 500, isActive: true },
  { id: 'trans-2', name: 'Route B', startLocation: 'Muharraq', endLocation: 'School Campus', fee: 450, isActive: true },
  { id: 'trans-3', name: 'Route C', startLocation: 'Riffa', endLocation: 'School Campus', fee: 600, isActive: true },
  { id: 'trans-4', name: 'Route D', startLocation: 'Isa Town', endLocation: 'School Campus', fee: 550, isActive: true },
  { id: 'trans-5', name: 'Route E', startLocation: 'Hamad Town', endLocation: 'School Campus', fee: 650, isActive: true },
];

export const mockAcademicYears: AcademicYear[] = [
  { id: 'ay-2024-25', name: '2024-2025', startDate: '2024-09-01', endDate: '2025-06-30', isCurrent: true },
  { id: 'ay-2023-24', name: '2023-2024', startDate: '2023-09-01', endDate: '2024-06-30', isCurrent: false },
  { id: 'ay-2025-26', name: '2025-2026', startDate: '2025-09-01', endDate: '2026-06-30', isCurrent: false },
];

export const mockAcademicYearEnrollments: AcademicYearEnrollment[] = [
  // 2024-2025 enrollment stats
  { academicYearId: 'ay-2024-25', classId: 'class-kg1-a', enrolledCount: 22, leftCount: 2, graduatedCount: 0, transferredCount: 1 },
  { academicYearId: 'ay-2024-25', classId: 'class-kg1-b', enrolledCount: 25, leftCount: 0, graduatedCount: 0, transferredCount: 0 },
  { academicYearId: 'ay-2024-25', classId: 'class-kg2-a', enrolledCount: 24, leftCount: 1, graduatedCount: 0, transferredCount: 0 },
  { academicYearId: 'ay-2024-25', classId: 'class-g1-a', enrolledCount: 28, leftCount: 0, graduatedCount: 0, transferredCount: 2 },
  // 2023-2024 enrollment stats
  { academicYearId: 'ay-2023-24', classId: 'class-kg1-a', enrolledCount: 20, leftCount: 3, graduatedCount: 18, transferredCount: 2 },
  { academicYearId: 'ay-2023-24', classId: 'class-kg1-b', enrolledCount: 23, leftCount: 1, graduatedCount: 22, transferredCount: 0 },
];

export const mockFeeDiscounts: FeeDiscount[] = [
  { 
    id: 'disc-sibling', 
    name: 'Sibling Discount', 
    description: 'Applied to second child and beyond',
    type: 'percentage', 
    value: 10, 
    applicableFees: ['fee-registration', 'fee-tuition'],
    isActive: true 
  },
  { 
    id: 'disc-staff', 
    name: 'Staff Discount', 
    description: 'For children of school employees',
    type: 'percentage', 
    value: 25, 
    applicableFees: ['fee-registration', 'fee-tuition', 'fee-monthly'],
    isActive: true 
  },
  { 
    id: 'disc-scholarship', 
    name: 'Scholarship', 
    description: 'Merit-based financial aid',
    type: 'percentage', 
    value: 50, 
    applicableFees: ['fee-tuition', 'fee-monthly'],
    isActive: true 
  },
  { 
    id: 'disc-registration', 
    name: 'Registration Discount', 
    description: 'Applies only to registration fee',
    type: 'percentage', 
    value: 10, 
    applicableFees: ['fee-registration'],
    isActive: true 
  },
  { 
    id: 'disc-early-bird', 
    name: 'Early Bird Discount', 
    description: 'For early registration',
    type: 'fixed', 
    value: 200, 
    applicableFees: ['fee-registration'],
    isActive: true 
  },
];

// Fee types for the school
export const mockFeeTypes = [
  { id: 'fee-registration', name: 'Registration Fee', amount: 500, type: 'mandatory' as const },
  { id: 'fee-tuition', name: 'Tuition Fee', amount: 3000, type: 'mandatory' as const },
  { id: 'fee-books', name: 'Books & Materials', amount: 800, type: 'mandatory' as const },
  { id: 'fee-uniform', name: 'Uniform Fee', amount: 300, type: 'mandatory' as const },
  { id: 'fee-monthly', name: 'Monthly Fee', amount: 250, type: 'monthly' as const },
  { id: 'fee-transport', name: 'Transport Fee', amount: 0, type: 'optional' as const },
  { id: 'fee-activities', name: 'Activities Fee', amount: 150, type: 'optional' as const },
];
