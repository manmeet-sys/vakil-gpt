
import React, { ReactNode, useEffect } from 'react';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

interface LegalToolLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  icon: ReactNode;
}

const LegalToolLayout = ({ children, title, description, icon }: LegalToolLayoutProps) => {
  const [apiProvider, setApiProvider] = React.useState<'deepseek' | 'gemini'>('gemini');

  useEffect(() => {
    // Load preferred API provider on component mount
    const provider = localStorage.getItem('preferredApiProvider') as 'deepseek' | 'gemini' || 'gemini';
    setApiProvider(provider);
    
    // Set default API keys - these will be used across the application
    localStorage.setItem('geminiApiKey', 'AIzaSyCpX8FmPojP3E4dDqsmi0EtRjDKXGh9SBc');
    localStorage.setItem('deepseekApiKey', 'sk-default-deepseek-key');
  }, []);

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
            localStorage.setItem('preferredApiProvider', value);
          }}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="gemini">Gemini AI</TabsTrigger>
              <TabsTrigger value="deepseek">DeepSeek AI</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
        
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default LegalToolLayout;
