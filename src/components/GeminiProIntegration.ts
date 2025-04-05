
// This file exports the API functions from GeminiProIntegration component
// to be used directly by other components

// Hardcoded API key
const GEMINI_API_KEY = "AIzaSyCpX8FmPojP3E4dDqsmi0EtRjDKXGh9SBc";

/**
 * Makes a request to the Gemini Pro API and returns the response text
 * @param prompt The text prompt to send to the API
 * @param apiKey Optional API key to override the default
 * @returns A Promise that resolves to the response text
 */
export const getGeminiResponse = async (prompt: string, apiKey?: string): Promise<string> => {
  try {
    // Use provided API key or fall back to hardcoded key
    const key = apiKey || GEMINI_API_KEY;
    
    // Make request to Gemini API using the hardcoded key
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 8192,
          topK: 40,
          topP: 0.95
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Error in Gemini API request:', error);
    throw error;
  }
};

/**
 * Generates an enhanced contract with detailed clauses specific to Indian law
 * @param contractType The type of contract to generate
 * @param parties Information about the parties involved
 * @param details Contract details including jurisdiction, purpose, terms
 * @returns A Promise that resolves to the generated contract text
 */
export const generateEnhancedIndianContract = async (
  contractType: string,
  parties: {
    partyA: string;
    partyAType: string;
    partyB: string;
    partyBType: string;
  },
  details: {
    jurisdiction: string;
    effectiveDate: string;
    purpose: string;
    keyTerms: string;
  }
): Promise<string> => {
  const { partyA, partyAType, partyB, partyBType } = parties;
  const { jurisdiction, effectiveDate, purpose, keyTerms } = details;
  
  const today = effectiveDate || new Date().toISOString().split('T')[0];
  const contractPurpose = purpose || "mutual business collaboration and benefit";
  
  const jurisdictionMap: Record<string, { state: string, courts: string }> = {
    "delhi": { state: "Delhi", courts: "Delhi High Court" },
    "mumbai": { state: "Maharashtra", courts: "Bombay High Court" },
    "bangalore": { state: "Karnataka", courts: "Karnataka High Court" },
    "chennai": { state: "Tamil Nadu", courts: "Madras High Court" },
    "kolkata": { state: "West Bengal", courts: "Calcutta High Court" },
    "hyderabad": { state: "Telangana", courts: "Telangana High Court" },
    "ahmedabad": { state: "Gujarat", courts: "Gujarat High Court" },
    "chandigarh": { state: "Punjab and Haryana", courts: "Punjab and Haryana High Court" },
    "guwahati": { state: "Assam", courts: "Gauhati High Court" }
  };
  
  const jurisdictionInfo = jurisdictionMap[jurisdiction] || { state: "Delhi", courts: "Delhi High Court" };
  
  const typeSpecificClauses: Record<string, string> = {
    "employment": `EMPLOYMENT TERMS:
1. Term of Employment: The Employee shall commence employment on ${today} and shall continue until terminated in accordance with this Agreement.
2. Probation Period: The Employee shall undergo a probation period of 90 days from the date of joining, during which either party may terminate this Agreement by giving 7 days' written notice.
3. Compensation: The Employer shall pay the Employee a gross salary as specified in Schedule A, payable monthly in arrears on or before the 7th day of each month by direct bank transfer.
4. Working Hours: Standard working hours shall be from 9:00 AM to 6:00 PM, Monday through Friday, with a 60-minute lunch break. The Employee may be required to work additional hours as necessary to fulfill their responsibilities.
5. Leave Entitlement: The Employee shall be entitled to paid leave as follows:
   a) Annual Leave: 24 days per annum
   b) Sick Leave: 12 days per annum
   c) Casual Leave: 6 days per annum
6. Intellectual Property: All inventions, discoveries, developments, writings, computer programs, or other material developed by the Employee during employment shall be the exclusive property of the Employer.`,

    "nda": `CONFIDENTIALITY OBLIGATIONS:
1. Definition of Confidential Information: "Confidential Information" means all non-public information disclosed by the Disclosing Party to the Receiving Party that (a) is designated as confidential, (b) is of a nature that a reasonable person would understand to be confidential, or (c) includes, but is not limited to, business plans, financial information, customer lists, technical data, product designs, software code, algorithms, marketing strategies, and trade secrets.
2. Exclusions: Confidential Information does not include information that (a) is or becomes generally available to the public other than as a result of disclosure by the Receiving Party, (b) was known to the Receiving Party prior to its disclosure by the Disclosing Party, (c) becomes known to the Receiving Party from a source other than the Disclosing Party who is not bound by a confidentiality obligation, or (d) is independently developed by the Receiving Party without reference to the Disclosing Party's Confidential Information.
3. Term of Confidentiality: The confidentiality obligations under this Agreement shall remain in effect for a period of five (5) years from the date of disclosure.
4. Return of Materials: Upon termination of this Agreement or at the Disclosing Party's request, the Receiving Party shall promptly return or destroy all documents and materials containing Confidential Information.`,

    "service": `SERVICE AGREEMENT SPECIFICS:
1. Scope of Services: The Service Provider shall provide the services ("Services") as described in Schedule A attached hereto and made an integral part of this Agreement.
2. Service Standards: The Service Provider warrants that the Services shall be performed (a) in a professional and workmanlike manner, (b) in accordance with industry standards, and (c) with the degree of skill, diligence, and prudence that would reasonably be expected from a skilled professional engaged in the provision of similar services.
3. Deliverables: The Service Provider shall deliver the work products ("Deliverables") in accordance with the timeline specified in Schedule B. Time shall be of the essence in the delivery of Services and Deliverables.
4. Acceptance Testing: Upon delivery of each Deliverable, the Client shall have a period of ten (10) business days to inspect and test the Deliverable for conformity with the specifications. If the Client identifies any non-conformities, the Service Provider shall remedy such non-conformities at no additional cost within a reasonable timeframe.
5. Change Management: Any changes to the scope of Services, Deliverables, timeline, or fees shall be documented in a written change order signed by both parties.`,

    "partnership": `PARTNERSHIP TERMS:
1. Formation and Name: The Partners hereby form a partnership under the name of "${partyA}-${partyB} Partnership" in accordance with the Indian Partnership Act, 1932.
2. Capital Contributions: The Partners shall contribute capital as specified in Schedule A. Additional capital contributions may be made by mutual agreement.
3. Profit and Loss Sharing: The profits and losses of the Partnership shall be shared between the Partners in proportion to their capital contributions unless specified otherwise in Schedule B.
4. Management and Authority: All Partners shall have equal rights in the management and conduct of the Partnership business. However, no Partner shall, without the consent of the other Partner(s): (a) borrow money on behalf of the Partnership, (b) purchase capital assets exceeding ₹50,000, (c) sell or encumber any Partnership property, or (d) bind the Partnership as a guarantor or surety.
5. Banking: All funds of the Partnership shall be deposited in a bank account in the name of the Partnership. Withdrawals shall require the signatures of all Partners or their authorized representatives.
6. Accounting Records: The Partnership shall maintain proper accounting records in accordance with Indian Accounting Standards. The books shall be kept at the principal place of business and shall be available for inspection by any Partner at any reasonable time.`,

    "licensing": `LICENSING PROVISIONS:
1. Grant of License: Licensor hereby grants to Licensee a non-exclusive, non-transferable, revocable license to use the intellectual property described in Schedule A ("Licensed Property") solely for the purposes described in Schedule B.
2. Territory: The license granted herein is valid only within the territory of India, unless specified otherwise in Schedule C.
3. Term: The license shall commence on the Effective Date and continue for a period of [INSERT DURATION], unless terminated earlier in accordance with this Agreement.
4. Royalties: Licensee shall pay to Licensor royalties calculated as [INSERT PERCENTAGE]% of Net Sales, payable quarterly within 30 days after the end of each calendar quarter.
5. Quality Control: Licensee shall maintain the quality of products or services incorporating the Licensed Property at a level at least equal to industry standards. Licensor shall have the right to inspect Licensee's facilities and products to ensure compliance.
6. Ownership: Licensee acknowledges that Licensor is the exclusive owner of all right, title, and interest in and to the Licensed Property. Licensee shall not contest or assist others in contesting Licensor's ownership.`,

    "rental": `RENTAL AGREEMENT TERMS:
1. Premises: The Landlord hereby leases to the Tenant the premises located at [INSERT ADDRESS] ("Premises") for the purpose of [INSERT PURPOSE].
2. Term: The lease shall commence on ${today} and continue for a period of [INSERT DURATION], unless terminated earlier in accordance with this Agreement.
3. Rent: The Tenant shall pay to the Landlord a monthly rent of ₹[INSERT AMOUNT], payable in advance on or before the 5th day of each month by electronic transfer to the Landlord's designated bank account.
4. Security Deposit: The Tenant has paid to the Landlord a security deposit of ₹[INSERT AMOUNT], which shall be refunded to the Tenant within 30 days after the termination of this Agreement, less any deductions for unpaid rent, damages beyond normal wear and tear, or other charges due under this Agreement.
5. Maintenance and Repairs: The Landlord shall be responsible for structural repairs and maintenance of common areas. The Tenant shall be responsible for routine maintenance and repairs necessary to keep the Premises in good condition.
6. Registration: This Agreement shall be registered with the appropriate Sub-Registrar of Assurances in accordance with the Registration Act, 1908.`,

    "sale": `SALE DEED SPECIFICS:
1. Property Description: The Seller hereby sells, transfers, and conveys to the Buyer the property described in Schedule A ("Property"), together with all improvements thereon and all rights, privileges, and appurtenances thereto.
2. Consideration: In consideration for the Property, the Buyer shall pay to the Seller the sum of ₹[INSERT AMOUNT] ("Purchase Price") as follows: [INSERT PAYMENT TERMS].
3. Title and Documents: The Seller warrants that the Seller has good and marketable title to the Property, free from all encumbrances except as disclosed in Schedule B. The Seller shall deliver to the Buyer all necessary documents for transfer of title in accordance with applicable laws.
4. Possession: Possession of the Property shall be delivered to the Buyer on [INSERT DATE], subject to completion of all payment obligations.
5. Expenses: The stamp duty, registration fees, and other expenses related to the execution and registration of this Sale Deed shall be borne by the Buyer.
6. Property Tax: All property taxes and other outgoings in respect of the Property accrued up to the date of possession shall be borne by the Seller. Thereafter, such taxes and outgoings shall be borne by the Buyer.`
  };
  
  // Common clauses for all contract types
  const commonClauses = `GENERAL TERMS AND CONDITIONS:

1. REPRESENTATIONS AND WARRANTIES:
   1.1 Authority: Each Party represents and warrants that it has full power and authority to enter into and perform this Agreement.
   1.2 Compliance with Law: Each Party shall comply with all applicable laws, regulations, and codes of practice in India, including but not limited to the Indian Contract Act, 1872.
   1.3 No Conflicts: The execution and delivery of this Agreement do not conflict with or result in a breach of any other agreement to which either Party is bound.

2. INDEMNIFICATION:
   2.1 Each Party ("Indemnifying Party") shall indemnify, defend, and hold harmless the other Party ("Indemnified Party") against any and all claims, damages, liabilities, costs, and expenses, including reasonable attorneys' fees, arising out of or in connection with:
       (a) Any breach of this Agreement by the Indemnifying Party;
       (b) Any negligent acts or omissions of the Indemnifying Party;
       (c) Any violation of applicable law by the Indemnifying Party.
   2.2 The Indemnified Party shall promptly notify the Indemnifying Party in writing of any claim and provide reasonable cooperation in the defense or settlement of such claim.
   2.3 The Indemnifying Party shall not settle any claim without the prior written consent of the Indemnified Party, which shall not be unreasonably withheld.

3. LIMITATION OF LIABILITY:
   3.1 EXCEPT FOR BREACHES OF CONFIDENTIALITY OBLIGATIONS OR INDEMNIFICATION OBLIGATIONS, NEITHER PARTY SHALL BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, LOSS OF BUSINESS, OR BUSINESS INTERRUPTION.
   3.2 IN NO EVENT SHALL EITHER PARTY'S TOTAL CUMULATIVE LIABILITY UNDER THIS AGREEMENT EXCEED THE TOTAL AMOUNT PAID OR PAYABLE BY ONE PARTY TO THE OTHER UNDER THIS AGREEMENT DURING THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.
   3.3 The limitations set forth in this Section shall apply even if a Party has been advised of the possibility of such damages and notwithstanding the failure of essential purpose of any limited remedy.

4. TERMINATION:
   4.1 Either Party may terminate this Agreement for cause upon thirty (30) days' written notice to the other Party of a material breach if such breach remains uncured at the expiration of such period.
   4.2 Either Party may terminate this Agreement without cause upon sixty (60) days' prior written notice to the other Party.
   4.3 Upon termination of this Agreement:
       (a) All rights granted under this Agreement shall immediately terminate;
       (b) Each Party shall return or destroy all Confidential Information of the other Party;
       (c) All outstanding payment obligations shall become immediately due and payable.
   4.4 The following provisions shall survive termination of this Agreement: Confidentiality, Intellectual Property, Indemnification, Limitation of Liability, and Dispute Resolution.

5. FORCE MAJEURE:
   5.1 Neither Party shall be liable for any failure or delay in performance under this Agreement due to circumstances beyond its reasonable control, including but not limited to acts of God, natural disasters, terrorism, riots, wars, pandemic, epidemic, or government restrictions ("Force Majeure Event").
   5.2 The Party affected by a Force Majeure Event shall promptly notify the other Party and shall use reasonable efforts to mitigate the effects of such Force Majeure Event.
   5.3 If a Force Majeure Event continues for more than ninety (90) consecutive days, either Party may terminate this Agreement upon written notice to the other Party.

6. NOTICES:
   6.1 All notices required or permitted under this Agreement shall be in writing and shall be delivered personally, by courier, by registered mail, or by email (with confirmation of receipt) to the addresses set forth below:
       To ${partyA}: [INSERT ADDRESS]
       To ${partyB}: [INSERT ADDRESS]
   6.2 Notices shall be deemed given: (a) when delivered, if personally delivered; (b) on the third business day after posting, if sent by registered mail; or (c) upon confirmation of receipt, if sent by email.

7. ASSIGNMENT:
   7.1 Neither Party may assign this Agreement or any rights or obligations hereunder without the prior written consent of the other Party, which shall not be unreasonably withheld.
   7.2 Any attempted assignment in violation of this Section shall be null and void.
   7.3 This Agreement shall be binding upon and inure to the benefit of the Parties and their respective successors and permitted assigns.

8. AMENDMENT AND WAIVER:
   8.1 No amendment, modification, or waiver of any provision of this Agreement shall be effective unless in writing and signed by both Parties.
   8.2 No failure or delay by either Party in exercising any right, power, or remedy under this Agreement shall operate as a waiver of such right, power, or remedy.

9. RELATIONSHIP OF PARTIES:
   9.1 The Parties are independent contractors, and nothing in this Agreement shall be construed to create a partnership, joint venture, agency, or employment relationship.
   9.2 Neither Party has the authority to bind the other or to incur any obligation on behalf of the other Party.

10. SEVERABILITY:
    10.1 If any provision of this Agreement is held to be invalid, illegal, or unenforceable, the validity, legality, and enforceability of the remaining provisions shall not in any way be affected or impaired.
    10.2 The Parties shall negotiate in good faith to replace any invalid, illegal, or unenforceable provision with a valid, legal, and enforceable provision that achieves the original intent and economic effect of this Agreement as closely as possible.

11. ENTIRE AGREEMENT:
    11.1 This Agreement, including all schedules and exhibits attached hereto, constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, understandings, negotiations, and discussions, whether oral or written.
    11.2 Each Party acknowledges that in entering into this Agreement, it has not relied on any representation, warranty, or undertaking not expressly incorporated herein.

12. COUNTERPARTS:
    12.1 This Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.
    12.2 Electronic signatures and signatures delivered by facsimile or email shall be deemed original signatures for all purposes under this Agreement.`;

  // Indian law specific clauses
  const indianLawClauses = `INDIA-SPECIFIC LEGAL PROVISIONS:

13. GOVERNING LAW:
    13.1 This Agreement shall be governed by and construed in accordance with the laws of India, specifically applicable in the state of ${jurisdictionInfo.state}, without regard to its conflict of law principles.
    13.2 The provisions of the Indian Contract Act, 1872, shall apply to all matters not specifically covered by this Agreement.
    
14. DISPUTE RESOLUTION:
    14.1 Amicable Resolution: The Parties shall attempt in good faith to resolve any dispute arising out of or relating to this Agreement through negotiation between executives who have authority to settle the dispute.
    14.2 Mediation: If the dispute cannot be settled within thirty (30) days through negotiation, the Parties agree to submit the dispute to mediation in accordance with the Mediation Rules of the Indian Institute of Arbitration and Mediation before resorting to arbitration or litigation.
    14.3 Arbitration: If the dispute remains unresolved forty-five (45) days after the appointment of a mediator, it shall be referred to and finally resolved by arbitration in accordance with the Arbitration and Conciliation Act, 1996, as amended from time to time.
    14.4 The arbitration shall be conducted by a sole arbitrator mutually appointed by the Parties. If the Parties cannot agree on an arbitrator within fifteen (15) days, the arbitrator shall be appointed by the ${jurisdictionInfo.courts}.
    14.5 The seat and venue of arbitration shall be ${jurisdictionInfo.state}, India. The language of arbitration shall be English.
    14.6 The award rendered by the arbitrator shall be final and binding upon the Parties and may be entered in any court having jurisdiction thereof.

15. STAMP DUTY AND REGISTRATION:
    15.1 This Agreement shall be subject to payment of appropriate stamp duty as per the Indian Stamp Act, 1899, as applicable in the state of ${jurisdictionInfo.state}.
    15.2 The Parties agree that this Agreement shall be registered with the appropriate authorities if required under applicable law.
    
16. TAXES AND COMPLIANCE:
    16.1 All payments under this Agreement shall be subject to applicable taxes under Indian law, including but not limited to Goods and Services Tax (GST).
    16.2 Each Party shall be responsible for its own tax compliance and shall provide appropriate documentation for tax purposes as required by Indian law.
    16.3 The Parties shall comply with all applicable provisions of the Income Tax Act, 1961, including withholding tax requirements where applicable.

17. INTELLECTUAL PROPERTY RIGHTS:
    17.1 All intellectual property rights shall be governed by the Indian Copyright Act, 1957, the Patents Act, 1970, the Trade Marks Act, 1999, and other applicable intellectual property laws of India.
    17.2 Nothing in this Agreement shall be construed as an implied license to use any Party's intellectual property rights except as expressly provided herein.
    
18. DATA PRIVACY AND PROTECTION:
    18.1 Each Party shall comply with all applicable data protection laws in India, including the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
    18.2 Neither Party shall disclose or transfer any personal data received from the other Party to any third party without the prior written consent of the data subject or as permitted by applicable law.

19. FOREIGN EXCHANGE REGULATIONS:
    19.1 All transactions involving foreign exchange under this Agreement shall comply with the Foreign Exchange Management Act, 1999 (FEMA) and the rules and regulations made thereunder.
    19.2 If either Party is a non-resident entity, all payments shall be made in accordance with the guidelines issued by the Reserve Bank of India from time to time.`;

  // Standard closing
  const closingClauses = `
IN WITNESS WHEREOF, the Parties hereto have executed this Agreement as of the Effective Date first above written.

FOR ${partyA.toUpperCase()} (${partyAType.toUpperCase()}):
_______________________________
Name: 
Title: 
Date: 

FOR ${partyB.toUpperCase()} (${partyBType.toUpperCase()}):
_______________________________
Name: 
Title: 
Date: 

WITNESSES:

1. _______________________________
Name:
Address:
Aadhaar No:

2. _______________________________
Name:
Address:
Aadhaar No:

SCHEDULES:
Schedule A: [Details of Services/Property/Rights/Contributions as applicable]
Schedule B: [Payment Terms/Timeline/Profit Sharing as applicable]
Schedule C: [Additional Terms if applicable]`;

  // Build the complete contract with specific clauses based on contract type
  const contractHeader = `THIS ${contractType.toUpperCase()} AGREEMENT ("Agreement") is made and entered into on this ${today} ("Effective Date"),

BETWEEN:

${partyA} ${partyAType === 'individual' ? `, an individual residing at [INSERT ADDRESS], with Aadhaar No. [INSERT AADHAAR NUMBER]` : `, a ${partyAType} organized and existing under the laws of India, having its registered office at [INSERT ADDRESS], with GST No. [INSERT GST NUMBER]`} (hereinafter referred to as "${partyAType === 'individual' ? 'First Party' : 'Company'}" or "${partyA.split(' ')[0]}"),

AND

${partyB} ${partyBType === 'individual' ? `, an individual residing at [INSERT ADDRESS], with Aadhaar No. [INSERT AADHAAR NUMBER]` : `, a ${partyBType} organized and existing under the laws of India, having its registered office at [INSERT ADDRESS], with GST No. [INSERT GST NUMBER]`} (hereinafter referred to as "${partyBType === 'individual' ? 'Second Party' : 'Company'}" or "${partyB.split(' ')[0]}").

(${partyA.split(' ')[0]} and ${partyB.split(' ')[0]} are hereinafter individually referred to as a "Party" and collectively as the "Parties").

WHEREAS:

A. ${purpose || `The Parties wish to enter into this Agreement for the purpose of ${contractPurpose}`};

B. ${keyTerms ? keyTerms : `The Parties have agreed upon certain terms and conditions that will govern their relationship;`}

C. The Parties wish to record the terms and conditions upon which they have agreed to proceed with the contemplated transaction.

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:`;

  // Construct full contract
  const specificClauses = typeSpecificClauses[contractType] || '';
  
  const fullContract = `${contractHeader}

${specificClauses}

${commonClauses}

${indianLawClauses}

${closingClauses}`;

  return fullContract;
};
