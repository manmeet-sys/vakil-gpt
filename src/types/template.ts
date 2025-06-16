
// Core template type definitions
export interface TemplateMetadata {
  author: string;
  lastUpdated: string;
  version: string;
  usage_count: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  requiredFields?: string[];
  relatedTemplates?: string[];
}

export interface TemplatePlaceholder {
  [key: string]: string | number | boolean;
}

export interface LegalTemplate {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  jurisdiction: string[];
  complexity: 'basic' | 'intermediate' | 'advanced';
  tags: string[];
  description: string;
  content: string;
  placeholders: TemplatePlaceholder;
  metadata: TemplateMetadata;
  isActive?: boolean;
  isFeatured?: boolean;
  downloadCount?: number;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  subcategories: TemplateSubcategory[];
  icon?: string;
  color?: string;
}

export interface TemplateSubcategory {
  id: string;
  name: string;
  description: string;
  templateCount?: number;
}

export interface TemplateSearchFilters {
  category?: string;
  subcategory?: string;
  jurisdiction?: string[];
  complexity?: string;
  tags?: string[];
  searchTerm?: string;
}

export interface TemplateSearchResult {
  templates: LegalTemplate[];
  totalCount: number;
  categories: TemplateCategory[];
  facets: {
    jurisdictions: string[];
    complexities: string[];
    tags: string[];
  };
}
