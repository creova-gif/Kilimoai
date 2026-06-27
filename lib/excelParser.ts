import * as XLSX from 'xlsx';

export interface ExcelParsedData {
  fileName: string;
  sheetNames: string[];
  headers: string[];
  rows: any[]; // first 50 rows for full Q&A context
  previewRows: any[]; // first 5 rows for display preview
  rowCount: number;
  columnCount: number;
  summaryText: string;
}

/**
 * Parses a base64-encoded Excel/CSV file client-side.
 * Returns parsed rows, headers, and statistical summary.
 */
export function parseExcelBase64(base64Data: string, fileName: string): ExcelParsedData {
  // 1. Read workbook
  const workbook = XLSX.read(base64Data, { type: 'base64' });
  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('Maudhui ya faili tupu au hayajasomeka (Empty or unreadable file)');
  }

  const sheetNames = workbook.SheetNames;
  const firstSheetName = sheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert sheet to json (header: 1 returns 2D array of rows)
  const rawRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
  if (rawRows.length === 0) {
    throw new Error('Lahajedwali haina data yoyote (Spreadsheet contains no data)');
  }

  // 2. Extract headers and data rows
  const headers: string[] = (rawRows[0] || []).map((h: any) => String(h || '').trim());
  const dataRowsRaw = rawRows.slice(1);

  // Filter out completely empty rows
  const dataRows = dataRowsRaw.filter(
    (row) =>
      row && row.some((val: any) => val !== null && val !== undefined && String(val).trim() !== '')
  );
  const rowCount = dataRows.length;
  const columnCount = headers.length;

  if (rowCount === 0) {
    throw new Error('Lahajedwali haina safu za data (Spreadsheet contains no data rows)');
  }

  // 3. Map rows to objects for easy querying
  const allMappedRows = dataRows.map((row, idx) => {
    const obj: Record<string, any> = {};
    headers.forEach((h, colIdx) => {
      obj[h || `Col_${colIdx + 1}`] = row[colIdx] !== undefined ? row[colIdx] : '';
    });
    return obj;
  });

  // Preview is first 5 rows
  const previewRows = allMappedRows.slice(0, 5);
  // Keep up to 100 rows for AI Q&A context (to avoid exceeding token caps while allowing deep Q&A)
  const rowsForContext = allMappedRows.slice(0, 100);

  // 4. Compute statistics for numeric columns
  const numericSummaries: string[] = [];
  headers.forEach((h) => {
    const values = dataRows
      .map((row) => {
        const val = row[headers.indexOf(h)];
        if (val === null || val === undefined) return NaN;
        const num = Number(val);
        return isNaN(num) ? NaN : num;
      })
      .filter((v) => !isNaN(v));

    if (values.length > 0) {
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);

      const isYield = h.toLowerCase().includes('yield') || h.toLowerCase().includes('mavuno');
      const isNitrogen = h.toLowerCase().includes('nitro') || h.toLowerCase().includes('n');

      numericSummaries.push(
        `- **${h}**: Min=${min.toFixed(1)}, Max=${max.toFixed(1)}, Wastani (Average)=${avg.toFixed(1)}`
      );
    }
  });

  // Construct summary text for the AI System Prompt
  const summaryText = `
[DATA SPREADSHEET DETECTED]
Filename: ${fileName}
Sheets: ${sheetNames.join(', ')}
Active Sheet: ${firstSheetName}
Total Rows: ${rowCount}
Total Columns: ${columnCount}
Headers: ${headers.join(', ')}

Statistical summaries for numeric fields:
${numericSummaries.length > 0 ? numericSummaries.join('\n') : 'No numeric columns detected.'}

First 30 rows data snippet (JSON format):
${JSON.stringify(allMappedRows.slice(0, 30), null, 2)}
  `.trim();

  return {
    fileName,
    sheetNames,
    headers,
    rows: allMappedRows,
    previewRows,
    rowCount,
    columnCount,
    summaryText,
  };
}
