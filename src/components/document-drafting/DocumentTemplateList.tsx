
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, ChevronRight, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Template = {
  id: string;
  title: string;
  type: string;
  description: string;
  content: string;
  jurisdiction: string;
  category: string;
};

type DocumentTemplateListProps = {
  onTemplateSelect: (template: Template) => void;
};

const DocumentTemplateList: React.FC<DocumentTemplateListProps> = ({ onTemplateSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>('');
  
  // Enhanced templates with Indian legal context
  const templates: Template[] = [
    {
      id: '1',
      title: 'Standard Affidavit',
      type: 'affidavit',
      description: 'General purpose affidavit template for Indian courts',
      jurisdiction: 'all_india',
      category: 'general',
      content: `BEFORE THE HON'BLE COURT OF [COURT NAME]\n\nAFFIDAVIT\n\nI, [NAME], son/daughter of [FATHER'S NAME], aged [AGE] years, resident of [ADDRESS], do hereby solemnly affirm and declare as follows:\n\n1. That I am the [DESIGNATION] in the present case and am well conversant with the facts and circumstances of the case.\n\n2. That the contents of this affidavit are true to the best of my knowledge and belief.\n\n3. [SPECIFIC DETAILS RELATED TO THE CASE]\n\nVERIFICATION:\nVerified at [PLACE] on this [DATE] day of [MONTH], [YEAR] that the contents of the above affidavit are true to the best of my knowledge and belief and nothing material has been concealed therefrom.\n\nDEPONENT`
    },
    {
      id: '2',
      title: 'PIL Template (Supreme Court)',
      type: 'pil',
      description: 'Public Interest Litigation template for Supreme Court of India',
      jurisdiction: 'supreme_court',
      category: 'constitutional',
      content: `BEFORE THE HON'BLE SUPREME COURT OF INDIA\nPUBLIC INTEREST LITIGATION PETITION NO. [NUMBER] OF [YEAR]\n\nIN THE MATTER OF:\n[PETITIONER'S NAME] ... PETITIONER\nVERSUS\n[RESPONDENT'S NAME] ... RESPONDENT\n\nPETITION UNDER ARTICLE 32 OF THE CONSTITUTION OF INDIA\n\nTO,\nTHE HON'BLE CHIEF JUSTICE OF INDIA AND HIS COMPANION JUDGES OF THE HON'BLE SUPREME COURT OF INDIA\n\nTHE HUMBLE PETITION OF THE PETITIONER ABOVE NAMED:\n\nMOST RESPECTFULLY SHOWETH:\n\n1. That this petition is being filed in public interest, seeking [DESCRIBE THE RELIEF SOUGHT].\n\n2. That the Petitioner has no personal interest in the litigation and the petition is not guided by self-gain or any other oblique motive but in larger public interest.\n\n3. The present Public Interest Litigation has been filed under Article 32 of the Constitution of India seeking [BRIEF DESCRIPTION OF RELIEF].\n\n4. [SPECIFIC DETAILS RELATED TO THE CASE]\n\n5. GROUNDS:\n\n   A. Because [GROUND 1]\n   
   B. Because [GROUND 2]\n   
   C. Because [GROUND 3]\n\n6. That the petitioner has not filed any other petition regarding the same subject matter before this Hon'ble Court or any other court.\n\nPRAYER:\nIt is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:\n(a) [RELIEF SOUGHT]\n(b) [RELIEF SOUGHT]\n(c) Pass any other order(s) as this Hon'ble Court may deem fit and proper in the circumstances of the case.\n\nAND FOR THIS ACT OF KINDNESS, THE PETITIONER AS IN DUTY BOUND SHALL EVER PRAY.\n\nPLACE: [PLACE]\nDATE: [DATE]\n\nPETITIONER\nTHROUGH COUNSEL`
    },
    {
      id: '3',
      title: 'Legal Notice for Cheque Bounce',
      type: 'legal_notice',
      description: 'Notice under Section 138 of Negotiable Instruments Act',
      jurisdiction: 'all_india',
      category: 'commercial',
      content: `LEGAL NOTICE\n\nDate: [DATE]\n\nTo,\n[RECIPIENT'S NAME]\n[RECIPIENT'S ADDRESS]\n\nSubject: Legal Notice under Section 138 of the Negotiable Instruments Act, 1881\n\nDear Sir/Madam,\n\nUnder instructions from and on behalf of my client, [CLIENT'S NAME], resident of [CLIENT'S ADDRESS], I hereby serve upon you the following legal notice:\n\n1. That my client states that you issued cheque bearing No. [CHEQUE NUMBER] dated [CHEQUE DATE] for an amount of Rs. [AMOUNT IN FIGURES]/- (Rupees [AMOUNT IN WORDS] Only) drawn on [BANK NAME & BRANCH] in favor of my client against [REASON FOR PAYMENT].\n\n2. That my client presented the said cheque for encashment through his/her bank, but the same was returned unpaid by your bank with remarks "[REASON FOR DISHONOR]" vide return memo dated [DATE OF DISHONOR].\n\n3. That my client thereafter informed you about the dishonor of the cheque vide [COMMUNICATION DETAILS] dated [DATE], but despite receipt of the said information, you have failed and neglected to make the payment of the said amount to my client within 15 days of receipt of the said information.\n\n4. That as per Section 138 of the Negotiable Instruments Act, 1881, you have committed an offence punishable with imprisonment for a term which may extend to two years, or with fine which may extend to twice the amount of the cheque, or with both.\n\nYou are hereby called upon to make the payment of Rs. [AMOUNT IN FIGURES]/- (Rupees [AMOUNT IN WORDS] Only) along with interest @18% per annum within 15 days from the receipt of this notice, failing which my client shall be constrained to initiate appropriate criminal proceedings against you under Section 138 of the Negotiable Instruments Act, 1881, as well as civil proceedings for recovery of the said amount, at your risk, cost and consequences thereof.\n\nA line of compliance may kindly be sent to the undersigned immediately.\n\nYours faithfully,\n\n[ADVOCATE'S NAME]\nAdvocate\n[ENROLLMENT NO.]\n[CONTACT DETAILS]`
    },
    {
      id: '4',
      title: 'Writ Petition (Article 226)',
      type: 'petition',
      description: 'Template for High Court writ petitions',
      jurisdiction: 'high_court',
      category: 'constitutional',
      content: `BEFORE THE HON'BLE HIGH COURT OF [STATE]\nAT [CITY]\n\nWRIT PETITION (CIVIL) NO. ______ OF [YEAR]\n\nIN THE MATTER OF:\n[NAME OF PETITIONER] ... PETITIONER\n\nVERSUS\n\n[NAME OF RESPONDENT] ... RESPONDENT\n\nPETITION UNDER ARTICLE 226 OF THE CONSTITUTION OF INDIA\n\nTO,\nTHE HON'BLE CHIEF JUSTICE AND OTHER COMPANION JUDGES OF THE HON'BLE HIGH COURT\n\nTHE HUMBLE PETITION OF THE PETITIONER ABOVE NAMED:\n\nMOST RESPECTFULLY SHOWETH:\n\n1. This petition under Article 226 of the Constitution of India is being filed to challenge the [DETAILS OF ORDER/ACTION BEING CHALLENGED].\n\n2. That the petitioner is aggrieved by [SPECIFIC ACTION/INACTION OF RESPONDENT] which is arbitrary, illegal, mala fide, without jurisdiction and violative of Articles [RELEVANT ARTICLES] of the Constitution of India.\n\n3. ARRAY OF PARTIES:\n   [DETAILS OF PETITIONER AND RESPONDENTS AND THEIR ADDRESSES]\n\n4. BRIEF FACTS:\n   [CHRONOLOGICAL NARRATION OF RELEVANT FACTS]\n\n5. GROUNDS:\n   A. Because [LEGAL GROUND 1]\n   B. Because [LEGAL GROUND 2]\n   C. Because [LEGAL GROUND 3]\n\n6. That the petitioner has no efficacious alternative remedy available.\n\n7. That the petitioner has not filed any other petition regarding the same subject matter before this Hon'ble Court or any other court.\n\nPRAYER:\nIn the facts and circumstances of the case, it is most respectfully prayed that this Hon'ble Court may graciously be pleased to:\n\na) Issue a writ of [TYPE OF WRIT] or any other appropriate writ, order or direction;\n\nb) [SPECIFIC RELIEF SOUGHT];\n\nc) Pass such other order or further orders as this Hon'ble Court may deem fit and proper in the circumstances of the case.\n\nAND FOR THIS ACT OF KINDNESS, THE PETITIONER AS IN DUTY BOUND SHALL EVER PRAY.\n\nPlace: [PLACE]\nDated: [DATE]\n\nPETITIONER\nTHROUGH\n\nCOUNSEL`
    },
    {
      id: '5',
      title: 'Vakalatnama',
      type: 'vakalatnama',
      description: 'Standard format for appointing an advocate in Indian courts',
      jurisdiction: 'all_india',
      category: 'procedural',
      content: `IN THE [COURT NAME]\n\nIN THE MATTER OF:\nCase No. __________ of [YEAR]\n\n[CLIENT'S NAME]\n... PLAINTIFF/PETITIONER/APPELLANT/COMPLAINANT\n\nVERSUS\n\n[OPPOSITE PARTY'S NAME]\n... DEFENDANT/RESPONDENT/RESPONDENT/ACCUSED\n\nVAKALATNAMA\n\nI, [CLIENT'S NAME], the [PLAINTIFF/PETITIONER/APPELLANT/COMPLAINANT] in the above case do hereby appoint and retain [ADVOCATE'S NAME], Advocate, [BAR COUNCIL ENROLLMENT NO.], to act, appear and plead for me in the above case and on my behalf to conduct and prosecute (or defend) the same and all proceedings that may be taken in respect of any application connected with the same or any decree or order passed therein, including proceedings in taxation and applications for Review, to file and obtain return of documents, to deposit and receive money on my behalf in the said case and in applications for Review, to file any appeal or appeals against any order or decree passed in the said case.\n\nI agree to ratify all acts done by the aforesaid Advocate in pursuance of this authority.\n\nI agree to pay the fee of the aforesaid Advocate as agreed.\n\nI agree that in case of my absence from the station, the aforesaid case may be proceeded with in my absence and no adjournment will be asked on that ground.\n\nDated this [DAY] day of [MONTH], [YEAR]\n\nAccepted:\n\n[ADVOCATE'S SIGNATURE]                          [CLIENT'S SIGNATURE]\nAdvocate                                      [CLIENT'S NAME]\n[ENROLLMENT NO.]`
    },
    {
      id: '6',
      title: 'Consumer Complaint (NCDRC)',
      type: 'consumer_complaint',
      description: 'Format for filing complaint before National Consumer Disputes Redressal Commission',
      jurisdiction: 'ncdrc',
      category: 'consumer',
      content: `BEFORE THE NATIONAL CONSUMER DISPUTES REDRESSAL COMMISSION\nNEW DELHI\n\nCOMPLAINT NO. __________ OF [YEAR]\n\nIN THE MATTER OF:\n[NAME OF COMPLAINANT]\n... COMPLAINANT\n\nVERSUS\n\n[NAME OF OPPOSITE PARTY/PARTIES]\n... OPPOSITE PARTY/PARTIES\n\nCOMPLAINT UNDER SECTION 21 OF THE CONSUMER PROTECTION ACT, 2019\n\nMOST RESPECTFULLY SHOWETH:\n\n1. Details of the Complainant:\n   [NAME, COMPLETE ADDRESS, CONTACT DETAILS]\n\n2. Details of the Opposite Party/Parties:\n   [NAME, COMPLETE ADDRESS, CONTACT DETAILS]\n\n3. Brief facts of the case:\n   [CHRONOLOGICAL STATEMENT OF FACTS]\n\n4. Deficiency in service/Defect in goods complained of:\n   [DETAILS OF DEFICIENCY/DEFECT]\n\n5. Details of the product/service:\n   a) Date of purchase/availing service: [DATE]\n   b) Amount paid: Rs. [AMOUNT]\n   c) Proof of payment: [DETAILS OF PROOF]\n\n6. Details of reliefs sought:\n   [SPECIFIC RELIEFS SOUGHT]\n\n7. Complaint falls within the jurisdiction of this Commission as the value of goods/services and compensation claimed exceeds Rs. One Crore.\n\n8. The complaint is within limitation as prescribed under Section 69 of the Consumer Protection Act, 2019.\n\n9. The Complainant has not filed any similar complaint before any other Commission or Forum or Court.\n\nPRAYER:\nIn view of the facts stated above, it is most respectfully prayed that this Hon'ble Commission may be pleased to:\n\na) Direct the Opposite Party to [PRIMARY RELIEF]\n\nb) Direct the Opposite Party to pay a sum of Rs. [AMOUNT] as compensation for [REASONS]\n\nc) Direct the Opposite Party to pay interest @ [RATE]% on the amount from the date of [RELEVANT DATE] till realization\n\nd) Award costs of the proceedings\n\ne) Pass any other order as this Hon'ble Commission may deem fit and proper in the circumstances of the case.\n\nPLACE: [PLACE]\nDATE: [DATE]\n\nCOMPLAINANT\nTHROUGH COUNSEL`
    },
    {
      id: '7',
      title: 'Anticipatory Bail Application',
      type: 'anticipatory_bail',
      description: 'Application under Section 438 Cr.P.C.',
      jurisdiction: 'high_court',
      category: 'criminal',
      content: `IN THE HIGH COURT OF [STATE] AT [CITY]\n\nCRIMINAL MISCELLANEOUS PETITION NO. __________ OF [YEAR]\n\nIN THE MATTER OF:\nAN APPLICATION UNDER SECTION 438 OF THE CODE OF CRIMINAL PROCEDURE, 1973\n\nAND\n\nIN THE MATTER OF:\n[NAME OF PETITIONER]\n... PETITIONER\n\nVERSUS\n\nSTATE OF [STATE]\n... RESPONDENT\n\nTO,\nTHE HON'BLE CHIEF JUSTICE AND OTHER COMPANION JUDGES OF THE HON'BLE HIGH COURT\n\nTHE HUMBLE PETITION OF THE PETITIONER ABOVE NAMED:\n\nMOST RESPECTFULLY SHOWETH:\n\n1. That this is an application under Section 438 of the Code of Criminal Procedure, 1973 for grant of anticipatory bail to the petitioner in connection with FIR No. [FIR NUMBER] dated [DATE] registered at Police Station [POLICE STATION] under Sections [SECTIONS] of [ACT].\n\n2. That the petitioner apprehends arrest in connection with the aforesaid FIR which has been registered on the basis of a false, frivolous and concocted complaint filed by [COMPLAINANT'S NAME].\n\n3. Brief facts of the case are as follows:\n   [BRIEF NARRATION OF RELEVANT FACTS]\n\n4. Grounds for anticipatory bail:\n   a) That the allegations in the FIR are false, frivolous and concocted.\n   b) That the petitioner is a respectable citizen having deep roots in society and there is no likelihood of his/her absconding or evading the process of law.\n   c) That the petitioner is ready and willing to cooperate with the investigation.\n   d) That the petitioner undertakes to abide by all conditions that this Hon'ble Court may deem fit to impose.\n   e) [OTHER RELEVANT GROUNDS]\n\n5. That the petitioner undertakes to be present before the Investigating Officer as and when required.\n\nPRAYER:\nIt is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to:\n\na) Grant anticipatory bail to the petitioner in the event of his/her arrest in connection with FIR No. [FIR NUMBER] dated [DATE] registered at Police Station [POLICE STATION]\n\nb) Direct that in the event of arrest, the petitioner shall be released on bail on such terms and conditions as this Hon'ble Court may deem fit\n\nc) Pass such other order or orders as this Hon'ble Court may deem fit and proper in the circumstances of the case.\n\nAND FOR THIS ACT OF KINDNESS, THE PETITIONER AS IN DUTY BOUND SHALL EVER PRAY.\n\nPlace: [PLACE]\nDate: [DATE]\n\nPETITIONER\nTHROUGH COUNSEL`
    },
    {
      id: '8',
      title: 'Rent Agreement (Delhi)',
      type: 'rental_agreement',
      description: 'Residential rent agreement as per Delhi Rent Control Act',
      jurisdiction: 'delhi',
      category: 'property',
      content: `RENT AGREEMENT\n\nThis Rent Agreement is made and executed on this [DATE] day of [MONTH], [YEAR] at Delhi\n\nBETWEEN\n\n[LANDLORD'S NAME], son/daughter/wife of [FATHER'S/HUSBAND'S NAME], resident of [ADDRESS], hereinafter called the "LESSOR" (which expression shall, unless repugnant to the context, include his/her heirs, legal representatives, executors, administrators and assigns) of the ONE PART\n\nAND\n\n[TENANT'S NAME], son/daughter/wife of [FATHER'S/HUSBAND'S NAME], resident of [ADDRESS], hereinafter called the "LESSEE" (which expression shall, unless repugnant to the context, include his/her heirs, legal representatives, executors, administrators and assigns) of the OTHER PART\n\nWHEREAS the Lessor is the absolute and lawful owner of [PROPERTY DESCRIPTION] (hereinafter referred to as the "Demised Premises");\n\nAND WHEREAS the Lessee has approached the Lessor for taking the Demised Premises on rent and the Lessor has agreed to let out the same on the terms and conditions appearing hereinafter;\n\nNOW THIS DEED WITNESSETH AS FOLLOWS:\n\n1. PERIOD OF TENANCY:\nThat the tenancy shall be for a period of [DURATION] commencing from [START DATE] and ending on [END DATE], which may be extended further with the mutual consent of both the parties.\n\n2. RENT:\nThat the monthly rent of the Demised Premises shall be Rs. [AMOUNT IN FIGURES]/- (Rupees [AMOUNT IN WORDS] Only), which shall be paid by the Lessee to the Lessor, on or before the [DAY] day of each English calendar month.\n\n3. SECURITY DEPOSIT:\nThat the Lessee has paid to the Lessor a sum of Rs. [AMOUNT IN FIGURES]/- (Rupees [AMOUNT IN WORDS] Only) as interest-free security deposit, which shall be refunded by the Lessor to the Lessee at the time of vacating the Demised Premises, after deducting therefrom any dues/damages, if any.\n\n4. ELECTRICITY AND WATER CHARGES:\nThat the Lessee shall pay electricity charges as per the meter reading and water charges as per the bill received from the Delhi Jal Board regularly.\n\n5. MAINTENANCE CHARGES:\nThat the Lessee shall pay monthly maintenance charges of Rs. [AMOUNT IN FIGURES]/- (Rupees [AMOUNT IN WORDS] Only) to the [RWA/SOCIETY NAME], if applicable.\n\n6. USE OF PREMISES:\nThat the Demised Premises shall be used by the Lessee for residential purpose only and the Lessee shall not use the same for any illegal, immoral or commercial purposes.\n\n7. SUBLETTING:\nThat the Lessee shall not sublet, assign or part with the possession of the Demised Premises or any part thereof to any person in any manner whatsoever.\n\n8. REPAIRS AND MAINTENANCE:\nThat the day-to-day repairs of the Demised Premises shall be done by the Lessee at his/her own cost. However, any structural repairs shall be done by the Lessor at his/her own cost.\n\n9. INSPECTION:\nThat the Lessor or his/her authorized representative shall have the right to enter and inspect the Demised Premises at reasonable hours after giving prior notice to the Lessee.\n\n10. TERMINATION:\nThat either party may terminate this agreement by giving [NOTICE PERIOD] months' prior notice in writing to the other party.\n\nIN WITNESS WHEREOF the parties hereto have set their hands on the day, month and year first above written.\n\nLESSOR                                      LESSEE\n[SIGNATURE]                                [SIGNATURE]\n[NAME]                                     [NAME]\n\nWITNESSES:\n1. [NAME AND SIGNATURE]\n2. [NAME AND SIGNATURE]`
    },
    {
      id: '9',
      title: 'RTI Application',
      type: 'rti_application',
      description: 'Application under Right to Information Act, 2005',
      jurisdiction: 'all_india',
      category: 'governance',
      content: `APPLICATION UNDER THE RIGHT TO INFORMATION ACT, 2005\n\nDate: [DATE]\n\nTo,\nThe Public Information Officer\n[NAME OF PUBLIC AUTHORITY]\n[ADDRESS]\n\nSubject: Application under Section 6 of the Right to Information Act, 2005\n\nSir/Madam,\n\n1. Full Name of the Applicant: [APPLICANT'S NAME]\n\n2. Address: [APPLICANT'S ADDRESS]\n\n3. Particulars of information sought:\n   [SPECIFIC DETAILS OF INFORMATION SOUGHT UNDER THE FOLLOWING HEADS]\n\n   a) Subject matter of information: [SUBJECT]\n\n   b) The period to which the information relates: [TIME PERIOD]\n\n   c) Description of information required: [DETAILED DESCRIPTION]\n\n   d) Whether information is required by post or in person: [SPECIFY]\n\n   e) In case by post, please specify - Ordinary/Registered/Speed Post: [SPECIFY]\n\n4. Whether the applicant is below the poverty line: Yes/No\n   (If yes, please attach a copy of the BPL certificate)\n\n5. Application fee details:\n   • I am enclosing herewith Indian Postal Order/Demand Draft/Banker's Cheque No. [NUMBER] dated [DATE] for Rs. 10/- (Rupees Ten Only) payable to [PAYEE NAME] towards the application fee under the RTI Act.\n\n   OR\n\n   • I have paid the application fee of Rs. 10/- (Rupees Ten Only) in cash against proper receipt.\n\nI state that the information sought does not fall within the restrictions contained in Section 8 and 9 of the RTI Act and to the best of my knowledge, it pertains to your office.\n\nYours faithfully,\n\n[SIGNATURE]\n[NAME]\n[CONTACT NUMBER]\n[EMAIL ID]`
    },
    {
      id: '10',
      title: 'Divorce Petition (Hindu Marriage Act)',
      type: 'divorce_petition',
      description: 'Petition under Section 13 of Hindu Marriage Act',
      jurisdiction: 'family_court',
      category: 'family',
      content: `IN THE COURT OF FAMILY JUDGE AT [CITY]\n\nPETITION NO. __________ OF [YEAR]\n\nIN THE MATTER OF:\n[NAME OF PETITIONER]\n... PETITIONER\n\nVERSUS\n\n[NAME OF RESPONDENT]\n... RESPONDENT\n\nPETITION FOR DISSOLUTION OF MARRIAGE BY A DECREE OF DIVORCE UNDER SECTION 13 OF THE HINDU MARRIAGE ACT, 1955\n\nMOST RESPECTFULLY SHOWETH:\n\n1. That the petitioner and the respondent are Hindus by religion and are governed by the Hindu Marriage Act, 1955.\n\n2. That the marriage between the petitioner and the respondent was solemnized on [DATE] at [PLACE] according to Hindu rites and customs.\n\n3. That after the marriage, the petitioner and the respondent resided together at [ADDRESS] and out of the wedlock, [NUMBER] child/children was/were born, namely [NAME(S) AND AGE(S) OF CHILD/CHILDREN], if any.\n\n4. That the present status of the petitioner is as follows:\n   a) Name: [NAME]\n   b) Age: [AGE] years\n   c) Occupation: [OCCUPATION]\n   d) Monthly Income: Rs. [AMOUNT]\n   e) Present Address: [ADDRESS]\n   f) Permanent Address: [ADDRESS]\n   g) Phone Number: [PHONE NUMBER]\n   h) Email: [EMAIL ID]\n\n5. That the present status of the respondent is as follows:\n   a) Name: [NAME]\n   b) Age: [AGE] years\n   c) Occupation: [OCCUPATION]\n   d) Monthly Income: Rs. [AMOUNT] (approximate)\n   e) Present Address: [ADDRESS]\n   f) Permanent Address: [ADDRESS]\n   g) Phone Number: [PHONE NUMBER], if known\n   h) Email: [EMAIL ID], if known\n\n6. GROUNDS FOR DIVORCE:\n   [DETAILED DESCRIPTION OF GROUNDS UNDER SECTION 13 OF THE HINDU MARRIAGE ACT, SUCH AS CRUELTY, DESERTION, ETC.]\n\n7. That the marriage between the parties has irretrievably broken down and there is no possibility of reconciliation.\n\n8. That the present petition is not being presented in collusion with the respondent.\n\n9. That there has not been any unnecessary or improper delay in filing the present petition.\n\n10. That there is no other legal proceeding pending between the parties in any court of law.\n\n11. That this Hon'ble Court has jurisdiction to entertain and try this petition as:\n    a) The marriage was solemnized at [PLACE] which falls within the jurisdiction of this Hon'ble Court; OR\n    b) The respondent resides within the jurisdiction of this Hon'ble Court; OR\n    c) The parties last resided together at [PLACE] which falls within the jurisdiction of this Hon'ble Court; OR\n    d) The petitioner is residing at [PLACE] which falls within the jurisdiction of this Hon'ble Court, after having been deserted by the respondent.\n\nPRAYER:\nIn the facts and circumstances stated above, it is most respectfully prayed that this Hon'ble Court may be pleased to:\n\na) Pass a decree of divorce dissolving the marriage between the petitioner and the respondent solemnized on [DATE]\n\nb) Grant permanent custody of the minor child/children to the petitioner with visitation rights to the respondent, if applicable\n\nc) Direct the respondent to pay maintenance to the petitioner and the minor child/children, if applicable\n\nd) Pass such other order(s) as this Hon'ble Court may deem fit and proper in the circumstances of the case.\n\nPLACE: [PLACE]\nDATE: [DATE]\n\nPETITIONER\nTHROUGH COUNSEL\n\nVERIFICATION:\nVerified at [PLACE] on this [DATE] day of [MONTH], [YEAR] that the contents of paragraphs 1 to [NUMBER] of the above petition are true and correct to my knowledge and belief and nothing material has been concealed therefrom.\n\nPETITIONER`
    }
  ];
  
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'constitutional', label: 'Constitutional' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'procedural', label: 'Procedural' },
    { value: 'consumer', label: 'Consumer' },
    { value: 'criminal', label: 'Criminal' },
    { value: 'property', label: 'Property' },
    { value: 'governance', label: 'Governance' },
    { value: 'family', label: 'Family' },
  ];
  
  const jurisdictionOptions = [
    { value: '', label: 'All Jurisdictions' },
    { value: 'all_india', label: 'All India' },
    { value: 'supreme_court', label: 'Supreme Court' },
    { value: 'high_court', label: 'High Courts' },
    { value: 'district_court', label: 'District Courts' },
    { value: 'family_court', label: 'Family Courts' },
    { value: 'consumer_forum', label: 'Consumer Forums' },
    { value: 'ncdrc', label: 'NCDRC' },
    { value: 'delhi', label: 'Delhi' },
  ];

  // Filter templates based on search term and filters
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || template.category === categoryFilter;
    const matchesJurisdiction = !jurisdictionFilter || template.jurisdiction === jurisdictionFilter;
    
    return matchesSearch && matchesCategory && matchesJurisdiction;
  });

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg text-legal-slate dark:text-white">Indian Legal Templates</CardTitle>
            <CardDescription className="text-legal-muted dark:text-gray-400">
              Start with a professionally drafted template
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="text-xs h-8">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={jurisdictionFilter}
              onValueChange={setJurisdictionFilter}
            >
              <SelectTrigger className="text-xs h-8">
                <SelectValue placeholder="Filter by Jurisdiction" />
              </SelectTrigger>
              <SelectContent>
                {jurisdictionOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <ScrollArea className="h-[320px] pr-4 mt-3">
          <div className="space-y-2">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant="ghost"
                  className="w-full justify-between hover:bg-slate-100 dark:hover:bg-slate-800 text-left px-3 py-2 h-auto"
                  onClick={() => onTemplateSelect(template)}
                >
                  <div className="flex flex-col items-start">
                    <div className="font-medium text-legal-slate dark:text-white">{template.title}</div>
                    <div className="text-xs text-legal-muted dark:text-gray-400">{template.description}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">
                        {categoryOptions.find(c => c.value === template.category)?.label || template.category}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                        {jurisdictionOptions.find(j => j.value === template.jurisdiction)?.label || template.jurisdiction}
                      </span>
                    </div>
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

