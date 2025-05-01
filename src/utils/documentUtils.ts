
/**
 * Utility functions for document handling
 */

// Helper to download a file from a URL
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object after download
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};

// Extract info from a document file
export const extractDocumentInfo = (file: File): { name: string; type: string; size: number } => {
  return {
    name: file.name,
    type: file.type,
    size: file.size
  };
};
