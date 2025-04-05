
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { IndianRupee } from 'lucide-react';
import FinancialObligationsTool from '@/components/FinancialObligationsTool';

const FinancialObligationsPage = () => {
  return (
    <LegalToolLayout
      title="Indian Financial Obligations Monitor"
      description="Track financial clauses in agreements including loans, royalties, GST payments, and TDS liabilities with automatic alerts."
      icon={<IndianRupee className="w-6 h-6 text-blue-600" />}
    >
      <FinancialObligationsTool />
    </LegalToolLayout>
  );
};

export default FinancialObligationsPage;
