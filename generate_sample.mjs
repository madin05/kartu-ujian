// Script to generate sample Excel file for ASAJ SD testing
import * as XLSX from 'xlsx';

const sampleData = [
  { nama: 'Ahmad Rizky Pratama', nisn: '0078901234', kelas: 'VI-A', no_peserta: '6-001', ruang: 'Ruang 1' },
  { nama: 'Siti Nurhaliza Putri', nisn: '0078901235', kelas: 'VI-A', no_peserta: '6-002', ruang: 'Ruang 1' },
  { nama: 'Budi Santoso', nisn: '0078901236', kelas: 'VI-A', no_peserta: '6-003', ruang: 'Ruang 1' },
  { nama: 'Dewi Lestari Anggraini', nisn: '0078901237', kelas: 'VI-A', no_peserta: '6-004', ruang: 'Ruang 1' },
  { nama: 'Muhammad Farhan Hakim', nisn: '0078901238', kelas: 'VI-B', no_peserta: '6-005', ruang: 'Ruang 2' },
  { nama: 'Putri Amelinda Sari', nisn: '0078901239', kelas: 'VI-B', no_peserta: '6-006', ruang: 'Ruang 2' },
  { nama: 'Rafi Aditya Nugroho', nisn: '0078901240', kelas: 'VI-B', no_peserta: '6-007', ruang: 'Ruang 2' },
  { nama: 'Zahra Aulia Rahma', nisn: '0078901241', kelas: 'VI-B', no_peserta: '6-008', ruang: 'Ruang 2' },
  { nama: 'Dian Purnama Sari', nisn: '0078901242', kelas: 'VI-C', no_peserta: '6-009', ruang: 'Ruang 3' },
  { nama: 'Fikri Maulana Akbar', nisn: '0078901243', kelas: 'VI-C', no_peserta: '6-010', ruang: 'Ruang 3' },
];

// Generate Excel file
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
console.log('✅ Excel file created: sample_data.xlsx');
console.log(`   - 10 peserta`);
console.log(`   - Kolom: nama, nisn, kelas, no_peserta, ruang`);
console.log(`\n📌 Cara pakai:`);
console.log(`   1. Upload sample_data.xlsx ke aplikasi`);
console.log(`   2. Preview kartu → Cetak`);
