import fs from 'fs';
import zlib from 'zlib';

const diagram = `graph TD
    A([Mulai: Upload Data Excel]) --> B[/Data Peserta Masuk ke Tabel/]
    
    B --> C([Klik Tombol 'Upload ZIP'])
    C --> D[/Pilih File ZIP Foto/]
    
    D --> E{Sistem Ekstrak ZIP}
    
    E --> F[Ambil Semua File Gambar<br>.jpg, .png, dsb]
    
    F --> G[Urutkan File Gambar<br>Berdasarkan Nama File A-Z]
    B --> H[Urutkan Data Peserta<br>Berdasarkan Nama A-Z]
    
    G --> I((Proses<br>Auto-Matching))
    H --> I
    
    I --> J[Foto Ke-1 ➔ Peserta Ke-1<br>Foto Ke-2 ➔ Peserta Ke-2<br>dst...]
    
    J --> K[Otomatis Mengisi Kolom<br>'nama_file_foto' di Tabel]
    
    K --> L(((Selesai: Foto Tampil<br>di Preview Kartu)))
    
    style A fill:#4f46e5,stroke:#312e81,color:#fff
    style C fill:#10b981,stroke:#047857,color:#fff
    style I fill:#f59e0b,stroke:#b45309,color:#fff
    style L fill:#3b82f6,stroke:#1d4ed8,color:#fff`;

const data = Buffer.from(diagram, 'utf8');
const compressed = zlib.deflateSync(data);
const encoded = compressed.toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
const url = `https://kroki.io/mermaid/png/${encoded}`;

async function run() {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync('alur_upload_zip.png', Buffer.from(buffer));
  console.log('Done generating PNG using Kroki!');
}
run();
