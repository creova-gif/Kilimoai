/**
 * PDF GENERATION FOR INVOICES AND RECEIPTS
 * Using jsPDF library for client-side PDF generation
 * Alternative: PDFKit for server-side generation
 */

/**
 * Invoice data structure
 */
export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  seller: {
    name: string;
    phone?: string;
    address?: string;
  };
  customer: {
    name: string;
    phone?: string;
    address?: string;
  };
  items: {
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  vat: number;
  total: number;
  notes?: string;
}

/**
 * Receipt data structure
 */
export interface ReceiptData {
  receiptNumber: string;
  date: string;
  transactionType: string;
  from: string;
  to: string;
  amount: number;
  method: string;
  reference: string;
  status: string;
}

/**
 * Generate HTML for invoice (for server-side rendering to PDF)
 */
export function generateInvoiceHTML(data: InvoiceData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #7C3AED;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #7C3AED;
      margin: 0;
    }
    .header p {
      color: #666;
      margin: 5px 0;
    }
    .invoice-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .section {
      margin-bottom: 20px;
    }
    .section h3 {
      color: #7C3AED;
      margin-bottom: 10px;
      font-size: 14px;
      text-transform: uppercase;
    }
    .section p {
      margin: 5px 0;
      font-size: 13px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    table th {
      background-color: #7C3AED;
      color: white;
      padding: 12px;
      text-align: left;
      font-size: 13px;
    }
    table td {
      padding: 10px 12px;
      border-bottom: 1px solid #ddd;
      font-size: 13px;
    }
    table tr:hover {
      background-color: #f9f9f9;
    }
    .totals {
      margin-top: 20px;
      text-align: right;
    }
    .totals table {
      margin-left: auto;
      width: 300px;
    }
    .totals td {
      padding: 8px;
      border: none;
    }
    .totals .grand-total {
      font-size: 18px;
      font-weight: bold;
      color: #7C3AED;
      border-top: 2px solid #7C3AED;
    }
    .notes {
      margin-top: 30px;
      padding: 15px;
      background-color: #f0f0f0;
      border-left: 4px solid #7C3AED;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      color: #666;
      font-size: 12px;
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌾 CREOVA AGRI-AI SUITE</h1>
    <p>Empowering Tanzanian Farmers with Technology</p>
    <p>www.creova.co.tz | support@creova.co.tz</p>
  </div>

  <div style="text-align: center; margin-bottom: 30px;">
    <h2 style="color: #7C3AED; margin: 0;">INVOICE</h2>
    <p style="font-size: 16px; margin: 10px 0;">Invoice #${data.invoiceNumber}</p>
    <p style="color: #666;">Date: ${data.date}</p>
  </div>

  <div class="invoice-info">
    <div class="section">
      <h3>From (Seller)</h3>
      <p><strong>${data.seller.name}</strong></p>
      ${data.seller.phone ? `<p>Phone: ${data.seller.phone}</p>` : ''}
      ${data.seller.address ? `<p>${data.seller.address}</p>` : ''}
    </div>

    <div class="section">
      <h3>To (Customer)</h3>
      <p><strong>${data.customer.name}</strong></p>
      ${data.customer.phone ? `<p>Phone: ${data.customer.phone}</p>` : ''}
      ${data.customer.address ? `<p>${data.customer.address}</p>` : ''}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: center;">Quantity</th>
        <th style="text-align: center;">Unit</th>
        <th style="text-align: right;">Unit Price (TZS)</th>
        <th style="text-align: right;">Total (TZS)</th>
      </tr>
    </thead>
    <tbody>
      ${data.items.map(item => `
        <tr>
          <td>${item.description}</td>
          <td style="text-align: center;">${item.quantity}</td>
          <td style="text-align: center;">${item.unit}</td>
          <td style="text-align: right;">${item.unitPrice.toLocaleString()}</td>
          <td style="text-align: right;">${item.total.toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr>
        <td>Subtotal:</td>
        <td style="text-align: right;"><strong>TZS ${data.subtotal.toLocaleString()}</strong></td>
      </tr>
      <tr>
        <td>VAT (18%):</td>
        <td style="text-align: right;">TZS ${data.vat.toLocaleString()}</td>
      </tr>
      <tr class="grand-total">
        <td>TOTAL:</td>
        <td style="text-align: right;">TZS ${data.total.toLocaleString()}</td>
      </tr>
    </table>
  </div>

  ${data.notes ? `
    <div class="notes">
      <h3 style="margin-top: 0;">Notes</h3>
      <p>${data.notes}</p>
    </div>
  ` : ''}

  <div class="footer">
    <p><strong>Payment Terms:</strong> Payment due within 30 days</p>
    <p><strong>Bank Details:</strong> CRDB Bank | Account: CREOVA Agri-AI | Branch: Dar es Salaam</p>
    <p style="margin-top: 20px;">Thank you for your business!</p>
    <p style="font-size: 11px; color: #999;">This is a computer-generated invoice and does not require a signature.</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate HTML for receipt
 */
export function generateReceiptHTML(data: ReceiptData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #7C3AED;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #7C3AED;
      margin: 0;
    }
    .receipt-box {
      max-width: 500px;
      margin: 0 auto;
      border: 2px solid #7C3AED;
      border-radius: 10px;
      padding: 30px;
      background-color: #f9f9f9;
    }
    .receipt-title {
      text-align: center;
      font-size: 24px;
      color: #7C3AED;
      margin-bottom: 20px;
      font-weight: bold;
    }
    .receipt-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #ddd;
    }
    .receipt-row:last-child {
      border-bottom: none;
    }
    .label {
      color: #666;
      font-weight: 500;
    }
    .value {
      font-weight: bold;
      text-align: right;
    }
    .amount {
      font-size: 28px;
      color: #10B981;
      text-align: center;
      margin: 20px 0;
      font-weight: bold;
    }
    .status {
      text-align: center;
      padding: 10px;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    .status.completed {
      background-color: #D1FAE5;
      color: #065F46;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌾 CREOVA AGRI-AI SUITE</h1>
    <p>Transaction Receipt</p>
  </div>

  <div class="receipt-box">
    <div class="receipt-title">PAYMENT RECEIPT</div>
    
    <div class="amount">TZS ${data.amount.toLocaleString()}</div>
    
    <div class="status ${data.status.toLowerCase()}">
      ${data.status.toUpperCase()}
    </div>

    <div class="receipt-row">
      <span class="label">Receipt Number:</span>
      <span class="value">${data.receiptNumber}</span>
    </div>

    <div class="receipt-row">
      <span class="label">Date:</span>
      <span class="value">${data.date}</span>
    </div>

    <div class="receipt-row">
      <span class="label">Type:</span>
      <span class="value">${data.transactionType}</span>
    </div>

    <div class="receipt-row">
      <span class="label">From:</span>
      <span class="value">${data.from}</span>
    </div>

    <div class="receipt-row">
      <span class="label">To:</span>
      <span class="value">${data.to}</span>
    </div>

    <div class="receipt-row">
      <span class="label">Method:</span>
      <span class="value">${data.method}</span>
    </div>

    <div class="receipt-row">
      <span class="label">Reference:</span>
      <span class="value">${data.reference}</span>
    </div>
  </div>

  <div class="footer">
    <p>For support, contact: support@creova.co.tz | +255 XXX XXX XXX</p>
    <p style="font-size: 11px; color: #999; margin-top: 20px;">
      This is an electronic receipt. Please keep it for your records.
    </p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Convert HTML to PDF (server-side using Puppeteer or similar)
 * This is a placeholder - actual implementation would use a PDF library
 */
export async function htmlToPDF(html: string): Promise<Uint8Array> {
  // In production, use Puppeteer, PDFKit, or a PDF service
  // For now, return the HTML as bytes (browser can handle PDF generation)
  const encoder = new TextEncoder();
  return encoder.encode(html);
}

/**
 * Generate invoice PDF data URL for download
 */
export function generateInvoicePDFDataURL(data: InvoiceData): string {
  const html = generateInvoiceHTML(data);
  const encoded = btoa(unescape(encodeURIComponent(html)));
  return `data:text/html;base64,${encoded}`;
}

/**
 * Generate receipt PDF data URL for download
 */
export function generateReceiptPDFDataURL(data: ReceiptData): string {
  const html = generateReceiptHTML(data);
  const encoded = btoa(unescape(encodeURIComponent(html)));
  return `data:text/html;base64,${encoded}`;
}

/**
 * Farm Plan data structure
 */
export interface FarmPlanData {
  farmerName: string;
  crop: string;
  season: string;
  duration: string;
  phases: any[];
  summary: {
    totalCost: string;
    expectedYield: string;
    expectedRevenue: string;
    profit: string;
    roi: string;
  };
  criticalDates: any[];
  generatedAt: string;
}

/**
 * Generate Farm Plan PDF
 */
export function generateFarmPlanPDF(data: FarmPlanData): { url: string } {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #10B981;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #10B981;
      margin: 0;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 15px;
      margin: 30px 0;
    }
    .summary-card {
      padding: 15px;
      border: 2px solid #E5E7EB;
      border-radius: 8px;
      text-align: center;
    }
    .summary-card .label {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
    }
    .summary-card .value {
      font-size: 18px;
      font-weight: bold;
    }
    .phase {
      margin: 25px 0;
      border: 2px solid #E5E7EB;
      border-radius: 10px;
      padding: 20px;
      background-color: #F9FAFB;
    }
    .phase-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #10B981;
    }
    .phase-title {
      font-size: 20px;
      font-weight: bold;
      color: #10B981;
    }
    .task {
      margin: 10px 0;
      padding: 12px;
      border-left: 4px solid #10B981;
      background-color: white;
    }
    .task-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
    .critical-dates {
      margin: 30px 0;
    }
    .date-item {
      padding: 10px;
      margin: 8px 0;
      border-left: 4px solid #EF4444;
      background-color: #FEF2F2;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      color: #666;
      font-size: 12px;
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌾 CREOVA AGRI-AI SUITE</h1>
    <h2 style="color: #10B981; margin: 10px 0;">AI-Powered Farm Plan</h2>
    <p>Farmer: ${data.farmerName}</p>
    <p>Crop: ${data.crop} | Season: ${data.season} | Duration: ${data.duration}</p>
    <p style="font-size: 12px; color: #666;">Generated: ${new Date(data.generatedAt).toLocaleString()}</p>
  </div>

  <h3 style="color: #10B981;">Financial Projection</h3>
  <div class="summary-grid">
    <div class="summary-card">
      <div class="label">Total Cost</div>
      <div class="value" style="color: #EF4444;">${data.summary.totalCost}</div>
    </div>
    <div class="summary-card">
      <div class="label">Expected Yield</div>
      <div class="value" style="color: #10B981;">${data.summary.expectedYield}</div>
    </div>
    <div class="summary-card">
      <div class="label">Revenue</div>
      <div class="value" style="color: #3B82F6;">${data.summary.expectedRevenue}</div>
    </div>
    <div class="summary-card">
      <div class="label">Profit</div>
      <div class="value" style="color: #8B5CF6;">${data.summary.profit}</div>
    </div>
    <div class="summary-card">
      <div class="label">ROI</div>
      <div class="value" style="color: #F59E0B;">${data.summary.roi}</div>
    </div>
  </div>

  <h3 style="color: #10B981;">Critical Dates</h3>
  <div class="critical-dates">
    ${data.criticalDates.map(date => `
      <div class="date-item">
        <strong>${date.date}:</strong> ${date.activity} 
        <span style="float: right; color: ${
          date.importance === 'critical' ? '#EF4444' : 
          date.importance === 'high' ? '#F59E0B' : '#3B82F6'
        };">[${date.importance.toUpperCase()}]</span>
      </div>
    `).join('')}
  </div>

  <h3 style="color: #10B981; margin-top: 40px;">Farming Schedule</h3>
  ${data.phases.map(phase => `
    <div class="phase">
      <div class="phase-header">
        <div>
          <div class="phase-title">${phase.name}</div>
          <div style="font-size: 14px; color: #666;">${phase.week} • ${phase.days}</div>
        </div>
        <div style="padding: 5px 15px; background-color: ${
          phase.status === 'completed' ? '#10B981' :
          phase.status === 'in-progress' ? '#3B82F6' : '#6B7280'
        }; color: white; border-radius: 5px; font-size: 12px; font-weight: bold;">
          ${phase.status.toUpperCase()}
        </div>
      </div>
      
      ${phase.tasks.map((task: any) => `
        <div class="task">
          <div class="task-row">
            <strong>${task.task}</strong>
            <span style="color: #10B981; font-weight: bold;">${task.cost}</span>
          </div>
          <div style="font-size: 12px; color: #666;">Duration: ${task.duration}</div>
        </div>
      `).join('')}
    </div>
  `).join('')}

  <div class="footer">
    <p><strong>CREOVA Agri-AI Suite</strong> - Empowering Tanzanian Farmers</p>
    <p>www.creova.co.tz | support@creova.co.tz | +255 XXX XXX XXX</p>
    <p style="margin-top: 20px; font-size: 11px; color: #999;">
      This farm plan is AI-generated based on best agricultural practices for Tanzania.
      Always consult with local extension officers for region-specific advice.
    </p>
  </div>
</body>
</html>
  `.trim();

  const encoded = btoa(unescape(encodeURIComponent(html)));
  return { url: `data:text/html;base64,${encoded}` };
}