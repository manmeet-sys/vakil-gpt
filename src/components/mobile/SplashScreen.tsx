
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-50 dark:bg-zinc-900"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center"
      >
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white flex items-center justify-center">
          VakilGPT
          <span className="text-orange-500 text-sm font-medium ml-1">IN</span>
          <Badge variant="outline" className="ml-1.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full border-blue-200 dark:border-blue-800/50">
            BETA
          </Badge>
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
          AI-Powered Legal Assistance for India
        </p>
        
        <div className="mt-6">
          <div className="inline-block w-12 h-12 relative">
            <motion.div 
              animate={{ 
                rotate: 360,
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="w-full h-full border-4 border-t-blue-500 border-r-blue-300 border-b-blue-200 border-l-blue-400 rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
