
import React from 'react';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthPage = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState<"sign-in" | "sign-up">(
    location.pathname.includes("sign-up") ? "sign-up" : "sign-in"
  );

  React.useEffect(() => {
    // Redirect to home if already signed in
    if (isSignedIn) {
      navigate('/');
    }
  }, [isSignedIn, navigate]);

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
