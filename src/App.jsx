import { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import DataTable from './components/DataTable';
import ExamCardGrid from './components/ExamCardGrid';
import Toolbar from './components/Toolbar';
import EmptyState from './components/EmptyState';
import { ToastContainer, useToast } from './components/Toast';
import useExcelParser from './hooks/useExcelParser';
import usePhotoManager from './hooks/usePhotoManager';
import { triggerPrint } from './utils/printHelpers';

export default function App() {
  const {
    data,
    headers,
    fileName,
    isLoading,
    error,
    hasChanges,
    parseFile,
    updateCell,
    addRow,
    deleteRow,
    exportExcel,
    clearData,
    setError,
  } = useExcelParser();

  const {
    photoMap,
    photoCount,
    addPhotos,
    addSinglePhoto,
    getPhoto,
    removePhoto,
    clearPhotos,
    getMatchStats,
  } = usePhotoManager();

  const toast = useToast();
  const toastRef = useRef(toast);
  toastRef.current = toast;
  const [view, setView] = useState('table'); // 'table' | 'cards'
  const [showUploader, setShowUploader] = useState(true);
  const fileUploaderRef = useRef(null);

  const hasData = data.length > 0;

  // Handle file selection
  const handleFileSelect = useCallback(async (file) => {
    const result = await parseFile(file);

    if (result.success) {
      setShowUploader(false);
      toastRef.current.success(`Berhasil memuat ${result.totalRows} data peserta dari "${file.name}"`);
      if (result.warnings) {
        toastRef.current.warning(result.warnings);
      }
    } else {
      toastRef.current.error(result.error || 'Gagal membaca file');
    }
  }, [parseFile]);

  // Handle batch photo upload
  const handlePhotoUpload = useCallback((files) => {
    const result = addPhotos(files);
    if (result.added > 0) {
      toastRef.current.success(`${result.added} foto berhasil dimuat`);
      // Check matching
      if (hasData) {
        const stats = getMatchStats(data);
        if (stats.matched > 0) {
          toastRef.current.info(`${stats.matched} foto cocok dengan data peserta`);
        }
        if (stats.unmatched.length > 0 && stats.unmatched.length <= 3) {
          toastRef.current.warning(`Foto belum ditemukan: ${stats.unmatched.join(', ')}`);
        } else if (stats.unmatched.length > 3) {
          toastRef.current.warning(`${stats.unmatched.length} peserta belum ada fotonya`);
        }
      }
    } else {
      toastRef.current.error('Tidak ada file gambar yang valid');
    }
  }, [addPhotos, hasData, data, getMatchStats]);

  // Handle single photo upload for a row
  const handleSinglePhotoUpload = useCallback((file, rowId) => {
    // Find the row to get/set the filename
    const row = data.find(r => r._id === rowId);
    if (!row) return;

    // Use existing filename or generate one from the file
    let targetFilename = row.nama_file_foto;
    if (!targetFilename || !targetFilename.trim()) {
      targetFilename = file.name;
      // Update the cell with the filename
      updateCell(rowId, 'nama_file_foto', file.name);
    }

    addSinglePhoto(file, targetFilename);
    toastRef.current.success(`Foto untuk "${row.nama_lengkap || 'peserta'}" berhasil dimuat`);
  }, [data, addSinglePhoto, updateCell]);

  // Handle remove photo for a row
  const handleRemovePhoto = useCallback((rowId, filename) => {
    if (filename) {
      removePhoto(filename);
    }
    // Clear the filename from data
    updateCell(rowId, 'nama_file_foto', '');
    toastRef.current.info('Foto dihapus');
  }, [removePhoto, updateCell]);

  // Handle export
  const handleExport = useCallback(() => {
    try {
      exportExcel();
      toastRef.current.success('File Excel berhasil diunduh!');
    } catch (err) {
      toastRef.current.error('Gagal mengekspor file: ' + err.message);
    }
  }, [exportExcel]);

  // Handle print
  const handlePrint = useCallback(() => {
    setView('cards');
    toastRef.current.info('Menyiapkan halaman cetak...');
    setTimeout(() => {
      triggerPrint();
    }, 500);
  }, []);

  // Handle clear / upload new
  const handleUploadNew = useCallback(() => {
    if (hasChanges) {
      const confirm = window.confirm(
        'Ada perubahan yang belum disimpan. Apakah ingin melanjutkan? Data yang belum diunduh akan hilang.'
      );
      if (!confirm) return;
    }
    clearData();
    clearPhotos();
    setShowUploader(true);
    setView('table');
  }, [hasChanges, clearData, clearPhotos]);

  // Handle add row
  const handleAddRow = useCallback(() => {
    const newId = addRow();
    toastRef.current.info('Baris baru ditambahkan — langsung isi datanya');
    return newId;
  }, [addRow]);

  // Handle delete row
  const handleDeleteRow = useCallback((rowId) => {
    deleteRow(rowId);
    toastRef.current.info('Baris dihapus');
  }, [deleteRow]);

  // Show error from parser via useEffect to avoid render-phase setState
  useEffect(() => {
    if (error && !hasData) {
      toastRef.current.error(error);
      setError(null);
    }
  }, [error, hasData, setError]);

  // Warn on page unload if there are unsaved changes
  useEffect(() => {
    const handler = (e) => {
      if (hasChanges) {
        e.preventDefault();
        return 'Ada perubahan yang belum disimpan.';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasChanges]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

      {/* Header */}
      <Header dataCount={hasData ? data.length : 0} photoCount={photoCount} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Show Uploader when no data or explicitly requested */}
        {showUploader && !hasData && (
          <div ref={fileUploaderRef}>
            <EmptyState />
            <div className="mt-8">
              <FileUploader onFileSelect={handleFileSelect} isLoading={isLoading} />
            </div>
          </div>
        )}

        {/* Show toolbar and content when data exists */}
        {hasData && (
          <>
            <Toolbar
              hasData={hasData}
              hasChanges={hasChanges}
              dataCount={data.length}
              photoCount={photoCount}
              view={view}
              onViewChange={setView}
              onExport={handleExport}
              onPrint={handlePrint}
              onClear={clearData}
              onUploadNew={handleUploadNew}
              onPhotoUpload={handlePhotoUpload}
              fileName={fileName}
            />

            {/* Table View */}
            {view === 'table' && (
              <DataTable
                data={data}
                headers={headers}
                onUpdateCell={updateCell}
                onDeleteRow={handleDeleteRow}
                onAddRow={handleAddRow}
                photoMap={photoMap}
                onSinglePhotoUpload={handleSinglePhotoUpload}
                onRemovePhoto={handleRemovePhoto}
              />
            )}

            {/* Cards View */}
            {view === 'cards' && (
              <div className="no-print">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    Preview Kartu Ujian
                  </h2>
                  <p className="text-xs text-slate-500">
                    Tampilan ini adalah preview. Klik "Cetak Kartu" untuk print.
                  </p>
                </div>
                <ExamCardGrid data={data} photoMap={photoMap} />
              </div>
            )}
          </>
        )}

        {/* Print-only card grid (hidden on screen, shown on print) */}
        {hasData && (
          <div className="print-only hidden-screen">
            <ExamCardGrid data={data} isPrintMode={true} photoMap={photoMap} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-800/50 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-600">
            Cetak Kartu Ujian v1.0 — Berjalan 100% di browser, tanpa server.
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Data tidak di-upload ke server manapun
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
