# Cetak Kartu Ujian

Generator kartu ujian peserta dari file Excel — berjalan 100% di browser, tanpa server.

## Fitur

- 📊 **Upload Excel** — Import data peserta dari `.xlsx`, `.xls`, atau `.csv`
- ✏️ **Edit di Tabel** — CRUD inline editing langsung di browser
- 🖨️ **Cetak Kartu** — Layout A4 siap print (8 kartu per halaman)
- 📸 **Upload Foto** — 3 metode upload foto peserta
- 🌙 **Dark / Light Mode** — Toggle tema gelap/terang
- 📱 **Offline Ready** — PWA, bisa dipakai tanpa internet

---

## Cara Pakai

### 1. Upload Data Excel

Upload file `.xlsx` dengan kolom berikut:

| Kolom | Wajib | Contoh |
|:------|:-----:|:-------|
| `nama` | ✅ | Ahmad Rizky Pratama |
| `nisn` | ✅ | 0078901234 |
| `kelas` | ✅ | VI-A |
| `no_peserta` | ✅ | 6-001 |
| `ruang` | ✅ | Ruang 1 |
| `nama_file_foto` | ❌ | foto_ahmad.jpg |

> File test: `sample_data.xlsx` (sudah tersedia di folder project)

---

### 2. Upload Foto Peserta

Ada **3 cara** upload foto:

#### Cara A — Upload Foto Satuan (per peserta)
1. Di tabel, klik **ikon `+`** di kolom **Foto** pada baris peserta
2. Pilih file gambar
3. Foto langsung muncul di tabel dan kartu

#### Cara B — Upload Foto Batch (banyak sekaligus)
1. Klik tombol **"Upload Foto"** di toolbar
2. Pilih **beberapa file gambar** sekaligus (Ctrl+click)
3. Nama file gambar harus **sama persis** dengan isi kolom `nama_file_foto` di Excel
4. Contoh: jika di Excel tertulis `foto_ahmad.jpg`, maka file gambar harus bernama `foto_ahmad.jpg`

#### Cara C — Upload ZIP Foto (auto-match A-Z) ⭐ Rekomendasi
1. Siapkan file ZIP berisi foto-foto peserta
2. **Beri nama file foto berurutan** (misal: `01.jpg`, `02.jpg`, `03.jpg`... atau `A.jpg`, `B.jpg`...)
3. Klik tombol **"Upload ZIP"** di toolbar
4. Pilih file `.zip`
5. Sistem akan:
   - Ekstrak semua foto dari ZIP
   - **Sort foto berdasarkan nama file (A-Z)**
   - **Sort peserta berdasarkan kolom `nama` (A-Z)**
   - Match foto ke peserta secara urut (foto pertama → peserta pertama, dst.)
   - Otomatis mengisi kolom `nama_file_foto`

**Contoh matching:**
```
ZIP berisi:                  Peserta (sorted by nama):
├── 01_foto.jpg          →   Ahmad Rizky Pratama
├── 02_foto.jpg          →   Budi Santoso
├── 03_foto.jpg          →   Dewi Lestari Anggraini
├── 04_foto.jpg          →   Dian Purnama Sari
└── 05_foto.jpg          →   Fikri Maulana Akbar
```

> File test: `foto_peserta.zip` (sudah tersedia di folder project)

---

### 3. Cetak Kartu

1. Klik tombol **"Cetak Kartu"** di toolbar
2. Browser akan membuka dialog print
3. Setting printer:
   - **Ukuran**: A4
   - **Orientasi**: Portrait
   - **Margin**: None / Minimum
4. Setiap halaman berisi **8 kartu** (2 kolom × 4 baris)

---

## File Aset (taruh di folder `public/`)

| File | Keterangan |
|:-----|:-----------|
| `logo-disdik.png` | Logo Dinas Pendidikan (kop surat kiri) |
| `logo-sekolah.png` | Logo Sekolah (kop surat kanan) |
| `cap-sekolah.png` | Stempel/cap sekolah (di area TTD) |
| `ttd-kepsek.png` | Tanda tangan kepala sekolah (background transparan) |

---

## Tech Stack

- **React 18** + **Vite 8**
- **SheetJS (xlsx)** — Parsing file Excel
- **JSZip** — Ekstraksi file ZIP
- **TailwindCSS** + Custom CSS Print
- **PWA** — Offline support via `vite-plugin-pwa`

---

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Generate test files (Excel + ZIP)
node generate_sample.mjs
```

---

## Deploy ke Vercel

```bash
git add .
git commit -m "update"
git push
```

Vercel akan auto-deploy dari branch `main`.

> **Note:** File `.npmrc` berisi `legacy-peer-deps=true` untuk mengatasi peer dependency antara `vite-plugin-pwa` dan Vite 8.
