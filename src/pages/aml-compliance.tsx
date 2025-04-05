
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import AMLComplianceTool from '@/components/AMLComplianceTool';
import BackButton from '@/components/BackButton';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const AMLCompliancePage = () => {
  const location = useLocation();
  
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
    }
  }, [location]);

  return (
    <AppLayout>
      <Helmet>
        <title>AML Compliance | VakilGPT</title>
      </Helmet>
      <div className="container mx-auto px-4 py-6">
        <BackButton />
        
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-2 text-center">AML Compliance Analysis</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-center mb-8">
            Analyze Anti-Money Laundering compliance risks and receive recommendations based on your business type and jurisdiction.
          </p>
          
          <div className="w-full max-w-4xl">
            <AMLComplianceTool />
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default AMLCompliancePage;
