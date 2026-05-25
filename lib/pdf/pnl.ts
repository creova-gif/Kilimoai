/**
 * Kilimo AI — Agro ID P&L PDF Export
 *
 * Generates a branded PDF profit & loss statement linked to the farmer's
 * Agro ID. Uses expo-print (HTML → PDF) so it works on iOS, Android, and Web.
 *
 * P0 Story: "As a farmer, I want to record my income and expenses and export
 * them as a PDF via my Agro ID so that I can apply for a bank loan."
 */

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { AgroID } from '../../store/useKilimoStore';

export interface PnlLineItem {
  date: string;          // ISO
  category: string;
  description: string;
  amount: number;        // positive = income, negative = expense
}

export interface PnlReport {
  agroId: AgroID;
  seasonLabel: string;   // e.g. "Msimu wa Mvua Ndefu 2026"
  items: PnlLineItem[];
  generatedAt: string;
  qrPayload: string;     // String to encode in the QR — usually a verification URL
}

const fmtTZS = (n: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.abs(n));

function htmlEscape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

/**
 * Generate the QR code as a data URL (PNG) for embedding in the HTML.
 * Uses Google Chart Server which works without local rendering — keeps the
 * PDF pipeline pure HTML so expo-print can render on every platform.
 */
function qrDataUrl(payload: string): string {
  const encoded = encodeURIComponent(payload);
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encoded}`;
}

function renderHtml(r: PnlReport): string {
  const income = r.items.filter((i) => i.amount > 0).reduce((s, i) => s + i.amount, 0);
  const expense = r.items.filter((i) => i.amount < 0).reduce((s, i) => s + Math.abs(i.amount), 0);
  const net = income - expense;
  const generated = new Date(r.generatedAt).toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' });

  const rows = r.items
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((i) => {
      const positive = i.amount > 0;
      return `
        <tr>
          <td>${htmlEscape(new Date(i.date).toLocaleDateString('en-GB'))}</td>
          <td>${htmlEscape(i.category)}</td>
          <td>${htmlEscape(i.description)}</td>
          <td class="amt ${positive ? 'pos' : 'neg'}">
            ${positive ? '+' : '−'} TZS ${fmtTZS(i.amount)}
          </td>
        </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Agro ID P&amp;L — ${htmlEscape(r.agroId.name)}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, "Helvetica Neue", Arial, sans-serif; color: #0f172a; margin: 0; padding: 48px; background: #ffffff; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #22d15a; padding-bottom: 24px; margin-bottom: 32px; }
    .brand { font-size: 13px; font-weight: 900; letter-spacing: 2px; color: #22d15a; }
    .title { font-size: 30px; font-weight: 900; margin: 6px 0 0; letter-spacing: -1px; }
    .sub { font-size: 13px; color: #64748b; margin-top: 4px; }
    .meta { text-align: right; font-size: 11px; color: #475569; line-height: 1.6; }
    .meta strong { display: block; color: #0f172a; font-size: 13px; }

    .identity { display: flex; gap: 32px; margin-bottom: 32px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; }
    .identity .info { flex: 1; }
    .identity .info .label { font-size: 10px; letter-spacing: 1.5px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px; }
    .identity .info .value { font-size: 22px; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.5px; }
    .identity .info .row { display: flex; gap: 32px; margin-top: 10px; font-size: 12px; }
    .identity .info .row span { color: #64748b; }
    .identity .info .row strong { color: #0f172a; }
    .identity .qr { text-align: center; }
    .identity .qr img { width: 140px; height: 140px; }
    .identity .qr .cap { font-size: 9px; color: #64748b; letter-spacing: 1px; margin-top: 6px; }

    .summary { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 32px; }
    .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; }
    .card .k { font-size: 10px; letter-spacing: 1.5px; font-weight: 700; color: #64748b; text-transform: uppercase; }
    .card .v { font-size: 22px; font-weight: 900; margin-top: 4px; }
    .card.income .v { color: #22d15a; }
    .card.expense .v { color: #ef4444; }
    .card.net .v { color: ${net >= 0 ? '#22d15a' : '#ef4444'}; }

    h2 { font-size: 16px; margin: 32px 0 12px; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    thead th { text-align: left; padding: 10px 12px; background: #f1f5f9; font-weight: 700; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #475569; }
    tbody td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
    tbody tr:nth-child(even) td { background: #fafbfc; }
    td.amt { text-align: right; font-weight: 700; }
    td.amt.pos { color: #22d15a; }
    td.amt.neg { color: #ef4444; }

    .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; line-height: 1.6; }
    .footer strong { color: #475569; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">KILIMO AI · AGRO ID</div>
      <div class="title">P&amp;L Statement</div>
      <div class="sub">${htmlEscape(r.seasonLabel)}</div>
    </div>
    <div class="meta">
      <strong>${htmlEscape(r.agroId.id)}</strong>
      Generated ${generated}<br/>
      Verified · Tamper-evident QR
    </div>
  </div>

  <div class="identity">
    <div class="info">
      <div class="label">Verified Identity</div>
      <div class="value">${htmlEscape(r.agroId.name)}</div>
      <div class="row">
        <div><span>Role</span><br/><strong>${htmlEscape(r.agroId.role)}</strong></div>
        <div><span>Region</span><br/><strong>${htmlEscape(r.agroId.location)}</strong></div>
        <div><span>Tier</span><br/><strong>${htmlEscape(r.agroId.tier)}</strong></div>
        <div><span>Member Since</span><br/><strong>${htmlEscape(r.agroId.joinDate)}</strong></div>
      </div>
    </div>
    <div class="qr">
      <img src="${qrDataUrl(r.qrPayload)}" alt="Agro ID QR" />
      <div class="cap">SCAN TO VERIFY</div>
    </div>
  </div>

  <div class="summary">
    <div class="card income"><div class="k">Total Income</div><div class="v">TZS ${fmtTZS(income)}</div></div>
    <div class="card expense"><div class="k">Total Expense</div><div class="v">TZS ${fmtTZS(expense)}</div></div>
    <div class="card net"><div class="k">Net Position</div><div class="v">${net >= 0 ? '+' : '−'} TZS ${fmtTZS(net)}</div></div>
  </div>

  <h2>Transaction Ledger (${r.items.length} entries)</h2>
  <table>
    <thead>
      <tr><th>Date</th><th>Category</th><th>Description</th><th style="text-align:right">Amount</th></tr>
    </thead>
    <tbody>${rows || '<tr><td colspan="4" style="text-align:center;padding:24px;color:#94a3b8">No transactions recorded yet</td></tr>'}</tbody>
  </table>

  <div class="footer">
    <strong>Kilimo AI · Hati Rasmi ya Agro ID</strong><br/>
    This statement is generated from on-platform transaction records and is intended for use with financial institutions in East Africa.<br/>
    Verify authenticity at kilimo.ai/verify · Document ID ${htmlEscape(r.agroId.id)}-${Date.now()}
  </div>
</body>
</html>`;
}

/** Generate the PDF and return the local file URI. */
export async function generatePnlPdf(report: PnlReport): Promise<{ uri: string }> {
  const html = renderHtml(report);
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  return { uri };
}

/** Generate + immediately share (or trigger a download on web). */
export async function exportPnlPdf(report: PnlReport): Promise<void> {
  const html = renderHtml(report);

  if (Platform.OS === 'web') {
    // expo-print on web returns a data URL; open in a new tab for save/print
    const result = await Print.printAsync({ html });
    return;
  }

  const { uri } = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share Agro ID P&L',
      UTI: 'com.adobe.pdf',
    });
  }
}
