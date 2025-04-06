
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { LandPlot, Building, IndianRupee, Calculator, FileText, Check, AlertTriangle, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const RealEstateLawPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [propertyType, setPropertyType] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
  const [isRERARegistered, setIsRERARegistered] = useState('yes');
  
  const handleAnalyze = () => {
    if (!propertyType || !transactionType || !propertyLocation || !propertyValue) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields to analyze real estate compliance.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Compliance Analysis Initiated",
      description: "Your real estate law analysis is being processed.",
    });
    
    // Simulate processing delay
    setTimeout(() => {
      setActiveTab('results');
    }, 1000);
  };
  
  const calculateStampDuty = () => {
    const value = Number(propertyValue) || 0;
    let rate = 0.05; // Default 5%
    
    if (propertyLocation === 'maharashtra') {
      rate = propertyType === 'residential' ? 0.06 : 0.065;
    } else if (propertyLocation === 'delhi') {
      rate = propertyType === 'residential' ? 0.07 : 0.075;
    } else if (propertyLocation === 'karnataka') {
      rate = propertyType === 'residential' ? 0.055 : 0.06;
    } else if (propertyLocation === 'tamil-nadu') {
      rate = propertyType === 'residential' ? 0.07 : 0.075;
    }
    
    return (value * rate).toFixed(2);
  };
  
  const calculateRegistrationFee = () => {
    const value = Number(propertyValue) || 0;
    let fee = 0;
    
    if (propertyLocation === 'maharashtra') {
      fee = Math.min(30000, value * 0.01);
    } else if (propertyLocation === 'delhi') {
      fee = Math.min(20000, value * 0.01);
    } else if (propertyLocation === 'karnataka') {
      fee = Math.min(15000, value * 0.01);
    } else if (propertyLocation === 'tamil-nadu') {
      fee = Math.min(25000, value * 0.01);
    } else {
      fee = Math.min(20000, value * 0.01);
    }
    
    return fee.toFixed(2);
  };
  
  return (
    <LegalToolLayout
      title="Indian Real Estate Law Navigator"
      description="Comprehensive legal assistance for property transactions, RERA compliance, and real estate regulations across Indian states."
      icon={<LandPlot className="w-6 h-6 text-blue-600" />}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analyzer">Legal Advisor</TabsTrigger>
          <TabsTrigger value="results" disabled={activeTab !== 'results'}>Compliance Report</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Real Estate Legal Assistant</h2>
            <p className="text-muted-foreground">
              Navigate the complex legal landscape of Indian real estate transactions, regulations, and compliance requirements 
              with specialized tools for property professionals and individuals.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  RERA Regulations Overview
                </CardTitle>
                <CardDescription>
                  Key provisions of the Real Estate (Regulation and Development) Act
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="border-b pb-2">
                    <p className="font-medium">Project Registration</p>
                    <p className="text-muted-foreground">Mandatory registration of real estate projects with state RERA</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="font-medium">Agent Registration</p>
                    <p className="text-muted-foreground">Mandatory registration for real estate agents to operate legally</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="font-medium">Escrow Account</p>
                    <p className="text-muted-foreground">70% of project funds to be deposited in separate account</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="font-medium">Project Timelines</p>
                    <p className="text-muted-foreground">Delivery timelines and consequences for delays</p>
                  </div>
                  <div>
                    <p className="font-medium">Disclosure Requirements</p>
                    <p className="text-muted-foreground">Detailed disclosures about project and approvals</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab('analyzer')}
                >
                  Check RERA Compliance
                </Button>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    Stamp Duty Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Calculate stamp duty and registration fees for property transactions across Indian states.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab('analyzer')}
                  >
                    Calculate Fees
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Document Verification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Verify essential documents for property transactions including title deeds, encumbrance certificates, and approved plans.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Document Verification",
                        description: "Document verification tool will be available soon.",
                      });
                    }}
                  >
                    Verify Documents
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-blue-600" />
                    Tax Implications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Understand capital gains, TDS requirements, and property tax implications for real estate transactions.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Tax Calculator",
                        description: "Property tax calculator will be available soon.",
                      });
                    }}
                  >
                    Calculate Tax Implications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analyzer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real Estate Legal Advisor</CardTitle>
              <CardDescription>
                Enter property details to receive personalized legal guidance for your real estate transaction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="property-type">Property Type</Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger id="property-type">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential-apartment">Residential Apartment</SelectItem>
                    <SelectItem value="residential-villa">Independent House/Villa</SelectItem>
                    <SelectItem value="plot">Residential Plot</SelectItem>
                    <SelectItem value="commercial">Commercial Property</SelectItem>
                    <SelectItem value="industrial">Industrial Property</SelectItem>
                    <SelectItem value="agricultural">Agricultural Land</SelectItem>
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
                    <SelectItem value="purchase-primary">Purchase from Developer/Builder</SelectItem>
                    <SelectItem value="purchase-resale">Purchase (Resale)</SelectItem>
                    <SelectItem value="sale">Sale of Property</SelectItem>
                    <SelectItem value="lease">Lease/Rental Agreement</SelectItem>
                    <SelectItem value="gift">Gift Deed</SelectItem>
                    <SelectItem value="mortgage">Mortgage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="property-location">Property Location (State)</Label>
                <Select value={propertyLocation} onValueChange={setPropertyLocation}>
                  <SelectTrigger id="property-location">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="delhi">Delhi NCR</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="telangana">Telangana</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                    <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="other">Other States</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="property-value">Property Value (₹ in lakhs)</Label>
                <Input 
                  id="property-value" 
                  placeholder="e.g., 5000" 
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(e.target.value)}
                />
              </div>
              
              {(transactionType === 'purchase-primary' || propertyType === 'residential-apartment' || propertyType === 'residential-villa') && (
                <div className="space-y-2">
                  <Label>Is the property RERA registered?</Label>
                  <RadioGroup 
                    value={isRERARegistered} 
                    onValueChange={setIsRERARegistered}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="rera-yes" />
                      <Label htmlFor="rera-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="rera-no" />
                      <Label htmlFor="rera-no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-applicable" id="rera-na" />
                      <Label htmlFor="rera-na">Not Applicable</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              
              <Button className="w-full mt-2" onClick={handleAnalyze}>
                Analyze Legal Requirements
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <LandPlot className="h-5 w-5 text-blue-600" />
                Real Estate Legal Analysis
              </CardTitle>
              <CardDescription>
                For {transactionType.replace('-', ' ')} of {propertyType.replace('-', ' ')} in {propertyLocation.replace('-', ' ')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              {/* RERA Compliance Section */}
              {(transactionType === 'purchase-primary' || propertyType.includes('residential')) && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">RERA Compliance</h3>
                    <Badge className={`${isRERARegistered === 'no' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {isRERARegistered === 'no' ? 'High Risk' : isRERARegistered === 'yes' ? 'Compliant' : 'Not Applicable'}
                    </Badge>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${isRERARegistered === 'no' ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/30' : 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30'}`}>
                    {isRERARegistered === 'yes' && (
                      <div className="space-y-3 text-sm">
                        <p className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Verify the RERA registration number on the official state RERA website</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Check project completion timeline and quarterly updates submitted by the developer</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Review approved project plans and specifications on the RERA portal</span>
                        </p>
                      </div>
                    )}
                    
                    {isRERARegistered === 'no' && (
                      <div className="space-y-3 text-sm">
                        <p className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span><strong>High Risk:</strong> Purchasing an unregistered project can lead to significant legal complications</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>RERA registration is mandatory for projects above 500 sq.m. or 8 apartments</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Consider consulting a real estate attorney before proceeding</span>
                        </p>
                      </div>
                    )}
                    
                    {isRERARegistered === 'not-applicable' && (
                      <div className="space-y-3 text-sm">
                        <p>RERA registration may not be applicable for this property type or transaction.</p>
                        <p>However, verify if exemption criteria are met under the relevant state RERA rules.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Stamp Duty & Registration Section */}
              <div>
                <h3 className="font-medium mb-3">Stamp Duty & Registration</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Stamp Duty</p>
                      <p className="font-semibold text-lg">₹{calculateStampDuty()} lakhs</p>
                      {propertyLocation === 'maharashtra' && propertyType.includes('residential') && (
                        <p className="text-xs text-green-600 mt-1">1% concession for women buyers</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Registration Fee</p>
                      <p className="font-semibold text-lg">₹{calculateRegistrationFee()} lakhs</p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="text-sm space-y-1">
                    <p className="font-medium">Payment Process:</p>
                    <ul className="space-y-1 mt-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Payable at the time of document registration at Sub-Registrar's office</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Online payment facility available on the state's registration department website</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>Must be paid within 4 months of document execution</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Essential Documents Section */}
              <div>
                <h3 className="font-medium mb-3">Essential Documents Checklist</h3>
                <div className="space-y-2">
                  {transactionType.includes('purchase') && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="font-medium mb-2">Primary Documents</p>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Title Deed / Sale Deed</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Encumbrance Certificate (last 13 years)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Property Tax Receipts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Approved Building Plan</span>
                        </li>
                        {transactionType === 'purchase-primary' && (
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Builder-Buyer Agreement</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {transactionType === 'sale' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="font-medium mb-2">Documents for Sellers</p>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Original Title Deed / Sale Deed</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>NOC from Housing Society / Association</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Latest Tax Paid Receipts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>NOC from Bank (if mortgaged)</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {transactionType === 'lease' && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <p className="font-medium mb-2">Lease/Rental Requirements</p>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Notarized Rental Agreement</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Proof of Ownership of Landlord</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>ID Proofs of Both Parties</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tax Implications Section */}
              {(transactionType === 'purchase-resale' || transactionType === 'sale') && (
                <div>
                  <h3 className="font-medium mb-3">Tax Implications</h3>
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30">
                    <div className="space-y-3 text-sm">
                      {transactionType === 'sale' && (
                        <>
                          <p className="font-medium">Capital Gains Tax</p>
                          <ul className="space-y-1 ml-5 list-disc">
                            <li>Short-term capital gains (held for less than 24 months): Taxed at your income tax slab rate</li>
                            <li>Long-term capital gains (held for more than 24 months): 20% with indexation benefits</li>
                            <li>Exemption available under Section 54/54F if reinvested in another property</li>
                          </ul>
                        </>
                      )}
                      
                      {transactionType === 'purchase-resale' && (
                        <>
                          <p className="font-medium">TDS Requirements</p>
                          <ul className="space-y-1 ml-5 list-disc">
                            <li>1% TDS deduction required if property value exceeds ₹50 lakhs</li>
                            <li>PAN details of both buyer and seller required</li>
                            <li>TDS to be deposited within 7 days of the end of the month of deduction</li>
                            <li>Form 26QB to be filed for TDS payment</li>
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setActiveTab('analyzer')}
              >
                Analyze Another Property
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  toast({
                    title: "Report Generated",
                    description: "Your real estate legal report has been prepared.",
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

export default RealEstateLawPage;
