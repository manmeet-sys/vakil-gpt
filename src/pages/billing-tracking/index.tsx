
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { IndianRupee } from 'lucide-react';
import BillingTrackingTool from '@/components/BillingTrackingTool';

const BillingTrackingPage = () => {
  return (
    <LegalToolLayout
      title="Indian Legal Billing & Time Tracking"
      description="Comprehensive solution for Indian advocates and law firms to track billable hours, manage clients, and generate GST-compliant invoices."
      icon={<IndianRupee className="w-6 h-6 text-blue-600" />}
    >
      <BillingTrackingTool />
    </LegalToolLayout>
  );
};

export default BillingTrackingPage;
