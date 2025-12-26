// Generating 26 high-quality placeholder images acting as portfolio pieces.
// We use picsum with specific seeds to ensure consistency and caching.

const IMAGE_COUNT = 26;

export const PORTFOLIO_IMAGES = Array.from({ length: IMAGE_COUNT }).map((_, i) => {
  // Using different seeds to get different images
  const seed = i + 100; 
  // Alternating orientations slightly to test object-fit logic, 
  // though mostly we want portrait for a book format.
  return `https://picsum.photos/seed/${seed}/800/1200`;
});

export const TOTAL_PAGES = PORTFOLIO_IMAGES.length;
// A book has sheets. Each sheet has 2 pages (Front/Back).
// 26 pages = 13 sheets.
export const TOTAL_SHEETS = Math.ceil(TOTAL_PAGES / 2);