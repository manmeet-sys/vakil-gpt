
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield, BookOpen, AlertTriangle } from 'lucide-react';
import AMLComplianceTool from '@/components/AMLComplianceTool';
import BackToToolsButton from '@/components/practice-areas/BackToToolsButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const AMLCompliancePage = () => {
  return (
    <LegalToolLayout
      title="AML & KYC Compliance Checker"
      description="Ensure businesses meet anti-money laundering and Know Your Customer requirements with comprehensive automated checks."
      icon={<Shield className="h-6 w-6 text-blue-600" />}
    >
      <BackToToolsButton className="mb-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <AMLComplianceTool />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Card className="overflow-hidden border-blue-100 dark:border-blue-900/20">
              <CardHeader className="bg-blue-50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/20">
                <div className="flex items-center gap-3">
                  <div className="bg-white dark:bg-blue-900/30 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg font-medium">Why AML Matters</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Avoid legal penalties under PMLA 2002</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Protect your business reputation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Comply with RBI & SEBI requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Safeguard against financial crime</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Meet international standards (FATF)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Card className="overflow-hidden border-amber-100 dark:border-amber-900/20">
              <CardHeader className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-100 dark:border-amber-900/20">
                <div className="flex items-center gap-3">
                  <div className="bg-white dark:bg-amber-900/30 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <CardTitle className="text-lg font-medium">Risk Areas</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Shell companies and complex structures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Politically exposed persons (PEPs)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>High-risk jurisdictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Cash-intensive businesses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>Crypto assets and digital payments</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </LegalToolLayout>
  );
};

export default AMLCompliancePage;
