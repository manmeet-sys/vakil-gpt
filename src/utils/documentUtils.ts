
/**
 * Utility functions for handling documents
 */

/**
 * Helper function to download a file from a URL
 * @param url The URL of the file to download
 * @param filename The name to save the file as
 */
export const downloadFile = (url: string, filename: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
