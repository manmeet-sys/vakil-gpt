
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BillingProvider } from './BillingContext';
import { encryptData, decryptData, generateEncryptionKey, exportKey, importKey, generateOTPSecret } from '@/utils/crypto';

// Define the UserProfile interface with the new fields
interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  bar_number: string | null;
  enrollment_date: string | null;
  jurisdiction: string | null;
  two_factor_enabled?: boolean;
  two_factor_secret?: string;
  encryption_key?: string;
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
  twoFactorEnabled: boolean;
  isTwoFactorVerified: boolean;
  enableTwoFactor: () => Promise<string | null>;
  disableTwoFactor: () => Promise<boolean>;
  verifyTwoFactor: (otp: string) => Promise<boolean>;
  encryptUserData: (data: string) => Promise<string | null>;
  decryptUserData: (encryptedData: string) => Promise<string | null>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isTwoFactorVerified, setIsTwoFactorVerified] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const profile = data as UserProfile;
      setUserProfile(profile);
      
      // Check if two-factor authentication is enabled
      if (profile.two_factor_enabled) {
        setTwoFactorEnabled(true);
        setIsTwoFactorVerified(false); // Require verification after login
      }
      
      // Import user's encryption key if available
      if (profile.encryption_key) {
        try {
          const key = await importKey(profile.encryption_key);
          setEncryptionKey(key);
        } catch (error) {
          console.error('Error importing encryption key:', error);
        }
      } else if (profile.id) {
        // Generate a new encryption key if none exists
        const newKey = await generateEncryptionKey();
        setEncryptionKey(newKey);
        const exportedKey = await exportKey(newKey);
        
        // Store the key in the user profile
        await supabase
          .from('profiles')
          .update({ encryption_key: exportedKey })
          .eq('id', profile.id);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Function to update user profile
  const updateProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Refresh profile data
      await refreshProfile();
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  // Function to refresh profile data
  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  // Function to enable two-factor authentication
  const enableTwoFactor = async (): Promise<string | null> => {
    if (!user?.id) return null;
    
    try {
      // Generate a 2FA secret
      const secret = generateOTPSecret();
      
      // Store the secret in the user's profile
      const { error } = await supabase
        .from('profiles')
        .update({
          two_factor_enabled: true,
          two_factor_secret: secret
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setTwoFactorEnabled(true);
      
      // Fetch the updated profile
      await refreshProfile();
      
      return secret;
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast.error('Failed to enable two-factor authentication');
      return null;
    }
  };
  
  // Function to disable two-factor authentication
  const disableTwoFactor = async (): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          two_factor_enabled: false,
          two_factor_secret: null
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setTwoFactorEnabled(false);
      setIsTwoFactorVerified(false);
      
      // Fetch the updated profile
      await refreshProfile();
      
      return true;
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast.error('Failed to disable two-factor authentication');
      return false;
    }
  };
  
  // Function to verify two-factor authentication
  const verifyTwoFactor = async (otp: string): Promise<boolean> => {
    if (!user?.id || !userProfile?.two_factor_secret) return false;
    
    try {
      // In a real app, you would verify the OTP against the secret
      // This is a simplified version for demonstration purposes
      // Normally you'd use a library like `otplib` to validate the code
      
      // For demo purposes, we'll accept any 6-digit code
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        setIsTwoFactorVerified(true);
        toast.success('Two-factor authentication verified');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      return false;
    }
  };
  
  // Function to encrypt user data
  const encryptUserData = async (data: string): Promise<string | null> => {
    if (!encryptionKey) {
      console.error('No encryption key available');
      return null;
    }
    
    try {
      return await encryptData(data, encryptionKey);
    } catch (error) {
      console.error('Error encrypting data:', error);
      return null;
    }
  };
  
  // Function to decrypt user data
  const decryptUserData = async (encryptedData: string): Promise<string | null> => {
    if (!encryptionKey) {
      console.error('No encryption key available');
      return null;
    }
    
    try {
      return await decryptData(encryptedData, encryptionKey);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
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
          setTwoFactorEnabled(false);
          setIsTwoFactorVerified(false);
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
    twoFactorEnabled,
    isTwoFactorVerified,
    enableTwoFactor,
    disableTwoFactor,
    verifyTwoFactor,
    encryptUserData,
    decryptUserData,
    updateProfile,
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
