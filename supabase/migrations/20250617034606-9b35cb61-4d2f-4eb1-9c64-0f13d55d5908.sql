
-- Create templates table for legal document drafting
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT,
  subcategory TEXT,
  jurisdiction TEXT[],
  complexity TEXT,
  tags TEXT[],
  description TEXT,
  content TEXT,
  placeholders JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Create policies for templates
CREATE POLICY "Templates are viewable by everyone" 
  ON public.templates 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Users can insert their own templates" 
  ON public.templates 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" 
  ON public.templates 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_complexity ON public.templates(complexity);
CREATE INDEX idx_templates_tags ON public.templates USING gin(tags);
CREATE INDEX idx_templates_jurisdiction ON public.templates USING gin(jurisdiction);

-- Insert some sample templates
INSERT INTO public.templates (title, category, subcategory, jurisdiction, complexity, tags, description, content, placeholders, metadata) VALUES
('Employment Contract - Full Time', 'employment', 'contracts', ARRAY['India'], 'basic', ARRAY['employment', 'full-time', 'contract'], 'Standard full-time employment contract with comprehensive terms and conditions.', 'EMPLOYMENT AGREEMENT

This Employment Agreement is entered into on [START_DATE] between [COMPANY_NAME], a company incorporated under the laws of India, and [EMPLOYEE_NAME], an individual resident of India.

1. POSITION AND DUTIES
The Employee is appointed to the position of [POSITION] in the [DEPARTMENT] department. The Employee shall perform duties as assigned by the Company.

2. COMPENSATION
The Employee shall receive a monthly salary of INR [SALARY], payable monthly in arrears.

3. TERM
This agreement shall commence on [START_DATE] and shall continue until terminated in accordance with the provisions herein.

4. CONFIDENTIALITY
The Employee agrees to maintain strict confidentiality of all Company information.

5. TERMINATION
Either party may terminate this agreement by giving [NOTICE_PERIOD] days written notice.

IN WITNESS WHEREOF, the parties have executed this Agreement on the date first written above.

[COMPANY_NAME]                    [EMPLOYEE_NAME]
_________________                 _________________
Authorized Signatory              Employee Signature', '{"START_DATE": "", "COMPANY_NAME": "", "EMPLOYEE_NAME": "", "POSITION": "", "DEPARTMENT": "", "SALARY": "", "NOTICE_PERIOD": "30"}', '{"author": "VakilGPT", "version": "1.0", "usage_count": 45, "difficulty": "beginner", "estimatedTime": "15-20 minutes"}'),

('Rental Agreement - Residential', 'property', 'lease', ARRAY['India'], 'basic', ARRAY['rental', 'residential', 'lease'], 'Standard residential rental agreement compliant with Indian tenancy laws.', 'RENTAL AGREEMENT

This Rental Agreement is made on [DATE] between [LANDLORD_NAME], the Landlord, and [TENANT_NAME], the Tenant.

PROPERTY: [PROPERTY_ADDRESS]

1. RENT
Monthly rent: INR [RENT_AMOUNT]
Security deposit: INR [SECURITY_DEPOSIT]

2. TERM
Lease period: [LEASE_PERIOD] months
Commencement date: [START_DATE]

3. UTILITIES
[UTILITIES_CLAUSE]

4. MAINTENANCE
The Tenant shall maintain the property in good condition.

5. TERMINATION
Either party may terminate with [NOTICE_PERIOD] days notice.

Landlord: [LANDLORD_NAME]        Tenant: [TENANT_NAME]
Signature: _______________       Signature: _______________
Date: ________________          Date: ________________', '{"DATE": "", "LANDLORD_NAME": "", "TENANT_NAME": "", "PROPERTY_ADDRESS": "", "RENT_AMOUNT": "", "SECURITY_DEPOSIT": "", "LEASE_PERIOD": "11", "START_DATE": "", "UTILITIES_CLAUSE": "Utilities to be borne by tenant", "NOTICE_PERIOD": "30"}', '{"author": "VakilGPT", "version": "1.2", "usage_count": 78, "difficulty": "beginner", "estimatedTime": "10-15 minutes"}'),

('Non-Disclosure Agreement', 'corporate', 'contracts', ARRAY['India'], 'intermediate', ARRAY['nda', 'confidentiality', 'corporate'], 'Comprehensive NDA for protecting confidential business information.', 'NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement is entered into on [DATE] between [PARTY_A_NAME] and [PARTY_B_NAME].

1. CONFIDENTIAL INFORMATION
For purposes of this Agreement, "Confidential Information" means [CONFIDENTIAL_INFO_DEFINITION].

2. OBLIGATIONS
The Receiving Party agrees to:
- Maintain confidentiality of all Confidential Information
- Use information solely for [PURPOSE]
- Not disclose to third parties without written consent

3. TERM
This Agreement shall remain in effect for [TERM_YEARS] years from the date of execution.

4. GOVERNING LAW
This Agreement shall be governed by the laws of India.

[PARTY_A_NAME]                   [PARTY_B_NAME]
_________________                _________________
Signature                        Signature
Date: ___________               Date: ___________', '{"DATE": "", "PARTY_A_NAME": "", "PARTY_B_NAME": "", "CONFIDENTIAL_INFO_DEFINITION": "any proprietary or confidential information", "PURPOSE": "evaluation of potential business relationship", "TERM_YEARS": "2"}', '{"author": "VakilGPT", "version": "1.1", "usage_count": 92, "difficulty": "intermediate", "estimatedTime": "20-30 minutes"}');
