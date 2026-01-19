import { Level, AcademicClass, TransportLine, TransportArea, AcademicYear, FeeDiscount, AcademicYearEnrollment, FeeType, PredefinedExtraFee, GlobalGuardian, Subject, IDCardSettings } from '@/types/settings';

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

// Transport Areas - fees are per area, not per line
export const mockTransportAreas: TransportArea[] = [
  { id: 'area-1', name: 'Block 301-305', fee: 450, isActive: true },
  { id: 'area-2', name: 'Block 306-310', fee: 450, isActive: true },
  { id: 'area-3', name: 'Al Hidd', fee: 500, isActive: true },
  { id: 'area-4', name: 'Muharraq', fee: 500, isActive: true },
  { id: 'area-5', name: 'Riffa', fee: 600, isActive: true },
  { id: 'area-6', name: 'Isa Town', fee: 550, isActive: true },
  { id: 'area-7', name: 'Hamad Town', fee: 650, isActive: true },
  { id: 'area-8', name: 'Saar', fee: 550, isActive: true },
  { id: 'area-9', name: 'Budaiya', fee: 600, isActive: true },
];

// Transport lines now cover multiple areas
export const mockTransportLines: TransportLine[] = [
  { id: 'trans-1', name: 'Route A - East', areaIds: ['area-3', 'area-4'], startLocation: 'Al Hidd', endLocation: 'School Campus', isActive: true },
  { id: 'trans-2', name: 'Route B - Central', areaIds: ['area-1', 'area-2'], startLocation: 'Block 301', endLocation: 'School Campus', isActive: true },
  { id: 'trans-3', name: 'Route C - South', areaIds: ['area-5', 'area-6'], startLocation: 'Riffa', endLocation: 'School Campus', isActive: true },
  { id: 'trans-4', name: 'Route D - West', areaIds: ['area-7', 'area-8', 'area-9'], startLocation: 'Hamad Town', endLocation: 'School Campus', isActive: true },
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
    applicableFees: [],
    isActive: true 
  },
];

// Fee types with proper categorization
export const mockFeeTypes: FeeType[] = [
  { id: 'fee-registration', name: 'Registration Fee', amount: 500, category: 'mandatory', isActive: true },
  { id: 'fee-tuition', name: 'Tuition Fee', amount: 3000, category: 'mandatory', isActive: true },
  { id: 'fee-books', name: 'Books & Materials', amount: 800, category: 'mandatory', isActive: true },
  { id: 'fee-uniform', name: 'Uniform Fee', amount: 300, category: 'mandatory', isActive: true },
  { id: 'fee-monthly', name: 'Monthly Fee', amount: 250, category: 'monthly', dueDay: 10, isActive: true },
  { id: 'fee-transport', name: 'Transport Fee', amount: 0, category: 'optional', isActive: true }, // Amount from area
  { id: 'fee-activities', name: 'Activities Fee', amount: 150, category: 'optional', isActive: true },
];

// Predefined extra fees (admin-defined, cashier selects from list)
export const mockPredefinedExtraFees: PredefinedExtraFee[] = [
  { id: 'extra-sports', name: 'Sports Equipment', amount: 200, description: 'Sports equipment and gear', isActive: true },
  { id: 'extra-lab', name: 'Lab Fee', amount: 150, description: 'Science lab materials', isActive: true },
  { id: 'extra-trip', name: 'Field Trip', amount: 100, description: 'Educational field trip', isActive: true },
  { id: 'extra-photo', name: 'Photo Package', amount: 50, description: 'School photo package', isActive: true },
  { id: 'extra-yearbook', name: 'Yearbook', amount: 75, description: 'Annual yearbook', isActive: true },
  { id: 'extra-certificate', name: 'Certificate Fee', amount: 25, description: 'Certificate and document processing', isActive: true },
];

// Subjects for the school
export const mockSubjects: Subject[] = [
  { id: 'subj-english', name: 'English', code: 'ENG', isActive: true },
  { id: 'subj-math', name: 'Mathematics', code: 'MATH', isActive: true },
  { id: 'subj-science', name: 'Science', code: 'SCI', isActive: true },
  { id: 'subj-arabic', name: 'Arabic', code: 'ARB', isActive: true },
  { id: 'subj-islamic', name: 'Islamic Studies', code: 'ISL', isActive: true },
  { id: 'subj-social', name: 'Social Studies', code: 'SOC', isActive: true },
  { id: 'subj-art', name: 'Art', code: 'ART', isActive: true },
  { id: 'subj-pe', name: 'Physical Education', code: 'PE', isActive: true },
  { id: 'subj-music', name: 'Music', code: 'MUS', isActive: true },
  { id: 'subj-ict', name: 'ICT', code: 'ICT', isActive: true },
];

// ID Card default settings
export const defaultIDCardSettings: IDCardSettings = {
  primaryColor: '#1e3a5f',
  secondaryColor: '#2d5a87',
  logoPosition: 'left',
  showLogo: true,
  backgroundColor: '#1e3a5f',
  textColor: '#ffffff',
  accentColor: '#3b82f6',
};

export const mockGlobalGuardians: GlobalGuardian[] = [
  {
    id: 'guardian-1',
    serialNumber: 'G001',
    name: 'Ahmed Ali Mohammed',
    mobile: '+973-3456-7890',
    cpr: '780512345',
    relationship: 'father',
    homeAddress: 'Block 301, Road 15, House 45',
    workAddress: 'Manama, Building 123',
    email: 'ahmed.ali@email.com',
    studentIds: ['STU001', 'STU005'], // Two children enrolled
  },
  {
    id: 'guardian-2',
    serialNumber: 'G002',
    name: 'Fatima Hassan',
    mobile: '+973-3456-7891',
    cpr: '820615432',
    relationship: 'mother',
    homeAddress: 'Block 301, Road 15, House 45',
    workAddress: '',
    email: 'fatima.h@email.com',
    studentIds: ['STU001', 'STU005'], // Same children
  },
  {
    id: 'guardian-3',
    serialNumber: 'G003',
    name: 'Khalid Omar',
    mobile: '+973-3789-1234',
    cpr: '750823456',
    relationship: 'father',
    homeAddress: 'Al Hidd, Building 78',
    workAddress: 'Riffa Industrial Area',
    email: 'khalid.omar@work.com',
    studentIds: ['STU002'],
  },
];

// Helper function to get transport lines for an area
export const getTransportLinesForArea = (areaId: string): TransportLine[] => {
  return mockTransportLines.filter(line => line.areaIds.includes(areaId) && line.isActive);
};

// Helper function to get transport fee for an area
export const getTransportFeeForArea = (areaId: string): number => {
  const area = mockTransportAreas.find(a => a.id === areaId);
  return area?.fee || 0;
};

// Helper function to find students with common guardians
export const findRelatedStudentsByGuardian = (studentId: string): string[] => {
  const studentGuardians = mockGlobalGuardians.filter(g => g.studentIds.includes(studentId));
  const relatedStudentIds = new Set<string>();
  
  studentGuardians.forEach(guardian => {
    guardian.studentIds.forEach(id => {
      if (id !== studentId) {
        relatedStudentIds.add(id);
      }
    });
  });
  
  return Array.from(relatedStudentIds);
};

// Helper function to calculate monthly fees based on enrollment date
export const calculateMonthlyFeesFromEnrollment = (
  enrollmentDate: string,
  academicYearEnd: string,
  monthlyFeeAmount: number
): { months: string[]; totalAmount: number } => {
  const enrollment = new Date(enrollmentDate);
  const yearEnd = new Date(academicYearEnd);
  
  const months: string[] = [];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
  
  let current = new Date(enrollment.getFullYear(), enrollment.getMonth(), 1);
  
  while (current <= yearEnd) {
    months.push(`${monthNames[current.getMonth()]} ${current.getFullYear()}`);
    current.setMonth(current.getMonth() + 1);
  }
  
  return {
    months,
    totalAmount: months.length * monthlyFeeAmount,
  };
};
