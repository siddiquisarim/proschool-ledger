import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AppState, User, Language, UserRole } from '@/types';

interface AppContextType extends AppState {
  setCurrentUser: (user: User | null) => void;
  setLanguage: (lang: Language) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  switchRole: (role: UserRole) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.title': 'ProSchool Manager',
    'nav.dashboard': 'Dashboard',
    'nav.students': 'Students',
    'nav.fees': 'Fee Management',
    'nav.payments': 'Payments',
    'nav.attendance': 'Attendance',
    'nav.verification': 'Verification Queue',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.idCards': 'ID Cards',
    'nav.users': 'User Management',
    'role.admin': 'Administrator',
    'role.cashier': 'Cashier',
    'role.supervisor': 'Supervisor',
    'role.accountant': 'Accountant',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.print': 'Print',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.amount': 'Amount',
    'common.total': 'Total',
    'common.balance': 'Balance',
    'common.paid': 'Paid',
    'common.pending': 'Pending',
    'common.overdue': 'Overdue',
    'common.approved': 'Approved',
    'common.rejected': 'Rejected',
    'common.finalized': 'Finalized',
    'student.list': 'Student List',
    'student.add': 'Add Student',
    'student.profile': 'Student Profile',
    'student.id': 'Student ID',
    'student.name': 'Name',
    'student.grade': 'Grade',
    'student.section': 'Section',
    'fee.mandatory': 'Mandatory Fees',
    'fee.monthly': 'Monthly Fees',
    'fee.discount': 'Discount',
    'fee.totalDue': 'Total Due',
    'fee.totalPaid': 'Total Paid',
    'payment.process': 'Process Payment',
    'payment.receipt': 'Receipt',
    'payment.method': 'Payment Method',
    'closure.daily': 'Daily Closure',
    'closure.submit': 'Submit Closure',
    'closure.verify': 'Verify',
    'attendance.mark': 'Mark Attendance',
    'attendance.present': 'Present',
    'attendance.absent': 'Absent',
    'attendance.late': 'Late',
    'attendance.excused': 'Excused',
    'login': 'Sign In',
    'users': 'User Management',
  },
  ar: {
    'app.title': 'مدير المدرسة المحترف',
    'nav.dashboard': 'لوحة التحكم',
    'nav.students': 'الطلاب',
    'nav.fees': 'إدارة الرسوم',
    'nav.payments': 'المدفوعات',
    'nav.attendance': 'الحضور',
    'nav.verification': 'قائمة التحقق',
    'nav.reports': 'التقارير',
    'nav.settings': 'الإعدادات',
    'nav.idCards': 'البطاقات الشخصية',
    'nav.users': 'إدارة المستخدمين',
    'role.admin': 'المدير',
    'role.cashier': 'أمين الصندوق',
    'role.supervisor': 'المشرف',
    'role.accountant': 'المحاسب',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.add': 'إضافة',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.export': 'تصدير',
    'common.print': 'طباعة',
    'common.actions': 'الإجراءات',
    'common.status': 'الحالة',
    'common.date': 'التاريخ',
    'common.amount': 'المبلغ',
    'common.total': 'المجموع',
    'common.balance': 'الرصيد',
    'common.paid': 'مدفوع',
    'common.pending': 'قيد الانتظار',
    'common.overdue': 'متأخر',
    'common.approved': 'موافق عليه',
    'common.rejected': 'مرفوض',
    'common.finalized': 'نهائي',
    'student.list': 'قائمة الطلاب',
    'student.add': 'إضافة طالب',
    'student.profile': 'ملف الطالب',
    'student.id': 'رقم الطالب',
    'student.name': 'الاسم',
    'student.grade': 'الصف',
    'student.section': 'الشعبة',
    'fee.mandatory': 'الرسوم الإلزامية',
    'fee.monthly': 'الرسوم الشهرية',
    'fee.discount': 'الخصم',
    'fee.totalDue': 'المستحق الكلي',
    'fee.totalPaid': 'المدفوع الكلي',
    'payment.process': 'معالجة الدفع',
    'payment.receipt': 'الإيصال',
    'payment.method': 'طريقة الدفع',
    'closure.daily': 'الإغلاق اليومي',
    'closure.submit': 'تقديم الإغلاق',
    'closure.verify': 'تحقق',
    'attendance.mark': 'تسجيل الحضور',
    'attendance.present': 'حاضر',
    'attendance.absent': 'غائب',
    'attendance.late': 'متأخر',
    'attendance.excused': 'معذور',
    'login': 'تسجيل الدخول',
    'users': 'إدارة المستخدمين',
  },
};

// No default user - require login
const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [language, setLanguageState] = useState<Language>('en');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [isRTL, language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role,
        name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
      });
    }
  }, [currentUser]);

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        language,
        sidebarCollapsed,
        setCurrentUser,
        setLanguage,
        toggleSidebar,
        setSidebarCollapsed,
        switchRole,
        isRTL,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
