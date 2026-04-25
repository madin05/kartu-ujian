/**
 * Single Exam Card Component
 * Template: Kartu ASAJ SD (formal government letterhead)
 */
export default function ExamCard({ data, index, photoMap = {} }) {
  const {
    nama = '',
    nisn = '',
    kelas = '',
    no_peserta = '',
    ruang = '',
    nama_file_foto = '',
  } = data;

  // Get participant photo from photoMap
  const photoSrc = nama_file_foto && photoMap[nama_file_foto.trim()]
    ? photoMap[nama_file_foto.trim()]
    : null;

  return (
    <div className="exam-card" id={`exam-card-${index}`}>
      {/* === KOP SURAT (Letterhead) === */}
      <div className="exam-card-header">
        <div className="exam-card-logo">
          <img src="/logo-disdik.png" alt="Logo Disdik" />
        </div>
        <div className="exam-card-title">
          <p className="kop-line-1">PEMERINTAH DAERAH KABUPATEN TANGERANG</p>
          <p className="kop-line-2">DINAS PENDIDIKAN</p>
          <p className="kop-line-3">SD NEGERI SUKABAKTI</p>
          <p className="kop-line-4">Jl. AMD Sukabakti No.16 Kel. Sukabakti Kec. Curug</p>
        </div>
        <div className="exam-card-logo">
          <img src="/logo-sekolah.png" alt="Logo Sekolah" />
        </div>
      </div>

      {/* === JUDUL KARTU === */}
      <div className="exam-card-subtitle">
        <h2>KARTU ASESMEN SUMATIF AKHIR JENJANG (ASAJ) SD</h2>
      </div>

      {/* === BODY — Foto + Data Peserta === */}
      <div className="exam-card-body">
        {/* Pas Foto */}
        <div className="exam-card-photo">
          {photoSrc ? (
            <img
              src={photoSrc}
              alt={nama}
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="photo-placeholder"
            style={{
              display: photoSrc ? 'none' : 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <span>foto</span>
          </div>
        </div>

        {/* Data Fields */}
        <div className="exam-card-info">
          <InfoRow label="Nama" value={nama} />
          <InfoRow label="NISN" value={nisn} />
          <InfoRow label="Kelas" value={kelas} />
          <InfoRow label="No Peserta" value={no_peserta} bold />
          <InfoRow label="Ruang" value={ruang} />
        </div>
      </div>

      {/* === FOOTER — Cap + Tanda Tangan === */}
      <div className="exam-card-footer">
        <div className="footer-spacer"></div>
        <div className="signature-block">
          <p className="sig-location">Curug, 28 April 2026</p>
          <p className="sig-title">Kepala Sekolah,</p>
          <div className="sig-stamp-area">
            <img src="/cap-sekolah.png" alt="Cap Sekolah" className="stamp-img" />
            <img src="/ttd-kepsek.png" alt="Tanda Tangan" className="signature-img" />
          </div>
          <p className="sig-name"><u>Risnawiyati Octavia. S.Pd..,M.Pd</u></p>
          <p className="sig-nip">NIP. 198010182008012008</p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, bold = false }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-separator">:</span>
      <span
        className="info-value"
        style={{ fontWeight: bold ? '700' : '400' }}
      >
        {value || ''}
      </span>
    </div>
  );
}
