
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, FileText, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type DocumentPreviewProps = {
  title: string;
  type: string;
  content: string;
  onCopy: () => void;
  onDownload: () => void;
};

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  title,
  type,
  content,
  onCopy,
  onDownload,
}) => {
  const formatDocumentType = (type: string) => {
    if (!type) return '';
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Card className="h-full shadow-md overflow-hidden flex flex-col">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
              <FileText className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl text-legal-slate dark:text-white truncate">
              {title || 'Document Preview'}
            </CardTitle>
          </div>
          <div className="text-sm text-legal-muted dark:text-gray-400 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
            {formatDocumentType(type) || 'No Type'}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-auto">
        {content ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-[60vh] relative"
          >
            <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-50 pointer-events-none" />
            <pre className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-inner border border-gray-200 dark:border-gray-800 whitespace-pre-wrap text-sm text-legal-slate dark:text-white font-mono relative overflow-auto min-h-[60vh]">
              {content}
            </pre>
          </motion.div>
        ) : (
          <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-600 dark:text-amber-400">No document content</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm">
              Generate a document using the form to preview it here.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      {content && (
        <CardFooter className="flex justify-end gap-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 p-4">
          <Button variant="outline" onClick={onCopy} className="flex gap-2">
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </Button>
          <Button onClick={onDownload} className="bg-legal-accent hover:bg-legal-accent/90 flex gap-2">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DocumentPreview;
