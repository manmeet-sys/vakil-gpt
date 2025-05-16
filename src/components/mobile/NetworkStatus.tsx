
import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDevice } from '@/hooks/use-device';
import { toast } from 'sonner';

const NetworkStatus: React.FC = () => {
  const { isOnline } = useDevice();
  const [wasOffline, setWasOffline] = useState(false);
  
  // Track network status changes to show reconnection toast
  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      // Show reconnection toast
      toast.success('You\'re back online', {
        description: 'Your network connection has been restored'
      });
      setWasOffline(false);
    }
  }, [isOnline, wasOffline]);

  // Handle retrying API calls when connection is restored
  useEffect(() => {
    if (isOnline && wasOffline) {
      // We could trigger retrying of failed API calls here
      // For example, by dispatching a retry action or checking localStorage for failed requests
    }
  }, [isOnline, wasOffline]);
  
  return (
    <>
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 inset-x-0 z-40 flex items-center justify-center"
          >
            <div className="bg-red-500/95 text-white px-4 py-2 rounded-full shadow-lg flex items-center text-sm">
              <WifiOff className="h-3.5 w-3.5 mr-2" />
              You're offline. Some features may be limited.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Optional - Small indicator in corner when online for debug purposes */}
      {/*
      <AnimatePresence>
        {isOnline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-20 right-4 z-40 flex items-center"
          >
            <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded-full flex items-center text-xs border border-green-200 dark:border-green-800">
              <Wifi className="h-3 w-3 mr-1" />
              Online
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      */}
    </>
  );
};

export default NetworkStatus;
