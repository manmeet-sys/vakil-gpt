
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { extractTextFromPdf } from '@/utils/pdfExtraction';
import { toast } from 'sonner';
import { FileUp, Loader2, Upload } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PdfFileUploadProps {
  onTextExtracted: (text: string, fileName: string) => void;
}

const PdfFileUpload: React.FC<PdfFileUploadProps> = ({ onTextExtracted }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      
      if (!file) {
        return;
      }

      if (file.type !== 'application/pdf') {
        toast("Please upload a PDF file");
        return;
      }

      setIsLoading(true);

      try {
        const text = await extractTextFromPdf(file);
        onTextExtracted(text, file.name);
        toast("Document uploaded successfully");
      } catch (error) {
        console.error('Error processing PDF:', error);
        toast("Failed to process PDF. Please try another file.");
      } finally {
        setIsLoading(false);
      }
    },
    [onTextExtracted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center w-full h-full cursor-pointer py-6 px-4 rounded-lg transition-all ${
        isDragActive
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
    >
      <input {...getInputProps()} />
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center text-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Processing document...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
            <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm sm:text-base font-medium mb-1">
            {isMobile ? "Upload PDF" : "Drag & drop a PDF file here"}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isMobile ? "Tap to browse files" : "or click to select a file"}
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Max file size: 10MB
          </p>
        </div>
      )}
    </div>
  );
};

export default PdfFileUpload;
