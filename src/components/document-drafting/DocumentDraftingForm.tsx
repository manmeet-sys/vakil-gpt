import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { generateOpenAIAnalysis } from '@/utils/aiAnalysis';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from 'sonner';
import { Download, FileText, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  documentType: z.string().min(2, {
    message: "Document type must be selected.",
  }),
  details: z.string().min(10, {
    message: "Details must be at least 10 characters.",
  }),
})

interface DocumentDraftingFormProps {
  onDocumentGenerated: (title: string, type: string, content: string) => void;
  onDownload: (content: string, filename: string) => void;
}

const DocumentDraftingForm: React.FC<DocumentDraftingFormProps> = ({ onDocumentGenerated, onDownload }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      documentType: "",
      details: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    try {
      const prompt = `Create a professional Indian legal document with the following details:
      - Title: ${values.title}
      - Document Type: ${values.documentType}
      - Details: ${values.details}
      
      Please draft a comprehensive document that:
      1. Follows all Indian legal drafting standards and conventions
      2. Includes all necessary sections and clauses for this type of document
      3. Uses formal legal language appropriate for Indian courts
      4. Follows proper formatting with paragraphs, numbering, etc.
      5. References relevant Indian laws, acts and precedents
      6. Is ready for use in the appropriate Indian jurisdiction
      
      Format your response as the complete text of the document only, without any explanations or commentary outside the document itself.`;

      const analysis = await generateOpenAIAnalysis(prompt, `${values.title} - Document Draft`);
      onDocumentGenerated(values.title, values.documentType, analysis);
      toast.success("Document generated successfully!");
    } catch (error) {
      console.error("Error generating document:", error);
      toast.error("Failed to generate document. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  const handleDownload = (content: string, filename: string) => {
    onDownload(content, filename);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Legal Document Drafting Form</CardTitle>
        <CardDescription>Fill out the form to generate a legal document.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Partnership Agreement" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your document a clear and concise title.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="partnership_agreement">Partnership Agreement</SelectItem>
                      <SelectItem value="sale_deed">Sale Deed</SelectItem>
                      <SelectItem value="lease_agreement">Lease Agreement</SelectItem>
                      <SelectItem value="power_of_attorney">Power of Attorney</SelectItem>
                      <SelectItem value="will">Will</SelectItem>
                      <SelectItem value="affidavit">Affidavit</SelectItem>
                      <SelectItem value="notice">Legal Notice</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="memorandum_of_understanding">Memorandum of Understanding</SelectItem>
                      <SelectItem value="license_agreement">License Agreement</SelectItem>
                      <SelectItem value="employment_agreement">Employment Agreement</SelectItem>
                      <SelectItem value="loan_agreement">Loan Agreement</SelectItem>
                      <SelectItem value="mortgage_deed">Mortgage Deed</SelectItem>
                      <SelectItem value="gift_deed">Gift Deed</SelectItem>
                      <SelectItem value="trust_deed">Trust Deed</SelectItem>
                      <SelectItem value="arbitration_agreement">Arbitration Agreement</SelectItem>
                      <SelectItem value="vendor_agreement">Vendor Agreement</SelectItem>
                      <SelectItem value="service_agreement">Service Agreement</SelectItem>
                      <SelectItem value="non_disclosure_agreement">Non-Disclosure Agreement</SelectItem>
                      <SelectItem value="website_terms_and_conditions">Website Terms and Conditions</SelectItem>
                      <SelectItem value="privacy_policy">Privacy Policy</SelectItem>
                      <SelectItem value="shareholders_agreement">Shareholders Agreement</SelectItem>
                      <SelectItem value="franchise_agreement">Franchise Agreement</SelectItem>
                      <SelectItem value="construction_agreement">Construction Agreement</SelectItem>
                      <SelectItem value="joint_venture_agreement">Joint Venture Agreement</SelectItem>
                      <SelectItem value="distribution_agreement">Distribution Agreement</SelectItem>
                      <SelectItem value="software_license_agreement">Software License Agreement</SelectItem>
                      <SelectItem value="consulting_agreement">Consulting Agreement</SelectItem>
                      <SelectItem value="purchase_order">Purchase Order</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="receipt">Receipt</SelectItem>
                      <SelectItem value="minutes_of_meeting">Minutes of Meeting</SelectItem>
                      <SelectItem value="resolution">Resolution</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="letter_of_intent">Letter of Intent</SelectItem>
                      <SelectItem value="business_plan">Business Plan</SelectItem>
                      <SelectItem value="marketing_plan">Marketing Plan</SelectItem>
                      <SelectItem value="financial_statement">Financial Statement</SelectItem>
                      <SelectItem value="audit_report">Audit Report</SelectItem>
                      <SelectItem value="tax_return">Tax Return</SelectItem>
                      <SelectItem value="legal_opinion">Legal Opinion</SelectItem>
                      <SelectItem value="demand_notice">Demand Notice</SelectItem>
                      <SelectItem value="reply_to_notice">Reply to Notice</SelectItem>
                      <SelectItem value="writ_petition">Writ Petition</SelectItem>
                      <SelectItem value="civil_suit">Civil Suit</SelectItem>
                      <SelectItem value="criminal_complaint">Criminal Complaint</SelectItem>
                      <SelectItem value="first_information_report">First Information Report</SelectItem>
                      <SelectItem value="bail_application">Bail Application</SelectItem>
                      <SelectItem value="anticipatory_bail_application">Anticipatory Bail Application</SelectItem>
                      <SelectItem value="divorce_petition">Divorce Petition</SelectItem>
                      <SelectItem value="child_custody_petition">Child Custody Petition</SelectItem>
                      <SelectItem value="adoption_deed">Adoption Deed</SelectItem>
                      <SelectItem value="name_change_affidavit">Name Change Affidavit</SelectItem>
                      <SelectItem value="birth_certificate">Birth Certificate</SelectItem>
                      <SelectItem value="marriage_certificate">Marriage Certificate</SelectItem>
                      <SelectItem value="death_certificate">Death Certificate</SelectItem>
                      <SelectItem value="property_valuation_report">Property Valuation Report</SelectItem>
                      <SelectItem value="site_plan">Site Plan</SelectItem>
                      <SelectItem value="building_plan">Building Plan</SelectItem>
                      <SelectItem value="environmental_impact_assessment">Environmental Impact Assessment</SelectItem>
                      <SelectItem value="power_purchase_agreement">Power Purchase Agreement</SelectItem>
                      <SelectItem value="escrow_agreement">Escrow Agreement</SelectItem>
                      <SelectItem value="memorandum_of_association">Memorandum of Association</SelectItem>
                      <SelectItem value="articles_of_association">Articles of Association</SelectItem>
                      <SelectItem value="board_resolution">Board Resolution</SelectItem>
                      <SelectItem value="share_certificate">Share Certificate</SelectItem>
                      <SelectItem value="gst_registration_certificate">GST Registration Certificate</SelectItem>
                      <SelectItem value="import_export_code">Import Export Code</SelectItem>
                      <SelectItem value="trade_license">Trade License</SelectItem>
                      <SelectItem value="food_license">Food License</SelectItem>
                      <SelectItem value="drug_license">Drug License</SelectItem>
                      <SelectItem value="factory_license">Factory License</SelectItem>
                      <SelectItem value="shop_and_establishment_registration">Shop and Establishment Registration</SelectItem>
                      <SelectItem value="msme_registration">MSME Registration</SelectItem>
                      <SelectItem value="iso_certification">ISO Certification</SelectItem>
                      <SelectItem value="trademark_registration_certificate">Trademark Registration Certificate</SelectItem>
                      <SelectItem value="patent_certificate">Patent Certificate</SelectItem>
                      <SelectItem value="copyright_registration_certificate">Copyright Registration Certificate</SelectItem>
                      <SelectItem value="design_registration_certificate">Design Registration Certificate</SelectItem>
                      <SelectItem value="domain_name_registration_certificate">Domain Name Registration Certificate</SelectItem>
                      <SelectItem value="digital_signature_certificate">Digital Signature Certificate</SelectItem>
                      <SelectItem value="pan_card">PAN Card</SelectItem>
                      <SelectItem value="aadhar_card">Aadhar Card</SelectItem>
                      <SelectItem value="voter_id_card">Voter ID Card</SelectItem>
                      <SelectItem value="driving_license">Driving License</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="ration_card">Ration Card</SelectItem>
                      <SelectItem value="bank_statement">Bank Statement</SelectItem>
                      <SelectItem value="income_tax_assessment_order">Income Tax Assessment Order</SelectItem>
                      <SelectItem value="property_tax_receipt">Property Tax Receipt</SelectItem>
                      <SelectItem value="electricity_bill">Electricity Bill</SelectItem>
                      <SelectItem value="water_bill">Water Bill</SelectItem>
                      <SelectItem value="telephone_bill">Telephone Bill</SelectItem>
                      <SelectItem value="gas_bill">Gas Bill</SelectItem>
                      <SelectItem value="insurance_policy">Insurance Policy</SelectItem>
                      <SelectItem value="investment_certificate">Investment Certificate</SelectItem>
                      <SelectItem value="fixed_deposit_receipt">Fixed Deposit Receipt</SelectItem>
                      <SelectItem value="mutual_fund_statement">Mutual Fund Statement</SelectItem>
                      <SelectItem value="demat_account_statement">Demat Account Statement</SelectItem>
                      <SelectItem value="credit_card_statement">Credit Card Statement</SelectItem>
                      <SelectItem value="loan_statement">Loan Statement</SelectItem>
                      <SelectItem value="salary_slip">Salary Slip</SelectItem>
                      <SelectItem value="employment_contract">Employment Contract</SelectItem>
                      <SelectItem value="offer_letter">Offer Letter</SelectItem>
                      <SelectItem value="resignation_letter">Resignation Letter</SelectItem>
                      <SelectItem value="experience_certificate">Experience Certificate</SelectItem>
                      <SelectItem value="transfer_certificate">Transfer Certificate</SelectItem>
                      <SelectItem value="mark_sheet">Mark Sheet</SelectItem>
                      <SelectItem value="degree_certificate">Degree Certificate</SelectItem>
                      <SelectItem value="provisional_certificate">Provisional Certificate</SelectItem>
                      <SelectItem value="migration_certificate">Migration Certificate</SelectItem>
                      <SelectItem value="caste_certificate">Caste Certificate</SelectItem>
                      <SelectItem value="income_certificate">Income Certificate</SelectItem>
                      <SelectItem value="domicile_certificate">Domicile Certificate</SelectItem>
                      <SelectItem value="character_certificate">Character Certificate</SelectItem>
                      <SelectItem value="medical_certificate">Medical Certificate</SelectItem>
                      <SelectItem value="fitness_certificate">Fitness Certificate</SelectItem>
                      <SelectItem value="police_clearance_certificate">Police Clearance Certificate</SelectItem>
                      <SelectItem value="no_objection_certificate">No Objection Certificate</SelectItem>
                      <SelectItem value="affidavit_of_residence">Affidavit of Residence</SelectItem>
                      <SelectItem value="affidavit_of_income">Affidavit of Income</SelectItem>
                      <SelectItem value="affidavit_of_age">Affidavit of Age</SelectItem>
                      <SelectItem value="affidavit_of_name_change">Affidavit of Name Change</SelectItem>
                      <SelectItem value="affidavit_of_relationship">Affidavit of Relationship</SelectItem>
                      <SelectItem value="affidavit_of_address">Affidavit of Address</SelectItem>
                      <SelectItem value="affidavit_of_marital_status">Affidavit of Marital Status</SelectItem>
                      <SelectItem value="affidavit_of_single_status">Affidavit of Single Status</SelectItem>
                      <SelectItem value="affidavit_of_death">Affidavit of Death</SelectItem>
                      <SelectItem value="affidavit_of_birth">Affidavit of Birth</SelectItem>
                      <SelectItem value="affidavit_of_ownership">Affidavit of Ownership</SelectItem>
                      <SelectItem value="affidavit_of_loss">Affidavit of Loss</SelectItem>
                      <SelectItem value="affidavit_of_support">Affidavit of Support</SelectItem>
                      <SelectItem value="affidavit_of_truth">Affidavit of Truth</SelectItem>
                      <SelectItem value="affidavit_of_consent">Affidavit of Consent</SelectItem>
                      <SelectItem value="affidavit_of_undertaking">Affidavit of Undertaking</SelectItem>
                      <SelectItem value="affidavit_of_compliance">Affidavit of Compliance</SelectItem>
                      <SelectItem value="affidavit_of_disclosure">Affidavit of Disclosure</SelectItem>
                      <SelectItem value="affidavit_of_verification">Affidavit of Verification</SelectItem>
                      <SelectItem value="affidavit_of_identification">Affidavit of Identification</SelectItem>
                      <SelectItem value="affidavit_of_good_faith">Affidavit of Good Faith</SelectItem>
                      <SelectItem value="affidavit_of_due_diligence">Affidavit of Due Diligence</SelectItem>
                      <SelectItem value="affidavit_of_best_knowledge">Affidavit of Best Knowledge</SelectItem>
                      <SelectItem value="affidavit_of_belief">Affidavit of Belief</SelectItem>
                      <SelectItem value="affidavit_of_intent">Affidavit of Intent</SelectItem>
                      <SelectItem value="affidavit_of_purpose">Affidavit of Purpose</SelectItem>
                      <SelectItem value="affidavit_of_explanation">Affidavit of Explanation</SelectItem>
                      <SelectItem value="affidavit_of_justification">Affidavit of Justification</SelectItem>
                      <SelectItem value="affidavit_of_necessity">Affidavit of Necessity</SelectItem>
                      <SelectItem value="affidavit_of_urgency">Affidavit of Urgency</SelectItem>
                      <SelectItem value="affidavit_of_emergency">Affidavit of Emergency</SelectItem>
                      <SelectItem value="affidavit_of_exigency">Affidavit of Exigency</SelectItem>
                      <SelectItem value="affidavit_of_compelling_circumstances">Affidavit of Compelling Circumstances</SelectItem>
                      <SelectItem value="affidavit_of_extraordinary_circumstances">Affidavit of Extraordinary Circumstances</SelectItem>
                      <SelectItem value="affidavit_of_unforeseen_circumstances">Affidavit of Unforeseen Circumstances</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_circumstances">Affidavit of Unavoidable Circumstances</SelectItem>
                      <SelectItem value="affidavit_of_force_majeure">Affidavit of Force Majeure</SelectItem>
                      <SelectItem value="affidavit_of_act_of_god">Affidavit of Act of God</SelectItem>
                      <SelectItem value="affidavit_of_vis_major">Affidavit of Vis Major</SelectItem>
                      <SelectItem value="affidavit_of_inevitable_accident">Affidavit of Inevitable Accident</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_delay">Affidavit of Unavoidable Delay</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_delay">Affidavit of Unforeseeable Delay</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_hardship">Affidavit of Unavoidable Hardship</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_hardship">Affidavit of Unforeseeable Hardship</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_difficulty">Affidavit of Unavoidable Difficulty</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_difficulty">Affidavit of Unforeseeable Difficulty</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_impossibility">Affidavit of Unavoidable Impossibility</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_impossibility">Affidavit of Unforeseeable Impossibility</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_frustration">Affidavit of Unavoidable Frustration</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_frustration">Affidavit of Unforeseeable Frustration</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_failure">Affidavit of Unavoidable Failure</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_failure">Affidavit of Unforeseeable Failure</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_inability">Affidavit of Unavoidable Inability</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_inability">Affidavit of Unforeseeable Inability</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_incapacity">Affidavit of Unavoidable Incapacity</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_incapacity">Affidavit of Unforeseeable Incapacity</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_disability">Affidavit of Unavoidable Disability</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_disability">Affidavit of Unforeseeable Disability</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_infirmity">Affidavit of Unavoidable Infirmity</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_infirmity">Affidavit of Unforeseeable Infirmity</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_illness">Affidavit of Unavoidable Illness</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_illness">Affidavit of Unforeseeable Illness</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_sickness">Affidavit of Unavoidable Sickness</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_sickness">Affidavit of Unforeseeable Sickness</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_disease">Affidavit of Unavoidable Disease</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_disease">Affidavit of Unforeseeable Disease</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_condition">Affidavit of Unavoidable Condition</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_condition">Affidavit of Unforeseeable Condition</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_situation">Affidavit of Unavoidable Situation</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_situation">Affidavit of Unforeseeable Situation</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_event">Affidavit of Unavoidable Event</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_event">Affidavit of Unforeseeable Event</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_occurrence">Affidavit of Unavoidable Occurrence</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_occurrence">Affidavit of Unforeseeable Occurrence</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_incident">Affidavit of Unavoidable Incident</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_incident">Affidavit of Unforeseeable Incident</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_accident">Affidavit of Unavoidable Accident</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_accident">Affidavit of Unforeseeable Accident</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_mishap">Affidavit of Unavoidable Mishap</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_mishap">Affidavit of Unforeseeable Mishap</SelectItem>
                      <SelectItem value="affidavit_of_unavoidable_calamity">Affidavit of Unavoidable Calamity</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeable_calamity">Affidavit of Unforeseeable Calamity</SelectItem>
                      <SelectItem value="affidavit_of_unavoidabledisaster">Affidavit of Unavoidable Disaster</SelectItem>
                      <SelectItem value="affidavit_of_unforeseeabledisaster">Affidavit of Unforeseeable Disaster</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of legal document you want to generate.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="E.g., This agreement outlines the terms and conditions of a partnership between two parties..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide detailed information about the document you want to generate.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="pt-6">
              <Button type="submit" disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Document
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DocumentDraftingForm;
