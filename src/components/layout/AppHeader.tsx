import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages, User, Shield, ChevronDown } from 'lucide-react';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

const roles: { role: UserRole; label: string }[] = [
  { role: 'admin', label: 'Administrator' },
  { role: 'cashier', label: 'Cashier' },
  { role: 'supervisor', label: 'Supervisor' },
  { role: 'accountant', label: 'Accountant' },
];

export function AppHeader() {
  const { currentUser, language, setLanguage, switchRole, t, isRTL } = useApp();

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground">
          {t('app.title')}
        </h1>
      </div>

      <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
        {/* Language Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="gap-2"
        >
          <Languages className="w-4 h-4" />
          <span className="text-xs font-medium uppercase">{language === 'en' ? 'AR' : 'EN'}</span>
        </Button>

        {/* Role Switcher (for demo) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-xs">{t(`role.${currentUser?.role}`)}</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? "start" : "end"}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">Switch Role (Demo)</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {roles.map(({ role, label }) => (
              <DropdownMenuItem
                key={role}
                onClick={() => switchRole(role)}
                className={cn(
                  "text-sm cursor-pointer",
                  currentUser?.role === role && "bg-secondary"
                )}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? "start" : "end"}>
            <DropdownMenuLabel>
              <div>
                <p className="text-sm font-medium">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm cursor-pointer">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-sm cursor-pointer text-destructive">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
