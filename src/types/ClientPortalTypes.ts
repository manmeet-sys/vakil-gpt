
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
}

// Define types for the new tables
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

export interface StatusUpdate {
  id: string;
  client_id: string;
  case_id: string;
  case_title: string;
  status: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ClientMessage {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  receiver_id: string;
  is_read: boolean;
  created_at: string;
}

// Custom Types for RPC functions
export type ClientPortalRPC = Database['public']['Functions'] & {
  add_client_document: {
    Args: {
      p_name: string;
      p_size: number;
      p_type: string;
      p_path: string;
      p_client_id: string;
      p_notes?: string | null;
      p_case_id?: string | null;
      p_status: string;
      p_uploaded_by: string;
    };
    Returns: { id: string; created_at: string };
  };
  add_case_status_update: {
    Args: {
      p_client_id: string;
      p_case_id: string;
      p_case_title: string;
      p_status: string;
      p_message: string;
      p_is_read: boolean;
    };
    Returns: { id: string; created_at: string };
  };
}
