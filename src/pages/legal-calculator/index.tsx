
import React from 'react';
import { Helmet } from 'react-helmet-async';
import OptimizedAppLayout from '@/components/OptimizedAppLayout';
import { Calculator } from 'lucide-react';
import LegalCalculator from '@/components/LegalCalculator';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { motion } from 'framer-motion';

const LegalCalculatorPage: React.FC = () => {
  return (
    <OptimizedAppLayout>
      <Helmet>
        <title>Legal Calculator | VakilGPT</title>
        <meta name="description" content="Calculate court fees, interest, and more with our specialized legal calculator for Indian legal proceedings" />
      </Helmet>

      <ResponsiveContainer className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <Calculator className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold">Legal Calculator</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Calculate court fees, legal interest, and other financial aspects of your legal cases with precision.
            </p>
          </div>
          
          <LegalCalculator />
        </motion.div>
      </ResponsiveContainer>
    </OptimizedAppLayout>
  );
};

export default LegalCalculatorPage;
