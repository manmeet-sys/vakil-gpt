
import React from 'react';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState<"sign-in" | "sign-up">(
    location.pathname.includes("sign-up") ? "sign-up" : "sign-in"
  );

  // Check if we're using mock auth (no valid Clerk key)
  const usingMockAuth = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
                        import.meta.env.VITE_CLERK_PUBLISHABLE_KEY === 'pk_test_placeholder_key' ||
                        !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_');

  React.useEffect(() => {
    // Redirect to home if already signed in
    if (isSignedIn) {
      navigate('/');
    }
  }, [isSignedIn, navigate]);

  // Handle mock sign in for development without a Clerk key
  const handleMockSignIn = () => {
    // For development only - redirect to home as if signed in
    navigate('/');
  };

  if (usingMockAuth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">VakilGPT</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The AI-powered legal assistant for Indian law
            </p>
          </div>

          <div className="mt-8 bg-white dark:bg-zinc-800 p-8 shadow rounded-lg">
            <div className="text-center space-y-6">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
                <p>Development Mode: No valid Clerk API key detected</p>
                <p className="mt-1 text-xs">Set VITE_CLERK_PUBLISHABLE_KEY in your environment to enable actual authentication.</p>
              </div>
              
              <Button onClick={handleMockSignIn} className="w-full">
                Continue as Mock User
              </Button>
              
              <p className="text-xs text-gray-500">
                This is a development-only feature. In production, you'll need to set up proper authentication.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">VakilGPT</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The AI-powered legal assistant for Indian law
          </p>
        </div>

        <div className="mt-8 bg-white dark:bg-zinc-800 p-8 shadow rounded-lg">
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "sign-in" | "sign-up")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="sign-in">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="sign-in" className="mt-0">
              <SignIn 
                appearance={{
                  elements: {
                    formButtonPrimary: 
                      'bg-apple-blue hover:bg-apple-blue/90 text-white',
                    formFieldInput: 
                      'border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded-lg',
                    footerActionLink: 
                      'text-apple-blue hover:text-apple-blue/90',
                    card: 'bg-transparent shadow-none p-0',
                  }
                }}
                signUpUrl="/auth/sign-up"
              />
            </TabsContent>

            <TabsContent value="sign-up" className="mt-0">
              <SignUp 
                appearance={{
                  elements: {
                    formButtonPrimary: 
                      'bg-apple-blue hover:bg-apple-blue/90 text-white',
                    formFieldInput: 
                      'border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded-lg',
                    footerActionLink: 
                      'text-apple-blue hover:text-apple-blue/90',
                    card: 'bg-transparent shadow-none p-0',
                  }
                }}
                signInUrl="/auth"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
