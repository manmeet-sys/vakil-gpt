
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, FileText, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

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
    <div className="space-y-10">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h1 className="text-xl font-semibold font-playfair tracking-tight">{practiceArea}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      
      {/* Tools Section */}
      <section>
        <h2 className="text-lg font-playfair font-medium mb-4">Practice Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Card key={tool.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  {tool.icon}
                </div>
                <CardTitle className="text-lg font-playfair">{tool.title}</CardTitle>
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
      </section>
      
      {/* Law Updates Section */}
      {lawUpdates.length > 0 && (
        <section>
          <h2 className="text-lg font-playfair font-medium mb-4">Recent Legal Updates</h2>
          <div className="grid gap-4">
            {lawUpdates.map((update, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-playfair">{update.title}</CardTitle>
                    <span className="text-xs text-muted-foreground">{update.date}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{update.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
      
      {/* Legal Principles Section */}
      {keyLegalPrinciples.length > 0 && (
        <section>
          <h2 className="text-lg font-playfair font-medium mb-4">Key Legal Principles</h2>
          <div className="grid gap-4">
            {keyLegalPrinciples.map((principle, index) => (
              <Card key={index} className="border-l-4 border-l-amber-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-playfair">{principle.title}</CardTitle>
                  {principle.source && (
                    <CardDescription className="text-xs italic">{principle.source}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PracticeAreaTools;
