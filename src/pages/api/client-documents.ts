
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      name, 
      size, 
      type, 
      path, 
      client_id, 
      notes, 
      case_id, 
      status,
      uploaded_by 
    } = req.body;

    // Use the add_client_document RPC function
    const { data, error } = await supabase.rpc('add_client_document', {
      p_name: name,
      p_size: size,
      p_type: type,
      p_path: path,
      p_client_id: client_id,
      p_notes: notes,
      p_case_id: case_id,
      p_status: status,
      p_uploaded_by: uploaded_by
    });

    if (error) throw error;
    
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error creating document:', error);
    return res.status(500).json({ error: error.message });
  }
}
