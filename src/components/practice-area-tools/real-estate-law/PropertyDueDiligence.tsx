
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseAnalyzer, AnalysisResult } from '../base';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { FileCheck, CheckCircle2, AlertTriangle, XCircle, Clock, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const propertyDueDiligenceSchema = z.object({
  propertyName: z.string().min(1, { message: "Property name is required" }),
  propertyAddress: z.string().min(5, { message: "Property address is required" }),
  propertyType: z.string(),
  propertyState: z.string().min(2, { message: "State is required" }),
  propertyDistrict: z.string().min(2, { message: "District is required" }),
  sellerName: z.string().min(2, { message: "Seller name is required" }),
  propertyValue: z.string().min(1, { message: "Property value is required" }),
  transactionType: z.string(),
  dueDiligenceScope: z.object({
    titleCheck: z.boolean().default(true),
    encumbrancesCheck: z.boolean().default(true),
    approvalCheck: z.boolean().default(true),
    taxCheck: z.boolean().default(true),
    utilityCheck: z.boolean().default(true),
    environmentalCheck: z.boolean().default(true),
    litigationCheck: z.boolean().default(true),
  }),
  additionalNotes: z.string().optional(),
});

type PropertyDueDiligenceFormValues = z.infer<typeof propertyDueDiligenceSchema>;

const defaultValues: PropertyDueDiligenceFormValues = {
  propertyName: "",
  propertyAddress: "",
  propertyType: "residential",
  propertyState: "",
  propertyDistrict: "",
  sellerName: "",
  propertyValue: "",
  transactionType: "purchase",
  dueDiligenceScope: {
    titleCheck: true,
    encumbrancesCheck: true,
    approvalCheck: true,
    taxCheck: true,
    utilityCheck: true,
    environmentalCheck: true,
    litigationCheck: true,
  },
  additionalNotes: "",
};

const PropertyDueDiligence = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<string>("summary");
  
  const form = useForm<PropertyDueDiligenceFormValues>({
    resolver: zodResolver(propertyDueDiligenceSchema),
    defaultValues,
  });
  
  const onSubmit = (values: PropertyDueDiligenceFormValues) => {
    setIsAnalyzing(true);
    console.log("Due Diligence Values:", values);
    
    // Simulate API call for analysis
    setTimeout(() => {
      // Mock due diligence results
      setAnalysisResult({
        status: "completed",
        data: {
          summary: {
            propertyName: values.propertyName,
            propertyType: values.propertyType,
            overallRiskScore: 73,
            majorRedFlags: 2,
            minorRedFlags: 4,
            completionDate: new Date().toISOString(),
          },
          titleCheck: {
            status: "critical-issues",
            score: 60,
            findings: [
              {
                issue: "Title Chain Gap",
                severity: "high",
                description: "Gap in title chain documentation between 2005-2008"
              },
              {
                issue: "Ownership Dispute Notice",
                severity: "high",
                description: "Notice of dispute filed by claiming ancestral ownership rights"
              },
              {
                issue: "Title Documents",
                severity: "medium",
                description: "Title documents are over 40 years old and require verification from land records office"
              }
            ]
          },
          encumbrancesCheck: {
            status: "minor-issues",
            score: 80,
            findings: [
              {
                issue: "Existing Mortgage",
                severity: "medium",
                description: "Property has an active mortgage with ABC Bank Ltd. (Loan #78954)"
              },
              {
                issue: "Tax Lien",
                severity: "low",
                description: "Property tax arrears from FY 2022-23 amounting to Rs. 45,000"
              }
            ]
          },
          approvalCheck: {
            status: "compliant",
            score: 95,
            findings: [
              {
                issue: "Building Approval",
                severity: "compliant",
                description: "Building plan approved by municipal authority on 12-Mar-2018"
              },
              {
                issue: "Occupancy Certificate",
                severity: "compliant",
                description: "Occupancy certificate issued and valid"
              }
            ]
          },
          taxCheck: {
            status: "minor-issues",
            score: 85,
            findings: [
              {
                issue: "Property Tax",
                severity: "low",
                description: "Property tax paid until FY 2022-23; current year pending"
              }
            ]
          },
          utilityCheck: {
            status: "compliant",
            score: 100,
            findings: [
              {
                issue: "Water Connection",
                severity: "compliant",
                description: "Water connection active with no dues"
              },
              {
                issue: "Electricity Connection",
                severity: "compliant",
                description: "Electricity connection active with no dues"
              }
            ]
          },
          environmentalCheck: {
            status: "minor-issues",
            score: 70,
            findings: [
              {
                issue: "Flood Zone",
                severity: "medium",
                description: "Property located in Zone III (moderate flood risk)"
              },
              {
                issue: "Environmental Clearance",
                severity: "low",
                description: "Environmental clearance approval obtained but renewal due in 6 months"
              }
            ]
          },
          litigationCheck: {
            status: "critical-issues",
            score: 50,
            findings: [
              {
                issue: "Pending Litigation",
                severity: "high",
                description: "Civil Suit No. 456/2022 pending in District Court regarding boundary dispute"
              },
              {
                issue: "Land Acquisition Notice",
                severity: "medium",
                description: "Government has issued preliminary notification for road widening affecting 5% of property area"
              }
            ]
          },
          recommendations: [
            "Obtain indemnity bond from seller regarding title chain gap (2005-2008)",
            "Verify status of ownership dispute claim in District Court records",
            "Clear all property tax dues before transaction",
            "Conduct physical inspection of boundaries to assess impact of land acquisition notice",
            "Obtain NOC from ABC Bank regarding existing mortgage",
            "Include specific clause in sale deed regarding pending litigation",
            "Investigate flood risk mitigation measures already implemented"
          ],
          documents: {
            required: [
              "Original Sale Deed",
              "Encumbrance Certificate for last 30 years",
              "Property Tax Receipts for last 3 years",
              "Approved Building Plan",
              "Occupancy Certificate",
              "NOC from Bank (for existing mortgage)",
              "Land Survey Report",
              "Mutation Records",
              "Record of Rights (RTC/Patta)"
            ],
            verified: [
              "Approved Building Plan",
              "Occupancy Certificate",
              "Property Tax Receipts (till 2022)",
              "Mutation Records",
              "Record of Rights (RTC/Patta)"
            ],
            pending: [
              "Original Sale Deed",
              "Encumbrance Certificate for last 30 years",
              "NOC from Bank",
              "Land Survey Report"
            ]
          }
        }
      });
      setIsAnalyzing(false);
    }, 3000);
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'compliant': return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400";
      case 'minor-issues': return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400";
      case 'critical-issues': return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400";
      case 'medium': return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400";
      case 'low': return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
      case 'compliant': return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400";
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'compliant': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'minor-issues': return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'critical-issues': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };
  
  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'high': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'low': return <Info className="h-4 w-4 text-blue-600" />;
      case 'compliant': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };
  
  const resetAnalysis = () => {
    setAnalysisResult(null);
    form.reset();
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-600";
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-600";
  };

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;
    
    const { data } = analysisResult;
    const { summary, titleCheck, encumbrancesCheck, approvalCheck, taxCheck, utilityCheck, environmentalCheck, litigationCheck, recommendations, documents } = data;
    
    const allChecks = [
      { name: "Title Check", data: titleCheck, key: "titleCheck" },
      { name: "Encumbrances Check", data: encumbrancesCheck, key: "encumbrancesCheck" },
      { name: "Approvals Check", data: approvalCheck, key: "approvalCheck" },
      { name: "Tax Check", data: taxCheck, key: "taxCheck" },
      { name: "Utility Check", data: utilityCheck, key: "utilityCheck" },
      { name: "Environmental Check", data: environmentalCheck, key: "environmentalCheck" },
      { name: "Litigation Check", data: litigationCheck, key: "litigationCheck" }
    ];
    
    return (
      <div className="space-y-6 mt-6">
        <Tabs value={activeResultTab} onValueChange={setActiveResultTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Findings</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Due Diligence Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Property</h4>
                    <p className="font-medium">{summary.propertyName}</p>
                    <p className="text-sm text-muted-foreground capitalize">{summary.propertyType}</p>
                  </div>
                  <div className="mt-4 sm:mt-0 text-right">
                    <div className="text-3xl font-bold mb-1">
                      {summary.overallRiskScore}/100
                    </div>
                    <p className="text-sm text-muted-foreground">Overall Risk Score</p>
                    <Progress 
                      value={summary.overallRiskScore} 
                      className={`h-2 mt-1 w-32 ${getScoreColor(summary.overallRiskScore)}`} 
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Risk Indicators</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Major Red Flags</span>
                        <Badge variant="outline" className={summary.majorRedFlags > 0 ? 
                          "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400" : 
                          "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400"
                        }>
                          {summary.majorRedFlags}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Minor Red Flags</span>
                        <Badge variant="outline" className={
                          "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                        }>
                          {summary.minorRedFlags}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Critical Areas</h4>
                    <div className="mt-2 space-y-2">
                      {allChecks
                        .filter(check => check.data.status === 'critical-issues')
                        .map((check, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-sm">{check.name}</span>
                          </div>
                        ))
                      }
                      {allChecks.filter(check => check.data.status === 'critical-issues').length === 0 && (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm">No critical areas</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Key Recommendations</h4>
                  <ul className="space-y-1 list-disc pl-5">
                    {recommendations.slice(0, 3).map((rec, idx) => (
                      <li key={idx} className="text-sm">{rec}</li>
                    ))}
                    {recommendations.length > 3 && (
                      <li className="text-sm text-muted-foreground">
                        <button 
                          className="text-blue-600 hover:underline"
                          onClick={() => setActiveResultTab("detailed")}
                        >
                          + {recommendations.length - 3} more recommendations
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {allChecks.map((check, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 border rounded-md flex items-center justify-between"
                      onClick={() => setActiveResultTab("detailed")}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(check.data.status)}
                        <span className="text-sm">{check.name}</span>
                      </div>
                      <Badge variant="outline" className={getStatusColor(check.data.status)}>
                        {check.data.score}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="detailed" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-blue-600" />
                  Detailed Due Diligence Findings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {allChecks.map((check, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-medium flex items-center gap-2">
                        {getStatusIcon(check.data.status)}
                        {check.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(check.data.status)}>
                          {check.data.status.replace(/-/g, ' ')}
                        </Badge>
                        <span className="font-semibold">{check.data.score}%</span>
                      </div>
                    </div>
                    
                    <div className="pl-6 space-y-2">
                      {check.data.findings.map((finding, fidx) => (
                        <div 
                          key={fidx}
                          className="border rounded-md p-3 bg-white dark:bg-zinc-800"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium flex items-center gap-2">
                              {getSeverityIcon(finding.severity)}
                              {finding.issue}
                            </div>
                            <Badge variant="outline" className={getSeverityColor(finding.severity)}>
                              {finding.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground pl-6">
                            {finding.description}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    {idx < allChecks.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
                
                <Separator />
                
                <div>
                  <h3 className="text-base font-medium mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    Recommendations
                  </h3>
                  <ul className="space-y-2 pl-7 list-disc">
                    {recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-blue-600" />
                  Document Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2 text-muted-foreground">Required Documents</h3>
                  <div className="space-y-2">
                    {documents.required.map((doc, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-2 border rounded-md bg-white dark:bg-zinc-800"
                      >
                        <span className="text-sm">{doc}</span>
                        <Badge variant="outline" className={
                          documents.verified.includes(doc) 
                            ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                        }>
                          {documents.verified.includes(doc) ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Verified Documents
                    </h3>
                    <div className="space-y-1">
                      {documents.verified.map((doc, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-2 p-1.5"
                        >
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      Pending Documents
                    </h3>
                    <div className="space-y-1">
                      {documents.pending.map((doc, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-2 p-1.5"
                        >
                          <Clock className="h-3 w-3 text-amber-600" />
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-2 text-muted-foreground">Document Verification Status</h3>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-600 h-full" 
                      style={{ width: `${(documents.verified.length / documents.required.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-1 text-center">
                    {documents.verified.length} of {documents.required.length} documents verified ({Math.round((documents.verified.length / documents.required.length) * 100)}%)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button onClick={resetAnalysis} variant="outline" className="mr-2">
            New Due Diligence
          </Button>
          <Button>
            Generate Full Report
          </Button>
        </div>
      </div>
    );
  };

  return (
    <BaseAnalyzer
      title="Property Due Diligence"
      description="Comprehensive verification of property legal status, title, and associated risks"
      icon={<FileCheck className="h-6 w-6 text-blue-600" />}
      onAnalyze={() => form.handleSubmit(onSubmit)()}
      isAnalyzing={isAnalyzing}
      analysisResult={analysisResult}
    >
      {!analysisResult ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="propertyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Name/Project</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter property name or project" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="residential">Residential</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="agricultural">Agricultural Land</SelectItem>
                            <SelectItem value="industrial">Industrial</SelectItem>
                            <SelectItem value="mixed">Mixed Use</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="propertyAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Complete property address" 
                            className="resize-none" 
                            {...field} 
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <FormField
                    control={form.control}
                    name="propertyState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Maharashtra" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="propertyDistrict"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District/City</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Mumbai" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-base font-medium mb-4">Transaction Details</h3>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="transactionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select transaction type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="purchase">Purchase</SelectItem>
                              <SelectItem value="lease">Lease</SelectItem>
                              <SelectItem value="mortgage">Mortgage</SelectItem>
                              <SelectItem value="development">Development Project</SelectItem>
                              <SelectItem value="joint-venture">Joint Venture</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sellerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seller/Owner Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full legal name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="propertyValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Value (₹)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 1,50,00,000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-base font-medium mb-3">Due Diligence Scope</h3>
                  <p className="text-sm text-muted-foreground mb-4">Select the areas to include in due diligence</p>
                  
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="dueDiligenceScope.titleCheck"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Title Chain & Ownership Check
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dueDiligenceScope.encumbrancesCheck"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Encumbrances & Liens Check
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dueDiligenceScope.approvalCheck"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Approvals & Permits Check
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dueDiligenceScope.taxCheck"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Property Tax & Revenue Records
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dueDiligenceScope.utilityCheck"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Utility Connections & Dues
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dueDiligenceScope.environmentalCheck"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Environmental Compliance
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dueDiligenceScope.litigationCheck"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            Pending Litigation Check
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any specific concerns or areas to focus on during due diligence" 
                      className="resize-none" 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      ) : renderAnalysisResult()}
    </BaseAnalyzer>
  );
};

export default PropertyDueDiligence;
