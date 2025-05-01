
/**
 * Utility functions for handling documents
 */

/**
 * Helper function to download a file from a URL
 * @param url The URL of the file to download
 * @param filename The name to save the file as
 */
export const downloadFile = (url: string, filename: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Extracts document information from document content
 * @param content The document content to analyze
 * @returns An object containing extracted information
 */
export const extractDocumentInfo = (content: string) => {
  const result = {
    court: '',
    caseNumber: '',
    parties: '',
    date: ''
  };
  
  // Try to identify court information (usually at the top)
  const courtRegex = /IN THE\s+(.*?COURT.*?)(?:\r?\n|$)/i;
  const courtMatch = content.match(courtRegex);
  if (courtMatch) {
    result.court = courtMatch[1].trim();
  }
  
  // Try to identify case number
  const caseNumberRegex = /(?:CASE|FILE|MATTER)\s+(?:NO|NUMBER)[.:]\s*([A-Z0-9\s\-\/]+)(?:\r?\n|$)/i;
  const caseNumberMatch = content.match(caseNumberRegex);
  if (caseNumberMatch) {
    result.caseNumber = caseNumberMatch[1].trim();
  }
  
  // Try to identify parties (often in format "X versus Y" or "X vs Y")
  const partiesRegex = /(?:\r?\n)(.*?)\s+(?:VERSUS|VS\.|V\/S|V\.|AGAINST)\s+(.*?)(?:\r?\n|$)/i;
  const partiesMatch = content.match(partiesRegex);
  if (partiesMatch) {
    result.parties = `${partiesMatch[1].trim()} vs. ${partiesMatch[2].trim()}`;
  }
  
  // Try to extract date
  const dateRegex = /DATED(?:\s+THIS)?\s+(?:THE\s+)?(\d+(?:ST|ND|RD|TH)?\s+(?:DAY\s+)?OF\s+[A-Z]+,?\s+\d{4})/i;
  const dateMatch = content.match(dateRegex);
  if (dateMatch) {
    result.date = dateMatch[1].trim();
  }
  
  return result;
};
