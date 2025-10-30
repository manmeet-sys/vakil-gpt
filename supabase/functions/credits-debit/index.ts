import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DebitRequest {
  amount: number;
  toolName: string;
  meta?: any;
  idempotencyKey?: string;
}

interface DebitResult {
  ok: boolean;
  new_balance: number;
  tx_id: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supaAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    );

    // Verify JWT and get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with user's JWT for proper auth verification
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        auth: { persistSession: false },
        global: { headers: { Authorization: authHeader } }
      }
    );

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = user.id;

    // Parse request body
    const { amount, toolName, meta = {}, idempotencyKey }: DebitRequest = await req.json();

    if (!amount || !toolName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: amount, toolName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Attempt to debit credits
    const { data: debitData, error: debitError } = await supaAdmin.rpc('debit_tool_credits', {
      p_user: userId,
      p_amount: amount,
      p_tool_name: toolName,
      p_meta: meta,
      p_idempotency_key: idempotencyKey ?? null
    });

    if (debitError) {
      console.error('Debit error:', debitError);
      return new Response(
        JSON.stringify({ error: 'Failed to debit credits' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const debitResult: DebitResult = debitData?.[0];

    if (!debitResult?.ok) {
      return new Response(
        JSON.stringify({ error: 'INSUFFICIENT_FUNDS' }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log usage
    const { error: logError } = await supaAdmin
      .from('tool_usage')
      .insert({
        user_id: userId,
        tool_name: toolName,
        credits_charged: amount,
        meta
      });

    if (logError) {
      console.error('Usage logging error:', logError);
      // Don't fail the request if logging fails
    }

    return new Response(
      JSON.stringify({
        balance: debitResult.new_balance,
        tx_id: debitResult.tx_id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});