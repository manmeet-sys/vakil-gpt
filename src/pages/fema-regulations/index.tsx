
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Building, Globe, AlertTriangle, ArrowRight, Check, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const FEMARegulationsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [sector, setSector] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [investmentRoute, setInvestmentRoute] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isForeignCompany, setIsForeignCompany] = useState('no');
  
  const handleAnalyze = () => {
    if (!sector || !transactionType || !investmentRoute || !investmentAmount) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields to analyze FEMA compliance.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Compliance Analysis Initiated",
      description: "Your FEMA regulations analysis is being processed.",
    });
    
    // Simulate processing delay
    setTimeout(() => {
      setActiveTab('results');
    }, 1000);
  };
  
  return (
    <LegalToolLayout
      title="FEMA Regulations Navigator"
      description="Comprehensive guide to Foreign Exchange Management Act regulations for Indian businesses engaged in cross-border transactions and investments."
      icon={<Building className="w-6 h-6 text-blue-600" />}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analyzer">Compliance Analyzer</TabsTrigger>
          <TabsTrigger value="results" disabled={activeTab !== 'results'}>Compliance Report</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">FEMA Compliance Assistant</h2>
            <p className="text-muted-foreground">
              Navigate the complex requirements of India's Foreign Exchange Management Act for foreign 
              investments, cross-border transactions, and overseas business operations.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  FDI Policy Framework
                </CardTitle>
                <CardDescription>
                  Current Foreign Direct Investment regulations in India
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The Indian FDI policy categorizes sectors under automatic route, approval route, and prohibited sectors, 
                  with varying sector-specific caps on foreign investment percentages.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Key FDI Sectors & Caps</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex justify-between">
                      <span>E-commerce (Marketplace)</span>
                      <span className="font-medium">100% (Automatic)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Manufacturing</span>
                      <span className="font-medium">100% (Automatic)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Insurance</span>
                      <span className="font-medium">74% (Automatic)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Defense</span>
                      <span className="font-medium">74% (Automatic)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Telecom</span>
                      <span className="font-medium">100% (Automatic)</span>
                    </li>
                  </ul>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab('analyzer')}
                >
                  Check Sector-Specific Requirements
                </Button>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    FEMA Regulation Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="border-b pb-2">
                      <p className="font-medium">Revised Overseas Investment Framework</p>
                      <p className="text-muted-foreground">New rules for Indian entities investing abroad</p>
                      <p className="text-xs text-blue-600">Effective: March 15, 2025</p>
                    </div>
                    <div className="border-b pb-2">
                      <p className="font-medium">External Commercial Borrowing Guidelines</p>
                      <p className="text-muted-foreground">Updated ECB framework with simplified procedures</p>
                      <p className="text-xs text-blue-600">Effective: February 1, 2025</p>
                    </div>
                    <div>
                      <p className="font-medium">Revised LRS Limits</p>
                      <p className="text-muted-foreground">Liberalized Remittance Scheme limit changes</p>
                      <p className="text-xs text-blue-600">Effective: January 1, 2025</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Common Compliance Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p className="text-muted-foreground mb-2">
                    Areas where businesses frequently encounter FEMA compliance issues:
                  </p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Delayed filings of Form ODI/APR for overseas investments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Incorrect reporting of foreign investments in Form FC-GPR</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Non-compliance with ECB end-use restrictions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analyzer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>FEMA Compliance Analyzer</CardTitle>
              <CardDescription>
                Enter your transaction details to receive personalized FEMA compliance guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sector">Business Sector</Label>
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger id="sector">
                    <SelectValue placeholder="Select business sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="retail-trading">Retail Trading</SelectItem>
                    <SelectItem value="banking">Banking & Financial Services</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="defense">Defense</SelectItem>
                    <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                    <SelectItem value="telecom">Telecommunications</SelectItem>
                    <SelectItem value="other">Other Sectors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transaction-type">Transaction Type</Label>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger id="transaction-type">
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fdi-inward">Inward FDI (Foreign Investment into India)</SelectItem>
                    <SelectItem value="odi-outward">Outward Direct Investment (Indian Investment Abroad)</SelectItem>
                    <SelectItem value="ecb">External Commercial Borrowing</SelectItem>
                    <SelectItem value="lrs">Liberalized Remittance Scheme (LRS)</SelectItem>
                    <SelectItem value="trade-credit">Trade Credit</SelectItem>
                    <SelectItem value="nri-deposits">NRI Deposits & Investments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investment-route">Investment Route</Label>
                <Select value={investmentRoute} onValueChange={setInvestmentRoute}>
                  <SelectTrigger id="investment-route">
                    <SelectValue placeholder="Select investment route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">Automatic Route</SelectItem>
                    <SelectItem value="approval">Government Approval Route</SelectItem>
                    <SelectItem value="not-applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investment-amount">Transaction Amount (₹ in lakhs)</Label>
                <Input 
                  id="investment-amount" 
                  placeholder="e.g., 5000" 
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Is a foreign entity involved?</Label>
                <RadioGroup 
                  value={isForeignCompany} 
                  onValueChange={setIsForeignCompany}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="foreign-yes" />
                    <Label htmlFor="foreign-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="foreign-no" />
                    <Label htmlFor="foreign-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button className="w-full mt-2" onClick={handleAnalyze}>
                Analyze FEMA Requirements
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                FEMA Compliance Analysis
              </CardTitle>
              <CardDescription>
                Based on {transactionType.replace('-', ' ')} in the {sector} sector
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900/30">
                <h3 className="font-medium flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Route Assessment
                </h3>
                <p className="text-sm mt-1">
                  This transaction can proceed through the {investmentRoute} route for the {sector} sector.
                  {sector === 'retail-trading' && investmentRoute === 'automatic' && 
                    " However, please note specific conditions apply for multi-brand retail trading."}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Applicable Regulations</h3>
                <div className="space-y-3">
                  <div className="border-b pb-3">
                    <p className="font-medium">FEMA Notification</p>
                    <p className="text-sm text-muted-foreground">FEMA 20(R)/2017-RB (Foreign Investment in India)</p>
                  </div>
                  
                  <div className="border-b pb-3">
                    <p className="font-medium">Master Direction</p>
                    <p className="text-sm text-muted-foreground">
                      Master Direction – Foreign Investment in India (Updated as of March 31, 2024)
                    </p>
                  </div>
                  
                  <div className="border-b pb-3">
                    <p className="font-medium">Sector Specific Regulation</p>
                    <p className="text-sm text-muted-foreground">
                      Press Note 2 of 2021 - Guidelines for FDI in {sector} sector
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Required Filings & Compliance</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="font-medium">Form FC-GPR</p>
                    <p className="text-sm text-muted-foreground">
                      To be filed within 30 days of issue of shares to the foreign investor
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Filing Platform: RBI FIRMS Portal</p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="font-medium">Annual Return on Foreign Liabilities and Assets (FLA)</p>
                    <p className="text-sm text-muted-foreground">
                      To be filed annually by July 15 for the previous financial year
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Filing Platform: RBI Website</p>
                  </div>
                  
                  {isForeignCompany === 'yes' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="font-medium">Form FCGPR / FC-TRS for share transfers</p>
                      <p className="text-sm text-muted-foreground">
                        Required for any subsequent transfer of shares between resident and non-resident
                      </p>
                      <p className="text-xs text-blue-600 mt-1">Filing Platform: RBI FIRMS Portal</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Sector-Specific Requirements</h3>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    Special Conditions
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {sector === 'ecommerce' && (
                      <>
                        <li>• Only marketplace model is allowed under automatic route, not inventory-based model</li>
                        <li>• E-commerce entity cannot exercise ownership over inventory sold on platform</li>
                        <li>• Maximum 25% of sales from one vendor or its group companies</li>
                      </>
                    )}
                    {sector === 'manufacturing' && (
                      <>
                        <li>• 100% FDI is permitted under automatic route</li>
                        <li>• Compliance with industrial license requirements if applicable</li>
                        <li>• Sectoral licenses may be required for specific manufacturing activities</li>
                      </>
                    )}
                    {sector === 'retail-trading' && (
                      <>
                        <li>• Single brand retail: 100% FDI allowed under automatic route</li>
                        <li>• Multi-brand retail: 51% FDI allowed under government approval route</li>
                        <li>• Local sourcing requirements of 30% for single brand retail with FDI above 51%</li>
                      </>
                    )}
                    {(sector !== 'ecommerce' && sector !== 'manufacturing' && sector !== 'retail-trading') && (
                      <>
                        <li>• Specific sectoral caps and conditions apply based on FDI policy</li>
                        <li>• Prior approval from sectoral regulator may be required</li>
                        <li>• Additional compliance requirements based on sector-specific regulations</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setActiveTab('analyzer')}
              >
                Analyze Another Transaction
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  toast({
                    title: "Report Generated",
                    description: "Your FEMA compliance report has been prepared.",
                  });
                }}
              >
                Download Detailed Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </LegalToolLayout>
  );
};

export default FEMARegulationsPage;
