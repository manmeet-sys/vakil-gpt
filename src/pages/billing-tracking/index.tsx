
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Clock } from 'lucide-react';
import BillingTrackingTool from '@/components/BillingTrackingTool';

const BillingTrackingPage = () => {
  return (
    <LegalToolLayout
      title="Billing & Time Tracking"
      description="Track billable hours, manage clients, and generate invoices with our comprehensive legal billing solution."
      icon={<Clock className="w-6 h-6 text-blue-600" />}
    >
      <BillingTrackingTool />
    </LegalToolLayout>
  );
};

export default BillingTrackingPage;
