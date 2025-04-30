
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      content,
      sender_id,
      sender_name,
      receiver_id,
      is_read 
    } = req.body;

    // Use the add_client_message RPC function
    const { data, error } = await supabase.rpc('add_client_message', {
      p_content: content,
      p_sender_id: sender_id,
      p_sender_name: sender_name,
      p_receiver_id: receiver_id,
      p_is_read: is_read || false
    });

    if (error) throw error;
    
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: error.message });
  }
}
