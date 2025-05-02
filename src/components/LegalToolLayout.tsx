
import React, { ReactNode, useEffect } from 'react';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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

  const handleToggleProvider = () => {
    const newProvider = apiProvider === 'gemini' ? 'deepseek' : 'gemini';
    setApiProvider(newProvider);
    localStorage.setItem('preferredApiProvider', newProvider);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
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
                className="text-2xl font-playfair font-medium tracking-tight"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {title}
              </motion.h1>
            </div>
            
            {description && (
              <motion.p 
                className="text-base text-muted-foreground max-w-3xl"
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
            <div className="w-full max-w-md mx-auto flex items-center justify-end mb-6">
              <div className="flex items-center space-x-2">
                <Label htmlFor="api-toggle" className="text-sm font-medium">
                  {apiProvider === 'gemini' ? 'Using Gemini AI' : 'Using DeepSeek AI'}
                </Label>
                <Switch 
                  id="api-toggle" 
                  checked={apiProvider === 'deepseek'}
                  onCheckedChange={handleToggleProvider}
                />
              </div>
            </div>
            
            {children}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LegalToolLayout;
