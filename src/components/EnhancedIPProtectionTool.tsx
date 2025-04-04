
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  ExternalLink, 
  BookOpen, 
  AlertTriangle, 
  Shield, 
  CheckCircle, 
  ScrollText, 
  FileCheck,
  Landmark,
  BookOpenCheck,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface IPResource {
  title: string;
  url: string;
  description: string;
  icon: React.ReactNode;
  organization: string;
  category: 'trademark' | 'patent' | 'copyright' | 'design' | 'general';
  isVerified: boolean;
}

const EnhancedIPProtectionTool = () => {
  const [activeTab, setActiveTab] = useState('resources');
  const [resourceCategory, setResourceCategory] = useState('all');
  const [ipDescription, setIpDescription] = useState('');
  const [ipType, setIpType] = useState('trademark');
  const [draftingTemplate, setDraftingTemplate] = useState('');
  const [generatingTemplate, setGeneratingTemplate] = useState(false);

  // Only include verified and working government resources
  const verifiedIndianIPResources: IPResource[] = [
    {
      title: "Intellectual Property India Portal",
      url: "https://ipindia.gov.in/",
      description: "Official IP India portal with information on patents, trademarks, designs, and GI",
      icon: <Landmark className="h-4 w-4 mr-2" />,
      organization: "Office of the Controller General of Patents, Designs & Trade Marks",
      category: "general",
      isVerified: true
    },
    {
      title: "Indian Copyright Office",
      url: "https://copyright.gov.in/",
      description: "Official portal for copyright registration and information in India",
      icon: <BookOpenCheck className="h-4 w-4 mr-2" />,
      organization: "Copyright Office, Government of India",
      category: "copyright",
      isVerified: true
    },
    {
      title: "Indian Patent Act & Rules",
      url: "https://ipindia.gov.in/patents.htm",
      description: "Information on patent laws, rules and procedures in India",
      icon: <ScrollText className="h-4 w-4 mr-2" />,
      organization: "Patent Office, CGPDTM",
      category: "patent",
      isVerified: true
    },
    {
      title: "Trade Marks Registry",
      url: "https://ipindia.gov.in/trade-marks.htm",
      description: "Official information on trademark filing and procedures in India",
      icon: <FileCheck className="h-4 w-4 mr-2" />,
      organization: "Trade Marks Registry, CGPDTM",
      category: "trademark",
      isVerified: true
    },
    {
      title: "Design Registry",
      url: "https://ipindia.gov.in/designs.htm",
      description: "Information on industrial design registration in India",
      icon: <FileCheck className="h-4 w-4 mr-2" />,
      organization: "Design Registry, CGPDTM",
      category: "design",
      isVerified: true
    },
    {
      title: "E-Filing for Patents, Designs & Trademarks",
      url: "https://ipindiaonline.gov.in/",
      description: "Portal for e-filing applications for patents, designs and trademarks",
      icon: <FileText className="h-4 w-4 mr-2" />,
      organization: "IP India",
      category: "general",
      isVerified: true
    }
  ];
  
  const trademarkTemplates = {
    applicationStatement: "Application for registration of trademark [MARK NAME] in Class [CLASS NUMBER] under the Trade Marks Act, 1999.",
    description: "The trademark consists of [DESCRIPTION OF MARK INCLUDING COLORS, DESIGN ELEMENTS, AND WORDS]. The mark has been in use since [DATE OF FIRST USE].",
    disclaimer: "No claim is made to the exclusive right to use '[DESCRIPTIVE TERM]' apart from the mark as shown.",
    services: "The services covered under this trademark application include [DETAILED DESCRIPTION OF SERVICES]."
  };
  
  const patentTemplates = {
    title: "A METHOD AND SYSTEM FOR [BRIEF DESCRIPTION OF INVENTION]",
    abstract: "The present invention relates to [FIELD OF INVENTION]. More particularly, the invention provides [BRIEF SUMMARY OF INVENTION]. The invention solves the problem of [PROBLEM SOLVED] by [HOW SOLUTION WORKS].",
    claims: "1. A method comprising:\n   a) [FIRST STEP];\n   b) [SECOND STEP]; and\n   c) [THIRD STEP].\n\n2. The method according to claim 1, wherein [ADDITIONAL LIMITATION].",
    background: "In the field of [TECHNOLOGY AREA], there exists a need for [DESCRIBE NEED]. Prior solutions such as [PRIOR ART REFERENCE] have attempted to address this, but suffer from [LIMITATIONS OF PRIOR ART]."
  };
  
  const copyrightTemplates = {
    declaration: "Declaration of Ownership of Copyright\n\nI, [NAME], hereby declare that I am the author and rightful owner of the original work titled '[WORK TITLE]' created on [DATE OF CREATION].",
    description: "The work is a [TYPE OF WORK e.g., literary, artistic, musical] work consisting of [DESCRIPTION OF WORK]. The work was created through [PROCESS OF CREATION].",
    rightsStatement: "All rights reserved. No part of this work may be reproduced, distributed, or transmitted in any form or by any means without the prior written permission of the copyright owner.",
    applicationStatement: "Application for registration of copyright in a [TYPE OF WORK] under Section 45 of the Copyright Act, 1957."
  };
  
  const designTemplates = {
    applicationStatement: "Application for registration of design under the Designs Act, 2000.",
    description: "The design consists of [DESCRIPTION OF DESIGN INCLUDING SHAPE, CONFIGURATION, PATTERN, AND ORNAMENT]. The design is applied to [ARTICLE TO WHICH DESIGN IS APPLIED].",
    statement: "Statement of novelty: The novelty resides in the [FEATURES THAT MAKE THE DESIGN NOVEL].",
    disclaimer: "Disclaimer: No claim is made to any mechanical or functional features of the [ARTICLE] shown in the representations."
  };

  const handleGenerateTemplate = () => {
    setGeneratingTemplate(true);
    
    setTimeout(() => {
      let template = "";
      
      if (ipType === 'trademark') {
        template = Object.values(trademarkTemplates).join('\n\n');
      } else if (ipType === 'patent') {
        template = Object.values(patentTemplates).join('\n\n');
      } else if (ipType === 'copyright') {
        template = Object.values(copyrightTemplates).join('\n\n');
      } else if (ipType === 'design') {
        template = Object.values(designTemplates).join('\n\n');
      }
      
      setDraftingTemplate(template);
      setGeneratingTemplate(false);
      toast.success('Template generated successfully');
    }, 1000);
  };
  
  const handleDownloadTemplate = () => {
    const element = document.createElement('a');
    const file = new Blob([draftingTemplate], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${ipType}-template.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success('Template downloaded successfully');
  };
  
  const filteredResources = resourceCategory === 'all' 
    ? verifiedIndianIPResources 
    : verifiedIndianIPResources.filter(resource => resource.category === resourceCategory || resource.category === 'general');

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-none shadow-sm mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Indian IP Protection Suite</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Access reliable government resources for intellectual property protection in India. Get drafting assistance for patents, trademarks, copyrights, and designs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          <TabsTrigger value="drafting">Drafting Help</TabsTrigger>
        </TabsList>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Verified Indian IP Resources
              </CardTitle>
              <CardDescription>
                Access official government IP resources for Indian intellectual property protection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-2">
                <Button 
                  variant={resourceCategory === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setResourceCategory('all')}
                >
                  All Resources
                </Button>
                <Button 
                  variant={resourceCategory === 'trademark' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setResourceCategory('trademark')}
                >
                  Trademark
                </Button>
                <Button 
                  variant={resourceCategory === 'patent' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setResourceCategory('patent')}
                >
                  Patent
                </Button>
                <Button 
                  variant={resourceCategory === 'copyright' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setResourceCategory('copyright')}
                >
                  Copyright
                </Button>
                <Button 
                  variant={resourceCategory === 'design' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setResourceCategory('design')}
                >
                  Design
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map((resource, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium text-base">{resource.title}</h3>
                            {resource.isVerified && (
                              <span className="ml-2 text-green-600 flex items-center text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{resource.organization}</p>
                          <p className="text-sm">{resource.description}</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-3"
                            onClick={() => window.open(resource.url, '_blank')}
                          >
                            {resource.icon}
                            Access Resource <ExternalLink className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Alert className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Resource Access Note</AlertTitle>
                <AlertDescription>
                  Government websites may occasionally experience downtime. If a link doesn't work, please try again later or visit the main IP India portal at <a href="https://ipindia.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ipindia.gov.in</a>.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guidelines">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Indian IP Protection Guidelines
              </CardTitle>
              <CardDescription>
                Key information about protecting intellectual property under Indian law
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-base mb-2">Trademark Protection</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span><span className="font-medium">Legal Framework:</span> Governed by the Trade Marks Act, 1999 and Trade Marks Rules, 2017</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span><span className="font-medium">Duration:</span> 10 years from application date, renewable for additional 10-year periods</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span><span className="font-medium">Registration Process:</span> Filing, examination, publication, opposition period, registration</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span><span className="font-medium">Enforcement:</span> Civil remedies including injunctions and damages; criminal penalties for counterfeiting</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-base mb-2">Patent Protection</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span><span className="font-medium">Legal Framework:</span> Patents Act, 1970 (as amended) and Patent Rules, 2003</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span><span className="font-medium">Duration:</span> 20 years from filing date</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span><span className="font-medium">Requirements:</span> Novelty, inventive step, industrial applicability</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span><span className="font-medium">Process:</span> Filing, publication after 18 months, examination, grant</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-base mb-2">Copyright Protection</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span><span className="font-medium">Legal Framework:</span> Copyright Act, 1957 and Copyright Rules, 2013</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span><span className="font-medium">Duration:</span> Life of author plus 60 years for literary, dramatic, musical, and artistic works</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span><span className="font-medium">Protection:</span> Automatic upon creation, but registration provides evidentiary advantages</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span><span className="font-medium">Rights:</span> Economic rights (reproduction, adaptation, translation) and moral rights</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-base mb-2">Design Protection</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span><span className="font-medium">Legal Framework:</span> Designs Act, 2000 and Design Rules, 2001</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span><span className="font-medium">Duration:</span> 10 years, extendable for 5 additional years</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span><span className="font-medium">Requirements:</span> Novelty, originality, not purely functional</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span><span className="font-medium">Protection:</span> Shape, configuration, pattern, ornament, or composition of lines or colors applied to articles</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-medium text-base mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                  Key Considerations for Indian IP Protection
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    <span>File for protection before public disclosure, especially for patents and designs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    <span>Conduct thorough searches before filing to avoid conflicts with existing IP</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    <span>Maintain proper documentation of creation and development process</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    <span>Consider international protection through treaties like PCT, Madrid Protocol</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    <span>Monitor Indian IP journals regularly for potential conflicting applications</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="drafting">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">IP Document Drafting Assistance</CardTitle>
              <CardDescription>
                Generate templates for various IP documents based on Indian IP laws
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">IP Type</label>
                    <Select value={ipType} onValueChange={setIpType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select IP type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trademark">Trademark</SelectItem>
                        <SelectItem value="patent">Patent</SelectItem>
                        <SelectItem value="copyright">Copyright</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {ipType === 'trademark' && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                      <h3 className="font-medium text-sm mb-2">Indian Trademark Document Requirements</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Application in Form TM-A</li>
                        <li>• Clear representation of mark</li>
                        <li>• List of goods/services as per classification</li>
                        <li>• Power of attorney (if applicable)</li>
                        <li>• Priority document (if claiming priority)</li>
                        <li>• User affidavit (if claiming prior use)</li>
                      </ul>
                    </div>
                  )}
                  
                  {ipType === 'patent' && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                      <h3 className="font-medium text-sm mb-2">Indian Patent Document Requirements</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Complete specification with claims</li>
                        <li>• Abstract (150-250 words)</li>
                        <li>• Drawings (if applicable)</li>
                        <li>• Form 1 (Application for Patent)</li>
                        <li>• Form 2 (Provisional/Complete Specification)</li>
                        <li>• Form 3 (Statement and Undertaking)</li>
                        <li>• Form 5 (Declaration of Inventorship)</li>
                      </ul>
                    </div>
                  )}
                  
                  {ipType === 'copyright' && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                      <h3 className="font-medium text-sm mb-2">Indian Copyright Document Requirements</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Form XIV (Application for Registration)</li>
                        <li>• Copies of the work</li>
                        <li>• NOC from publisher (if published)</li>
                        <li>• Certificate of incorporation (if applicant is company)</li>
                        <li>• Assignment deed (if applicant is not author)</li>
                      </ul>
                    </div>
                  )}
                  
                  {ipType === 'design' && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                      <h3 className="font-medium text-sm mb-2">Indian Design Document Requirements</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Form 1 (Application for Registration)</li>
                        <li>• Form 2 (Representation Sheet)</li>
                        <li>• Priority document (if claiming priority)</li>
                        <li>• Four copies of representation in exact accordance with rule 14</li>
                        <li>• Statement of novelty</li>
                        <li>• Disclaimer (if applicable)</li>
                      </ul>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleGenerateTemplate} 
                    disabled={generatingTemplate}
                    className="w-full"
                  >
                    {generatingTemplate ? 'Generating...' : 'Generate Template'}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <label className="text-sm font-medium block mb-2">Generated Template</label>
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <pre className="text-sm whitespace-pre-wrap">
                      {draftingTemplate || "Template will appear here. Select an IP type and click 'Generate Template'."}
                    </pre>
                  </ScrollArea>
                  
                  {draftingTemplate && (
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleDownloadTemplate}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Template
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <Alert className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Legal Disclaimer</AlertTitle>
                <AlertDescription>
                  These templates are provided for informational purposes only and should not substitute for professional legal advice. 
                  Consult with a qualified IP attorney before filing any IP applications in India.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedIPProtectionTool;
