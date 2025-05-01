
/**
 * Utility functions for document handling
 */

// Helper to download a file from a URL
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object after download
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};

// Extract basic info from a document file
export const extractDocumentInfo = (file: File): { name: string; type: string; size: number } => {
  return {
    name: file.name,
    type: file.type,
    size: file.size
  };
};

// Enhanced document info extraction for legal documents
// This processes the content of the document to extract court, case number, and parties
export const extractLegalDocumentInfo = (content: string): { 
  court?: string;
  caseNumber?: string;
  parties?: string;
} => {
  // Initialize result object
  const result: { court?: string; caseNumber?: string; parties?: string } = {};
  
  // Look for court information
  const courtRegex = /IN THE ([A-Z\s]+COURT[A-Z\s]*)/i;
  const courtMatch = content.match(courtRegex);
  if (courtMatch && courtMatch[1]) {
    result.court = courtMatch[1].trim();
  }
  
  // Look for case number
  const caseNumberRegex = /(Case|Petition|Appeal)(\s+No\.?:?\s*)([A-Z0-9-./]+)/i;
  const caseNumberMatch = content.match(caseNumberRegex);
  if (caseNumberMatch && caseNumberMatch[3]) {
    result.caseNumber = caseNumberMatch[3].trim();
  }
  
  // Look for parties
  const partiesRegex = /(.*?)\s+\.{3,}\s+Petitioner|Plaintiff[\s\S]*?(?:versus|vs\.?|v\.?)[\s\S]*?(.*?)\s+\.{3,}\s+Respondent|Defendant/i;
  const partiesMatch = content.match(partiesRegex);
  if (partiesMatch) {
    if (partiesMatch[1] && partiesMatch[2]) {
      result.parties = `${partiesMatch[1].trim()} vs. ${partiesMatch[2].trim()}`;
    }
  }
  
  return result;
};
