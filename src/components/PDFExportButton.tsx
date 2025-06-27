
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Download, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { generateTimeSheetPDF, downloadPDF } from '@/utils/pdfGenerator';

interface BillingEntry {
  id: string;
  client_name: string | null;
  activity_type: string;
  hours_spent: number;
  date: string | null;
  description: string | null;
  hourly_rate: number | null;
  amount: number | null;
  invoice_status: string | null;
}

interface PDFExportButtonProps {
  entries: BillingEntry[];
}

const exportSchema = z.object({
  reportType: z.enum(['timesheet', 'invoice', 'summary']),
  clientFilter: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  filename: z.string().min(1, 'Filename is required'),
});

type ExportFormValues = z.infer<typeof exportSchema>;

const PDFExportButton = ({ entries }: PDFExportButtonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<ExportFormValues>({
    resolver: zodResolver(exportSchema),
    defaultValues: {
      reportType: 'timesheet',
      clientFilter: '',
      startDate: '',
      endDate: '',
      filename: `billing-report-${format(new Date(), 'yyyy-MM-dd')}`,
    },
  });

  const onSubmit = async (values: ExportFormValues) => {
    setIsGenerating(true);
    
    try {
      // Filter entries based on form criteria
      let filteredEntries = entries;
      
      if (values.clientFilter) {
        filteredEntries = filteredEntries.filter(entry => 
          entry.client_name?.toLowerCase().includes(values.clientFilter!.toLowerCase())
        );
      }
      
      if (values.startDate && values.endDate) {
        filteredEntries = filteredEntries.filter(entry => {
          if (!entry.date) return false;
          const entryDate = new Date(entry.date);
          const startDate = new Date(values.startDate!);
          const endDate = new Date(values.endDate!);
          return entryDate >= startDate && entryDate <= endDate;
        });
      }

      if (filteredEntries.length === 0) {
        toast.error('No entries match your filter criteria');
        return;
      }

      // Generate PDF
      const pdfBlob = await generateTimeSheetPDF({
        entries: filteredEntries,
        reportType: values.reportType,
        dateRange: values.startDate && values.endDate ? {
          start: values.startDate,
          end: values.endDate
        } : undefined,
        clientName: values.clientFilter || undefined,
      });

      // Download the PDF
      downloadPDF(pdfBlob, values.filename);
      
      toast.success(`${values.reportType} report generated successfully!`);
      setIsDialogOpen(false);
      form.reset();
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    } finally {
      setIsGenerating(false);
    }
  };

  const uniqueClients = Array.from(new Set(entries.map(e => e.client_name).filter(Boolean)));

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Export PDF Report
          </DialogTitle>
          <DialogDescription>
            Generate and download a professional PDF report of your billing data
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="timesheet">Time Sheet Report</SelectItem>
                      <SelectItem value="invoice">Invoice Format</SelectItem>
                      <SelectItem value="summary">Summary Report</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="clientFilter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filter by Client (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All clients" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">All Clients</SelectItem>
                      {uniqueClients.map((client) => (
                        <SelectItem key={client} value={client!}>
                          {client}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="filename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filename</FormLabel>
                  <FormControl>
                    <Input placeholder="billing-report" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Generate PDF
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PDFExportButton;
