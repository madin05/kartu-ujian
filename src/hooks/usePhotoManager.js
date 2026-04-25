import { useState, useCallback } from 'react';

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
    addSinglePhoto,
    getPhoto,
    removePhoto,
    clearPhotos,
    getMatchStats,
  };
}
