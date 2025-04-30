
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

type Template = {
  id: string;
  title: string;
  type: string;
  description: string;
  content: string;
};

type DocumentTemplateListProps = {
  onTemplateSelect: (template: Template) => void;
};

const DocumentTemplateList: React.FC<DocumentTemplateListProps> = ({ onTemplateSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sample templates - in a real app, this would come from an API or database
  const templates: Template[] = [
    {
      id: '1',
      title: 'Standard Affidavit',
      type: 'affidavit',
      description: 'General purpose affidavit template',
      content: `BEFORE THE HON'BLE COURT OF [COURT NAME]\n\nAFFIDAVIT\n\nI, [NAME], son/daughter of [FATHER'S NAME], aged [AGE] years, resident of [ADDRESS], do hereby solemnly affirm and declare as follows:\n\n1. That I am the [DESIGNATION] in the present case and am well conversant with the facts and circumstances of the case.\n\n2. That the contents of this affidavit are true to the best of my knowledge and belief.\n\n3. [SPECIFIC DETAILS RELATED TO THE CASE]\n\nVERIFICATION:\nVerified at [PLACE] on this [DATE] day of [MONTH], [YEAR] that the contents of the above affidavit are true to the best of my knowledge and belief and nothing material has been concealed therefrom.\n\nDEPONENT`
    },
    {
      id: '2',
      title: 'Basic PIL Template',
      type: 'pil',
      description: 'Template for Public Interest Litigation',
      content: `BEFORE THE HON'BLE [COURT NAME]\nPUBLIC INTEREST LITIGATION PETITION NO. [NUMBER] OF [YEAR]\n\nIN THE MATTER OF:\n[PETITIONER'S NAME] ... PETITIONER\nVERSUS\n[RESPONDENT'S NAME] ... RESPONDENT\n\nPETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA\n\nTO,\nTHE HON'BLE CHIEF JUSTICE AND OTHER COMPANION JUDGES OF THE HON'BLE [COURT NAME]\n\nTHE HUMBLE PETITION OF THE PETITIONER ABOVE NAMED:\n\nMOST RESPECTFULLY SHOWETH:\n\n1. That this petition is being filed in public interest, seeking [DESCRIBE THE RELIEF SOUGHT].\n\n2. That the Petitioner has no personal interest in the litigation and the petition is not guided by self-gain or any other oblique motive.\n\n3. [SPECIFIC DETAILS RELATED TO THE CASE]\n\nPRAYER:\nIt is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:\n(a) [RELIEF SOUGHT]\n(b) Pass any other order(s) as this Hon'ble Court may deem fit and proper in the circumstances of the case.\n\nPLACE: [PLACE]\nDATE: [DATE]\n\nPETITIONER\nTHROUGH COUNSEL`
    },
    {
      id: '3',
      title: 'Legal Notice for Default',
      type: 'legal_notice',
      description: 'Notice for breach of agreement/default',
      content: `LEGAL NOTICE\n\nDate: [DATE]\n\nTo,\n[RECIPIENT'S NAME]\n[RECIPIENT'S ADDRESS]\n\nSubject: Legal Notice regarding [SUBJECT]\n\nDear Sir/Madam,\n\nI, [SENDER'S NAME], advocate for and on behalf of my client [CLIENT'S NAME], resident of [CLIENT'S ADDRESS], do hereby serve upon you this legal notice.\n\n1. [DETAILS OF THE DISPUTE]\n\n2. [SPECIFIC DETAILS OF VIOLATION/BREACH]\n\n3. [DEMAND]\n\nYou are hereby called upon to [SPECIFIC ACTION REQUIRED] within [TIME PERIOD] from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you at your risk and cost.\n\nYours faithfully,\n\n[ADVOCATE'S NAME]\nAdvocate`
    },
    {
      id: '4',
      title: 'Writ Petition Template',
      type: 'petition',
      description: 'Template for filing writ petitions',
      content: `BEFORE THE HON'BLE HIGH COURT OF [STATE]\nAT [CITY]\n\nWRIT PETITION (CIVIL) NO. ______ OF [YEAR]\n\nIN THE MATTER OF:\n[NAME OF PETITIONER] ... PETITIONER\n\nVERSUS\n\n[NAME OF RESPONDENT] ... RESPONDENT\n\nPETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA\n\nTO,\nTHE HON'BLE CHIEF JUSTICE AND OTHER COMPANION JUDGES OF THE HON'BLE HIGH COURT\n\nTHE HUMBLE PETITION OF THE PETITIONER ABOVE NAMED:\n\nMOST RESPECTFULLY SHOWETH:\n\n1. This petition under Article 226 of the Constitution of India is being filed to challenge the [DETAILS OF ORDER/ACTION BEING CHALLENGED].\n\n2. [GROUNDS FOR CHALLENGE]\n\n3. [PARTICULARS OF THE CASE]\n\nPRAYER:\nIn the facts and circumstances of the case, it is most respectfully prayed that this Hon'ble Court may graciously be pleased to:\n\na) Issue a writ of [TYPE OF WRIT] or any other appropriate writ, order or direction;\n\nb) [SPECIFIC RELIEF SOUGHT];\n\nc) Pass such other order or further orders as this Hon'ble Court may deem fit and proper in the circumstances of the case.\n\nAND FOR THIS ACT OF KINDNESS, THE PETITIONER AS IN DUTY BOUND SHALL EVER PRAY.\n\nPlace: [PLACE]\nDated: [DATE]\n\nPETITIONER\nTHROUGH\n\nCOUNSEL`
    },
    {
      id: '5',
      title: 'Power of Attorney',
      type: 'power_of_attorney',
      description: 'General Power of Attorney template',
      content: `POWER OF ATTORNEY\n\nKNOW ALL MEN BY THESE PRESENTS THAT I, [NAME], son/daughter of [FATHER'S NAME], resident of [ADDRESS], do hereby nominate, constitute and appoint [ATTORNEY'S NAME], son/daughter of [ATTORNEY'S FATHER'S NAME], resident of [ATTORNEY'S ADDRESS], as my true and lawful attorney to do the following acts, deeds and things in my name and on my behalf:\n\n1. To represent me before any government office, court, tribunal, or any other judicial or quasi-judicial authority.\n\n2. [SPECIFIC POWERS]\n\n3. [SPECIFIC POWERS]\n\nAND I do hereby agree to ratify and confirm all and whatsoever my said Attorney shall lawfully do or cause to be done by virtue of these presents.\n\nIN WITNESS WHEREOF, I have set and subscribed my hands unto this Power of Attorney on this [DAY] day of [MONTH], [YEAR].\n\nEXECUTED BY:\n\n[NAME]\n[SIGNATURE]\n\nWITNESSES:\n\n1. [WITNESS 1 NAME AND SIGNATURE]\n\n2. [WITNESS 2 NAME AND SIGNATURE]`
    }
  ];

  const filteredTemplates = templates.filter(
    template => 
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg text-legal-slate dark:text-white">Document Templates</CardTitle>
            <CardDescription className="text-legal-muted dark:text-gray-400">
              Start with a pre-built template
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <ScrollArea className="h-[320px] pr-4">
          <div className="space-y-2">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant="ghost"
                  className="w-full justify-between hover:bg-slate-100 dark:hover:bg-slate-800 text-left px-3 py-2 h-auto"
                  onClick={() => onTemplateSelect(template)}
                >
                  <div>
                    <div className="font-medium text-legal-slate dark:text-white">{template.title}</div>
                    <div className="text-xs text-legal-muted dark:text-gray-400">{template.description}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-legal-muted dark:text-gray-400" />
                </Button>
              ))
            ) : (
              <div className="text-center py-8 text-legal-muted dark:text-gray-400">
                No templates found for "{searchTerm}"
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DocumentTemplateList;
