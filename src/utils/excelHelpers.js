import * as XLSX from 'xlsx';

/**
 * Required headers (snake_case) for exam card data
 */
export const REQUIRED_HEADERS = ['nama', 'nisn', 'kelas', 'no_peserta', 'ruang'];
export const OPTIONAL_HEADERS = ['nama_file_foto'];
export const ALL_KNOWN_HEADERS = [...REQUIRED_HEADERS, ...OPTIONAL_HEADERS];

/**
 * Human-readable label mapping for headers
 */
export const HEADER_LABELS = {
  nama: 'Nama',
  nisn: 'NISN',
  kelas: 'Kelas',
  no_peserta: 'No Peserta',
  ruang: 'Ruang',
  nama_file_foto: 'File Foto',
};

/**
 * Read an Excel or CSV file and return parsed data
 * @param {File} file - The uploaded file
 * @returns {Promise<{headers: string[], rows: object[], fileName: string}>}
 */
export async function readExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON (array of objects)
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          defval: '', // Default empty string for missing values
          raw: false, // Convert all to strings to preserve formatting
        });

        if (jsonData.length === 0) {
          reject(new Error('File tidak memiliki data. Pastikan file berisi minimal 1 baris data.'));
          return;
        }

        const headers = Object.keys(jsonData[0]);

        // Add unique IDs to each row
        const rows = jsonData.map((row, index) => ({
          _id: generateId(),
          _rowIndex: index + 1,
          ...row,
        }));

        resolve({
          headers,
          rows,
          fileName: file.name,
          sheetName,
          totalRows: rows.length,
        });
      } catch (err) {
        reject(new Error(`Gagal membaca file: ${err.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Gagal membaca file. Silakan coba lagi.'));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Export data to .xlsx file and trigger download
 * @param {object[]} rows - Array of row objects
 * @param {string[]} headers - Column headers
 * @param {string} fileName - Output file name
 */
export function writeExcelFile(rows, headers, fileName = 'data_kartu_ujian.xlsx') {
  // Clean rows - remove internal properties
  const cleanRows = rows.map((row) => {
    const clean = {};
    headers.forEach((h) => {
      clean[h] = row[h] || '';
    });
    return clean;
  });

  const worksheet = XLSX.utils.json_to_sheet(cleanRows, { header: headers });

  // Auto-size columns
  const colWidths = headers.map((h) => {
    const maxLen = Math.max(
      h.length,
      ...cleanRows.map((r) => String(r[h] || '').length)
    );
    return { wch: Math.min(maxLen + 2, 40) };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Peserta');

  // Download
  XLSX.writeFile(workbook, fileName);
}

/**
 * Validate that required headers exist in the data
 * @param {string[]} headers
 * @returns {{valid: boolean, missing: string[], extra: string[]}}
 */
export function validateHeaders(headers) {
  const lowerHeaders = headers.map((h) => h.toLowerCase().trim());
  const missing = REQUIRED_HEADERS.filter((rh) => !lowerHeaders.includes(rh));
  const known = ALL_KNOWN_HEADERS.map((h) => h.toLowerCase());
  const extra = headers.filter((h) => !known.includes(h.toLowerCase().trim()));

  return {
    valid: missing.length === 0,
    missing,
    extra,
  };
}

/**
 * Sanitize data - trim whitespace, normalize
 * @param {object[]} rows
 * @returns {object[]}
 */
export function sanitizeData(rows) {
  return rows.map((row) => {
    const clean = { ...row };
    Object.keys(clean).forEach((key) => {
      if (typeof clean[key] === 'string') {
        clean[key] = clean[key].trim();
      }
    });
    return clean;
  });
}

/**
 * Detect file type from extension
 * @param {File} file
 * @returns {string} 'xlsx' | 'xls' | 'csv' | 'unknown'
 */
export function detectFileType(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (['xlsx', 'xls', 'csv'].includes(ext)) return ext;
  return 'unknown';
}

/**
 * Generate a unique ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Create an empty row with all headers
 * @param {string[]} headers
 * @returns {object}
 */
export function createEmptyRow(headers) {
  const row = { _id: generateId(), _rowIndex: 0 };
  headers.forEach((h) => {
    row[h] = '';
  });
  return row;
}
