
/**
 * Utility functions for PDF extraction
 */
import * as pdfjsLib from 'pdfjs-dist';

// Ensure the PDF.js worker is properly set
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extracts text from a PDF file
 * @param file The PDF file to extract text from
 * @returns A promise that resolves to the extracted text
 */
export const extractTextFromPdf = async (file: File): Promise<string> => {
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
    throw new Error("Failed to extract text from PDF");
  }
};

/**
 * Simple mock function for testing when PDF extraction is problematic
 */
export const mockPdfExtraction = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockText = `[PDF CONTENT EXTRACTED FROM: ${file.name}]
      
This document appears to be a legal agreement regarding property rights and obligations.
Key sections include:
1. Party information and property description
2. Terms and conditions of the agreement
3. Legal obligations of both parties
4. Dispute resolution procedures
5. Signatures and dates

The document contains approximately ${Math.floor(file.size / 100)} paragraphs of legal text.`;
      
      resolve(mockText);
    }, 800);
  });
};
