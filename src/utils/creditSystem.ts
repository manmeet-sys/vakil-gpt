// Credit costs for different actions
export const CREDIT_COSTS = {
  chat_free: 0,        // Free chat is unlimited
  doc_analysis: 200,   // Document analysis
  case_law: 150,       // Case law research
  drafting: 300,       // Document drafting
  research: 300,       // Advanced research
  bulk_export: 500,    // Bulk export
} as const;

export type ActionType = keyof typeof CREDIT_COSTS;

// Get the cost for a specific action
export const getActionCost = (action: ActionType): number => {
  return CREDIT_COSTS[action];
};

// Get human-readable action names
export const getActionName = (action: ActionType): string => {
  const names: Record<ActionType, string> = {
    chat_free: 'Free Chat',
    doc_analysis: 'Document Analysis',
    case_law: 'Case Law Research',
    drafting: 'Document Drafting',
    research: 'Advanced Research',
    bulk_export: 'Bulk Export',
  };
  return names[action];
};