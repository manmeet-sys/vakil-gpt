
import { LegalTemplate, TemplateCategory, TemplateSearchFilters, TemplateSearchResult } from '@/types/template';

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
  private templates: LegalTemplate[] = [];
  private isLoaded: boolean = false;

  static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
    }
    return TemplateService.instance;
  }

  async loadTemplates(): Promise<void> {
    if (this.isLoaded) return;

    try {
      // In a real implementation, this would load from your JSON files or API
      // For now, we'll use sample templates
      this.templates = await this.loadSampleTemplates();
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load templates:', error);
      throw error;
    }
  }

  private async loadSampleTemplates(): Promise<LegalTemplate[]> {
    // Sample templates - in production, load from your JSON files
    return [
      {
        id: '1',
        title: 'Employment Contract - Full Time',
        category: 'employment',
        subcategory: 'contracts',
        jurisdiction: ['India'],
        complexity: 'basic',
        tags: ['employment', 'full-time', 'contract'],
        description: 'Standard full-time employment contract with comprehensive terms and conditions.',
        content: 'EMPLOYMENT AGREEMENT\n\nThis Employment Agreement is entered into on [START_DATE] between [COMPANY_NAME] and [EMPLOYEE_NAME]...',
        placeholders: {
          START_DATE: '',
          COMPANY_NAME: '',
          EMPLOYEE_NAME: '',
          POSITION: '',
          SALARY: '',
          DEPARTMENT: ''
        },
        metadata: {
          author: 'VakilGPT',
          lastUpdated: '2024-01-15',
          version: '1.0',
          usage_count: 45,
          difficulty: 'beginner',
          estimatedTime: '15-20 minutes'
        }
      },
      {
        id: '2',
        title: 'Rental Agreement - Residential',
        category: 'property',
        subcategory: 'lease',
        jurisdiction: ['India'],
        complexity: 'basic',
        tags: ['rental', 'residential', 'lease'],
        description: 'Standard residential rental agreement compliant with Indian tenancy laws.',
        content: 'RENTAL AGREEMENT\n\nThis Rental Agreement is made on [DATE] between [LANDLORD_NAME] and [TENANT_NAME]...',
        placeholders: {
          DATE: '',
          LANDLORD_NAME: '',
          TENANT_NAME: '',
          PROPERTY_ADDRESS: '',
          RENT_AMOUNT: '',
          SECURITY_DEPOSIT: ''
        },
        metadata: {
          author: 'VakilGPT',
          lastUpdated: '2024-01-10',
          version: '1.2',
          usage_count: 78,
          difficulty: 'beginner',
          estimatedTime: '10-15 minutes'
        }
      }
    ];
  }

  async searchTemplates(filters: TemplateSearchFilters): Promise<TemplateSearchResult> {
    await this.loadTemplates();

    let filteredTemplates = [...this.templates];

    // Apply filters
    if (filters.category) {
      filteredTemplates = filteredTemplates.filter(t => t.category === filters.category);
    }

    if (filters.subcategory) {
      filteredTemplates = filteredTemplates.filter(t => t.subcategory === filters.subcategory);
    }

    if (filters.complexity) {
      filteredTemplates = filteredTemplates.filter(t => t.complexity === filters.complexity);
    }

    if (filters.jurisdiction && filters.jurisdiction.length > 0) {
      filteredTemplates = filteredTemplates.filter(t => 
        t.jurisdiction.some(j => filters.jurisdiction!.includes(j))
      );
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredTemplates = filteredTemplates.filter(t =>
        t.title.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by usage count and relevance
    filteredTemplates.sort((a, b) => b.metadata.usage_count - a.metadata.usage_count);

    return {
      templates: filteredTemplates,
      totalCount: filteredTemplates.length,
      categories: TEMPLATE_CATEGORIES,
      facets: {
        jurisdictions: [...new Set(this.templates.flatMap(t => t.jurisdiction))],
        complexities: [...new Set(this.templates.map(t => t.complexity))],
        tags: [...new Set(this.templates.flatMap(t => t.tags))]
      }
    };
  }

  async getTemplateById(id: string): Promise<LegalTemplate | null> {
    await this.loadTemplates();
    return this.templates.find(t => t.id === id) || null;
  }

  async getTemplatesByCategory(category: string, subcategory?: string): Promise<LegalTemplate[]> {
    await this.loadTemplates();
    return this.templates.filter(t => 
      t.category === category && (!subcategory || t.subcategory === subcategory)
    );
  }

  async getFeaturedTemplates(limit: number = 10): Promise<LegalTemplate[]> {
    await this.loadTemplates();
    return this.templates
      .filter(t => t.isFeatured)
      .sort((a, b) => b.metadata.usage_count - a.metadata.usage_count)
      .slice(0, limit);
  }

  async getPopularTemplates(limit: number = 10): Promise<LegalTemplate[]> {
    await this.loadTemplates();
    return this.templates
      .sort((a, b) => b.metadata.usage_count - a.metadata.usage_count)
      .slice(0, limit);
  }

  async incrementUsageCount(templateId: string): Promise<void> {
    const template = await this.getTemplateById(templateId);
    if (template) {
      template.metadata.usage_count++;
      // In production, save to database/storage
    }
  }
}

export const templateService = TemplateService.getInstance();
