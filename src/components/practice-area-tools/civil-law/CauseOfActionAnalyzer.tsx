
import React, { useState } from 'react';
import { BaseAnalyzer, AnalysisResult } from '@/components/practice-area-tools/base';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';

interface CauseOfActionElement {
  element: string;
  description: string;
  present: boolean;
  evidenceRequired: string;
}

interface CauseOfActionTemplate {
  id: string;
  name: string;
  description: string;
  elements: CauseOfActionElement[];
  statutoryBasis: string;
  standardOfProof: string;
  limitationPeriod: string;
  keyPrecedents: string[];
}

const CauseOfActionAnalyzer: React.FC = () => {
  const [selectedCauseType, setSelectedCauseType] = useState('breach_of_contract');
  const [factDescription, setFactDescription] = useState('');
  const [analyzeResults, setAnalyzeResults] = useState<AnalysisResult[]>([]);
  
  const causeOfActionTemplates: Record<string, CauseOfActionTemplate> = {
    breach_of_contract: {
      id: 'breach_of_contract',
      name: 'Breach of Contract',
      description: 'A civil wrong arising from the failure to perform contractual obligations',
      elements: [
        {
          element: 'Valid Contract Formation',
          description: 'A legally binding contract must exist between the parties',
          present: false,
          evidenceRequired: 'Written agreement, emails, text messages, witnesses to oral agreement'
        },
        {
          element: 'Contractual Obligation',
          description: 'Specific obligations that the defendant was required to perform',
          present: false,
          evidenceRequired: 'Terms in contract, correspondence discussing obligations'
        },
        {
          element: 'Breach of Obligation',
          description: 'Defendant failed to perform their obligation or performed inadequately',
          present: false,
          evidenceRequired: 'Evidence of non-performance, defective performance, or delay'
        },
        {
          element: 'Damages',
          description: 'Plaintiff suffered damages as a result of the breach',
          present: false,
          evidenceRequired: 'Financial records, lost profits, costs of remediation'
        }
      ],
      statutoryBasis: 'Indian Contract Act, 1872 (Sections 73-75)',
      standardOfProof: 'Preponderance of evidence (Balance of probabilities)',
      limitationPeriod: '3 years from date of breach',
      keyPrecedents: [
        'Hadley v. Baxendale (1854) - Established remoteness of damage rule',
        'Carlill v. Carbolic Smoke Ball Co. (1893) - Unilateral contract principles',
        'M/S Boots Pure Drug Co. Ltd v. M/S May and Baker Ltd AIR 1969 - Indian adaptation of remoteness rule'
      ]
    },
    negligence: {
      id: 'negligence',
      name: 'Negligence',
      description: 'A tort where harm results from failure to exercise reasonable care',
      elements: [
        {
          element: 'Duty of Care',
          description: 'Defendant owed plaintiff a legal duty of care',
          present: false,
          evidenceRequired: 'Relationship between parties, professional standards, statutory duties'
        },
        {
          element: 'Breach of Duty',
          description: 'Defendant failed to meet the standard of care',
          present: false,
          evidenceRequired: 'Expert testimony, violation of regulations, deviation from standards'
        },
        {
          element: 'Causation',
          description: 'Breach of duty caused the plaintiff\'s injury',
          present: false,
          evidenceRequired: 'Medical reports, expert testimony on causation, temporal relationship'
        },
        {
          element: 'Damages',
          description: 'Plaintiff suffered actual loss or harm',
          present: false,
          evidenceRequired: 'Medical bills, loss of income, property damage reports'
        }
      ],
      statutoryBasis: 'Common law tort, principles established in case law',
      standardOfProof: 'Preponderance of evidence (Balance of probabilities)',
      limitationPeriod: '1 year from date of knowledge of injury',
      keyPrecedents: [
        'Donoghue v. Stevenson [1932] AC 562 - Established modern negligence principles',
        'M.C. Mehta v. Union of India AIR 1987 SC 1086 - Absolute liability principle in India',
        'Jacob Mathew v. State of Punjab (2005) 6 SCC 1 - Professional negligence standards'
      ]
    },
    defamation: {
      id: 'defamation',
      name: 'Defamation',
      description: 'False statement that harms reputation (libel in written form; slander in spoken form)',
      elements: [
        {
          element: 'False Statement',
          description: 'Statement made about plaintiff was factually false',
          present: false,
          evidenceRequired: 'Original publication, recording, screenshot, witness testimony'
        },
        {
          element: 'Publication',
          description: 'Statement was communicated to at least one third party',
          present: false,
          evidenceRequired: 'Witnesses, media distribution evidence, online metrics'
        },
        {
          element: 'Identification',
          description: 'Statement clearly identifies the plaintiff',
          present: false,
          evidenceRequired: 'Direct naming, clear references that identify plaintiff'
        },
        {
          element: 'Reputational Harm',
          description: 'Statement caused harm to reputation or lowered plaintiff in estimation of community',
          present: false,
          evidenceRequired: 'Lost business, social exclusion, emotional distress, changed behavior of others'
        }
      ],
      statutoryBasis: 'Common law tort, principles recognized in Indian judicial decisions',
      standardOfProof: 'Preponderance of evidence (Balance of probabilities)',
      limitationPeriod: '1 year from date of publication',
      keyPrecedents: [
        'Subramanian Swamy v. Union of India (2016) - Constitutional validity of criminal defamation',
        'R. Rajagopal v. State of Tamil Nadu (1994) 6 SCC 632 - Freedom of press and defamation',
        'Justice K.S. Puttaswamy v. Union of India (2017) - Privacy implications in defamation'
      ]
    },
    specific_performance: {
      id: 'specific_performance',
      name: 'Specific Performance',
      description: 'Equitable remedy requiring actual performance of contractual obligations',
      elements: [
        {
          element: 'Valid Contract',
          description: 'Legally enforceable contract exists between parties',
          present: false,
          evidenceRequired: 'Written contract, evidence of agreement terms'
        },
        {
          element: 'Clear and Definite Terms',
          description: 'Contract terms are sufficiently clear to be enforced',
          present: false,
          evidenceRequired: 'Contract language, evidence of mutual understanding of terms'
        },
        {
          element: 'Inadequacy of Damages',
          description: 'Monetary compensation would be inadequate remedy',
          present: false,
          evidenceRequired: 'Unique property, irreplaceable goods, special circumstances'
        },
        {
          element: 'Readiness and Willingness',
          description: 'Plaintiff has performed or is ready to perform their obligations',
          present: false,
          evidenceRequired: 'Payment receipts, evidence of preparation, communication of readiness'
        }
      ],
      statutoryBasis: 'Specific Relief Act, 1963 (Sections 9-25)',
      standardOfProof: 'Balance of probabilities with clear and convincing evidence',
      limitationPeriod: '3 years from date when performance refused',
      keyPrecedents: [
        'Adhunik Steel Ltd. v. Orissa Manganese (2007) 7 SCC 125 - Discretionary nature of remedy',
        'I.S. Sikandar v. K. Subramani (2013) 15 SCC 27 - Ready and willing performance requirement',
        'Her Highness Maharani Shantidevi P. Gaikwad v. Savjibhai Haribhai Patel (2001) 5 SCC 101 - Specific performance of land sale'
      ]
    }
  };
  
  const handleAnalyze = () => {
    const template = causeOfActionTemplates[selectedCauseType];
    if (!template) return;
    
    // Simple analysis based on keyword matching
    const facts = factDescription.toLowerCase();
    const results: AnalysisResult[] = [];
    
    // Overall analysis
    results.push({
      title: `${template.name} Analysis`,
      description: `Analysis for ${template.name} based on provided facts`,
      severity: 'info'
    });
    
    // Check each element
    template.elements.forEach(element => {
      const elementKeywords = element.description.toLowerCase().split(' ').filter(word => word.length > 4);
      const evidenceKeywords = element.evidenceRequired.toLowerCase().split(' ').filter(word => word.length > 4);
      
      const keywordsPresent = [...elementKeywords, ...evidenceKeywords].some(keyword => 
        facts.includes(keyword)
      );
      
      const severity = keywordsPresent ? 'low' : 'high';
      
      results.push({
        title: element.element,
        description: keywordsPresent 
          ? `Potential evidence of ${element.element.toLowerCase()} identified. Required: ${element.description}.` 
          : `No clear evidence of ${element.element.toLowerCase()} identified. Required: ${element.description}.`,
        severity
      });
    });
    
    // Add statutory basis
    results.push({
      title: 'Legal Basis',
      description: `This cause of action is governed by ${template.statutoryBasis}`,
      severity: 'info'
    });
    
    // Add limitation period warning if relevant
    results.push({
      title: 'Limitation Period',
      description: `Time limit to file: ${template.limitationPeriod}. Ensure action is filed within this period.`,
      severity: 'medium'
    });
    
    setAnalyzeResults(results);
  };

  return (
    <BaseAnalyzer
      title="Cause of Action Analyzer"
      description="Analyze elements of common civil causes of action and assess case strength"
      icon={<Search className="h-5 w-5" />}
      onAnalyze={handleAnalyze}
      analysisResults={analyzeResults}
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="cause-type">Cause of Action Type</Label>
          <Select value={selectedCauseType} onValueChange={setSelectedCauseType}>
            <SelectTrigger id="cause-type">
              <SelectValue placeholder="Select cause of action" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(causeOfActionTemplates).map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Select the type of cause of action to analyze its elements
          </p>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="fact-description">Case Fact Description</Label>
          <Textarea
            id="fact-description"
            value={factDescription}
            onChange={(e) => setFactDescription(e.target.value)}
            placeholder="Enter a detailed description of the case facts..."
            className="min-h-[150px] resize-y"
          />
          <p className="text-sm text-muted-foreground">
            Provide as much detail as possible about the relevant facts of the case
          </p>
        </div>
        
        {selectedCauseType && causeOfActionTemplates[selectedCauseType] && (
          <div className="bg-muted/50 rounded-lg p-3">
            <h3 className="text-sm font-medium mb-2">Elements of {causeOfActionTemplates[selectedCauseType].name}</h3>
            <ul className="space-y-1 text-sm">
              {causeOfActionTemplates[selectedCauseType].elements.map((element, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{element.element} - {element.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </BaseAnalyzer>
  );
};

export default CauseOfActionAnalyzer;
