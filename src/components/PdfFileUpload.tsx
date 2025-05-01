
import React, { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import { extractTextFromPdf } from '@/utils/pdfExtraction';

interface PdfFileUploadProps {
  onChange: (file: File | null) => void;
  pdfFile: File | null;
  onTextExtracted?: (text: string) => void;
}

const PdfFileUpload: React.FC<PdfFileUploadProps> = ({ onChange, pdfFile, onTextExtracted }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file && file.type === 'application/pdf') {
      onChange(file);
      
      if (onTextExtracted) {
        setIsExtracting(true);
        try {
          const text = await extractTextFromPdf(file);
          onTextExtracted(text);
        } catch (error) {
          console.error("Failed to extract text from PDF:", error);
          toast.error("Failed to extract text from PDF");
        } finally {
          setIsExtracting(false);
        }
      }
    } else if (file) {
      onChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.error("Please upload a valid PDF file");
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="pdf-upload">Upload PDF Document</Label>
      <input
        id="pdf-upload"
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        className="block w-full text-sm text-gray-500 dark:text-gray-400
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          dark:file:bg-blue-900/20 dark:file:text-blue-400
          hover:file:bg-blue-100 dark:hover:file:bg-blue-800/30
          cursor-pointer"
        disabled={isExtracting}
      />
      
      {isExtracting && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-center text-sm">
          <span className="animate-pulse mr-2">⏳</span>
          <span>Extracting text from PDF...</span>
        </div>
      )}
      
      {pdfFile && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-center text-sm">
          <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-blue-600 dark:text-blue-400">{pdfFile.name}</span>
        </div>
      )}
    </div>
  );
};

export default PdfFileUpload;
