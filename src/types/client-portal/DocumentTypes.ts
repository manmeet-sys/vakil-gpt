
// Define types for document-related entities
export interface ClientDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  client_id: string;
  case_id?: string | null;
  notes?: string | null;
  status: 'shared' | 'pending_review' | 'approved' | 'rejected';
  uploaded_by?: string | null;
  created_at: string;
  updated_at?: string | null;
}

// Extended document info type for legal document formatting
export interface DocumentInfo {
  name: string;
  type: string;
  size: number;
  court?: string;
  caseNumber?: string;
  parties?: string;
}

// Utils function for document extraction
export function extractDocumentInfo(file: File): { name: string; type: string; size: number } {
  return {
    name: file.name,
    type: file.type,
    size: file.size
  };
}
