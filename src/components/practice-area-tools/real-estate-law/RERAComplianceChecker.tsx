
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseAnalyzer, AnalysisResult } from '../base';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const reraComplianceFormSchema = z.object({
  projectName: z.string().min(3, { message: "Project name is required" }),
  developerName: z.string().min(3, { message: "Developer name is required" }),
  projectState: z.string().min(2, { message: "State is required" }),
  projectCity: z.string().min(2, { message: "City is required" }),
  projectType: z.string(),
  projectArea: z.string().min(1, { message: "Project area is required" }),
  completionDate: z.string().min(1, { message: "Expected completion date is required" }),
  registrationStatus: z.enum(["registered", "notRegistered", "inProcess"]),
  additionalDetails: z.string().optional(),
});

type RERAComplianceFormValues = z.infer<typeof reraComplianceFormSchema>;

const defaultValues: RERAComplianceFormValues = {
  projectName: "",
  developerName: "",
  projectState: "",
  projectCity: "",
  projectType: "residential",
  projectArea: "",
  completionDate: "",
  registrationStatus: "registered",
  additionalDetails: "",
};

const RERAComplianceChecker = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const form = useForm<RERAComplianceFormValues>({
    resolver: zodResolver(reraComplianceFormSchema),
    defaultValues,
  });
  
  const onSubmit = (values: RERAComplianceFormValues) => {
    setIsAnalyzing(true);
    console.log("RERA Compliance Values:", values);
    
    // Simulate API call for analysis
    setTimeout(() => {
      const mockComplianceResults = {
        overallCompliance: 78,
        stateAuthority: `${values.projectState} RERA Authority`,
        registrationNumber: values.registrationStatus === "registered" ? "MAHA/PROJECT/78654/2022" : "-",
        documentCompliance: [
          { document: "Project Registration", status: "compliant", notes: "Registration valid until 31-12-2024" },
          { document: "Approved Building Plans", status: "compliant", notes: "Plans approved by municipal authority" },
          { document: "Land Title Documents", status: "compliant", notes: "Clear land title with all necessary approvals" },
          { document: "Quarterly Project Updates", status: "non-compliant", notes: "Last update overdue by 45 days" },
          { document: "Financial Statements", status: "partially-compliant", notes: "Some statements pending annual audit" },
        ],
        disclosureCompliance: [
          { disclosure: "Carpet Area Disclosure", status: "compliant" },
          { disclosure: "Amenities & Specifications", status: "compliant" },
          { disclosure: "Project Timeline", status: "compliant" },
          { disclosure: "Payment Schedule", status: "compliant" },
          { disclosure: "Sanctioned Plans", status: "partially-compliant" },
          { disclosure: "Stage-wise Project Schedule", status: "non-compliant" },
        ],
        recommendations: [
          "Submit quarterly project updates immediately to avoid penalties",
          "Complete pending financial statement audits within 15 days",
          "Update stage-wise project schedule on the RERA portal",
          "Ensure all marketing materials include RERA registration number",
          "Update project completion timeline on the RERA website"
        ],
        stateSpecificRequirements: [
          { requirement: "Separate project account (70% rule)", status: "compliant" },
          { requirement: "Project insurance", status: "non-compliant" },
          { requirement: "Annual report submission", status: "partially-compliant" },
          { requirement: "Local body approvals", status: "compliant" }
        ],
      };

      setAnalysisResult({
        status: "completed",
        data: mockComplianceResults,
      });
      setIsAnalyzing(false);
    }, 3000);
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'compliant': return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400";
      case 'partially-compliant': return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400";
      case 'non-compliant': return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'compliant': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'partially-compliant': return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'non-compliant': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };
  
  const resetAnalysis = () => {
    setAnalysisResult(null);
    form.reset();
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-green-600";
    if (value >= 60) return "bg-amber-600";
    return "bg-red-600";
  };

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;
    
    const { data } = analysisResult;
    
    return (
      <div className="space-y-6 mt-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-blue-600" />
                  RERA Compliance Analysis Results
                </CardTitle>
                <CardDescription>
                  {data.stateAuthority} • {data.registrationNumber !== "-" ? `Registration: ${data.registrationNumber}` : "Not Registered"}
                </CardDescription>
              </div>
              <div className="text-right">
                <span className="block text-2xl font-semibold">
                  {data.overallCompliance}%
                </span>
                <span className="text-sm text-muted-foreground">Overall Compliance</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <Progress 
              value={data.overallCompliance} 
              className={`h-2 ${getProgressColor(data.overallCompliance)}`} 
            />
            
            {/* Document Compliance */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Document Compliance</h3>
              <div className="space-y-2">
                {data.documentCompliance.map((doc, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded-md bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getStatusIcon(doc.status)}
                        <span className="ml-2 font-medium text-sm">{doc.document}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(doc.status)}
                      >
                        {doc.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    {doc.notes && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-6">{doc.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Disclosure Compliance */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Required Disclosures</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.disclosureCompliance.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md border border-gray-200 dark:border-gray-700"
                  >
                    <span className="text-sm">{item.disclosure}</span>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(item.status)}
                    >
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{item.status.replace('-', ' ')}</span>
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* State Specific Requirements */}
            <div>
              <h3 className="text-sm font-semibold mb-3">State-Specific Requirements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.stateSpecificRequirements.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md border border-gray-200 dark:border-gray-700"
                  >
                    <span className="text-sm">{item.requirement}</span>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(item.status)}
                    >
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{item.status.replace('-', ' ')}</span>
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Recommendations */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Compliance Recommendations</h3>
              <div className="space-y-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-950/30 rounded-md p-3">
                <ul className="space-y-1">
                  {data.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle className="h-4 w-4 mr-2 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={resetAnalysis} variant="outline" className="mr-2">
            New Analysis
          </Button>
          <Button>
            Generate Compliance Report
          </Button>
        </div>
      </div>
    );
  };

  return (
    <BaseAnalyzer
      title="RERA Compliance Checker"
      description="Verify real estate project compliance with the Real Estate (Regulation & Development) Act"
      icon={<Building2 className="h-6 w-6 text-blue-600" />}
      onAnalyze={() => form.handleSubmit(onSubmit)()}
      isAnalyzing={isAnalyzing}
      analysisResult={analysisResult}
    >
      {!analysisResult ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter real estate project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="developerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Developer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter developer/builder name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="projectState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Maharashtra" {...field} />
                    </FormControl>
                    <FormDescription>
                      State where project is located
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="projectCity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City/District</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Mumbai" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="mixed">Mixed Use</SelectItem>
                        <SelectItem value="plotted">Plotted Development</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="projectArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Area (in sq.m)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 12500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="completionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Completion Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="registrationStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RERA Registration Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select registration status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="registered">Registered</SelectItem>
                        <SelectItem value="notRegistered">Not Registered</SelectItem>
                        <SelectItem value="inProcess">Registration in Process</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="additionalDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter any additional details relevant for compliance check" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Optional information such as previous compliance issues, extensions, etc.
                  </FormDescription>
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

export default RERAComplianceChecker;
