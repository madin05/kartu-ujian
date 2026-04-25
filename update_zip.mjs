import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import fs from 'fs';

const fileName = process.argv[2] || 'sample_data.xlsx';

if (!fs.existsSync(fileName)) {
  console.log(`❌ File tidak ditemukan: ${fileName}`);
  console.log('💡 Cara pakai: node update_zip.mjs [nama_file_excel.xlsx]');
  process.exit(1);
}

// Read the Excel file
const fileData = fs.readFileSync(fileName);
const workbook = XLSX.read(fileData, { type: 'buffer' });
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet);

// Extract names (case-insensitive column search)
const names = data.map(row => {
  // Find key that matches 'nama' case-insensitively
  const nameKey = Object.keys(row).find(k => k.trim().toLowerCase() === 'nama');
  return nameKey ? row[nameKey] : null;
}).filter(Boolean);

if (names.length === 0) {
  console.log('Tidak ada data nama di dalam file Excel.');
  process.exit(1);
}

// Create a valid 1x1 light gray PNG image
function createMinimalImage() {
  const base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO88h8AArgB2y8O3F4AAAAASUVORK5CYII=";
  return Buffer.from(base64, 'base64');
}

async function generateZip() {
  const zip = new JSZip();

  const sorted = [...names].sort((a, b) => String(a).localeCompare(String(b), 'id'));

  sorted.forEach((nama) => {
    // Replace all spaces, dots, and slashes with underscore
    const safeName = String(nama).replace(/[\s\.\/]+/g, '_');
    const filename = `${safeName}.png`;
    zip.file(filename, createMinimalImage());
  });

  const content = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync('foto_peserta.zip', content);

  console.log('✅ ZIP file diperbarui berdasarkan isi file excel saat ini: foto_peserta.zip');
  console.log('📋 Isi ZIP (urut A-Z):');
  sorted.forEach((nama) => {
    const safeName = String(nama).replace(/[\s\.\/]+/g, '_');
    console.log(`   ${safeName}.jpg`);
  });
}

generateZip();
