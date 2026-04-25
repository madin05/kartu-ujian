import { useState, useCallback } from 'react';
import { readExcelFile, writeExcelFile, validateHeaders, sanitizeData, createEmptyRow } from '../utils/excelHelpers';

/**
 * Custom hook for Excel file parsing and state management
 */
export default function useExcelParser() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  /**
   * Parse an uploaded file
   */
  const parseFile = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await readExcelFile(file);
      const validation = validateHeaders(result.headers);

      if (!validation.valid) {
        setError(
          `Kolom wajib tidak ditemukan: ${validation.missing.join(', ')}. Pastikan baris pertama Excel menggunakan format snake_case.`
        );
        setIsLoading(false);
        return { success: false, error: 'missing_headers', missing: validation.missing };
      }

      const sanitized = sanitizeData(result.rows);
      setHeaders(result.headers);
      setData(sanitized);
      setFileName(result.fileName);
      setValidationResult(validation);
      setHasChanges(false);
      setIsLoading(false);

      return {
        success: true,
        totalRows: sanitized.length,
        headers: result.headers,
        warnings: validation.extra.length > 0
          ? `Kolom tambahan terdeteksi: ${validation.extra.join(', ')}`
          : null,
      };
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Update a cell value
   */
  const updateCell = useCallback((rowId, header, value) => {
    setData((prev) =>
      prev.map((row) =>
        row._id === rowId ? { ...row, [header]: value } : row
      )
    );
    setHasChanges(true);
  }, []);

  /**
   * Add a new empty row
   */
  const addRow = useCallback(() => {
    const newRow = createEmptyRow(headers);
    newRow._rowIndex = data.length + 1;
    setData((prev) => [...prev, newRow]);
    setHasChanges(true);
    return newRow._id;
  }, [headers, data.length]);

  /**
   * Delete a row by ID
   */
  const deleteRow = useCallback((rowId) => {
    setData((prev) => {
      const updated = prev.filter((row) => row._id !== rowId);
      // Re-index
      return updated.map((row, i) => ({ ...row, _rowIndex: i + 1 }));
    });
    setHasChanges(true);
  }, []);

  /**
   * Export current data to Excel
   */
  const exportExcel = useCallback(() => {
    if (data.length === 0) return;
    const exportName = fileName
      ? `edited_${fileName}`
      : 'data_kartu_ujian.xlsx';
    writeExcelFile(data, headers, exportName);
    setHasChanges(false);
  }, [data, headers, fileName]);

  /**
   * Clear all data
   */
  const clearData = useCallback(() => {
    setData([]);
    setHeaders([]);
    setFileName('');
    setValidationResult(null);
    setHasChanges(false);
    setError(null);
  }, []);

  return {
    data,
    headers,
    fileName,
    isLoading,
    error,
    validationResult,
    hasChanges,
    parseFile,
    updateCell,
    addRow,
    deleteRow,
    exportExcel,
    clearData,
    setError,
  };
}
