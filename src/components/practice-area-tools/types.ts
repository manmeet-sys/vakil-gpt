
import { ReactNode } from 'react';

export interface BaseToolProps {
  useAI?: boolean;
  aiDescription?: string;
  aiPrompt?: string;
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
