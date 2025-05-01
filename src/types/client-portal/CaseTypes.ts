
import { Database } from "@/integrations/supabase/types";

// Define the Case type that matches what's used in case-management
export interface Case {
  id: string;
  case_title?: string;
  case_number?: string;
  client_id?: string;
  client_name?: string;
  court_name?: string;
  court_type?: string;
  jurisdiction?: string;
  status?: string;
  filing_type?: string;
  description?: string;
  opposing_party?: string;
  filing_date?: string;
  hearing_date?: string | null;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  documents?: any; // Added to align with case-management definition
}
