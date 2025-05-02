
import React from 'react';
import { IndianRupee, ArrowUpRight, Activity, FileText, AlertTriangle } from 'lucide-react';
import FinancialObligationsTool from '@/components/FinancialObligationsTool';
import BackToToolsButton from '@/components/practice-areas/BackToToolsButton';
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
      <BackToToolsButton className="mb-6" />
      
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
                <span className="font-playfair">Financial Management Tools</span>
              </CardTitle>
              <CardDescription>
                Access all financial tools for your legal practice in one place
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        Track billable hours and manage client payments
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
                        Track GST, TDS and other tax obligations
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground ml-auto mt-0.5" />
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start text-left border-blue-100 dark:border-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                  onClick={() => navigate('/fraud-detector')}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 mt-0.5 text-amber-600" />
                    <div>
                      <div className="font-medium">Fraud Detection</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Identify potentially fraudulent activities
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground ml-auto mt-0.5" />
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="border border-amber-100 dark:border-amber-900/20">
              <CardHeader className="bg-gradient-to-r from-amber-50/80 to-transparent dark:from-amber-900/20 dark:to-transparent">
                <CardTitle className="text-lg font-playfair">Key Financial Regulations</CardTitle>
                <CardDescription>Relevant for financial obligations in India</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5 text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Indian Contract Act, 1872</span> - Governs enforcement of financial obligations
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5 text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium">SARFAESI Act, 2002</span> - Recovery of secured debts & security enforcement
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5 text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Income Tax Act, 1961</span> - TDS obligations for payments
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5 text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium">GST Acts</span> - Goods and Services Tax payment schedules
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-blue-100 dark:border-blue-900/20">
              <CardHeader className="bg-gradient-to-r from-blue-50/80 to-transparent dark:from-blue-900/20 dark:to-transparent">
                <CardTitle className="text-lg font-playfair">Important Deadlines</CardTitle>
                <CardDescription>Financial obligations deadlines in India</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium">GST Returns</span> - Monthly (GSTR-3B by 20th), Quarterly (CMP-08)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium">TDS Payment</span> - 7th of following month
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium">TDS Returns</span> - Quarterly (24Q, 26Q, etc.)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Advance Tax</span> - 15th Jun, 15th Sep, 15th Dec, 15th Mar
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <FinancialObligationsTool />
        </div>
      </motion.div>
    </LegalToolLayout>
  );
};

export default FinancialObligationsPage;
