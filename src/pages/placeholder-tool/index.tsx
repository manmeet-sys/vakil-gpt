
import React from 'react';
import { useParams } from 'react-router-dom';
import LegalToolLayout from '@/components/LegalToolLayout';
import { FileText, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PlaceholderToolPage = () => {
  const { toolId } = useParams();
  
  // Get the current pathname to extract the tool name
  const pathname = window.location.pathname;
  const toolName = pathname.split('/').pop() || toolId || 'tool';
  
  // Convert path to readable title
  const formatTitle = (path: string) => {
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const title = formatTitle(toolName);
  
  return (
    <LegalToolLayout
      title={title}
      description={`This tool is coming soon. Our team is working on developing this feature to enhance your legal workflow.`}
      icon={<FileText className="w-6 h-6 text-white" />}
    >
      <Card className="max-w-3xl mx-auto mt-4 sm:mt-8 bg-white dark:bg-legal-slate/10 border-legal-border dark:border-legal-slate/20">
        <CardContent className="pt-4 pb-2 px-4 sm:pt-6 sm:pb-4 sm:px-6 text-center">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 dark:text-amber-500" />
            </div>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-legal-slate dark:text-white">Coming Soon</h2>
          <p className="text-sm text-legal-muted dark:text-gray-400 break-words">
            The {title} feature is currently under development. We're working hard to bring you this 
            advanced capability soon. In the meantime, you can explore our other available tools.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pb-4 sm:pb-6">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline" 
            className="border-legal-border dark:border-legal-slate/30 text-sm"
          >
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </LegalToolLayout>
  );
};

export default PlaceholderToolPage;
