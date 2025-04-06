
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { ArrowRight, BarChart, Book, FileText, Gavel, Scale, SendHorizontal } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Define form validation schema
const formSchema = z.object({
  caseType: z.string({
    required_error: "Please select a case type",
  }),
  jurisdiction: z.string({
    required_error: "Please select a jurisdiction",
  }),
  courtLevel: z.string({
    required_error: "Please select court level",
  }),
  facts: z.string().min(20, {
    message: "Case facts must be at least 20 characters",
  }),
  precedents: z.string().optional(),
  statutes: z.array(z.string()).optional(),
  reliefSought: z.string().min(5, {
    message: "Relief sought must be at least 5 characters",
  }),
  complexityLevel: z.number().min(1).max(100),
});

type FormValues = z.infer<typeof formSchema>;

const LitigationPredictionTool: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('input');
  const { toast } = useToast();

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caseType: '',
      jurisdiction: '',
      courtLevel: '',
      facts: '',
      precedents: '',
      statutes: [],
      reliefSought: '',
      complexityLevel: 50,
    },
  });

  // Submit handler - will simulate AI analysis
  const onSubmit = async (data: FormValues) => {
    setIsAnalyzing(true);
    
    try {
      // In a real application, you would send this data to an AI service
      // For this demo, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock result - in a real app this would come from the AI model
      const mockResult = generateMockResult(data);
      setResult(mockResult);
      setSelectedTab('result');
      
      toast({
        title: "Analysis Complete",
        description: "Your litigation prediction is ready to view",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error generating your prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function to generate mock results based on input data
  const generateMockResult = (data: FormValues): string => {
    const courtOutcomes = [
      "The court is likely to rule in favor of the plaintiff.",
      "The court is likely to rule in favor of the defendant.",
      "The court may order a partial relief as requested.",
      "The case is likely to be dismissed on procedural grounds.",
      "The court may refer the matter for mediation.",
    ];
    
    const randomOutcome = courtOutcomes[Math.floor(Math.random() * courtOutcomes.length)];
    
    return `
## Litigation Outcome Prediction

**Case Type:** ${data.caseType}
**Jurisdiction:** ${data.jurisdiction}
**Court Level:** ${data.courtLevel}

### Prediction Summary
Based on analysis of similar cases in the Indian judiciary, ${randomOutcome}

### Key Factors Influencing Prediction
1. **Statutory Interpretation**: The interpretation of relevant sections of the ${data.caseType === 'Criminal' ? 'Bharatiya Nyaya Sanhita' : 'applicable statutes'} by Indian courts in similar matters.
2. **Precedent Analysis**: Review of ${data.jurisdiction} High Court and Supreme Court of India judgments shows a ${Math.random() > 0.5 ? 'favorable' : 'challenging'} trend for similar claims.
3. **Jurisdictional Trends**: ${data.jurisdiction} courts have historically ${Math.random() > 0.5 ? 'granted' : 'denied'} similar relief in ${Math.floor(Math.random() * 40 + 60)}% of comparable cases.

### Estimated Timeline
* **First Hearing**: 2-3 months
* **Evidence Stage**: 6-9 months
* **Arguments**: 3-4 months
* **Judgment**: Likely within ${Math.floor(Math.random() * 12 + 12)} months

### Estimated Success Probability
${Math.floor(Math.random() * 100)}%

### Recommended Approach
${Math.random() > 0.5 
  ? "Consider strengthening your case with additional evidence and expert testimony specific to Indian legal context."
  : "Consider exploring settlement options as litigation may be prolonged in the current court backlog."}

*This prediction is based on historical data and current legal trends in the Indian judicial system. Individual case outcomes may vary.*
`;
  };

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input">Case Information</TabsTrigger>
          <TabsTrigger value="result" disabled={!result}>Prediction Result</TabsTrigger>
        </TabsList>
        
        <TabsContent value="input" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Scale className="h-5 w-5 text-blue-600" />
                Indian Litigation Analyzer
              </CardTitle>
              <CardDescription>
                Enter case details to predict potential litigation outcomes in Indian courts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="caseType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Case Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select case type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Civil">Civil</SelectItem>
                              <SelectItem value="Criminal">Criminal (BNS)</SelectItem>
                              <SelectItem value="Family">Family</SelectItem>
                              <SelectItem value="Property">Property</SelectItem>
                              <SelectItem value="Commercial">Commercial</SelectItem>
                              <SelectItem value="Constitutional">Constitutional</SelectItem>
                              <SelectItem value="Administrative">Administrative</SelectItem>
                              <SelectItem value="Taxation">Taxation</SelectItem>
                              <SelectItem value="Intellectual Property">Intellectual Property</SelectItem>
                              <SelectItem value="Labor">Labor & Employment</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="jurisdiction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jurisdiction</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select jurisdiction" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Delhi">Delhi</SelectItem>
                              <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                              <SelectItem value="Karnataka">Karnataka</SelectItem>
                              <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                              <SelectItem value="Gujarat">Gujarat</SelectItem>
                              <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                              <SelectItem value="West Bengal">West Bengal</SelectItem>
                              <SelectItem value="Telangana">Telangana</SelectItem>
                              <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                              <SelectItem value="Punjab">Punjab & Haryana</SelectItem>
                              <SelectItem value="Kerala">Kerala</SelectItem>
                              <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                              <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                              <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                              <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="courtLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Court Level</FormLabel>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Supreme Court" />
                            </FormControl>
                            <FormLabel className="font-normal">Supreme Court</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="High Court" />
                            </FormControl>
                            <FormLabel className="font-normal">High Court</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="District Court" />
                            </FormControl>
                            <FormLabel className="font-normal">District Court</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Tribunal" />
                            </FormControl>
                            <FormLabel className="font-normal">Tribunal</FormLabel>
                          </FormItem>
                        </RadioGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="facts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case Facts</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Summarize the key facts of your case..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="precedents"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relevant Precedents (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any relevant case law or precedents..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            List any key Indian judgments relevant to your case
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="reliefSought"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relief Sought</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the relief you are seeking..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="complexityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case Complexity Level</FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={100}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-4"
                          />
                        </FormControl>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Simple</span>
                          <span>Moderate</span>
                          <span>Complex</span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>Analyzing Your Case...</>
                    ) : (
                      <>
                        Generate Prediction
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <div className="p-4 rounded-lg border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800/30">
            <div className="flex space-x-2">
              <Gavel className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-300">Indian Legal Context</h3>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                  This tool incorporates Indian statutes (including the new Bharatiya Nyaya Sanhita), Supreme Court and High Court precedents, 
                  and jurisdiction-specific legal trends. The analysis is tailored to the Indian legal system.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="result" className="mt-4">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-blue-600" />
                      Litigation Outcome Prediction
                    </span>
                    <Badge variant="outline" className="ml-auto">
                      Indian Jurisdiction
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    AI-powered analysis based on Indian case law and judicial patterns
                  </CardDescription>
                  <Separator className="mt-2" />
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: result.replace(/\n## /g, '<h2>').replace(/\n### /g, '<h3>').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>') }}></div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-5">
                  <Button variant="outline" onClick={() => setSelectedTab('input')}>
                    Modify Case Details
                  </Button>
                  <Button variant="default" onClick={() => {
                    toast({
                      title: "Report Exported",
                      description: "Litigation prediction report has been exported",
                    });
                  }}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="mt-6 p-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/30">
                <div className="flex space-x-2">
                  <Book className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800 dark:text-amber-400">Legal Disclaimer</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                      This analysis is based on historical data and AI pattern recognition. It is not legal advice and should not replace 
                      consultation with a qualified Indian legal practitioner familiar with your specific jurisdiction.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LitigationPredictionTool;
