/**
 * Single Exam Card Component
 */
export default function ExamCard({ data, index, photoMap = {} }) {
  const {
    nomor_peserta = '',
    nama_lengkap = '',
    ruang_ujian = '',
    waktu = '',
    jalur_masuk = '',
    password = '',
    nama_file_foto = '',
  } = data;

  // Get photo from the photoMap using filename
  const photoSrc = nama_file_foto && photoMap[nama_file_foto.trim()]
    ? photoMap[nama_file_foto.trim()]
    : null;

  return (
    <div className="exam-card" id={`exam-card-${index}`}>
      {/* Header */}
      <div className="exam-card-header">
        <div className="exam-card-logo">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#1e293b"/>
            <path d="M12 14h16M12 20h16M12 26h10" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="exam-card-title">
          <h2>Kartu Tanda Peserta</h2>
          <p>Ujian Masuk</p>
        </div>
        <div className="exam-card-logo" style={{opacity: 0}}>
          {/* Spacer for center alignment */}
        </div>
      </div>

      {/* Body */}
      <div className="exam-card-body">
        {/* Photo */}
        <div className="exam-card-photo">
          {photoSrc ? (
            <img
              src={photoSrc}
              alt={nama_lengkap}
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
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{color: '#ccc', marginBottom: '2px'}}>
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Pas Foto</span>
          </div>
        </div>

        {/* Info */}
        <div className="exam-card-info">
          <InfoRow label="No. Peserta" value={nomor_peserta} bold />
          <InfoRow label="Nama" value={nama_lengkap} />
          {jalur_masuk && <InfoRow label="Jalur" value={jalur_masuk} />}
          <InfoRow label="Ruang" value={ruang_ujian} />
          <InfoRow label="Waktu" value={waktu} />
          {password && <InfoRow label="Password" value={password} mono />}
        </div>
      </div>

      {/* Footer */}
      <div className="exam-card-footer">
        <div className="signature-area">
          <div className="signature-line"></div>
          <span>Tanda Tangan</span>
        </div>
        <div className="signature-area">
          <div className="signature-line"></div>
          <span>Panitia</span>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, bold = false, mono = false }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-separator">:</span>
      <span
        className="info-value"
        style={{
          fontWeight: bold ? '700' : '400',
          fontFamily: mono ? "'Courier New', monospace" : 'inherit',
          letterSpacing: mono ? '0.5pt' : 'normal',
        }}
      >
        {value || '-'}
      </span>
    </div>
  );
}
