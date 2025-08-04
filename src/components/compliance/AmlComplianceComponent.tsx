import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, FileText, CheckCircle, Loader2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RiskFactor {
  title: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: string;
  action: string;
}

const AmlComplianceComponent = () => {
  const [activeTab, setActiveTab] = useState('assessment');
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [businessDetails, setBusinessDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);

  const { toast: showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName || !businessType || !jurisdiction || !businessDetails) {
      showToast({
        title: "Missing Information",
        description: "Please fill in all fields before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedRiskFactors = generateRiskFactors();
      setRiskFactors(generatedRiskFactors);
      setShowResults(true);
      setActiveTab('results');
      
      showToast({
        title: "AML Assessment Complete",
        description: "Risk assessment has been generated successfully"
      });
    } catch (error) {
      showToast({
        title: "Assessment Failed",
        description: "There was an error generating the assessment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateRiskFactors = (): RiskFactor[] => {
    const factors: RiskFactor[] = [];
    
    // Risk assessment based on business type
    if (businessType === 'cryptocurrency') {
      factors.push({
        title: 'High-Risk Business Category',
        description: 'Cryptocurrency businesses are classified as high-risk for money laundering',
        riskLevel: 'high',
        recommendation: 'Implement enhanced due diligence procedures',
        action: 'Establish comprehensive KYC procedures and transaction monitoring'
      });
    }
    
    if (businessType === 'real-estate') {
      factors.push({
        title: 'Cash-Intensive Business',
        description: 'Real estate transactions often involve large cash payments',
        riskLevel: 'medium',
        recommendation: 'Monitor large cash transactions and verify source of funds',
        action: 'Implement suspicious transaction reporting procedures'
      });
    }
    
    if (businessType === 'banking') {
      factors.push({
        title: 'Financial Institution Requirements',
        description: 'Banks must comply with comprehensive AML regulations',
        riskLevel: 'high',
        recommendation: 'Ensure full compliance with RBI guidelines',
        action: 'Regular training and audit of AML procedures'
      });
    }
    
    // Jurisdiction-specific factors
    if (jurisdiction === 'india') {
      factors.push({
        title: 'Indian Regulatory Compliance',
        description: 'Must comply with Prevention of Money Laundering Act (PMLA) 2002',
        riskLevel: 'medium',
        recommendation: 'Implement PMLA compliance framework',
        action: 'Regular reporting to Financial Intelligence Unit India (FIU-IND)'
      });
    }
    
    if (jurisdiction === 'international') {
      factors.push({
        title: 'Cross-Border Transaction Risk',
        description: 'International transactions require enhanced monitoring',
        riskLevel: 'high',
        recommendation: 'Implement enhanced due diligence for international clients',
        action: 'Monitor transactions against sanctions lists'
      });
    }
    
    // Default factors
    factors.push({
      title: 'Customer Due Diligence',
      description: 'All businesses must verify customer identity',
      riskLevel: 'low',
      recommendation: 'Implement standard KYC procedures',
      action: 'Collect and verify customer identification documents'
    });

    return factors;
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
              <Shield className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">AML & KYC Compliance Checker</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Assess your business for anti-money laundering compliance requirements and generate tailored compliance recommendations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="assessment">Risk Assessment</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="assessment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AML Risk Assessment</CardTitle>
              <CardDescription>
                Provide details about your business to receive a customized AML compliance assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      placeholder="Enter your company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="business-type">Business Type</Label>
                    <Select value={businessType} onValueChange={setBusinessType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banking">Banking</SelectItem>
                        <SelectItem value="cryptocurrency">Cryptocurrency</SelectItem>
                        <SelectItem value="real-estate">Real Estate</SelectItem>
                        <SelectItem value="jewelry">Jewelry/Precious Metals</SelectItem>
                        <SelectItem value="money-services">Money Services</SelectItem>
                        <SelectItem value="casino">Gaming/Casino</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="jurisdiction">Primary Jurisdiction</Label>
                  <Select value={jurisdiction} onValueChange={setJurisdiction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="usa">United States</SelectItem>
                      <SelectItem value="eu">European Union</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="international">International/Multi-jurisdiction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="business-details">Business Details</Label>
                  <Textarea
                    id="business-details"
                    placeholder="Describe your business model, customer base, transaction types, and any specific compliance concerns..."
                    value={businessDetails}
                    onChange={(e) => setBusinessDetails(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Assessment...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate AML Assessment
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {showResults ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>AML Risk Assessment Results</CardTitle>
                  <CardDescription>
                    Risk factors and compliance recommendations for {companyName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    {riskFactors.map((factor, index) => (
                      <Alert key={index}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="flex items-center gap-2">
                          {factor.title}
                          <Badge className={getRiskColor(factor.riskLevel)}>
                            {factor.riskLevel} risk
                          </Badge>
                        </AlertTitle>
                        <AlertDescription>
                          <p className="mb-2">{factor.description}</p>
                          <div className="text-sm">
                            <p><strong>Recommendation:</strong> {factor.recommendation}</p>
                            <p><strong>Action Required:</strong> {factor.action}</p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                    <Button>
                      Schedule Consultation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Complete the risk assessment to view your results here.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AML Compliance Resources</CardTitle>
              <CardDescription>
                Essential resources for anti-money laundering compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Indian Regulations</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Prevention of Money Laundering Act (PMLA) 2002</li>
                      <li>RBI Master Directions on KYC</li>
                      <li>FIU-IND Reporting Requirements</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>International Standards</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>FATF Recommendations</li>
                      <li>Basel Committee Guidelines</li>
                      <li>Wolfsberg Principles</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Key Requirements</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Customer Due Diligence (CDD)</li>
                      <li>Enhanced Due Diligence (EDD)</li>
                      <li>Suspicious Transaction Reporting</li>
                      <li>Record Keeping</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Best Practices</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Regular Risk Assessments</li>
                      <li>Staff Training Programs</li>
                      <li>Technology Solutions</li>
                      <li>Third-Party Audits</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AmlComplianceComponent;