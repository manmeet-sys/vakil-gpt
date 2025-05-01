
// Global types that were previously in ClientPortalTypes.ts

// Case related types
export interface Case {
  id: string;
  case_number: string;
  case_title: string;
  client_name: string;
  court_name: string;
  court_type: string;
  filing_type: string;
  status: string;
  jurisdiction: string;
  filing_date: string;
  hearing_date: string | null;
  description: string | null;
  opposing_party: string | null;
  documents: any;
  created_at: string;
  updated_at: string;
  client_id: string | null;
  user_id: string;
}

// Document related types
export interface ClientDocument {
  id: string;
  name: string;
  path: string;
  type: string;
  size: number;
  status: string;
  notes: string | null;
  created_at: string;
  client_id: string;
  case_id: string | null;
  uploaded_by: string;
}

// Message related types
export interface ClientMessage {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  receiver_id: string;
  is_read: boolean;
  created_at: string;
}

// AI Analysis related types
export interface OutcomePrediction {
  likelihood: number;
  favorableOutcome: boolean;
  reasoning: string;
  keyFactors: string[];
  similarCases: {
    name: string;
    citation: string;
    outcome: string;
    relevance: string;
  }[];
  alternativeStrategies: string[];
}

export interface ArgumentBuilder {
  mainArguments: {
    title: string;
    description: string;
    strength: string;
    supportingLaws: string[];
    supportingCases: string[];
  }[];
  counterArguments: {
    title: string;
    description: string;
    refutationStrategy: string;
  }[];
  statutoryReferences: string[];
  caseReferences: string[];
  constitutionalProvisions: string[];
}

// RPC Types
export type ClientPortalRPCFunctions = 
  | 'add_client_document'
  | 'get_client_advocate_messages'
  | 'add_client_message'
  | 'mark_messages_read';

export interface ClientPortalRPCArgs {
  add_client_document: {
    p_name: string;
    p_size: number;
    p_type: string;
    p_path: string;
    p_client_id: string;
    p_notes: string | null;
    p_case_id: string | null;
    p_status: string;
    p_uploaded_by: string;
  };
  get_client_advocate_messages: {
    p_client_id: string;
    p_advocate_id: string;
  };
  add_client_message: {
    p_content: string;
    p_sender_id: string;
    p_sender_name: string;
    p_receiver_id: string;
    p_is_read: boolean;
  };
  mark_messages_read: {
    p_message_ids: string[];
  };
}

export interface ClientPortalRPCReturns {
  add_client_document: ClientDocument;
  get_client_advocate_messages: ClientMessage[];
  add_client_message: ClientMessage;
  mark_messages_read: boolean;
}

export async function clientPortalRPC<T extends ClientPortalRPCFunctions>(
  functionName: T,
  args: ClientPortalRPCArgs[T]
): Promise<{ data: ClientPortalRPCReturns[T] | null; error: Error | null }> {
  try {
    // This is a placeholder implementation that would be replaced with a real implementation
    // For now, just return a mock success response
    return {
      data: null,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error
    };
  }
}
