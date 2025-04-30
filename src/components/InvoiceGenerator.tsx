
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Download, File, IndianRupee, Plus } from 'lucide-react';
import { useBilling } from '@/context/BillingContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

const invoiceSchema = z.object({
  clientName: z.string().min(1, { message: 'Client name is required' }),
  invoiceNumber: z.string().min(1, { message: 'Invoice number is required' }),
  issueDate: z.string().min(1, { message: 'Issue date is required' }),
  dueDate: z.string().min(1, { message: 'Due date is required' }),
  items: z.array(z.object({
    description: z.string().min(1, { message: 'Description is required' }),
    quantity: z.coerce.number().min(0.1, { message: 'Quantity must be greater than 0' }),
    rate: z.coerce.number().min(1, { message: 'Rate must be greater than 0' }),
    amount: z.coerce.number().optional(),
  })).min(1, { message: 'At least one item is required' }),
  subtotal: z.coerce.number().optional(),
  taxRate: z.coerce.number().min(0, { message: 'Tax rate must be 0 or greater' }),
  taxAmount: z.coerce.number().optional(),
  totalAmount: z.coerce.number().optional(),
  notes: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

const InvoiceGenerator = () => {
  const { billingEntries, addInvoice } = useBilling();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientName: '',
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 15 days later
      items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      subtotal: 0,
      taxRate: 18, // Default GST rate in India
      taxAmount: 0,
      totalAmount: 0,
      notes: 'Payment is due within 15 days of issue. Please include the invoice number with your payment.',
    },
  });

  // Add a new line item to the invoice
  const addItem = () => {
    const items = form.getValues('items');
    form.setValue('items', [...items, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  // Remove an item from the invoice
  const removeItem = (index: number) => {
    const items = form.getValues('items');
    if (items.length > 1) {
      form.setValue('items', items.filter((_, i) => i !== index));
      calculateTotals();
    } else {
      toast.warning('Invoice must have at least one item');
    }
  };

  // Calculate line item amount when quantity or rate changes
  const calculateItemAmount = (index: number) => {
    const items = form.getValues('items');
    const item = items[index];
    const amount = item.quantity * item.rate;
    items[index].amount = amount;
    form.setValue('items', items);
    calculateTotals();
  };

  // Calculate subtotal, tax, and total amounts
  const calculateTotals = () => {
    const items = form.getValues('items');
    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const taxRate = form.getValues('taxRate');
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    form.setValue('subtotal', subtotal);
    form.setValue('taxAmount', taxAmount);
    form.setValue('totalAmount', totalAmount);
  };

  // Handle form submission
  const onSubmit = async (values: InvoiceFormValues) => {
    try {
      // Transform the form values to match the invoice structure in BillingContext
      await addInvoice({
        invoice_number: values.invoiceNumber,
        client_id: null, // Would be populated with actual client_id in a real implementation
        matter_id: null, // Would be populated with actual matter_id in a real implementation
        amount: values.subtotal,
        tax_amount: values.taxAmount,
        total_amount: values.totalAmount,
        status: 'draft',
        issue_date: values.issueDate,
        due_date: values.dueDate,
        paid_date: null,
        notes: values.notes,
      });
      
      toast.success('Invoice created successfully');
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    }
  };

  // Generate a PDF invoice
  const generatePDF = () => {
    toast.success('Invoice PDF generated and ready to download');
    // In a real implementation, this would use a library like pdfmake or jspdf to generate a PDF
  };

  // Pull unbilled entries into the invoice
  const pullUnbilledEntries = () => {
    const unbilledEntries = billingEntries.filter(entry => entry.invoice_status === 'unbilled');
    
    if (unbilledEntries.length === 0) {
      toast.warning('No unbilled entries found');
      return;
    }
    
    // Group entries by client
    const clientEntries = unbilledEntries.reduce((acc, entry) => {
      const clientName = entry.client_name || 'Unknown Client';
      if (!acc[clientName]) {
        acc[clientName] = [];
      }
      acc[clientName].push(entry);
      return acc;
    }, {} as Record<string, typeof unbilledEntries>);
    
    // Use the first client with entries
    const clientName = Object.keys(clientEntries)[0];
    const entries = clientEntries[clientName];
    
    form.setValue('clientName', clientName);
    
    // Convert entries to invoice items
    const items = entries.map(entry => {
      const amount = (entry.hours_spent || 0) * (entry.hourly_rate || 0);
      return {
        description: `${entry.activity_type}: ${entry.description || ''}`,
        quantity: entry.hours_spent || 0,
        rate: entry.hourly_rate || 0,
        amount,
      };
    });
    
    form.setValue('items', items);
    calculateTotals();
    toast.success(`Added ${items.length} unbilled entries for ${clientName}`);
  };

  return (
    <Card className="border border-blue-100 dark:border-blue-900/20 shadow-elegant">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Invoice Generator</span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>
                  Generate a professional invoice for your client
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter client name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="invoiceNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="issueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Due Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Items</h3>
                      <div className="space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={pullUnbilledEntries}
                        >
                          Pull Unbilled Entries
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={addItem}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-md">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 w-1/2">Description</th>
                            <th className="text-right p-2 w-1/6">Quantity</th>
                            <th className="text-right p-2 w-1/6">Rate (₹)</th>
                            <th className="text-right p-2 w-1/6">Amount (₹)</th>
                            <th className="p-2 w-12"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.watch('items').map((_, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2">
                                <FormField
                                  control={form.control}
                                  name={`items.${index}.description`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input placeholder="Item description" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </td>
                              <td className="p-2">
                                <FormField
                                  control={form.control}
                                  name={`items.${index}.quantity`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input 
                                          type="number" 
                                          step="0.1" 
                                          className="text-right" 
                                          {...field} 
                                          onChange={e => {
                                            field.onChange(e);
                                            calculateItemAmount(index);
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </td>
                              <td className="p-2">
                                <FormField
                                  control={form.control}
                                  name={`items.${index}.rate`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input 
                                          type="number" 
                                          className="text-right" 
                                          {...field} 
                                          onChange={e => {
                                            field.onChange(e);
                                            calculateItemAmount(index);
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </td>
                              <td className="p-2 text-right">
                                {(form.watch(`items.${index}.amount`) || 0).toLocaleString('en-IN')}
                              </td>
                              <td className="p-2 text-center">
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => removeItem(index)}
                                >
                                  &times;
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                className="h-36" 
                                placeholder="Payment instructions or additional notes" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="font-medium">Subtotal</span>
                        <span className="font-medium">₹{(form.watch('subtotal') || 0).toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">GST</span>
                          <FormField
                            control={form.control}
                            name="taxRate"
                            render={({ field }) => (
                              <FormItem className="w-20">
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    className="text-right h-8" 
                                    {...field} 
                                    onChange={e => {
                                      field.onChange(e);
                                      calculateTotals();
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <span>%</span>
                        </div>
                        <span className="font-medium">₹{(form.watch('taxAmount') || 0).toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div className="border-t pt-2 flex justify-between">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-lg font-semibold">₹{(form.watch('totalAmount') || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Save Invoice
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Create and manage professional invoices for your legal services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white dark:bg-legal-slate/10 shadow-sm hover:shadow-md transition-all duration-300 h-full">
            <CardContent className="p-4 h-full flex flex-col justify-between">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <File className="h-5 w-5 text-blue-600" />
                  <h3 className="text-base font-medium">Generate New Invoice</h3>
                </div>
                <p className="text-sm text-muted-foreground">Create a new GST-compliant invoice from scratch or based on time entries</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-legal-slate/10 shadow-sm hover:shadow-md transition-all duration-300 h-full">
            <CardContent className="p-4 h-full flex flex-col justify-between">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Download className="h-5 w-5 text-green-600" />
                  <h3 className="text-base font-medium">Download Invoice Templates</h3>
                </div>
                <p className="text-sm text-muted-foreground">Access professionally designed invoice templates for different practice areas</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={generatePDF}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceGenerator;
