
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertTriangle, CheckCircle, FileText, Info, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface RiskFactor {
  title: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: string;
  action: string;
}

const AMLComplianceTool = () => {
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [businessDetails, setBusinessDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState('assessment');
  
  // Sample risk factors
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName || !businessType || !jurisdiction) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate risk factors based on inputs
      generateRiskFactors();
      setLoading(false);
      setShowResults(true);
      setActiveTab('results');
      toast.success('AML compliance analysis completed');
    }, 2000);
  };
  
  const generateRiskFactors = () => {
    const generatedFactors: RiskFactor[] = [];
    
    // Business type related risks
    if (businessType === 'financial_services') {
      generatedFactors.push({
        title: 'High-volume transactions',
        description: 'Financial services businesses process a large number of transactions daily, increasing AML risk exposure.',
        riskLevel: 'high',
        recommendation: 'Implement automated transaction monitoring system with custom thresholds.',
        action: 'Deploy a real-time transaction monitoring solution with AI capabilities.'
      });
    } else if (businessType === 'real_estate') {
      generatedFactors.push({
        title: 'Property valuation discrepancies',
        description: 'Real estate transactions can be used to launder money through price manipulation.',
        riskLevel: 'medium',
        recommendation: 'Establish independent valuation protocols for all transactions.',
        action: 'Engage third-party valuation experts for transactions above ₹1 crore.'
      });
    } else if (businessType === 'legal_services') {
      generatedFactors.push({
        title: 'Client trust accounts',
        description: 'Legal professionals handle client funds which could pose AML risks.',
        riskLevel: 'medium',
        recommendation: 'Implement strict KYC for all clients utilizing trust accounts.',
        action: 'Create a dedicated compliance role to oversee client onboarding and fund movements.'
      });
    }
    
    // Jurisdiction related risks
    if (jurisdiction === 'delhi_ncr') {
      generatedFactors.push({
        title: 'Proximity to cross-border trade',
        description: 'Delhi NCR has significant international trade activity that may increase AML risk exposure.',
        riskLevel: 'medium',
        recommendation: 'Enhanced due diligence for international business relationships.',
        action: 'Implement country risk scoring system for all international clients.'
      });
    } else if (jurisdiction === 'mumbai') {
      generatedFactors.push({
        title: 'Financial hub exposure',
        description: 'As India\'s financial capital, Mumbai businesses face higher scrutiny for AML compliance.',
        riskLevel: 'high',
        recommendation: 'Adopt banking industry-grade AML protocols.',
        action: 'Implement quarterly AML audits and regular staff training.'
      });
    }
    
    // Common risk factors
    generatedFactors.push({
      title: 'Customer identification program',
      description: 'PMLA requires robust customer identification procedures.',
      riskLevel: businessType === 'financial_services' ? 'high' : 'medium',
      recommendation: 'Implement comprehensive KYC procedures aligned with RBI guidelines.',
      action: 'Deploy digital KYC system with biometric verification capabilities.'
    });
    
    generatedFactors.push({
      title: 'Record keeping compliance',
      description: 'Indian AML regulations require maintaining records for a minimum of 5 years.',
      riskLevel: 'low',
      recommendation: 'Establish secure document retention system with appropriate access controls.',
      action: 'Implement automated document archival system with retention policies.'
    });
    
    generatedFactors.push({
      title: 'Suspicious Transaction Reporting',
      description: 'Obligation to report suspicious transactions to Financial Intelligence Unit-India (FIU-IND).',
      riskLevel: 'high',
      recommendation: 'Establish clear protocols for identifying and reporting suspicious activities.',
      action: 'Create an internal suspicious activity committee and implement reporting templates.'
    });
    
    setRiskFactors(generatedFactors);
  };
  
  const getRiskColor = (level: string) => {
    switch(level) {
      case 'high':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30';
      case 'medium':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30';
      case 'low':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30';
      default:
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30';
    }
  };
  
  const getRiskLevelIcon = (level: string) => {
    switch(level) {
      case 'high':
        return <AlertTriangle className="h-5 w-5" />;
      case 'medium':
        return <Clock className="h-5 w-5" />;
      case 'low':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };
  
  // Count risks by level
  const highRisks = riskFactors.filter(risk => risk.riskLevel === 'high').length;
  const mediumRisks = riskFactors.filter(risk => risk.riskLevel === 'medium').length;
  const lowRisks = riskFactors.filter(risk => risk.riskLevel === 'low').length;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="results" disabled={!showResults}>Results</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assessment">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                AML Risk Assessment Form
              </CardTitle>
              <CardDescription>
                Provide information about your business to receive a personalized AML compliance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company/Business Name</Label>
                    <Input
                      id="companyName"
                      placeholder="Enter your company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select value={businessType} onValueChange={setBusinessType} required>
                      <SelectTrigger id="businessType">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="financial_services">Financial Services</SelectItem>
                        <SelectItem value="real_estate">Real Estate</SelectItem>
                        <SelectItem value="legal_services">Legal Services</SelectItem>
                        <SelectItem value="accounting">Accounting</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="hospitality">Hospitality</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="jurisdiction">Primary Jurisdiction</Label>
                    <Select value={jurisdiction} onValueChange={setJurisdiction} required>
                      <SelectTrigger id="jurisdiction">
                        <SelectValue placeholder="Select primary jurisdiction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delhi_ncr">Delhi-NCR</SelectItem>
                        <SelectItem value="mumbai">Mumbai</SelectItem>
                        <SelectItem value="bangalore">Bangalore</SelectItem>
                        <SelectItem value="hyderabad">Hyderabad</SelectItem>
                        <SelectItem value="chennai">Chennai</SelectItem>
                        <SelectItem value="kolkata">Kolkata</SelectItem>
                        <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                        <SelectItem value="pune">Pune</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="businessDetails">Business Operations Details (Optional)</Label>
                    <Textarea
                      id="businessDetails"
                      placeholder="Describe your business operations, client types, transaction volumes, etc."
                      value={businessDetails}
                      onChange={(e) => setBusinessDetails(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md border border-amber-200 dark:border-amber-800/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-400">Data Privacy Notice</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Information provided will be used solely for analysis purposes. No data will be stored or shared with third parties without consent.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                type="submit" 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing
                  </>
                ) : "Generate AML Analysis"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          {showResults && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    AML Compliance Analysis: {companyName}
                  </CardTitle>
                  <CardDescription>
                    Analysis based on {businessType.replace('_', ' ')} operations in {jurisdiction.replace('_', ' ')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Risk Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-red-600 font-medium">High Risk Factors</p>
                          <p className="text-2xl font-bold text-red-700 dark:text-red-400">{highRisks}</p>
                        </div>
                        <AlertTriangle className="h-12 w-12 text-red-500 opacity-80" />
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-amber-600 font-medium">Medium Risk Factors</p>
                          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{mediumRisks}</p>
                        </div>
                        <Clock className="h-12 w-12 text-amber-500 opacity-80" />
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">Low Risk Factors</p>
                          <p className="text-2xl font-bold text-green-700 dark:text-green-400">{lowRisks}</p>
                        </div>
                        <CheckCircle className="h-12 w-12 text-green-500 opacity-80" />
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Detailed Risk Factors */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Detailed Risk Analysis</h3>
                    
                    {riskFactors.map((risk, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="border">
                          <CardHeader className={`pb-3 ${getRiskColor(risk.riskLevel)}`}>
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-full bg-white/80 dark:bg-black/10">
                                {getRiskLevelIcon(risk.riskLevel)}
                              </div>
                              <div>
                                <CardTitle className="text-lg">
                                  {risk.title}
                                </CardTitle>
                                <div className="flex items-center mt-1">
                                  <Badge variant="outline" className={getRiskColor(risk.riskLevel)}>
                                    {risk.riskLevel.toUpperCase()} RISK
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4 pb-3 space-y-3">
                            <div>
                              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Risk Description:</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{risk.description}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Recommendation:</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{risk.recommendation}</p>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0 pb-4">
                            <div className="w-full">
                              <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Suggested Action:</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{risk.action}</p>
                            </div>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button variant="outline" onClick={() => window.print()}>
                    <FileText className="mr-2 h-4 w-4" />
                    Download PDF Report
                  </Button>
                  <Button onClick={() => setActiveTab('resources')}>
                    View Compliance Resources
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </TabsContent>
        
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Indian AML Compliance Resources
              </CardTitle>
              <CardDescription>
                Official guidelines and resources for AML compliance in India
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">Prevention of Money Laundering Act (PMLA)</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      The primary legislation governing AML compliance in India.
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => window.open('https://fiuindia.gov.in/pdfs/pmla_act.pdf', '_blank')}>
                      View Full Act
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">Financial Intelligence Unit - India (FIU-IND)</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Central agency for receiving and analyzing suspicious transaction reports.
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => window.open('https://fiuindia.gov.in/', '_blank')}>
                      Visit Website
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">RBI Guidelines on KYC/AML</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Reserve Bank of India's guidelines for financial institutions.
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => window.open('https://www.rbi.org.in/Scripts/BS_FemaNotifications.aspx?Id=11566', '_blank')}>
                      Access Guidelines
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">SEBI AML Guidelines</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Securities and Exchange Board of India's AML directives.
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => window.open('https://www.sebi.gov.in/legal/circulars/oct-2019/master-circular-on-anti-money-laundering-and-combating-financing-of-terrorism-obligations-of-securities-market-intermediaries-under-the-prevention-of-money-laundering-act-2002-and-rules-framed-there-_44867.html', '_blank')}>
                      View Master Circular
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800/30 mt-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-400">Compliance Training</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                      Regular staff training is a key requirement under Indian AML regulations.
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Consider implementing a structured training program to ensure all relevant staff understand their AML obligations.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AMLComplianceTool;
