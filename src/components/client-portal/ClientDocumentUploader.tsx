import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FileUp, Trash2, File, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ClientDocument, ClientPortalRPC } from '@/types/ClientPortalTypes';

interface ClientDocumentUploaderProps {
  clientId: string;
  onUploadSuccess: () => void;
}

interface FileWithPreview extends File {
  preview?: string;
  id?: string;
}

// Helper interface for case dropdown
interface ClientCase {
  id: string;
  title: string;
}

const ClientDocumentUploader = ({ clientId, onUploadSuccess }: ClientDocumentUploaderProps) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedCase, setSelectedCase] = useState<string>('');
  const [cases, setCases] = useState<ClientCase[]>([]);
  
  React.useEffect(() => {
    // Fetch client cases
    const fetchCases = async () => {
      try {
        const { data, error } = await supabase
          .from('court_filings')
          .select('id, case_title')
          .eq('client_id', clientId);
        
        if (error) throw error;
        
        setCases(data?.map(c => ({
          id: c.id,
          title: c.case_title || 'Untitled Case'
        })) || []);
      } catch (error) {
        console.error('Error fetching cases:', error);
      }
    };
    
    if (clientId) {
      fetchCases();
    }
  }, [clientId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files).map(file => 
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(2)
      })
    );
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileToRemove: FileWithPreview) => {
    setFiles(files.filter(file => file.id !== fileToRemove.id));
    if (fileToRemove.preview) URL.revokeObjectURL(fileToRemove.preview);
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }
    
    try {
      setUploading(true);
      
      // Upload each file to storage
      const uploadPromises = files.map(async (file) => {
        const filePath = `client-documents/${clientId}/${Date.now()}-${file.name}`;
        
        // Upload to storage
        const { data: storageData, error: storageError } = await supabase.storage
          .from('client-documents')
          .upload(filePath, file);
          
        if (storageError) throw storageError;
        
        // Create database entry using RPC function with type assertion
        const { data, error } = await supabase.rpc<'add_client_document', ClientPortalRPC>(
          'add_client_document', 
          {
            p_name: file.name,
            p_size: file.size,
            p_type: file.type,
            p_path: filePath,
            p_client_id: clientId,
            p_notes: notes || null,
            p_case_id: selectedCase || null,
            p_status: 'pending_review',
            p_uploaded_by: user?.id || ''
          }
        );
        
        if (error) throw error;
        
        return { success: true };
      });
      
      await Promise.all(uploadPromises);
      
      toast.success('Documents uploaded successfully');
      onUploadSuccess();
      
      // Clear the form
      setFiles([]);
      setNotes('');
      
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast.error('Failed to upload documents. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card className="border-dashed border-2 relative">
            <CardContent className="pt-6">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileUp className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, PNG, JPG or DOCX (MAX. 10MB)
                  </p>
                </div>
                <Input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.docx"
                />
              </label>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Related Case (Optional)</label>
            <Select value={selectedCase} onValueChange={setSelectedCase}>
              <SelectTrigger>
                <SelectValue placeholder="Select a case" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No specific case</SelectItem>
                {cases.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
            <Textarea
              placeholder="Add any notes about the documents..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </div>
      </div>
      
      {files.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Selected Files ({files.length})</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {files.map(file => (
              <div key={file.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
                <div className="flex items-center">
                  <File className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm truncate max-w-[150px] md:max-w-xs">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeFile(file)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <Button 
          onClick={uploadFiles} 
          disabled={files.length === 0 || uploading}
          className="flex items-center"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Upload Documents
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ClientDocumentUploader;
