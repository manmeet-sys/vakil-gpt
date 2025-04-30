
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { updateId } = req.body;
    
    if (!updateId) {
      return res.status(400).json({ error: 'Missing update ID' });
    }

    // Update the status update to mark as read
    const { data, error } = await fetch('/api/mark-status-update-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updateId }),
    }).then(res => res.json());

    if (error) throw error;
    
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error marking status update as read:', error);
    return res.status(500).json({ error: error.message });
  }
}
