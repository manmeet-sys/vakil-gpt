
import React, { useState } from 'react';
import { BaseAnalyzer } from '../base';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { AnalysisResult } from '../base/BaseAnalyzer';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const PleaBargainAssistant = () => {
  const [offenseCategory, setOffenseCategory] = useState('');
  const [filedCharges, setFiledCharges] = useState('');
  const [caseCircumstances, setCaseCircumstances] = useState('');
  const [prisonTerm, setPrisonTerm] = useState('');
  const [earlierCharges, setEarlierCharges] = useState<'yes' | 'no'>('no');
  
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  
  const handleAnalyze = async () => {
    // In a production app, this would call an API with LLM to analyze the case
    // For this demo, we'll use predefined responses
    
    let results: AnalysisResult[] = [];
    
    if (offenseCategory === 'property') {
      results = [
        {
          title: 'Plea Bargain Eligibility',
          description: 'Eligible under BNSS Section 256. Property offenses typically qualify for plea bargaining when involving first-time offenders and cases without violence.',
          severity: 'info'
        },
        {
          title: 'Potential Sentence Reduction',
          description: 'Approximately 30-50% reduction in sentence can be expected based on similar precedents.',
          severity: 'low'
        },
        {
          title: 'Recommended Approach',
          description: 'Consider applying for plea bargaining under BNSS Section 256 with an offer to return the property or provide compensation.',
          severity: 'info'
        }
      ];
    } else if (offenseCategory === 'white-collar') {
      results = [
        {
          title: 'Plea Bargain Eligibility',
          description: 'Eligible under BNSS Section 257. White-collar offenses are increasingly being allowed under plea bargaining provisions.',
          severity: 'info'
        },
        {
          title: 'Potential Sentence Reduction',
          description: 'Typically 25-40% reduction with substantial financial settlement.',
          severity: 'medium'
        },
        {
          title: 'Legal Requirements',
          description: 'Must submit a detailed admission and arrange for compensation to affected parties where applicable.',
          severity: 'high'
        }
      ];
    } else {
      results = [
        {
          title: 'Limited Plea Bargain Options',
          description: 'The selected offense category has limited plea bargaining options under BNSS.',
          severity: 'high'
        },
        {
          title: 'Alternative Recommendation',
          description: 'Consider negotiating for reduced charges rather than direct plea bargaining.',
          severity: 'medium'
        }
      ];
    }
    
    if (earlierCharges === 'yes') {
      results.push({
        title: 'Prior Record Consideration',
        description: 'Previous criminal history may substantially limit plea bargaining benefits. The court will consider this a significant factor.',
        severity: 'high'
      });
    }
    
    setAnalysisResults(results);
  };
  
  return (
    <BaseAnalyzer
      title="Plea Bargain Assistant"
      description="Analyze plea bargaining possibilities under BNSS with legal insights"
      icon={<FileText className="h-5 w-5 text-blue-600" />}
      onAnalyze={handleAnalyze}
      analysisResults={analysisResults}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="offense-category">Offense Category</Label>
          <Select 
            value={offenseCategory} 
            onValueChange={setOffenseCategory}
          >
            <SelectTrigger className="w-full" id="offense-category">
              <SelectValue placeholder="Select offense category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="property">Property Offenses</SelectItem>
              <SelectItem value="white-collar">White-Collar Crimes</SelectItem>
              <SelectItem value="minor-violence">Minor Violence</SelectItem>
              <SelectItem value="narcotics">Narcotics (Small Quantity)</SelectItem>
              <SelectItem value="traffic">Traffic Violations</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="filed-charges">Charges Filed</Label>
          <Textarea
            id="filed-charges"
            placeholder="Enter the specific charges filed under BNS"
            value={filedCharges}
            onChange={e => setFiledCharges(e.target.value)}
            className="resize-none"
            rows={2}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="case-circumstances">Case Circumstances</Label>
          <Textarea
            id="case-circumstances"
            placeholder="Briefly describe relevant case circumstances"
            value={caseCircumstances}
            onChange={e => setCaseCircumstances(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <Label htmlFor="prison-term">Expected Prison Term (if convicted)</Label>
          <Select 
            value={prisonTerm} 
            onValueChange={setPrisonTerm}
          >
            <SelectTrigger className="w-full" id="prison-term">
              <SelectValue placeholder="Select expected term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-1">Under 1 year</SelectItem>
              <SelectItem value="1-3">1-3 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="5-10">5-10 years</SelectItem>
              <SelectItem value="over-10">Over 10 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4 pt-2">
          <Label>Prior Criminal Record</Label>
          <RadioGroup defaultValue="no" value={earlierCharges} onValueChange={(val) => setEarlierCharges(val as 'yes' | 'no')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-record" />
              <Label htmlFor="no-record">No prior record</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="has-record" />
              <Label htmlFor="has-record">Has prior record</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </BaseAnalyzer>
  );
};

export default PleaBargainAssistant;
