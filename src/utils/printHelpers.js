/**
 * Trigger window.print() with proper preparation
 */
export function triggerPrint() {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    window.print();
  }, 300);
}

/**
 * Calculate how many pages will be needed
 * @param {number} totalCards - Total number of cards
 * @param {number} cardsPerPage - Cards per page (default 8 = 2×4 compact)
 * @returns {number}
 */
export function calculatePages(totalCards, cardsPerPage = 8) {
  return Math.ceil(totalCards / cardsPerPage);
}
