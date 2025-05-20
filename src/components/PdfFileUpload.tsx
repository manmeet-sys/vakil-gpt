
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, Loader2, File } from 'lucide-react';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source path properly
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfFileUploadProps {
  onTextExtracted: (text: string, fileName: string) => void;
}

const PdfFileUpload: React.FC<PdfFileUploadProps> = ({ onTextExtracted }) => {
  const [isLoading, setIsLoading] = useState(false);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    setIsLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map((item: any) => item.str).join(' ');
        fullText += textItems + ' ';
      }
      
      return fullText.trim();
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      toast.error("Failed to extract text from PDF");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    if (file.type !== 'application/pdf') {
      toast.error("Please upload a PDF file");
      return;
    }
    
    try {
      const text = await extractTextFromPdf(file);
      onTextExtracted(text, file.name);
      toast.success("PDF text extracted successfully");
    } catch (error) {
      console.error("Error processing PDF:", error);
    }
  }, [onTextExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-md p-6 cursor-pointer transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-center">
        {isLoading ? (
          <>
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Processing PDF...</p>
          </>
        ) : (
          <>
            <FileUp className="h-10 w-10 text-gray-400 dark:text-gray-600 mb-2" />
            <p className="text-sm font-medium mb-1">
              {isDragActive ? "Drop the PDF here" : "Drag & drop a PDF file here"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              or click to select a file
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PdfFileUpload;
