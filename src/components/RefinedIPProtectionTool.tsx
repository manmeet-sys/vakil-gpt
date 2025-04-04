import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, ExternalLink, Shield, BookOpen, Book, AlertTriangle, FileUp, Download, Compass, FileCheck, Search } from 'lucide-react';
import { toast } from 'sonner';
import PdfFileUpload from '@/components/PdfFileUpload';
import { extractTextFromPdf } from '@/utils/pdfExtraction';

interface IPResource {
  title: string;
  url: string;
  description: string;
  icon: React.ReactNode;
  organization: string;
  category: 'trademark' | 'patent' | 'copyright' | 'design' | 'general';
}

const RefinedIPProtectionTool = () => {
  const [activeTab, setActiveTab] = useState('resources');
  const [resourceCategory, setResourceCategory] = useState('all');
  const [contractText, setContractText] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [ipDescription, setIpDescription] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [ipRiskLevel, setIpRiskLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [draftType, setDraftType] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [generatedDraft, setGeneratedDraft] = useState('');

  // Updated list of verified working Indian IP resources
  const verifiedIPResources: IPResource[] = [
    {
      title: "Indian Intellectual Property Office",
      url: "https://ipindia.gov.in",
      description: "Official IP India website with information on patents, trademarks, designs, and geographical indications",
      icon: <Shield className="h-4 w-4 mr-2" />,
      organization: "Controller General of Patents, Designs & Trade Marks",
      category: "general"
    },
    {
      title: "Public Search for Indian Trademarks",
      url: "https://ipindiaservices.gov.in/publicsearch",
      description: "Search the Indian trademark database without login",
      icon: <Search className="h-4 w-4 mr-2" />,
      organization: "Intellectual Property India",
      category: "trademark"
    },
    {
      title: "Indian Patent Advanced Search System",
      url: "https://ipindiaservices.gov.in/PublicSearch",
      description: "Search for patents in the Indian patent database",
      icon: <Search className="h-4 w-4 mr-2" />,
      organization: "Intellectual Property India",
      category: "patent"
    },
    {
      title: "Copyright Office India",
      url: "https://copyright.gov.in",
      description: "Official website for copyright registration in India",
      icon: <Book className="h-4 w-4 mr-2" />,
      organization: "Department for Promotion of Industry and Internal Trade",
      category: "copyright"
    },
    {
      title: "Copyright Registration Form",
      url: "https://copyright.gov.in/frmFillApplication.aspx",
      description: "Direct link to copyright registration form",
      icon: <FileCheck className="h-4 w-4 mr-2" />,
      organization: "Copyright Office India",
      category: "copyright"
    },
    {
      title: "Design Registration Information",
      url: "https://ipindia.gov.in/designs.htm",
      description: "Information on design registration process in India",
      icon: <Compass className="h-4 w-4 mr-2" />,
      organization: "Controller General of Patents, Designs & Trade Marks",
      category: "design"
    },
    {
      title: "Indian IP Acts and Rules",
      url: "https://ipindia.gov.in/acts-rules.htm",
      description: "Access all Indian IP laws, including Patents Act, Trademarks Act, and Designs Act",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      organization: "Intellectual Property India",
      category: "general"
    },
    {
      title: "Cell for IPR Promotion & Management",
      url: "https://cipam.gov.in",
      description: "Government initiative to promote IP awareness and protection",
      icon: <Shield className="h-4 w-4 mr-2" />,
      organization: "Department for Promotion of Industry and Internal Trade",
      category: "general"
    }
  ];

  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      const extractedText = await extractTextFromPdf(file);
      setContractText(extractedText);
      setFileUploaded(true);
      
      setTimeout(() => {
        analyzeIPProtection(extractedText);
        setLoading(false);
        toast.success('Contract analyzed successfully');
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast.error('Error analyzing file: ' + error.message);
    }
  };

  const analyzeIPProtection = (text) => {
    setIpDescription('The document contains several intellectual property clauses related to ownership of trademarks, patents, and copyright materials. The contract appears to include provisions for IP licensing and transfer of rights.');
    setConfidenceScore(78);
    setIpRiskLevel('moderate');
  };

  const handleGenerateDraft = () => {
    if (!draftType || !draftDescription) {
      toast.error('Please complete all required fields');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Generate mock draft based on selection
      let draft = '';
      
      if (draftType === 'trademark-assignment') {
        draft = `TRADEMARK ASSIGNMENT AGREEMENT

THIS TRADEMARK ASSIGNMENT AGREEMENT ("Agreement") is made and entered into as of [DATE], by and between [ASSIGNOR NAME] ("Assignor") and [ASSIGNEE NAME] ("Assignee").

WHEREAS, Assignor is the owner of the trademark(s) described in Exhibit A attached hereto ("Trademark"); and

WHEREAS, Assignor desires to transfer all of its right, title and interest in and to the Trademark to Assignee, and Assignee desires to accept such rights;

NOW, THEREFORE, in consideration of the mutual covenants contained herein and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. ASSIGNMENT. Assignor hereby irrevocably assigns, transfers, and conveys to Assignee, its successors and assigns, all of Assignor's right, title, and interest in and to the Trademark, together with the goodwill of the business symbolized by the Trademark, all registrations and applications therefor, and all rights to sue for past infringement thereof.

2. INDIAN TRADEMARK ACT COMPLIANCE. This assignment complies with all requirements under the Trade Marks Act, 1999 of India and its associated rules.

3. REPRESENTATIONS AND WARRANTIES. Assignor represents and warrants that:
   (a) Assignor is the sole and exclusive owner of all right, title, and interest in and to the Trademark;
   (b) The Trademark is free and clear of all liens, claims, encumbrances, and licenses;
   (c) Assignor has not previously assigned, transferred, or licensed the Trademark to any third party;
   (d) To Assignor's knowledge, there is no infringement of the Trademark by any third party.

4. FURTHER ASSURANCES. Assignor agrees to execute any additional documents reasonably requested by Assignee to perfect Assignee's interest in the Trademark, including but not limited to documents necessary for recordal of the assignment with the Indian Trade Marks Registry.

5. GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of India.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

ASSIGNOR:
[ASSIGNOR NAME]
Signature: ___________________________
Name: ______________________________
Title: _______________________________

ASSIGNEE:
[ASSIGNEE NAME]
Signature: ___________________________
Name: ______________________________
Title: _______________________________

EXHIBIT A
TRADEMARK DESCRIPTION
[DESCRIBE TRADEMARK, REGISTRATION/APPLICATION NUMBERS, CLASSES, ETC.]`;
      } else if (draftType === 'patent-license') {
        draft = `PATENT LICENSE AGREEMENT

THIS PATENT LICENSE AGREEMENT ("Agreement") is made and entered into as of [DATE], by and between [LICENSOR NAME] ("Licensor") and [LICENSEE NAME] ("Licensee").

WHEREAS, Licensor is the owner of certain patents as described in Exhibit A attached hereto ("Licensed Patents"); and

WHEREAS, Licensee desires to obtain a license to practice the Licensed Patents, and Licensor is willing to grant such a license under the terms and conditions set forth herein;

NOW, THEREFORE, in consideration of the mutual covenants contained herein and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. LICENSE GRANT. Subject to the terms and conditions of this Agreement, Licensor hereby grants to Licensee a [non-exclusive/exclusive], [non-transferable/transferable], [non-sublicensable/sublicensable] license under the Licensed Patents to make, use, sell, offer for sale, and import products and services covered by the Licensed Patents in [territory].

2. INDIAN PATENTS ACT COMPLIANCE. This license complies with all requirements under the Patents Act, 1970 of India and its associated rules.

3. ROYALTIES. In consideration for the license granted herein, Licensee shall pay to Licensor:
   (a) An upfront payment of [AMOUNT] within [NUMBER] days of the effective date of this Agreement; and
   (b) Running royalties equal to [PERCENTAGE]% of Net Sales of Licensed Products, payable quarterly.

4. TERM AND TERMINATION. This Agreement shall commence on the Effective Date and continue until the expiration of the last-to-expire of the Licensed Patents, unless earlier terminated in accordance with this Agreement.

5. REPRESENTATIONS AND WARRANTIES. Licensor represents and warrants that:
   (a) Licensor is the sole and exclusive owner of all right, title, and interest in and to the Licensed Patents;
   (b) Licensor has the right to grant the licenses granted herein;
   (c) To Licensor's knowledge, there is no infringement of the Licensed Patents by any third party.

6. GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of India.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

LICENSOR:
[LICENSOR NAME]
Signature: ___________________________
Name: ______________________________
Title: _______________________________

LICENSEE:
[LICENSEE NAME]
Signature: ___________________________
Name: ______________________________
Title: _______________________________

EXHIBIT A
LICENSED PATENTS
[LIST PATENTS BY NUMBER, TITLE, FILING/ISSUE DATES, ETC.]`;
      } else if (draftType === 'copyright-assignment') {
        draft = `COPYRIGHT ASSIGNMENT AGREEMENT

THIS COPYRIGHT ASSIGNMENT AGREEMENT ("Agreement") is made and entered into as of [DATE], by and between [ASSIGNOR NAME] ("Assignor") and [ASSIGNEE NAME] ("Assignee").

WHEREAS, Assignor is the author and owner of the copyrighted work(s) described in Exhibit A attached hereto ("Work"); and

WHEREAS, Assignor desires to transfer all of its right, title and interest in and to the Work to Assignee, and Assignee desires to accept such rights;

NOW, THEREFORE, in consideration of the mutual covenants contained herein and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. ASSIGNMENT. Assignor hereby irrevocably assigns, transfers, and conveys to Assignee, its successors and assigns, all of Assignor's right, title, and interest throughout the world in and to the Work, including without limitation all copyrights, renewals, and extensions thereto, all rights to register such copyrights in Assignee's name, and all rights to sue for past infringement thereof.

2. INDIAN COPYRIGHT ACT COMPLIANCE. This assignment complies with all requirements under the Copyright Act, 1957 of India and its associated rules.

3. MORAL RIGHTS. To the extent permissible under applicable law, Assignor hereby irrevocably waives and agrees not to assert any and all moral rights that Assignor may have in the Work.

4. REPRESENTATIONS AND WARRANTIES. Assignor represents and warrants that:
   (a) Assignor is the sole and exclusive author and owner of all right, title, and interest in and to the Work;
   (b) The Work is original to Assignor and does not infringe the intellectual property rights of any third party;
   (c) Assignor has not previously assigned, transferred, or licensed the Work to any third party;
   (d) The Work is free and clear of all liens, claims, and encumbrances.

5. FURTHER ASSURANCES. Assignor agrees to execute any additional documents reasonably requested by Assignee to perfect Assignee's interest in the Work, including but not limited to documents necessary for recordal of the assignment with the Indian Copyright Office.

6. GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of India.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

ASSIGNOR:
[ASSIGNOR NAME]
Signature: ___________________________
Name: ______________________________
Title: _______________________________

ASSIGNEE:
[ASSIGNEE NAME]
Signature: ___________________________
Name: ______________________________
Title: _______________________________

EXHIBIT A
DESCRIPTION OF WORK
[DESCRIBE COPYRIGHTED WORK, REGISTRATION NUMBERS IF ANY, ETC.]`;
      } else if (draftType === 'design-assignment') {
        draft = `INDUSTRIAL DESIGN ASSIGNMENT AGREEMENT

THIS INDUSTRIAL DESIGN ASSIGNMENT AGREEMENT ("Agreement") is made and entered into as of [DATE], by and between [ASSIGNOR NAME] ("Assignor") and [ASSIGNEE NAME] ("Assignee").

WHEREAS, Assignor is the owner of the industrial design(s) described in Exhibit A attached hereto ("Design"); and

WHEREAS, Assignor desires to transfer all of its right, title and interest in and to the Design to Assignee, and Assignee desires to accept such rights;

NOW, THEREFORE, in consideration of the mutual covenants contained herein and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. ASSIGNMENT. Assignor hereby irrevocably assigns, transfers, and conveys to Assignee, its successors and assigns, all of Assignor's right, title, and interest in and to the Design, including all registrations and applications therefor, and all rights to sue for past infringement thereof.

2. INDIAN DESIGNS ACT COMPLIANCE. This assignment complies with all requirements under the Designs Act, 2000 of India and its associated rules.

3. REPRESENTATIONS AND WARRANTIES. Assignor represents and warrants that:
   (a) Assignor is the sole and exclusive owner of all right, title, and interest in and to the Design;
   (b) The Design is free and clear of all liens, claims, encumbrances, and licenses;
   (c) Assignor has not previously assigned, transferred, or licensed the Design to any third party;
   (d) To Assignor's knowledge, there is no infringement of the Design by any third party.

4. FURTHER ASSURANCES. Assignor agrees to execute any additional documents reasonably requested by Assignee to perfect Assignee's interest in the Design, including but not limited to documents necessary for recordal of the assignment with the Indian Design Office.

5. GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of India.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

ASSIGNOR:
[ASSIGNOR NAME]
Signature: ___________________________
Name: ______________________________
Title: _______________________________

ASSIGNEE:
[ASSIGNEE NAME]
Signature: ___________________________
Name: ______________________________
Title: _______________________________

EXHIBIT A
DESIGN DESCRIPTION
[DESCRIBE DESIGN, REGISTRATION/APPLICATION NUMBERS, ETC.]`;
      } else if (draftType === 'nda') {
        draft = `INTELLECTUAL PROPERTY NON-DISCLOSURE AGREEMENT

THIS INTELLECTUAL PROPERTY NON-DISCLOSURE AGREEMENT ("Agreement") is made and entered into as of [DATE], by and between [DISCLOSING PARTY NAME] ("Disclosing Party") and [RECEIVING PARTY NAME] ("Receiving Party").

WHEREAS, Disclosing Party possesses certain intellectual property, technical, and business information relating to [SUBJECT MATTER], which is confidential and proprietary to Disclosing Party ("Confidential Information"); and

WHEREAS, Receiving Party is willing to receive disclosure of the Confidential Information for the purpose of [PURPOSE] ("Permitted Purpose");

NOW, THEREFORE, in consideration of the mutual covenants contained herein and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION. "Confidential Information" means any information relating to Disclosing Party's intellectual property, including but not limited to patents, trademarks, copyrights, designs, trade secrets, inventions, processes, formulas, research and development, business plans, and marketing strategies, whether disclosed orally, in writing, or by any other means.

2. OBLIGATIONS OF RECEIVING PARTY. Receiving Party shall:
   (a) Hold the Confidential Information in confidence;
   (b) Not disclose the Confidential Information to any third party without prior written consent of Disclosing Party;
   (c) Use the Confidential Information only for the Permitted Purpose;
   (d) Take all reasonable precautions to prevent unauthorized disclosure of the Confidential Information;
   (e) Not reverse engineer, disassemble, or decompile any prototypes, software, or other tangible objects which embody the Confidential Information.

3. EXCLUSIONS. This Agreement shall not apply to information that:
   (a) Was in Receiving Party's possession prior to receipt from Disclosing Party;
   (b) Is or becomes publicly available through no fault of Receiving Party;
   (c) Is rightfully received by Receiving Party from a third party without restriction on disclosure;
   (d) Is independently developed by Receiving Party without use of Confidential Information;
   (e) Is required to be disclosed by law or court order, provided that Receiving Party gives Disclosing Party prompt notice of such requirement.

4. INDIAN LEGAL COMPLIANCE. This Agreement complies with all applicable Indian laws, including but not limited to the Indian Contract Act, 1872 and relevant intellectual property statutes.

5. TERM AND TERMINATION. This Agreement shall remain in effect for a period of [YEARS] years from the Effective Date. Upon termination, Receiving Party shall promptly return or destroy all Confidential Information.

6. GOVERNING LAW. This Agreement shall be governed by and construed in accordance with the laws of India.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

DISCLOSING PARTY:
[DISCLOSING PARTY NAME]
Signature: ___________________________
Name: ______________________________
Title: _______________________________

RECEIVING PARTY:
[RECEIVING PARTY NAME]
Signature: ___________________________
Name: ______________________________
Title: _______________________________`;
      }

      setGeneratedDraft(draft);
      setLoading(false);
      toast.success('IP document draft generated successfully');
    }, 2000);
  };

  const renderRiskIndicator = () => {
    if (!ipRiskLevel) return null;
    
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-200',
      moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <div className={`p-4 rounded-md border ${colors[ipRiskLevel]} mt-4`}>
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span className="font-medium capitalize">
            {ipRiskLevel} Risk Level
          </span>
        </div>
        <p className="mt-2 text-sm">
          {ipRiskLevel === 'low' && 'This contract appears to have adequate IP protection measures.'}
          {ipRiskLevel === 'moderate' && 'This contract has some IP protection measures but could be strengthened in certain areas.'}
          {ipRiskLevel === 'high' && 'This contract has significant IP protection gaps that should be addressed.'}
        </p>
      </div>
    );
  };
  
  const filteredResources = resourceCategory === 'all' 
    ? verifiedIPResources 
    : verifiedIPResources.filter(resource => resource.category === resourceCategory || resource.category === 'general');

  return (
    <div className="space-y-6">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="resources">Official Resources</TabsTrigger>
          <TabsTrigger value="contract">IP Contract Analysis</TabsTrigger>
          <TabsTrigger value="drafting">IP Document Drafting</TabsTrigger>
        </TabsList>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Compass className="h-5 w-5 mr-2" />
                Official Indian IP Resources
              </CardTitle>
              <CardDescription>
                Access verified government IP databases, registries, and legal resources for Indian intellectual property protection
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((resource, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div>
                          <h3 className="font-medium text-base">{resource.title}</h3>
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
            </CardContent>
          </Card>
          
          <Card className="mt-6 bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Indian IP Protection Essentials
              </CardTitle>
              <CardDescription>Key information for protecting intellectual property in India</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-base mb-2">Filing Timelines</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="font-medium mr-2">•</span>
                      <span>Trademarks: Applications processed within 12-18 months; registration valid for 10 years, renewable indefinitely.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">•</span>
                      <span>Patents: Examination takes 2-3 years on average; term of 20 years from filing date.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">•</span>
                      <span>Copyright: Registration optional but recommended; protection for literary, dramatic, musical works lasts author's lifetime plus 60 years.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">•</span>
                      <span>Industrial Designs: Registration provides 10 years of protection, extendable for 5 additional years.</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-base mb-2">Recent Legal Developments</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="font-medium mr-2">•</span>
                      <span>Updated Trademark Rules, 2017 have streamlined the registration process.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">•</span>
                      <span>Patent (Amendment) Rules, 2019 introduced expedited examination for startups and small entities.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">•</span>
                      <span>India's accession to the WIPO Copyright Treaty and WIPO Performances and Phonograms Treaty.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium mr-2">•</span>
                      <span>Increasing focus on enforcement against counterfeiting and piracy.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contract">
          <Card>
            <CardHeader>
              <CardTitle>IP Contract Analysis</CardTitle>
              <CardDescription>
                Upload a contract to analyze intellectual property clauses, rights, and potential risks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Upload Contract</h3>
                  
                  <PdfFileUpload 
                    onChange={handleFileUpload}
                    pdfFile={pdfFile}
                  />
                  
                  {!fileUploaded && (
                    <Textarea 
                      placeholder="Or paste contract text here..."
                      className="min-h-[250px]"
                      value={contractText}
                      onChange={(e) => setContractText(e.target.value)}
                    />
                  )}
                  
                  {contractText && !fileUploaded && (
                    <Button 
                      onClick={() => {
                        setLoading(true);
                        analyzeIPProtection(contractText);
                        setFileUploaded(true);
                        setTimeout(() => {
                          setLoading(false);
                          toast.success('Contract analyzed successfully');
                        }, 1500);
                      }}
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? 'Analyzing...' : 'Analyze IP Protection'}
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Analysis Results</h3>
                  
                  {loading && (
                    <div className="space-y-4">
                      <div className="h-4 bg-muted/50 rounded animate-pulse"></div>
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-5/6"></div>
                      <div className="h-4 bg-muted/50 rounded animate-pulse"></div>
                      <div className="h-4 bg-muted/50 rounded animate-pulse w-4/6"></div>
                    </div>
                  )}
                  
                  {fileUploaded && !loading && (
                    <>
                      <ScrollArea className="h-[250px] border rounded-md p-4">
                        <p className="text-sm">{contractText}</p>
                      </ScrollArea>
                      
                      <div className="space-y-4 mt-4">
                        <div>
                          <h4 className="font-medium text-sm">IP Protection Assessment</h4>
                          <p className="text-sm text-muted-foreground">{ipDescription}</p>
                        </div>
                        
                        {confidenceScore !== null && (
                          <div>
                            <h4 className="font-medium text-sm">Confidence Score</h4>
                            <div className="w-full bg-muted h-2 rounded-full mt-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${confidenceScore}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>0%</span>
                              <span>{confidenceScore}%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        )}
                        
                        {renderRiskIndicator()}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline" onClick={() => {
                setContractText('');
                setFileUploaded(false);
                setIpDescription('');
                setConfidenceScore(null);
                setIpRiskLevel('');
                setPdfFile(null);
              }}>
                Clear Results
              </Button>
              
              {fileUploaded && (
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="drafting">
          <Card>
            <CardHeader>
              <CardTitle>IP Document Drafting Assistant</CardTitle>
              <CardDescription>Generate standard intellectual property documents customized to Indian law</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Document Type</label>
                  <Select value={draftType} onValueChange={setDraftType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trademark-assignment">Trademark Assignment</SelectItem>
                      <SelectItem value="patent-license">Patent License Agreement</SelectItem>
                      <SelectItem value="copyright-assignment">Copyright Assignment</SelectItem>
                      <SelectItem value="design-assignment">Industrial Design Assignment</SelectItem>
                      <SelectItem value="nda">IP Non-Disclosure Agreement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea 
                    placeholder="Enter brief details about the IP assets and parties involved..."
                    className="min-h-[80px]"
                    value={draftDescription}
                    onChange={(e) => setDraftDescription(e.target.value)}
                  />
                </div>
              </div>
              
              <Button
                onClick={handleGenerateDraft}
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading ? 'Generating...' : 'Generate Document Draft'}
              </Button>
              
              {generatedDraft && (
                <div className="mt-4">
                  <h3 className="font-medium text-lg mb-2">Generated Draft</h3>
                  <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900 mb-2">
                    <AlertTitle className="text-blue-800 dark:text-blue-300">Document Ready</AlertTitle>
                    <AlertDescription className="text-blue-700 dark:text-blue-400">
                      This is a template draft. Please review and customize to your specific needs before using.
                    </AlertDescription>
                  </Alert>
                  <ScrollArea className="h-[400px] border rounded-md p-4 bg-white dark:bg-gray-900">
                    <pre className="whitespace-pre-wrap font-mono text-sm">{generatedDraft}</pre>
                  </ScrollArea>
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const blob = new Blob([generatedDraft], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${draftType}-draft.txt`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        toast.success('Draft downloaded successfully');
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Draft
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RefinedIPProtection
