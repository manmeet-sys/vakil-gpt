
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileText, PenLine, Loader2 } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Document title is required' }),
  type: z.string().min(1, { message: 'Document type is required' }),
  parties: z.string().optional(),
  content: z.string().min(10, { message: 'Document content must be at least 10 characters' }),
});

type DocumentDraftingFormProps = {
  onDraftGenerated: (title: string, type: string, content: string) => void;
};

const DocumentDraftingForm: React.FC<DocumentDraftingFormProps> = ({ onDraftGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [useAIAssistant, setUseAIAssistant] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      type: '',
      parties: '',
      content: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    
    try {
      if (useAIAssistant) {
        // Simulate AI-assisted content generation
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        let aiGeneratedContent = '';
        
        switch (data.type) {
          case 'affidavit':
            aiGeneratedContent = `BEFORE THE HON'BLE COURT OF [COURT NAME]\n\nAFFIDAVIT\n\nI, [NAME], son/daughter of [FATHER'S NAME], aged [AGE] years, resident of [ADDRESS], do hereby solemnly affirm and declare as follows:\n\n1. That I am the [DESIGNATION] in the present case and am well conversant with the facts and circumstances of the case.\n\n2. That the contents of this affidavit are true to the best of my knowledge and belief.\n\n3. [SPECIFIC DETAILS RELATED TO THE CASE]\n\nVERIFICATION:\nVerified at [PLACE] on this [DATE] day of [MONTH], [YEAR] that the contents of the above affidavit are true to the best of my knowledge and belief and nothing material has been concealed therefrom.\n\nDEPONENT`;
            break;
          case 'pil':
            aiGeneratedContent = `BEFORE THE HON'BLE [COURT NAME]\nPUBLIC INTEREST LITIGATION PETITION NO. [NUMBER] OF [YEAR]\n\nIN THE MATTER OF:\n[PETITIONER'S NAME] ... PETITIONER\nVERSUS\n[RESPONDENT'S NAME] ... RESPONDENT\n\nPETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA\n\nTO,\nTHE HON'BLE CHIEF JUSTICE AND OTHER COMPANION JUDGES OF THE HON'BLE [COURT NAME]\n\nTHE HUMBLE PETITION OF THE PETITIONER ABOVE NAMED:\n\nMOST RESPECTFULLY SHOWETH:\n\n1. That this petition is being filed in public interest, seeking [DESCRIBE THE RELIEF SOUGHT].\n\n2. That the Petitioner has no personal interest in the litigation and the petition is not guided by self-gain or any other oblique motive.\n\n3. [SPECIFIC DETAILS RELATED TO THE CASE]\n\nPRAYER:\nIt is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:\n(a) [RELIEF SOUGHT]\n(b) Pass any other order(s) as this Hon'ble Court may deem fit and proper in the circumstances of the case.\n\nPLACE: [PLACE]\nDATE: [DATE]\n\nPETITIONER\nTHROUGH COUNSEL`;
            break;
          case 'legal_notice':
            aiGeneratedContent = `LEGAL NOTICE\n\nDate: [DATE]\n\nTo,\n[RECIPIENT'S NAME]\n[RECIPIENT'S ADDRESS]\n\nSubject: Legal Notice regarding [SUBJECT]\n\nDear Sir/Madam,\n\nI, [SENDER'S NAME], advocate for and on behalf of my client [CLIENT'S NAME], resident of [CLIENT'S ADDRESS], do hereby serve upon you this legal notice.\n\n1. [DETAILS OF THE DISPUTE]\n\n2. [SPECIFIC DETAILS OF VIOLATION/BREACH]\n\n3. [DEMAND]\n\nYou are hereby called upon to [SPECIFIC ACTION REQUIRED] within [TIME PERIOD] from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you at your risk and cost.\n\nYours faithfully,\n\n[ADVOCATE'S NAME]\nAdvocate`;
            break;
          default:
            aiGeneratedContent = `[This is a template for a ${data.type}. Please customize this document with the specific details of your case.]\n\nDocument Title: ${data.title}\n\nParties Involved: ${data.parties || '[ENTER PARTIES]'}\n\n[DOCUMENT CONTENT GOES HERE]`;
        }
        
        form.setValue('content', aiGeneratedContent);
        onDraftGenerated(data.title, data.type, aiGeneratedContent);
      } else {
        onDraftGenerated(data.title, data.type, data.content);
      }
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const documentTypes = [
    { value: 'affidavit', label: 'Affidavit' },
    { value: 'pil', label: 'Public Interest Litigation (PIL)' },
    { value: 'legal_notice', label: 'Legal Notice' },
    { value: 'reply', label: 'Reply to Legal Notice' },
    { value: 'agreement', label: 'Legal Agreement' },
    { value: 'declaration', label: 'Declaration' },
    { value: 'will', label: 'Will/Testament' },
    { value: 'petition', label: 'Petition' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'application', label: 'Application' },
    { value: 'undertaking', label: 'Undertaking' },
    { value: 'power_of_attorney', label: 'Power of Attorney' },
    { value: 'other', label: 'Other Document' }
  ];

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-legal-accent/10 text-legal-accent">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl text-legal-slate dark:text-white">Create Legal Document</CardTitle>
            <CardDescription className="text-legal-muted dark:text-gray-400">
              Draft professional legal documents with ease
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter document title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documentTypes.map((type) => (
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
              name="parties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parties Involved (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter names of parties involved" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center space-x-2 my-4">
              <Button
                type="button"
                variant={useAIAssistant ? "default" : "outline"}
                size="sm"
                className={`text-xs px-3 ${useAIAssistant ? 'bg-legal-accent hover:bg-legal-accent/90' : ''}`}
                onClick={() => setUseAIAssistant(true)}
              >
                Use AI Assistant
              </Button>
              <Button
                type="button"
                variant={!useAIAssistant ? "default" : "outline"}
                size="sm"
                className={`text-xs px-3 ${!useAIAssistant ? 'bg-legal-accent hover:bg-legal-accent/90' : ''}`}
                onClick={() => setUseAIAssistant(false)}
              >
                Manual Drafting
              </Button>
            </div>
            
            {!useAIAssistant && (
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter document content" 
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-legal-accent hover:bg-legal-accent/90"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Document...
                </>
              ) : (
                <>
                  <PenLine className="mr-2 h-4 w-4" />
                  {useAIAssistant ? 'Generate Document' : 'Create Document'}
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DocumentDraftingForm;
