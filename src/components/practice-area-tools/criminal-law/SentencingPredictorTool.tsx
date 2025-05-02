
import React, { useState } from 'react';
import { BaseCalculator } from '../base';
import { Calculator, AlertTriangle } from 'lucide-react';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface SentencingRange {
  min: string;
  max: string;
  typical: string;
  description: string;
}

// Sentencing data mapping
const sentencingData = {
  'culpable-homicide': {
    min: '10 years',
    max: 'Life imprisonment',
    typical: '14 years',
    description: 'For culpable homicide under BNS Section 45, courts typically consider intent, brutality, and premeditation.'
  },
  'theft': {
    min: '3 months', 
    max: '3 years',
    typical: '1 year',
    description: 'For theft under BNS Section 303, courts typically consider value of stolen property, method, and criminal history.'
  },
  'criminal-breach-of-trust': {
    min: '1 year',
    max: '7 years',
    typical: '3 years',
    description: 'For criminal breach of trust under BNS Section 318, courts consider position of trust, amount involved, and impact.'
  },
  'kidnapping': {
    min: '7 years',
    max: '10 years',
    typical: '8 years',
    description: 'For kidnapping under BNS Section 137, courts consider victim age, duration, and harm caused.'
  },
  'assault': {
    min: '3 months',
    max: '2 years',
    typical: '8 months',
    description: 'For assault under BNS Section 125, courts consider severity of injuries, weapons used, and provocation.'
  }
};

const SentencingPredictorTool = () => {
  const [offenseType, setOffenseType] = useState<string>('');
  const [mitigatingFactors, setMitigatingFactors] = useState<string>('');
  const [aggravatingFactors, setAggravatingFactors] = useState<string>('');
  const [prisonBail, setPrisonBail] = useState('');
  const [firstTimeOffender, setFirstTimeOffender] = useState(false);
  
  const [sentencingRange, setSentencingRange] = useState<SentencingRange | null>(null);
  
  const calculateSentence = () => {
    if (!offenseType) return null;
    
    const baseRange = sentencingData[offenseType as keyof typeof sentencingData];
    
    // In a real app, this would use more sophisticated logic based on all inputs
    // For now, we'll just return the base range from our data
    setSentencingRange(baseRange);
  };
  
  return (
    <BaseCalculator
      title="BNS Sentencing Predictor"
      description="Analyze case details and predict possible sentencing outcomes under the Bharatiya Nyaya Sanhita"
      icon={<Calculator className="h-5 w-5 text-blue-600" />}
      onCalculate={calculateSentence}
      results={
        sentencingRange && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <p className="text-sm text-muted-foreground">
                This prediction is for informational purposes only and does not constitute legal advice.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="p-4 border rounded-lg bg-background">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Minimum Sentence</h4>
                <p className="text-lg font-semibold">{sentencingRange.min}</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-background">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Typical Sentence</h4>
                <p className="text-lg font-semibold text-blue-700 dark:text-blue-500">
                  {sentencingRange.typical}
                </p>
              </div>
              
              <div className="p-4 border rounded-lg bg-background">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Maximum Sentence</h4>
                <p className="text-lg font-semibold">{sentencingRange.max}</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-muted/30">
              <h4 className="text-sm font-medium mb-2">Sentencing Considerations</h4>
              <p className="text-sm">{sentencingRange.description}</p>
            </div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="offense-type">Type of Offense</Label>
          <Select 
            value={offenseType} 
            onValueChange={setOffenseType}
          >
            <SelectTrigger className="w-full" id="offense-type">
              <SelectValue placeholder="Select offense" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="culpable-homicide">Culpable Homicide (BNS Section 45)</SelectItem>
              <SelectItem value="theft">Theft (BNS Section 303)</SelectItem>
              <SelectItem value="criminal-breach-of-trust">Criminal Breach of Trust (BNS Section 318)</SelectItem>
              <SelectItem value="kidnapping">Kidnapping (BNS Section 137)</SelectItem>
              <SelectItem value="assault">Assault (BNS Section 125)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mitigating-factors">Mitigating Factors</Label>
          <Textarea 
            id="mitigating-factors"
            value={mitigatingFactors}
            onChange={(e) => setMitigatingFactors(e.target.value)}
            placeholder="Enter mitigating factors such as age, cooperation with authorities, etc."
            className="resize-none"
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="aggravating-factors">Aggravating Factors</Label>
          <Textarea 
            id="aggravating-factors"
            value={aggravatingFactors}
            onChange={(e) => setAggravatingFactors(e.target.value)}
            placeholder="Enter aggravating factors such as violence, planning, etc."
            className="resize-none"
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="prison-bail">Prison or Out on Bail</Label>
          <Select 
            value={prisonBail} 
            onValueChange={setPrisonBail}
          >
            <SelectTrigger className="w-full" id="prison-bail">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prison">In Prison</SelectItem>
              <SelectItem value="bail">Out on Bail</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox 
            id="first-time"
            checked={firstTimeOffender}
            onCheckedChange={(checked) => {
              if (typeof checked === 'boolean') {
                setFirstTimeOffender(checked);
              }
            }}
          />
          <Label htmlFor="first-time" className="text-sm font-normal">
            First-time offender
          </Label>
        </div>
      </div>
    </BaseCalculator>
  );
};

export default SentencingPredictorTool;
