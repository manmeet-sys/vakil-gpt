
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface ClearAnalyticsButtonProps {
  onClear: () => void;
  className?: string;
  resetProfileData?: boolean;
}

const ClearAnalyticsButton: React.FC<ClearAnalyticsButtonProps> = ({ 
  onClear,
  className = "",
  resetProfileData = false
}) => {
  const { clearData } = useAnalytics();

  const handleClear = async () => {
    clearData();
    onClear();
    
    if (resetProfileData) {
      try {
        // This functionality would be implemented in a real app
        // to reset the user's profile data
        toast.success('Profile data reset', {
          description: 'Your profile data has been reset to default values'
        });
      } catch (error) {
        toast.error('Failed to reset profile data', {
          description: 'Please try again or contact support'
        });
      }
    } else {
      toast.success('Dashboard view cleared', {
        description: 'Analytics data has been cleared from the current view'
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-950/50 ${className}`}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {resetProfileData ? 'Reset Profile' : 'Clear Data'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {resetProfileData ? 'Reset profile data?' : 'Clear dashboard data?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {resetProfileData 
              ? 'This will reset your profile information to default values. This action cannot be undone.'
              : 'This will clear the analytics data from your current dashboard view. This action only affects your current view and doesn't delete any data from the database.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClear}>
            {resetProfileData ? 'Reset Profile' : 'Clear Data'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearAnalyticsButton;
