
import React from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { IndianRupee, FileText, Calculator, Book, Building2, Activity } from 'lucide-react';
import TaxComplianceTool from '@/components/TaxComplianceTool';
import BackToToolsButton from '@/components/practice-areas/BackToToolsButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TaxCompliancePage = () => {
  return (
    <LegalToolLayout
      title="Indian Tax Law & Compliance Advisor"
      description="AI-powered tool providing comprehensive tax guidance and compliance analysis for Indian tax laws including GST, Income Tax, and TDS regulations."
      icon={<IndianRupee className="w-6 h-6 text-blue-600" />}
    >
      <BackToToolsButton className="mb-6" />
      
      <div className="mb-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gst">GST</TabsTrigger>
            <TabsTrigger value="income-tax">Income Tax</TabsTrigger>
            <TabsTrigger value="corporate-tax">Corporate Tax</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-blue-100 dark:border-blue-900/20">
                <CardHeader className="bg-blue-50/50 dark:bg-blue-900/10 pb-3">
                  <CardTitle className="text-md font-medium font-playfair flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-blue-600" />
                    <span>GST Compliance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 text-sm space-y-2">
                  <p>Input tax credit calculations</p>
                  <p>Filing deadlines & requirements</p>
                  <p>State-specific compliance rules</p>
                </CardContent>
              </Card>
              
              <Card className="border border-green-100 dark:border-green-900/20">
                <CardHeader className="bg-green-50/50 dark:bg-green-900/10 pb-3">
                  <CardTitle className="text-md font-medium font-playfair flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span>Income Tax Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 text-sm space-y-2">
                  <p>Deduction eligibility assessment</p>
                  <p>TDS/TCS obligation calculator</p>
                  <p>Section 44 presumptive taxation</p>
                </CardContent>
              </Card>
              
              <Card className="border border-purple-100 dark:border-purple-900/20">
                <CardHeader className="bg-purple-50/50 dark:bg-purple-900/10 pb-3">
                  <CardTitle className="text-md font-medium font-playfair flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-purple-600" />
                    <span>Corporate Tax Planning</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 text-sm space-y-2">
                  <p>Section 115BAA/115BAB options</p>
                  <p>Transfer pricing compliance</p>
                  <p>International tax implications</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="gst" className="mt-6">
            <Card className="border border-blue-100 dark:border-blue-900/20">
              <CardHeader>
                <CardTitle className="font-playfair">GST Compliance in India</CardTitle>
                <CardDescription>Key aspects of GST regulatory framework</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Latest GST Updates</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                      <li>E-invoicing threshold: ₹5 crore</li>
                      <li>HSN code requirement: 6 digits for B2B</li>
                      <li>Late fee waivers/reductions</li>
                      <li>QR code on B2C invoices for businesses with turnover > ₹500 crore</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Return Filing Timeline</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                      <li>GSTR-1: 11th of following month</li>
                      <li>GSTR-3B: 20th of following month</li>
                      <li>CMP-08 (Composition): Quarterly</li>
                      <li>GSTR-9/9C: 31st December</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="income-tax" className="mt-6">
            <Card className="border border-green-100 dark:border-green-900/20">
              <CardHeader>
                <CardTitle className="font-playfair">Income Tax Compliance in India</CardTitle>
                <CardDescription>Key provisions and due dates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Key Tax Saving Sections</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                      <li>80C: Up to ₹1.5 lakh deduction</li>
                      <li>80D: Health insurance premium</li>
                      <li>80G: Charitable donations</li>
                      <li>24(b): Home loan interest</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Due Dates</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                      <li>Advance Tax: 15th Jun, Sep, Dec, Mar</li>
                      <li>TDS Payment: 7th of next month</li>
                      <li>ITR Filing: July 31st (non-audit cases)</li>
                      <li>Tax Audit Report: Sep 30th</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="corporate-tax" className="mt-6">
            <Card className="border border-purple-100 dark:border-purple-900/20">
              <CardHeader>
                <CardTitle className="font-playfair">Corporate Tax Regulations</CardTitle>
                <CardDescription>For businesses registered in India</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Tax Rates</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                      <li>Domestic companies: 22% (Sec 115BAA)</li>
                      <li>New manufacturing companies: 15% (Sec 115BAB)</li>
                      <li>Regular domestic companies: 30%</li>
                      <li>Foreign companies: 40%</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Corporate Compliance</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                      <li>Transfer Pricing documentation</li>
                      <li>Country-by-Country Reporting</li>
                      <li>Significant Economic Presence</li>
                      <li>Equalization Levy provisions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mb-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <Book className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-medium font-playfair text-blue-800 dark:text-blue-400 mb-2">Indian Tax Frameworks</h3>
            <p className="text-sm text-blue-700 dark:text-blue-500">
              This tool incorporates latest provisions from:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-3">
              <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-500 ml-2 space-y-1">
                <li>Income Tax Act, 1961 (updated)</li>
                <li>CGST/SGST/IGST Acts, 2017</li>
                <li>Finance Act provisions</li>
                <li>Double Taxation Avoidance Agreements</li>
              </ul>
              <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-500 ml-2 space-y-1">
                <li>CBDT & CBIC Circulars</li>
                <li>Advance Ruling precedents</li>
                <li>Tax Tribunal decisions</li>
                <li>Supreme Court judgments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <TaxComplianceTool />
    </LegalToolLayout>
  );
};

export default TaxCompliancePage;
