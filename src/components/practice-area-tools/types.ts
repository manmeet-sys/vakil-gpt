
import { ReactNode } from 'react';

export interface BaseToolProps {
  useAI?: boolean;
  aiDescription?: string;
  aiPrompt?: string;
  className?: string;
  isLoading?: boolean;
  children?: ReactNode;
}

export interface BaseAnalyzerProps extends BaseToolProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export interface BaseCalculatorProps extends BaseToolProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export interface BaseDocumentGeneratorProps extends BaseToolProps {
  title: string;
  description: string;
  icon: ReactNode;
}

// Add shared result types
export interface ToolResult {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  category?: string;
  severity?: 'high' | 'medium' | 'low' | 'info';
}

// Add accessibility props that all tools should implement
export interface AccessibilityProps {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaLabelledBy?: string;
}

// Add responsive design props
export interface ResponsiveProps {
  mobileLayout?: 'stacked' | 'tabbed' | 'accordion';
  tabletLayout?: 'stacked' | 'tabbed' | 'accordion';
  desktopLayout?: 'stacked' | 'tabbed' | 'accordion';
}
