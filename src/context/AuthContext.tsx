
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BillingProvider } from './BillingContext';

// Define the UserProfile interface
interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  bar_number: string | null;
  enrollment_date: string | null;
  jurisdiction: string | null;
}

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, meta?: { full_name?: string }) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ 
    error: Error | null;
    data: any;
  }>;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserProfile(data as UserProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Function to refresh profile data
  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession?.user);
        
        // Fetch user profile if user is authenticated
        if (currentSession?.user) {
          // Use setTimeout to prevent potential deadlocks
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        if (event === 'SIGNED_IN') {
          const provider = currentSession?.user?.app_metadata?.provider;
          if (provider === 'google') {
            toast.success('Successfully signed in with Google');
          } else {
            toast.success('Successfully signed in');
          }
        }
        if (event === 'SIGNED_OUT') {
          toast.info('Successfully signed out');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession?.user);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, meta?: { full_name?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: meta,
          // Skip email verification by auto-signing in
          emailRedirectTo: undefined
        }
      });
      
      if (!error) {
        // Auto-sign in after signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          console.error('Error auto-signing in after signup:', signInError);
        }
      }
      
      return { data, error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { data: null, error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { data, error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      // Clear local state first to prevent UI from showing logged-in state after logout
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error from Supabase during sign out:', error);
        throw error;
      }
      
      toast.success('Successfully signed out');
      
      // Force page refresh to clear any cached state
      // This is commented out for now, but can be uncommented if needed
      // window.location.href = '/';
      
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out. Please try again.');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      return { data, error };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { data: null, error: error as Error };
    }
  };

  const contextValue = {
    session,
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isAuthenticated,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <BillingProvider>
        {children}
      </BillingProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
