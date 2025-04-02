
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { KeyRound, CheckCircle } from 'lucide-react';
import Logo from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // If user is authenticated, redirect them to the homepage
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
    
    // Check if hash fragment contains token from email link
    const hashFragment = location.hash;
    if (!hashFragment || !hashFragment.includes('type=recovery')) {
      toast.error('Invalid password reset link');
      navigate('/login', { replace: true });
    }
  }, [location, navigate, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      setIsSuccess(true);
      toast.success('Password reset successfully');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
      
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex items-center">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl text-center">
            {isSuccess ? 'Password Reset Complete' : 'Reset Your Password'}
          </CardTitle>
          <CardDescription className="text-center">
            {isSuccess 
              ? 'Your password has been reset successfully. You will be redirected to login.'
              : 'Create a new password for your account'
            }
          </CardDescription>
        </CardHeader>
        
        {isSuccess ? (
          <CardContent className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-center text-muted-foreground">
              Redirecting you to the login page...
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  disabled={loading}
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;
