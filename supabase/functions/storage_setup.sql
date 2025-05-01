
-- This function ensures the required storage buckets exist
CREATE OR REPLACE FUNCTION public.setup_client_document_storage()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if client-documents bucket exists in storage
  INSERT INTO storage.buckets (id, name, public)
  SELECT 'client-documents', 'Client Documents Bucket', false
  WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'client-documents'
  );
  
  -- Set up RLS policy for client documents bucket
  -- Allow authenticated users to upload
  INSERT INTO storage.policies (name, definition, bucket_id)
  SELECT 
    'Allow clients to upload their documents', 
    '(role() = ''authenticated''::text AND (storage.foldername(objects.name))[1] = auth.uid()::text)', 
    'client-documents'
  WHERE NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE bucket_id = 'client-documents' 
    AND name = 'Allow clients to upload their documents'
  );
  
  RETURN 'Storage setup complete';
END;
$$;

-- Execute the function to make sure storage is set up
SELECT public.setup_client_document_storage();
