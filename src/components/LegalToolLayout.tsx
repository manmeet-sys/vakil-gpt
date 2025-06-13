
import React, { ReactNode, useEffect } from 'react';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import designSystem from '@/lib/design-system-standards';

interface LegalToolLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  icon: ReactNode;
}

const LegalToolLayout = ({ children, title, description, icon }: LegalToolLayoutProps) => {
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
            {children}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LegalToolLayout;
