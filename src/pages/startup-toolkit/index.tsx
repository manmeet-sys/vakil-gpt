
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDown, CheckCircle, Briefcase, Shield, FileText, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DOCUMENT_CATEGORIES = [
  { id: 'incorporation', name: 'Incorporation' },
  { id: 'employment', name: 'Employment' },
  { id: 'intellectual-property', name: 'Intellectual Property' },
  { id: 'funding', name: 'Funding & Investment' },
  { id: 'contracts', name: 'General Contracts' },
];

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  preview: string;
}

const DOCUMENTS: Document[] = [
  {
    id: 'certificate-incorporation',
    title: 'Certificate of Incorporation',
    description: 'Official document establishing your business as a corporation.',
    category: 'incorporation',
    preview: 'A standard certificate of incorporation document with customizable fields for your business details.',
  },
  {
    id: 'bylaws',
    title: 'Corporate Bylaws',
    description: 'Rules governing the operation of your corporation.',
    category: 'incorporation',
    preview: 'Comprehensive bylaws template outlining corporate structure, officer roles, and procedures.',
  },
  {
    id: 'operating-agreement',
    title: 'LLC Operating Agreement',
    description: 'Document outlining ownership and operating procedures of an LLC.',
    category: 'incorporation',
    preview: 'Customizable operating agreement template covering membership interests, capital contributions, and management.',
  },
  {
    id: 'employment-agreement',
    title: 'Employment Agreement',
    description: 'Contract between your company and employees.',
    category: 'employment',
    preview: 'Standard employment contract outlining job duties, compensation, benefits, and termination conditions.',
  },
  {
    id: 'contractor-agreement',
    title: 'Independent Contractor Agreement',
    description: 'Agreement for hiring freelancers or consultants.',
    category: 'employment',
    preview: 'Detailed agreement covering scope of work, payment terms, and intellectual property rights.',
  },
  {
    id: 'nda',
    title: 'Non-Disclosure Agreement',
    description: 'Protects confidential business information.',
    category: 'intellectual-property',
    preview: 'Comprehensive NDA template protecting trade secrets and confidential information.',
  },
  {
    id: 'ip-assignment',
    title: 'IP Assignment Agreement',
    description: 'Transfers intellectual property rights to your company.',
    category: 'intellectual-property',
    preview: 'Template for assigning all intellectual property rights from employees or contractors to your company.',
  },
  {
    id: 'term-sheet',
    title: 'Investment Term Sheet',
    description: 'Outlines terms for investment in your startup.',
    category: 'funding',
    preview: 'Standard term sheet template with customizable investment terms, valuation, and investor rights.',
  },
  {
    id: 'subscription-agreement',
    title: 'Subscription Agreement',
    description: 'Documents investment terms for equity purchase.',
    category: 'funding',
    preview: 'Detailed subscription agreement for selling equity shares to investors.',
  },
  {
    id: 'customer-agreement',
    title: 'Customer Agreement',
    description: 'Terms of service for your customers.',
    category: 'contracts',
    preview: 'Comprehensive customer agreement covering service terms, payment, liability, and dispute resolution.',
  },
  {
    id: 'vendor-agreement',
    title: 'Vendor Agreement',
    description: 'Contract for suppliers and service providers.',
    category: 'contracts',
    preview: 'Standard vendor agreement template with customizable terms for product/service delivery.',
  },
];

const StartupToolkitPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(DOCUMENT_CATEGORIES[0].id);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { toast } = useToast();

  const filteredDocuments = DOCUMENTS.filter(doc => doc.category === selectedCategory);

  const handleDownload = (document: Document) => {
    toast({
      title: "Document Downloaded",
      description: `${document.title} has been downloaded successfully.`,
    });
  };

  return (
    <LegalToolLayout
      title="Startup Legal Toolkit"
      description="Access essential legal templates and documents for your startup or small business. Customize, download, and use these documents to help establish and grow your business."
      icon={<Briefcase className="w-6 h-6 text-white" />}
    >
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Document Categories</CardTitle>
              <CardDescription>Browse by type of document</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue={selectedCategory} orientation="vertical" className="w-full" onValueChange={setSelectedCategory}>
                <TabsList className="w-full flex flex-col h-auto space-y-1 bg-transparent p-0">
                  {DOCUMENT_CATEGORIES.map(category => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="justify-start w-full rounded-none border-l-2 border-transparent px-6 py-3 text-left data-[state=active]:border-l-2 data-[state=active]:border-legal-accent data-[state=active]:bg-legal-accent/5"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl">Why Use Our Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-legal-accent mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-legal-muted">Lawyer-reviewed templates tailored for startups</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-legal-accent mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-legal-muted">Customizable to your specific business needs</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-legal-accent mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-legal-muted">Save thousands in legal fees with ready-to-use documents</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-legal-accent mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-legal-muted">Regular updates to reflect current legal standards</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl">{DOCUMENT_CATEGORIES.find(c => c.id === selectedCategory)?.name} Documents</CardTitle>
              <CardDescription>Select a document to preview and download</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDocument ? (
                <div className="space-y-6">
                  <Button 
                    variant="outline" 
                    className="mb-4" 
                    onClick={() => setSelectedDocument(null)}
                  >
                    Back to documents
                  </Button>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{selectedDocument.title}</h3>
                    <p className="text-legal-muted mb-4">{selectedDocument.description}</p>
                    
                    <div className="bg-legal-accent/5 p-6 rounded-md border border-legal-accent/20 mb-6">
                      <h4 className="font-medium mb-2">Document Preview</h4>
                      <p className="text-sm">{selectedDocument.preview}</p>
                    </div>
                    
                    <Button onClick={() => handleDownload(selectedDocument)}>
                      <FileDown className="mr-2 h-4 w-4" />
                      Download Template
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocuments.map(document => (
                    <Card 
                      key={document.id} 
                      className="cursor-pointer hover:border-legal-accent/30 hover:shadow transition-all"
                      onClick={() => setSelectedDocument(document)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{document.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{document.description}</CardDescription>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" className="w-full justify-between text-legal-accent">
                          View Details
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </LegalToolLayout>
  );
};

export default StartupToolkitPage;
