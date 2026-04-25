import { useRef } from 'react';
import { calculatePages } from '../utils/printHelpers';

export default function Toolbar({
  hasData,
  hasChanges,
  dataCount,
  photoCount,
  view,
  onViewChange,
  onExport,
  onPrint,
  onClear,
  onUploadNew,
  onPhotoUpload,
  onZipUpload,
  fileName,
}) {
  const photoInputRef = useRef(null);
  const zipInputRef = useRef(null);

  const handlePhotoSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onPhotoUpload(files);
    }
    e.target.value = '';
  };

  const handleZipSelect = (e) => {
    const file = e.target.files[0];
    if (file && onZipUpload) {
      onZipUpload(file);
    }
    e.target.value = '';
  };

  return (
    <div className="no-print toolbar glass rounded-2xl p-4 mb-6 animate-slide-up">
      {/* Hidden photo input */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoSelect}
        className="hidden"
        id="photo-input"
      />

      {/* Hidden ZIP input */}
      <input
        ref={zipInputRef}
        type="file"
        accept=".zip,.rar,.7z"
        onChange={handleZipSelect}
        className="hidden"
        id="zip-input"
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Left - File info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-green-400">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{fileName}</p>
            <div className="flex gap-2 items-center mt-0.5 flex-wrap">
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{dataCount} peserta</span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{calculatePages(dataCount)} halaman cetak</span>
              {photoCount > 0 && (
                <>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                      <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {photoCount} foto
                  </span>
                </>
              )}
              {hasChanges && (
                <>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span className="text-xs text-amber-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Belum disimpan
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="toolbar-actions flex gap-2 flex-wrap">
          {/* View Switcher */}
          <div className="flex rounded-xl p-1 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <button
              onClick={() => onViewChange('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                view === 'table'
                  ? 'bg-indigo-500/20 text-indigo-400 shadow-sm'
                  : ''
              }`}
              style={view !== 'table' ? { color: 'var(--text-secondary)' } : undefined}
              id="view-table-btn"
            >
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 9h18M3 15h18M9 3v18M15 3v18" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Tabel
              </span>
            </button>
            <button
              onClick={() => onViewChange('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                view === 'cards'
                  ? 'bg-indigo-500/20 text-indigo-400 shadow-sm'
                  : ''
              }`}
              style={view !== 'cards' ? { color: 'var(--text-secondary)' } : undefined}
              id="view-cards-btn"
            >
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <rect x="2" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <rect x="2" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Kartu
              </span>
            </button>
          </div>

          {/* Action buttons */}
          <button onClick={onUploadNew} className="btn btn-sm btn-ghost" id="upload-new-btn" data-tooltip="Upload file baru">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Upload Baru
          </button>

          {/* Photo Upload Button */}
          <button
            onClick={() => photoInputRef.current?.click()}
            className="btn btn-sm btn-ghost"
            id="upload-photo-btn"
            data-tooltip="Upload foto peserta (batch)"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
              <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Upload Foto
            {photoCount > 0 && (
              <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{photoCount}</span>
            )}
          </button>

          {/* ZIP Photo Upload Button */}
          <button
            onClick={() => zipInputRef.current?.click()}
            className="btn btn-sm btn-ghost"
            id="upload-zip-btn"
            data-tooltip="Upload ZIP foto (auto-match A-Z)"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11v6M9 14h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Upload ZIP
          </button>

          <button
            onClick={onExport}
            className={`btn btn-sm ${hasChanges ? 'btn-success' : 'btn-secondary'}`}
            id="export-btn"
            data-tooltip={hasChanges ? 'Ada perubahan! Simpan segera' : 'Download data sebagai Excel'}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download Excel
          </button>

          <button onClick={onPrint} className="btn btn-sm btn-primary" id="print-btn" data-tooltip="Cetak semua kartu ujian">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="6" y="14" width="12" height="8" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Cetak Kartu
          </button>
        </div>
      </div>
    </div>
  );
}
