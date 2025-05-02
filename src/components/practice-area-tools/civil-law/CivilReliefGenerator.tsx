
import React, { useState } from 'react';
import { BaseDocumentGenerator } from '@/components/practice-area-tools/base';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { generateFromTemplate } from '@/components/practice-area-tools/utils';
import { FilePenLine } from 'lucide-react';

interface CaseDetail {
  caseTitle: string;
  caseNumber: string;
  court: string;
  plaintiff: string;
  defendant: string;
}

interface ReliefTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  extraFields: {
    id: string;
    label: string;
    type: 'text' | 'number' | 'textarea';
    placeholder?: string;
  }[];
}

const CivilReliefGenerator: React.FC = () => {
  const [caseDetails, setCaseDetails] = useState<CaseDetail>({
    caseTitle: '',
    caseNumber: '',
    court: '',
    plaintiff: '',
    defendant: ''
  });
  
  const [selectedReliefType, setSelectedReliefType] = useState('declaratory');
  const [useProvisionalRelief, setUseProvisionalRelief] = useState(false);
  const [additionalFields, setAdditionalFields] = useState<Record<string, string>>({});
  const [generatedRelief, setGeneratedRelief] = useState('');
  
  const reliefTemplates: Record<string, ReliefTemplate> = {
    declaratory: {
      id: 'declaratory',
      name: 'Declaratory Relief',
      description: 'Requests the court to declare rights, status, or legal relations',
      template: `PRAYER/RELIEF SOUGHT

WHEREFORE, the Plaintiff {{plaintiff}} respectfully prays that this Hon'ble Court may be pleased to:

1. Declare that the Plaintiff is the rightful {{right_type}} of {{subject_matter}};

2. Declare that the actions of the Defendant, {{defendant}}, in {{disputed_action}} are illegal, unlawful and void ab initio;

3. Issue a declaration clarifying the respective rights and obligations of the parties with regard to {{subject_matter}};

4. {{additional_declaration}}

5. Award costs of the proceedings to the Plaintiff;

6. Grant such other relief(s) as this Hon'ble Court may deem fit and proper in the interests of justice.

Date: [DATE]
Place: [PLACE]

Advocate for the Plaintiff`,
      extraFields: [
        {
          id: 'right_type',
          label: 'Right Type',
          type: 'text',
          placeholder: 'e.g., owner, legal heir, beneficiary'
        },
        {
          id: 'subject_matter',
          label: 'Subject Matter',
          type: 'text',
          placeholder: 'e.g., the property bearing No. 123, Main Street'
        },
        {
          id: 'disputed_action',
          label: 'Disputed Action',
          type: 'textarea',
          placeholder: 'e.g., attempting to alienate the said property without legal right'
        },
        {
          id: 'additional_declaration',
          label: 'Additional Declaration (Optional)',
          type: 'textarea',
          placeholder: 'e.g., Declare that the agreement dated DD/MM/YYYY is not binding on the Plaintiff'
        }
      ]
    },
    specific_performance: {
      id: 'specific_performance',
      name: 'Specific Performance',
      description: 'Requests the court to compel a party to perform a specific act',
      template: `PRAYER/RELIEF SOUGHT

WHEREFORE, the Plaintiff {{plaintiff}} respectfully prays that this Hon'ble Court may be pleased to:

1. Direct the Defendant, {{defendant}}, to specifically perform the {{agreement_type}} dated {{agreement_date}} by {{performance_action}};

2. Direct the Defendant to execute all necessary documents and take all necessary steps to effectuate the {{agreement_type}};

3. Restrain the Defendant, by a permanent injunction, from {{prohibited_action}};

4. Direct the Defendant to pay the costs of this suit;

5. Grant such other and further relief(s) as this Hon'ble Court may deem fit and proper in the interests of justice.

Date: [DATE]
Place: [PLACE]

Advocate for the Plaintiff`,
      extraFields: [
        {
          id: 'agreement_type',
          label: 'Agreement Type',
          type: 'text',
          placeholder: 'e.g., sale agreement, service contract'
        },
        {
          id: 'agreement_date',
          label: 'Agreement Date',
          type: 'text',
          placeholder: 'e.g., 01/01/2023'
        },
        {
          id: 'performance_action',
          label: 'Performance Action',
          type: 'textarea',
          placeholder: 'e.g., transferring the property bearing No. 123, Main Street to the Plaintiff'
        },
        {
          id: 'prohibited_action',
          label: 'Prohibited Action',
          type: 'textarea',
          placeholder: 'e.g., alienating, encumbering, or creating third-party rights over the subject property'
        }
      ]
    },
    recovery_of_money: {
      id: 'recovery_of_money',
      name: 'Recovery of Money',
      description: 'Requests the court to order payment of a monetary sum',
      template: `PRAYER/RELIEF SOUGHT

WHEREFORE, the Plaintiff {{plaintiff}} respectfully prays that this Hon'ble Court may be pleased to:

1. Direct the Defendant, {{defendant}}, to pay to the Plaintiff a sum of Rs. {{claim_amount}}/- (Rupees {{claim_amount_words}} Only) along with interest at the rate of {{interest_rate}}% per annum from the date of {{interest_from_date}} till the date of realization;

2. Direct the Defendant to pay the costs of this suit;

3. {{additional_monetary_relief}}

4. Grant such other and further relief(s) as this Hon'ble Court may deem fit and proper in the interests of justice.

Date: [DATE]
Place: [PLACE]

Advocate for the Plaintiff`,
      extraFields: [
        {
          id: 'claim_amount',
          label: 'Claim Amount (in numbers)',
          type: 'number',
          placeholder: 'e.g., 1000000'
        },
        {
          id: 'claim_amount_words',
          label: 'Claim Amount (in words)',
          type: 'text',
          placeholder: 'e.g., Ten Lakhs'
        },
        {
          id: 'interest_rate',
          label: 'Interest Rate (%)',
          type: 'number',
          placeholder: 'e.g., 12'
        },
        {
          id: 'interest_from_date',
          label: 'Interest From Date',
          type: 'text',
          placeholder: 'e.g., filing of the suit, date of breach (01/01/2023)'
        },
        {
          id: 'additional_monetary_relief',
          label: 'Additional Monetary Relief (Optional)',
          type: 'textarea',
          placeholder: 'e.g., Direct the Defendant to pay compensation of Rs. 500,000/- for mental agony and harassment'
        }
      ]
    },
    injunction: {
      id: 'injunction',
      name: 'Injunction Relief',
      description: 'Requests the court to prohibit or mandate specific actions',
      template: `PRAYER/RELIEF SOUGHT

WHEREFORE, the Plaintiff {{plaintiff}} respectfully prays that this Hon'ble Court may be pleased to:

1. Issue a permanent injunction restraining the Defendant, {{defendant}}, their agents, servants, representatives and any person claiming through them from {{prohibited_action}};

2. {{additional_injunction}}

3. Direct the Defendant to pay the costs of this suit;

4. Grant such other and further relief(s) as this Hon'ble Court may deem fit and proper in the interests of justice.

Date: [DATE]
Place: [PLACE]

Advocate for the Plaintiff`,
      extraFields: [
        {
          id: 'prohibited_action',
          label: 'Prohibited Action',
          type: 'textarea',
          placeholder: 'e.g., interfering with the peaceful possession and enjoyment of the property bearing No. 123, Main Street'
        },
        {
          id: 'additional_injunction',
          label: 'Additional Injunction (Optional)',
          type: 'textarea',
          placeholder: 'e.g., Direct the Defendant to remove the encroachment from the eastern boundary of the property'
        }
      ]
    }
  };
  
  // Provisional relief templates
  const provisionalReliefTemplates: Record<string, string> = {
    declaratory: `INTERIM RELIEF

In addition to the final reliefs sought above, the Plaintiff also prays that pending the hearing and final disposal of this suit:

1. This Hon'ble Court may be pleased to issue an interim declaration recognizing the prima facie rights of the Plaintiff in respect of {{subject_matter}};

2. Direct maintenance of status quo with respect to {{subject_matter}} until the final disposal of the suit;

3. Pass such other or further orders as may be deemed necessary in the interest of justice.`,
    specific_performance: `INTERIM RELIEF

In addition to the final reliefs sought above, the Plaintiff also prays that pending the hearing and final disposal of this suit:

1. This Hon'ble Court may be pleased to restrain the Defendant by a temporary injunction from {{prohibited_action}};

2. Direct the Defendant to deposit the subject matter of the suit or suitable security with this Hon'ble Court;

3. Pass such other or further orders as may be deemed necessary in the interest of justice.`,
    recovery_of_money: `INTERIM RELIEF

In addition to the final reliefs sought above, the Plaintiff also prays that pending the hearing and final disposal of this suit:

1. This Hon'ble Court may be pleased to direct the Defendant to furnish security for the amount claimed in the suit;

2. Restrain the Defendant from alienating or encumbering their assets to the extent of the claim amount, i.e., Rs. {{claim_amount}}/- (Rupees {{claim_amount_words}} Only);

3. Pass such other or further orders as may be deemed necessary in the interest of justice.`,
    injunction: `INTERIM RELIEF

In addition to the final reliefs sought above, the Plaintiff also prays that pending the hearing and final disposal of this suit:

1. This Hon'ble Court may be pleased to issue an ad-interim ex-parte injunction restraining the Defendant from {{prohibited_action}};

2. Direct maintenance of status quo with respect to the subject matter of the suit;

3. Pass such other or further orders as may be deemed necessary in the interest of justice.`
  };
  
  const handleCaseDetailChange = (key: keyof CaseDetail, value: string) => {
    setCaseDetails(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleAdditionalFieldChange = (fieldId: string, value: string) => {
    setAdditionalFields(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };
  
  const handleGenerateDocument = () => {
    const selectedTemplate = reliefTemplates[selectedReliefType];
    if (!selectedTemplate) return;
    
    // Prepare fields for template generation
    const fields = {
      ...caseDetails,
      ...additionalFields
    };
    
    // Generate main relief
    let relief = generateFromTemplate(selectedTemplate.template, fields);
    
    // Add provisional relief if selected
    if (useProvisionalRelief && provisionalReliefTemplates[selectedReliefType]) {
      const provisionalRelief = generateFromTemplate(provisionalReliefTemplates[selectedReliefType], fields);
      relief = `${relief}\n\n${provisionalRelief}`;
    }
    
    setGeneratedRelief(relief);
  };

  return (
    <BaseDocumentGenerator
      title="Civil Relief Generator"
      description="Generate properly formatted prayers and relief clauses for civil petitions"
      icon={<FilePenLine className="h-5 w-5" />}
      onGenerate={handleGenerateDocument}
      generatedContent={generatedRelief}
    >
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="case-title">Case Title</Label>
            <Input
              id="case-title"
              value={caseDetails.caseTitle}
              onChange={(e) => handleCaseDetailChange('caseTitle', e.target.value)}
              placeholder="e.g., Sharma v. Patel"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="case-number">Case Number (Optional)</Label>
            <Input
              id="case-number"
              value={caseDetails.caseNumber}
              onChange={(e) => handleCaseDetailChange('caseNumber', e.target.value)}
              placeholder="e.g., CS/123/2023"
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="court">Court</Label>
          <Input
            id="court"
            value={caseDetails.court}
            onChange={(e) => handleCaseDetailChange('court', e.target.value)}
            placeholder="e.g., High Court of Delhi"
          />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="plaintiff">Plaintiff/Petitioner</Label>
            <Input
              id="plaintiff"
              value={caseDetails.plaintiff}
              onChange={(e) => handleCaseDetailChange('plaintiff', e.target.value)}
              placeholder="Full name of plaintiff"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="defendant">Defendant/Respondent</Label>
            <Input
              id="defendant"
              value={caseDetails.defendant}
              onChange={(e) => handleCaseDetailChange('defendant', e.target.value)}
              placeholder="Full name of defendant"
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="relief-type">Type of Relief</Label>
          <Select value={selectedReliefType} onValueChange={setSelectedReliefType}>
            <SelectTrigger id="relief-type">
              <SelectValue placeholder="Select relief type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(reliefTemplates).map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {selectedReliefType && reliefTemplates[selectedReliefType]?.description}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="use-provisional" 
            checked={useProvisionalRelief}
            onCheckedChange={setUseProvisionalRelief}
          />
          <Label htmlFor="use-provisional">Include Provisional/Interim Relief</Label>
        </div>
        
        {selectedReliefType && reliefTemplates[selectedReliefType]?.extraFields.map(field => (
          <div className="grid gap-2" key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            {field.type === 'textarea' ? (
              <Textarea
                id={field.id}
                value={additionalFields[field.id] || ''}
                onChange={(e) => handleAdditionalFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder}
              />
            ) : (
              <Input
                id={field.id}
                type={field.type}
                value={additionalFields[field.id] || ''}
                onChange={(e) => handleAdditionalFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
      </div>
    </BaseDocumentGenerator>
  );
};

export default CivilReliefGenerator;
