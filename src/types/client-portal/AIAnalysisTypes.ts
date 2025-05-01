
// AI Analysis Types
export interface OutcomePrediction {
  likelihood: number;
  favorableOutcome: boolean;
  reasoning: string;
  keyFactors: string[];
  similarCases: Array<{
    name: string;
    citation: string;
    outcome: string;
    relevance: string;
  }>;
  alternativeStrategies: string[];
}

export interface ArgumentBuilder {
  mainArguments: Array<{
    title: string;
    description: string;
    strength: 'strong' | 'moderate' | 'weak';
    supportingLaws: string[];
    supportingCases: string[];
  }>;
  counterArguments: Array<{
    title: string;
    description: string;
    refutationStrategy: string;
  }>;
  statutoryReferences: string[];
  caseReferences: string[];
  constitutionalProvisions?: string[];
}
