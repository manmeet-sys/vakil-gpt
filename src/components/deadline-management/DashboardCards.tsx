
import React from 'react';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { 
  CalendarDays, 
  AlertTriangle, 
  CheckCircle2, 
  Bell 
} from 'lucide-react';

interface DashboardCardsProps {
  upcomingCount: number;
  urgentCount: number;
  completedCount: number;
  totalDeadlines: number;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ 
  upcomingCount,
  urgentCount,
  completedCount,
  totalDeadlines 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-100 dark:border-purple-900/30 shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">Upcoming Deadlines</p>
            <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-200">{upcomingCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800/40 flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-purple-600 dark:text-purple-300" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-100 dark:border-orange-900/30 shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-orange-600 dark:text-orange-300 font-medium">Urgent Tasks</p>
            <h3 className="text-2xl font-bold text-orange-800 dark:text-orange-200">{urgentCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-800/40 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-300" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-900/30 shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-green-600 dark:text-green-300 font-medium">Completed</p>
            <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">{completedCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800/40 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-300" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-100 dark:border-blue-900/30 shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">All Deadlines</p>
            <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200">{totalDeadlines}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800/40 flex items-center justify-center">
            <Bell className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCards;
