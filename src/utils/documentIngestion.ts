// Utility functions for document processing and tokenization

/**
 * Simple tokenizer that approximates tiktoken for OpenAI models
 * Uses rough estimation: 1 token ≈ 0.75 words
 */
export function tokenize(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  
  // Split by whitespace and filter out empty strings
  const words = text.split(/\s+/).filter(word => word.length > 0);
  
  // Rough approximation: 1 token ≈ 0.75 words
  return Math.ceil(words.length * 0.75);
}

/**
 * Chunk text into overlapping segments for embedding
 */
export function chunkText(
  text: string, 
  chunkSize: number = 1200, 
  overlap: number = 180
): string[] {
  if (!text || typeof text !== 'string') return [];
  
  const chunks: string[] = [];
  
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    const chunk = text.slice(i, i + chunkSize).trim();
    
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
  }
  
  return chunks;
}

/**
 * Extract metadata from legal document text
 */
export function extractLegalMetadata(text: string): {
  court?: string;
  caseNumber?: string;
  parties?: string;
  date?: string;
  provisions?: string[];
} {
  const metadata: any = {};
  
  // Extract court name
  const courtMatch = text.match(/IN THE ([A-Z\s]+COURT[A-Z\s]*)/i);
  if (courtMatch && courtMatch[1]) {
    metadata.court = courtMatch[1].trim();
  }
  
  // Extract case number
  const caseNumberMatch = text.match(/(Case|Petition|Appeal|Civil Appeal)(\s+No\.?:?\s*)([A-Z0-9\-./]+)/i);
  if (caseNumberMatch && caseNumberMatch[3]) {
    metadata.caseNumber = caseNumberMatch[3].trim();
  }
  
  // Extract parties
  const partiesMatch = text.match(/(.*?)\s+[Vv][Ss]\.?\s+(.*?)(?:\n|$)/);
  if (partiesMatch && partiesMatch[1] && partiesMatch[2]) {
    metadata.parties = `${partiesMatch[1].trim()} vs. ${partiesMatch[2].trim()}`;
  }
  
  // Extract date
  const dateMatch = text.match(/(?:decided|dated|judgment).*?(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i);
  if (dateMatch && dateMatch[1]) {
    metadata.date = dateMatch[1];
  }
  
  // Extract legal provisions (basic patterns)
  const provisionPatterns = [
    /Section\s+(\d+[A-Z]*)/gi,
    /Article\s+(\d+[A-Z]*)/gi,
    /Rule\s+(\d+[A-Z]*)/gi,
    /(CrPC|IPC|CPC)\s+(\d+)/gi
  ];
  
  const provisions: string[] = [];
  for (const pattern of provisionPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        provisions.push(`Section ${match[1]}`);
      } else if (match[2]) {
        provisions.push(`${match[1]} ${match[2]}`);
      }
    }
  }
  
  if (provisions.length > 0) {
    metadata.provisions = [...new Set(provisions)]; // Remove duplicates
  }
  
  return metadata;
}

/**
 * Determine document type based on content
 */
export function classifyDocumentType(text: string): string {
  const content = text.toLowerCase();
  
  if (content.includes('supreme court')) return 'Supreme Court';
  if (content.includes('high court')) return 'High Court';
  if (content.includes('district court')) return 'District Court';
  if (content.includes('family court')) return 'Family Court';
  if (content.includes('tribunal')) return 'Tribunal';
  if (content.includes('magistrate')) return 'Magistrate';
  
  return 'Other';
}

/**
 * Validate document metadata
 */
export function validateDocumentMeta(meta: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (meta.provisions && !Array.isArray(meta.provisions)) {
    errors.push('Provisions must be an array');
  }
  
  if (meta.date && typeof meta.date === 'string') {
    const dateObj = new Date(meta.date);
    if (isNaN(dateObj.getTime())) {
      errors.push('Invalid date format');
    }
  }
  
  if (meta.primary !== undefined && typeof meta.primary !== 'boolean') {
    errors.push('Primary flag must be boolean');
  }
  
  const validPostures = ['husband_from_wife', 'wife_from_husband', 'child_from_parent', 'other'];
  if (meta.posture && !validPostures.includes(meta.posture)) {
    errors.push(`Invalid posture. Must be one of: ${validPostures.join(', ')}`);
  }
  
  const validHoldings = ['supports', 'contradicts', 'neutral'];
  if (meta.holding_direction && !validHoldings.includes(meta.holding_direction)) {
    errors.push(`Invalid holding direction. Must be one of: ${validHoldings.join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}