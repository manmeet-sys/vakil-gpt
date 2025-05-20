
export interface ArgumentBuilderType {
  mainArguments: {
    title: string;
    description: string;
    strength: "strong" | "moderate" | "weak";
    supportingLaws: string[];
    supportingCases: string[];
  }[];
  counterArguments: {
    title: string;
    description: string;
    refutationStrategy: string;
  }[];
  statutoryReferences: string[];
  caseReferences: string[];
  constitutionalProvisions: string[];
}
