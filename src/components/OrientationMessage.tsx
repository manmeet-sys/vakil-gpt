
import React, { useState, useEffect } from 'react';
import { RotateCcw, Smartphone, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatePresence, motion } from 'framer-motion';

const OrientationMessage: React.FC = () => {
  const isMobile = useIsMobile();
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);
  
  // Check if the user has previously dismissed the message
  useEffect(() => {
    const hasSeenMessage = localStorage.getItem('orientation-message-seen');
    if (hasSeenMessage) {
      setDismissed(true);
    }
  }, []);
  
  // Monitor device orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    // Initial check
    checkOrientation();
    
    // Set up event listener
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);
  
  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('orientation-message-seen', 'true');
  };
  
  if (!isMobile || !isPortrait || dismissed) {
    return null;
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 left-4 right-4 z-50"
      >
        <div className="bg-white dark:bg-legal-slate/90 border border-legal-border dark:border-legal-slate/30 rounded-lg shadow-lg p-4 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="mr-3 bg-legal-accent/10 p-2 rounded-full">
                <Smartphone className="h-5 w-5 text-legal-accent" />
              </div>
              <div>
                <h3 className="font-medium text-legal-slate dark:text-white text-sm">Rotate for Better Experience</h3>
                <p className="text-xs text-legal-muted dark:text-gray-300 mt-1">
                  For the best experience with our legal AI, try rotating your device to landscape mode 🔄
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </button>
          </div>
          
          <div className="mt-3 flex items-center justify-center">
            <motion.div
              animate={{ rotate: [0, -90] }}
              transition={{ 
                repeat: Infinity, 
                repeatType: "reverse", 
                duration: 1.5,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="w-12 h-20 rounded-xl border-2 border-legal-accent/60 relative overflow-hidden flex items-center justify-center">
                <div className="w-8 h-14 bg-legal-accent/20 rounded-md"></div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-legal-accent/60 rounded-full"></div>
              </div>
              <RotateCcw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-legal-accent/40" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrientationMessage;
