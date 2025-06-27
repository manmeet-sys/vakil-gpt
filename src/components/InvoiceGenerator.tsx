
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Download, FileText, Eye, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useBilling } from '@/context/BillingContext';
import { generateTimeSheetPDF, downloadPDF } from '@/utils/pdfGenerator';

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  amount: number;
  date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  entries: any[];
}

const InvoiceGenerator = () => {
  const { billingEntries } = useBilling();
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);

  // Group entries by client to create mock invoices
  const groupedEntries = billingEntries.reduce((acc, entry) => {
    if (!entry.client_name) return acc;
    
    if (!acc[entry.client_name]) {
      acc[entry.client_name] = [];
    }
    acc[entry.client_name].push(entry);
    return acc;
  }, {} as Record<string, any[]>);

  // Create mock invoices from grouped entries
  const mockInvoices: Invoice[] = Object.entries(groupedEntries).map(([clientName, entries], index) => {
    const totalAmount = entries.reduce((sum, entry) => {
      const hours = entry.hours_spent || 0;
      const rate = entry.hourly_rate || 0;
      return sum + (hours * rate);
    }, 0);

    return {
      id: `inv-${index + 1}`,
      invoice_number: `INV-${String(index + 1).padStart(4, '0')}`,
      client_name: clientName,
      amount: totalAmount,
      date: format(new Date(), 'yyyy-MM-dd'),
      status: Math.random() > 0.5 ? 'sent' : 'draft',
      entries
    };
  });

  const handleDownloadInvoice = async (invoice: Invoice) => {
    setGeneratingInvoice(invoice.id);
    
    try {
      console.log('Starting PDF generation for invoice:', invoice.invoice_number);
      
      // Generate PDF for the specific invoice
      const pdfBlob = await generateTimeSheetPDF({
        entries: invoice.entries,
        reportType: 'invoice',
        clientName: invoice.client_name,
        invoiceNumber: invoice.invoice_number,
      });

      console.log('PDF blob generated, starting download...');

      // Download the PDF
      await downloadPDF(pdfBlob, `${invoice.invoice_number}-${invoice.client_name.replace(/\s+/g, '_')}`);
      
      toast.success(`Invoice ${invoice.invoice_number} is ready for download/print!`);
      
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      toast.error('Failed to generate invoice PDF. Please try again.');
    } finally {
      setGeneratingInvoice(null);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'secondary';
      case 'sent':
        return 'default';
      case 'overdue':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Invoice Management
          </CardTitle>
          <CardDescription>
            Generate and manage invoices for your legal services
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockInvoices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-2">No invoices available</p>
              <p className="text-sm">Add time entries to generate invoices</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Recent Invoices</h3>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Invoice
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoice_number}
                      </TableCell>
                      <TableCell>{invoice.client_name}</TableCell>
                      <TableCell>
                        {format(new Date(invoice.date), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{invoice.amount.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusVariant(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-1"
                            onClick={() => handleDownloadInvoice(invoice)}
                            disabled={generatingInvoice === invoice.id}
                          >
                            {generatingInvoice === invoice.id ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                                Generating...
                              </>
                            ) : (
                              <>
                                <Download className="h-3 w-3" />
                                Download
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Total Invoices: {mockInvoices.length}</span>
                  <span>
                    Total Value: ₹{mockInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceGenerator;
