
import React from 'react';
import { IndianRupee } from 'lucide-react';
import FinancialObligationsTool from '@/components/FinancialObligationsTool';
import BackButton from '@/components/BackButton';
import { motion } from 'framer-motion';
import LegalToolLayout from '@/components/LegalToolLayout';

const FinancialObligationsPage = () => {
  return (
    <LegalToolLayout
      title="Indian Financial Obligations Monitor"
      description="Track financial clauses in agreements including loans, royalties, GST payments, and TDS liabilities with automatic alerts."
      icon={<IndianRupee className="w-6 h-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full max-w-4xl">
          <FinancialObligationsTool />
        </div>
      </motion.div>
    </LegalToolLayout>
  );
};

export default FinancialObligationsPage;
