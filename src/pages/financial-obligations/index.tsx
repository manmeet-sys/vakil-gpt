
import React from 'react';
import { IndianRupee, ArrowUpRight } from 'lucide-react';
import FinancialObligationsTool from '@/components/FinancialObligationsTool';
import BackButton from '@/components/BackButton';
import { motion } from 'framer-motion';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FinancialObligationsPage = () => {
  const navigate = useNavigate();
  
  return (
    <LegalToolLayout
      title="Indian Financial Obligations Monitor"
      description="Track financial clauses in agreements including loans, royalties, GST payments, and TDS liabilities with automatic alerts."
      icon={<IndianRupee className="w-6 h-6 text-blue-600" />}
    >
      <BackButton to="/tools" label="Back to Tools" />
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full max-w-4xl space-y-6">
          <Card className="border border-blue-100 dark:border-blue-900/20 shadow-elegant">
            <CardHeader className="bg-gradient-to-r from-blue-50/80 to-transparent dark:from-blue-900/20 dark:to-transparent">
              <CardTitle className="flex justify-between items-center">
                <span>Financial Management Tools</span>
              </CardTitle>
              <CardDescription>
                Access all financial tools for your legal practice in one place
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 justify-start text-left border-blue-100 dark:border-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                  onClick={() => navigate('/billing-tracking')}
                >
                  <div className="flex items-start gap-3">
                    <IndianRupee className="h-5 w-5 mt-0.5 text-blue-600" />
                    <div>
                      <div className="font-medium">Billing & Time Tracking</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Track billable hours, generate invoices, and manage client payments
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground ml-auto mt-0.5" />
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start text-left border-blue-100 dark:border-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                  onClick={() => navigate('/tax-compliance')}
                >
                  <div className="flex items-start gap-3">
                    <IndianRupee className="h-5 w-5 mt-0.5 text-green-600" />
                    <div>
                      <div className="font-medium">Tax Compliance</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Track GST, TDS and other tax obligations for your practice
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground ml-auto mt-0.5" />
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <FinancialObligationsTool />
        </div>
      </motion.div>
    </LegalToolLayout>
  );
};

export default FinancialObligationsPage;
