import { createClient } from '@supabase/supabase-js';

// Note: This utility is designed for edge functions where Deno is available
// For client-side usage, use the regular supabase client from @/integrations/supabase/client

export interface UserBalance {
  tool_credits: number;
  free_chat_quota: number;
  free_chat_used: number;
}

export interface DebitResult {
  ok: boolean;
  new_balance: number;
  tx_id: string;
}

export interface CreditResult {
  new_balance: number;
}

export interface FreeChatResult {
  ok: boolean;
  remaining: number;
}

// These functions are designed for use in edge functions where supaAdmin is available
// For client-side usage, use the useCredits hook instead

export function getUserIdFromRequest(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  
  // Extract user ID from Supabase JWT token
  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  } catch {
    return null;
  }
}