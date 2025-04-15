
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
import { cn } from '@/lib/utils';

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

  // Card data to make it easier to map through
  const cardData = [
    {
      title: "Upcoming Deadlines",
      count: upcomingCount,
      label: "pending",
      icon: CalendarDays,
      colors: {
        gradient: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/30",
        border: "border-indigo-200 dark:border-indigo-800/30",
        bar: "bg-indigo-500 dark:bg-indigo-600",
        text: "text-indigo-600 dark:text-indigo-300",
        number: "text-indigo-800 dark:text-indigo-200",
        background: "bg-indigo-100 dark:bg-indigo-700/40",
        iconColor: "text-indigo-600 dark:text-indigo-300",
      }
    },
    {
      title: "Urgent Tasks",
      count: urgentCount,
      label: "attention needed",
      icon: AlertTriangle,
      colors: {
        gradient: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30",
        border: "border-red-200 dark:border-red-800/30",
        bar: "bg-red-500 dark:bg-red-600",
        text: "text-red-600 dark:text-red-300",
        number: "text-red-800 dark:text-red-200",
        background: "bg-red-100 dark:bg-red-700/40",
        iconColor: "text-red-600 dark:text-red-300",
      }
    },
    {
      title: "Completed",
      count: completedCount,
      label: "finished",
      icon: CheckCircle2,
      colors: {
        gradient: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30",
        border: "border-green-200 dark:border-green-800/30",
        bar: "bg-green-500 dark:bg-green-600",
        text: "text-green-600 dark:text-green-300",
        number: "text-green-800 dark:text-green-200",
        background: "bg-green-100 dark:bg-green-700/40",
        iconColor: "text-green-600 dark:text-green-300",
      }
    },
    {
      title: "All Deadlines",
      count: totalDeadlines,
      label: "total",
      icon: Bell,
      colors: {
        gradient: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30",
        border: "border-blue-200 dark:border-blue-800/30",
        bar: "bg-blue-500 dark:bg-blue-600",
        text: "text-blue-600 dark:text-blue-300",
        number: "text-blue-800 dark:text-blue-200",
        background: "bg-blue-100 dark:bg-blue-700/40",
        iconColor: "text-blue-600 dark:text-blue-300",
      }
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {cardData.map((card, index) => (
        <motion.div variants={item} key={index}>
          <Card className={cn(
            "overflow-hidden shadow-md bg-gradient-to-br border hover:shadow-lg transition-shadow duration-200",
            card.colors.gradient,
            card.colors.border
          )}>
            <CardContent className="p-0">
              <div className="flex items-stretch h-full">
                <div className={cn("w-3", card.colors.bar)}></div>
                <div className="flex-1 p-4 flex items-center justify-between">
                  <div className="overflow-hidden">
                    <p className={cn("text-sm font-medium flex items-center truncate max-w-[120px] md:max-w-full", card.colors.text)}>
                      <card.icon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{card.title}</span>
                    </p>
                    <div className="flex items-end mt-1">
                      <h3 className={cn("text-2xl font-bold", card.colors.number)}>{card.count}</h3>
                      <p className={cn("text-xs ml-1.5 mb-0.5 whitespace-nowrap", card.colors.text)}>{card.label}</p>
                    </div>
                  </div>
                  <div className={cn("w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center shadow-inner", card.colors.background)}>
                    <card.icon className={cn("h-6 w-6", card.colors.iconColor)} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DashboardCards;
