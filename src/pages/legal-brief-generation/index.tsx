
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { BookOpen, Send } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const LegalBriefGenerationPage = () => {
  const [topic, setTopic] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [context, setContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState('');
  const { toast } = useToast();
  
  const handleGenerateBrief = async () => {
    if (!topic) {
      toast({
        title: "Topic required",
        description: "Please enter a legal topic for your brief",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call an AI API
      const apiKey = localStorage.getItem('geminiApiKey');
      
      // Simulate API call with a timeout
      setTimeout(() => {
        const sampleBrief = `
# Legal Brief: ${topic}
## Jurisdiction: ${jurisdiction || 'General'}

### Summary
This brief addresses key legal considerations regarding ${topic} ${jurisdiction ? `in ${jurisdiction}` : ''}.

### Analysis
${context || 'Based on current legal standards,'} the following considerations apply:

1. Legal precedents suggest careful attention to procedural requirements
2. Recent case law indicates evolving standards in this area
3. Statutory provisions require specific compliance measures

### Recommendations
Based on the above analysis, we recommend:
- Thorough documentation of all relevant facts
- Consultation with specialized counsel in this domain
- Careful compliance with all jurisdictional requirements

### Relevant Citations
- Smith v. Jones, 2020
- Legal Standards Act of 2018
- International Protocols on ${topic}, 2019
        `;
        
        setGeneratedBrief(sampleBrief);
        setIsGenerating(false);
        
        toast({
          title: "Brief Generated",
          description: "Your legal brief has been generated successfully",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your brief. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };
  
  return (
    <LegalToolLayout
      title="AI-Powered Legal Brief Generation"
      description="Generate comprehensive legal briefs based on your specific topic, jurisdiction, and context. Our AI analyzes relevant case law and statutes to provide structured and well-cited legal briefs."
      icon={<BookOpen className="w-6 h-6 text-white" />}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white dark:bg-legal-slate/10 border-legal-border dark:border-legal-slate/20">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="topic">Legal Topic</Label>
                <Input 
                  id="topic" 
                  placeholder="e.g., Intellectual Property Rights, Contract Breach" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="jurisdiction">Jurisdiction (Optional)</Label>
                <Input 
                  id="jurisdiction" 
                  placeholder="e.g., California, European Union" 
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="context">Additional Context</Label>
                <Textarea 
                  id="context" 
                  placeholder="Enter any specific details or context for the brief..." 
                  className="min-h-32"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-legal-border dark:border-legal-slate/20 py-4">
            <Button 
              onClick={handleGenerateBrief}
              disabled={isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating ? (
                <>Generating Brief...</>
              ) : (
                <>
                  Generate Brief
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {generatedBrief && (
          <Card className="bg-white dark:bg-legal-slate/10 border-legal-border dark:border-legal-slate/20">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Generated Legal Brief</h3>
              <div className="bg-gray-50 dark:bg-legal-slate/20 p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
                {generatedBrief}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-legal-border dark:border-legal-slate/20 py-4">
              <Button 
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(generatedBrief);
                  toast({
                    title: "Copied",
                    description: "Brief copied to clipboard"
                  });
                }}
                className="mr-2"
              >
                Copy to Clipboard
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  const blob = new Blob([generatedBrief], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `legal-brief-${topic.toLowerCase().replace(/\s+/g, '-')}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  
                  toast({
                    title: "Downloaded",
                    description: "Brief downloaded as text file"
                  });
                }}
              >
                Download
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </LegalToolLayout>
  );
};

export default LegalBriefGenerationPage;
