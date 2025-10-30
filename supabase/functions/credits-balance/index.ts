import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Get user balance from wallets table
    const { data: walletData, error: walletError } = await supaAdmin
      .from('wallets')
      .select('current_credits')
      .eq('user_id', userId)
      .single();

    if (walletError && walletError.code !== 'PGRST116') {
      console.error('Wallet error:', walletError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch wallet' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create wallet if it doesn't exist
    if (!walletData) {
      const { data: newWallet, error: createError } = await supaAdmin
        .from('wallets')
        .insert({ user_id: userId, current_credits: 200 })
        .select('current_credits')
        .single();
      
      if (createError) {
        console.error('Create wallet error:', createError);
        return new Response(
          JSON.stringify({ error: 'Failed to create wallet' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          tool_credits: newWallet.current_credits,
          free_chat_quota: 10,
          free_chat_used: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        tool_credits: walletData.current_credits,
        free_chat_quota: 10,
        free_chat_used: 0
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