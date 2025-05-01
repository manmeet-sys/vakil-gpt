
import React, { ReactNode, useEffect } from 'react';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import designSystem from '@/lib/design-system-standards';

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
    
    // Set default API keys if not already set
    if (!localStorage.getItem('geminiApiKey')) {
      localStorage.setItem('geminiApiKey', '');
    }
    
    if (!localStorage.getItem('deepseekApiKey')) {
      localStorage.setItem('deepseekApiKey', '');
    }
  }, []);

  // Update title for accessibility
  useEffect(() => {
    if (title) {
      document.title = `${title} | VakilGPT`;
    }
    return () => {
      document.title = 'VakilGPT';
    };
  }, [title]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Skip to content link for keyboard accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      
      <main id="main-content" className="flex-1 w-full mx-auto pt-6 pb-12">
        <div className="container px-4 sm:px-6">
          <div role="region" aria-labelledby="page-title" className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                {icon}
              </div>
              <motion.h1 
                id="page-title"
                className={designSystem.apply.heading(1)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {title}
              </motion.h1>
            </div>
            
            {description && (
              <motion.p 
                className={designSystem.typography.body.large}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {description}
              </motion.p>
            )}
          </div>
          
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
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6" aria-label="AI Model Selection">
                <TabsTrigger value="gemini" className="px-4 py-2 text-sm font-medium">Gemini AI</TabsTrigger>
                <TabsTrigger value="deepseek" className="px-4 py-2 text-sm font-medium">DeepSeek AI</TabsTrigger>
              </TabsList>
              
              <TabsContent value="gemini" className="mt-2">
                {apiProvider === 'gemini' && children}
              </TabsContent>
              
              <TabsContent value="deepseek" className="mt-2">
                {apiProvider === 'deepseek' && children}
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LegalToolLayout;
