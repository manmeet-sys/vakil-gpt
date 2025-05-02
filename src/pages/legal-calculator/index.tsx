
import React from 'react';
import { Helmet } from 'react-helmet-async';
import OptimizedAppLayout from '@/components/OptimizedAppLayout';
import { Calculator, Scale } from 'lucide-react';
import LegalCalculator from '@/components/LegalCalculator';
import { ResponsiveContainer } from '@/components/ui/responsive-container';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

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
        >
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-full shadow-sm">
                <Calculator className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold font-playfair">Legal Calculator</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
              Calculate court fees, legal interest, and other financial aspects of your legal cases with precision.
              Our enhanced calculators help you estimate costs accurately based on Indian legal fee structures with 
              state-specific calculations.
            </p>
          </div>
          
          <Separator className="mb-8" />
          
          <LegalCalculator />
          
          <div className="mt-10 pt-5 border-t border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-3">How To Use</h2>
            <div className="bg-muted/30 rounded-lg p-5 text-muted-foreground space-y-4 border border-muted/50">
              <p>1. Select the calculator type (Court Fees or Interest Calculation)</p>
              <p>2. For court fees, select your state, court type, and claim type</p>
              <p>3. Enter the required values in the input fields</p>
              <p>4. Click "Calculate" to see your result</p>
              <p>5. View the detailed breakdown of your calculation</p>
              <p>6. Copy the results for your reference</p>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Disclaimer: The calculations provided by these tools are estimates based on standard rates and formulas.
              Actual amounts may vary depending on jurisdiction, specific court rules, or other factors.
              Always consult with a legal professional for definitive calculations.
            </p>
          </div>
        </motion.div>
      </ResponsiveContainer>
    </OptimizedAppLayout>
  );
};

export default LegalCalculatorPage;
