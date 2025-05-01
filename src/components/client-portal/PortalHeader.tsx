
import React from 'react';
import { Shield, Bell, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface PortalHeaderProps {
  unreadUpdates: number;
  loading: boolean;
  onRefresh: () => void;
  onUpload: () => void;
}

const PortalHeader = ({ unreadUpdates, loading, onRefresh, onUpload }: PortalHeaderProps) => {
  return (
    <motion.div 
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Shield className="h-6 w-6 text-indigo-500" />
          Advocate Portal
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Collaborate with other advocates and share case insights
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onRefresh}
          disabled={loading}
          className="relative"
        >
          <Bell className="h-4 w-4 mr-2" />
          {loading ? 'Refreshing...' : 'Updates'} 
          {unreadUpdates > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
              {unreadUpdates}
            </Badge>
          )}
        </Button>
        
        <Button onClick={onUpload}>
          <File className="h-4 w-4 mr-2" />
          Share Document
        </Button>
      </div>
    </motion.div>
  );
};

export default PortalHeader;
