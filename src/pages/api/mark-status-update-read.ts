
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { updateId } = req.body;
    
    // Use the mark_status_update_read RPC function
    const { data, error } = await supabase.rpc('mark_status_update_read', {
      p_update_id: updateId
    });

    if (error) throw error;
    
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error marking status update as read:', error);
    return res.status(500).json({ error: error.message });
  }
}
