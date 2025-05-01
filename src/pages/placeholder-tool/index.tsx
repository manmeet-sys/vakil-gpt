
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import LegalToolLayout from '@/components/LegalToolLayout';
import { FileText, AlertTriangle, ArrowLeft } from 'lucide-react';
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
  
  // Estimated release date (sample)
  const estimatedRelease = new Date();
  estimatedRelease.setMonth(estimatedRelease.getMonth() + 3);
  const releaseDate = estimatedRelease.toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long'
  });
  
  return (
    <LegalToolLayout
      title={title}
      description={`This tool is coming soon. Our team is working on developing this feature to enhance your legal workflow.`}
      icon={<FileText className="w-6 h-6 text-blue-600" aria-hidden="true" />}
    >
      <Card className="max-w-3xl mx-auto mt-4 sm:mt-8 bg-white dark:bg-legal-slate/10 border-legal-border dark:border-legal-slate/20">
        <CardContent className="pt-6 pb-4 px-6 text-center">
          <div className="flex justify-center mb-4 sm:mb-5">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <AlertTriangle className="h-6 w-6 sm:h-7 sm:w-7 text-amber-600 dark:text-amber-500" aria-hidden="true" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-legal-slate dark:text-white" id="coming-soon-title">Coming Soon</h2>
          <p className="text-base text-legal-muted dark:text-gray-300 break-words mb-4" id="coming-soon-description">
            The {title} feature is currently under development. We're working hard to bring you this 
            advanced capability by {releaseDate}.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-4 text-left">
            <h3 className="text-md font-medium text-blue-700 dark:text-blue-400 mb-2">Would you like to be notified?</h3>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Submit a feature request to our team to receive updates about this tool's development progress.
            </p>
            <div className="mt-3">
              <Button 
                variant="secondary" 
                size="sm"
                className="text-sm"
              >
                Request Priority Access
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-6 gap-3">
          <Link to="/tools">
            <Button 
              variant="outline" 
              className="border-legal-border dark:border-legal-slate/30 text-sm flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back to Tools</span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </LegalToolLayout>
  );
};

export default PlaceholderToolPage;
