
import React, { useState } from 'react';
import { Case } from '@/pages/case-management/index';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, FilePlus, FileText, Trash2, User, Users, Edit, MapPin, Gavel, Save, X, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

interface CaseDetailsProps {
  caseData: Case;
  onCaseUpdated: (updatedCase: Case) => void;
  onCaseDeleted: (caseId: string) => void;
}

const caseStatusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'closed', label: 'Closed' },
  { value: 'archived', label: 'Archived' },
];

const courtTypes = [
  { value: 'supreme_court', label: 'Supreme Court' },
  { value: 'high_court', label: 'High Court' },
  { value: 'district_court', label: 'District Court' },
  { value: 'sessions_court', label: 'Sessions Court' },
  { value: 'family_court', label: 'Family Court' },
  { value: 'consumer_court', label: 'Consumer Court' },
  { value: 'tribunals', label: 'Tribunals' },
  { value: 'other', label: 'Other' },
];

const CaseDetails: React.FC<CaseDetailsProps> = ({ caseData, onCaseUpdated, onCaseDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('details');
  
  const form = useForm({
    defaultValues: {
      case_title: caseData.case_title || '',
      case_number: caseData.case_number || '',
      client_name: caseData.client_name || '',
      court_name: caseData.court_name || '',
      court_type: caseData.court_type || '',
      jurisdiction: caseData.jurisdiction || '',
      status: caseData.status || 'draft',
      filing_type: caseData.filing_type || '',
      description: caseData.description || '',
      opposing_party: caseData.opposing_party || '',
      filing_date: caseData.filing_date ? new Date(caseData.filing_date).toISOString().split('T')[0] : '',
      hearing_date: caseData.hearing_date ? new Date(caseData.hearing_date).toISOString().split('T')[0] : '',
    },
  });

  const handleDeleteCase = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('court_filings')
        .delete()
        .eq('id', caseData.id);
      
      if (error) throw error;
      
      onCaseDeleted(caseData.id);
    } catch (error: any) {
      console.error('Error deleting case:', error.message);
      toast.error('Failed to delete case. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async (data: any) => {
    setLoading(true);
    try {
      const { data: updatedCase, error } = await supabase
        .from('court_filings')
        .update({
          case_title: data.case_title,
          case_number: data.case_number,
          client_name: data.client_name,
          court_name: data.court_name,
          court_type: data.court_type,
          jurisdiction: data.jurisdiction,
          status: data.status,
          filing_type: data.filing_type,
          description: data.description,
          opposing_party: data.opposing_party,
          filing_date: data.filing_date,
          hearing_date: data.hearing_date || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', caseData.id)
        .select('*')
        .single();
      
      if (error) throw error;
      
      onCaseUpdated(updatedCase as Case);
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating case:', error.message);
      toast.error('Failed to update case. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getCaseStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Scheduled</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-gray-100 text-gray-500">Archived</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">
            {isEditing ? (
              <Input
                className="font-bold text-xl h-8"
                {...form.register('case_title')}
                placeholder="Case Title"
              />
            ) : (
              caseData.case_title || 'Untitled Case'
            )}
          </CardTitle>
          <CardDescription className="mt-1 flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>
              {isEditing ? (
                <Input
                  className="h-7 text-sm"
                  {...form.register('case_number')}
                  placeholder="Case Number"
                />
              ) : (
                caseData.case_number || 'No case number'
              )}
            </span>
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={form.handleSubmit(handleSaveChanges)}
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this case and all associated records.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteCase} className="bg-red-500 hover:bg-red-600">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="hearings">Hearings</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            {isEditing ? (
              <Form {...form}>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="client_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Client name" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="opposing_party"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opposing Party</FormLabel>
                          <FormControl>
                            <Input placeholder="Opposing party name" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="court_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Court Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Court name" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="court_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Court Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select court type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {courtTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="jurisdiction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jurisdiction</FormLabel>
                          <FormControl>
                            <Input placeholder="Jurisdiction" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="filing_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Filing Type</FormLabel>
                          <FormControl>
                            <Input placeholder="Filing type" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {caseStatusOptions.map(status => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="filing_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Filing Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="hearing_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Next Hearing Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Case description" {...field} rows={4} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                  <div className="mt-1">{getCaseStatusBadge(caseData.status || 'draft')}</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Client</h3>
                    <p className="mt-1 text-sm flex items-center">
                      <User className="h-4 w-4 mr-1 text-gray-400" />
                      {caseData.client_name || 'Not specified'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Opposing Party</h3>
                    <p className="mt-1 text-sm flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      {caseData.opposing_party || 'Not specified'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Court</h3>
                    <p className="mt-1 text-sm flex items-center">
                      <Gavel className="h-4 w-4 mr-1 text-gray-400" />
                      {caseData.court_name || 'Not specified'} 
                      {caseData.court_type ? ` (${courtTypes.find(c => c.value === caseData.court_type)?.label || caseData.court_type})` : ''}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Jurisdiction</h3>
                    <p className="mt-1 text-sm flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {caseData.jurisdiction || 'Not specified'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Filing Date</h3>
                    <p className="mt-1 text-sm flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {formatDate(caseData.filing_date)}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Hearing</h3>
                    <p className="mt-1 text-sm flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      {formatDate(caseData.hearing_date)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                  <p className="mt-1 text-sm whitespace-pre-line">
                    {caseData.description || 'No description provided.'}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="hearings">
            <div className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Hearing Schedule</h3>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Hearing
                </Button>
              </div>
              
              {caseData.hearing_date ? (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">Next Hearing</p>
                          <p className="text-sm text-gray-500">{formatDate(caseData.hearing_date)}</p>
                        </div>
                      </div>
                      <Badge>Upcoming</Badge>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-lg">
                  <Calendar className="h-8 w-8 text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Hearings Scheduled</h3>
                  <p className="text-sm text-gray-500 max-w-md mt-1">
                    There are no upcoming hearings for this case. Click the "Add Hearing" button to schedule a new one.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Case Documents</h3>
                <Button variant="outline" size="sm">
                  <FilePlus className="h-4 w-4 mr-1" />
                  Upload Document
                </Button>
              </div>
              
              {caseData.documents && caseData.documents.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {caseData.documents.map((doc: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium">{doc.name || `Document ${index + 1}`}</p>
                            <p className="text-xs text-gray-500">{doc.type || 'Unknown type'}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-lg">
                  <FileText className="h-8 w-8 text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Documents</h3>
                  <p className="text-sm text-gray-500 max-w-md mt-1">
                    There are no documents attached to this case. Upload important case documents for easy access.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CaseDetails;
