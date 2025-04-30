
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import TwoFactorAuth from '@/components/auth/TwoFactorAuth';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  require2FA?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, require2FA = false }) => {
  const { user, loading, verifyTwoFactor, isTwoFactorVerified, twoFactorEnabled } = useAuth();
  const location = useLocation();
  const [showTwoFactorPrompt, setShowTwoFactorPrompt] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    // Show 2FA prompt if enabled and not verified yet
    if (user && twoFactorEnabled && !isTwoFactorVerified && require2FA) {
      setShowTwoFactorPrompt(true);
    } else {
      setShowTwoFactorPrompt(false);
    }
  }, [user, twoFactorEnabled, isTwoFactorVerified, require2FA]);

  const handleVerify = async (otp: string) => {
    try {
      const result = await verifyTwoFactor(otp);
      if (result) {
        setShowTwoFactorPrompt(false);
        toast.success('Two-factor authentication verified');
        return true;
      }
      toast.error('Invalid verification code');
      return false;
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      toast.error('Failed to verify two-factor code');
      return false;
    }
  };

  const handleCancel = () => {
    setShowTwoFactorPrompt(false);
    // Redirect to a non-2FA required page
    toast.info('Two-factor authentication is required for this page');
    setRedirectPath('/');
  };

  // If we need to redirect
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  if (loading) {
    // Show an optimized loading state while checking auth
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-2/3 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated, preserving the intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if 2FA is needed but hasn't been verified
  if (require2FA && twoFactorEnabled && !isTwoFactorVerified) {
    return (
      <>
        {children}
        {showTwoFactorPrompt && (
          <TwoFactorAuth 
            onVerify={handleVerify}
            onCancel={handleCancel}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
