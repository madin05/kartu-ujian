import { useState, useCallback, useRef, useEffect } from 'react';
import { HEADER_LABELS } from '../utils/excelHelpers';

export default function DataTable({ data, headers, onUpdateCell, onDeleteRow, onAddRow, photoMap = {}, onSinglePhotoUpload, onRemovePhoto }) {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [newRowId, setNewRowId] = useState(null);
  const editInputRef = useRef(null);
  const tableContainerRef = useRef(null);
  const newRowRef = useRef(null);
  const photoFileRef = useRef(null);
  const [photoUploadRowId, setPhotoUploadRowId] = useState(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingCell]);

  // Start editing a cell
  const startEditing = useCallback((rowId, header, currentValue) => {
    setEditingCell({ rowId, header });
    setEditValue(currentValue || '');
  }, []);

  // Auto-scroll and auto-edit when new row is added
  useEffect(() => {
    if (newRowId && data.length > 0) {
      const newRow = data.find(r => r._id === newRowId);
      if (newRow) {
        setTimeout(() => {
          if (newRowRef.current) {
            newRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else if (tableContainerRef.current) {
            tableContainerRef.current.scrollTop = tableContainerRef.current.scrollHeight;
          }
          startEditing(newRow._id, headers[0], newRow[headers[0]]);
        }, 100);
        setTimeout(() => setNewRowId(null), 3000);
      }
    }
  }, [newRowId, data, headers, startEditing]);

  // Commit edit
  const commitEdit = useCallback(() => {
    if (editingCell) {
      onUpdateCell(editingCell.rowId, editingCell.header, editValue);
      setEditingCell(null);
      setEditValue('');
    }
  }, [editingCell, editValue, onUpdateCell]);

  // Cancel edit
  const cancelEdit = useCallback(() => {
    setEditingCell(null);
    setEditValue('');
  }, []);

  // Sort handler
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // Filter and sort data
  const filteredData = data
    .filter((row) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return headers.some((h) => String(row[h] || '').toLowerCase().includes(term));
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aVal = String(a[sortConfig.key] || '');
      const bVal = String(b[sortConfig.key] || '');
      const comparison = aVal.localeCompare(bVal, 'id');
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

  // Handle keyboard in edit mode
  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      commitEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      commitEdit();
      if (editingCell) {
        const currentHeaderIndex = headers.indexOf(editingCell.header);
        const currentRowIndex = filteredData.findIndex(r => r._id === editingCell.rowId);
        if (currentHeaderIndex < headers.length - 1) {
          const nextHeader = headers[currentHeaderIndex + 1];
          const row = filteredData[currentRowIndex];
          if (row) startEditing(row._id, nextHeader, row[nextHeader]);
        } else if (currentRowIndex < filteredData.length - 1) {
          const nextRow = filteredData[currentRowIndex + 1];
          if (nextRow) startEditing(nextRow._id, headers[0], nextRow[headers[0]]);
        }
      }
    }
  };

  // Handle photo file select for individual row
  const handlePhotoFileChange = (e) => {
    const file = e.target.files[0];
    if (file && photoUploadRowId && onSinglePhotoUpload) {
      onSinglePhotoUpload(file, photoUploadRowId);
    }
    e.target.value = '';
    setPhotoUploadRowId(null);
  };

  // Trigger photo upload for a specific row
  const triggerPhotoUpload = (rowId) => {
    setPhotoUploadRowId(rowId);
    photoFileRef.current?.click();
  };

  const getLabel = (header) => HEADER_LABELS[header] || header;

  // Check if this header is the photo column
  const isPhotoColumn = (header) => header === 'nama_file_foto';

  return (
    <div className="animate-slide-up">
      {/* Hidden photo file input for individual rows */}
      <input
        ref={photoFileRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoFileChange}
        className="hidden"
      />

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            width="16" height="16" fill="none" viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Cari peserta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            id="search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {filteredData.length} dari {data.length} data
          </span>
          <button
            onClick={() => {
              setSearchTerm('');
              setSortConfig({ key: null, direction: 'asc' });
              const newId = onAddRow();
              if (newId) setNewRowId(newId);
            }}
            className="btn btn-sm btn-ghost"
            id="add-row-btn"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Tambah Baris
          </button>
        </div>
      </div>

      {/* Table */}
      <div ref={tableContainerRef} className="data-table-container data-table-scroll glass" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th className="row-number">#</th>
              <th style={{ width: '50px', textAlign: 'center' }}>Foto</th>
              {headers.map((header) => (
                <th
                  key={header}
                  onClick={() => handleSort(header)}
                  className={sortConfig.key === header ? 'sorted' : ''}
                  style={isPhotoColumn(header) ? { display: 'none' } : undefined}
                >
                  {getLabel(header)}
                  <span className="sort-icon">
                    {sortConfig.key === header
                      ? sortConfig.direction === 'asc' ? '↑' : '↓'
                      : '↕'}
                  </span>
                </th>
              ))}
              <th className="action-cell"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={headers.length + 3} className="text-center py-12 text-slate-500">
                  {searchTerm ? 'Tidak ada data yang cocok dengan pencarian.' : 'Belum ada data.'}
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => {
                const photoFilename = row.nama_file_foto;
                const photoSrc = photoFilename ? photoMap[photoFilename.trim()] : null;

                return (
                  <tr
                    key={row._id}
                    ref={row._id === newRowId ? newRowRef : undefined}
                    className={row._id === newRowId ? 'new-row-highlight' : ''}
                  >
                    <td className="row-number">{index + 1}</td>

                    {/* Photo thumbnail cell */}
                    <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                      <div className="photo-thumb-wrapper">
                        <button
                          onClick={() => triggerPhotoUpload(row._id)}
                          className="photo-thumb-btn"
                          title={photoSrc ? 'Klik untuk ganti foto' : 'Klik untuk upload foto'}
                        >
                          {photoSrc ? (
                            <img
                              src={photoSrc}
                              alt={row.nama_lengkap || ''}
                              className="photo-thumb"
                            />
                          ) : (
                            <div className="photo-thumb-placeholder">
                              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </div>
                          )}
                        </button>
                        {/* Delete photo button */}
                        {photoSrc && onRemovePhoto && (
                          <button
                            className="photo-delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemovePhoto(row._id, photoFilename);
                            }}
                            title="Hapus foto"
                          >
                            <svg width="10" height="10" fill="none" viewBox="0 0 16 16">
                              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>

                    {headers.map((header) => {
                      // Hide the nama_file_foto column (replaced by photo thumb)
                      if (isPhotoColumn(header)) return null;

                      const isEditing =
                        editingCell?.rowId === row._id && editingCell?.header === header;

                      return (
                        <td
                          key={header}
                          className={isEditing ? 'editing' : ''}
                          onDoubleClick={() => !isEditing && startEditing(row._id, header, row[header])}
                          title={isEditing ? undefined : 'Double-click untuk edit'}
                        >
                          {isEditing ? (
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={commitEdit}
                              onKeyDown={handleEditKeyDown}
                              className="cell-input"
                            />
                          ) : (
                            <span className="cursor-text">{row[header] || ''}</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="action-cell">
                      <button
                        className="delete-btn"
                        onClick={() => onDeleteRow(row._id)}
                        title="Hapus baris"
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Help text */}
      <p className="mt-3 text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" style={{ color: 'var(--text-muted)' }}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Double-click cell untuk edit • Tab pindah cell • Klik kolom Foto untuk upload foto per peserta
      </p>
    </div>
  );
}
