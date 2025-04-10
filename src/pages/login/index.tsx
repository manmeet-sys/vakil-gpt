
import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get redirect path from location state or default to home
  const from = location.state?.from || '/';
  
  // Check if user has just verified email
  useEffect(() => {
    const verified = searchParams.get('verified');
    if (verified === 'true') {
      toast.success('Email verified successfully', {
        description: 'You can now log in with your credentials',
      });
    }
  }, [searchParams]);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        toast.error('Login failed', {
          description: error.message,
        });
      } else {
        // No need to manually redirect - handled by the useEffect
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`
        }
      });
      
      if (error) {
        toast.error('Google sign in failed', {
          description: error.message,
        });
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex min-h-[80vh] items-center justify-center py-10 px-4">
        <div className="w-full max-w-md px-6 py-10 bg-white/40 dark:bg-zinc-800/30 backdrop-blur-xl rounded-2xl shadow-elegant border border-gray-100/70 dark:border-zinc-700/30">
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h1 className="text-2xl font-medium text-gray-900 dark:text-white tracking-tight">Welcome back</h1>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Sign in to your VakilGPT account
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-gray-600 dark:text-gray-300 font-medium text-sm">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            type="email"
                            placeholder="Your email address"
                            className="pl-10 text-gray-800 dark:text-gray-100 h-10 bg-gray-50/70 dark:bg-zinc-800/70 border-0 shadow-sm"
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-gray-600 dark:text-gray-300 font-medium text-sm">Password</FormLabel>
                        <Link
                          to="/reset-password"
                          className="text-xs text-blue-500 dark:text-blue-400 hover:underline font-medium"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 text-gray-800 dark:text-gray-100 h-10 bg-gray-50/70 dark:bg-zinc-800/70 border-0 shadow-sm"
                            disabled={isLoading}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="rounded-sm data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-400"
                        />
                      </FormControl>
                      <FormLabel className="text-xs text-gray-500 dark:text-gray-400 font-medium cursor-pointer">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </Form>

            <div className="text-center pt-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-500 dark:text-blue-400 hover:underline font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700/30"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white/40 dark:bg-zinc-800/30 backdrop-blur-sm px-4 text-gray-500 dark:text-gray-400 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full h-11 bg-white/70 dark:bg-zinc-800/50 backdrop-blur-sm text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-zinc-700/40 border border-gray-200/70 dark:border-zinc-700/30 rounded-lg" 
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <svg
                className="mr-2 h-5 w-5"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              {googleLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LoginPage;
