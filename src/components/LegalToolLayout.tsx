
import React, { ReactNode, useEffect } from 'react';
import Footer from '@/components/Footer';
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
    const geminiKey = 'AIzaSyCpX8FmPojP3E4dDqsmi0EtRjDKXGh9SBc';
    const deepseekKey = 'sk-default-deepseek-key';
    
    localStorage.setItem('geminiApiKey', geminiKey);
    localStorage.setItem('deepseekApiKey', deepseekKey);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 w-full mx-auto pt-6 pb-12">
        <div className="container px-4 sm:px-6">
          <motion.div 
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Tabs 
              defaultValue={apiProvider} 
              onValueChange={(value) => {
                setApiProvider(value as 'deepseek' | 'gemini');
                localStorage.setItem('preferredApiProvider', value);
              }}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
                <TabsTrigger value="gemini" className="px-4 py-2 text-sm font-medium">Gemini AI</TabsTrigger>
                <TabsTrigger value="deepseek" className="px-4 py-2 text-sm font-medium">DeepSeek AI</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
          
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LegalToolLayout;
