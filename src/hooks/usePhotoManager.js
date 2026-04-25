import { useState, useCallback } from 'react';
import JSZip from 'jszip';

/**
 * Custom hook for managing participant photos
 * Stores photos as object URLs mapped by filename
 */
export default function usePhotoManager() {
  // Map<string, string> — key: filename, value: objectURL or base64 dataURL
  const [photoMap, setPhotoMap] = useState({});
  const [photoCount, setPhotoCount] = useState(0);

  /**
   * Add multiple photos from file input (batch upload)
   * @param {FileList|File[]} files
   * @returns {{ matched: number, total: number }}
   */
  const addPhotos = useCallback((files) => {
    const newMap = { ...photoMap };
    let count = 0;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        newMap[file.name] = url;
        count++;
      }
    });

    setPhotoMap(newMap);
    setPhotoCount(Object.keys(newMap).length);
    return { added: count, total: Object.keys(newMap).length };
  }, [photoMap]);

  /**
   * Extract photos from a ZIP file and auto-match to data rows by alphabetical order.
   * Photos inside ZIP are sorted by filename (A-Z),
   * then matched to data rows sorted by 'nama' field (A-Z).
   *
   * @param {File} zipFile - The ZIP file to extract
   * @param {object[]} data - Current data rows
   * @param {function} updateCell - Function to update cell value
   * @returns {Promise<{ added: number, matched: number }>}
   */
  const addPhotosFromZip = useCallback(async (zipFile, data, updateCell) => {
    const zip = await JSZip.loadAsync(zipFile);

    // Collect all image files from the ZIP
    const imageEntries = [];
    zip.forEach((relativePath, entry) => {
      if (entry.dir) return;
      const lower = relativePath.toLowerCase();
      if (
        lower.endsWith('.jpg') ||
        lower.endsWith('.jpeg') ||
        lower.endsWith('.png') ||
        lower.endsWith('.webp') ||
        lower.endsWith('.gif') ||
        lower.endsWith('.bmp')
      ) {
        // Use only the filename (strip folders)
        const filename = relativePath.split('/').pop();
        imageEntries.push({ filename, entry });
      }
    });

    if (imageEntries.length === 0) {
      return { added: 0, matched: 0 };
    }

    // Sort images by filename A-Z
    imageEntries.sort((a, b) => a.filename.localeCompare(b.filename, 'id'));

    // Sort data rows by 'nama' field A-Z
    const sortedRows = [...data]
      .filter((row) => row.nama && row.nama.trim())
      .sort((a, b) => (a.nama || '').localeCompare(b.nama || '', 'id'));

    // Extract images and match to rows
    const newMap = { ...photoMap };
    let added = 0;
    let matched = 0;

    for (let i = 0; i < imageEntries.length; i++) {
      const { filename, entry } = imageEntries[i];

      try {
        // Extract image as blob
        const blob = await entry.async('blob');
        const url = URL.createObjectURL(blob);
        newMap[filename] = url;
        added++;

        // Match to corresponding row (by index)
        if (i < sortedRows.length) {
          const row = sortedRows[i];
          // Update the nama_file_foto field
          updateCell(row._id, 'nama_file_foto', filename);
          matched++;
        }
      } catch (err) {
        console.warn(`Failed to extract ${filename}:`, err);
      }
    }

    setPhotoMap(newMap);
    setPhotoCount(Object.keys(newMap).length);

    return { added, matched };
  }, [photoMap]);

  /**
   * Add a single photo for a specific filename
   * @param {File} file - The photo file
   * @param {string} targetFilename - The filename to store it under
   */
  const addSinglePhoto = useCallback((file, targetFilename) => {
    if (!file.type.startsWith('image/')) return null;

    const url = URL.createObjectURL(file);
    setPhotoMap((prev) => {
      const newMap = { ...prev, [targetFilename]: url };
      setPhotoCount(Object.keys(newMap).length);
      return newMap;
    });
    return url;
  }, []);

  /**
   * Get photo URL by filename
   * @param {string} filename
   * @returns {string|null}
   */
  const getPhoto = useCallback((filename) => {
    if (!filename) return null;
    return photoMap[filename] || photoMap[filename.trim()] || null;
  }, [photoMap]);

  /**
   * Remove a photo by filename
   */
  const removePhoto = useCallback((filename) => {
    setPhotoMap((prev) => {
      const newMap = { ...prev };
      if (newMap[filename]) {
        URL.revokeObjectURL(newMap[filename]);
        delete newMap[filename];
      }
      setPhotoCount(Object.keys(newMap).length);
      return newMap;
    });
  }, []);

  /**
   * Clear all photos (revoke object URLs to free memory)
   */
  const clearPhotos = useCallback(() => {
    Object.values(photoMap).forEach((url) => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    setPhotoMap({});
    setPhotoCount(0);
  }, [photoMap]);

  /**
   * Count how many photos match the data
   * @param {object[]} data - The row data
   * @returns {{ matched: number, unmatched: string[] }}
   */
  const getMatchStats = useCallback((data) => {
    let matched = 0;
    const unmatched = [];

    data.forEach((row) => {
      const filename = row.nama_file_foto;
      if (filename && filename.trim()) {
        if (photoMap[filename] || photoMap[filename.trim()]) {
          matched++;
        } else {
          unmatched.push(filename);
        }
      }
    });

    return { matched, unmatched, total: Object.keys(photoMap).length };
  }, [photoMap]);

  return {
    photoMap,
    photoCount,
    addPhotos,
    addPhotosFromZip,
    addSinglePhoto,
    getPhoto,
    removePhoto,
    clearPhotos,
    getMatchStats,
  };
}
