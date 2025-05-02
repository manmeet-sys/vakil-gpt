
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseDocumentGenerator } from '../base';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Building2, File, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const propertyDocumentSchema = z.object({
  documentType: z.string(),
  propertyAddress: z.string().min(5, { message: "Property address is required" }),
  propertyDescription: z.string().min(10, { message: "Property description is required" }),
  jurisdictionState: z.string().min(2, { message: "State is required" }),
  sellerName: z.string().min(2, { message: "Seller name is required" }),
  sellerAddress: z.string().min(5, { message: "Seller address is required" }),
  buyerName: z.string().min(2, { message: "Buyer name is required" }), 
  buyerAddress: z.string().min(5, { message: "Buyer address is required" }),
  considerationAmount: z.string().min(1, { message: "Consideration amount is required" }),
  executionDate: z.string(),
  stampDuty: z.string().optional(),
  registrationFee: z.string().optional(),
  includeClauses: z.array(z.string()).optional(),
  additionalTerms: z.string().optional(),
});

type PropertyDocumentFormValues = z.infer<typeof propertyDocumentSchema>;

const leaseAgreementSchema = z.object({
  propertyAddress: z.string().min(5, { message: "Property address is required" }),
  propertyDescription: z.string().min(10, { message: "Property description is required" }),
  lessorName: z.string().min(2, { message: "Lessor name is required" }),
  lessorAddress: z.string().min(5, { message: "Lessor address is required" }),
  lesseeName: z.string().min(2, { message: "Lessee name is required" }), 
  lesseeAddress: z.string().min(5, { message: "Lessee address is required" }),
  leaseType: z.string(),
  purpose: z.string(),
  leasePeriod: z.string().min(1, { message: "Lease period is required" }),
  rentAmount: z.string().min(1, { message: "Rent amount is required" }),
  securityDeposit: z.string().min(1, { message: "Security deposit is required" }),
  maintenanceTerms: z.string().optional(),
  additionalTerms: z.string().optional(),
});

type LeaseAgreementFormValues = z.infer<typeof leaseAgreementSchema>;

const PropertyDocumentGenerator = () => {
  const [activeTab, setActiveTab] = useState<string>("deed");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedDocument, setGeneratedDocument] = useState<{ title: string; content: string } | null>(null);
  
  // Form for property sale/transfer documents
  const propertyDocForm = useForm<PropertyDocumentFormValues>({
    resolver: zodResolver(propertyDocumentSchema),
    defaultValues: {
      documentType: "saleDeed",
      propertyAddress: "",
      propertyDescription: "",
      jurisdictionState: "",
      sellerName: "",
      sellerAddress: "",
      buyerName: "",
      buyerAddress: "",
      considerationAmount: "",
      executionDate: new Date().toISOString().split('T')[0],
      stampDuty: "",
      registrationFee: "",
      includeClauses: ["title", "possession", "encumbrance", "indemnity"],
      additionalTerms: "",
    }
  });
  
  // Form for lease agreements
  const leaseAgreementForm = useForm<LeaseAgreementFormValues>({
    resolver: zodResolver(leaseAgreementSchema),
    defaultValues: {
      propertyAddress: "",
      propertyDescription: "",
      lessorName: "",
      lessorAddress: "",
      lesseeName: "",
      lesseeAddress: "",
      leaseType: "residential",
      purpose: "",
      leasePeriod: "",
      rentAmount: "",
      securityDeposit: "",
      maintenanceTerms: "",
      additionalTerms: "",
    }
  });
  
  const deedClauses = [
    {
      id: "title",
      label: "Title Warranty Clause",
    },
    {
      id: "possession",
      label: "Possession & Transfer Clause",
    },
    {
      id: "encumbrance",
      label: "Free from Encumbrance",
    },
    {
      id: "indemnity",
      label: "Indemnity Clause",
    },
    {
      id: "tax",
      label: "Tax Clearance",
    },
    {
      id: "property-tax",
      label: "Property Tax Clause",
    },
    {
      id: "dispute",
      label: "Dispute Resolution",
    },
  ];
  
  const handlePropertyDocSubmit = (values: PropertyDocumentFormValues) => {
    setIsGenerating(true);
    console.log("Property Document Values:", values);
    
    // Simulate document generation
    setTimeout(() => {
      const documentTypes: Record<string, string> = {
        "saleDeed": "Sale Deed",
        "giftDeed": "Gift Deed",
        "conveyanceDeed": "Conveyance Deed",
        "mortgageDeed": "Mortgage Deed",
        "releaseOfMortgage": "Release of Mortgage Deed",
      };
      
      const documentTitle = documentTypes[values.documentType] || "Property Document";
      
      // Simple document content generation based on form values
      const documentContent = generatePropertyDocumentContent(values);
      
      setGeneratedDocument({
        title: documentTitle,
        content: documentContent,
      });
      
      setIsGenerating(false);
      toast.success(`${documentTitle} generated successfully`);
    }, 2000);
  };
  
  const handleLeaseAgreementSubmit = (values: LeaseAgreementFormValues) => {
    setIsGenerating(true);
    console.log("Lease Agreement Values:", values);
    
    // Simulate document generation
    setTimeout(() => {
      const leaseTypes: Record<string, string> = {
        "residential": "Residential Lease Agreement",
        "commercial": "Commercial Lease Agreement",
        "industrial": "Industrial Lease Agreement",
      };
      
      const documentTitle = leaseTypes[values.leaseType] || "Lease Agreement";
      
      // Simple document content generation based on form values
      const documentContent = generateLeaseAgreementContent(values);
      
      setGeneratedDocument({
        title: documentTitle,
        content: documentContent,
      });
      
      setIsGenerating(false);
      toast.success(`${documentTitle} generated successfully`);
    }, 2000);
  };
  
  const generatePropertyDocumentContent = (values: PropertyDocumentFormValues): string => {
    const documentTypes: Record<string, string> = {
      "saleDeed": "Sale Deed",
      "giftDeed": "Gift Deed",
      "conveyanceDeed": "Conveyance Deed",
      "mortgageDeed": "Mortgage Deed",
      "releaseOfMortgage": "Release of Mortgage Deed",
    };
    
    const documentTitle = documentTypes[values.documentType] || "Property Document";
    
    let content = `${documentTitle.toUpperCase()}\n\n`;
    content += `THIS ${documentTitle.toUpperCase()} is made on this ${new Date(values.executionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} by and between:\n\n`;
    
    content += `${values.sellerName.toUpperCase()}, residing at ${values.sellerAddress}, hereinafter referred to as the "SELLER/TRANSFEROR"\n\n`;
    content += `AND\n\n`;
    content += `${values.buyerName.toUpperCase()}, residing at ${values.buyerAddress}, hereinafter referred to as the "PURCHASER/TRANSFEREE"\n\n`;
    
    content += `WHEREAS the Seller is the absolute owner of the property more fully described in the Schedule hereunder, having acquired the same by [previous title document details].\n\n`;
    
    content += `AND WHEREAS the Seller has agreed to sell and the Purchaser has agreed to purchase the said property for a total consideration of Rs. ${values.considerationAmount}/- (Rupees ${numberToWords(values.considerationAmount)} Only).\n\n`;
    
    content += `NOW THIS DEED WITNESSETH AS FOLLOWS:\n\n`;
    
    content += `1. In consideration of the sum of Rs. ${values.considerationAmount}/- (Rupees ${numberToWords(values.considerationAmount)} Only) paid by the Purchaser to the Seller (the receipt of which the Seller hereby acknowledges), the Seller hereby transfers, conveys, and assigns unto the Purchaser ALL THAT piece and parcel of property more fully described in the Schedule hereunder, TO HAVE AND TO HOLD the same absolutely and forever.\n\n`;
    
    if (values.includeClauses?.includes('title')) {
      content += `2. The Seller hereby covenants with the Purchaser that the Seller has good and marketable title to the said property and has full power to transfer the same, and that the property is free from all encumbrances, claims, and demands.\n\n`;
    }
    
    if (values.includeClauses?.includes('possession')) {
      content += `3. The Seller shall deliver vacant and peaceful possession of the property to the Purchaser simultaneously with the execution of this deed.\n\n`;
    }
    
    if (values.includeClauses?.includes('encumbrance')) {
      content += `4. The Seller hereby declares that the property is free from all encumbrances, charges, mortgages, liens, gifts, attachments, acquisition proceedings, or any other claims whatsoever.\n\n`;
    }
    
    if (values.includeClauses?.includes('indemnity')) {
      content += `5. The Seller hereby indemnifies the Purchaser against all actions, claims, demands, and proceedings in respect of the title of the property and against all costs, charges, and expenses that may be incurred by the Purchaser in that behalf.\n\n`;
    }
    
    content += `SCHEDULE OF PROPERTY\n\n`;
    content += `All that piece and parcel of property situated at ${values.propertyAddress}, more particularly described as follows:\n`;
    content += `${values.propertyDescription}\n\n`;
    
    content += `IN WITNESS WHEREOF, the parties hereto have set their hands and signatures on the day, month and year first above written.\n\n`;
    
    content += `Signed and delivered by the Seller\n\n`;
    content += `_________________________\n`;
    content += `(${values.sellerName})\n\n`;
    
    content += `In the presence of:\n\n`;
    content += `1. _________________________ (Witness 1)\n\n`;
    content += `2. _________________________ (Witness 2)\n\n`;
    
    content += `Signed and taken over by the Purchaser\n\n`;
    content += `_________________________\n`;
    content += `(${values.buyerName})\n\n`;
    
    content += `In the presence of:\n\n`;
    content += `1. _________________________ (Witness 1)\n\n`;
    content += `2. _________________________ (Witness 2)\n\n`;
    
    return content;
  };
  
  const generateLeaseAgreementContent = (values: LeaseAgreementFormValues): string => {
    const leaseTypes: Record<string, string> = {
      "residential": "Residential",
      "commercial": "Commercial",
      "industrial": "Industrial",
    };
    
    const leaseType = leaseTypes[values.leaseType] || "Property";
    
    let content = `${leaseType.toUpperCase()} LEASE AGREEMENT\n\n`;
    content += `THIS LEASE AGREEMENT is made on this ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}\n\n`;
    
    content += `BETWEEN\n\n`;
    content += `${values.lessorName.toUpperCase()}, residing at ${values.lessorAddress}, hereinafter referred to as the "LESSOR" (which term shall mean and include its successors, legal representatives, and assigns) of the ONE PART\n\n`;
    content += `AND\n\n`;
    content += `${values.lesseeName.toUpperCase()}, residing at ${values.lesseeAddress}, hereinafter referred to as the "LESSEE" (which term shall mean and include its successors, legal representatives, and assigns) of the OTHER PART\n\n`;
    
    content += `WHEREAS the Lessor is the absolute owner of the premises situated at ${values.propertyAddress}, more particularly described in the Schedule hereunder (hereinafter referred to as the "Leased Premises").\n\n`;
    content += `AND WHEREAS the Lessee has approached the Lessor to take the Leased Premises on lease for ${values.purpose ? values.purpose : leaseType.toLowerCase()} purpose, and the Lessor has agreed to lease the same to the Lessee on the terms and conditions hereinafter set forth.\n\n`;
    
    content += `NOW THIS AGREEMENT WITNESSETH AND IT IS HEREBY AGREED BY AND BETWEEN THE PARTIES HERETO AS FOLLOWS:\n\n`;
    
    content += `1. PREMISES\n\n`;
    content += `The Lessor hereby leases to the Lessee and the Lessee hereby takes on lease from the Lessor the Leased Premises more fully described in the Schedule hereunder.\n\n`;
    
    content += `2. TERM\n\n`;
    content += `The lease shall be for a period of ${values.leasePeriod} commencing from ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.\n\n`;
    
    content += `3. RENT\n\n`;
    content += `The Lessee shall pay to the Lessor a monthly rent of Rs. ${values.rentAmount}/- (Rupees ${numberToWords(values.rentAmount)} Only), payable in advance on or before the 5th day of each calendar month.\n\n`;
    
    content += `4. SECURITY DEPOSIT\n\n`;
    content += `The Lessee has paid to the Lessor a sum of Rs. ${values.securityDeposit}/- (Rupees ${numberToWords(values.securityDeposit)} Only) as interest-free refundable security deposit, the receipt of which the Lessor hereby acknowledges. The security deposit shall be refunded to the Lessee at the time of vacating the Leased Premises after deducting therefrom any amounts due from the Lessee to the Lessor under this Agreement.\n\n`;
    
    if (values.maintenanceTerms) {
      content += `5. MAINTENANCE\n\n`;
      content += `${values.maintenanceTerms}\n\n`;
    }
    
    content += `6. USE OF PREMISES\n\n`;
    content += `The Lessee shall use the Leased Premises only for ${values.purpose || leaseType.toLowerCase()} purpose and shall not use the same for any other purpose without the prior written consent of the Lessor.\n\n`;
    
    content += `7. RESTRICTIONS ON LESSEE\n\n`;
    content += `The Lessee shall not:\n`;
    content += `(a) Make any structural alterations or additions to the Leased Premises without the prior written consent of the Lessor;\n`;
    content += `(b) Sub-let, assign or part with possession of the Leased Premises or any part thereof;\n`;
    content += `(c) Use the Leased Premises for any illegal or immoral purpose.\n\n`;
    
    if (values.additionalTerms) {
      content += `8. ADDITIONAL TERMS\n\n`;
      content += `${values.additionalTerms}\n\n`;
    }
    
    content += `SCHEDULE OF PROPERTY\n\n`;
    content += `All that ${leaseType.toLowerCase()} premises situated at ${values.propertyAddress}, more particularly described as follows:\n`;
    content += `${values.propertyDescription}\n\n`;
    
    content += `IN WITNESS WHEREOF, the parties hereto have set their hands and signatures on the day, month and year first above written.\n\n`;
    
    content += `Signed and delivered by the Lessor\n\n`;
    content += `_________________________\n`;
    content += `(${values.lessorName})\n\n`;
    
    content += `Signed and accepted by the Lessee\n\n`;
    content += `_________________________\n`;
    content += `(${values.lesseeName})\n\n`;
    
    content += `In the presence of:\n\n`;
    content += `1. _________________________ (Witness 1)\n\n`;
    content += `2. _________________________ (Witness 2)\n\n`;
    
    return content;
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setGeneratedDocument(null);
  };
  
  const handleEditDocument = () => {
    setGeneratedDocument(null);
  };
  
  // Helper function to convert numbers to words (simplified)
  const numberToWords = (num: string): string => {
    const numValue = parseFloat(num);
    if (isNaN(numValue)) return "";
    
    // This is simplified - a real version would handle proper conversion
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    return formatter.format(numValue).replace('₹', '').trim();
  };
  
  return (
    <BaseDocumentGenerator
      title="Property Document Generator"
      description="Create legally compliant property documents, sale deeds, and lease agreements"
      icon={<FileText className="h-6 w-6 text-blue-600" />}
      handleGenerate={() => {
        if (activeTab === "deed") {
          propertyDocForm.handleSubmit(handlePropertyDocSubmit)();
        } else {
          leaseAgreementForm.handleSubmit(handleLeaseAgreementSubmit)();
        }
      }}
      isGenerating={isGenerating}
      generatedDocument={generatedDocument}
      onEditDocument={handleEditDocument}
    >
      {!generatedDocument ? (
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="deed" className="flex items-center gap-1.5">
              <File className="h-4 w-4" />
              <span>Property Deeds</span>
            </TabsTrigger>
            <TabsTrigger value="lease" className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              <span>Lease Agreements</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="deed" className="space-y-6">
            <Form {...propertyDocForm}>
              <form onSubmit={propertyDocForm.handleSubmit(handlePropertyDocSubmit)} className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={propertyDocForm.control}
                      name="documentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Document Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select document type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="saleDeed">Sale Deed</SelectItem>
                              <SelectItem value="giftDeed">Gift Deed</SelectItem>
                              <SelectItem value="conveyanceDeed">Conveyance Deed</SelectItem>
                              <SelectItem value="mortgageDeed">Mortgage Deed</SelectItem>
                              <SelectItem value="releaseOfMortgage">Release of Mortgage</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-base font-medium mb-3">Property Details</h3>
                      
                      <div className="space-y-4">
                        <FormField
                          control={propertyDocForm.control}
                          name="propertyAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property Address</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Complete property address" 
                                  className="resize-none" 
                                  {...field} 
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={propertyDocForm.control}
                          name="propertyDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Survey number, boundaries, dimensions, etc." 
                                  className="resize-none" 
                                  {...field} 
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={propertyDocForm.control}
                          name="jurisdictionState"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jurisdiction State</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Maharashtra" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <h3 className="text-base font-medium mb-3">Seller/Transferor Details</h3>
                          
                          <div className="space-y-4">
                            <FormField
                              control={propertyDocForm.control}
                              name="sellerName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Seller Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Full legal name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={propertyDocForm.control}
                              name="sellerAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Seller Address</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Seller's full address" 
                                      className="resize-none" 
                                      {...field}
                                      rows={2}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-base font-medium mb-3">Buyer/Transferee Details</h3>
                          
                          <div className="space-y-4">
                            <FormField
                              control={propertyDocForm.control}
                              name="buyerName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Buyer Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Full legal name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={propertyDocForm.control}
                              name="buyerAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Buyer Address</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Buyer's full address" 
                                      className="resize-none" 
                                      {...field}
                                      rows={2}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-base font-medium mb-3">Transaction Details</h3>
                      
                      <div className="space-y-4">
                        <FormField
                          control={propertyDocForm.control}
                          name="considerationAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Consideration Amount (₹)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 50,00,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={propertyDocForm.control}
                            name="stampDuty"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stamp Duty (₹)</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. 250000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={propertyDocForm.control}
                            name="registrationFee"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Registration Fee (₹)</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. 30000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={propertyDocForm.control}
                          name="executionDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Execution Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-base font-medium mb-3">Document Clauses & Terms</h3>
                      
                      <div className="space-y-4">
                        <FormField
                          control={propertyDocForm.control}
                          name="includeClauses"
                          render={() => (
                            <FormItem>
                              <div className="mb-2">
                                <FormLabel>Include Standard Clauses</FormLabel>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {deedClauses.map((clause) => (
                                  <FormField
                                    key={clause.id}
                                    control={propertyDocForm.control}
                                    name="includeClauses"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={clause.id}
                                          className="flex flex-row items-start space-x-2 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(clause.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...field.value || [], clause.id])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) => value !== clause.id
                                                      )
                                                    );
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="text-sm font-normal">
                                            {clause.label}
                                          </FormLabel>
                                        </FormItem>
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={propertyDocForm.control}
                          name="additionalTerms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Terms & Conditions</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Any additional terms to include" 
                                  className="resize-none" 
                                  {...field}
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="lease" className="space-y-6">
            <Form {...leaseAgreementForm}>
              <form onSubmit={leaseAgreementForm.handleSubmit(handleLeaseAgreementSubmit)} className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={leaseAgreementForm.control}
                        name="leaseType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lease Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select lease type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="residential">Residential Lease</SelectItem>
                                <SelectItem value="commercial">Commercial Lease</SelectItem>
                                <SelectItem value="industrial">Industrial Lease</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={leaseAgreementForm.control}
                        name="purpose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Purpose of Lease</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Residential accommodation, Office space" {...field} />
                            </FormControl>
                            <FormDescription>
                              Specific purpose for which the property is being leased
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-base font-medium mb-3">Property Details</h3>
                      
                      <div className="space-y-4">
                        <FormField
                          control={leaseAgreementForm.control}
                          name="propertyAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property Address</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Complete property address" 
                                  className="resize-none" 
                                  {...field} 
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={leaseAgreementForm.control}
                          name="propertyDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Property Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Area, number of rooms, amenities, etc." 
                                  className="resize-none" 
                                  {...field} 
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <h3 className="text-base font-medium mb-3">Lessor (Owner) Details</h3>
                          
                          <div className="space-y-4">
                            <FormField
                              control={leaseAgreementForm.control}
                              name="lessorName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Lessor Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Full legal name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={leaseAgreementForm.control}
                              name="lessorAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Lessor Address</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Lessor's full address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-base font-medium mb-3">Lessee (Tenant) Details</h3>
                          
                          <div className="space-y-4">
                            <FormField
                              control={leaseAgreementForm.control}
                              name="lesseeName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Lessee Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Full legal name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={leaseAgreementForm.control}
                              name="lesseeAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Lessee Address</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Lessee's full address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-base font-medium mb-3">Lease Terms</h3>
                      
                      <div className="space-y-4">
                        <FormField
                          control={leaseAgreementForm.control}
                          name="leasePeriod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lease Period</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 11 months, 3 years" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={leaseAgreementForm.control}
                          name="rentAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly Rent (₹)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 25,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={leaseAgreementForm.control}
                          name="securityDeposit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Security Deposit (₹)</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 1,00,000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-base font-medium mb-3">Additional Terms</h3>
                      
                      <div className="space-y-4">
                        <FormField
                          control={leaseAgreementForm.control}
                          name="maintenanceTerms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maintenance Terms</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Define maintenance responsibilities" 
                                  className="resize-none" 
                                  {...field}
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={leaseAgreementForm.control}
                          name="additionalTerms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Terms & Conditions</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Any additional terms to include in the lease" 
                                  className="resize-none" 
                                  {...field}
                                  rows={4}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      ) : null}
    </BaseDocumentGenerator>
  );
};

export default PropertyDocumentGenerator;
