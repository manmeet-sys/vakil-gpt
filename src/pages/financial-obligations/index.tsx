
import React from 'react';
import { IndianRupee } from 'lucide-react';
import FinancialObligationsTool from '@/components/FinancialObligationsTool';
import BackButton from '@/components/BackButton';
import { motion } from 'framer-motion';

const FinancialObligationsPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <BackButton />
      
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
            <IndianRupee className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-center">Indian Financial Obligations Monitor</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-center mb-8">
          Track financial clauses in agreements including loans, royalties, GST payments, and TDS liabilities with automatic alerts.
        </p>
        
        <div className="w-full max-w-4xl">
          <FinancialObligationsTool />
        </div>
      </motion.div>
    </div>
  );
};

export default FinancialObligationsPage;
