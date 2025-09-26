import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, ExternalLink, Scale, FileText } from 'lucide-react';

interface FactChecklistProps {
  missingFacts: string[];
  onProceedWithAssumptions: () => void;
  onCancel: () => void;
}

export function FactChecklist({ missingFacts, onProceedWithAssumptions, onCancel }: FactChecklistProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Alert className="my-4 border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription>
        <div className="space-y-3">
          <div>
            <strong className="text-amber-800">Critical facts missing for accurate legal analysis</strong>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowDetails(!showDetails)}
            className="text-amber-700 hover:text-amber-800 p-0 h-auto"
          >
            {showDetails ? 'Hide' : 'Show'} required facts ({missingFacts.length})
          </Button>
          
          {showDetails && (
            <ul className="space-y-1 text-sm text-amber-700 ml-4">
              {missingFacts.map((fact, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-amber-600 rounded-full" />
                  {fact.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </li>
              ))}
            </ul>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onProceedWithAssumptions}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Answer anyway (with assumptions)
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancel}
              className="text-amber-600 hover:text-amber-700"
            >
              Provide more details first
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}