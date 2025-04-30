
import React, { useState } from 'react';
import { Case } from '@/pages/case-management/index';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

interface NewCaseFormProps {
  onCaseCreated: (newCase: Case) => void;
  onCancel: () => void;
}

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

const caseStatusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'scheduled', label: 'Scheduled' },
];

const filingTypes = [
  { value: 'civil_suit', label: 'Civil Suit' },
  { value: 'criminal_case', label: 'Criminal Case' },
  { value: 'writ_petition', label: 'Writ Petition' },
  { value: 'appeal', label: 'Appeal' },
  { value: 'revision', label: 'Revision' },
  { value: 'execution_petition', label: 'Execution Petition' },
  { value: 'other', label: 'Other' },
];

const NewCaseForm: React.FC<NewCaseFormProps> = ({ onCaseCreated, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const form = useForm({
    defaultValues: {
      case_title: '',
      case_number: '',
      client_name: '',
      court_name: '',
      court_type: '',
      jurisdiction: '',
      status: 'draft',
      filing_type: '',
      description: '',
      opposing_party: '',
      filing_date: new Date().toISOString().split('T')[0],
      hearing_date: '',
    },
  });

  const onSubmit = async (data: any) => {
    if (!user) {
      toast.error('You must be logged in to create a case');
      return;
    }

    setLoading(true);
    try {
      const { data: newCase, error } = await supabase
        .from('court_filings')
        .insert([
          {
            user_id: user.id,
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
          },
        ])
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Type assertion to match the expected Case type
      onCaseCreated({...(newCase as any), client_id: newCase.client_id || null} as Case);
    } catch (error: any) {
      console.error('Error creating new case:', error.message);
      toast.error('Failed to create case. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Case</CardTitle>
        <CardDescription>
          Enter the details of the new legal case you want to track
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="case_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Title*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter case title" {...field} required />
                    </FormControl>
                    <FormDescription>
                      The title or name that identifies this case
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="case_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter case number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Status</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="client_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter client name" {...field} />
                      </FormControl>
                      <FormMessage />
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
                        <Input placeholder="Enter opposing party name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="filing_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Filing Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select filing type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filingTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="court_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Court Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter court name" {...field} />
                      </FormControl>
                      <FormMessage />
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
                      <FormMessage />
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
                        <Input placeholder="Enter jurisdiction" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="hearing_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Hearing Date (if known)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter details about the case" 
                        {...field} 
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <CardFooter className="px-0 pb-0 flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Case'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewCaseForm;
