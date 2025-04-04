
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const resetSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ResetFormData = z.infer<typeof resetSchema>;

const ResetPasswordPage = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetFormData) => {
    const { error } = await resetPassword(data.email);
    
    if (error) {
      toast.error('Error resetting password', {
        description: error.message,
      });
    } else {
      toast.success('Password reset email sent', {
        description: 'Please check your email for a link to reset your password',
      });
      navigate('/login');
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto max-w-md px-4 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reset password</h1>
            <p className="text-gray-500 dark:text-gray-300 mt-2">
              Enter your email address to receive a password reset link
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          className="pl-10 text-gray-800 dark:text-gray-100"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Send Reset Link
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ResetPasswordPage;
