/**
 * Utility functions for document formatting and handling
 */

/**
 * Converts document type string to human readable format
 * @param type The document type string
 * @returns Formatted document type string
 */
export const formatDocumentType = (type: string): string => {
  if (!type) return '';
  return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

/**
 * Formats a date string according to Indian legal document standards
 * @param date The date to format
 * @returns Formatted date string (e.g., "1st day of January, 2024")
 */
export const formatLegalDate = (date: Date = new Date()): string => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  
  // Add appropriate suffix to day number
  let dayStr;
  if (day > 3 && day < 21) dayStr = `${day}th`;
  else {
    switch (day % 10) {
      case 1: dayStr = `${day}st`; break;
      case 2: dayStr = `${day}nd`; break;
      case 3: dayStr = `${day}rd`; break;
      default: dayStr = `${day}th`;
    }
  }
  
  return `${dayStr} day of ${month}, ${year}`;
};

/**
 * Formats an amount in words per Indian legal document standards
 * @param amount The amount in figures
 * @returns The amount in words (e.g., "Rupees Ten Thousand Only")
 */
export const formatAmountInWords = (amount: number): string => {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const inWords = (num: number): string => {
    if (num === 0) return '';
    
    if (num < 10) return units[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '');
    if (num < 1000) return units[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' and ' + inWords(num % 100) : '');
    if (num < 100000) return inWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + inWords(num % 1000) : '');
    if (num < 10000000) return inWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + inWords(num % 100000) : '');
    return inWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 !== 0 ? ' ' + inWords(num % 10000000) : '');
  };
  
  return `Rupees ${inWords(amount)} Only`;
};

/**
 * Gets the appropriate court/venue name based on jurisdiction and venue codes
 * @param jurisdictionCode The jurisdiction code
 * @param venueCode Optional specific venue code
 * @returns Properly formatted court/venue name
 */
export const getCourtVenueName = (jurisdictionCode: string, venueCode?: string): string => {
  if (!jurisdictionCode) return 'THE APPROPRIATE COURT';
  
  const jurisdictionMap: Record<string, string> = {
    'supreme_court': 'THE HON\'BLE SUPREME COURT OF INDIA',
    'delhi_hc': 'THE HON\'BLE HIGH COURT OF DELHI AT NEW DELHI',
    'bombay_hc': 'THE HON\'BLE HIGH COURT OF JUDICATURE AT BOMBAY',
    'calcutta_hc': 'THE HON\'BLE HIGH COURT AT CALCUTTA',
    'madras_hc': 'THE HON\'BLE HIGH COURT OF JUDICATURE AT MADRAS',
    'allahabad_hc': 'THE HON\'BLE HIGH COURT OF JUDICATURE AT ALLAHABAD',
    'karnataka_hc': 'THE HON\'BLE HIGH COURT OF KARNATAKA',
    'district_court': 'THE COURT OF DISTRICT JUDGE',
    'consumer_forum': 'THE DISTRICT CONSUMER DISPUTES REDRESSAL FORUM',
    'ncdrc': 'THE NATIONAL CONSUMER DISPUTES REDRESSAL COMMISSION, NEW DELHI',
    'family_court': 'THE FAMILY COURT',
    'all_india': 'THE APPROPRIATE COURT'
  };
  
  if (venueCode) {
    const venueMap: Record<string, string> = {
      'delhi_district': 'THE DISTRICT COURT, DELHI',
      'mumbai_city_civil': 'THE CITY CIVIL COURT, MUMBAI',
      'bangalore_city_civil': 'THE CITY CIVIL COURT, BANGALORE',
      'chennai_city_civil': 'THE CITY CIVIL COURT, CHENNAI',
      'hyderabad_city_civil': 'THE CITY CIVIL COURT, HYDERABAD',
      'ahmedabad_city_civil': 'THE CITY CIVIL COURT, AHMEDABAD',
      'delhi_consumer': 'THE STATE CONSUMER DISPUTES REDRESSAL COMMISSION, DELHI',
      'maharashtra_consumer': 'THE STATE CONSUMER DISPUTES REDRESSAL COMMISSION, MAHARASHTRA'
    };
    
    return venueMap[venueCode] || jurisdictionMap[jurisdictionCode];
  }
  
  return jurisdictionMap[jurisdictionCode] || 'THE APPROPRIATE COURT';
};

/**
 * Generates a standardized citation for Indian legal case
 * @param caseName The name of the case
 * @param year The year of the judgment
 * @param reporter The reporter abbreviation (e.g., 'SC', 'SCC')
 * @param volume The volume number
 * @param page The page number
 * @returns Properly formatted case citation
 */
export const formatCaseCitation = (
  caseName: string,
  year: number,
  reporter: string,
  volume?: number,
  page?: number
): string => {
  let citation = `${caseName} (${year})`;
  
  if (volume) {
    citation += ` ${volume}`;
  }
  
  citation += ` ${reporter}`;
  
  if (page) {
    citation += ` ${page}`;
  }
  
  return citation;
};

/**
 * Generates a citation for an Indian statute
 * @param actName Name of the act
 * @param year Year of enactment
 * @param number Act number
 * @returns Formatted statute citation
 */
export const formatStatuteCitation = (
  actName: string,
  year: number,
  number?: number
): string => {
  if (number) {
    return `${actName}, ${year} (Act ${number} of ${year})`;
  }
  
  return `${actName}, ${year}`;
};

/**
 * Checks if a document is complete and has all required sections based on its type
 * @param content The document content
 * @param type The document type
 * @returns Object indicating completeness and missing sections
 */
export const checkDocumentCompleteness = (
  content: string,
  type: string
): { isComplete: boolean; missingSections: string[] } => {
  const missingSections: string[] = [];
  
  // Base requirements for all documents
  if (!content.includes('BEFORE') && !content.includes('IN THE') && type !== 'legal_notice') {
    missingSections.push('Court/Authority Header');
  }
  
  // Type-specific checks
  switch (type) {
    case 'affidavit':
      if (!content.includes('VERIFICATION')) missingSections.push('Verification Clause');
      if (!content.includes('DEPONENT')) missingSections.push('Deponent Signature');
      break;
      
    case 'pil':
    case 'writ_petition':
      if (!content.includes('PRAYER')) missingSections.push('Prayer Clause');
      if (!content.includes('PETITIONER') && !content.includes('THROUGH COUNSEL')) {
        missingSections.push('Petitioner/Counsel Signature');
      }
      break;
      
    case 'legal_notice':
      if (!content.includes('Subject:')) missingSections.push('Subject Line');
      if (!content.includes('Yours faithfully') && !content.includes('Yours sincerely')) {
        missingSections.push('Closing/Signature');
      }
      if (!content.includes('ADVOCATE')) missingSections.push('Advocate Details');
      break;
      
    case 'vakalatnama':
      if (!content.includes('ACCEPTED')) missingSections.push('Acceptance by Advocate');
      if (!content.includes('ENROLLMENT')) missingSections.push('Enrollment Number');
      break;
  }
  
  return {
    isComplete: missingSections.length === 0,
    missingSections
  };
};

/**
 * Validates a court case number format
 * @param caseNumber The case number to validate
 * @param courtType The type of court
 * @returns Boolean indicating if the format is valid
 */
export const isValidCaseNumber = (
  caseNumber: string,
  courtType: 'supreme_court' | 'high_court' | 'district_court' | 'other'
): boolean => {
  switch (courtType) {
    case 'supreme_court':
      // Format: C.A. No. 001234 of 2023 (Civil Appeal) or similar
      return /^[A-Z]\.?[A-Z]\.?\s+No\.\s+\d+\s+of\s+\d{4}$/i.test(caseNumber);
      
    case 'high_court':
      // Format: W.P.(C) 1234/2023 (Writ Petition Civil) or similar
      return /^[A-Z]\.?[A-Z]\.?\(?[A-Z]\)?\s+\d+\/\d{4}$/i.test(caseNumber);
      
    case 'district_court':
      // Format: CC 123/2023 (Criminal Case) or similar
      return /^[A-Z]+\s+\d+\/\d{4}$/i.test(caseNumber);
      
    default:
      // More lenient check for other courts
      return /\d+.+\d{4}/.test(caseNumber);
  }
};

/**
 * Creates a document structure based on a natural language prompt
 * @param prompt The natural language prompt describing the document needs
 * @returns Object with document structure and metadata
 */
export const createDocumentFromPrompt = (prompt: string): {
  title: string;
  type: string;
  parties?: string;
  jurisdiction?: string;
  content: string;
} => {
  // This is a placeholder function - in real implementation, this would use AI
  // For now, we'll implement a very basic keyword extraction
  
  const lowerPrompt = prompt.toLowerCase();
  let documentType = 'other';
  let title = '';
  let parties = '';
  let jurisdiction = '';
  let content = '';
  
  // Determine document type
  if (lowerPrompt.includes('affidavit')) {
    documentType = 'affidavit';
    title = 'Affidavit';
  } else if (lowerPrompt.includes('pil') || lowerPrompt.includes('public interest')) {
    documentType = 'pil';
    title = 'Public Interest Litigation';
  } else if (lowerPrompt.includes('writ') && lowerPrompt.includes('petition')) {
    documentType = 'writ_petition';
    title = 'Writ Petition';
  } else if (lowerPrompt.includes('notice') && (lowerPrompt.includes('legal') || lowerPrompt.includes('law'))) {
    documentType = 'legal_notice';
    title = 'Legal Notice';
  } else if (lowerPrompt.includes('vakalatnama')) {
    documentType = 'vakalatnama';
    title = 'Vakalatnama';
  } else {
    title = 'Legal Document';
  }
  
  // Extract jurisdiction
  if (lowerPrompt.includes('supreme court') || lowerPrompt.includes('supreme')) {
    jurisdiction = 'supreme_court';
  } else if (lowerPrompt.includes('delhi high') || lowerPrompt.includes('high court of delhi')) {
    jurisdiction = 'delhi_hc';
  } else if (lowerPrompt.includes('bombay high') || lowerPrompt.includes('high court of bombay')) {
    jurisdiction = 'bombay_hc';
  }
  
  // Extract parties (crude approximation)
  if (lowerPrompt.includes('versus') || lowerPrompt.includes(' vs ') || lowerPrompt.includes(' v. ')) {
    const vsIndex = Math.max(
      lowerPrompt.indexOf('versus'),
      lowerPrompt.indexOf(' vs '),
      lowerPrompt.indexOf(' v. ')
    );
    
    if (vsIndex > 0) {
      const beforeVs = prompt.substring(0, vsIndex).trim();
      const afterVs = prompt.substring(vsIndex + 2).trim();
      const lastNameBeforeVs = beforeVs.split(' ').slice(-2).join(' ');
      const firstNameAfterVs = afterVs.split(' ').slice(0, 2).join(' ');
      parties = `${lastNameBeforeVs} vs ${firstNameAfterVs}`;
    }
  }
  
  // Generate placeholder content based on document type
  const currentDate = formatLegalDate();
  switch (documentType) {
    case 'affidavit':
      content = `BEFORE ${getCourtVenueName(jurisdiction)}\n\nAFFIDAVIT\n\nI, [NAME], son/daughter of [FATHER'S NAME], aged [AGE] years, resident of [ADDRESS], do hereby solemnly affirm and declare as follows:\n\n1. That I am the [DESIGNATION] in the above matter and am well conversant with the facts and circumstances of the case.\n\n2. [CONTENT BASED ON PROMPT]\n\n3. That the contents of this affidavit are true and correct to the best of my knowledge and belief. Nothing material has been concealed therefrom.\n\nVERIFICATION:\nVerified at [PLACE] on this ${currentDate} that the contents of the above affidavit are true and correct to my knowledge and belief and nothing material has been concealed therefrom.\n\nDEPONENT`;
      break;
    // ... other document types
    default:
      content = `[This document will be generated based on your prompt: "${prompt}"]\n\nDate: ${currentDate}`;
  }
  
  return {
    title,
    type: documentType,
    parties,
    jurisdiction,
    content
  };
};

/**
 * Extracts structured information from a legal document
 * @param content The document content to analyze
 * @returns Object with extracted information
 */
export const extractDocumentInfo = (content: string): {
  court?: string;
  parties?: string;
  caseNumber?: string;
  filingDate?: string;
  keyPoints: string[];
} => {
  const lines = content.split('\n').map(line => line.trim());
  const result: {
    court?: string;
    parties?: string;
    caseNumber?: string;
    filingDate?: string;
    keyPoints: string[];
  } = {
    keyPoints: []
  };
  
  // Extract court name
  const courtLineIndex = lines.findIndex(line => 
    line.includes('COURT') || line.includes('TRIBUNAL') || line.includes('COMMISSION') || 
    line.includes('FORUM') || line.startsWith('IN THE') || line.startsWith('BEFORE')
  );
  
  if (courtLineIndex >= 0) {
    result.court = lines[courtLineIndex];
  }
  
  // Extract case number
  const caseNoLineIndex = lines.findIndex(line => 
    (line.includes('NO.') || line.includes('NUMBER')) && 
    (line.includes('/') || /\d{4}/.test(line))
  );
  
  if (caseNoLineIndex >= 0) {
    result.caseNumber = lines[caseNoLineIndex];
  }
  
  // Extract parties
  const partiesLineIndex = lines.findIndex(line => 
    (line.includes('VERSUS') || line.includes(' VS ') || line.includes(' V. ')) ||
    (lines.indexOf('PETITIONER') >= 0 && lines.indexOf('RESPONDENT') >= 0)
  );
  
  if (partiesLineIndex >= 0) {
    result.parties = lines[partiesLineIndex];
  }
  
  // Extract filing date - look for date formats
  const dateLineIndex = lines.findIndex(line => 
    line.includes('DATED') || line.includes('DATED:') || 
    /\d{1,2}(st|nd|rd|th)\s+day\s+of\s+\w+,\s+\d{4}/.test(line)
  );
  
  if (dateLineIndex >= 0) {
    result.filingDate = lines[dateLineIndex];
  }
  
  // Extract key points - look for numbered paragraphs
  const numberedLines = lines.filter(line => /^\d+\./.test(line));
  result.keyPoints = numberedLines.slice(0, 5); // Get first 5 numbered paragraphs
  
  return result;
};
