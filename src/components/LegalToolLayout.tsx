
import React, { ReactNode } from 'react';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface LegalToolLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  icon: ReactNode;
}

const LegalToolLayout = ({ children, title, description, icon }: LegalToolLayoutProps) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [apiProvider, setApiProvider] = useState<'deepseek' | 'gemini'>('gemini');
  const { toast } = useToast();

  useEffect(() => {
    // Load the API key on component mount
    const provider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
    setApiProvider(provider);
    loadApiKey(provider);
    
    // Set default Gemini API key if not already set
    if (!localStorage.getItem('geminiApiKey')) {
      localStorage.setItem('geminiApiKey', 'AIzaSyCpX8FmPojP3E4dDqsmi0EtRjDKXGh9SBc');
    }
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem(`${apiProvider}ApiKey`, apiKey);
    toast({
      title: "API Key Saved",
      description: `Your ${apiProvider} API key has been saved`
    });
  };

  const loadApiKey = (provider: 'deepseek' | 'gemini') => {
    const defaultKey = provider === 'gemini' ? 'AIzaSyCpX8FmPojP3E4dDqsmi0EtRjDKXGh9SBc' : '';
    const key = localStorage.getItem(`${provider}ApiKey`) || defaultKey;
    setApiKey(key);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto py-6 sm:py-10 px-4">
        <motion.div 
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Tabs defaultValue="gemini" onValueChange={(value) => {
            setApiProvider(value as 'deepseek' | 'gemini');
            loadApiKey(value as 'deepseek' | 'gemini');
          }}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="gemini">Gemini AI</TabsTrigger>
              <TabsTrigger value="deepseek">DeepSeek AI</TabsTrigger>
            </TabsList>
            <TabsContent value="gemini">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Google Gemini API</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Configure your Gemini AI API integration for this tool.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="gemini-api-key" className="text-sm">Gemini API Key</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="gemini-api-key"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Gemini API key"
                        className="text-sm"
                      />
                      <Button onClick={handleSaveApiKey} className="sm:w-auto w-full mt-1 sm:mt-0">Save</Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Your API key is stored locally in your browser.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="deepseek">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">DeepSeek API</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Configure your DeepSeek AI API integration for this tool.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="deepseek-api-key" className="text-sm">DeepSeek API Key</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        id="deepseek-api-key"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your DeepSeek API key"
                        className="text-sm"
                      />
                      <Button onClick={handleSaveApiKey} className="sm:w-auto w-full mt-1 sm:mt-0">Save</Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Your API key is stored locally in your browser.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default LegalToolLayout;
