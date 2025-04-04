
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield } from 'lucide-react';
import RefinedIPProtectionTool from '@/components/RefinedIPProtectionTool';
import { useAuth, SignedIn, SignedOut, useClerk } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const IPProtectionPage = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <LegalToolLayout
      title="Indian IP Protection Suite"
      description="Access official Indian government resources for intellectual property protection, drafting assistance, and monitoring tools."
      icon={<Shield className="w-6 h-6 text-blue-600" />}
    >
      <SignedIn>
        <RefinedIPProtectionTool />
      </SignedIn>
      
      <SignedOut>
        <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
          <Shield className="w-16 h-16 text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-center mb-2">Protect Your Intellectual Property</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6 max-w-lg">
            Sign in to access our comprehensive IP protection tools including trademark searches, 
            patent drafting assistance, and official Indian government resources.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/auth')}
            >
              Sign in
            </Button>
            <Button
              variant="default"
              onClick={() => navigate('/auth/sign-up')}
            >
              Create account
            </Button>
          </div>
        </div>
      </SignedOut>
    </LegalToolLayout>
  );
};

export default IPProtectionPage;
