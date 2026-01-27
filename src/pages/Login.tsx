import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, GraduationCap, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const { t, setCurrentUser } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<'staff' | 'parent'>('staff');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (email && password) {
        if (loginType === 'parent') {
          // Parent login
          setCurrentUser({
            id: 'parent-1',
            name: email.split('@')[0],
            email: email,
            role: 'parent',
          });
          navigate('/parent');
        } else {
          // Staff login
          const role = email.includes('admin') ? 'admin' 
            : email.includes('supervisor') ? 'supervisor'
            : email.includes('accountant') ? 'accountant'
            : 'cashier';
          
          setCurrentUser({
            id: '1',
            name: email.split('@')[0],
            email: email,
            role: role,
          });
          navigate('/');
        }
      } else {
        setError('Please enter email and password');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary mb-4">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">ProSchool Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">Enterprise Resource Planning</p>
        </div>

        <Card className="border-border shadow-enterprise">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold">{t('login')}</CardTitle>
            <CardDescription>
              Select your login type and enter credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={loginType} onValueChange={(v) => setLoginType(v as 'staff' | 'parent')} className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="staff" className="gap-2">
                  <Briefcase className="w-4 h-4" />
                  Staff Login
                </TabsTrigger>
                <TabsTrigger value="parent" className="gap-2">
                  <Users className="w-4 h-4" />
                  Parent Login
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={loginType === 'parent' ? 'parent@email.com' : 'admin@school.edu'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-input" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-primary hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-xs text-muted-foreground text-center mt-4 p-3 bg-muted/50 rounded-md">
                {loginType === 'staff' ? (
                  <>
                    <p className="font-medium mb-1">Staff Demo Credentials:</p>
                    <p>Use emails with role keywords: admin@, supervisor@, accountant@, cashier@</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium mb-1">Parent Demo Credentials:</p>
                    <p>Use any email to access the parent portal</p>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2024 ProSchool Manager. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
