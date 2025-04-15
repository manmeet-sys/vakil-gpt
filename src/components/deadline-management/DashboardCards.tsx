
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
import { motion } from 'framer-motion';

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
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <Card className="overflow-hidden shadow-md bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/30 border-indigo-200 dark:border-indigo-800/30 hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-0">
            <div className="flex items-stretch h-full">
              <div className="w-3 bg-indigo-500 dark:bg-indigo-600"></div>
              <div className="flex-1 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-600 dark:text-indigo-300 font-medium flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1.5" />
                    Upcoming Deadlines
                  </p>
                  <div className="flex items-end mt-1">
                    <h3 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">{upcomingCount}</h3>
                    <p className="text-xs text-indigo-500 dark:text-indigo-400 ml-1.5 mb-0.5">pending</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-700/40 flex items-center justify-center shadow-inner">
                  <CalendarDays className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item}>
        <Card className="overflow-hidden shadow-md bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30 border-red-200 dark:border-red-800/30 hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-0">
            <div className="flex items-stretch h-full">
              <div className="w-3 bg-red-500 dark:bg-red-600"></div>
              <div className="flex-1 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 dark:text-red-300 font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1.5" />
                    Urgent Tasks
                  </p>
                  <div className="flex items-end mt-1">
                    <h3 className="text-2xl font-bold text-red-800 dark:text-red-200">{urgentCount}</h3>
                    <p className="text-xs text-red-500 dark:text-red-400 ml-1.5 mb-0.5">attention needed</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-700/40 flex items-center justify-center shadow-inner">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item}>
        <Card className="overflow-hidden shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 border-green-200 dark:border-green-800/30 hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-0">
            <div className="flex items-stretch h-full">
              <div className="w-3 bg-green-500 dark:bg-green-600"></div>
              <div className="flex-1 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-300 font-medium flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    Completed
                  </p>
                  <div className="flex items-end mt-1">
                    <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">{completedCount}</h3>
                    <p className="text-xs text-green-500 dark:text-green-400 ml-1.5 mb-0.5">finished</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-700/40 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item}>
        <Card className="overflow-hidden shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border-blue-200 dark:border-blue-800/30 hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-0">
            <div className="flex items-stretch h-full">
              <div className="w-3 bg-blue-500 dark:bg-blue-600"></div>
              <div className="flex-1 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-300 font-medium flex items-center">
                    <Bell className="h-4 w-4 mr-1.5" />
                    All Deadlines
                  </p>
                  <div className="flex items-end mt-1">
                    <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200">{totalDeadlines}</h3>
                    <p className="text-xs text-blue-500 dark:text-blue-400 ml-1.5 mb-0.5">total</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-700/40 flex items-center justify-center shadow-inner">
                  <Bell className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardCards;
