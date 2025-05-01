
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PracticeAreaFeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkPath: string;
  linkText: string;
  bgColor?: string;
}

const PracticeAreaFeature: React.FC<PracticeAreaFeatureProps> = ({
  title,
  description,
  icon,
  linkPath,
  linkText,
  bgColor = 'bg-blue-50 dark:bg-blue-900/20'
}) => {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColor}`}>
            {icon}
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-sm mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Link to={linkPath}>
          <Button variant="outline" className="w-full justify-between group">
            {linkText}
            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PracticeAreaFeature;
