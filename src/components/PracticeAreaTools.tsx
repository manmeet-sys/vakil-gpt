
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, FileText, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PracticeAreaToolsProps {
  practiceArea: string;
  description: string;
  icon: React.ReactNode;
  tools: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    content: React.ReactNode;
  }[];
  lawUpdates?: {
    title: string;
    date: string;
    description: string;
  }[];
  keyLegalPrinciples?: {
    title: string;
    description: string;
    source?: string;
  }[];
}

const PracticeAreaTools: React.FC<PracticeAreaToolsProps> = ({
  practiceArea,
  description,
  icon,
  tools,
  lawUpdates = [],
  keyLegalPrinciples = []
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h1 className="text-xl font-semibold">{practiceArea}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      
      <Tabs defaultValue="tools" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="updates">Law Updates</TabsTrigger>
          <TabsTrigger value="principles">Key Principles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tools" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Card key={tool.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    {tool.icon}
                  </div>
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tool.content}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="updates" className="space-y-4 pt-4">
          {lawUpdates.length > 0 ? (
            <div className="space-y-4">
              {lawUpdates.map((update, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{update.title}</CardTitle>
                      <span className="text-xs text-muted-foreground">{update.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{update.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <p className="mt-2 text-muted-foreground">No recent law updates available</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="principles" className="space-y-4 pt-4">
          {keyLegalPrinciples.length > 0 ? (
            <div className="space-y-4">
              {keyLegalPrinciples.map((principle, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{principle.title}</CardTitle>
                    {principle.source && (
                      <CardDescription className="text-xs">{principle.source}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{principle.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <p className="mt-2 text-muted-foreground">No key legal principles available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PracticeAreaTools;
