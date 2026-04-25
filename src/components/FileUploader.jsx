import { useState, useRef, useCallback } from 'react';
import { detectFileType } from '../utils/excelHelpers';

export default function FileUploader({ onFileSelect, isLoading }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback((file) => {
    const type = detectFileType(file);
    if (type === 'unknown') {
      return { error: 'Format file tidak didukung. Gunakan .xlsx, .xls, atau .csv' };
    }
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
    e.target.value = ''; // Reset so same file can be re-uploaded
  }, [handleFile]);

  return (
    <div className="animate-fade-in">
      <div
        className={`dropzone p-8 sm:p-12 text-center cursor-pointer transition-all ${isDragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        id="file-upload-zone"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleInputChange}
          className="hidden"
          id="file-input"
        />

        <div className="relative z-10 flex flex-col items-center gap-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Upload Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-700/20 border border-indigo-500/30 flex items-center justify-center animate-bounce-gentle">
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="text-indigo-400">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 8l-5-5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Text */}
              <div>
                <p className="text-lg font-semibold text-white mb-1">
                  Drag & Drop File Excel
                </p>
                <p className="text-sm text-slate-400">
                  atau <span className="text-indigo-400 font-medium hover:text-indigo-300 underline underline-offset-2 decoration-indigo-500/50">klik untuk browse</span>
                </p>
              </div>

              {/* Supported formats */}
              <div className="flex gap-2 mt-1">
                {['.xlsx', '.xls', '.csv'].map((fmt) => (
                  <span key={fmt} className="px-3 py-1 text-xs font-medium rounded-full bg-slate-800/80 text-slate-400 border border-slate-700/50">
                    {fmt}
                  </span>
                ))}
              </div>

              {/* Hint */}
              <p className="text-xs text-slate-500 mt-2 max-w-md">
                💡 Pastikan baris pertama (header) menggunakan format <code className="text-indigo-400/80 bg-indigo-500/10 px-1.5 py-0.5 rounded">snake_case</code> — contoh: <code className="text-indigo-400/80 bg-indigo-500/10 px-1.5 py-0.5 rounded">nomor_peserta</code>, <code className="text-indigo-400/80 bg-indigo-500/10 px-1.5 py-0.5 rounded">nama_lengkap</code>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-sm text-slate-400 animate-pulse">Membaca file...</p>
    </div>
  );
}
