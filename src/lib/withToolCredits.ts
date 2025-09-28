import { nanoid } from 'nanoid';
import { useCredits } from '@/hooks/useCredits';

export async function withToolCredits(
  toolName: string, 
  cost: number, 
  run: () => Promise<any>, 
  meta: any = {}
) {
  const idempotencyKey = `${toolName}:${nanoid()}`;
  
  const response = await fetch('/supabase/functions/v1/credits-debit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(await (await import('@/integrations/supabase/client')).supabase.auth.getSession()).data.session?.access_token}`
    },
    body: JSON.stringify({ 
      amount: cost, 
      toolName, 
      meta, 
      idempotencyKey 
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    if (error.message?.includes('INSUFFICIENT_FUNDS')) {
      throw new Error('INSUFFICIENT_FUNDS');
    }
    throw new Error('DEBIT_FAILED');
  }
  
  try {
    return await run();
  } catch (e) {
    // Optional: implement automatic refund RPC if run() fails hard
    throw e;
  }
}

// Credit costs for different tools
export const TOOL_COSTS = {
  hybrid_retrieval: 3,
  rerank_only: 1,
  pdf_ingest: 2, // per 10 pages
  case_download: 1,
  summarize_pdf: 2,
} as const;