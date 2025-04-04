
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import AMLComplianceTool from '@/components/AMLComplianceTool';
import BackButton from '@/components/BackButton';

const AMLCompliancePage = () => {
  return (
    <AppLayout>
      <Helmet>
        <title>AML Compliance | VakilGPT</title>
      </Helmet>
      <div className="container mx-auto px-4 py-6">
        <BackButton />
        <div className="flex items-center mb-6">
          <AlertTriangle className="h-8 w-8 text-amber-500 mr-3" />
          <h1 className="text-3xl font-bold">AML Compliance Analysis</h1>
        </div>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Analyze Anti-Money Laundering compliance risks and receive recommendations based on your business type and jurisdiction.
        </p>
        <AMLComplianceTool />
      </div>
    </AppLayout>
  );
};

export default AMLCompliancePage;
