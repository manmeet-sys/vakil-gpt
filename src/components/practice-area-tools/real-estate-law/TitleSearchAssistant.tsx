
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
import { FileSearch, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const titleSearchFormSchema = z.object({
  propertyAddress: z.string().min(5, { message: "Property address is required" }),
  propertyState: z.string().min(2, { message: "State is required" }),
  propertyDistrict: z.string().min(2, { message: "District is required" }),
  propertyType: z.string(),
  searchYears: z.enum(["5", "10", "15", "30", "full"]),
  additionalInfo: z.string().optional(),
});

type TitleSearchFormValues = z.infer<typeof titleSearchFormSchema>;

const defaultValues: TitleSearchFormValues = {
  propertyAddress: "",
  propertyState: "",
  propertyDistrict: "",
  propertyType: "residential",
  searchYears: "30",
  additionalInfo: "",
};

const mockTitleIssues = [
  { 
    issue: "Ownership Gap in Title Chain", 
    severity: "high", 
    details: "There appears to be a gap in the ownership chain between 1998-2002."
  },
  { 
    issue: "Pending Tax Liens", 
    severity: "medium", 
    details: "Property has unpaid property taxes from fiscal year 2021-2022."
  },
  { 
    issue: "Boundary Dispute Notice", 
    severity: "medium", 
    details: "Notice of a boundary dispute filed by adjacent property owner on eastern boundary."
  },
  { 
    issue: "Easement Rights", 
    severity: "low", 
    details: "Utility easement in northwestern corner of property permits access for maintenance."
  },
];

const TitleSearchAssistant = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const form = useForm<TitleSearchFormValues>({
    resolver: zodResolver(titleSearchFormSchema),
    defaultValues,
  });
  
  const onSubmit = (values: TitleSearchFormValues) => {
    setIsAnalyzing(true);
    console.log("Title Search Values:", values);
    
    // Simulate API call for analysis
    setTimeout(() => {
      setAnalysisResult({
        status: "completed",
        data: {
          titleIssues: mockTitleIssues,
          ownershipChain: [
            { owner: "Raghav Mehta", period: "2010-Present", documentType: "Sale Deed" },
            { owner: "Sunita Patel", period: "2002-2010", documentType: "Inheritance" },
            { owner: "Unknown Gap", period: "1998-2002", documentType: "Missing Records" },
            { owner: "Mahesh Patel", period: "1985-1998", documentType: "Sale Deed" },
          ],
          encumbrances: [
            { type: "Mortgage", holder: "HDFC Bank", registered: "2015", status: "Active" },
            { type: "Tax Lien", holder: "Municipal Corporation", registered: "2022", status: "Active" },
          ],
          riskAssessment: {
            overallRisk: "medium",
            recommendations: [
              "Conduct a physical survey to verify property boundaries",
              "Clear property tax dues immediately",
              "Investigate ownership gap in title chain from 1998-2002",
              "Obtain encumbrance certificate from sub-registrar's office"
            ]
          }
        }
      });
      setIsAnalyzing(false);
    }, 3000);
  };
  
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400";
      case 'medium': return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400";
      case 'low': return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
      default: return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };
  
  const resetAnalysis = () => {
    setAnalysisResult(null);
    form.reset();
  };

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;
    
    const { data } = analysisResult;
    const { titleIssues, ownershipChain, encumbrances, riskAssessment } = data;
    
    return (
      <div className="space-y-6 mt-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <FileSearch className="mr-2 h-5 w-5 text-blue-600" />
              Title Search Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Risk Assessment */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold mb-2 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4 text-amber-600" />
                Overall Risk Assessment
              </h3>
              <div className="flex items-center mb-2">
                <Badge 
                  variant="outline" 
                  className={getSeverityColor(riskAssessment.overallRisk)}
                >
                  {riskAssessment.overallRisk.toUpperCase()} RISK
                </Badge>
              </div>
            </div>
            
            {/* Title Issues */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Title Issues Found</h3>
              <div className="space-y-2">
                {titleIssues.map((issue, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded-md bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{issue.issue}</p>
                      <Badge 
                        variant="outline" 
                        className={getSeverityColor(issue.severity)}
                      >
                        {issue.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{issue.details}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Ownership Chain */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Ownership History</h3>
              <div className="relative">
                {ownershipChain.map((record, index) => (
                  <div key={index} className="mb-4 relative">
                    <div className="flex items-start mb-1">
                      <div className="flex-shrink-0 w-12 text-xs text-gray-500 dark:text-gray-400">
                        {record.period}
                      </div>
                      <div className="ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4 pb-4">
                        <p className="font-medium">{record.owner}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Document: {record.documentType}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Encumbrances */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Encumbrances on Property</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Holder</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {encumbrances.map((item, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 text-sm">{item.type}</td>
                        <td className="px-3 py-2 text-sm">{item.holder}</td>
                        <td className="px-3 py-2 text-sm">{item.registered}</td>
                        <td className="px-3 py-2 text-sm">
                          <Badge variant="outline" className={item.status === 'Active' ? 
                            'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400' : 
                            'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400'
                          }>
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Recommendations */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Recommended Actions</h3>
              <ul className="space-y-1">
                {riskAssessment.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={resetAnalysis} variant="outline" className="mr-2">
            New Search
          </Button>
          <Button>
            Generate Report
          </Button>
        </div>
      </div>
    );
  };

  return (
    <BaseAnalyzer
      title="Title Search Assistant"
      description="Verify property ownership, identify title defects, and discover encumbrances"
      icon={<FileSearch className="h-6 w-6 text-blue-600" />}
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
                name="propertyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter complete property address" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-6">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <SelectItem value="mixedUse">Mixed Use</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Type of property for appropriate search rules
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="searchYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search Period</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select search period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5">5 Years</SelectItem>
                        <SelectItem value="10">10 Years</SelectItem>
                        <SelectItem value="15">15 Years</SelectItem>
                        <SelectItem value="30">30 Years</SelectItem>
                        <SelectItem value="full">Full Chain of Title</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Number of years to search back in records
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter any additional details that might assist in the title search" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Optional notes such as known previous owners, survey numbers, etc.
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

export default TitleSearchAssistant;
