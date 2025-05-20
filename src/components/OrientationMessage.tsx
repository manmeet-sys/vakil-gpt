
import React, { useState, useEffect } from 'react';
import { RotateCcw, Smartphone, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatePresence, motion } from 'framer-motion';
import { DeviceService } from '@/services/device';
import { useDevice } from '@/hooks/use-device';

const OrientationMessage: React.FC = () => {
  const isMobile = useIsMobile();
  const { platform } = useDevice();
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
    // If it's running in a native app, don't show this message
    if (platform === 'android' || platform === 'ios') {
      setDismissed(true);
      return;
    }
    
    const checkOrientation = () => {
      if (window.matchMedia) {
        const portrait = window.matchMedia("(orientation: portrait)").matches;
        setIsPortrait(portrait);
      } else {
        // Fallback for browsers that don't support matchMedia
        setIsPortrait(window.innerHeight > window.innerWidth);
      }
    };
    
    // Initial check
    checkOrientation();
    
    // Set up event listeners
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, [platform]);
  
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
        <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/30 rounded-lg shadow-lg p-4 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="mr-3 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full">
                <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800 dark:text-white text-sm">Rotate for Better Experience</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
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
              <div className="w-12 h-20 rounded-xl border-2 border-blue-400/60 dark:border-blue-500/60 relative overflow-hidden flex items-center justify-center">
                <div className="w-8 h-14 bg-blue-100/40 dark:bg-blue-800/20 rounded-md"></div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-blue-400/60 dark:bg-blue-500/60 rounded-full"></div>
              </div>
              <RotateCcw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-blue-400/40 dark:text-blue-500/40" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrientationMessage;
