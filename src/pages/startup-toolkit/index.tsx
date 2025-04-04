
import React, { useState } from 'react';
import LegalToolLayout from '@/components/LegalToolLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDown, CheckCircle, Briefcase, Shield, FileText, ArrowRight, Edit, Eye, IndianRupee, Landmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const DOCUMENT_CATEGORIES = [
  { id: 'incorporation', name: 'Incorporation' },
  { id: 'employment', name: 'Employment' },
  { id: 'intellectual-property', name: 'Intellectual Property' },
  { id: 'funding', name: 'Funding & Investment' },
  { id: 'contracts', name: 'General Contracts' },
  { id: 'compliance', name: 'Indian Compliance' },
];

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  preview: string;
  content?: string;
  indianContext?: string;
}

const DOCUMENTS: Document[] = [
  {
    id: 'certificate-incorporation',
    title: 'Certificate of Incorporation',
    description: 'Official document establishing your business as a corporation in India.',
    category: 'incorporation',
    preview: 'A standard certificate of incorporation document with customizable fields for your business details as per Indian Companies Act, 2013.',
    indianContext: 'Complies with the Indian Companies Act, 2013 and MCA requirements.',
    content: `CERTIFICATE OF INCORPORATION
[Company Name]
Corporate Identity Number (CIN): [CIN Number]

I hereby certify that [COMPANY NAME] is incorporated on this [DAY] day of [MONTH], [YEAR] under the Companies Act, 2013 and that the company is limited by shares.

Given under my hand at [PLACE] this [DAY] day of [MONTH], [YEAR].

For and on behalf of the Registrar of Companies
Ministry of Corporate Affairs
Government of India`
  },
  {
    id: 'bylaws',
    title: 'Articles of Association',
    description: 'Rules governing the operation of your corporation under Indian law.',
    category: 'incorporation',
    preview: 'Comprehensive articles of association template outlining corporate structure, officer roles, and procedures as per the Companies Act, 2013.',
    indianContext: 'Drafted in compliance with Schedule I of the Companies Act, 2013.',
    content: `ARTICLES OF ASSOCIATION
OF
[COMPANY NAME]

PRELIMINARY
1. The regulations contained in Table F of Schedule I to the Companies Act, 2013 shall apply to the Company except to the extent that they are expressly excluded or modified by these Articles.

SHARE CAPITAL
2. The authorized share capital of the Company shall be INR [AMOUNT] divided into [NUMBER] equity shares of INR [AMOUNT] each.

BOARD OF DIRECTORS
3. The number of Directors shall not be less than three and not more than fifteen.
4. The first Directors of the Company shall be:
   (a) [DIRECTOR 1]
   (b) [DIRECTOR 2]
   (c) [DIRECTOR 3]

GENERAL MEETINGS
5. All general meetings other than annual general meetings shall be called extraordinary general meetings.
6. The Board may, whenever it thinks fit, call an extraordinary general meeting.

[Further sections to be added as appropriate]`
  },
  {
    id: 'operating-agreement',
    title: 'LLP Agreement',
    description: 'Document outlining ownership and operating procedures of an LLP in India.',
    category: 'incorporation',
    preview: 'Customizable LLP agreement template covering partnership interests, capital contributions, and management in accordance with the Limited Liability Partnership Act, 2008.',
    indianContext: 'Compliant with the Indian Limited Liability Partnership Act, 2008.',
    content: `LIMITED LIABILITY PARTNERSHIP AGREEMENT

THIS LLP AGREEMENT is made at [PLACE] on this [DAY] day of [MONTH], [YEAR] by and between:

1. [PARTNER 1 NAME], residing at [ADDRESS], (hereinafter referred to as "PARTNER 1")
2. [PARTNER 2 NAME], residing at [ADDRESS], (hereinafter referred to as "PARTNER 2")

WHEREAS:
A. The parties hereto have agreed to form a Limited Liability Partnership (LLP) under the provisions of the Limited Liability Partnership Act, 2008.
B. The parties hereto are desirous of setting out the terms and conditions of their relationship as Partners in the LLP.

NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:

1. FORMATION AND NAME
   The LLP shall be carried on under the name of "[LLP NAME] LLP" or such other name as may be approved by the Registrar of Companies.

2. BUSINESS
   The business of the LLP shall be [BUSINESS DESCRIPTION] and such other business as the Partners may from time to time determine.

3. CAPITAL CONTRIBUTION
   The capital of the LLP shall be INR [AMOUNT], which shall be contributed by the Partners in the following proportions:
   - PARTNER 1: INR [AMOUNT] ([PERCENTAGE]%)
   - PARTNER 2: INR [AMOUNT] ([PERCENTAGE]%)

[Further sections to be added as appropriate]`
  },
  {
    id: 'employment-agreement',
    title: 'Employment Agreement',
    description: 'Contract between your company and employees under Indian labor laws.',
    category: 'employment',
    preview: 'Standard employment contract outlining job duties, compensation, benefits, and termination conditions in compliance with Indian labor laws.',
    indianContext: 'Complies with the Industrial Employment (Standing Orders) Act, Payment of Wages Act, and other applicable Indian labor laws.',
    content: `EMPLOYMENT AGREEMENT

THIS EMPLOYMENT AGREEMENT (the "Agreement") is made and entered into on this [DAY] day of [MONTH], [YEAR] by and between:

[COMPANY NAME], a company incorporated under the Companies Act, 2013, having its registered office at [ADDRESS] (hereinafter referred to as the "Employer")

AND

[EMPLOYEE NAME], residing at [ADDRESS], holding Aadhaar Number [AADHAAR NUMBER] (hereinafter referred to as the "Employee")

1. POSITION AND DUTIES
   The Employer hereby employs the Employee, and the Employee hereby accepts employment, as [JOB TITLE]. The Employee shall perform all duties and responsibilities as outlined in Job Description attached as Annexure A.

2. TERM
   This Agreement shall commence on [START DATE] and shall continue until terminated in accordance with the provisions of this Agreement.

3. COMPENSATION
   a) Salary: The Employee shall receive a basic salary of INR [AMOUNT] per month.
   b) PF and ESI: The Employer shall contribute to Employee's Provident Fund and ESI as per applicable laws.
   c) Bonus: [BONUS TERMS]

4. WORKING HOURS
   The Employee shall work for [NUMBER] hours per week, from [START TIME] to [END TIME], with [DURATION] break for lunch.

5. LEAVE ENTITLEMENT
   The Employee shall be entitled to the following leave benefits:
   a) Casual Leave: [NUMBER] days per annum
   b) Sick Leave: [NUMBER] days per annum
   c) Earned Leave: [NUMBER] days per annum
   d) National and Festival Holidays: As per the applicable laws

[Further sections to be added as appropriate]`
  },
  {
    id: 'contractor-agreement',
    title: 'Independent Contractor Agreement',
    description: 'Agreement for hiring freelancers or consultants in India.',
    category: 'employment',
    preview: 'Detailed agreement covering scope of work, payment terms, and intellectual property rights that complies with Indian tax laws and regulations.',
    indianContext: 'Includes provisions for GST, TDS, and non-employee relationship per Indian regulations.',
    content: `INDEPENDENT CONTRACTOR AGREEMENT

THIS INDEPENDENT CONTRACTOR AGREEMENT (the "Agreement") is made and entered into on this [DAY] day of [MONTH], [YEAR] by and between:

[COMPANY NAME], a company incorporated under the Companies Act, 2013, having its registered office at [ADDRESS] (hereinafter referred to as the "Company")

AND

[CONTRACTOR NAME], having its principal place of business at [ADDRESS] and GST Registration Number: [GST NUMBER] (hereinafter referred to as the "Contractor")

1. ENGAGEMENT OF SERVICES
   The Company hereby engages the Contractor, and the Contractor hereby accepts the engagement, to provide the services described in Annexure A (the "Services").

2. TERM
   This Agreement shall commence on [START DATE] and shall continue until [END DATE], unless terminated earlier in accordance with the provisions of this Agreement.

3. COMPENSATION
   a) Fees: In consideration for the Services, the Company shall pay the Contractor a fee of INR [AMOUNT] [per hour/per project/per month].
   b) Invoicing: The Contractor shall submit invoices [frequency] for the Services performed.
   c) GST: All fees are exclusive of GST, which shall be charged additionally at the applicable rate.
   d) TDS: The Company shall deduct TDS at the applicable rate as per the Income Tax Act, 1961.

4. RELATIONSHIP OF PARTIES
   The Contractor is an independent contractor and not an employee of the Company. Nothing in this Agreement shall be construed as creating an employer-employee relationship.

5. INTELLECTUAL PROPERTY RIGHTS
   All work product, including but not limited to, documents, designs, inventions, improvements, and developments made by the Contractor in connection with the Services shall be the sole and exclusive property of the Company.

[Further sections to be added as appropriate]`
  },
  {
    id: 'nda',
    title: 'Non-Disclosure Agreement',
    description: 'Protects confidential business information under Indian law.',
    category: 'intellectual-property',
    preview: 'Comprehensive NDA template protecting trade secrets and confidential information with provisions enforceable under Indian contract law.',
    indianContext: 'Drafted in accordance with the Indian Contract Act, 1872 and recent Indian case law on confidentiality.',
    content: `NON-DISCLOSURE AGREEMENT

THIS NON-DISCLOSURE AGREEMENT (the "Agreement") is made and entered into on this [DAY] day of [MONTH], [YEAR] by and between:

[COMPANY NAME], a company incorporated under the Companies Act, 2013, having its registered office at [ADDRESS] (hereinafter referred to as the "Disclosing Party")

AND

[RECIPIENT NAME], having its principal place of business at [ADDRESS] (hereinafter referred to as the "Receiving Party")

WHEREAS:
A. The Disclosing Party possesses certain confidential and proprietary information relating to its business, operations, products, services, and clients.
B. The Receiving Party may receive such confidential information for the purpose of [PURPOSE] (the "Purpose").
C. The parties wish to ensure that such confidential information is protected from unauthorized disclosure and use.

NOW THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. CONFIDENTIAL INFORMATION
   "Confidential Information" means any information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, electronically, or by any other means, that is designated as confidential or would reasonably be understood to be confidential given the nature of the information and the circumstances of disclosure.

2. OBLIGATIONS OF THE RECEIVING PARTY
   The Receiving Party shall:
   a) Keep confidential all Confidential Information;
   b) Use Confidential Information only for the Purpose;
   c) Not disclose any Confidential Information to any third party without the prior written consent of the Disclosing Party;
   d) Take all reasonable measures to protect the secrecy of the Confidential Information.

3. TERM AND TERMINATION
   This Agreement shall remain in effect for a period of [DURATION] years from the date of disclosure of the Confidential Information.

[Further sections to be added as appropriate]`
  },
  {
    id: 'ip-assignment',
    title: 'IP Assignment Agreement',
    description: 'Transfers intellectual property rights to your company under Indian IP laws.',
    category: 'intellectual-property',
    preview: 'Template for assigning all intellectual property rights from employees or contractors to your company in compliance with Indian copyright and patent laws.',
    indianContext: 'Complies with the Indian Copyright Act, 1957 and Patents Act, 1970.',
    content: `INTELLECTUAL PROPERTY ASSIGNMENT AGREEMENT

THIS INTELLECTUAL PROPERTY ASSIGNMENT AGREEMENT (the "Agreement") is made and entered into on this [DAY] day of [MONTH], [YEAR] by and between:

[ASSIGNOR NAME], residing at [ADDRESS] (hereinafter referred to as the "Assignor")

AND

[COMPANY NAME], a company incorporated under the Companies Act, 2013, having its registered office at [ADDRESS] (hereinafter referred to as the "Assignee")

WHEREAS:
A. The Assignor has created, invented, or otherwise developed certain intellectual property as described in Annexure A (the "Intellectual Property").
B. The Assignor wishes to transfer and assign all rights, title, and interest in and to the Intellectual Property to the Assignee.

NOW THEREFORE, in consideration of the sum of INR [AMOUNT] and other good and valuable consideration, the receipt and sufficiency of which is hereby acknowledged, the parties agree as follows:

1. ASSIGNMENT
   The Assignor hereby irrevocably assigns, transfers, and conveys to the Assignee, its successors and assigns, all of the Assignor's right, title, and interest in and to the Intellectual Property, including but not limited to:
   a) All copyrights, copyright applications, and copyright registrations related to the Intellectual Property, and all rights incident thereto;
   b) All patents, patent applications, and patent rights related to the Intellectual Property;
   c) All trademarks, trademark applications, and trademark registrations related to the Intellectual Property;
   d) All designs, design applications, and design registrations related to the Intellectual Property;
   e) All trade secrets, know-how, and confidential information related to the Intellectual Property;
   f) All other intellectual property rights of any kind whatsoever related to the Intellectual Property.

2. CONSIDERATION
   In consideration for this assignment, the Assignee shall pay to the Assignor the sum of INR [AMOUNT], receipt of which is hereby acknowledged by the Assignor.

[Further sections to be added as appropriate]`
  },
  {
    id: 'term-sheet',
    title: 'Investment Term Sheet',
    description: 'Outlines terms for investment in your Indian startup.',
    category: 'funding',
    preview: 'Standard term sheet template with customizable investment terms, valuation, and investor rights as per Indian securities regulations.',
    indianContext: 'Complies with SEBI regulations and Indian company law provisions.',
    content: `INVESTMENT TERM SHEET

THIS TERM SHEET (the "Term Sheet") dated [DATE] sets forth the proposed terms for a potential investment in [COMPANY NAME], a company incorporated under the Companies Act, 2013 (the "Company").

THIS TERM SHEET IS NOT A BINDING AGREEMENT (except for the Exclusivity and Confidentiality provisions) but merely sets forth the basic terms upon which an investment may be made.

INVESTMENT TERMS:

1. INVESTORS: [INVESTOR NAMES] (the "Investors")

2. TYPE OF SECURITY: [Series A Preferred Shares / Compulsorily Convertible Preference Shares]

3. INVESTMENT AMOUNT: INR [AMOUNT]

4. PRE-MONEY VALUATION: INR [AMOUNT]

5. PRICE PER SHARE: INR [AMOUNT] per share

6. LIQUIDATION PREFERENCE: 1x non-participating preference

7. BOARD COMPOSITION:
   - [NUMBER] directors appointed by the Founders
   - [NUMBER] directors appointed by the Investors
   - [NUMBER] independent directors mutually agreed upon

8. PROTECTIVE PROVISIONS:
   The approval of a majority of Preferred Shareholders shall be required for the following actions:
   a) Amendment to the Articles or Memorandum of Association
   b) Creation or issuance of any shares ranking equal to or superior to the Preferred Shares
   c) Any merger, acquisition, or sale of substantially all assets
   d) Any declaration or payment of dividends

9. INFORMATION RIGHTS:
   The Investors shall be entitled to:
   a) Monthly management reports
   b) Quarterly unaudited financial statements
   c) Annual audited financial statements
   d) Annual operating plan and budget

[Further sections to be added as appropriate]`
  },
  {
    id: 'subscription-agreement',
    title: 'Share Subscription Agreement',
    description: 'Documents investment terms for equity purchase in compliance with Indian regulations.',
    category: 'funding',
    preview: 'Detailed subscription agreement for selling equity shares to investors in accordance with the Companies Act, 2013 and SEBI guidelines.',
    indianContext: 'Includes necessary provisions as per Indian Foreign Exchange Management Act (FEMA) for foreign investments.',
    content: `SHARE SUBSCRIPTION AGREEMENT

THIS SHARE SUBSCRIPTION AGREEMENT (the "Agreement") is made and entered into on this [DAY] day of [MONTH], [YEAR] by and between:

[COMPANY NAME], a company incorporated under the Companies Act, 2013, having its registered office at [ADDRESS] (hereinafter referred to as the "Company")

AND

[INVESTOR NAME], having its principal place of business at [ADDRESS] (hereinafter referred to as the "Investor")

WHEREAS:
A. The Company is engaged in the business of [BUSINESS DESCRIPTION].
B. The Investor wishes to subscribe for shares in the Company on the terms and conditions set out in this Agreement.

NOW THEREFORE, the parties agree as follows:

1. SUBSCRIPTION AND ALLOTMENT
   1.1 The Investor hereby agrees to subscribe for, and the Company agrees to allot and issue to the Investor, [NUMBER] equity shares/preference shares of face value INR [AMOUNT] each (the "Subscription Shares") at a price of INR [AMOUNT] per share (the "Subscription Price"), including a premium of INR [AMOUNT] per share.
   
   1.2 The total Subscription Amount payable by the Investor to the Company for the Subscription Shares shall be INR [AMOUNT].

2. PAYMENT OF SUBSCRIPTION AMOUNT
   2.1 The Investor shall pay the Subscription Amount to the Company on or before [DATE] by electronic transfer to the Company's bank account, details of which are set out in Schedule A.

3. COMPLETION
   3.1 Completion of the subscription shall take place at [TIME] on [DATE] at [PLACE] or such other time, date and place as may be agreed between the parties.
   
   3.2 At Completion, the Company shall:
       a) Hold a board meeting to approve the allotment of the Subscription Shares to the Investor;
       b) Update the register of members to record the Investor as the holder of the Subscription Shares;
       c) Issue a share certificate to the Investor in respect of the Subscription Shares;
       d) File all necessary forms with the Registrar of Companies.

[Further sections to be added as appropriate]`
  },
  {
    id: 'customer-agreement',
    title: 'Customer Agreement',
    description: 'Terms of service for your customers under Indian consumer laws.',
    category: 'contracts',
    preview: 'Comprehensive customer agreement covering service terms, payment, liability, and dispute resolution following Indian consumer protection laws.',
    indianContext: 'Complies with the Consumer Protection Act, 2019 and Information Technology Act, 2000.',
    content: `CUSTOMER AGREEMENT

THIS CUSTOMER AGREEMENT (the "Agreement") is made and entered into on this [DAY] day of [MONTH], [YEAR] by and between:

[COMPANY NAME], a company incorporated under the Companies Act, 2013, having its registered office at [ADDRESS] (hereinafter referred to as the "Company")

AND

The person or entity accepting this Agreement, as identified in the Company's records (hereinafter referred to as the "Customer")

1. SERVICES
   1.1 The Company shall provide to the Customer the services as described in [SERVICE DESCRIPTION] (the "Services").
   
   1.2 The Company reserves the right to modify, suspend, or discontinue the Services or any part thereof at any time with or without notice to the Customer.

2. FEES AND PAYMENT
   2.1 The Customer shall pay to the Company the fees as set out in the fee schedule available at [WEBSITE/URL] (the "Fees").
   
   2.2 All Fees are exclusive of applicable taxes, including Goods and Services Tax (GST), which shall be charged additionally at the prevailing rate.
   
   2.3 The Company may revise the Fees at any time upon [NOTICE PERIOD] days' prior notice to the Customer.

3. TERM AND TERMINATION
   3.1 This Agreement shall commence on the date of acceptance by the Customer and shall continue until terminated in accordance with the provisions of this Agreement.
   
   3.2 Either party may terminate this Agreement by giving [NOTICE PERIOD] days' prior written notice to the other party.

4. DISPUTE RESOLUTION
   4.1 Any dispute arising out of or in connection with this Agreement shall be referred to arbitration in accordance with the Arbitration and Conciliation Act, 1996.
   
   4.2 The arbitration shall be conducted by a sole arbitrator appointed by mutual consent of the parties.
   
   4.3 The place of arbitration shall be [CITY], India.

[Further sections to be added as appropriate]`
  },
  {
    id: 'vendor-agreement',
    title: 'Vendor Agreement',
    description: 'Contract for suppliers and service providers in India.',
    category: 'contracts',
    preview: 'Standard vendor agreement template with customizable terms for product/service delivery that addresses GST and other Indian tax considerations.',
    indianContext: 'Includes provisions for GST, TDS, and e-invoicing requirements under Indian law.',
    content: `VENDOR AGREEMENT

THIS VENDOR AGREEMENT (the "Agreement") is made and entered into on this [DAY] day of [MONTH], [YEAR] by and between:

[COMPANY NAME], a company incorporated under the Companies Act, 2013, having its registered office at [ADDRESS] (hereinafter referred to as the "Company")

AND

[VENDOR NAME], having its principal place of business at [ADDRESS] and GST Registration Number: [GST NUMBER] (hereinafter referred to as the "Vendor")

1. SCOPE OF SERVICES/SUPPLY
   1.1 The Vendor shall supply to the Company the goods and/or services as described in Schedule A (the "Goods/Services").
   
   1.2 The Vendor shall supply the Goods/Services in accordance with the specifications, quantities, and delivery schedule set out in Schedule A.

2. PRICE AND PAYMENT
   2.1 The price for the Goods/Services shall be as set out in Schedule A (the "Price").
   
   2.2 All Prices are exclusive of GST, which shall be charged additionally at the applicable rate.
   
   2.3 The Company shall pay the Vendor within [NUMBER] days of receipt of a valid tax invoice.
   
   2.4 The Company shall deduct TDS at the applicable rate as per the Income Tax Act, 1961.

3. DELIVERY
   3.1 The Vendor shall deliver the Goods/Services to the location specified in Schedule A.
   
   3.2 Risk in the Goods shall pass to the Company upon delivery and acceptance of the Goods.
   
   3.3 Title to the Goods shall pass to the Company upon payment in full for the Goods.

4. WARRANTIES
   4.1 The Vendor warrants that:
       a) The Goods/Services shall conform to the specifications set out in Schedule A;
       b) The Goods shall be of satisfactory quality and fit for their intended purpose;
       c) The Vendor has full right and title to supply the Goods/Services.

[Further sections to be added as appropriate]`
  },
  {
    id: 'gst-registration',
    title: 'GST Registration Guide',
    description: 'Comprehensive guide to GST registration for startups in India.',
    category: 'compliance',
    preview: 'A step-by-step guide to GST registration, documentation requirements, and compliance obligations for Indian startups.',
    indianContext: 'Based on the Central Goods and Services Tax Act, 2017 and relevant rules.',
    content: `GST REGISTRATION GUIDE FOR INDIAN STARTUPS

1. INTRODUCTION
   The Goods and Services Tax (GST) is a comprehensive indirect tax levied on the supply of goods and services across India. This guide outlines the process for GST registration, which is mandatory for businesses with an annual turnover exceeding INR 20 lakhs (INR 10 lakhs for special category states).

2. ELIGIBILITY FOR REGISTRATION
   2.1 Mandatory Registration:
       a) Businesses with an aggregate turnover exceeding INR 20 lakhs (INR 10 lakhs for special category states) in a financial year
       b) Persons making inter-state supplies
       c) E-commerce operators and suppliers through e-commerce
       d) Persons liable to pay tax under reverse charge mechanism
       e) Non-resident taxable persons
       f) Persons required to deduct tax at source
       g) Input service distributors

   2.2 Voluntary Registration:
       Businesses can voluntarily register under GST even if they are not mandatorily required to do so.

3. DOCUMENTS REQUIRED FOR GST REGISTRATION
   3.1 Business Entity Documentation:
       a) PAN of the business
       b) Aadhaar card of authorized signatory
       c) Certificate of Incorporation or Registration
       d) Memorandum and Articles of Association (for companies)
       e) LLP Agreement (for LLPs)
       f) Partnership Deed (for partnerships)
   
   3.2 Address Proof:
       a) Property tax receipt
       b) Electricity bill (not older than 2 months)
       c) Rent/lease agreement
       d) NOC from the property owner
   
   3.3 Identity and Address Proof of Promoters/Partners/Directors:
       a) PAN card
       b) Aadhaar card
       c) Passport size photograph

4. REGISTRATION PROCEDURE
   4.1 Visit the GST Portal (www.gst.gov.in)
   4.2 Select "Services" > "Registration" > "New Registration"
   4.3 Fill in Part A of the registration form:
       a) Select taxpayer type
       b) Enter legal name of business as per PAN
       c) Enter PAN
       d) Enter email address and mobile number
       e) Submit and verify through OTP
   4.4 After verification, a Temporary Reference Number (TRN) will be generated
   4.5 Using the TRN, complete Part B of the registration form:
       a) Fill in business details
       b) Upload required documents
       c) Verify using electronic verification code or digital signature
   4.6 After submission, an Application Reference Number (ARN) will be generated
   4.7 GST registration certificate will be issued within 7 working days

[Further sections to be added as appropriate]`
  },
  {
    id: 'msme-registration',
    title: 'MSME Registration Process',
    description: 'Guide for registering as a Micro, Small, or Medium Enterprise in India.',
    category: 'compliance',
    preview: 'Detailed guide on registering your startup as an MSME, including eligibility criteria, benefits, and the application process under the MSME Development Act.',
    indianContext: 'Based on the MSME Development Act, 2006 and subsequent amendments.',
    content: `MSME REGISTRATION PROCESS FOR INDIAN STARTUPS

1. INTRODUCTION
   The Micro, Small and Medium Enterprises (MSME) registration in India provides various benefits to entrepreneurs, including priority sector lending, lower interest rates, concessions in electricity bills, and protection against delayed payments. This guide outlines the MSME registration process under the MSME Development Act, 2006.

2. REVISED MSME CLASSIFICATION (AS PER 2020 AMENDMENT)
   2.1 Micro Enterprise:
       a) Manufacturing and Services: Investment in plant and machinery or equipment up to INR 1 crore AND annual turnover up to INR 5 crores
   
   2.2 Small Enterprise:
       a) Manufacturing and Services: Investment in plant and machinery or equipment up to INR 10 crores AND annual turnover up to INR 50 crores
   
   2.3 Medium Enterprise:
       a) Manufacturing and Services: Investment in plant and machinery or equipment up to INR 50 crores AND annual turnover up to INR 250 crores

3. BENEFITS OF MSME REGISTRATION
   3.1 Financial Benefits:
       a) Priority sector lending from banks
       b) Collateral-free loans up to INR 2 crores
       c) 1% interest rebate on fresh or incremental loans
       d) 50% subsidy on patent registration fees
   
   3.2 Regulatory Benefits:
       a) Protection against delayed payments
       b) Reservation policies for procurement by government agencies
       c) Reimbursement of ISO certification charges
   
   3.3 Tax Benefits:
       a) Exemption under Income Tax Section 80IAC for eligible startups
       b) Lower GST rates for certain categories
       c) Reduced stamp duty and registration fees in many states

4. REGISTRATION PROCEDURE (UDYAM REGISTRATION)
   4.1 Visit the Udyam Registration Portal (udyamregistration.gov.in)
   4.2 Enter your Aadhaar number and click on "Validate & Generate OTP"
   4.3 After OTP verification, fill in the required information:
       a) Personal details
       b) Business name and type
       c) Business address
       d) Bank account details
       e) Business activity details
       f) Investment in plant and machinery or equipment
       g) Annual turnover
   4.4 Submit the form
   4.5 A confirmation message will be displayed, and the Udyam Registration Certificate will be issued

[Further sections to be added as appropriate]`
  },
  {
    id: 'startup-india',
    title: 'Startup India Recognition',
    description: 'Guide for obtaining recognition under the Startup India initiative.',
    category: 'compliance',
    preview: 'Comprehensive guide to getting your startup recognized under the Startup India initiative, including eligibility, application process, and benefits.',
    indianContext: 'Based on the Startup India Action Plan launched by the Government of India.',
    content: `STARTUP INDIA RECOGNITION GUIDE

1. INTRODUCTION
   The Startup India initiative was launched by the Government of India on January 16, 2016, to promote entrepreneurship by creating a robust ecosystem that nurtures innovation. This guide outlines the process for obtaining recognition under the Startup India initiative.

2. ELIGIBILITY CRITERIA
   To be recognized as a Startup under the Startup India initiative, an entity must meet the following criteria:
   
   2.1 Entity Type:
       a) Incorporated as a Private Limited Company under the Companies Act, 2013
       b) Registered as a Partnership Firm under the Partnership Act, 1932
       c) Registered as a Limited Liability Partnership under the LLP Act, 2008
   
   2.2 Age of Entity:
       a) Not more than 10 years from the date of incorporation/registration
   
   2.3 Turnover:
       a) Annual turnover not exceeding INR 100 crores for any of the financial years since incorporation/registration
   
   2.4 Innovation and Scalability:
       a) Working towards innovation, development or improvement of products, processes or services
       b) Has potential for commercialization
       c) Capable of generating employment or wealth creation

3. BENEFITS OF STARTUP INDIA RECOGNITION
   3.1 Funding Support:
       a) Fund of Funds for Startups with a corpus of INR 10,000 crores
       b) Credit Guarantee Scheme for startup loans
   
   3.2 Tax Benefits:
       a) Tax exemption on capital gains
       b) Income tax exemption for 3 out of 10 years (Section 80IAC)
       c) Tax exemption on investments above fair market value
   
   3.3 Intellectual Property Support:
       a) Fast-tracking of patent applications
       b) 80% rebate on patent filing fees
       c) Panel of facilitators for IP applications
   
   3.4 Compliance Relief:
       a) Self-certification under environmental and labor laws
       b) Relaxed norms for public procurement
       c) Faster exit mechanism

4. REGISTRATION PROCEDURE
   4.1 Visit the Startup India Portal (startupindia.gov.in)
   4.2 Register on the portal by providing basic details
   4.3 After verification, log in to your account
   4.4 Click on "Get Recognized" and fill in the required information:
       a) Entity details
       b) Director/Promoter details
       c) Business model details
       d) Innovation description
       e) Funding details (if any)
   4.5 Upload required documents:
       a) Certificate of Incorporation/Registration
       b) Director/Promoter details with Aadhaar/PAN
       c) Proof of concept/business plan
       d) Patent/trademark details (if any)
   4.6 Submit the application
   4.7 After verification, the DPIIT Recognition Certificate will be issued

[Further sections to be added as appropriate]`
  },
];

const StartupToolkitPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(DOCUMENT_CATEGORIES[0].id);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editingDocument, setEditingDocument] = useState(false);
  const [documentContent, setDocumentContent] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const { toast } = useToast();

  const filteredDocuments = DOCUMENTS.filter(doc => doc.category === selectedCategory);

  const handleDownload = (document: Document) => {
    toast({
      title: "Document Downloaded",
      description: `${document.title} has been downloaded successfully.`,
    });
  };

  const handleEdit = () => {
    if (selectedDocument) {
      setDocumentContent(selectedDocument.content || '');
      setDocumentTitle(selectedDocument.title);
      setEditingDocument(true);
    }
  };

  const handleSaveEdit = () => {
    toast({
      title: "Document Updated",
      description: "Your changes have been saved successfully.",
    });
    setEditingDocument(false);
  };

  return (
    <LegalToolLayout
      title="Indian Startup Legal Toolkit"
      description="Access essential legal templates and documents specifically designed for Indian startups. These templates comply with Indian laws and regulations to help establish and grow your business."
      icon={<Briefcase className="w-6 h-6 text-white" />}
    >
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Document Categories</CardTitle>
              <CardDescription>Browse by type of document</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue={selectedCategory} orientation="vertical" className="w-full" onValueChange={setSelectedCategory}>
                <TabsList className="w-full flex flex-col h-auto space-y-1 bg-transparent p-0">
                  {DOCUMENT_CATEGORIES.map(category => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="justify-start w-full rounded-none border-l-2 border-transparent px-6 py-3 text-left data-[state=active]:border-l-2 data-[state=active]:border-legal-accent data-[state=active]:bg-legal-accent/5"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value={selectedCategory} className="border-0 p-0">
                  <div className="space-y-4">
                    {filteredDocuments.map(document => (
                      <Card key={document.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/10 transition-colors" onClick={() => setSelectedDocument(document)}>
                        <CardHeader className="p-4">
                          <div className="flex justify-between">
                            <CardTitle className="text-lg">{document.title}</CardTitle>
                            {document.indianContext && (
                              <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                                Indian Compliant
                              </Badge>
                            )}
                          </div>
                          <CardDescription>{document.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          {selectedDocument ? (
            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-2xl">{selectedDocument.title}</CardTitle>
                  <CardDescription className="mt-1">{selectedDocument.description}</CardDescription>
                  {selectedDocument.indianContext && (
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800">
                        <IndianRupee className="mr-1 h-3 w-3" />
                        Indian Context
                      </Badge>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedDocument.indianContext}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button size="sm" onClick={() => handleDownload(selectedDocument)}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Preview:</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{selectedDocument.preview}</p>
                </div>
                <div className="border rounded-md overflow-hidden bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium">Document Content</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="p-4 text-sm overflow-auto whitespace-pre-wrap font-mono text-gray-700 dark:text-gray-300 max-h-96">
                    {selectedDocument.content}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-8">
                <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Select a document</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Choose a legal document from the left sidebar to view, edit, or download it.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={editingDocument} onOpenChange={setEditingDocument}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit Document: {documentTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="documentTitle">Document Title</Label>
              <Input 
                id="documentTitle" 
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentContent">Document Content</Label>
              <Textarea 
                id="documentContent" 
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                className="min-h-[50vh] font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDocument(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LegalToolLayout>
  );
};

export default StartupToolkitPage;
