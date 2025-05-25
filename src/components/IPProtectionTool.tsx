import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, FileText, Search, AlertTriangle, CheckCircle, Clock, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { getOpenAIResponse } from './OpenAIIntegration';

interface IPProtectionAnalysis {
  summary: string;
  risks: string[];
  recommendations: string[];
}

const IPProtectionTool = () => {
  const [domain, setDomain] = useState('');
  const [trademark, setTrademark] = useState('');
  const [patent, setPatent] = useState('');
  const [copyright, setCopyright] = useState('');
  const [analysisResults, setAnalysisResults] = useState<IPProtectionAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDomainSearch = async () => {
    setIsLoading(true);
    try {
      const prompt = `Analyze the domain name ${domain} for potential trademark conflicts and availability. Provide a summary of findings, potential risks, and recommendations for securing the domain.`;
      const response = await getOpenAIResponse(prompt);
      setAnalysisResults({
        summary: response,
        risks: [],
        recommendations: [],
      });
    } catch (error) {
      console.error('Error analyzing domain:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze domain. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrademarkSearch = async () => {
    setIsLoading(true);
    try {
      const prompt = `Analyze the trademark ${trademark} for existing conflicts and potential registration issues. Provide a summary of findings, potential risks, and recommendations for securing the trademark.`;
      const response = await getOpenAIResponse(prompt);
      setAnalysisResults({
        summary: response,
        risks: [],
        recommendations: [],
      });
    } catch (error) {
      console.error('Error analyzing trademark:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze trademark. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatentSearch = async () => {
    setIsLoading(true);
    try {
      const prompt = `Analyze the patent ${patent} for novelty, inventiveness, and potential infringement issues. Provide a summary of findings, potential risks, and recommendations for securing the patent.`;
      const response = await getOpenAIResponse(prompt);
      setAnalysisResults({
        summary: response,
        risks: [],
        recommendations: [],
      });
    } catch (error) {
      console.error('Error analyzing patent:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze patent. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyrightSearch = async () => {
    setIsLoading(true);
    try {
      const prompt = `Analyze the copyright ${copyright} for originality, authorship, and potential infringement issues. Provide a summary of findings, potential risks, and recommendations for securing the copyright.`;
      const response = await getOpenAIResponse(prompt);
      setAnalysisResults({
        summary: response,
        risks: [],
        recommendations: [],
      });
    } catch (error) {
      console.error('Error analyzing copyright:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze copyright. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm dark:shadow-zinc-800/10">
      <CardHeader>
        <CardTitle>Intellectual Property Protection Tool</CardTitle>
        <CardDescription>
          Analyze your domain, trademark, patent, and copyright for potential issues.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="domain" className="space-y-4">
          <TabsList>
            <TabsTrigger value="domain">Domain</TabsTrigger>
            <TabsTrigger value="trademark">Trademark</TabsTrigger>
            <TabsTrigger value="patent">Patent</TabsTrigger>
            <TabsTrigger value="copyright">Copyright</TabsTrigger>
          </TabsList>
          <TabsContent value="domain" className="space-y-2">
            <Label htmlFor="domain">Domain Name</Label>
            <Input
              id="domain"
              placeholder="Enter domain name"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
            <Button onClick={handleDomainSearch} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search Domain
                </>
              )}
            </Button>
          </TabsContent>
          <TabsContent value="trademark" className="space-y-2">
            <Label htmlFor="trademark">Trademark</Label>
            <Input
              id="trademark"
              placeholder="Enter trademark"
              value={trademark}
              onChange={(e) => setTrademark(e.target.value)}
            />
            <Button onClick={handleTrademarkSearch} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search Trademark
                </>
              )}
            </Button>
          </TabsContent>
          <TabsContent value="patent" className="space-y-2">
            <Label htmlFor="patent">Patent</Label>
            <Input
              id="patent"
              placeholder="Enter patent"
              value={patent}
              onChange={(e) => setPatent(e.target.value)}
            />
            <Button onClick={handlePatentSearch} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search Patent
                </>
              )}
            </Button>
          </TabsContent>
          <TabsContent value="copyright" className="space-y-2">
            <Label htmlFor="copyright">Copyright</Label>
            <Input
              id="copyright"
              placeholder="Enter copyright"
              value={copyright}
              onChange={(e) => setCopyright(e.target.value)}
            />
            <Button onClick={handleCopyrightSearch} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search Copyright
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {analysisResults && (
          <div className="mt-4">
            <Separator />
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Analysis Results</h3>
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>{analysisResults.summary}</AlertDescription>
              </Alert>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IPProtectionTool;
