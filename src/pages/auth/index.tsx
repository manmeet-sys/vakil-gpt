
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  User, KeyRound, Mail, Eye, EyeOff, UserPlus, ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/AppLayout';

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user info in localStorage for demo
      if (authMode === 'register') {
        localStorage.setItem('user', JSON.stringify({
          id: `user-${Date.now()}`,
          name,
          email,
          role: 'lawyer'
        }));
        toast({
          title: "Account created",
          description: "Welcome to VakilGPT! Your account has been created successfully.",
        });
      } else {
        // For demo, just create a user if logging in
        localStorage.setItem('user', JSON.stringify({
          id: `user-${Date.now()}`,
          name: 'Demo User',
          email,
          role: 'lawyer'
        }));
        toast({
          title: "Logged in",
          description: "Welcome back to VakilGPT!",
        });
      }
      
      // Redirect to profile page
      navigate('/profile');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <Helmet>
        <title>{authMode === 'login' ? 'Login' : 'Register'} | VakilGPT</title>
      </Helmet>
      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <User className="h-8 w-8 text-blue-600 dark:text-blue-300" />
          </div>
          <h1 className="text-2xl font-bold">VakilGPT Legal Portal</h1>
          <p className="text-gray-600 dark:text-gray-400">Access your legal tools and services</p>
        </div>
        
        <Card>
          <CardHeader>
            <Tabs defaultValue="login" onValueChange={(value) => setAuthMode(value as 'login' | 'register')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'register' && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  "Processing..."
                ) : authMode === 'login' ? (
                  <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>
                ) : (
                  <>Create Account <UserPlus className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-600 dark:text-gray-400">
            {authMode === 'login' ? (
              <p>For demo purposes, any email/password will work</p>
            ) : (
              <p>No verification required for this demo</p>
            )}
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AuthPage;
