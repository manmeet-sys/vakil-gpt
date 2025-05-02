
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Heart, FileText, Scale, ArrowRight } from 'lucide-react';
import { BaseAnalyzer } from '../base';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const DivorceAssistant = () => {
  const [personalLaw, setPersonalLaw] = useState<string>('');
  const [divorceType, setDivorceType] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<string>('');
  
  const personalLaws = [
    { value: 'hindu', label: 'Hindu Marriage Act' },
    { value: 'muslim', label: 'Muslim Personal Law' },
    { value: 'christian', label: 'Indian Divorce Act (Christians)' },
    { value: 'parsi', label: 'Parsi Marriage & Divorce Act' },
    { value: 'special', label: 'Special Marriage Act' },
  ];
  
  const divorceTypes = {
    'hindu': [
      { value: 'mutual', label: 'Mutual Consent Divorce' },
      { value: 'contested', label: 'Contested Divorce' },
    ],
    'muslim': [
      { value: 'talaq', label: 'Talaq (by Husband)' },
      { value: 'khula', label: 'Khula (by Wife)' },
      { value: 'mutual', label: 'Mutual Consent' },
      { value: 'judicial', label: 'Judicial Divorce' },
    ],
    'christian': [
      { value: 'mutual', label: 'Mutual Consent' },
      { value: 'contested', label: 'Contested Divorce' },
    ],
    'parsi': [
      { value: 'mutual', label: 'Mutual Consent' },
      { value: 'contested', label: 'Contested Divorce' },
    ],
    'special': [
      { value: 'mutual', label: 'Mutual Consent' },
      { value: 'contested', label: 'Contested Divorce' },
    ],
  };

  const divorceStages = [
    { value: 'preparation', label: 'Case Preparation' },
    { value: 'filing', label: 'Filing & Notice' },
    { value: 'evidence', label: 'Evidence Gathering' },
    { value: 'hearing', label: 'Hearings & Arguments' },
    { value: 'decree', label: 'Decree of Divorce' },
  ];
  
  const getReligionBasedGuidance = () => {
    if (!personalLaw || !divorceType) return null;
    
    const lawGuidance = {
      'hindu': {
        'mutual': (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Mutual Consent Divorce under Hindu Marriage Act</h3>
            <p>Section 13B of the Hindu Marriage Act provides for divorce by mutual consent.</p>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="eligibility">
                <AccordionTrigger>Eligibility</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Couples must have been living separately for at least 1 year</li>
                    <li>Both parties must mutually agree that they cannot live together</li>
                    <li>Both must consent to the dissolution of marriage</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="procedure">
                <AccordionTrigger>Procedure</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>File joint petition in Family Court where:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Last matrimonial home was located, or</li>
                        <li>Where the marriage was solemnized, or</li>
                        <li>Where either spouse currently resides</li>
                      </ul>
                    </li>
                    <li>First motion: Court records statement of both parties</li>
                    <li>Cooling period: 6 months (can be waived by Supreme Court precedent if reconciliation impossible)</li>
                    <li>Second motion: Must be filed between 6-18 months of first motion</li>
                    <li>Final hearing: Court confirms consent is maintained</li>
                    <li>Decree of divorce issued</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="documents">
                <AccordionTrigger>Required Documents</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Marriage certificate</li>
                    <li>Address proof of both parties</li>
                    <li>Passport sized photographs</li>
                    <li>Income tax statements/salary slips</li>
                    <li>Details of property and assets (for settlement)</li>
                    <li>Details of children (if any)</li>
                    <li>Settlement deed (if applicable)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ),
        'contested': (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contested Divorce under Hindu Marriage Act</h3>
            <p>Section 13 of the Hindu Marriage Act provides grounds for contested divorce.</p>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="grounds">
                <AccordionTrigger>Grounds for Divorce</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Adultery</li>
                    <li>Cruelty (mental or physical)</li>
                    <li>Desertion for at least 2 continuous years</li>
                    <li>Conversion to another religion</li>
                    <li>Unsound mind/mental disorder</li>
                    <li>Virulent and incurable leprosy</li>
                    <li>Venereal disease in communicable form</li>
                    <li>Renunciation of the world (entering religious order)</li>
                    <li>Presumption of death (missing for 7+ years)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="procedure">
                <AccordionTrigger>Procedure</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Filing petition in Family Court with appropriate jurisdiction</li>
                    <li>Court issues summons to respondent</li>
                    <li>Respondent files reply (Written Statement)</li>
                    <li>Evidence stage: Affidavits, documents, witnesses</li>
                    <li>Cross-examination of witnesses</li>
                    <li>Final arguments</li>
                    <li>Court judgment (can take 1-3 years or more)</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="evidence">
                <AccordionTrigger>Evidence Requirements</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <p>Evidence requirements depend on the grounds claimed:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Cruelty:</strong> Medical reports, police complaints, photographs, witness testimonies</li>
                      <li><strong>Adultery:</strong> Electronic communications, photographs, witness statements</li>
                      <li><strong>Desertion:</strong> Proof of separate residence, statements from neighbors/relatives</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ),
      },
      'special': {
        'mutual': (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Mutual Consent Divorce under Special Marriage Act</h3>
            <p>Section 28 of the Special Marriage Act provides for divorce by mutual consent.</p>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="eligibility">
                <AccordionTrigger>Eligibility</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Couples must have been living separately for at least 1 year</li>
                    <li>Both parties must mutually agree that they cannot live together</li>
                    <li>Both must consent to the dissolution of marriage</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="procedure">
                <AccordionTrigger>Procedure</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>File joint petition in District Court with jurisdiction</li>
                    <li>First motion: Court records statement of both parties</li>
                    <li>Cooling period: 6 months</li>
                    <li>Second motion: Must be filed within 18 months of first motion</li>
                    <li>Final hearing: Court confirms consent is maintained</li>
                    <li>Decree of divorce issued</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="jurisdiction">
                <AccordionTrigger>Court Jurisdiction</AccordionTrigger>
                <AccordionContent>
                  <p>Petition can be filed where:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>The marriage was registered under Special Marriage Act</li>
                    <li>The respondent resides</li>
                    <li>The parties last resided together</li>
                    <li>The petitioner resides (if respondent resides outside India or has not been heard from for 7+ years)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ),
        'contested': (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contested Divorce under Special Marriage Act</h3>
            <p>Section 27 of the Special Marriage Act provides grounds for contested divorce.</p>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="grounds">
                <AccordionTrigger>Grounds for Divorce</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Adultery</li>
                    <li>Desertion for at least 2 years</li>
                    <li>Cruelty</li>
                    <li>Unsound mind</li>
                    <li>Communicable leprosy</li>
                    <li>Venereal disease</li>
                    <li>Presumption of death</li>
                    <li>No resumption of cohabitation after decree of separation</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="procedure">
                <AccordionTrigger>Procedure</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Filing petition with appropriate court</li>
                    <li>Service of notice to respondent</li>
                    <li>Filing of written statement by respondent</li>
                    <li>Framing of issues by court</li>
                    <li>Evidence stage</li>
                    <li>Final arguments</li>
                    <li>Judgment</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="timeline">
                <AccordionTrigger>Expected Timeline</AccordionTrigger>
                <AccordionContent>
                  <p>The duration of contested divorce proceedings varies based on:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Court backlog (may take 1-3 years or more)</li>
                    <li>Complexity of issues (property division, maintenance, custody)</li>
                    <li>Cooperation between parties</li>
                    <li>Evidence availability</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ),
      },
      // Additional religions would be implemented similarly
    };
    
    return lawGuidance[personalLaw]?.[divorceType] || (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">
          Guidance for the selected combination is currently being developed.
        </p>
        <Button variant="outline" className="mt-4">
          Request Specific Guidance
        </Button>
      </div>
    );
  };
  
  const stageGuidanceContent = {
    'preparation': (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Case Preparation Stage</h3>
        <p className="text-gray-700 dark:text-gray-300">
          The preparation stage is critical to building a strong matrimonial case.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Document Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-1 text-sm">
                <li>Marriage certificate/registration proof</li>
                <li>Address proofs of both parties</li>
                <li>Income and asset documents</li>
                <li>Photographs of marriage</li>
                <li>Communication records (if relevant)</li>
                <li>Medical records (if applicable)</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Evidence Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-1 text-sm">
                <li>Identify grounds for divorce</li>
                <li>Categorize evidence by relevance</li>
                <li>Identify potential witnesses</li>
                <li>Prepare chronology of events</li>
                <li>Assess strength of case</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RadioGroup defaultValue="yes">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="consult" />
                    <Label htmlFor="consult">Consulted a matrimonial lawyer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="noconsult" />
                    <Label htmlFor="noconsult">Need to consult a lawyer</Label>
                  </div>
                </RadioGroup>
                
                <RadioGroup defaultValue="no">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="docs" />
                    <Label htmlFor="docs">All documents collected</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="nodocs" />
                    <Label htmlFor="nodocs">Documents still needed</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
    'filing': (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Filing & Notice Stage</h3>
        <p className="text-gray-700 dark:text-gray-300">
          This stage involves formally filing the petition and serving notice to the other party.
        </p>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="jurisdiction">
            <AccordionTrigger>Court Jurisdiction</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">The petition should be filed in the appropriate Family Court where:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The marriage was solemnized</li>
                <li>The respondent resides</li>
                <li>The parties last resided together</li>
                <li>The petitioner resides (if respondent is outside India)</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="petition">
            <AccordionTrigger>Petition Contents</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-1">
                <li>Basic details of both parties</li>
                <li>Date and place of marriage</li>
                <li>Names and dates of birth of any children</li>
                <li>Last address where parties resided together</li>
                <li>Grounds for seeking divorce</li>
                <li>Facts supporting the grounds claimed</li>
                <li>Prayer for relief sought</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="notice">
            <AccordionTrigger>Service of Notice</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">After filing the petition, the court issues a notice to the respondent through:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Registered post with acknowledgment due</li>
                <li>Court bailiff/process server</li>
                <li>Substituted service (publication in newspaper if respondent avoids service)</li>
              </ul>
              <p className="mt-2">The respondent typically has 30 days to file a response.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    ),
    // Additional stages would be implemented similarly
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 mt-1 text-purple-600" />
            <div>
              <CardTitle className="font-playfair">Divorce Proceeding Assistant</CardTitle>
              <CardDescription>
                Navigate through divorce procedures under different personal laws in India
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="lawbased" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lawbased">Law-Based Guidance</TabsTrigger>
              <TabsTrigger value="stagebased">Stage-Based Guidance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="lawbased" className="py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Applicable Personal Law</label>
                  <Select value={personalLaw} onValueChange={setPersonalLaw}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select personal law" />
                    </SelectTrigger>
                    <SelectContent>
                      {personalLaws.map((law) => (
                        <SelectItem key={law.value} value={law.value}>{law.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {personalLaw && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Select Divorce Type</label>
                    <Select value={divorceType} onValueChange={setDivorceType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select divorce type" />
                      </SelectTrigger>
                      <SelectContent>
                        {divorceTypes[personalLaw]?.map((type) => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="mt-6 border-t pt-6">
                  {getReligionBasedGuidance()}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="stagebased" className="py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Divorce Stage</label>
                  <Select value={selectedStage} onValueChange={setSelectedStage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage of divorce proceedings" />
                    </SelectTrigger>
                    <SelectContent>
                      {divorceStages.map((stage) => (
                        <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mt-6 border-t pt-6">
                  {selectedStage && stageGuidanceContent[selectedStage]}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
        <CardHeader>
          <CardTitle className="text-base font-medium">Need Professional Assistance?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This tool provides general guidance. For personalized legal advice, please consult a qualified family law attorney.
          </p>
          <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white">
            Find a Family Law Expert <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DivorceAssistant;
