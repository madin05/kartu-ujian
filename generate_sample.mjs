// Script to generate sample Excel file AND sample photos for testing
import * as XLSX from 'xlsx';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

const sampleData = [
  {
    nomor_peserta: '2026001001',
    nama_lengkap: 'Ahmad Rizky Pratama',
    ruang_ujian: 'Lab Komputer A',
    waktu: 'Sesi 1 (08.00 - 10.00)',
    jalur_masuk: 'SNBP - Teknik Informatika',
    password: 'ARP2026',
    nama_file_foto: 'foto_001.svg',
  },
  {
    nomor_peserta: '2026001002',
    nama_lengkap: 'Siti Nurhaliza Putri',
    ruang_ujian: 'Lab Komputer A',
    waktu: 'Sesi 1 (08.00 - 10.00)',
    jalur_masuk: 'SNBT - Sistem Informasi',
    password: 'SNP2026',
    nama_file_foto: 'foto_002.svg',
  },
  {
    nomor_peserta: '2026001003',
    nama_lengkap: 'Budi Santoso',
    ruang_ujian: 'Lab Komputer B',
    waktu: 'Sesi 1 (08.00 - 10.00)',
    jalur_masuk: 'Mandiri - Teknik Elektro',
    password: 'BS2026',
    nama_file_foto: 'foto_003.svg',
  },
  {
    nomor_peserta: '2026001004',
    nama_lengkap: 'Dewi Lestari Anggraini',
    ruang_ujian: 'Lab Komputer B',
    waktu: 'Sesi 2 (10.30 - 12.30)',
    jalur_masuk: 'SNBP - Manajemen',
    password: 'DLA2026',
    nama_file_foto: 'foto_004.svg',
  },
  {
    nomor_peserta: '2026001005',
    nama_lengkap: 'Muhammad Farhan Hakim',
    ruang_ujian: 'Lab Komputer C',
    waktu: 'Sesi 2 (10.30 - 12.30)',
    jalur_masuk: 'SNBT - Akuntansi',
    password: 'MFH2026',
    nama_file_foto: 'foto_005.svg',
  },
  {
    nomor_peserta: '2026001006',
    nama_lengkap: 'Putri Amelinda Sari',
    ruang_ujian: 'Lab Komputer C',
    waktu: 'Sesi 2 (10.30 - 12.30)',
    jalur_masuk: 'Mandiri - Kedokteran',
    password: 'PAS2026',
    nama_file_foto: 'foto_006.svg',
  },
  {
    nomor_peserta: '2026001007',
    nama_lengkap: 'Rafi Aditya Nugroho',
    ruang_ujian: 'Lab Komputer A',
    waktu: 'Sesi 3 (13.00 - 15.00)',
    jalur_masuk: 'SNBP - Hukum',
    password: 'RAN2026',
    nama_file_foto: 'foto_007.svg',
  },
  {
    nomor_peserta: '2026001008',
    nama_lengkap: 'Zahra Aulia Rahma',
    ruang_ujian: 'Lab Komputer A',
    waktu: 'Sesi 3 (13.00 - 15.00)',
    jalur_masuk: 'SNBT - Psikologi',
    password: 'ZAR2026',
    nama_file_foto: 'foto_008.svg',
  },
];

// Generate Excel file
const worksheet = XLSX.utils.json_to_sheet(sampleData);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Peserta');

worksheet['!cols'] = [
  { wch: 15 },
  { wch: 25 },
  { wch: 20 },
  { wch: 25 },
  { wch: 30 },
  { wch: 12 },
  { wch: 15 },
];

XLSX.writeFile(workbook, 'sample_data.xlsx');
console.log('✅ Excel file created: sample_data.xlsx');

// Generate sample SVG photos (simulated passport photos)
const photoDir = 'sample_photos';
if (!existsSync(photoDir)) {
  mkdirSync(photoDir, { recursive: true });
}

const colors = [
  '#6366f1', '#ef4444', '#22c55e', '#f59e0b',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
];

sampleData.forEach((person, i) => {
  const color = colors[i % colors.length];
  const initials = person.nama_lengkap.split(' ').map(w => w[0]).join('').substr(0, 2).toUpperCase();
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="260" viewBox="0 0 200 260">
  <rect width="200" height="260" fill="${color}"/>
  <circle cx="100" cy="90" r="45" fill="rgba(255,255,255,0.2)"/>
  <text x="100" y="105" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="36" fill="white">${initials}</text>
  <rect x="20" y="160" width="160" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
  <rect x="40" y="175" width="120" height="3" rx="1.5" fill="rgba(255,255,255,0.2)"/>
  <text x="100" y="215" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" fill="rgba(255,255,255,0.7)">${person.nama_lengkap.split(' ')[0]}</text>
  <text x="100" y="240" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="rgba(255,255,255,0.5)">SAMPLE PHOTO</text>
</svg>`;

  writeFileSync(`${photoDir}/${person.nama_file_foto}`, svg);
  console.log(`📸 Photo created: ${photoDir}/${person.nama_file_foto}`);
});

console.log(`\n🎉 Done! Files created:`);
console.log(`   - sample_data.xlsx (8 peserta dengan kolom nama_file_foto)`);
console.log(`   - ${photoDir}/ (8 foto sample dalam format SVG)`);
console.log(`\n📌 Cara pakai:`);
console.log(`   1. Upload sample_data.xlsx ke aplikasi`);
console.log(`   2. Klik "Upload Foto" di toolbar`);
console.log(`   3. Pilih semua file di folder ${photoDir}/`);
console.log(`   4. Foto akan otomatis match dengan data peserta`);

