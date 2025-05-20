
// Type definitions for the Argument Builder component

export interface ArgumentBuilderType {
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
  constitutionalProvisions: string[];
}
