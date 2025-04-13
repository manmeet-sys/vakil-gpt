
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, ArrowLeft, BookOpen, Shield } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import AMLComplianceTool from '@/components/AMLComplianceTool';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AMLCompliancePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle scroll position restoration
  useEffect(() => {
    // Store current scroll position when navigating away
    return () => {
      sessionStorage.setItem('scroll_/tools', window.scrollY.toString());
    };
  }, []);
  
  // Restore scroll position if available
  useEffect(() => {
    if (location.state && location.state.scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(location.state.scrollPosition));
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleBack = () => {
    navigate('/tools', { 
      state: { 
        fromTool: true,
        scrollPosition: sessionStorage.getItem('scroll_/tools') 
      } 
    });
  };

  return (
    <AppLayout>
      <Helmet>
        <title>AML Compliance | VakilGPT</title>
      </Helmet>
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          className="mb-6 gap-2 hover:bg-legal-accent/5 text-legal-muted dark:text-gray-400"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Button>
        
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-6 rounded-xl border border-amber-100 dark:border-amber-900/20 shadow-sm">
            <div className="flex items-center justify-center bg-white dark:bg-amber-900/30 p-4 rounded-full shadow-sm">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-2">AML Compliance Analysis</h1>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
                Analyze Anti-Money Laundering compliance risks and receive recommendations based on your business type and jurisdiction. Our tool is tailored to Indian regulatory requirements under the Prevention of Money Laundering Act (PMLA).
              </p>
            </div>
          </div>
          
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
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/20 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white dark:bg-blue-900/30 p-2 rounded-full">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg">Why AML Matters</h3>
                  </div>
                  
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
                  </ul>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <div className="bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-100 dark:border-green-900/20 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white dark:bg-green-900/30 p-2 rounded-full">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-bold text-lg">Key AML Requirements</h3>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Customer Due Diligence (CDD)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Ongoing Transaction Monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Suspicious Transaction Reporting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Record Keeping (minimum 5 years)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>Staff Training & Awareness</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default AMLCompliancePage;
