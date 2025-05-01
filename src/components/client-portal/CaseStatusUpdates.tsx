
import React from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { StatusUpdate } from '@/types/client-portal/CommunicationTypes';
import { Skeleton } from '@/components/ui/skeleton';

interface CaseStatusUpdatesProps {
  updates: StatusUpdate[];
  loading: boolean;
  onMarkAsRead: (updateId: string) => void;
}

const CaseStatusUpdates = ({ updates, loading, onMarkAsRead }: CaseStatusUpdatesProps) => {
  if (loading) {
    return (
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-4 border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-10 ml-2 rounded-full" />
                </div>
                <Skeleton className="h-5 w-3/4 mt-2" />
                <Skeleton className="h-4 w-full mt-1" />
                <div className="flex items-center justify-between mt-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (updates.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium">No updates yet</h3>
        <p className="text-gray-500 mt-2">
          You'll receive updates here when there are changes to your cases
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
      {updates.map(update => (
        <Card
          key={update.id}
          className={`p-4 border ${!update.is_read ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center">
                <Badge variant={update.is_read ? "outline" : "default"}>
                  {update.status}
                </Badge>
                {!update.is_read && (
                  <Badge variant="secondary" className="ml-2">New</Badge>
                )}
              </div>
              
              <h4 className="font-medium mt-2">{update.case_title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{update.message}</p>
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">
                  {new Date(update.created_at).toLocaleString()}
                </span>
                
                {!update.is_read && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={() => onMarkAsRead(update.id)}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Mark as read
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CaseStatusUpdates;
