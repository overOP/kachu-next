/**
 * Returns a bounded window of page numbers around the current page.
 * Avoids rendering hundreds of pagination buttons on large catalogs.
 */
export function getVisiblePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible = 7
): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
