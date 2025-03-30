
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Clock } from 'lucide-react';
import FinancialObligationsTool from '@/components/FinancialObligationsTool';

const FinancialObligationsPage = () => {
  return (
    <LegalToolLayout
      title="Financial Obligations Monitor"
      description="Track financial clauses in agreements including loans, royalties, and liabilities with automatic alerts."
      icon={<Clock className="w-6 h-6 text-blue-600" />}
    >
      <FinancialObligationsTool />
    </LegalToolLayout>
  );
};

export default FinancialObligationsPage;
