
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import TwoFactorAuth from '@/components/auth/TwoFactorAuth';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  require2FA?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, require2FA = false }) => {
  const { user, loading, verifyTwoFactor, isTwoFactorVerified, twoFactorEnabled } = useAuth();
  const location = useLocation();
  const [showTwoFactorPrompt, setShowTwoFactorPrompt] = useState(false);

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
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      toast.error('Failed to verify two-factor code');
      return false;
    }
  };

  if (loading) {
    // Show a loading state while checking auth
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
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
            onCancel={() => {
              // Redirect to a non-2FA required page
              toast.info('Two-factor authentication is required for this page');
              return <Navigate to="/" replace />;
            }}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
