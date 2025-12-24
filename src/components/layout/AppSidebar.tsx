import { useApp } from '@/contexts/AppContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Receipt,
  CreditCard,
  CalendarCheck,
  CheckSquare,
  BarChart3,
  Settings,
  IdCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2,
  UserCog,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserRole } from '@/types';

interface NavItem {
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { key: 'nav.dashboard', icon: LayoutDashboard, path: '/', roles: ['admin', 'cashier', 'supervisor', 'accountant'] },
  { key: 'nav.students', icon: Users, path: '/students', roles: ['admin', 'cashier', 'supervisor'] },
  { key: 'nav.fees', icon: Receipt, path: '/fees', roles: ['admin', 'accountant'] },
  { key: 'nav.payments', icon: CreditCard, path: '/payments', roles: ['admin', 'cashier'] },
  { key: 'nav.attendance', icon: CalendarCheck, path: '/attendance', roles: ['admin', 'cashier', 'supervisor'] },
  { key: 'nav.verification', icon: CheckSquare, path: '/verification', roles: ['admin', 'supervisor', 'accountant'] },
  { key: 'nav.reports', icon: BarChart3, path: '/reports', roles: ['admin', 'supervisor', 'accountant'] },
  { key: 'nav.idCards', icon: IdCard, path: '/id-cards', roles: ['admin', 'cashier'] },
  { key: 'nav.users', icon: UserCog, path: '/users', roles: ['admin'] },
  { key: 'nav.settings', icon: Settings, path: '/settings', roles: ['admin'] },
];

export function AppSidebar() {
  const { currentUser, sidebarCollapsed, toggleSidebar, t, isRTL, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const filteredNavItems = navItems.filter(
    item => currentUser && item.roles.includes(currentUser.role)
  );

  const handleSignOut = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        "fixed top-0 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-200 z-40 flex flex-col",
        sidebarCollapsed ? "w-16" : "w-60",
        isRTL ? "right-0 border-l border-r-0" : "left-0"
      )}
    >
      {/* Header */}
      <div className="h-14 flex items-center px-4 border-b border-sidebar-border">
        <div className={cn("flex items-center gap-3", sidebarCollapsed && "justify-center w-full")}>
          <div className="w-8 h-8 rounded bg-sidebar-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">ProSchool</span>
              <span className="text-xxs text-sidebar-foreground/60 uppercase tracking-wider">Manager</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1 px-2">
          {filteredNavItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 text-sm rounded transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    sidebarCollapsed && "justify-center px-2"
                  )
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && <span>{t(item.key)}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* User Section */}
      <div className="p-3">
        {!sidebarCollapsed && currentUser && (
          <div className="mb-3 px-2">
            <p className="text-xs font-medium text-sidebar-foreground truncate">{currentUser.name}</p>
            <p className="text-xxs text-sidebar-foreground/60 uppercase tracking-wider">
              {t(`role.${currentUser.role}`)}
            </p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className={cn(
            "w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
            sidebarCollapsed && "px-2"
          )}
        >
          <LogOut className="w-4 h-4" />
          {!sidebarCollapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </div>

      {/* Collapse Button */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-6 h-12 bg-sidebar border border-sidebar-border rounded flex items-center justify-center hover:bg-sidebar-accent transition-colors",
          isRTL ? "-left-3" : "-right-3"
        )}
      >
        {(sidebarCollapsed ? !isRTL : isRTL) ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}
