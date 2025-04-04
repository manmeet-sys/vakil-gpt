
import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Your Account</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join VakilGPT, the AI-powered legal assistant for Indian law
          </p>
        </div>

        <div className="mt-8 bg-white dark:bg-zinc-800 p-8 shadow rounded-lg">
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
                socialButtonsIconButton: 'border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-700',
                socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-700'
              }
            }}
            signInUrl="/auth"
          />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/auth')}
                className="text-apple-blue hover:text-apple-blue/90 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
