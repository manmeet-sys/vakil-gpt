import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ForumMismatchAlertProps {
  error: {
    message: string;
    suggestion?: {
      forum: string;
    };
  };
  onSwitchForum: (newForum: string) => void;
  onDismiss: () => void;
}

export function ForumMismatchAlert({ error, onSwitchForum, onDismiss }: ForumMismatchAlertProps) {
  const getForumDisplayName = (forum: string) => {
    switch (forum) {
      case 'HMA_24': return 'Hindu Marriage Act Section 24 (Interim Maintenance)';
      case 'HMA_25': return 'Hindu Marriage Act Section 25 (Permanent Alimony)';
      case 'CrPC_125': return 'Code of Criminal Procedure Section 125';
      case 'SMA_36': return 'Special Marriage Act Section 36';
      case 'SMA_37': return 'Special Marriage Act Section 37';
      default: return forum;
    }
  };

  return (
    <Alert className="my-4 border-red-200 bg-red-50">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription>
        <div className="space-y-3">
          <div>
            <strong className="text-red-800">Forum Mismatch Detected</strong>
          </div>
          
          <p className="text-red-700 text-sm">
            {error.message}
          </p>
          
          {error.suggestion?.forum && (
            <div className="space-y-2">
              <p className="text-red-700 text-sm font-medium">
                Suggested correction:
              </p>
              <p className="text-red-600 text-sm pl-4 border-l-2 border-red-200">
                {getForumDisplayName(error.suggestion.forum)}
              </p>
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            {error.suggestion?.forum && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onSwitchForum(error.suggestion!.forum)}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Switch to {getForumDisplayName(error.suggestion.forum)} and retry
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDismiss}
              className="text-red-600 hover:text-red-700"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}