
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const SignupConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const [isResending, setIsResending] = React.useState(false);

  // If user navigated directly without coming from signup page
  if (!email) {
    React.useEffect(() => {
      navigate('/signup', { replace: true });
    }, [navigate]);
    return null;
  }

  const handleResendConfirmation = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        }
      });

      if (error) {
        toast.error('Failed to resend confirmation email', {
          description: error.message,
        });
      } else {
        toast.success('Confirmation email resent', {
          description: 'Please check your inbox',
        });
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto max-w-md px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <Mail className="h-10 w-10 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Verify your email</h1>
          
          <p className="text-gray-600 dark:text-gray-300">
            We've sent a verification email to <span className="font-semibold">{email}</span>.
            Please click the link in the email to verify your account.
          </p>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded">
            <p>Be sure to check your spam or junk folder if you don't see the email in your inbox.</p>
          </div>
          
          <div className="space-y-4 pt-2">
            <Button 
              onClick={handleResendConfirmation} 
              variant="outline" 
              className="w-full flex items-center justify-center"
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resend verification email
                </>
              )}
            </Button>
            
            <Link to="/login">
              <Button variant="ghost" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SignupConfirmationPage;
