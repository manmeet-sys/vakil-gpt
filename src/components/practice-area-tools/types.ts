
import { ReactNode } from 'react';

// Base tool types
export interface BaseTool {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

export interface PracticeAreaTool extends BaseTool {
  component: ReactNode;
}

// Practice area specific types
export interface CivilLawTool extends BaseTool {}
export interface CriminalLawTool extends BaseTool {}
export interface FamilyLawTool extends BaseTool {}
export interface MatrimonialLawTool extends BaseTool {}
export interface CorporateLawTool extends BaseTool {}
export interface RealEstateLawTool extends BaseTool {}

// Calculator types
export interface CalculatorInput {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'radio' | 'checkbox';
  options?: { value: string; label: string }[];
  defaultValue?: string | number | boolean | Date;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
}

export interface CalculatorResult {
  label: string;
  value: string | number | boolean | Date;
  description?: string;
  highlightColor?: string;
}

// Document generator types
export interface DocumentField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'radio' | 'checkbox';
  options?: { value: string; label: string }[];
  defaultValue?: string | number | boolean | Date;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  fields: DocumentField[];
  template: string;
}

// Analyzer types
export interface AnalyzerInput {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'file' | 'select' | 'radio' | 'checkbox';
  options?: { value: string; label: string }[];
  defaultValue?: string | number | boolean | File | null;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  accept?: string; // For file inputs
}

export interface AnalyzerResult {
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high' | 'info';
  details?: Record<string, any>;
}
