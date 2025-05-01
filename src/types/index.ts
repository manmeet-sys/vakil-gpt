
// Central export file for all types

// Explicitly re-export types to avoid conflicts between GlobalTypes and client-portal files
// Use namespaced exports to prevent ambiguity
export * as ClientPortal from './client-portal/CaseTypes';
export * as ClientCommunication from './client-portal/CommunicationTypes'; 
export * as ClientDocuments from './client-portal/DocumentTypes';
export * as AIAnalysis from './client-portal/AIAnalysisTypes';

// These don't have conflicts so we can export them directly
export * from './UserReviews';
export * from './GlobalTypes';
