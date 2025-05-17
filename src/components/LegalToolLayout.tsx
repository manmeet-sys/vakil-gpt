
import React, { ReactNode, useEffect } from 'react';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { configureOpenAIProvider } from '@/services/ai-provider';

interface LegalToolLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  icon: ReactNode;
}

const LegalToolLayout = ({ children, title, description, icon }: LegalToolLayoutProps) => {
  const [apiProvider, setApiProvider] = React.useState<'openai' | 'gemini' | 'deepseek'>('openai');

  useEffect(() => {
    try {
      // Load preferred API provider on component mount, defaulting to OpenAI
      const provider = localStorage.getItem('preferredApiProvider') as 'openai' | 'gemini' | 'deepseek' || 'openai';
      setApiProvider(provider);
      
      // Set default OpenAI API key if not already set
      if (!localStorage.getItem('openaiApiKey')) {
        const success = configureOpenAIProvider();
        if (success) {
          console.log('Default OpenAI API key set');
        }
      }
    } catch (error) {
      console.error('Error initializing API provider settings:', error);
      // Ensure we default to OpenAI if there's an error
      setApiProvider('openai');
    }
  }, []);

  // Update title for accessibility
  useEffect(() => {
    try {
      if (title) {
        document.title = `${title} | VakilGPT`;
      }
      return () => {
        document.title = 'VakilGPT';
      };
    } catch (error) {
      console.error('Error updating document title:', error);
    }
  }, [title]);

  const handleToggleProvider = () => {
    try {
      // Default to OpenAI, cycle through providers only if API keys are configured
      let newProvider: 'openai' | 'gemini' | 'deepseek' = 'openai';
      
      if (apiProvider === 'openai') {
        // Check if Gemini key exists before switching
        const geminiKey = localStorage.getItem('geminiApiKey');
        if (geminiKey) {
          newProvider = 'gemini';
        } else {
          toast.info('Gemini API key not configured. Using OpenAI.');
        }
      } else if (apiProvider === 'gemini') {
        // Check if DeepSeek key exists before switching
        const deepseekKey = localStorage.getItem('deepseekApiKey');
        if (deepseekKey) {
          newProvider = 'deepseek';
        } else {
          // Skip to OpenAI if DeepSeek is not configured
          newProvider = 'openai';
          toast.info('DeepSeek API key not configured. Using OpenAI.');
        }
      } else {
        newProvider = 'openai';
      }
      
      setApiProvider(newProvider);
      localStorage.setItem('preferredApiProvider', newProvider);
    } catch (error) {
      console.error('Error toggling API provider:', error);
      // Fall back to OpenAI if there's an error
      setApiProvider('openai');
      localStorage.setItem('preferredApiProvider', 'openai');
      toast.error('Error changing AI provider. Defaulting to OpenAI.');
    }
  };
  
  // Animation variants optimized for performance
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
  };
  
  const titleVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };
  
  const descriptionVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3, delay: 0.1 } },
  };

  // Get display name for current provider
  const getProviderDisplayName = () => {
    switch(apiProvider) {
      case 'openai': return 'OpenAI';
      case 'gemini': return 'Gemini AI';
      case 'deepseek': return 'DeepSeek AI';
      default: return 'OpenAI';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      {/* Skip to content link for keyboard accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      
      <main id="main-content" className="flex-1 w-full mx-auto pt-6 pb-12">
        <div className="container px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6">
            <motion.div 
              role="region" 
              aria-labelledby="page-title" 
              className="flex items-start gap-3"
              initial="initial"
              animate="animate"
              variants={pageVariants}
              style={{ willChange: 'opacity, transform' }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                {icon}
              </div>
              <div>
                <motion.h1 
                  id="page-title"
                  className="text-2xl font-playfair font-medium tracking-tight"
                  variants={titleVariants}
                >
                  {title}
                </motion.h1>
                
                {description && (
                  <motion.p 
                    className="text-base text-muted-foreground max-w-3xl"
                    variants={descriptionVariants}
                  >
                    {description}
                  </motion.p>
                )}
              </div>
            </motion.div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Settings2 className="h-4 w-4" />
                  <span className="sr-md:hidden">Settings</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">AI Provider Settings</h4>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="api-toggle" className="text-sm font-medium cursor-pointer">
                      {getProviderDisplayName()}
                    </Label>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleToggleProvider}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <motion.div 
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >            
            {children}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LegalToolLayout;
