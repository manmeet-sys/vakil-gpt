
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  FileText,
  PlusCircle,
  Trash2,
  FileUp,
  Copy,
  FileX,
  Bookmark,
  CalendarIcon,
  CheckCircle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface Evidence {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  relevance: string;
  admissibility: string;
  status: string;
}

const evidenceTypes = [
  { value: 'document', label: 'Document' },
  { value: 'photo', label: 'Photograph' },
  { value: 'video', label: 'Video Recording' },
  { value: 'audio', label: 'Audio Recording' },
  { value: 'digital', label: 'Digital Evidence (WhatsApp, Email, etc.)' },
  { value: 'witness', label: 'Witness Statement' },
  { value: 'financial', label: 'Financial Document' },
  { value: 'medical', label: 'Medical Record' },
  { value: 'communication', label: 'Communication Record' },
  { value: 'other', label: 'Other' },
];

const relevanceOptions = [
  { value: 'high', label: 'High Relevance', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'medium', label: 'Medium Relevance', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'low', label: 'Low Relevance', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
];

const admissibilityOptions = [
  { value: 'strong', label: 'Strong Admissibility', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'potential', label: 'Potential Issues', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { value: 'questionable', label: 'Questionable Admissibility', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  { value: 'untested', label: 'Not Yet Evaluated', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
];

const statusOptions = [
  { value: 'collected', label: 'Collected', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'organized', label: 'Organized', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
  { value: 'submitted', label: 'Submitted to Court', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'pending', label: 'Pending Verification', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'rejected', label: 'Rejected by Court', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
];

const EvidenceOrganizer = () => {
  const [evidenceItems, setEvidenceItems] = useState<Evidence[]>([
    {
      id: '1',
      title: 'Marriage Certificate',
      description: 'Official marriage certificate showing date of marriage',
      type: 'document',
      date: '2020-05-15',
      relevance: 'high',
      admissibility: 'strong',
      status: 'collected'
    },
    {
      id: '2',
      title: 'Joint Bank Account Statements',
      description: 'Statements showing joint financial activities during marriage',
      type: 'financial',
      date: '2021-01-10',
      relevance: 'medium',
      admissibility: 'strong',
      status: 'organized'
    },
    {
      id: '3',
      title: 'WhatsApp Conversation',
      description: 'Messages showing discussions about matrimonial issues',
      type: 'digital',
      date: '2022-08-22',
      relevance: 'high',
      admissibility: 'potential',
      status: 'pending'
    }
  ]);
  
  const [newEvidence, setNewEvidence] = useState<Partial<Evidence>>({
    title: '',
    description: '',
    type: '',
    date: '',
    relevance: '',
    admissibility: '',
    status: 'collected'
  });
  
  const [evidenceToView, setEvidenceToView] = useState<Evidence | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const handleAddEvidence = () => {
    // Validation
    if (!newEvidence.title || !newEvidence.type || !newEvidence.relevance) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const evidence: Evidence = {
      id: Date.now().toString(),
      title: newEvidence.title || '',
      description: newEvidence.description || '',
      type: newEvidence.type || '',
      date: newEvidence.date || '',
      relevance: newEvidence.relevance || '',
      admissibility: newEvidence.admissibility || 'untested',
      status: newEvidence.status || 'collected'
    };
    
    setEvidenceItems([...evidenceItems, evidence]);
    setNewEvidence({
      title: '',
      description: '',
      type: '',
      date: '',
      relevance: '',
      admissibility: '',
      status: 'collected'
    });
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Evidence Added",
      description: "Your evidence has been added to the organizer."
    });
  };

  const handleDeleteEvidence = (id: string) => {
    setEvidenceItems(evidenceItems.filter(item => item.id !== id));
    
    toast({
      title: "Evidence Removed",
      description: "The evidence has been removed from your organizer."
    });
  };

  const handleViewEvidence = (evidence: Evidence) => {
    setEvidenceToView(evidence);
    setIsViewDialogOpen(true);
  };

  const updateEvidenceStatus = (id: string, status: string) => {
    setEvidenceItems(evidenceItems.map(item => 
      item.id === id ? { ...item, status } : item
    ));
    
    toast({
      title: "Status Updated",
      description: `Evidence status changed to "${statusOptions.find(opt => opt.value === status)?.label}".`
    });
  };

  const filteredEvidence = filter === 'all' 
    ? evidenceItems 
    : evidenceItems.filter(item => item.type === filter || item.relevance === filter || item.status === filter);

  const getRelevanceBadgeClass = (relevance: string) => {
    return relevanceOptions.find(opt => opt.value === relevance)?.color || '';
  };

  const getAdmissibilityBadgeClass = (admissibility: string) => {
    return admissibilityOptions.find(opt => opt.value === admissibility)?.color || '';
  };

  const getStatusBadgeClass = (status: string) => {
    return statusOptions.find(opt => opt.value === status)?.color || '';
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Description', 'Type', 'Date', 'Relevance', 'Admissibility', 'Status'];
    const rows = evidenceItems.map(item => [
      item.title,
      item.description,
      evidenceTypes.find(type => type.value === item.type)?.label || item.type,
      item.date,
      relevanceOptions.find(opt => opt.value === item.relevance)?.label || item.relevance,
      admissibilityOptions.find(opt => opt.value === item.admissibility)?.label || item.admissibility,
      statusOptions.find(opt => opt.value === item.status)?.label || item.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'matrimonial_evidence_list.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Your evidence list has been exported as a CSV file."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 mt-1 text-purple-600" />
            <div>
              <CardTitle className="font-playfair">Matrimonial Evidence Organizer</CardTitle>
              <CardDescription>
                Organize and categorize evidence for matrimonial proceedings by relevance and admissibility
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
            <div className="flex space-x-2">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Evidence
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add New Evidence</DialogTitle>
                    <DialogDescription>
                      Enter the details of the evidence for your matrimonial case.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Title*
                      </Label>
                      <Input
                        id="title"
                        value={newEvidence.title || ''}
                        onChange={(e) => setNewEvidence({ ...newEvidence, title: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type*
                      </Label>
                      <Select
                        value={newEvidence.type || ''}
                        onValueChange={(value) => setNewEvidence({ ...newEvidence, type: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select evidence type" />
                        </SelectTrigger>
                        <SelectContent>
                          {evidenceTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <div className="col-span-3 relative">
                        <Input
                          id="date"
                          type="date"
                          value={newEvidence.date || ''}
                          onChange={(e) => setNewEvidence({ ...newEvidence, date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="relevance" className="text-right">
                        Relevance*
                      </Label>
                      <Select
                        value={newEvidence.relevance || ''}
                        onValueChange={(value) => setNewEvidence({ ...newEvidence, relevance: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select relevance level" />
                        </SelectTrigger>
                        <SelectContent>
                          {relevanceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="admissibility" className="text-right">
                        Admissibility
                      </Label>
                      <Select
                        value={newEvidence.admissibility || ''}
                        onValueChange={(value) => setNewEvidence({ ...newEvidence, admissibility: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Evaluate admissibility" />
                        </SelectTrigger>
                        <SelectContent>
                          {admissibilityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="description" className="text-right pt-2">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={newEvidence.description || ''}
                        onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
                        className="col-span-3"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleAddEvidence}>Add Evidence</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" onClick={exportToCSV}>
                <Copy className="h-4 w-4 mr-2" />
                Export List
              </Button>
            </div>
            
            <div className="w-full md:w-auto">
              <Select
                value={filter}
                onValueChange={setFilter}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter evidence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Evidence</SelectItem>
                  <SelectItem value="high">High Relevance</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="digital">Digital Evidence</SelectItem>
                  <SelectItem value="submitted">Submitted to Court</SelectItem>
                  <SelectItem value="pending">Pending Verification</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredEvidence.length === 0 ? (
            <div className="text-center py-10 border rounded-md">
              <FileX className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No evidence found matching your filter.</p>
              <Button variant="link" className="mt-2" onClick={() => setFilter('all')}>
                Clear filter
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>Matrimonial case evidence collection</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Relevance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvidence.map((evidence) => (
                    <TableRow key={evidence.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/10" onClick={() => handleViewEvidence(evidence)}>
                      <TableCell className="font-medium">{evidence.title}</TableCell>
                      <TableCell>
                        {evidenceTypes.find(type => type.value === evidence.type)?.label || evidence.type}
                      </TableCell>
                      <TableCell>{evidence.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRelevanceBadgeClass(evidence.relevance)}>
                          {relevanceOptions.find(opt => opt.value === evidence.relevance)?.label || evidence.relevance}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadgeClass(evidence.status)}>
                          {statusOptions.find(opt => opt.value === evidence.status)?.label || evidence.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewEvidence(evidence); }}>
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/10" onClick={(e) => { e.stopPropagation(); handleDeleteEvidence(evidence.id); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-[550px]">
              {evidenceToView && (
                <>
                  <DialogHeader>
                    <DialogTitle>{evidenceToView.title}</DialogTitle>
                    <DialogDescription>
                      {evidenceTypes.find(type => type.value === evidenceToView.type)?.label || evidenceToView.type}
                      {evidenceToView.date && ` • ${new Date(evidenceToView.date).toLocaleDateString()}`}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4 space-y-4">
                    {evidenceToView.description && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Description</Label>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{evidenceToView.description}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Relevance</Label>
                        <div>
                          <Badge variant="outline" className={getRelevanceBadgeClass(evidenceToView.relevance)}>
                            {relevanceOptions.find(opt => opt.value === evidenceToView.relevance)?.label || evidenceToView.relevance}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Admissibility</Label>
                        <div>
                          <Badge variant="outline" className={getAdmissibilityBadgeClass(evidenceToView.admissibility)}>
                            {admissibilityOptions.find(opt => opt.value === evidenceToView.admissibility)?.label || evidenceToView.admissibility}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Current Status</Label>
                      <Select
                        value={evidenceToView.status}
                        onValueChange={(value) => updateEvidenceStatus(evidenceToView.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <Label className="text-sm font-medium">Evidence Checklist</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Evidence properly documented</span>
                        </div>
                        {evidenceToView.status === 'submitted' && (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Evidence submitted to court</span>
                          </div>
                        )}
                        {evidenceToView.status === 'rejected' && (
                          <div className="flex items-center space-x-2">
                            <FileX className="h-4 w-4 text-red-600" />
                            <span className="text-sm">Evidence rejected by court</span>
                          </div>
                        )}
                        {['collected', 'organized', 'pending'].includes(evidenceToView.status) && (
                          <div className="flex items-center space-x-2">
                            <Bookmark className="h-4 w-4 text-amber-600" />
                            <span className="text-sm">Needs to be submitted to court</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => handleDeleteEvidence(evidenceToView.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
        <CardFooter className="bg-gray-50 dark:bg-gray-900/20 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-muted-foreground p-4 gap-4">
          <div className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            <span>Evidence management for matrimonial proceedings</span>
          </div>
          <div>
            {evidenceItems.length} items in your evidence collection
          </div>
        </CardFooter>
      </Card>
      
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Indian Evidence Act Guidance</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-4">
          <p>
            Important provisions of the Indian Evidence Act, 1872 for matrimonial cases:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Section 112:</strong> Birth during marriage conclusive proof of legitimacy, unless parties had no access to each other.
            </li>
            <li>
              <strong>Section 50:</strong> Opinion regarding relationship of persons is relevant when person has special means of knowledge.
            </li>
            <li>
              <strong>Section 65B:</strong> Electronic records admissible as evidence if conditions are fulfilled (certificates, proper device, etc.).
            </li>
            <li>
              <strong>Section 14:</strong> Facts showing existence of state of mind or body relevant in matrimonial cases including cruelty allegations.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvidenceOrganizer;
