
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDevice } from '@/hooks/use-device';

const NetworkStatus: React.FC = () => {
  const { isOnline } = useDevice();
  
  return (
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
  );
};

export default NetworkStatus;
