
import { v4 as uuidv4 } from 'uuid';

export interface DocumentTemplate {
  id: string;
  title: string;
  type: string;
  description: string;
  content: string;
  category: string;
  dateAdded: string;
  popularity: number;
}

// Template categories for organization
export const TEMPLATE_CATEGORIES = {
  LITIGATION: 'Litigation',
  CONTRACT: 'Contract',
  PROPERTY: 'Property',
  FAMILY: 'Family Law',
  CORPORATE: 'Corporate',
  PERSONAL: 'Personal',
  COURT_FILING: 'Court Filing',
  BUSINESS: 'Business'
};

// Template types for filtering
export const TEMPLATE_TYPES = {
  PLEADING: 'Pleading',
  CONTRACT: 'Contract',
  AGREEMENT: 'Agreement',
  AFFIDAVIT: 'Affidavit',
  PETITION: 'Petition',
  NOTICE: 'Notice',
  LEGAL_NOTICE: 'Legal Notice',
  AUTHORIZATION: 'Authorization',
  COURT_DOCUMENT: 'Court Document',
  ESTATE_PLANNING: 'Estate Planning',
  COMPLIANCE: 'Compliance'
};

// Function to load templates
export function getDocumentTemplates(): DocumentTemplate[] {
  // Try to get from localStorage first (for usage statistics)
  const localTemplates = localStorage.getItem('documentTemplates');
  
  if (localTemplates) {
    return JSON.parse(localTemplates);
  }
  
  // Default templates if not in localStorage
  return defaultTemplates;
}

// Update template usage count
export function updateTemplateUsage(templateId: string): void {
  const templates = getDocumentTemplates();
  const templateIndex = templates.findIndex(t => t.id === templateId);
  
  if (templateIndex !== -1) {
    templates[templateIndex].popularity += 1;
    localStorage.setItem('documentTemplates', JSON.stringify(templates));
    
    // Track last used date
    const lastUsed = {
      ...JSON.parse(localStorage.getItem('lastUsedTemplates') || '{}'),
      [templateId]: new Date().toISOString()
    };
    localStorage.setItem('lastUsedTemplates', JSON.stringify(lastUsed));
  }
}

// Search templates by term
export function searchTemplates(searchTerm: string, templates: DocumentTemplate[]): DocumentTemplate[] {
  if (!searchTerm.trim()) return templates;
  
  const term = searchTerm.toLowerCase().trim();
  
  return templates.filter(template => 
    template.title.toLowerCase().includes(term) || 
    template.description.toLowerCase().includes(term) ||
    template.category.toLowerCase().includes(term) ||
    template.type.toLowerCase().includes(term)
  );
}

// Filter templates by category
export function filterTemplatesByCategory(category: string, templates: DocumentTemplate[]): DocumentTemplate[] {
  if (category === 'all') return templates;
  
  return templates.filter(template => 
    template.category.toLowerCase() === category.toLowerCase()
  );
}

// Get templates by popularity
export function getPopularTemplates(templates: DocumentTemplate[], limit: number = 5): DocumentTemplate[] {
  return [...templates]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

// Get recently used templates
export function getRecentlyUsedTemplates(templates: DocumentTemplate[], limit: number = 5): DocumentTemplate[] {
  const lastUsed = JSON.parse(localStorage.getItem('lastUsedTemplates') || '{}');
  
  return [...templates]
    .filter(template => lastUsed[template.id])
    .sort((a, b) => {
      const dateA = new Date(lastUsed[a.id]).getTime();
      const dateB = new Date(lastUsed[b.id]).getTime();
      return dateB - dateA;
    })
    .slice(0, limit);
}

// Save a custom template
export function saveCustomTemplate(template: Omit<DocumentTemplate, 'id' | 'dateAdded' | 'popularity'>): DocumentTemplate {
  const templates = getDocumentTemplates();
  
  const newTemplate: DocumentTemplate = {
    ...template,
    id: uuidv4(),
    dateAdded: new Date().toISOString(),
    popularity: 0
  };
  
  templates.push(newTemplate);
  localStorage.setItem('documentTemplates', JSON.stringify(templates));
  
  return newTemplate;
}

// Default document templates
const defaultTemplates: DocumentTemplate[] = [
  {
    id: "1",
    title: "Civil Suit Plaint",
    type: TEMPLATE_TYPES.PLEADING,
    description: "Standard format for filing a civil suit in Indian district courts",
    content: `IN THE COURT OF CIVIL JUDGE (JUNIOR DIVISION) AT [COURT LOCATION]

PLAINT
(Under Order VII Rule 1 of the Code of Civil Procedure, 1908)

Suit No. _______ of 20__

[PLAINTIFF NAME]                                    ...PLAINTIFF
S/o, D/o, W/o [FATHER/HUSBAND NAME]
R/o [COMPLETE ADDRESS]

VERSUS

[DEFENDANT NAME]                                    ...DEFENDANT
S/o, D/o, W/o [FATHER/HUSBAND NAME]
R/o [COMPLETE ADDRESS]

SUIT FOR [NATURE OF SUIT - E.G., SPECIFIC PERFORMANCE/RECOVERY OF MONEY/DECLARATION AND INJUNCTION]

The plaintiff submits as under:

1. That the plaintiff is a [DESCRIPTION OF PLAINTIFF - E.G., RESIDENT/OWNER/TENANT].

2. That the defendant is a [DESCRIPTION OF DEFENDANT - E.G., RESIDENT/OWNER/TENANT].

3. [FACTS OF THE CASE - DESCRIBE THE BACKGROUND, EVENTS, AND CIRCUMSTANCES LEADING TO THE FILING OF THIS SUIT]

4. [CAUSE OF ACTION - WHEN AND HOW THE RIGHT TO SUE ACCRUED]

5. [JURISDICTION - GROUNDS ON WHICH THE COURT HAS TERRITORIAL AND PECUNIARY JURISDICTION]

6. That the suit is valued at Rs. [VALUE OF SUIT] for the purposes of court fees and jurisdiction, and court fee of Rs. [COURT FEE AMOUNT] is paid herewith.

7. [LIMITATION - STATEMENT THAT THE SUIT IS WITHIN LIMITATION]

PRAYER:

In view of the facts and circumstances stated above, it is most respectfully prayed that:

a) [FIRST RELIEF SOUGHT]
b) [SECOND RELIEF SOUGHT]
c) [THIRD RELIEF SOUGHT]
d) Any other relief which this Hon'ble Court deems fit and proper may kindly be granted in favor of the plaintiff.

Place: [PLACE]
Date: [DATE]

[ADVOCATE'S NAME]
Advocate for the Plaintiff
[ENROLLMENT NO.]

VERIFICATION:

I, [PLAINTIFF'S NAME], the plaintiff above named, do hereby verify that the contents of paragraphs 1 to [LAST PARAGRAPH NUMBER] of the plaint are true and correct to my knowledge and belief, and nothing material has been concealed therefrom.

Verified at [PLACE] on this [DATE].

[PLAINTIFF'S SIGNATURE]
PLAINTIFF`,
    category: TEMPLATE_CATEGORIES.LITIGATION,
    dateAdded: "2023-11-15",
    popularity: 127
  },
  {
    id: "2",
    title: "Rental Agreement",
    type: TEMPLATE_TYPES.CONTRACT,
    description: "Comprehensive rental agreement template compliant with Rent Control Acts",
    content: `RENTAL AGREEMENT

THIS AGREEMENT is made and executed on this [DATE] at [PLACE] by and between:

[LANDLORD NAME], S/o, D/o, W/o [FATHER/HUSBAND NAME], aged about [AGE] years, residing at [ADDRESS], hereinafter called the "LESSOR/LANDLORD" (which expression shall, unless repugnant to the context or meaning thereof, mean and include his/her heirs, legal representatives, executors, administrators and assigns) of the ONE PART;

AND

[TENANT NAME], S/o, D/o, W/o [FATHER/HUSBAND NAME], aged about [AGE] years, residing at [ADDRESS], hereinafter called the "LESSEE/TENANT" (which expression shall, unless repugnant to the context or meaning thereof, mean and include his/her heirs, legal representatives, executors, administrators and assigns) of the OTHER PART.

WHEREAS the LESSOR is the absolute owner and in possession of the premises bearing No. [PROPERTY ADDRESS], hereinafter called the "SCHEDULED PREMISES";

AND WHEREAS the LESSOR has agreed to let out and the LESSEE has agreed to take on rent the SCHEDULED PREMISES for a period of [LEASE DURATION] commencing from [START DATE] and ending on [END DATE];

NOW THIS DEED OF LEASE WITNESSETH AS FOLLOWS:

1. RENT:
   The LESSEE shall pay to the LESSOR a monthly rent of Rs. [RENT AMOUNT]/- (Rupees [AMOUNT IN WORDS] Only) on or before the [DAY] day of each English calendar month.

2. DEPOSIT:
   The LESSEE has paid to the LESSOR a sum of Rs. [DEPOSIT AMOUNT]/- (Rupees [AMOUNT IN WORDS] Only) as interest-free refundable security deposit, which shall be refunded by the LESSOR to the LESSEE at the time of vacating the SCHEDULED PREMISES after deducting any dues or damages, if any.

3. TERM:
   This lease shall be for a period of [LEASE DURATION] commencing from [START DATE] and ending on [END DATE]. The lease may be renewed for a further period with mutual consent of both parties on such terms and conditions as may be agreed upon.

4. MAINTENANCE:
   (a) The LESSEE shall maintain the SCHEDULED PREMISES in good condition and shall not cause any damage to the SCHEDULED PREMISES.
   (b) The LESSEE shall carry out minor repairs at his/her own cost and expense.
   (c) Any major repairs shall be carried out by the LESSOR at his/her cost.

5. PAYMENT OF CHARGES:
   The LESSEE shall pay all electricity, water, and gas charges as per actual consumption shown in the respective meters and any other taxes or charges levied by any local authority in respect of the SCHEDULED PREMISES during the term of the lease.

6. USE OF PREMISES:
   The LESSEE shall use the SCHEDULED PREMISES only for residential purposes and not for any commercial, illegal, or immoral purposes.

7. SUB-LETTING:
   The LESSEE shall not sub-let, assign, or part with possession of the SCHEDULED PREMISES or any part thereof to any person without the prior written consent of the LESSOR.

8. TERMINATION:
   Either party may terminate this agreement by giving [NOTICE PERIOD] months' prior notice in writing to the other party.

9. JURISDICTION:
   Any dispute arising out of or in connection with this agreement shall be subject to the exclusive jurisdiction of the courts in [JURISDICTION].

IN WITNESS WHEREOF, the parties hereto have set their hands on the day, month and year first above written.

Signed by the LESSOR
[LANDLORD NAME]
in the presence of:
1. [WITNESS 1 NAME AND ADDRESS]
2. [WITNESS 2 NAME AND ADDRESS]

Signed by the LESSEE
[TENANT NAME]
in the presence of:
1. [WITNESS 1 NAME AND ADDRESS]
2. [WITNESS 2 NAME AND ADDRESS]`,
    category: TEMPLATE_CATEGORIES.PROPERTY,
    dateAdded: "2023-10-22",
    popularity: 245
  },
  {
    id: "3",
    title: "Will Testament",
    type: TEMPLATE_TYPES.ESTATE_PLANNING,
    description: "Simple will format compliant with Indian Succession Act",
    content: `LAST WILL AND TESTAMENT

I, [TESTATOR NAME], son/daughter of [FATHER'S NAME], residing at [COMPLETE ADDRESS], aged about [AGE] years, do hereby revoke all my former Wills, Codicils, and Testamentary dispositions made by me at any time heretofore, and declare this to be my Last Will and Testament.

1. I appoint [EXECUTOR NAME], son/daughter of [FATHER'S NAME], residing at [COMPLETE ADDRESS], to be the Executor of this my Will.

2. I give, devise and bequeath all my property, both movable and immovable, of whatsoever nature and wheresoever situate, which I may be entitled to or over which I may have a disposing power at the time of my death, including any property over which I may have a general power of appointment, after payment thereout of my debts, funeral and testamentary expenses in the manner following:

[PROPERTY 1 DESCRIPTION]: I give, devise and bequeath to [BENEFICIARY 1 NAME], son/daughter of [FATHER'S NAME], residing at [COMPLETE ADDRESS].

[PROPERTY 2 DESCRIPTION]: I give, devise and bequeath to [BENEFICIARY 2 NAME], son/daughter of [FATHER'S NAME], residing at [COMPLETE ADDRESS].

[CONTINUE WITH OTHER PROPERTIES AND BENEFICIARIES AS NEEDED]

3. I direct my Executor to pay all my just debts, funeral expenses and the expenses of administering my estate as soon after my death as practicable.

4. If any beneficiary under this Will shall contest the validity or object to any provision of this Will, or attempt to set it aside or to alter or change any provision herein, then I hereby revoke any bequest herein made to such beneficiary, and such beneficiary shall take nothing hereunder, but the bequest shall pass as part of the residue of my estate.

5. If any provision of this Will is held to be invalid or unenforceable, the remaining provisions shall nevertheless continue in full force and effect.

IN WITNESS WHEREOF, I have hereunto set my hand to this my Last Will and Testament, consisting of [NUMBER] pages, on this [DATE] at [PLACE].

[SIGNATURE OF TESTATOR]
(TESTATOR NAME)

SIGNED by the above-named TESTATOR as his/her Last Will and Testament in the presence of us both present at the same time, who at his/her request and in his/her presence and in the presence of each other have hereunto subscribed our names as witnesses:

1. [WITNESS 1 SIGNATURE]
   Name: [WITNESS 1 NAME]
   Address: [WITNESS 1 ADDRESS]
   Occupation: [WITNESS 1 OCCUPATION]

2. [WITNESS 2 SIGNATURE]
   Name: [WITNESS 2 NAME]
   Address: [WITNESS 2 ADDRESS]
   Occupation: [WITNESS 2 OCCUPATION]`,
    category: TEMPLATE_CATEGORIES.FAMILY,
    dateAdded: "2023-09-05",
    popularity: 89
  },
  {
    id: "4",
    title: "Power of Attorney",
    type: TEMPLATE_TYPES.AUTHORIZATION,
    description: "General Power of Attorney document with customizable powers",
    content: `POWER OF ATTORNEY

KNOW ALL MEN BY THESE PRESENTS:

THAT I, [PRINCIPAL NAME], son/daughter of [FATHER'S NAME], aged about [AGE] years, residing at [COMPLETE ADDRESS], do hereby nominate, constitute, and appoint [ATTORNEY NAME], son/daughter of [FATHER'S NAME], aged about [AGE] years, residing at [COMPLETE ADDRESS], as my true and lawful ATTORNEY to do and execute the following acts, deeds, and things in my name and on my behalf:

1. To manage and look after my property bearing No. [PROPERTY DESCRIPTION].

2. To appear and represent me before any Government Office, Local Authority, Sub-Registrar Office, Municipal Corporation, Electricity Department, Water Supply Department, Telephone Department, Gas Connection or any other departments or offices concerned.

3. To make applications, file documents, sign papers, and receive letters, notices, or any other documents on my behalf.

4. To enter into and execute contracts, agreements, and other documents in respect of the said property.

5. To accept rent, issue receipts, and maintain accounts of all income and expenditure in respect of the said property.

6. To pay all taxes, levies, assessments, charges, and outgoings in respect of the said property.

7. To engage contractors, architects, engineers, and other persons for the repairs, maintenance, and construction of the said property.

8. To commence, prosecute, enforce, defend, answer or oppose all actions and other legal proceedings touching any of the matters aforesaid or any other matters in which I am or may hereafter be interested or concerned.

9. To sign, verify, and file plaints, written statements, applications, affidavits, and other documents in any court of law or tribunal in any legal proceedings.

10. To engage advocates, solicitors, and attorneys and to sign vakalatnamas on my behalf.

AND I HEREBY AGREE to ratify and confirm all lawful acts, deeds, and things done by my said Attorney by virtue of these presents.

This Power of Attorney shall be valid until revoked by me in writing.

IN WITNESS WHEREOF I have hereunto set my hand this [DATE] at [PLACE].

[SIGNATURE]
(PRINCIPAL NAME)

WITNESSES:

1. [WITNESS 1 SIGNATURE]
   Name: [WITNESS 1 NAME]
   Address: [WITNESS 1 ADDRESS]

2. [WITNESS 2 SIGNATURE]
   Name: [WITNESS 2 NAME]
   Address: [WITNESS 2 ADDRESS]`,
    category: TEMPLATE_CATEGORIES.PERSONAL,
    dateAdded: "2023-12-12",
    popularity: 178
  },
  {
    id: "5",
    title: "Affidavit Format",
    type: TEMPLATE_TYPES.AFFIDAVIT,
    description: "General affidavit format with proper verification clause",
    content: `AFFIDAVIT

I, [DEPONENT NAME], son/daughter/wife of [FATHER/HUSBAND NAME], aged about [AGE] years, resident of [COMPLETE ADDRESS], do hereby solemnly affirm and declare as under:

1. That I am the deponent of this affidavit and am fully conversant with the facts and circumstances of this case.

2. That [FACT 1].

3. That [FACT 2].

4. That [FACT 3].

5. That [FACT 4].

VERIFICATION:

I, the deponent above named, do hereby verify that the contents of paragraphs 1 to [LAST PARAGRAPH NUMBER] of this affidavit are true and correct to my knowledge, no part of it is false and nothing material has been concealed therefrom.

Verified at [PLACE] on this [DATE].

[DEPONENT SIGNATURE]
DEPONENT

IDENTIFIED BY ME:

[ADVOCATE SIGNATURE]
ADVOCATE
ENROLLMENT NO. [NUMBER]`,
    category: TEMPLATE_CATEGORIES.COURT_FILING,
    dateAdded: "2024-01-18",
    popularity: 203
  },
  {
    id: "6",
    title: "Non-Disclosure Agreement",
    type: TEMPLATE_TYPES.CONTRACT,
    description: "Comprehensive NDA for business purposes with Indian law compliance",
    content: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is made and entered into on this [DATE] at [PLACE] by and between:

[PARTY A NAME], a company incorporated under the Companies Act, 2013, having its registered office at [COMPLETE ADDRESS], represented by its authorized signatory, [AUTHORIZED PERSON NAME], hereinafter referred to as the "Disclosing Party",

AND

[PARTY B NAME], a company incorporated under the Companies Act, 2013, having its registered office at [COMPLETE ADDRESS], represented by its authorized signatory, [AUTHORIZED PERSON NAME], hereinafter referred to as the "Receiving Party".

The Disclosing Party and the Receiving Party are hereinafter collectively referred to as the "Parties" and individually as a "Party".

WHEREAS:

A. The Parties are exploring the possibility of engaging in discussions regarding [PURPOSE OF DISCUSSIONS], hereinafter referred to as the "Purpose".

B. In the course of discussions relating to the Purpose, the Disclosing Party may disclose to the Receiving Party certain information which is proprietary and confidential to the Disclosing Party.

C. The Parties have agreed to enter into this Agreement to govern the disclosure, use, and protection of such confidential information.

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the Parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION

   "Confidential Information" means any information disclosed by the Disclosing Party to the Receiving Party, either directly or indirectly, in writing, orally, or by inspection of tangible objects, which is designated as "Confidential", "Proprietary", or some similar designation, or information that by its nature would be understood by a reasonable person to be confidential. Confidential Information may include, but is not limited to, trade secrets, technical data, product ideas, software, specifications, designs, business strategies, financial information, and customer lists.

2. NON-DISCLOSURE AND NON-USE

   The Receiving Party agrees:

   (a) To maintain the Disclosing Party's Confidential Information in strict confidence and to take all reasonable precautions to protect such Confidential Information.
   
   (b) Not to disclose any Confidential Information to any third party without the prior written consent of the Disclosing Party.
   
   (c) Not to use any Confidential Information for any purpose other than the Purpose.
   
   (d) To limit access to the Disclosing Party's Confidential Information to only those of its employees, agents, and representatives who have a need to know such information for the Purpose and who are bound by obligations of confidentiality at least as restrictive as those contained herein.

3. EXCEPTIONS

   The obligations of the Receiving Party under this Agreement shall not apply to information that:

   (a) Was in the public domain at the time of disclosure or subsequently becomes part of the public domain through no fault of the Receiving Party.
   
   (b) Was known to the Receiving Party, without restriction, at the time of disclosure, as demonstrated by written records.
   
   (c) Is rightfully received by the Receiving Party from a third party without restriction and without breach of this Agreement.
   
   (d) Is independently developed by the Receiving Party without use of or reference to the Confidential Information, as demonstrated by written records.
   
   (e) Is required to be disclosed by law, regulation, or court order, provided that the Receiving Party gives the Disclosing Party prompt written notice of such requirement and cooperates with the Disclosing Party in obtaining a protective order or other appropriate relief.

4. RETURN OF MATERIALS

   Upon the earlier of (i) the completion or termination of the Purpose, (ii) the request of the Disclosing Party, or (iii) the termination of this Agreement, the Receiving Party shall promptly return to the Disclosing Party or destroy all copies of any Confidential Information in its possession or under its control, including all copies, extracts, or derivatives thereof.

5. NO RIGHTS GRANTED

   Nothing in this Agreement shall be construed as granting any rights, license, or ownership interest in the Confidential Information to the Receiving Party. The Disclosing Party retains all right, title, and interest in and to its Confidential Information.

6. TERM AND TERMINATION

   This Agreement shall commence on the date first written above and shall remain in effect for a period of [DURATION] years, unless earlier terminated by mutual written agreement of the Parties. Notwithstanding the termination of this Agreement, the obligations of confidentiality and non-use shall survive for a period of [SURVIVAL DURATION] years after the termination or expiration of this Agreement.

7. REMEDIES

   The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm to the Disclosing Party for which monetary damages may not be an adequate remedy. Accordingly, the Disclosing Party shall be entitled to seek injunctive relief in addition to any other remedies available at law or in equity.

8. GOVERNING LAW AND JURISDICTION

   This Agreement shall be governed by and construed in accordance with the laws of India. Any dispute arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts at [JURISDICTION].

9. ENTIRE AGREEMENT

   This Agreement constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior agreements, understandings, and negotiations, both written and oral, between the Parties with respect to the subject matter hereof.

10. AMENDMENTS

    No modification, amendment, or waiver of any provision of this Agreement shall be effective unless in writing and signed by both Parties.

11. COUNTERPARTS

    This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first above written.

FOR AND ON BEHALF OF THE DISCLOSING PARTY:

[SIGNATURE]
Name: [NAME]
Designation: [DESIGNATION]

FOR AND ON BEHALF OF THE RECEIVING PARTY:

[SIGNATURE]
Name: [NAME]
Designation: [DESIGNATION]

WITNESSES:

1. [WITNESS 1 SIGNATURE]
   Name: [WITNESS 1 NAME]
   Address: [WITNESS 1 ADDRESS]

2. [WITNESS 2 SIGNATURE]
   Name: [WITNESS 2 NAME]
   Address: [WITNESS 2 ADDRESS]`,
    category: TEMPLATE_CATEGORIES.BUSINESS,
    dateAdded: "2024-02-20",
    popularity: 156
  },
  {
    id: "7",
    title: "Legal Notice Format",
    type: TEMPLATE_TYPES.LEGAL_NOTICE,
    description: "Standard legal notice format for various legal disputes",
    content: `LEGAL NOTICE

From:
[SENDER NAME]
[SENDER ADDRESS]
Through: [ADVOCATE NAME]
[ADVOCATE ADDRESS]
[ENROLLMENT NO.]

To:
[RECIPIENT NAME]
[RECIPIENT ADDRESS]

Date: [DATE]

Subject: [SUBJECT MATTER OF NOTICE]

Sir/Madam,

Under instructions from and on behalf of my client [CLIENT NAME], I hereby serve upon you the following legal notice:

1. That my client states that [STATE FACTS OF THE CASE].

2. That [FURTHER FACTS].

3. That [CAUSE OF ACTION].

4. That despite [DETAILS OF PREVIOUS ATTEMPTS TO RESOLVE].

5. That your acts have caused my client [DETAILS OF LOSS/INJURY].

6. That through this legal notice, you are called upon to [DEMAND - E.G., PAY AMOUNT/PERFORM OBLIGATION/CEASE AND DESIST] within [TIME PERIOD, USUALLY 15 OR 30 DAYS] from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you, civil and/or criminal, as advised, at your risk, cost, and consequences.

Please take note accordingly.

Yours faithfully,

[ADVOCATE SIGNATURE]
[ADVOCATE NAME]
Advocate for the Sender`,
    category: TEMPLATE_CATEGORIES.LITIGATION,
    dateAdded: "2024-03-10",
    popularity: 132
  },
  {
    id: "8",
    title: "Shareholders' Agreement",
    type: TEMPLATE_TYPES.AGREEMENT,
    description: "Comprehensive shareholders' agreement for Indian companies",
    content: `SHAREHOLDERS' AGREEMENT

THIS SHAREHOLDERS' AGREEMENT (the "Agreement") is made on this [DATE] at [PLACE], by and among:

[COMPANY NAME], a company incorporated under the Companies Act, 2013, having its registered office at [COMPANY ADDRESS], represented by its authorized signatory, [AUTHORIZED PERSON NAME] (hereinafter referred to as the "Company");

AND

The persons whose names and addresses are set out in Schedule I hereto (hereinafter individually referred to as "Shareholder" and collectively as the "Shareholders").

The Company and the Shareholders are hereinafter collectively referred to as the "Parties" and individually as a "Party".

WHEREAS:

A. The Company has an authorized share capital of Rs. [AMOUNT]/- (Rupees [AMOUNT IN WORDS] Only) divided into [NUMBER] equity shares of Rs. [FACE VALUE]/- (Rupees [FACE VALUE IN WORDS] Only) each.

B. The Shareholders are the legal and beneficial owners of the shares in the Company in the proportion set out against their respective names in Schedule I hereto.

C. The Parties are entering into this Agreement to record the terms and conditions that will govern their relationship as Shareholders of the Company and certain matters connected therewith.

NOW, THEREFORE, in consideration of the mutual promises and covenants contained herein, the Parties hereby agree as follows:

1. DEFINITIONS AND INTERPRETATION

   1.1 In this Agreement, unless the context otherwise requires:
   
       "Act" means the Companies Act, 2013, including any statutory modifications or re-enactments thereof for the time being in force;
       
       "Board" means the board of directors of the Company;
       
       "Business" means [DESCRIPTION OF COMPANY'S BUSINESS];
       
       "Business Day" means a day (other than a Saturday or Sunday) on which banks are generally open for business in [CITY];
       
       "Director" means a director appointed to the Board of the Company;
       
       "Shares" means equity shares of the Company having a face value of Rs. [FACE VALUE]/- (Rupees [FACE VALUE IN WORDS] Only) each.
   
   1.2 [FURTHER INTERPRETATION CLAUSES]

2. BUSINESS OF THE COMPANY

   2.1 The Business of the Company shall be to [COMPANY'S BUSINESS OBJECTIVES].
   
   2.2 The Shareholders shall exercise their voting rights, and shall cause the Directors nominated by them to exercise their rights, in such manner so as to ensure that the Company carries on the Business in accordance with the provisions of this Agreement and the Articles of Association.

3. MANAGEMENT OF THE COMPANY

   3.1 Board Composition
   
       3.1.1 The Board shall consist of [NUMBER] Directors.
       
       3.1.2 The Shareholders shall have the right to nominate Directors as follows:
       
       [SHAREHOLDER 1 NAME]: [NUMBER] Directors
       [SHAREHOLDER 2 NAME]: [NUMBER] Directors
       [CONTINUE FOR ALL SHAREHOLDERS]
       
   3.2 Board Meetings
   
       3.2.1 The Board shall meet at least once every [TIME PERIOD, E.G., QUARTER].
       
       3.2.2 Written notice of at least [NUMBER] days shall be given to each Director for any Board meeting, provided that a shorter notice may be given with the consent of all the Directors.
       
       3.2.3 The quorum for Board meetings shall be [NUMBER] Directors, which must include at least one nominee of each Shareholder.

4. SHAREHOLDERS' MEETINGS

   4.1 The quorum for Shareholders' meetings shall be [NUMBER] Shareholders present in person or by proxy, which must include representatives of all Shareholders.
   
   4.2 Written notice of at least [NUMBER] days shall be given to each Shareholder for any Shareholders' meeting, provided that a shorter notice may be given with the consent of all the Shareholders.

5. TRANSFER OF SHARES

   5.1 Restrictions on Transfer
   
       5.1.1 No Shareholder shall Transfer any of its Shares except in accordance with the provisions of this Agreement and the Articles of Association.
       
   5.2 Right of First Refusal
   
       5.2.1 If any Shareholder (the "Selling Shareholder") proposes to Transfer any of its Shares to a third party, it shall first offer such Shares to the other Shareholders (the "Non-Selling Shareholders") in proportion to their existing shareholding.
       
       5.2.2 [DETAILS OF ROFR PROCESS]
   
   5.3 Tag-Along Rights
   
       5.3.1 [DETAILS OF TAG-ALONG RIGHTS]
   
   5.4 Drag-Along Rights
   
       5.4.1 [DETAILS OF DRAG-ALONG RIGHTS]

6. CONFIDENTIALITY

   6.1 Each Shareholder shall maintain the confidentiality of all information and documents relating to the Company which is of a confidential nature and shall not disclose such information to any third party without the prior written consent of the other Shareholders.

7. NON-COMPETE

   7.1 Each Shareholder agrees that, so long as it is a Shareholder and for a period of [NUMBER] years after ceasing to be a Shareholder, it shall not, directly or indirectly, engage in any business that competes with the Business of the Company.

8. TERM AND TERMINATION

   8.1 This Agreement shall come into effect on the date hereof and shall continue until the earlier of:
   
       8.1.1 The mutual written agreement of all Parties to terminate this Agreement;
       
       8.1.2 The listing of the Shares of the Company on a recognized stock exchange;
       
       8.1.3 Any one Shareholder becoming the owner of all the Shares of the Company.

9. GOVERNING LAW AND DISPUTE RESOLUTION

   9.1 This Agreement shall be governed by and construed in accordance with the laws of India.
   
   9.2 Any dispute arising out of or in connection with this Agreement shall be resolved through arbitration under the Arbitration and Conciliation Act, 1996.

10. MISCELLANEOUS

    10.1 Amendments
    
        This Agreement may be amended only by a written instrument executed by all Parties.
    
    10.2 Notices
    
        [NOTICE PROVISIONS]
    
    10.3 Entire Agreement
    
        This Agreement constitutes the entire agreement between the Parties with respect to the subject matter hereof.
    
    10.4 [OTHER MISCELLANEOUS CLAUSES]

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first above written.

FOR AND ON BEHALF OF THE COMPANY:

[SIGNATURE]
Name: [NAME]
Designation: [DESIGNATION]

FOR AND ON BEHALF OF THE SHAREHOLDERS:

[SHAREHOLDER 1 SIGNATURE]
Name: [SHAREHOLDER 1 NAME]

[SHAREHOLDER 2 SIGNATURE]
Name: [SHAREHOLDER 2 NAME]

[CONTINUE FOR ALL SHAREHOLDERS]

SCHEDULE I
DETAILS OF SHAREHOLDERS

[TABULAR FORMAT WITH COLUMNS FOR NAME, ADDRESS, NUMBER OF SHARES, PERCENTAGE OF SHAREHOLDING]`,
    category: TEMPLATE_CATEGORIES.CORPORATE,
    dateAdded: "2024-02-15",
    popularity: 98
  }
];
