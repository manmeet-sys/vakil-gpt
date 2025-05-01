
import React from 'react';
import BackButton from '@/components/BackButton';
import { motion } from 'framer-motion';

interface PracticeAreaHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PracticeAreaHeader: React.FC<PracticeAreaHeaderProps> = ({
  title,
  description,
  icon
}) => {
  return (
    <div className="mb-6">
      <BackButton to="/practice-areas" label="Back to Practice Areas" />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 mt-4"
      >
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default PracticeAreaHeader;
