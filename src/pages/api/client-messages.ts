
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { clientId, advocateId } = req.query;
    
    if (!clientId || !advocateId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Manual raw SQL query since we don't have ClientMessage in types.ts
    const { data, error } = await supabase.rpc('get_client_advocate_messages', {
      p_client_id: clientId as string,
      p_advocate_id: advocateId as string
    });

    if (error) throw error;
    
    return res.status(200).json(data || []);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: error.message });
  }
}
