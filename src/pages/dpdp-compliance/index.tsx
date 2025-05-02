
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Shield, Lock, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AnalysisResult } from '@/components/practice-area-tools/base/BaseAnalyzer';
import { BaseAnalyzer } from '@/components/practice-area-tools/base';
import BackToToolsButton from '@/components/practice-areas/BackToToolsButton';
import { Badge } from '@/components/ui/badge';

const DPDPCompliancePage = () => {
  const [businessType, setBusinessType] = useState<string>("");
  const [dataProcessed, setDataProcessed] = useState<string[]>([]);
  const [policyDetails, setPolicyDetails] = useState<string>("");
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [activeTab, setActiveTab] = useState<string>("assessment");
  const [showChecklist, setShowChecklist] = useState<boolean>(false);

  const dataTypes = [
    { value: "pii", label: "Personal Identifiable Information" },
    { value: "financial", label: "Financial Data" },
    { value: "health", label: "Health Data" },
    { value: "biometric", label: "Biometric Data" },
    { value: "children", label: "Children's Data" },
    { value: "location", label: "Location Data" }
  ];

  const businessTypes = [
    { value: "fintech", label: "Fintech / Banking" },
    { value: "healthcare", label: "Healthcare" },
    { value: "ecommerce", label: "E-Commerce" },
    { value: "education", label: "Education" },
    { value: "social", label: "Social Media / Content" },
    { value: "saas", label: "SaaS / Enterprise" },
    { value: "other", label: "Other" },
  ];

  const handleDataTypeChange = (checked: boolean, value: string) => {
    setDataProcessed(prev => 
      checked 
        ? [...prev, value]
        : prev.filter(type => type !== value)
    );
  };

  const analyzeDPDPCompliance = () => {
    if (!businessType) {
      setAnalysisResults([{
        title: "Business Type Required",
        description: "Please select your business type to continue with the analysis.",
        severity: "info"
      }]);
      return;
    }

    if (dataProcessed.length === 0) {
      setAnalysisResults([{
        title: "Data Types Required",
        description: "Please select at least one type of data that your business processes.",
        severity: "info"
      }]);
      return;
    }

    const results: AnalysisResult[] = [];

    // Basic compliance checks
    results.push({
      title: "DPDP Act Applicability Confirmed",
      description: "Based on your inputs, your business is subject to the Digital Personal Data Protection Act, 2023.",
      severity: "info"
    });

    // Analyze based on data types
    if (dataProcessed.includes("pii")) {
      results.push({
        title: "Notice and Consent Requirements",
        description: "You must provide clear notice and obtain explicit consent before collecting personal identifiable information.",
        severity: "medium"
      });
    }

    if (dataProcessed.includes("financial")) {
      results.push({
        title: "Financial Data Protection",
        description: "Financial data requires additional safeguards and compliance with RBI guidelines alongside DPDP Act requirements.",
        severity: "high"
      });
    }

    if (dataProcessed.includes("health")) {
      results.push({
        title: "Health Data Sensitivity",
        description: "Health data is classified as sensitive personal data under the DPDP Act and requires enhanced protection measures.",
        severity: "high"
      });
    }

    if (dataProcessed.includes("biometric")) {
      results.push({
        title: "Biometric Data Restrictions",
        description: "Biometric data collection requires explicit consent, purpose limitation, and enhanced security measures.",
        severity: "high"
      });
    }

    if (dataProcessed.includes("children")) {
      results.push({
        title: "Children's Data Protection",
        description: "Processing children's data requires verifiable parental consent and child-friendly privacy notices.",
        severity: "high"
      });
    }

    // Business-specific recommendations
    if (businessType === "fintech") {
      results.push({
        title: "Fintech Compliance Requirements",
        description: "Ensure compliance with both DPDP Act and RBI's Customer Data Protection guidelines.",
        severity: "medium"
      });
    } else if (businessType === "healthcare") {
      results.push({
        title: "Healthcare Data Compliance",
        description: "Implement specialized safeguards for patient data in compliance with both DPDP and healthcare regulations.",
        severity: "medium"
      });
    } else if (businessType === "ecommerce") {
      results.push({
        title: "E-Commerce Data Collection",
        description: "Review your cookie policy and ensure transparency about all data collection during user browsing and purchasing.",
        severity: "medium"
      });
    }

    // Policy check
    if (!policyDetails || policyDetails.length < 50) {
      results.push({
        title: "Privacy Policy Review Needed",
        description: "Your privacy policy requires a comprehensive review to ensure DPDP Act compliance.",
        severity: "medium"
      });
    }

    setAnalysisResults(results);
    setShowChecklist(true);
    setActiveTab("results");
  };

  return (
    <LegalToolLayout
      title="DPDP Compliance Assistant"
      description="Ensure your business complies with India's Digital Personal Data Protection Act, 2023"
      icon={<Shield className="h-6 w-6 text-blue-600" />}
    >
      <BackToToolsButton className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-blue-100 dark:border-blue-900/20 shadow-sm">
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="assessment">Assessment</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>
                
                <TabsContent value="assessment" className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="business-type">Business Type</Label>
                      <Select value={businessType} onValueChange={setBusinessType}>
                        <SelectTrigger id="business-type" className="mt-1.5">
                          <SelectValue placeholder="Select your business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">What types of data do you process?</h3>
                      <div className="space-y-3">
                        {dataTypes.map(type => (
                          <div key={type.value} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`data-type-${type.value}`} 
                              checked={dataProcessed.includes(type.value)}
                              onCheckedChange={(checked) => 
                                handleDataTypeChange(checked as boolean, type.value)
                              }
                            />
                            <Label htmlFor={`data-type-${type.value}`}>{type.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="policy-details" className="mb-1.5 block">
                        Current Privacy Policy Details
                      </Label>
                      <Textarea
                        id="policy-details"
                        placeholder="Paste your current privacy policy highlights or describe your data handling practices..."
                        className="min-h-[120px]"
                        value={policyDetails}
                        onChange={(e) => setPolicyDetails(e.target.value)}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button onClick={analyzeDPDPCompliance} className="w-full">
                        Analyze DPDP Compliance
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="results" className="space-y-6 pt-6">
                  {analysisResults.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium mb-3">Compliance Analysis Results</h3>
                      <div className="space-y-3">
                        {analysisResults.map((result, index) => {
                          let icon;
                          let bgColor;
                          
                          switch(result.severity) {
                            case 'high':
                              icon = <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />;
                              bgColor = "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/20";
                              break;
                            case 'medium':
                              icon = <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />;
                              bgColor = "bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/20";
                              break;
                            case 'low':
                              icon = <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />;
                              bgColor = "bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800/20";
                              break;
                            default:
                              icon = <Info className="h-5 w-5 text-blue-500 shrink-0" />;
                              bgColor = "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/20";
                          }
                          
                          return (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`p-4 rounded-md border ${bgColor}`}
                            >
                              <div className="flex gap-3">
                                {icon}
                                <div>
                                  <h4 className="font-medium text-sm">{result.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                      
                      {showChecklist && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-6 p-4 border rounded-md bg-blue-50/50 dark:bg-blue-900/5"
                        >
                          <h3 className="text-base font-medium mb-3 flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                            DPDP Compliance Checklist
                          </h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20">Required</Badge>
                              <span>Appoint a Data Protection Officer</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20">Required</Badge>
                              <span>Create a comprehensive Privacy Policy</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20">Required</Badge>
                              <span>Implement data consent mechanisms</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20">Required</Badge>
                              <span>Enable data access & correction requests</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20">Recommended</Badge>
                              <span>Conduct periodic Data Protection Impact Assessments</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20">Recommended</Badge>
                              <span>Document data processing activities</span>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Complete the assessment to view your DPDP compliance results.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setActiveTab("assessment")}
                      >
                        Go to Assessment
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-blue-100 dark:border-blue-900/20 h-full">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium">About DPDP Act 2023</h3>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  India's Digital Personal Data Protection Act (DPDP) of 2023 establishes a comprehensive framework for the processing of digital personal data in India.
                </p>
                
                <div className="space-y-2 pt-2">
                  <h4 className="text-sm font-medium">Key Provisions:</h4>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-1">•</span>
                      <span>Consent requirements for data collection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-1">•</span>
                      <span>Data Principal rights (access, correction)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-1">•</span>
                      <span>Obligations of Data Fiduciaries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-1">•</span>
                      <span>Data breach notification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-1">•</span>
                      <span>Significant penalties for non-compliance</span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground italic">
                    Note: This tool provides guidance but does not constitute legal advice. Consult with a legal expert for your specific compliance needs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </LegalToolLayout>
  );
};

export default DPDPCompliancePage;
