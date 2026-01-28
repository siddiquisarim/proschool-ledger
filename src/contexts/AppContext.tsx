import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AppState, User, Language, UserRole } from '@/types';
import { translations } from '@/i18n/translations';

interface AppContextType extends AppState {
  setCurrentUser: (user: User | null) => void;
  setLanguage: (lang: Language) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  switchRole: (role: UserRole) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

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
