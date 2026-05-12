/**
 * KILIMO Audit Report Generator
 * Generates HTML and email reports from audit results
 */

/**
 * Generate HTML report from audit results
 */
export function generateHTMLReport(report) {
  const successRate = parseFloat(report.summary.successRate);
  const gradeColor = successRate >= 90 ? '#10b981' : successRate >= 75 ? '#f59e0b' : '#ef4444';
  const grade = successRate >= 90 ? 'A' : successRate >= 75 ? 'B' : 'C';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KILIMO Audit Report - ${report.metadata.timestamp}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: #f9fafb;
      padding: 2rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 2rem;
    }
    .header h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .header .meta {
      opacity: 0.9;
      font-size: 0.9rem;
    }
    .grade-badge {
      display: inline-block;
      background: white;
      color: ${gradeColor};
      font-size: 3rem;
      font-weight: bold;
      width: 80px;
      height: 80px;
      line-height: 80px;
      text-align: center;
      border-radius: 50%;
      margin: 1rem 0;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      padding: 2rem;
      background: #f9fafb;
    }
    .summary-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #10b981;
    }
    .summary-card h3 {
      font-size: 0.875rem;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .summary-card .value {
      font-size: 2rem;
      font-weight: bold;
      color: #1f2937;
    }
    .section {
      padding: 2rem;
      border-bottom: 1px solid #e5e7eb;
    }
    .section h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #10b981;
    }
    .test-grid {
      display: grid;
      gap: 0.5rem;
    }
    .test-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background: #f9fafb;
      border-radius: 6px;
      font-size: 0.875rem;
    }
    .test-item .name {
      font-weight: 500;
    }
    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.75rem;
    }
    .status.pass {
      background: #d1fae5;
      color: #065f46;
    }
    .status.fail {
      background: #fee2e2;
      color: #991b1b;
    }
    .status.warning {
      background: #fef3c7;
      color: #92400e;
    }
    .recommendations {
      padding: 2rem;
    }
    .recommendation {
      padding: 1rem;
      margin-bottom: 1rem;
      border-left: 4px solid #ef4444;
      background: #fef2f2;
      border-radius: 4px;
    }
    .recommendation.critical {
      border-color: #ef4444;
      background: #fef2f2;
    }
    .recommendation.high {
      border-color: #f59e0b;
      background: #fffbeb;
    }
    .recommendation.medium {
      border-color: #3b82f6;
      background: #eff6ff;
    }
    .recommendation h3 {
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .footer {
      padding: 2rem;
      text-align: center;
      color: #6b7280;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌾 KILIMO Agri-AI Suite - Audit Report</h1>
      <div class="meta">
        <div>Generated: ${new Date(report.metadata.timestamp).toLocaleString()}</div>
        <div>Environment: ${report.metadata.environment}</div>
        <div>Duration: ${report.metadata.duration}s</div>
      </div>
      <div class="grade-badge">${grade}</div>
    </div>

    <div class="summary">
      <div class="summary-card">
        <h3>Total Tests</h3>
        <div class="value">${report.summary.totalTests}</div>
      </div>
      <div class="summary-card">
        <h3>Passed</h3>
        <div class="value" style="color: #10b981;">${report.summary.passed}</div>
      </div>
      <div class="summary-card">
        <h3>Failed</h3>
        <div class="value" style="color: #ef4444;">${report.summary.failed}</div>
      </div>
      <div class="summary-card">
        <h3>Success Rate</h3>
        <div class="value" style="color: ${gradeColor};">${report.summary.successRate}%</div>
      </div>
    </div>

    <div class="section">
      <h2>📡 API Endpoint Tests</h2>
      <div class="test-grid">
        ${Object.entries(report.apiTests).map(([path, result]) => `
          <div class="test-item">
            <span class="name">${path}</span>
            <span class="status ${result.status.toLowerCase()}">${result.status}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="section">
      <h2>🔄 Workflow Tests</h2>
      <div class="test-grid">
        ${Object.entries(report.workflowTests).map(([name, result]) => `
          <div class="test-item">
            <span class="name">${name.replace(/_/g, ' ').toUpperCase()}</span>
            <span class="status ${result.status.toLowerCase()}">${result.status}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="section">
      <h2>🤖 AI Prompt Tests</h2>
      <div class="test-grid">
        ${Object.entries(report.aiPromptTests).map(([name, result]) => `
          <div class="test-item">
            <span class="name">${name.replace(/_/g, ' ').toUpperCase()}</span>
            <span class="status ${result.status.toLowerCase()}">${result.status}</span>
          </div>
        `).join('')}
      </div>
    </div>

    ${Object.keys(report.localizationTests).length > 0 ? `
    <div class="section">
      <h2>🌍 Localization Tests</h2>
      <div class="test-grid">
        ${Object.entries(report.localizationTests).map(([key, result]) => `
          <div class="test-item">
            <span class="name">${key}</span>
            <span class="status ${result.status.toLowerCase()}">${result.status}</span>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    ${report.recommendations.length > 0 ? `
    <div class="recommendations">
      <h2>💡 Recommendations</h2>
      ${report.recommendations.map((rec, i) => `
        <div class="recommendation ${rec.priority.toLowerCase()}">
          <h3>${i + 1}. [${rec.priority}] ${rec.category}</h3>
          <p>${rec.message}</p>
        </div>
      `).join('')}
    </div>
    ` : ''}

    <div class="footer">
      <p>KILIMO Agri-AI Suite by CREOVA</p>
      <p>Automated Quality Assurance System</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send email report (placeholder - implement with your email service)
 */
export async function sendEmailReport(report, recipients) {
  // This is a placeholder. In production, integrate with:
  // - SendGrid
  // - AWS SES
  // - Mailgun
  // - etc.

  console.log('Email report generation (not implemented):');
  console.log(`  To: ${recipients.join(', ')}`);
  console.log(`  Subject: KILIMO Audit Report - ${report.summary.successRate}% Success Rate`);
  console.log(`  Attachments: JSON report, HTML report`);

  // Example using nodemailer (install: npm install nodemailer)
  /*
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const html = generateHTMLReport(report);

  await transporter.sendMail({
    from: '"KILIMO Audit System" <audit@kilimo.app>',
    to: recipients.join(', '),
    subject: `KILIMO Audit Report - ${report.summary.successRate}% Success Rate`,
    html: html,
    attachments: [
      {
        filename: 'audit-report.json',
        content: JSON.stringify(report, null, 2)
      }
    ]
  });
  */
}

/**
 * Generate summary for Slack/Discord notification
 */
export function generateSlackSummary(report) {
  const emoji = report.summary.successRate >= 90 ? '✅' : 
                report.summary.successRate >= 75 ? '⚠️' : '❌';

  return {
    text: `${emoji} KILIMO Audit Report`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${emoji} KILIMO Audit Complete`
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Success Rate:*\n${report.summary.successRate}%`
          },
          {
            type: 'mrkdwn',
            text: `*Duration:*\n${report.metadata.duration}s`
          },
          {
            type: 'mrkdwn',
            text: `*Passed:*\n${report.summary.passed}/${report.summary.totalTests}`
          },
          {
            type: 'mrkdwn',
            text: `*Failed:*\n${report.summary.failed}/${report.summary.totalTests}`
          }
        ]
      },
      ...(report.recommendations.length > 0 ? [{
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Recommendations:*\n${report.recommendations.slice(0, 3).map(r => `• ${r.message}`).join('\n')}`
        }
      }] : [])
    ]
  };
}

export default {
  generateHTMLReport,
  sendEmailReport,
  generateSlackSummary
};
