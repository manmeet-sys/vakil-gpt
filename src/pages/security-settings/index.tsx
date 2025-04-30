
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Key, Smartphone, AlertCircle, Check, Loader2, Download, QrCode, Copy, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SecuritySettingsPage = () => {
  const { user, userProfile, twoFactorEnabled, enableTwoFactor, disableTwoFactor, verifyTwoFactor } = useAuth();
  const navigate = useNavigate();
  
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showEncryptionKey, setShowEncryptionKey] = useState(false);
  const [dummyEncryptionKey, setDummyEncryptionKey] = useState(""); // For demonstration only
  
  useEffect(() => {
    // Generate a dummy encryption key for demonstration
    if (!dummyEncryptionKey) {
      const key = Array(32).fill(0).map(() => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      setDummyEncryptionKey(key);
    }
  }, []);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/security-settings' } });
    }
  }, [user, navigate]);

  const handleEnable2FA = async () => {
    setIsEnabling2FA(true);
    try {
      const secret = await enableTwoFactor();
      if (secret) {
        setTwoFactorSecret(secret);
        toast.info('Please verify the setup with your authenticator app');
      } else {
        toast.error('Failed to enable two-factor authentication');
      }
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast.error('An error occurred while enabling 2FA');
    } finally {
      setIsEnabling2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    setIsDisabling2FA(true);
    try {
      const success = await disableTwoFactor();
      if (success) {
        toast.success('Two-factor authentication has been disabled');
        setTwoFactorSecret(null);
      } else {
        toast.error('Failed to disable two-factor authentication');
      }
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast.error('An error occurred while disabling 2FA');
    } finally {
      setIsDisabling2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    
    setIsVerifying(true);
    try {
      const success = await verifyTwoFactor(verificationCode);
      if (success) {
        toast.success('Two-factor authentication has been enabled');
        setTwoFactorSecret(null); // Clear the secret after verification
      } else {
        toast.error('Invalid verification code');
      }
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      toast.error('An error occurred during verification');
    } finally {
      setIsVerifying(false);
    }
  };
  
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(message))
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Security Settings | VakilGPT</title>
      </Helmet>
      
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold">Security Settings</h1>
          </div>
          
          <Tabs defaultValue="2fa" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="2fa" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>Two-Factor Authentication</span>
              </TabsTrigger>
              <TabsTrigger value="encryption" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span>Encryption</span>
              </TabsTrigger>
            </TabsList>
            
            {/* 2FA Tab */}
            <TabsContent value="2fa" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smartphone className="h-5 w-5 mr-2 text-blue-500" />
                    Two-Factor Authentication
                  </CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account by requiring a verification code.
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {twoFactorSecret ? (
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-medium text-lg mb-2">Setup Instructions</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <li>Install an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy on your phone.</li>
                          <li>Scan the QR code below or manually enter the secret key into your app.</li>
                          <li>Enter the 6-digit verification code generated by your app to complete setup.</li>
                        </ol>
                      </div>
                      
                      <div className="flex flex-col items-center space-y-4">
                        <div className="bg-white p-4 rounded-lg w-48 h-48 flex items-center justify-center">
                          {/* This would be a QR code in a real app */}
                          <QrCode className="h-32 w-32 text-gray-800" />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded font-mono text-sm">
                            {twoFactorSecret}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(twoFactorSecret, 'Secret key copied to clipboard')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="font-medium">Verify Setup</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enter the 6-digit verification code from your authenticator app
                        </p>
                        
                        <div className="flex justify-center py-2">
                          <InputOTP
                            maxLength={6}
                            value={verificationCode}
                            onChange={(value) => setVerificationCode(value)}
                            render={({ slots }) => (
                              <InputOTPGroup className="gap-2">
                                {slots.map((slot, index) => (
                                  <InputOTPSlot key={index} index={index} className="w-10 h-12" />
                                ))}
                              </InputOTPGroup>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {twoFactorEnabled 
                              ? "Your account is protected with two-factor authentication" 
                              : "Enable two-factor authentication for additional security"}
                          </p>
                        </div>
                        <Switch 
                          checked={twoFactorEnabled} 
                          onCheckedChange={twoFactorEnabled ? handleDisable2FA : handleEnable2FA}
                          disabled={isEnabling2FA || isDisabling2FA}
                        />
                      </div>
                      
                      <div className={`bg-${twoFactorEnabled ? 'green' : 'amber'}-50 dark:bg-${twoFactorEnabled ? 'green' : 'amber'}-900/20 p-4 rounded-lg flex items-start space-x-3`}>
                        {twoFactorEnabled ? (
                          <Check className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400 mt-0.5" />
                        )}
                        <div>
                          <h4 className={`font-medium text-${twoFactorEnabled ? 'green' : 'amber'}-700 dark:text-${twoFactorEnabled ? 'green' : 'amber'}-300`}>
                            {twoFactorEnabled ? 'Your account is secure' : 'Increase your account security'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {twoFactorEnabled 
                              ? 'Two-factor authentication is currently enabled on your account.' 
                              : 'We strongly recommend enabling two-factor authentication for added security.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  {twoFactorSecret ? (
                    <>
                      <Button variant="outline" onClick={() => setTwoFactorSecret(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleVerify2FA} disabled={verificationCode.length !== 6 || isVerifying}>
                        {isVerifying ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          'Verify and Enable'
                        )}
                      </Button>
                    </>
                  ) : twoFactorEnabled ? (
                    <Button 
                      variant="destructive"
                      onClick={handleDisable2FA}
                      disabled={isDisabling2FA}
                    >
                      {isDisabling2FA ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Disabling...
                        </>
                      ) : (
                        'Disable Two-Factor Authentication'
                      )}
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleEnable2FA}
                      disabled={isEnabling2FA}
                    >
                      {isEnabling2FA ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enabling...
                        </>
                      ) : (
                        'Enable Two-Factor Authentication'
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Encryption Tab */}
            <TabsContent value="encryption" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="h-5 w-5 mr-2 text-blue-500" />
                    End-to-End Encryption
                  </CardTitle>
                  <CardDescription>
                    Manage your encryption keys and secure sensitive data
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium text-lg">About End-to-End Encryption</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      End-to-end encryption ensures that your sensitive data is encrypted on your device before being sent to our servers. 
                      This means that only you can access your data in its unencrypted form.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Your Encryption Key</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      This is your personal encryption key. Keep it safe and secure.
                    </p>
                    
                    <div className="relative">
                      <Input
                        type={showEncryptionKey ? "text" : "password"}
                        readOnly
                        value={dummyEncryptionKey}
                        className="pr-10 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEncryptionKey(!showEncryptionKey)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                      >
                        {showEncryptionKey ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(dummyEncryptionKey, 'Encryption key copied to clipboard')}
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Key
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Download Backup
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-700 dark:text-amber-300">
                        Important Security Information
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        If you lose your encryption key, you will lose access to all encrypted data. 
                        We recommend saving a backup of your key in a secure location, such as a password manager.
                      </p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Regenerate Encryption Key
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default SecuritySettingsPage;
