import { useApp } from '@/contexts/AppContext';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { sidebarCollapsed, isRTL } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div
        className={cn(
          "transition-all duration-200",
          isRTL
            ? sidebarCollapsed ? "mr-16" : "mr-60"
            : sidebarCollapsed ? "ml-16" : "ml-60"
        )}
      >
        <AppHeader />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
