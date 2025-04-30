
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
import { FileText, PenLine, Loader2, Sparkles } from 'lucide-react';
import { generateGeminiAnalysis } from '@/utils/aiAnalysis';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Document title is required' }),
  type: z.string().min(1, { message: 'Document type is required' }),
  jurisdiction: z.string().optional(),
  parties: z.string().optional(),
  details: z.string().optional(),
  content: z.string().min(10, { message: 'Document content must be at least 10 characters' }).optional(),
});

type DocumentDraftingFormProps = {
  onDraftGenerated: (title: string, type: string, content: string) => void;
};

const DocumentDraftingForm: React.FC<DocumentDraftingFormProps> = ({ onDraftGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [useAIAssistant, setUseAIAssistant] = useState(true);
  const [selectedVenue, setSelectedVenue] = useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      type: '',
      jurisdiction: '',
      parties: '',
      details: '',
      content: '',
    },
  });

  // India-specific document types
  const documentTypes = [
    { value: 'affidavit', label: 'Affidavit' },
    { value: 'pil', label: 'Public Interest Litigation (PIL)' },
    { value: 'writ_petition', label: 'Writ Petition' },
    { value: 'legal_notice', label: 'Legal Notice' },
    { value: 'reply_notice', label: 'Reply to Legal Notice' },
    { value: 'consumer_complaint', label: 'Consumer Complaint' },
    { value: 'rental_agreement', label: 'Rental Agreement' },
    { value: 'sale_deed', label: 'Sale Deed' },
    { value: 'partnership_deed', label: 'Partnership Deed' },
    { value: 'will', label: 'Will & Testament' },
    { value: 'special_power_of_attorney', label: 'Special Power of Attorney' },
    { value: 'general_power_of_attorney', label: 'General Power of Attorney' },
    { value: 'anticipatory_bail', label: 'Anticipatory Bail Application' },
    { value: 'regular_bail', label: 'Regular Bail Application' },
    { value: 'divorce_petition', label: 'Divorce Petition' },
    { value: 'cheque_bounce_notice', label: 'Cheque Bounce Notice (Sec 138 NI Act)' },
    { value: 'rtiadwd_application', label: 'RTI Application' },
    { value: 'vakalatnama', label: 'Vakalatnama' },
    { value: 'itr_objection', label: 'Income Tax Return Objection' },
    { value: 'esi_pf_notice', label: 'ESI/PF Compliance Notice' },
    { value: 'other', label: 'Other Document' }
  ];

  // India-specific jurisdictions
  const jurisdictions = [
    { value: 'supreme_court', label: 'Supreme Court of India' },
    { value: 'delhi_hc', label: 'Delhi High Court' },
    { value: 'bombay_hc', label: 'Bombay High Court' },
    { value: 'calcutta_hc', label: 'Calcutta High Court' },
    { value: 'madras_hc', label: 'Madras High Court' },
    { value: 'allahabad_hc', label: 'Allahabad High Court' },
    { value: 'karnataka_hc', label: 'Karnataka High Court' },
    { value: 'district_court', label: 'District Court' },
    { value: 'consumer_forum', label: 'Consumer Forum' },
    { value: 'ncdrc', label: 'National Consumer Disputes Redressal Commission' },
    { value: 'nclat', label: 'National Company Law Appellate Tribunal' },
    { value: 'nclt', label: 'National Company Law Tribunal' },
    { value: 'itat', label: 'Income Tax Appellate Tribunal' },
    { value: 'cgit', label: 'Central Government Industrial Tribunal' },
    { value: 'other', label: 'Other Jurisdiction' },
  ];
  
  // District courts by state for more specific venue selection
  const venueOptions: Record<string, Array<{value: string, label: string}>> = {
    'district_court': [
      { value: 'delhi_district', label: 'Delhi District Courts' },
      { value: 'mumbai_city_civil', label: 'Mumbai City Civil Court' },
      { value: 'bangalore_city_civil', label: 'Bangalore City Civil Court' },
      { value: 'chennai_city_civil', label: 'Chennai City Civil Court' },
      { value: 'hyderabad_city_civil', label: 'Hyderabad City Civil Court' },
      { value: 'ahmedabad_city_civil', label: 'Ahmedabad City Civil Court' },
      { value: 'pune_district', label: 'Pune District Court' },
      { value: 'jaipur_district', label: 'Jaipur District Court' },
      { value: 'lucknow_district', label: 'Lucknow District Court' },
      { value: 'patna_district', label: 'Patna District Court' },
      { value: 'other_district', label: 'Other District Court' }
    ],
    'consumer_forum': [
      { value: 'delhi_consumer', label: 'Delhi State Consumer Commission' },
      { value: 'maharashtra_consumer', label: 'Maharashtra State Consumer Commission' },
      { value: 'karnataka_consumer', label: 'Karnataka State Consumer Commission' },
      { value: 'tamilnadu_consumer', label: 'Tamil Nadu State Consumer Commission' },
      { value: 'other_consumer', label: 'Other State Consumer Commission' }
    ]
  };

  const handleJurisdictionChange = (value: string) => {
    form.setValue('jurisdiction', value);
    setSelectedVenue('');
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    
    try {
      if (useAIAssistant) {
        // Create a more comprehensive prompt for AI-generated content
        const prompt = `Create a professional ${data.type} in the format required by ${data.jurisdiction || 'Indian courts'}.
        
Document Title: ${data.title}
Parties Involved: ${data.parties || 'Not specified'}
Additional Details: ${data.details || 'Not specified'}
${selectedVenue ? `Specific Court/Venue: ${selectedVenue}` : ''}

Please generate a complete and professional legal document following Indian legal standards and formatting. Include all necessary sections, proper legal language, citations to relevant Indian laws, and appropriate formatting.`;

        // Use Gemini API through our utility
        let generatedContent;
        try {
          generatedContent = await generateGeminiAnalysis(prompt, data.title);
        } catch (error) {
          console.error('Error using Gemini API:', error);
          
          // Fallback to template-based generation if API fails
          generatedContent = generateTemplateBasedContent(data.type, data.title, data.parties, data.jurisdiction, data.details, selectedVenue);
        }
        
        form.setValue('content', generatedContent);
        onDraftGenerated(data.title, data.type, generatedContent);
        toast.success('Document draft generated successfully!');
      } else {
        // For manual drafting, use the content provided by the user
        const content = data.content || '';
        onDraftGenerated(data.title, data.type, content);
        toast.success('Document draft created successfully!');
      }
    } catch (error) {
      console.error('Error generating document:', error);
      toast.error('Failed to generate document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback function to generate content based on templates if AI fails
  const generateTemplateBasedContent = (
    type: string, 
    title: string, 
    parties?: string, 
    jurisdiction?: string,
    details?: string,
    venue?: string
  ) => {
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const courtVenue = venue || jurisdiction || 'THE APPROPRIATE COURT';
    
    switch (type) {
      case 'affidavit':
        return `BEFORE ${courtVenue}\n\nAFFIDAVIT\n\nI, [NAME], son/daughter of [FATHER'S NAME], aged [AGE] years, resident of [ADDRESS], do hereby solemnly affirm and declare as follows:\n\n1. That I am the [DESIGNATION] in the matter of ${title} and am well conversant with the facts and circumstances of the case.\n\n2. That I have read and understood the contents of the accompanying ${parties ? `petition/application regarding ${parties}` : 'petition/application'}.\n\n3. That the contents of the accompanying petition/application may be read as part of this affidavit.\n\n${details ? `4. That ${details}\n\n` : ''}5. That the contents of this affidavit are true and correct to the best of my knowledge and belief. Nothing material has been concealed therefrom.\n\nVERIFICATION:\nVerified at [PLACE] on this ${currentDate} that the contents of the above affidavit are true and correct to my knowledge and belief and nothing material has been concealed therefrom.\n\nDEPONENT`;
        
      case 'pil':
        return `BEFORE ${courtVenue}\n\nPUBLIC INTEREST LITIGATION PETITION NO. ______ OF ${new Date().getFullYear()}\n\nIN THE MATTER OF:\n${parties || '[PETITIONER NAME]'} ... PETITIONER\n\nVERSUS\n\n${parties ? parties.split('vs')[1] || '[RESPONDENT NAME]' : '[RESPONDENT NAME]'} ... RESPONDENT\n\n${jurisdiction?.includes('Supreme') ? 'WRIT PETITION UNDER ARTICLE 32' : 'PETITION UNDER ARTICLE 226'} OF THE CONSTITUTION OF INDIA\n\nTO,\nTHE HON'BLE CHIEF JUSTICE AND OTHER COMPANION JUDGES OF THE HON'BLE ${courtVenue}\n\nTHE HUMBLE PETITION OF THE PETITIONER ABOVE NAMED:\n\nMOST RESPECTFULLY SHOWETH:\n\n1. That this petition is being filed in public interest, seeking ${title || '[DESCRIBE THE RELIEF SOUGHT]'}.\n\n2. That the Petitioner has no personal interest in the litigation and the petition is not guided by self-gain or any other oblique motive but in larger public interest.\n\n3. FACTS OF THE CASE:\n${details || '[SPECIFIC DETAILS RELATED TO THE CASE]'}\n\n4. GROUNDS:\n   A. That [LEGAL GROUND 1]\n   B. That [LEGAL GROUND 2]\n   C. That [LEGAL GROUND 3]\n\n5. That the Petitioner has not filed any other similar petition before this Hon'ble Court or any other court.\n\nPRAYER:\nIt is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:\n(a) [PRIMARY RELIEF SOUGHT]\n(b) [SECONDARY RELIEF SOUGHT]\n(c) Pass any other order(s) as this Hon'ble Court may deem fit and proper in the circumstances of the case.\n\nAND FOR THIS ACT OF KINDNESS, THE PETITIONER AS IN DUTY BOUND SHALL EVER PRAY.\n\nPLACE: [PLACE]\nDATE: ${currentDate}\n\nPETITIONER\nTHROUGH COUNSEL`;
        
      case 'legal_notice':
        return `LEGAL NOTICE\n\nDate: ${currentDate}\n\nTo,\n[RECIPIENT'S NAME]\n[RECIPIENT'S ADDRESS]\n\nSubject: Legal Notice regarding ${title || '[SUBJECT]'}\n\nDear Sir/Madam,\n\nUnder instructions from and on behalf of my client, ${parties?.split('vs')[0] || '[CLIENT NAME]'}, resident of [CLIENT'S ADDRESS], I hereby serve upon you the following legal notice:\n\n1. ${details || '[DETAILS OF THE DISPUTE/CLAIM]'}\n\n2. [SPECIFIC DETAILS OF VIOLATION/BREACH]\n\n3. [DETAILS OF LOSS/DAMAGE SUFFERED BY CLIENT]\n\n4. That despite repeated requests and reminders, you have failed and neglected to [SPECIFIC ACTION THAT RECIPIENT FAILED TO DO].\n\n5. That your aforesaid acts and omissions constitute a violation of [RELEVANT LAWS/SECTIONS, e.g., SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881 / RELEVANT SECTIONS OF THE INDIAN CONTRACT ACT, 1872, etc.]\n\nYou are hereby called upon to [SPECIFIC ACTION REQUIRED] within [TIME PERIOD, e.g., 15/30] days from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you in the appropriate forum, including but not limited to civil and/or criminal proceedings, at your risk, cost and consequences thereof.\n\nA line of compliance may kindly be sent to the undersigned immediately.\n\nYours faithfully,\n\n[ADVOCATE'S NAME]\nAdvocate\n[ENROLLMENT NO.]\n[CONTACT DETAILS]`;
      
      case 'writ_petition':
        return `BEFORE ${courtVenue}\n\nWRIT PETITION (CIVIL) NO. ______ OF ${new Date().getFullYear()}\n\nIN THE MATTER OF:\n${parties?.split('vs')[0] || '[PETITIONER NAME]'} ... PETITIONER\n\nVERSUS\n\n${parties?.split('vs')[1] || '[RESPONDENT NAME]'} ... RESPONDENT\n\n${jurisdiction?.includes('Supreme') ? 'PETITION UNDER ARTICLE 32' : 'PETITION UNDER ARTICLE 226'} OF THE CONSTITUTION OF INDIA\n\nTO,\nTHE HON'BLE CHIEF JUSTICE AND OTHER COMPANION JUDGES OF THE HON'BLE ${courtVenue}\n\nTHE HUMBLE PETITION OF THE PETITIONER ABOVE NAMED:\n\nMOST RESPECTFULLY SHOWETH:\n\n1. This petition under ${jurisdiction?.includes('Supreme') ? 'Article 32' : 'Article 226'} of the Constitution of India is being filed to challenge ${title || '[DETAILS OF ORDER/ACTION BEING CHALLENGED]'}.\n\n2. ARRAY OF PARTIES:\n   The Petitioner is [DETAILS OF PETITIONER]\n   The Respondent is [DETAILS OF RESPONDENT]\n\n3. FACTS OF THE CASE:\n${details || '[SPECIFIC DETAILS RELATED TO THE CASE]'}\n\n4. GROUNDS:\n   A. That [LEGAL GROUND 1]\n   B. That [LEGAL GROUND 2]\n   C. That [LEGAL GROUND 3]\n\n5. That the Petitioner has no other equally efficacious alternative remedy available except to approach this Hon'ble Court.\n\nPRAYER:\nIn the facts and circumstances of the case, it is most respectfully prayed that this Hon'ble Court may graciously be pleased to:\n\na) Issue a writ of [TYPE OF WRIT] or any other appropriate writ, order or direction, [SPECIFIC PRAYER];\n\nb) [SECONDARY PRAYER];\n\nc) Pass such other order or further orders as this Hon'ble Court may deem fit and proper in the circumstances of the case.\n\nAND FOR THIS ACT OF KINDNESS, THE PETITIONER AS IN DUTY BOUND SHALL EVER PRAY.\n\nPlace: [PLACE]\nDated: ${currentDate}\n\nPETITIONER\nTHROUGH\n\nCOUNSEL\n[ENROLLMENT NO.]`;
      
      case 'vakalatnama':
        return `BEFORE ${courtVenue}\n\nIN THE MATTER OF:\nCase No. __________ of ${new Date().getFullYear()}\n\n${parties || '[PARTY NAME] VERSUS [OPPOSITE PARTY NAME]'}\n\nVAKALATNAMA\n\nI, ${parties?.split('vs')[0] || '[CLIENT NAME]'}, the ${title?.toLowerCase().includes('plaintiff') || title?.toLowerCase().includes('petitioner') ? title : 'Plaintiff/Petitioner/Appellant/Complainant'} in the above case do hereby appoint and retain [ADVOCATE NAME], Advocate, [BAR COUNCIL ENROLLMENT NO.], to act, appear and plead for me in the above case and on my behalf to conduct and prosecute or defend the same and all proceedings that may be taken in respect of any application connected with the same or any decree or order passed therein, including proceedings in taxation and applications for Review, to file and obtain return of documents, to deposit and receive money on my behalf in the said case and in applications for Review, to file any appeal or appeals against any order or decree passed in the said case.\n\nI agree to ratify all acts done by the aforesaid Advocate in pursuance of this authority.\n\nI agree to pay the fee of the aforesaid Advocate as agreed.\n\nI agree that in case of my absence from the station, the aforesaid case may be proceeded with in my absence and no adjournment will be asked on that ground.\n\nDated this ${new Date().getDate()} day of ${new Date().toLocaleString('default', { month: 'long' })}, ${new Date().getFullYear()}\n\nAccepted:\n\n[ADVOCATE SIGNATURE]                          [CLIENT SIGNATURE]\nAdvocate                                      ${parties?.split('vs')[0] || 'Client'}\n[ENROLLMENT NO.]`;
      
      default:
        return `[This is a template for a ${type || 'legal document'}. Please customize this document with the specific details of your case.]\n\nDocument Title: ${title}\n\nParties Involved: ${parties || '[ENTER PARTIES]'}\n\nDate: ${currentDate}\n\n${details ? `Additional Details:\n${details}\n\n` : ''}[DOCUMENT CONTENT GOES HERE]`;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-legal-accent/10 text-legal-accent">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl text-legal-slate dark:text-white">Create Indian Legal Document</CardTitle>
            <CardDescription className="text-legal-muted dark:text-gray-400">
              Generate professional legal documents for Indian jurisdiction
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-base">
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
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-80">
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
              name="jurisdiction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jurisdiction</FormLabel>
                  <Select
                    onValueChange={(value) => handleJurisdictionChange(value)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select jurisdiction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-80">
                      {jurisdictions.map((jurisdiction) => (
                        <SelectItem key={jurisdiction.value} value={jurisdiction.value}>
                          {jurisdiction.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {(form.watch('jurisdiction') === 'district_court' || form.watch('jurisdiction') === 'consumer_forum') && (
              <FormItem>
                <FormLabel>Specific Venue</FormLabel>
                <Select
                  onValueChange={setSelectedVenue}
                  value={selectedVenue}
                >
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select specific venue" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-80">
                    {venueOptions[form.watch('jurisdiction') as keyof typeof venueOptions]?.map((venue) => (
                      <SelectItem key={venue.value} value={venue.value}>
                        {venue.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
            
            <FormField
              control={form.control}
              name="parties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parties Involved</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Raj Kumar vs State of Delhi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Details/Facts</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter key details, facts or specifics about your case" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex flex-col space-y-2 my-4">
              <label className="text-sm font-medium mb-1">Drafting Method</label>
              <Tabs 
                defaultValue={useAIAssistant ? "ai" : "manual"} 
                onValueChange={(value) => setUseAIAssistant(value === "ai")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ai" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI Assisted
                  </TabsTrigger>
                  <TabsTrigger value="manual">
                    <PenLine className="mr-2 h-4 w-4 inline" />
                    Manual Drafting
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <p className="text-xs text-muted-foreground mt-1">
                {useAIAssistant 
                  ? "AI will generate a full draft based on your inputs above" 
                  : "Write your own document content below"}
              </p>
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
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                type="submit" 
                className="w-full bg-legal-accent hover:bg-legal-accent/90"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {useAIAssistant ? 'Generating Document...' : 'Creating Document...'}
                  </>
                ) : (
                  <>
                    {useAIAssistant ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Document
                      </>
                    ) : (
                      <>
                        <PenLine className="mr-2 h-4 w-4" />
                        Create Document
                      </>
                    )}
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DocumentDraftingForm;
