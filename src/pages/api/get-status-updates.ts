
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { clientId } = req.query;
    
    if (!clientId) {
      return res.status(400).json({ error: 'Missing client ID' });
    }

    // Use the get_client_status_updates RPC function
    const { data, error } = await supabase.rpc('get_client_status_updates', {
      p_client_id: clientId as string
    });

    if (error) throw error;
    
    return res.status(200).json(data || []);
  } catch (error: any) {
    console.error('Error fetching status updates:', error);
    return res.status(500).json({ error: error.message });
  }
}
