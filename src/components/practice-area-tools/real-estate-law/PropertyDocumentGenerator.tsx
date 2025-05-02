
import React, { useState } from 'react';
import { BaseDocumentGenerator } from '../base';
import { FileText } from 'lucide-react';
import { BaseToolProps } from '../types';

interface PropertyDocumentGeneratorProps extends BaseToolProps {}

const PropertyDocumentGenerator: React.FC<PropertyDocumentGeneratorProps> = ({ useAI = false, aiPrompt }) => {
  const [formData, setFormData] = useState({});
  const [generatedDocument, setGeneratedDocument] = useState<{ title: string; content: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      setGeneratedDocument({
        title: "Property Sale Deed",
        content: "This is a sample sale deed for property transfer..."
      });
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <BaseDocumentGenerator
      title="Property Document Generator"
      description="Advanced tool to generate legally sound property documents including sale deeds, lease agreements, and conveyance deeds"
      icon={<FileText className="h-5 w-5 text-blue-600" />}
      handleGenerate={handleGenerate}
      isGenerating={isGenerating}
      generatedDocument={generatedDocument || undefined}
      useAI={useAI}
      aiPrompt={aiPrompt}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter property and transaction details to generate customized legal documents.
        </p>
      </div>
    </BaseDocumentGenerator>
  );
};

export default PropertyDocumentGenerator;
