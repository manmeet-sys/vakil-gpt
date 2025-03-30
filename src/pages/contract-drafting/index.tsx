
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { FileText, CheckCircle, AlertTriangle, Send } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const ContractDraftingPage = () => {
  const [contractType, setContractType] = useState('');
  const [contractText, setContractText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    risks: { issue: string; severity: 'high' | 'medium' | 'low'; description: string }[];
    suggestions: string[];
    score: number;
  } | null>(null);
  
  const { toast } = useToast();
  
  const handleAnalyzeContract = async () => {
    if (!contractText) {
      toast({
        title: "Text Required",
        description: "Please enter or paste contract text for analysis",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Simulate API call with a timeout
      setTimeout(() => {
        // This would be replaced with actual AI analysis
        const mockAnalysis = {
          risks: [
            { 
              issue: "Ambiguous Termination Clause", 
              severity: "high" as const, 
              description: "The termination conditions are vaguely defined and may be subject to multiple interpretations."
            },
            { 
              issue: "Missing Liability Cap", 
              severity: "medium" as const, 
              description: "No specified limit on liability which could expose parties to unlimited claims."
            },
            { 
              issue: "Outdated Compliance Reference", 
              severity: "low" as const, 
              description: "References to compliance with outdated regulations that have been superseded."
            }
          ],
          suggestions: [
            "Add specific conditions and notice periods for contract termination",
            "Include a liability limitation clause capping damages at contract value",
            "Update regulatory references to current applicable laws",
            "Add a force majeure clause to protect against unforeseen circumstances"
          ],
          score: 74
        };
        
        setAnalysis(mockAnalysis);
        setIsAnalyzing(false);
        
        toast({
          title: "Analysis Complete",
          description: "Contract analysis has been completed successfully",
        });
      }, 2500);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your contract. Please try again.",
        variant: "destructive"
      });
      setIsAnalyzing(false);
    }
  };
  
  return (
    <LegalToolLayout
      title="Contract Drafting & Review"
      description="AI-powered contract analysis tool that identifies risks, provides suggestions for improvements, and ensures your contracts follow legal best practices."
      icon={<FileText className="w-6 h-6 text-white" />}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white dark:bg-legal-slate/10 border-legal-border dark:border-legal-slate/20">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="contract-type">Contract Type</Label>
                <Select value={contractType} onValueChange={setContractType}>
                  <SelectTrigger id="contract-type">
                    <SelectValue placeholder="Select contract type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employment">Employment Contract</SelectItem>
                    <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
                    <SelectItem value="service">Service Agreement</SelectItem>
                    <SelectItem value="licensing">Licensing Agreement</SelectItem>
                    <SelectItem value="partnership">Partnership Agreement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="contract-text">Contract Text</Label>
                <Textarea 
                  id="contract-text" 
                  placeholder="Paste your contract text here..." 
                  className="min-h-64"
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-legal-border dark:border-legal-slate/20 py-4">
            <Button 
              onClick={handleAnalyzeContract}
              disabled={isAnalyzing}
              className="w-full sm:w-auto"
            >
              {isAnalyzing ? (
                <>Analyzing Contract...</>
              ) : (
                <>
                  Analyze Contract
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {analysis && (
          <div className="space-y-6">
            <Card className="bg-white dark:bg-legal-slate/10 border-legal-border dark:border-legal-slate/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span>Contract Risk Assessment</span>
                  <div className="ml-auto flex items-center">
                    <span className="mr-2">Risk Score:</span>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                      analysis.score >= 80 ? 'bg-green-500' : 
                      analysis.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}>
                      {analysis.score}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-medium mb-3">Identified Risks</h3>
                <div className="space-y-3">
                  {analysis.risks.map((risk, index) => (
                    <div key={index} className="p-3 rounded-md border border-legal-border dark:border-legal-slate/20">
                      <div className="flex items-start">
                        <div className={`p-1.5 rounded-full ${
                          risk.severity === 'high' ? 'bg-red-100 dark:bg-red-900/20' : 
                          risk.severity === 'medium' ? 'bg-amber-100 dark:bg-amber-900/20' : 
                          'bg-blue-100 dark:bg-blue-900/20'
                        } mr-3`}>
                          <AlertTriangle className={`h-4 w-4 ${
                            risk.severity === 'high' ? 'text-red-600 dark:text-red-400' : 
                            risk.severity === 'medium' ? 'text-amber-600 dark:text-amber-400' : 
                            'text-blue-600 dark:text-blue-400'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-medium flex items-center">
                            {risk.issue}
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                              risk.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                              risk.severity === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 
                              'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>
                              {risk.severity.toUpperCase()}
                            </span>
                          </h4>
                          <p className="text-sm text-legal-muted dark:text-gray-400 mt-1">{risk.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-legal-slate/10 border-legal-border dark:border-legal-slate/20">
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start">
                      <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/20 mr-3">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <p>{suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-legal-border dark:border-legal-slate/20 py-4">
                <Button 
                  onClick={() => {
                    // In a real implementation, this would generate an improved contract
                    toast({
                      title: "Feature Coming Soon",
                      description: "Auto-improvement of contracts will be available soon!",
                    });
                  }}
                >
                  Generate Improved Contract
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </LegalToolLayout>
  );
};

export default ContractDraftingPage;
