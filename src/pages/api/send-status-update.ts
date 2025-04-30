
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { client_id, case_id, case_title, status, message, is_read } = req.body;

    // Manual query to insert into case_status_updates table
    const { data, error } = await supabase.rpc('add_case_status_update', {
      p_client_id: client_id,
      p_case_id: case_id,
      p_case_title: case_title,
      p_status: status,
      p_message: message,
      p_is_read: is_read
    });

    if (error) throw error;
    
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error sending status update:', error);
    return res.status(500).json({ error: error.message });
  }
}
