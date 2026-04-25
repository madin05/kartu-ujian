// Script to generate sample test files:
// 1. sample_data.xlsx — data peserta dengan kolom nama_file_foto
// 2. foto_peserta.zip — file ZIP berisi foto placeholder (canvas-generated)

import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import fs from 'fs';

// ============================================
// Data peserta (sorted by nama for clarity)
// ============================================
const sampleData = [
  { nama: 'Ahmad Rizky Pratama', nisn: '0078901234', kelas: 'VI-A', no_peserta: '6-001', ruang: 'Ruang 1' },
  { nama: 'Budi Santoso', nisn: '0078901236', kelas: 'VI-A', no_peserta: '6-003', ruang: 'Ruang 1' },
  { nama: 'Dewi Lestari Anggraini', nisn: '0078901237', kelas: 'VI-A', no_peserta: '6-004', ruang: 'Ruang 1' },
  { nama: 'Dian Purnama Sari', nisn: '0078901242', kelas: 'VI-C', no_peserta: '6-009', ruang: 'Ruang 3' },
  { nama: 'Fikri Maulana Akbar', nisn: '0078901243', kelas: 'VI-C', no_peserta: '6-010', ruang: 'Ruang 3' },
  { nama: 'Muhammad Farhan Hakim', nisn: '0078901238', kelas: 'VI-B', no_peserta: '6-005', ruang: 'Ruang 2' },
  { nama: 'Putri Amelinda Sari', nisn: '0078901239', kelas: 'VI-B', no_peserta: '6-006', ruang: 'Ruang 2' },
  { nama: 'Rafi Aditya Nugroho', nisn: '0078901240', kelas: 'VI-B', no_peserta: '6-007', ruang: 'Ruang 2' },
  { nama: 'Siti Nurhaliza Putri', nisn: '0078901235', kelas: 'VI-A', no_peserta: '6-002', ruang: 'Ruang 1' },
  { nama: 'Zahra Aulia Rahma', nisn: '0078901241', kelas: 'VI-B', no_peserta: '6-008', ruang: 'Ruang 2' },
];

// ============================================
// 1. Generate Excel file
// ============================================
const worksheet = XLSX.utils.json_to_sheet(sampleData);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Peserta');

worksheet['!cols'] = [
  { wch: 25 }, // nama
  { wch: 15 }, // nisn
  { wch: 8 },  // kelas
  { wch: 10 }, // no_peserta
  { wch: 12 }, // ruang
];

XLSX.writeFile(workbook, 'sample_data.xlsx');
console.log('✅ Excel file: sample_data.xlsx (10 peserta)');

// ============================================
// 2. Generate ZIP with placeholder photos
//    Using minimal valid JPEG files
// ============================================

// Create a valid 1x1 light gray PNG image
function createMinimalImage() {
  const base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO88h8AArgB2y8O3F4AAAAASUVORK5CYII=";
  return Buffer.from(base64, 'base64');
}

async function generateZip() {
  const zip = new JSZip();

  // Sort data by nama A-Z (same order as the app will match)
  const sorted = [...sampleData].sort((a, b) => a.nama.localeCompare(b.nama, 'id'));

  // Create photos matching the alphabetical order but with name-based filenames
  sorted.forEach((student) => {
    const filename = `${student.nama.replace(/\s+/g, '_')}.png`;
    zip.file(filename, createMinimalImage());
  });

  const content = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync('foto_peserta.zip', content);

  console.log('✅ ZIP file: foto_peserta.zip');
  console.log('');
  console.log('📋 Isi ZIP (urut A-Z, matching peserta):');
  sorted.forEach((student) => {
    const filename = `${student.nama.replace(/\s+/g, '_')}.jpg`;
    console.log(`   ${filename}  →  ${student.nama}`);
  });
}

generateZip().then(() => {
  console.log('');
  console.log('📌 Cara Testing:');
  console.log('   1. Upload sample_data.xlsx ke aplikasi');
  console.log('   2. Klik "Upload ZIP" → pilih foto_peserta.zip');
  console.log('   3. Foto otomatis ter-match ke peserta (urut nama A-Z)');
  console.log('   4. Cek di tabel → kolom Foto sudah terisi');
  console.log('   5. Switch ke "Kartu" → foto muncul di kartu');
});
