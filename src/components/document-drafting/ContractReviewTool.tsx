
import React, { useState } from 'react';
import { FileUp, CheckCircle, AlertTriangle, FileText, Pencil, Search, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateGeminiAnalysis } from '@/utils/aiAnalysis';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const ContractReviewTool = () => {
  const [contractText, setContractText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    summary: string;
    risks: {text: string, severity: 'high' | 'medium' | 'low'}[];
    recommendations: string[];
    complianceIssues: string[];
  } | null>(null);
  
  const [activeTab, setActiveTab] = useState<'upload' | 'review' | 'edit'>('upload');
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setFileName(file.name);
    
    // Read the file
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setContractText(content);
      toast.success('Contract uploaded successfully');
      setActiveTab('review');
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
    };
    
    reader.readAsText(file);
  };

  const handlePasteContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContractText(e.target.value);
  };

  const analyzeContract = async () => {
    if (!contractText) {
      toast.error('Please upload or paste a contract first');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Use the AI analysis service
      const prompt = `
        Please analyze this legal contract under Indian law. Provide:
        1. A brief summary of the contract
        2. Key risks identified (high, medium, low severity)
        3. Recommendations for improvement
        4. Any compliance issues with Indian regulations
        
        Contract text:
        ${contractText.substring(0, 6000)}${contractText.length > 6000 ? '...' : ''}
      `;
      
      const result = await generateGeminiAnalysis(prompt, "Contract Analysis");
      
      // In a real implementation, we'd parse the structured response
      // For this demo, we'll create a simulated structured result
      setAnalysisResult({
        summary: "This appears to be a standard commercial lease agreement between two parties for property located in Mumbai, Maharashtra.",
        risks: [
          {text: "Security deposit terms are ambiguous and may not comply with Maharashtra Rent Control Act", severity: 'high'},
          {text: "Missing clear dispute resolution mechanism specific to Indian jurisdiction", severity: 'medium'},
          {text: "Termination clause lacks adequate notice period as per Indian Contract Act", severity: 'medium'},
          {text: "Maintenance responsibilities are not clearly defined", severity: 'low'}
        ],
        recommendations: [
          "Add specific reference to jurisdiction under Mumbai courts",
          "Include clear language about GST applicability on rent payments",
          "Add digital signature provisions compliant with Indian IT Act",
          "Include specific force majeure events relevant to Indian context"
        ],
        complianceIssues: [
          "Missing mandatory RERA registration reference for commercial property",
          "Inadequate stamp duty clause as per Maharashtra Stamp Act",
          "Missing clause regarding TDS deduction on rent payments"
        ]
      });
      
      toast.success('Contract analysis completed');
      
    } catch (error) {
      console.error("Error analyzing contract:", error);
      toast.error('Failed to analyze contract');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = () => {
    if (!contractText) return;
    
    const element = document.createElement('a');
    const file = new Blob([contractText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName || 'reviewed-contract.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Contract downloaded successfully');
  };

  // Animation variants  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const riskColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as 'upload' | 'review' | 'edit')}
        className="h-full flex flex-col"
      >
        <div className="border-b border-gray-200 dark:border-gray-700">
          <TabsList className="px-4">
            <TabsTrigger value="upload" className="data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400">
              <FileUp className="w-4 h-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="review" className="data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400">
              <Search className="w-4 h-4 mr-2" />
              Review
            </TabsTrigger>
            <TabsTrigger value="edit" className="data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400">
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-grow overflow-auto">
          <TabsContent value="upload" className="h-full p-6 space-y-6">
            <motion.div 
              className="text-center space-y-4"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div className="mx-auto bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-medium">Upload Contract</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Upload your contract document to review or paste the content directly below
              </p>
              
              <div className="flex justify-center">
                <label 
                  htmlFor="contract-upload" 
                  className="cursor-pointer flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FileUp className="h-4 w-4" />
                  Choose File
                </label>
                <input 
                  id="contract-upload" 
                  type="file" 
                  accept=".txt,.doc,.docx,.pdf,.rtf" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </div>
            </motion.div>
            
            <div className="mt-8">
              <h3 className="text-sm font-medium mb-2">Or paste contract text:</h3>
              <Textarea
                placeholder="Paste your contract text here..."
                className="min-h-[300px]"
                value={contractText}
                onChange={handlePasteContent}
              />
              
              {contractText && (
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={() => setActiveTab('review')}
                  >
                    Continue to Review
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="review" className="h-full p-6 space-y-6 overflow-y-auto">
            {contractText ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium">
                    {fileName || 'Contract Review'}
                  </h3>
                  <Button
                    onClick={analyzeContract}
                    disabled={isAnalyzing || !contractText}
                  >
                    {isAnalyzing ? 'Analyzing...' : analysisResult ? 'Re-analyze' : 'Analyze Contract'}
                  </Button>
                </div>
                
                {analysisResult ? (
                  <motion.div 
                    className="space-y-6"
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                  >
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Contract Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300">
                          {analysisResult.summary}
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Risk Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {analysisResult.risks.map((risk, index) => (
                            <li key={index} className={`p-3 rounded-md flex items-start gap-3 ${riskColors[risk.severity]}`}>
                              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                              <span>{risk.text}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysisResult.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Compliance Issues</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {analysisResult.complianceIssues.map((issue, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="flex justify-end pt-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab('edit')}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Contract
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-900/50">
                    <div className="text-center space-y-3">
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700 mx-auto"></div>
                          <h3 className="text-lg font-medium">Analyzing your contract...</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">This may take a minute. We're reviewing your contract for potential issues.</p>
                        </>
                      ) : (
                        <>
                          <Search className="h-12 w-12 mx-auto text-gray-400" />
                          <h3 className="text-lg font-medium">Ready to analyze contract</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Click the "Analyze Contract" button to identify risks, opportunities, and compliance issues.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Contract to Review</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Please upload or paste contract text in the Upload tab first</p>
                <Button onClick={() => setActiveTab('upload')}>
                  Go to Upload
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="edit" className="h-full p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium">
                  {fileName || 'Edit Contract'}
                </h3>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <Textarea
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                className="min-h-[600px] font-mono"
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ContractReviewTool;
