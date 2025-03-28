
import React, { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
      <Header />
      
      <main className="flex-1 container mx-auto py-10 px-4">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
              {icon}
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{description}</p>
        </div>
        
        <div className="mb-8">
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
                <CardHeader>
                  <CardTitle>Google Gemini API</CardTitle>
                  <CardDescription>
                    Configure your Gemini AI API integration for this tool.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="gemini-api-key">Gemini API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="gemini-api-key"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Gemini API key"
                      />
                      <Button onClick={handleSaveApiKey}>Save</Button>
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
                <CardHeader>
                  <CardTitle>DeepSeek API</CardTitle>
                  <CardDescription>
                    Configure your DeepSeek AI API integration for this tool.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="deepseek-api-key">DeepSeek API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="deepseek-api-key"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your DeepSeek API key"
                      />
                      <Button onClick={handleSaveApiKey}>Save</Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Your API key is stored locally in your browser.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default LegalToolLayout;

