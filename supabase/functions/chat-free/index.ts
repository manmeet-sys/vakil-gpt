import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FreeChatResult {
  ok: boolean;
  remaining: number;
}

interface UserBalance {
  tool_credits: number;
  free_chat_quota: number;
  free_chat_used: number;
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

    // Attempt to consume free chat
    const { data: freeChatData, error: freeChatError } = await supaAdmin.rpc('consume_free_chat', {
      p_user: userId
    });

    if (freeChatError) {
      console.error('Free chat consumption error:', freeChatError);
      return new Response(
        JSON.stringify({ error: 'Failed to consume free chat' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const freeChatResult: FreeChatResult = freeChatData?.[0];

    if (!freeChatResult?.ok) {
      // Free chat quota exhausted, get current balance
      const { data: balanceData, error: balanceError } = await supaAdmin
        .from('user_profiles')
        .select('tool_credits, free_chat_quota, free_chat_used')
        .eq('user_id', userId)
        .single();

      const balance: UserBalance = balanceData || { tool_credits: 0, free_chat_quota: 0, free_chat_used: 0 };

      return new Response(
        JSON.stringify({
          ok: false,
          remaining: 0,
          credits: balance.tool_credits
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        remaining: freeChatResult.remaining
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