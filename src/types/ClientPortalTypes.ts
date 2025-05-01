import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

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

// AI Analysis Types
export interface OutcomePrediction {
  likelihood: number;
  favorableOutcome: boolean;
  reasoning: string;
  keyFactors: string[];
  similarCases: Array<{
    name: string;
    citation: string;
    outcome: string;
    relevance: string;
  }>;
  alternativeStrategies: string[];
}

export interface ArgumentBuilder {
  mainArguments: Array<{
    title: string;
    description: string;
    strength: 'strong' | 'moderate' | 'weak';
    supportingLaws: string[];
    supportingCases: string[];
  }>;
  counterArguments: Array<{
    title: string;
    description: string;
    refutationStrategy: string;
  }>;
  statutoryReferences: string[];
  caseReferences: string[];
  constitutionalProvisions?: string[];
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

// Define literal types for valid function names to avoid "never" type errors
export type ClientPortalRPCFunctions = 
  | 'add_client_document'
  | 'add_client_message'
  | 'add_case_status_update'
  | 'get_client_documents'
  | 'get_client_status_updates'
  | 'get_client_advocate_messages'
  | 'mark_status_update_read'
  | 'mark_messages_read';

// Type for the parameter objects for each RPC function
export type ClientPortalRPCArgs<T extends ClientPortalRPCFunctions> = 
  T extends 'add_client_document' ? {
    p_name: string;
    p_size: number;
    p_type: string;
    p_path: string;
    p_client_id: string;
    p_notes?: string | null;
    p_case_id?: string | null;
    p_status: string;
    p_uploaded_by: string;
  } :
  T extends 'add_client_message' ? {
    p_content: string;
    p_sender_id: string;
    p_sender_name: string;
    p_receiver_id: string;
    p_is_read: boolean;
  } :
  T extends 'add_case_status_update' ? {
    p_client_id: string;
    p_case_id: string;
    p_case_title: string;
    p_status: string;
    p_message: string;
    p_is_read: boolean;
  } :
  T extends 'get_client_documents' ? {
    p_client_id: string;
  } :
  T extends 'get_client_status_updates' ? {
    p_client_id: string;
  } :
  T extends 'get_client_advocate_messages' ? {
    p_client_id: string;
    p_advocate_id: string;
  } :
  T extends 'mark_status_update_read' ? {
    p_update_id: string;
  } :
  T extends 'mark_messages_read' ? {
    p_message_ids: string[];
  } :
  never;

// Type for the return values of each RPC function
export type ClientPortalRPCReturns<T extends ClientPortalRPCFunctions> = 
  T extends 'add_client_document' ? { id: string; created_at: string } :
  T extends 'add_client_message' ? ClientMessage :
  T extends 'add_case_status_update' ? { id: string; created_at: string } :
  T extends 'get_client_documents' ? ClientDocument[] :
  T extends 'get_client_status_updates' ? StatusUpdate[] :
  T extends 'get_client_advocate_messages' ? ClientMessage[] :
  T extends 'mark_status_update_read' ? null :
  T extends 'mark_messages_read' ? null :
  never;

// Type-safe wrapper for Supabase RPC calls
export async function clientPortalRPC<T extends ClientPortalRPCFunctions>(
  functionName: T,
  params: ClientPortalRPCArgs<T>
): Promise<{ data: ClientPortalRPCReturns<T> | null; error: any }> {
  // Fix the type error by providing both type parameters to rpc
  const { data, error } = await supabase.rpc<ClientPortalRPCReturns<T>, ClientPortalRPCArgs<T>>(
    functionName,
    params as any
  );
  
  return { 
    data: data,
    error 
  };
}

// Utils function for document extraction
export function extractDocumentInfo(file: File): { name: string; type: string; size: number } {
  return {
    name: file.name,
    type: file.type,
    size: file.size
  };
}

declare global {
  interface Window {
    Stripe?: any;
  }
}
