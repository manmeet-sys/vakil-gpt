
import React, { useState } from 'react';
import { FileText, Upload, X, Loader2, History, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { extractTextFromPdf } from '@/utils/pdfExtraction';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';

interface DocumentVersion {
  version: number;
  filename: string;
  uploadedAt: Date;
  size: string;
}

interface PdfUploaderProps {
  onUpload: (files: File[], extractedText?: string, versions?: DocumentVersion[]) => void;
  onRemove: (index: number) => void;
  documents: File[];
  className?: string;
  documentId?: string;
  showVersionHistory?: boolean;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ 
  onUpload, 
  onRemove, 
  documents, 
  className = "",
  documentId,
  showVersionHistory = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractingText, setExtractingText] = useState(false);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90; // Hold at 90% until processing completes
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Filter for PDF files
      const pdfFiles = Array.from(files).filter(file => 
        file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
      );
      
      if (pdfFiles.length !== files.length) {
        toast.warning('Only PDF files are supported', {
          description: 'Some non-PDF files were excluded'
        });
      }
      
      if (pdfFiles.length === 0) {
        throw new Error('No PDF files selected');
      }

      // For the first PDF, try to extract text
      if (pdfFiles[0]) {
        setExtractingText(true);
        try {
          const extractedText = await extractTextFromPdf(pdfFiles[0]);
          
          // If we have a documentId, save this as a new version
          const newVersions = [...versions];
          if (documentId) {
            const newVersion = {
              version: versions.length + 1,
              filename: pdfFiles[0].name,
              uploadedAt: new Date(),
              size: formatFileSize(pdfFiles[0].size)
            };
            newVersions.push(newVersion);
            
            // In a real app, we would store the file in Supabase Storage
            try {
              // This is a placeholder for actual storage upload
              // const { data, error } = await supabase.storage
              //   .from('documents')
              //   .upload(`${documentId}/v${newVersion.version}`, pdfFiles[0]);
              
              // if (error) throw error;
            } catch (error) {
              console.error('Error storing document version:', error);
            }
          }
          
          setUploadProgress(100);
          setTimeout(() => {
            setIsUploading(false);
            setExtractingText(false);
            setVersions(newVersions);
            onUpload(pdfFiles, extractedText, newVersions);
          }, 500);
        } catch (error) {
          console.error('Error extracting text:', error);
          setUploadProgress(100);
          setTimeout(() => {
            setIsUploading(false);
            setExtractingText(false);
            onUpload(pdfFiles);
          }, 500);
        }
      } else {
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          onUpload(pdfFiles);
        }, 500);
      }
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Error uploading files', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      setIsUploading(false);
      setUploadProgress(0);
    } finally {
      clearInterval(progressInterval);
    }
  };

  const loadVersionHistory = async () => {
    if (!documentId) return;
    
    setIsLoadingVersions(true);
    try {
      // In a real app, we would fetch version history from Supabase
      // Simulating a fetch operation for demonstration
      setTimeout(() => {
        const mockVersions: DocumentVersion[] = [
          {
            version: 1,
            filename: "Original Draft.pdf",
            uploadedAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
            size: "1.2 MB"
          },
          {
            version: 2,
            filename: "Revised Draft.pdf",
            uploadedAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
            size: "1.4 MB"
          },
        ];
        setVersions(mockVersions);
        setIsLoadingVersions(false);
      }, 800);
    } catch (error) {
      console.error('Error loading version history:', error);
      setIsLoadingVersions(false);
      toast.error('Error loading version history');
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Load version history on mount if showVersionHistory is true
  React.useEffect(() => {
    if (showVersionHistory && documentId) {
      loadVersionHistory();
    }
  }, [showVersionHistory, documentId]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-base font-medium mb-2">Court Documents (PDF)</h3>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
          <Input
            type="file"
            id="pdf-upload"
            multiple
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <label 
            htmlFor="pdf-upload" 
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {extractingText ? 'Extracting document text...' : 'Uploading...'}
                </span>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Click to upload PDF documents
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Only PDF files are supported (Max: 10MB)
                </span>
              </>
            )}
          </label>
        </div>
      </div>
      
      {isUploading && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      
      {documents.length > 0 && (
        <div className="space-y-3 mt-4">
          <h4 className="text-sm font-medium">Attached Documents</h4>
          {documents.map((doc, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md"
            >
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-2" />
                <span className="text-sm truncate max-w-[250px]">{doc.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {formatFileSize(doc.size)}
                </Badge>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => onRemove(index)}
                  className="h-8 w-8 p-0"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Version History Section */}
      {showVersionHistory && documentId && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium flex items-center">
              <History className="h-4 w-4 mr-1 text-blue-500" />
              Version History
            </h4>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-xs h-8"
              onClick={loadVersionHistory}
              disabled={isLoadingVersions}
            >
              {isLoadingVersions ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <Clock className="h-3 w-3 mr-1" />
              )}
              Refresh
            </Button>
          </div>
          
          {isLoadingVersions ? (
            <div className="text-center py-3 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin mx-auto mb-1" />
              Loading version history...
            </div>
          ) : versions.length > 0 ? (
            <div className="space-y-2">
              {versions.map((version, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-900/30"
                >
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2 bg-blue-100 dark:bg-blue-900/40">
                      v{version.version}
                    </Badge>
                    <span className="text-xs font-medium">{version.filename}</span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-xs text-gray-500">
                          {version.uploadedAt.toLocaleDateString()}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {version.size} • 
                          {version.uploadedAt.toLocaleString()}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/30 rounded">
              No version history available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
