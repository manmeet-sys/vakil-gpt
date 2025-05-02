
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield, FileText, PieChart, AlertCircle } from 'lucide-react';
import FraudDetectorTool from '@/components/FraudDetectorTool';
import BackToToolsButton from '@/components/practice-areas/BackToToolsButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const FraudDetectorPage = () => {
  return (
    <LegalToolLayout
      title="Indian Financial Fraud Detector"
      description="Identifies potentially fraudulent financial activities using AI pattern recognition tailored to Indian regulatory requirements."
      icon={<Shield className="w-6 h-6 text-blue-600" />}
    >
      <BackToToolsButton className="mb-6" />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="border border-red-100 dark:border-red-900/20">
          <CardHeader className="bg-gradient-to-r from-red-50 to-transparent dark:from-red-900/20 dark:to-transparent pb-3">
            <CardTitle className="text-lg font-playfair flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>Fraud Detection</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <p className="text-sm">
              AI-powered analysis of financial transactions to identify patterns indicative of fraud under Indian regulatory guidelines.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-blue-100 dark:border-blue-900/20">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent pb-3">
            <CardTitle className="text-lg font-playfair flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span>Legal Compliance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <p className="text-sm">
              Analysis based on PMLA 2002, RBI guidelines, SEBI regulations, and other Indian financial regulatory frameworks.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-purple-100 dark:border-purple-900/20">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent pb-3">
            <CardTitle className="text-lg font-playfair flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              <span>Risk Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1">
            <p className="text-sm">
              Quantitative risk scoring based on transaction patterns with recommendations aligned to Indian law.
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      <div className="mb-8 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/20 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium font-playfair text-amber-800 dark:text-amber-400 mb-2">Indian Regulatory Framework</h3>
            <p className="text-sm text-amber-700 dark:text-amber-500">
              This tool incorporates analysis based on key Indian financial regulatory frameworks including:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-500 ml-4">
              <li>Prevention of Money Laundering Act (PMLA), 2002</li>
              <li>RBI KYC Guidelines & Master Directions</li>
              <li>SEBI's Prohibition of Fraudulent and Unfair Trade Practices (PFUTP) Regulations</li>
              <li>Companies Act, 2013 provisions on fraud</li>
              <li>Benami Transactions (Prohibition) Act, 1988</li>
              <li>Foreign Exchange Management Act (FEMA), 1999</li>
            </ul>
          </div>
        </div>
      </div>
      
      <FraudDetectorTool />
    </LegalToolLayout>
  );
};

export default FraudDetectorPage;
