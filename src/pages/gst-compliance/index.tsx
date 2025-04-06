
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { IndianRupee, FileText, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const GSTCompliancePage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [gstNumber, setGstNumber] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [turnover, setTurnover] = useState('');
  
  const handleCheckCompliance = () => {
    if (!gstNumber || !businessType || !turnover) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields to check compliance.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Compliance Analysis Initiated",
      description: "Your GST compliance analysis is being processed.",
    });
    
    // Simulate processing delay
    setTimeout(() => {
      setActiveTab('results');
    }, 1000);
  };
  
  const upcomingDeadlines = [
    { date: 'April 11, 2025', description: 'GSTR-1 Filing Deadline for March 2025', type: 'standard' },
    { date: 'April 20, 2025', description: 'GSTR-3B Filing Deadline for March 2025', type: 'standard' },
    { date: 'April 30, 2025', description: 'GSTR-4 Filing for Composition Dealers (Jan-Mar 2025)', type: 'composition' },
    { date: 'May 11, 2025', description: 'GSTR-1 Filing Deadline for April 2025', type: 'standard' },
    { date: 'May 20, 2025', description: 'GSTR-3B Filing Deadline for April 2025', type: 'standard' },
  ];
  
  return (
    <LegalToolLayout
      title="Indian GST Compliance Advisor"
      description="AI-powered tool providing comprehensive guidance on Goods and Services Tax compliance, filings, and regulations in India."
      icon={<IndianRupee className="w-6 h-6 text-blue-600" />}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="check">Check Compliance</TabsTrigger>
          <TabsTrigger value="results" disabled={activeTab !== 'results'}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">GST Compliance Assistant</h2>
            <p className="text-muted-foreground">
              This tool helps you navigate the complex Indian GST landscape, ensuring your business 
              remains compliant with all filing requirements and tax regulations.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Filing Deadlines
                </CardTitle>
                <CardDescription>Upcoming GST filing deadlines for businesses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingDeadlines.slice(0, 3).map((deadline, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{deadline.description}</p>
                      <p className="text-sm text-muted-foreground">{deadline.type === 'composition' ? 'For composition dealers' : 'For regular taxpayers'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">{deadline.date}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => setActiveTab('check')}>
                  Check Your Compliance Status
                </Button>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    HSN Code Lookup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Find the correct Harmonized System of Nomenclature (HSN) codes for your products and services.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => {
                    toast({
                      title: "HSN Code Lookup",
                      description: "This feature will be available soon.",
                    });
                  }}>
                    Search HSN Codes
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    Input Tax Credit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Calculate available input tax credits and optimize your GST payments.
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => {
                    toast({
                      title: "ITC Calculator",
                      description: "This feature will be available soon.",
                    });
                  }}>
                    Calculate ITC
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="check" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>GST Compliance Check</CardTitle>
              <CardDescription>
                Enter your business details to analyze your GST compliance status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gst-number">GST Registration Number</Label>
                <Input 
                  id="gst-number" 
                  placeholder="e.g., 27AAPFU0939F1ZV" 
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Enter your 15-digit GSTIN</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business-type">Business Type</Label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger id="business-type">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="service-provider">Service Provider</SelectItem>
                    <SelectItem value="trader">Trader</SelectItem>
                    <SelectItem value="e-commerce">E-Commerce Operator</SelectItem>
                    <SelectItem value="composition">Composition Scheme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="turnover">Annual Turnover (₹)</Label>
                <Input 
                  id="turnover" 
                  placeholder="e.g., 5000000" 
                  value={turnover}
                  onChange={(e) => setTurnover(e.target.value)}
                />
              </div>
              
              <Button className="w-full" onClick={handleCheckCompliance}>
                Check Compliance Status
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="space-y-6">
          <Card className="border-green-100 dark:border-green-900/30">
            <CardHeader className="bg-green-50 dark:bg-green-900/20 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Compliance Summary
              </CardTitle>
              <CardDescription>
                Based on the information provided for GSTIN: {gstNumber}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="font-medium">Filing Status</div>
                <div className="flex items-center gap-1.5 text-green-600 font-medium">
                  <CheckCircle className="h-4 w-4" /> Up to date
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div className="font-medium">Next Filing Due</div>
                <div className="font-medium">GSTR-1 for March 2025 (April 11, 2025)</div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div className="font-medium">Compliance Score</div>
                <div className="text-green-600 font-semibold">92/100</div>
              </div>
              
              <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4 border border-amber-100 dark:border-amber-800/30">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Attention Required
                </h3>
                <ul className="space-y-1 text-sm">
                  <li>• Remember to reconcile your input tax credit claims for the previous quarter</li>
                  <li>• Ensure all e-invoices are being generated for B2B transactions above ₹10 lakhs</li>
                  <li>• Update your HSN codes according to the latest GST HSN notification</li>
                </ul>
              </div>
              
              <div className="space-y-2 pt-2">
                <h3 className="font-medium">Estimated Tax Liability for Current Period</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">CGST</p>
                    <p className="font-semibold">₹24,500</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">SGST</p>
                    <p className="font-semibold">₹24,500</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">IGST</p>
                    <p className="font-semibold">₹12,750</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setActiveTab('check')}
            >
              Check Another Business
            </Button>
            <Button 
              className="flex-1"
              onClick={() => {
                toast({
                  title: "Report Generated",
                  description: "Your compliance report has been prepared.",
                });
              }}
            >
              Download Detailed Report
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </LegalToolLayout>
  );
};

export default GSTCompliancePage;
