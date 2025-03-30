
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { FileSignature, Upload, Check, User, Users, Link2, Mail } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type SignatureStatus = 'awaiting' | 'signed' | 'expired' | 'canceled';

interface SignerType {
  email: string;
  name: string;
  role: string;
  status: SignatureStatus;
  signedAt?: string;
}

const ESignaturePage = () => {
  const [documentName, setDocumentName] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentText, setDocumentText] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const [expirationDays, setExpirationDays] = useState('14');
  const [activeTab, setActiveTab] = useState('upload');
  const [documentId, setDocumentId] = useState<string | null>(null);
  
  // For managing signers
  const [signers, setSigners] = useState<SignerType[]>([
    { email: '', name: '', role: 'signer', status: 'awaiting' }
  ]);
  
  // For demonstration purposes - documents waiting for signature
  const [pendingDocuments, setPendingDocuments] = useState<{
    id: string;
    name: string;
    createdAt: string;
    signers: SignerType[];
    status: 'pending' | 'completed' | 'expired';
  }[]>([
    {
      id: 'doc-001',
      name: 'Contractor Agreement - XYZ Corp',
      createdAt: '2023-11-15',
      signers: [
        { email: 'john.doe@example.com', name: 'John Doe', role: 'signer', status: 'signed', signedAt: '2023-11-16' },
        { email: 'jane.smith@example.com', name: 'Jane Smith', role: 'signer', status: 'awaiting' }
      ],
      status: 'pending'
    },
    {
      id: 'doc-002',
      name: 'NDA - Project Phoenix',
      createdAt: '2023-11-10',
      signers: [
        { email: 'john.doe@example.com', name: 'John Doe', role: 'signer', status: 'signed', signedAt: '2023-11-11' },
        { email: 'alice.cooper@example.com', name: 'Alice Cooper', role: 'signer', status: 'signed', signedAt: '2023-11-12' }
      ],
      status: 'completed'
    }
  ]);
  
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };
  
  const addSigner = () => {
    setSigners([...signers, { email: '', name: '', role: 'signer', status: 'awaiting' }]);
  };
  
  const removeSigner = (index: number) => {
    if (signers.length > 1) {
      const updatedSigners = [...signers];
      updatedSigners.splice(index, 1);
      setSigners(updatedSigners);
    }
  };
  
  const updateSigner = (index: number, field: keyof SignerType, value: string) => {
    const updatedSigners = [...signers];
    updatedSigners[index] = { ...updatedSigners[index], [field]: value };
    setSigners(updatedSigners);
  };
  
  const handleSubmit = () => {
    // Validate inputs
    if ((uploadMode === 'file' && !documentFile) || (uploadMode === 'text' && !documentText)) {
      toast({
        title: "Document Required",
        description: "Please upload a file or enter document text",
        variant: "destructive"
      });
      return;
    }
    
    if (!documentName) {
      toast({
        title: "Document Name Required",
        description: "Please provide a name for your document",
        variant: "destructive"
      });
      return;
    }
    
    const invalidSigners = signers.filter(signer => !signer.email || !signer.name);
    if (invalidSigners.length > 0) {
      toast({
        title: "Incomplete Signer Information",
        description: "Please provide name and email for all signers",
        variant: "destructive"
      });
      return;
    }
    
    // Generate a document ID
    const newDocId = `doc-${Math.random().toString(36).substring(2, 7)}`;
    setDocumentId(newDocId);
    
    // In a real implementation, this would upload the document to a service
    // and create signature requests
    
    // Add to pending documents for demo purposes
    const newDocument = {
      id: newDocId,
      name: documentName,
      createdAt: new Date().toISOString().split('T')[0],
      signers: [...signers],
      status: 'pending' as const
    };
    
    setPendingDocuments([newDocument, ...pendingDocuments]);
    
    // Show success toast
    toast({
      title: "Document Prepared",
      description: "Signature requests have been sent to all signers",
    });
    
    // Switch to documents tab
    setActiveTab('documents');
    
    // Reset form
    setDocumentName('');
    setDocumentFile(null);
    setDocumentText('');
    setSigners([{ email: '', name: '', role: 'signer', status: 'awaiting' }]);
  };
  
  const getStatusColor = (status: SignatureStatus) => {
    switch (status) {
      case 'signed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'awaiting':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'canceled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  const getDocumentStatusColor = (status: 'pending' | 'completed' | 'expired') => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  const handleSendReminder = (docId: string, signerEmail: string) => {
    toast({
      title: "Reminder Sent",
      description: `A reminder has been sent to ${signerEmail}`,
    });
  };
  
  const markAsSigned = (docId: string, signerEmail: string) => {
    const updatedDocuments = pendingDocuments.map(doc => {
      if (doc.id === docId) {
        const updatedSigners = doc.signers.map(signer => {
          if (signer.email === signerEmail) {
            return {
              ...signer,
              status: 'signed' as const,
              signedAt: new Date().toISOString().split('T')[0]
            };
          }
          return signer;
        });
        
        // Check if all signers have signed
        const allSigned = updatedSigners.every(signer => signer.status === 'signed');
        
        return {
          ...doc,
          signers: updatedSigners,
          status: allSigned ? 'completed' as const : 'pending' as const
        };
      }
      return doc;
    });
    
    setPendingDocuments(updatedDocuments);
    
    toast({
      title: "Document Signed",
      description: `The document has been marked as signed by ${signerEmail}`,
    });
  };
  
  return (
    <LegalToolLayout
      title="E-Signature Integration"
      description="Securely send documents for electronic signature, track signing status, and maintain a legally-binding audit trail of all signed documents."
      icon={<FileSignature className="w-6 h-6 text-white" />}
    >
      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Send for Signature
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileSignature className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Information</CardTitle>
                <CardDescription>Upload or paste the document to be signed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="document-name">Document Name*</Label>
                  <Input
                    id="document-name"
                    placeholder="e.g., Employment Contract - Jane Doe"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Document Source</Label>
                  <div className="flex space-x-2 mt-1">
                    <Button
                      type="button"
                      variant={uploadMode === 'file' ? 'default' : 'outline'}
                      onClick={() => setUploadMode('file')}
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                    <Button
                      type="button"
                      variant={uploadMode === 'text' ? 'default' : 'outline'}
                      onClick={() => setUploadMode('text')}
                      className="flex-1"
                    >
                      <FileSignature className="h-4 w-4 mr-2" />
                      Create Text Document
                    </Button>
                  </div>
                </div>
                
                {uploadMode === 'file' ? (
                  <div>
                    <Label htmlFor="document-upload">Upload Document (PDF, DOCX, TXT)*</Label>
                    <div className="mt-1 flex items-center">
                      <Input 
                        id="document-upload" 
                        type="file" 
                        accept=".pdf,.docx,.doc,.txt" 
                        onChange={handleFileChange}
                      />
                    </div>
                    {documentFile && (
                      <p className="text-sm text-legal-muted mt-2">
                        Selected: {documentFile.name} ({Math.round(documentFile.size / 1024)} KB)
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="document-text">Document Text*</Label>
                    <Textarea
                      id="document-text"
                      placeholder="Enter the document text here..."
                      className="min-h-36"
                      value={documentText}
                      onChange={(e) => setDocumentText(e.target.value)}
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="expiration">Signature Request Expiration</Label>
                  <Select value={expirationDays} onValueChange={setExpirationDays}>
                    <SelectTrigger id="expiration">
                      <SelectValue placeholder="Select expiration period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Signers</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addSigner}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Add Signer
                  </Button>
                </CardTitle>
                <CardDescription>Add people who need to sign this document</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {signers.map((signer, index) => (
                  <div key={index} className="p-4 border border-legal-border dark:border-legal-slate/20 rounded-md space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Signer {index + 1}</h4>
                      {signers.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeSigner(index)}
                          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`signer-name-${index}`}>Name*</Label>
                        <Input
                          id={`signer-name-${index}`}
                          placeholder="Full name"
                          value={signer.name}
                          onChange={(e) => updateSigner(index, 'name', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`signer-email-${index}`}>Email*</Label>
                        <Input
                          id={`signer-email-${index}`}
                          type="email"
                          placeholder="email@example.com"
                          value={signer.email}
                          onChange={(e) => updateSigner(index, 'email', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`signer-role-${index}`}>Role</Label>
                      <Select 
                        value={signer.role} 
                        onValueChange={(value) => updateSigner(index, 'role', value)}
                      >
                        <SelectTrigger id={`signer-role-${index}`}>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="signer">Signer</SelectItem>
                          <SelectItem value="approver">Approver</SelectItem>
                          <SelectItem value="viewer">Viewer (CC)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-end border-t border-legal-border dark:border-legal-slate/20 py-4">
                <Button onClick={handleSubmit}>
                  Send for Signature
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-6 mt-6">
            {pendingDocuments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileSignature className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No Documents</h3>
                  <p className="text-legal-muted dark:text-gray-400 text-center max-w-md mt-2">
                    You haven't sent any documents for signature yet. Use the "Send for Signature" tab to get started.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab('upload')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Send New Document
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingDocuments.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{doc.name}</CardTitle>
                          <CardDescription>Created on {doc.createdAt}</CardDescription>
                        </div>
                        <Badge className={getDocumentStatusColor(doc.status)}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-legal-slate dark:text-white">Signers:</h4>
                        <div className="space-y-2">
                          {doc.signers.map((signer, idx) => (
                            <div 
                              key={idx} 
                              className="flex flex-wrap justify-between items-center py-2 px-3 rounded-md bg-gray-50 dark:bg-gray-800/50"
                            >
                              <div className="flex items-center space-x-3">
                                <User className="h-4 w-4 text-legal-muted" />
                                <div>
                                  <p className="font-medium">{signer.name}</p>
                                  <p className="text-sm text-legal-muted">{signer.email}</p>
                                </div>
                                <Badge className={getStatusColor(signer.status)}>
                                  {signer.status.charAt(0).toUpperCase() + signer.status.slice(1)}
                                </Badge>
                                {signer.signedAt && (
                                  <span className="text-xs text-legal-muted">
                                    Signed on {signer.signedAt}
                                  </span>
                                )}
                              </div>
                              
                              <div className="mt-2 sm:mt-0 flex gap-2">
                                {signer.status === 'awaiting' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleSendReminder(doc.id, signer.email)}
                                    >
                                      <Mail className="h-3.5 w-3.5 mr-1" />
                                      Remind
                                    </Button>
                                    
                                    <Button 
                                      size="sm"
                                      onClick={() => markAsSigned(doc.id, signer.email)}
                                    >
                                      <Check className="h-3.5 w-3.5 mr-1" />
                                      Mark as Signed
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-legal-border dark:border-legal-slate/20 py-4">
                      <Button variant="outline" onClick={() => {
                        toast({
                          title: "Document Link Copied",
                          description: "Anyone with this link can view the document status",
                        });
                      }}>
                        <Link2 className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                      
                      <Button variant="outline" onClick={() => {
                        toast({
                          title: "Document Downloaded",
                          description: "The document has been downloaded to your device",
                        });
                      }}>
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </LegalToolLayout>
  );
};

export default ESignaturePage;
