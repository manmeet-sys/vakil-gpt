
import { LegalTemplate, TemplateCategory, TemplateSearchFilters, TemplateSearchResult } from '@/types/template';
import { supabase } from '@/integrations/supabase/client';

// Enhanced template categories with subcategories
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: 'employment',
    name: 'Employment Law',
    description: 'Employment contracts, agreements, and HR documents',
    icon: 'Briefcase',
    color: 'blue',
    subcategories: [
      { id: 'contracts', name: 'Employment Contracts', description: 'Job offers, appointments, terms of employment' },
      { id: 'termination', name: 'Termination Documents', description: 'Resignation, termination, exit procedures' },
      { id: 'policies', name: 'HR Policies', description: 'Company policies, handbooks, procedures' },
      { id: 'compliance', name: 'Labor Compliance', description: 'PF, ESI, labor law compliance documents' },
      { id: 'agreements', name: 'Employment Agreements', description: 'Non-compete, confidentiality, service agreements' }
    ]
  },
  {
    id: 'corporate',
    name: 'Corporate Law',
    description: 'Corporate governance, compliance, and business documents',
    icon: 'Building',
    color: 'purple',
    subcategories: [
      { id: 'incorporation', name: 'Company Formation', description: 'MOA, AOA, incorporation documents' },
      { id: 'governance', name: 'Corporate Governance', description: 'Board resolutions, shareholder agreements' },
      { id: 'compliance', name: 'Regulatory Compliance', description: 'ROC filings, annual returns, compliance certificates' },
      { id: 'transactions', name: 'Corporate Transactions', description: 'M&A, joint ventures, asset transfers' },
      { id: 'contracts', name: 'Business Contracts', description: 'Service agreements, vendor contracts, partnerships' }
    ]
  },
  {
    id: 'property',
    name: 'Property Law',
    description: 'Real estate transactions, leases, and property documents',
    icon: 'Home',
    color: 'green',
    subcategories: [
      { id: 'sale', name: 'Property Sale', description: 'Sale deeds, purchase agreements, transfer documents' },
      { id: 'lease', name: 'Lease & Rental', description: 'Rental agreements, lease deeds, tenancy documents' },
      { id: 'mortgage', name: 'Mortgage & Loans', description: 'Mortgage deeds, loan agreements, security documents' },
      { id: 'development', name: 'Property Development', description: 'Construction agreements, development contracts' },
      { id: 'disputes', name: 'Property Disputes', description: 'Eviction notices, dispute resolution documents' }
    ]
  },
  {
    id: 'family',
    name: 'Family Law',
    description: 'Marriage, divorce, custody, and family-related legal documents',
    icon: 'Users',
    color: 'pink',
    subcategories: [
      { id: 'marriage', name: 'Marriage Documents', description: 'Prenuptial agreements, marriage contracts' },
      { id: 'divorce', name: 'Divorce & Separation', description: 'Divorce petitions, separation agreements, settlements' },
      { id: 'custody', name: 'Child Custody', description: 'Custody agreements, visitation rights, support orders' },
      { id: 'adoption', name: 'Adoption', description: 'Adoption petitions, consent forms, legal procedures' },
      { id: 'inheritance', name: 'Wills & Inheritance', description: 'Wills, succession certificates, probate documents' }
    ]
  },
  {
    id: 'litigation',
    name: 'Litigation',
    description: 'Court proceedings, legal notices, and dispute resolution',
    icon: 'Scale',
    color: 'red',
    subcategories: [
      { id: 'civil', name: 'Civil Litigation', description: 'Civil suits, plaints, written statements' },
      { id: 'criminal', name: 'Criminal Proceedings', description: 'FIR, bail applications, criminal petitions' },
      { id: 'notices', name: 'Legal Notices', description: 'Legal notices, demand letters, cease and desist' },
      { id: 'appeals', name: 'Appeals & Reviews', description: 'Appeal petitions, revision applications' },
      { id: 'arbitration', name: 'Alternative Dispute Resolution', description: 'Arbitration agreements, mediation documents' }
    ]
  },
  {
    id: 'intellectual-property',
    name: 'Intellectual Property',
    description: 'Patents, trademarks, copyrights, and IP protection',
    icon: 'Lightbulb',
    color: 'orange',
    subcategories: [
      { id: 'patents', name: 'Patents', description: 'Patent applications, licensing agreements' },
      { id: 'trademarks', name: 'Trademarks', description: 'Trademark applications, registrations, oppositions' },
      { id: 'copyrights', name: 'Copyrights', description: 'Copyright registrations, licensing, assignments' },
      { id: 'licensing', name: 'IP Licensing', description: 'License agreements, technology transfers' },
      { id: 'enforcement', name: 'IP Enforcement', description: 'Infringement notices, enforcement actions' }
    ]
  },
  {
    id: 'finance',
    name: 'Banking & Finance',
    description: 'Financial agreements, loans, and banking documents',
    icon: 'DollarSign',
    color: 'emerald',
    subcategories: [
      { id: 'loans', name: 'Loan Agreements', description: 'Personal loans, business loans, term sheets' },
      { id: 'guarantees', name: 'Guarantees & Securities', description: 'Bank guarantees, security documents, collateral' },
      { id: 'banking', name: 'Banking Documents', description: 'Account agreements, banking contracts' },
      { id: 'investment', name: 'Investment Documents', description: 'Investment agreements, fund documents' },
      { id: 'insurance', name: 'Insurance', description: 'Insurance policies, claims, coverage documents' }
    ]
  },
  {
    id: 'tax',
    name: 'Tax & Compliance',
    description: 'Tax filings, compliance documents, and regulatory matters',
    icon: 'Calculator',
    color: 'yellow',
    subcategories: [
      { id: 'income-tax', name: 'Income Tax', description: 'ITR filings, tax assessments, appeals' },
      { id: 'gst', name: 'GST Documents', description: 'GST registrations, returns, compliance' },
      { id: 'audit', name: 'Tax Audits', description: 'Audit reports, compliance certificates' },
      { id: 'planning', name: 'Tax Planning', description: 'Tax planning documents, structuring advice' },
      { id: 'penalties', name: 'Penalties & Appeals', description: 'Penalty responses, tax appeals, representations' }
    ]
  }
];

// Template service class for managing templates
export class TemplateService {
  private static instance: TemplateService;

  static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
    }
    return TemplateService.instance;
  }

  private transformDatabaseTemplate(dbTemplate: any): LegalTemplate {
    return {
      id: dbTemplate.id,
      title: dbTemplate.title,
      category: dbTemplate.category || '',
      subcategory: dbTemplate.subcategory || '',
      jurisdiction: dbTemplate.jurisdiction || ['India'],
      complexity: dbTemplate.complexity as 'basic' | 'intermediate' | 'advanced',
      tags: dbTemplate.tags || [],
      description: dbTemplate.description || '',
      content: dbTemplate.content || '',
      placeholders: dbTemplate.placeholders || {},
      metadata: {
        author: dbTemplate.metadata?.author || 'VakilGPT',
        lastUpdated: dbTemplate.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        version: dbTemplate.metadata?.version || '1.0',
        usage_count: dbTemplate.metadata?.usage_count || 0,
        difficulty: this.mapComplexityToDifficulty(dbTemplate.complexity),
        estimatedTime: dbTemplate.metadata?.estimatedTime || '10-15 minutes',
        requiredFields: Object.keys(dbTemplate.placeholders || {}),
        relatedTemplates: dbTemplate.metadata?.relatedTemplates || []
      },
      isActive: dbTemplate.is_active !== false,
      isFeatured: dbTemplate.is_featured === true,
      downloadCount: dbTemplate.metadata?.usage_count || 0
    };
  }

  private mapComplexityToDifficulty(complexity: string): 'beginner' | 'intermediate' | 'advanced' {
    switch (complexity) {
      case 'advanced': return 'advanced';
      case 'intermediate': return 'intermediate';
      default: return 'beginner';
    }
  }

  async searchTemplates(filters: TemplateSearchFilters): Promise<TemplateSearchResult> {
    try {
      let query = supabase
        .from('templates')
        .select('*')
        .eq('is_active', true);

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.subcategory) {
        query = query.eq('subcategory', filters.subcategory);
      }

      if (filters.complexity) {
        query = query.eq('complexity', filters.complexity);
      }

      if (filters.jurisdiction && filters.jurisdiction.length > 0) {
        query = query.overlaps('jurisdiction', filters.jurisdiction);
      }

      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching templates:', error);
        throw error;
      }

      const templates = (data || []).map(this.transformDatabaseTemplate);

      return {
        templates,
        totalCount: templates.length,
        categories: TEMPLATE_CATEGORIES,
        facets: {
          jurisdictions: [...new Set(templates.flatMap(t => t.jurisdiction))],
          complexities: [...new Set(templates.map(t => t.complexity))],
          tags: [...new Set(templates.flatMap(t => t.tags))]
        }
      };
    } catch (error) {
      console.error('Failed to search templates:', error);
      throw error;
    }
  }

  async getTemplateById(id: string): Promise<LegalTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Template not found
        }
        throw error;
      }

      return this.transformDatabaseTemplate(data);
    } catch (error) {
      console.error('Failed to get template by ID:', error);
      throw error;
    }
  }

  async getTemplatesByCategory(category: string, subcategory?: string): Promise<LegalTemplate[]> {
    try {
      let query = supabase
        .from('templates')
        .select('*')
        .eq('category', category)
        .eq('is_active', true);

      if (subcategory) {
        query = query.eq('subcategory', subcategory);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(this.transformDatabaseTemplate);
    } catch (error) {
      console.error('Failed to get templates by category:', error);
      throw error;
    }
  }

  async getFeaturedTemplates(limit: number = 10): Promise<LegalTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return (data || []).map(this.transformDatabaseTemplate);
    } catch (error) {
      console.error('Failed to get featured templates:', error);
      throw error;
    }
  }

  async getPopularTemplates(limit: number = 10): Promise<LegalTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('is_active', true)
        .order('metadata->usage_count', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return (data || []).map(this.transformDatabaseTemplate);
    } catch (error) {
      console.error('Failed to get popular templates:', error);
      throw error;
    }
  }

  async incrementUsageCount(templateId: string): Promise<void> {
    try {
      // First get the current template
      const { data: template, error: fetchError } = await supabase
        .from('templates')
        .select('metadata')
        .eq('id', templateId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const currentMetadata = template?.metadata || {};
      const currentUsageCount = currentMetadata.usage_count || 0;

      // Update the usage count
      const { error: updateError } = await supabase
        .from('templates')
        .update({
          metadata: {
            ...currentMetadata,
            usage_count: currentUsageCount + 1
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', templateId);

      if (updateError) {
        throw updateError;
      }
    } catch (error) {
      console.error('Failed to increment usage count:', error);
      throw error;
    }
  }
}

export const templateService = TemplateService.getInstance();
