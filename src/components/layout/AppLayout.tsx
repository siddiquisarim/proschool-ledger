import { useApp } from '@/contexts/AppContext';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { sidebarCollapsed, isRTL } = useApp();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppSidebar />
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-200",
          isMobile
            ? "ml-0"
            : isRTL
              ? sidebarCollapsed ? "mr-16" : "mr-60"
              : sidebarCollapsed ? "ml-16" : "ml-60"
        )}
      >
        <AppHeader />
        <main className="flex-1 p-3 sm:p-4 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
