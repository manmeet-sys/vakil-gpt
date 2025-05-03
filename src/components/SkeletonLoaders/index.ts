
// Export all skeleton loaders
export { default as MADueDiligenceSkeleton } from './MADueDiligenceSkeleton';
export { 
  CompanyFormationSkeleton,
  ComplianceCalendarSkeleton,
  ContractRiskAnalyzerSkeleton
} from './CorporateToolsSkeleton';
export {
  TitleSearchSkeleton,
  RERAComplianceSkeleton,
  PropertyDocumentSkeleton,
  PropertyDueDiligenceSkeleton
} from './RealEstateToolsSkeleton';
export { 
  SentencingPredictorSkeleton, 
  PleaBargainSkeleton 
} from './PracticeAreaToolSkeleton';
export { PracticeAreaToolSkeleton } from './PracticeAreaToolSkeleton';

// Import and re-export as aliases for different practice areas
import { PracticeAreaToolSkeleton as FamilyLawToolsSkeleton } from './PracticeAreaToolSkeleton';
import { PracticeAreaToolSkeleton as CivilLawToolsSkeleton } from './PracticeAreaToolSkeleton';
import { PracticeAreaToolSkeleton as MatrimonialLawToolsSkeleton } from './PracticeAreaToolSkeleton';

// Export the aliases
export { FamilyLawToolsSkeleton, CivilLawToolsSkeleton, MatrimonialLawToolsSkeleton };
