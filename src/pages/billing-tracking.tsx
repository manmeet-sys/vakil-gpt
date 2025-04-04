
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DollarSign } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import BillingTrackingTool from '@/components/BillingTrackingTool';
import BackButton from '@/components/BackButton';

const BillingTrackingPage = () => {
  return (
    <AppLayout>
      <Helmet>
        <title>Billing Tracking | VakilGPT</title>
      </Helmet>
      <div className="container mx-auto px-4 py-6">
        <BackButton />
        <div className="flex items-center mb-6">
          <DollarSign className="h-8 w-8 text-green-500 mr-3" />
          <h1 className="text-3xl font-bold">Legal Billing Tracker</h1>
        </div>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Track your billable hours, manage clients, and generate invoices with our comprehensive billing solution for legal professionals.
        </p>
        <BillingTrackingTool />
      </div>
    </AppLayout>
  );
};

export default BillingTrackingPage;
