
import React, { useState } from 'react';
import { FileText, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { extractTextFromPdf } from '@/utils/pdfExtraction';
import { toast } from 'sonner';

interface PdfUploaderProps {
  onUpload: (files: File[], extractedText?: string) => void;
  onRemove: (index: number) => void;
  documents: File[];
  className?: string;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ 
  onUpload, 
  onRemove, 
  documents, 
  className = "" 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractingText, setExtractingText] = useState(false);

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
          setUploadProgress(100);
          setTimeout(() => {
            setIsUploading(false);
            setExtractingText(false);
            onUpload(pdfFiles, extractedText);
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
          ))}
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
