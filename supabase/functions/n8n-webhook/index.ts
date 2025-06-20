
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data, type } = await req.json();
    
    console.log(`Sending ${type} data to n8n webhook:`, data);
    
    // Send data to n8n webhook
    const webhookResponse = await fetch('https://vakilgpt.app.n8n.cloud/webhook-test/d4b8347c-8bcc-4a93-89a9-5967e7684cdb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        data,
        timestamp: new Date().toISOString(),
        source: 'vakilgpt-billing-tracker'
      })
    });

    if (!webhookResponse.ok) {
      console.error('Failed to send data to n8n webhook:', webhookResponse.statusText);
      throw new Error(`Webhook failed: ${webhookResponse.statusText}`);
    }

    console.log('Successfully sent data to n8n webhook');

    return new Response(
      JSON.stringify({ success: true, message: 'Data sent to n8n webhook successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in n8n webhook function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
