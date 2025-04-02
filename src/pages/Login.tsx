
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Logo from '@/components/Logo';
import { Eye, EyeOff, Shield, MailIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ensureUserRole, initializeDatabase } from '@/utils/dbSetup';
import { supabase } from '@/integrations/supabase/client';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, resetPassword, isAuthenticated, loading } = useAuth();
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log("User is authenticated, redirecting to home");
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if account is locked
    if (isLocked) {
      toast.error('Account is temporarily locked. Please try again later.');
      return;
    }
    
    // Basic validation
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Attempting login with:", email);
      const success = await login(email, password);
      
      if (success) {
        console.log("Login successful!");
        
        // Get the current user
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Initialize database if needed and ensure user has a role
          await initializeDatabase(session.user.id);
        }
        
        // Redirect is handled by useEffect above
      } else {
        // Increment login attempts
        const attempts = loginAttempts + 1;
        setLoginAttempts(attempts);
        
        // Lock account after 5 failed attempts
        if (attempts >= 5) {
          setIsLocked(true);
          toast.error('Too many failed login attempts. Account temporarily locked for 10 minutes.');
          
          // Unlock after 10 minutes
          setTimeout(() => {
            setIsLocked(false);
            setLoginAttempts(0);
          }, 10 * 60 * 1000);
        } else {
          toast.error(`Login failed. ${5 - attempts} attempts remaining before lockout.`);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      setIsLoading(true);
      await resetPassword(resetEmail);
      toast.success('Password reset email sent. Please check your inbox.');
      setIsResettingPassword(false);
      setResetEmail('');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send password reset email. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1 flex items-center">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl text-center">
            {isResettingPassword ? 'Reset Password' : 'Secure Login'}
          </CardTitle>
          <CardDescription className="text-center">
            {isResettingPassword 
              ? 'Enter your email to receive a password reset link'
              : 'Enter your credentials to access the system'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isResettingPassword ? (
            <form onSubmit={handleForgotPassword}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setIsResettingPassword(false)}
                  disabled={isLoading}
                >
                  Back to Login
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    disabled={isLoading || isLocked}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button 
                      type="button"
                      variant="link"
                      className="text-xs p-0 h-auto"
                      onClick={() => setIsResettingPassword(true)}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="pr-10"
                      disabled={isLoading || isLocked}
                    />
                    <Button 
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || isLocked}
                >
                  {isLoading ? 'Signing in...' : isLocked ? 'Account Locked' : 'Sign In'}
                </Button>
                
                <p className="text-sm text-center text-muted-foreground">
                  Don't have an account?{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm"
                    onClick={() => toast.info("Please contact your administrator to create an account.")}
                  >
                    Contact admin
                  </Button>
                </p>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Shield className="h-4 w-4 mr-2" />
            <p>Secure login with enterprise-grade protection</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
