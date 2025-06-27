import { format } from 'date-fns';

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

interface PDFGenerationOptions {
  entries: BillingEntry[];
  reportType: 'timesheet' | 'invoice' | 'summary';
  dateRange?: {
    start: string;
    end: string;
  };
  clientName?: string;
  invoiceNumber?: string;
}

export const generateTimeSheetPDF = async (options: PDFGenerationOptions): Promise<Blob> => {
  const { entries, reportType, dateRange, clientName, invoiceNumber } = options;
  
  // Calculate totals
  const totalHours = entries.reduce((sum, entry) => sum + (entry.hours_spent || 0), 0);
  const totalAmount = entries.reduce((sum, entry) => {
    const hours = entry.hours_spent || 0;
    const rate = entry.hourly_rate || 0;
    return sum + (hours * rate);
  }, 0);

  // Create HTML content for the PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${reportType === 'invoice' ? `Invoice ${invoiceNumber || ''}` : 'Time Report'}</title>
      <style>
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
        body {
          font-family: 'Arial', sans-serif;
          margin: 20px;
          color: #333;
          line-height: 1.4;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #3b82f6;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          margin: 5px 0;
          color: #666;
          font-size: 14px;
        }
        .invoice-details {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
          background-color: #f8fafc;
          padding: 15px;
          border-radius: 5px;
        }
        .invoice-details div {
          flex: 1;
        }
        .invoice-details h3 {
          margin: 0 0 10px 0;
          color: #3b82f6;
        }
        .summary-box {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          font-size: 14px;
        }
        .summary-item.total {
          font-weight: bold;
          font-size: 18px;
          border-top: 2px solid #3b82f6;
          padding-top: 10px;
          margin-top: 15px;
          color: #3b82f6;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 12px;
        }
        th, td {
          border: 1px solid #e2e8f0;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #3b82f6;
          color: white;
          font-weight: bold;
          text-align: center;
        }
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        .amount {
          text-align: right;
          font-weight: bold;
        }
        .description {
          font-size: 10px;
          color: #666;
          font-style: italic;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 10px;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${reportType === 'invoice' ? 'LEGAL SERVICES INVOICE' : 'TIME TRACKING REPORT'}</h1>
        <p>Generated on ${format(new Date(), 'dd MMMM yyyy')}</p>
        ${invoiceNumber ? `<p><strong>Invoice Number:</strong> ${invoiceNumber}</p>` : ''}
      </div>

      ${reportType === 'invoice' ? `
        <div class="invoice-details">
          <div>
            <h3>Bill To:</h3>
            <p><strong>${clientName || 'Client Name'}</strong></p>
            <p>Client Address</p>
            <p>City, State, PIN</p>
          </div>
          <div>
            <h3>From:</h3>
            <p><strong>Legal Services</strong></p>
            <p>Advocate/Firm Name</p>
            <p>Bar Council Registration</p>
            <p>Office Address</p>
          </div>
        </div>
      ` : ''}

      ${clientName && reportType !== 'invoice' ? `<p><strong>Client:</strong> ${clientName}</p>` : ''}
      ${dateRange ? `<p><strong>Period:</strong> ${format(new Date(dateRange.start), 'dd MMM yyyy')} - ${format(new Date(dateRange.end), 'dd MMM yyyy')}</p>` : ''}

      <table>
        <thead>
          <tr>
            <th>Date</th>
            ${reportType !== 'invoice' ? '<th>Client</th>' : ''}
            <th>Service Description</th>
            <th>Hours</th>
            <th>Rate (₹)</th>
            <th class="amount">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${entries.map(entry => `
            <tr>
              <td>${entry.date ? format(new Date(entry.date), 'dd/MM/yyyy') : 'N/A'}</td>
              ${reportType !== 'invoice' ? `<td>${entry.client_name || 'N/A'}</td>` : ''}
              <td>
                <strong>${entry.activity_type}</strong>
                ${entry.description ? `<div class="description">${entry.description}</div>` : ''}
              </td>
              <td>${entry.hours_spent || 0}</td>
              <td>₹${(entry.hourly_rate || 0).toLocaleString('en-IN')}</td>
              <td class="amount">₹${((entry.hours_spent || 0) * (entry.hourly_rate || 0)).toLocaleString('en-IN')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="summary-box">
        <div class="summary-item">
          <span>Total Hours:</span>
          <span>${totalHours.toFixed(2)} hours</span>
        </div>
        <div class="summary-item">
          <span>Total Services:</span>
          <span>${entries.length}</span>
        </div>
        <div class="summary-item total">
          <span>Total Amount:</span>
          <span>₹${totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      ${reportType === 'invoice' ? `
        <div style="margin-top: 30px;">
          <p><strong>Payment Terms:</strong> Payment due within 30 days of invoice date.</p>
          <p><strong>Note:</strong> This invoice is generated for legal services rendered as per the agreement.</p>
        </div>
      ` : ''}

      <div class="footer">
        <p>This ${reportType === 'invoice' ? 'invoice' : 'report'} was generated automatically by VakilGPT Billing System</p>
        <p>For queries, please contact your legal representative</p>
      </div>
    </body>
    </html>
  `;

  // Create a proper PDF by opening the HTML in a new window and using browser's print functionality
  return new Promise((resolve) => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    resolve(blob);
  });
};

export const downloadPDF = async (htmlBlob: Blob, filename: string) => {
  try {
    // Convert HTML blob to text
    const htmlText = await htmlBlob.text();
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }
    
    printWindow.document.write(htmlText);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print dialog
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        
        // Close the window after printing
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 500);
    };
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Fallback: download as HTML file that can be opened and printed
    const url = URL.createObjectURL(htmlBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.html`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Test n8n webhook connectivity
export const testN8nConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch('https://vakilgpt.app.n8n.cloud/webhook-test/d4b8347c-8bcc-4a93-89a9-5967e7684cdb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'connection_test',
        data: {
          timestamp: new Date().toISOString(),
          source: 'vakilgpt-billing-tracker',
          test: true
        }
      })
    });

    if (response.ok) {
      return {
        success: true,
        message: 'n8n webhook is connected and responding'
      };
    } else {
      return {
        success: false,
        message: `n8n webhook returned status: ${response.status}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `n8n webhook connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
