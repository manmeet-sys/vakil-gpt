
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Calculator, FileText, AlertTriangle, Check, ChevronRight, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const InvestmentRegulationsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [investorType, setInvestorType] = useState('');
  const [investmentType, setInvestmentType] = useState('');
  const [securityType, setSecurityType] = useState('');
  const [isListedCompany, setIsListedCompany] = useState('no');
  const [investmentAmount, setInvestmentAmount] = useState('');
  
  const handleAnalyze = () => {
    if (!investorType || !investmentType || !securityType || !investmentAmount) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields to analyze investment compliance.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Compliance Analysis Initiated",
      description: "Your investment regulations analysis is being processed.",
    });
    
    // Simulate processing delay
    setTimeout(() => {
      setActiveTab('results');
    }, 1000);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'warning': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
      case 'violation': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    }
  };
  
  return (
    <LegalToolLayout
      title="Indian Investment Regulations Guide"
      description="Navigate SEBI regulations, securities laws, and investment compliance requirements for the Indian financial markets."
      icon={<Calculator className="w-6 h-6 text-blue-600" />}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analyzer">Compliance Analyzer</TabsTrigger>
          <TabsTrigger value="results" disabled={activeTab !== 'results'}>Compliance Report</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Investment Regulations Assistant</h2>
            <p className="text-muted-foreground">
              Understand and navigate the complex regulatory framework governing investments, securities, 
              and financial markets in India with our specialized legal tools.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  SEBI Regulations Overview
                </CardTitle>
                <CardDescription>
                  Key regulations from Securities and Exchange Board of India
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="border-b pb-2">
                    <p className="font-medium">SEBI (LODR) Regulations, 2015</p>
                    <p className="text-muted-foreground">Listing Obligations and Disclosure Requirements</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="font-medium">SEBI (ICDR) Regulations, 2018</p>
                    <p className="text-muted-foreground">Issue of Capital and Disclosure Requirements</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="font-medium">SEBI (PIT) Regulations, 2015</p>
                    <p className="text-muted-foreground">Prohibition of Insider Trading</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="font-medium">SEBI (SAST) Regulations, 2011</p>
                    <p className="text-muted-foreground">Substantial Acquisition of Shares and Takeovers</p>
                  </div>
                  <div>
                    <p className="font-medium">SEBI (AIF) Regulations, 2012</p>
                    <p className="text-muted-foreground">Alternative Investment Funds</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab('analyzer')}
                >
                  Check Regulatory Requirements
                </Button>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    Recent Regulatory Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="border-b pb-2">
                      <p className="font-medium">SEBI (Mutual Funds) Amendment Regulations, 2025</p>
                      <p className="text-muted-foreground">Changes to governance framework for mutual funds</p>
                      <p className="text-xs text-blue-600">Effective: April 1, 2025</p>
                    </div>
                    <div className="border-b pb-2">
                      <p className="font-medium">Revised Framework for Regulatory Sandbox</p>
                      <p className="text-muted-foreground">Testing new business models and technologies</p>
                      <p className="text-xs text-blue-600">Effective: March 15, 2025</p>
                    </div>
                    <div>
                      <p className="font-medium">Revised Transaction Norms for Promoters</p>
                      <p className="text-muted-foreground">Updated rules for promoter transactions</p>
                      <p className="text-xs text-blue-600">Effective: February 1, 2025</p>
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
                    Areas where businesses frequently encounter investment compliance issues:
                  </p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Delayed disclosure filings by listed companies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Insider trading prevention system failures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Compliance with takeover regulations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Non-compliance with minimum public shareholding requirements</span>
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
              <CardTitle>Investment Regulations Analyzer</CardTitle>
              <CardDescription>
                Enter your investment details to receive personalized regulatory guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="investor-type">Investor Type</Label>
                <Select value={investorType} onValueChange={setInvestorType}>
                  <SelectTrigger id="investor-type">
                    <SelectValue placeholder="Select investor type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual/Retail Investor</SelectItem>
                    <SelectItem value="promoter">Promoter/Promoter Group</SelectItem>
                    <SelectItem value="fii-fpi">Foreign Institutional Investor/FPI</SelectItem>
                    <SelectItem value="mutual-fund">Mutual Fund</SelectItem>
                    <SelectItem value="aif">Alternative Investment Fund</SelectItem>
                    <SelectItem value="broker">Broker/Intermediary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investment-type">Investment/Transaction Type</Label>
                <Select value={investmentType} onValueChange={setInvestmentType}>
                  <SelectTrigger id="investment-type">
                    <SelectValue placeholder="Select investment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary-issuance">Primary Market Issuance (IPO/FPO)</SelectItem>
                    <SelectItem value="secondary-trade">Secondary Market Trading</SelectItem>
                    <SelectItem value="block-deal">Block Deal/Bulk Transaction</SelectItem>
                    <SelectItem value="insider-transaction">Insider Transaction</SelectItem>
                    <SelectItem value="preferential-allotment">Preferential Allotment</SelectItem>
                    <SelectItem value="rights-issue">Rights Issue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="security-type">Security Type</Label>
                <Select value={securityType} onValueChange={setSecurityType}>
                  <SelectTrigger id="security-type">
                    <SelectValue placeholder="Select security type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equity-shares">Equity Shares</SelectItem>
                    <SelectItem value="preference-shares">Preference Shares</SelectItem>
                    <SelectItem value="debentures">Debentures/Bonds</SelectItem>
                    <SelectItem value="derivatives">Derivatives (F&O)</SelectItem>
                    <SelectItem value="mutual-fund-units">Mutual Fund Units</SelectItem>
                    <SelectItem value="aif-units">AIF Units</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Is the investment in a listed company?</Label>
                <RadioGroup 
                  value={isListedCompany} 
                  onValueChange={setIsListedCompany}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="listed-yes" />
                    <Label htmlFor="listed-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="listed-no" />
                    <Label htmlFor="listed-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investment-amount">Investment Amount (₹ in lakhs)</Label>
                <Input 
                  id="investment-amount" 
                  placeholder="e.g., 1000" 
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                />
              </div>
              
              <Button className="w-full mt-2" onClick={handleAnalyze}>
                Analyze Regulatory Requirements
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Investment Regulations Analysis
              </CardTitle>
              <CardDescription>
                Based on {investmentType.replace('-', ' ')} by {investorType.replace('-', ' ')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-3">
                <h3 className="font-medium">Applicable Regulations</h3>
                <div className="grid gap-3">
                  {investmentType === 'primary-issuance' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="font-medium">SEBI (ICDR) Regulations, 2018</p>
                      <p className="text-sm text-muted-foreground">
                        Governs the issuance of securities and disclosures in the primary market
                      </p>
                    </div>
                  )}
                  
                  {(investmentType === 'block-deal' || investmentType === 'secondary-trade') && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="font-medium">SEBI (SAST) Regulations, 2011</p>
                      <p className="text-sm text-muted-foreground">
                        Applies when acquiring substantial quantities of shares or voting rights
                      </p>
                    </div>
                  )}
                  
                  {(investorType === 'promoter' || investmentType === 'insider-transaction') && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="font-medium">SEBI (PIT) Regulations, 2015</p>
                      <p className="text-sm text-muted-foreground">
                        Governs trading by insiders and handling of unpublished price sensitive information
                      </p>
                    </div>
                  )}
                  
                  {isListedCompany === 'yes' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="font-medium">SEBI (LODR) Regulations, 2015</p>
                      <p className="text-sm text-muted-foreground">
                        Disclosure obligations for listed entities and their major shareholders
                      </p>
                    </div>
                  )}
                  
                  {investorType === 'aif' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="font-medium">SEBI (AIF) Regulations, 2012</p>
                      <p className="text-sm text-muted-foreground">
                        Regulatory framework for alternative investment funds in India
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Compliance Requirements</h3>
                <div className="space-y-3">
                  {/* Disclosure Requirements */}
                  <div className="border-b pb-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">Disclosure Requirements</p>
                      <Badge className={getStatusColor(
                        (investorType === 'promoter' || investmentType === 'insider-transaction') ? 'warning' : 'compliant'
                      )}>
                        {(investorType === 'promoter' || investmentType === 'insider-transaction') ? 'Critical' : 'Required'}
                      </Badge>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {isListedCompany === 'yes' && (
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>File disclosure under Regulation 29(1) or 29(2) of SAST if stake crosses 5% or changes by 2%</span>
                        </li>
                      )}
                      {investorType === 'promoter' && (
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Disclosure under Regulation 7 of PIT for any change in holding</span>
                        </li>
                      )}
                      {investmentType === 'insider-transaction' && (
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Pre-clearance required from compliance officer before trading</span>
                        </li>
                      )}
                      {investorType === 'fii-fpi' && (
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>FPI registration with SEBI and reporting requirements to RBI</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {/* Trading Restrictions */}
                  <div className="border-b pb-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">Trading Restrictions</p>
                      <Badge className={getStatusColor(
                        investmentType === 'insider-transaction' ? 'warning' : 'compliant'
                      )}>
                        {investmentType === 'insider-transaction' ? 'High Risk' : 'Standard'}
                      </Badge>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {investmentType === 'insider-transaction' && (
                        <>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>No trading during trading window closure periods</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Holding period of minimum 6 months from acquisition</span>
                          </li>
                        </>
                      )}
                      {(investmentType === 'block-deal' || investmentType === 'preferential-allotment') && (
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>
                            {investmentType === 'block-deal' ? 
                              'Trading only in block deal window (8:45 AM to 9:00 AM)' : 
                              'Lock-in period applies as per ICDR regulations'}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  {/* Takeover Implications */}
                  {(Number(investmentAmount) > 1000 || investorType === 'promoter') && (
                    <div className="border-b pb-3">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">Takeover Code Implications</p>
                        <Badge className={getStatusColor(Number(investmentAmount) > 5000 ? 'warning' : 'compliant')}>
                          {Number(investmentAmount) > 5000 ? 'Monitor Closely' : 'Applicable'}
                        </Badge>
                      </div>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Mandatory open offer triggered if stake reaches 25%</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Open offer also triggered if stake increases by 5% in a financial year for holdings between 25-75%</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Key Compliance Actions
                </h3>
                <ul className="space-y-1 text-sm">
                  {isListedCompany === 'yes' && (
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>File required disclosures with the stock exchanges within 2 working days of transaction</span>
                    </li>
                  )}
                  {investorType === 'promoter' && (
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Maintain trading plans as per Regulation 5 of PIT Regulations</span>
                    </li>
                  )}
                  {(investmentType === 'preferential-allotment' || investmentType === 'rights-issue') && (
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Ensure compliance with pricing formula under ICDR Regulations</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Maintain records of all transactions for a minimum period of 8 years</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setActiveTab('analyzer')}
              >
                Analyze Another Investment
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  toast({
                    title: "Report Generated",
                    description: "Your investment regulations report has been prepared.",
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

export default InvestmentRegulationsPage;
