
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
}

export const generateTimeSheetPDF = async (options: PDFGenerationOptions): Promise<Blob> => {
  const { entries, reportType, dateRange, clientName } = options;
  
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
      <title>${reportType === 'invoice' ? 'Invoice' : 'Time Report'}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          color: #333;
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
        }
        .header p {
          margin: 5px 0;
          color: #666;
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
        }
        .summary-item.total {
          font-weight: bold;
          font-size: 18px;
          border-top: 2px solid #3b82f6;
          padding-top: 10px;
          margin-top: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #e2e8f0;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #3b82f6;
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        .amount {
          text-align: right;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${reportType === 'invoice' ? 'Legal Services Invoice' : 'Time Tracking Report'}</h1>
        <p>Generated on ${format(new Date(), 'dd MMMM yyyy')}</p>
        ${clientName ? `<p><strong>Client:</strong> ${clientName}</p>` : ''}
        ${dateRange ? `<p><strong>Period:</strong> ${format(new Date(dateRange.start), 'dd MMM yyyy')} - ${format(new Date(dateRange.end), 'dd MMM yyyy')}</p>` : ''}
      </div>

      <div class="summary-box">
        <div class="summary-item">
          <span>Total Hours:</span>
          <span>${totalHours.toFixed(2)} hours</span>
        </div>
        <div class="summary-item">
          <span>Total Entries:</span>
          <span>${entries.length}</span>
        </div>
        <div class="summary-item total">
          <span>Total Amount:</span>
          <span>₹${totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Activity</th>
            <th>Hours</th>
            <th>Rate (₹)</th>
            <th class="amount">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${entries.map(entry => `
            <tr>
              <td>${entry.date ? format(new Date(entry.date), 'dd/MM/yyyy') : 'N/A'}</td>
              <td>${entry.client_name || 'N/A'}</td>
              <td>
                <strong>${entry.activity_type}</strong>
                ${entry.description ? `<br><small style="color: #666;">${entry.description}</small>` : ''}
              </td>
              <td>${entry.hours_spent || 0}</td>
              <td>₹${(entry.hourly_rate || 0).toLocaleString('en-IN')}</td>
              <td class="amount">₹${((entry.hours_spent || 0) * (entry.hourly_rate || 0)).toLocaleString('en-IN')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>This ${reportType} was generated automatically by VakilGPT Billing System</p>
        <p>For queries, please contact your legal representative</p>
      </div>
    </body>
    </html>
  `;

  // Convert HTML to PDF using a simple approach
  // In a real implementation, you might use libraries like jsPDF or Puppeteer
  const blob = new Blob([htmlContent], { type: 'text/html' });
  return blob;
};

export const downloadPDF = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.html`; // For now, we'll download as HTML
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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
