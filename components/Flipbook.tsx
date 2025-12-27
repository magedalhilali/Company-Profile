import React, { useRef, useState, useEffect, useCallback } from 'react';
// @ts-ignore
import HTMLFlipBook from 'react-pageflip';
import { PORTFOLIO_IMAGES } from '../constants';
import { Page } from './BookSheet';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

export const Flipbook: React.FC = () => {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 400, height: 600 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive logic to calculate page size
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      const mobile = width < 768;
      
      setIsMobile(mobile);

      // Max dimensions for the book area
      const maxWidth = mobile ? width * 0.95 : Math.min(1200, width * 0.85);
      const maxHeight = height * 0.8;

      let pageH = maxHeight;
      let pageW = (pageH * 2) / 3; // 2:3 Aspect Ratio standard for portraits

      // Check if width constrains height
      // Mobile: Single page view
      // Desktop: Double page view (total width = 2 * pageW)
      const totalWidthNeeded = mobile ? pageW : pageW * 2;

      if (totalWidthNeeded > maxWidth) {
        // Scale down based on width
        const scale = maxWidth / totalWidthNeeded;
        pageW = pageW * scale;
        pageH = pageH * scale;
      }

      setDimensions({
        width: Math.floor(pageW),
        height: Math.floor(pageH)
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  const next = () => {
    bookRef.current?.pageFlip()?.flipNext();
  };

  const prev = () => {
    bookRef.current?.pageFlip()?.flipPrev();
  };

  const reset = () => {
    // flip(0) goes to start
    bookRef.current?.pageFlip()?.flip(0);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative" ref={containerRef}>
      
      {/* Book Container - The Library handles the 3D transforms */}
      <div className="relative shadow-2xl rounded-sm" style={{ height: dimensions.height }}>
        <HTMLFlipBook
          width={dimensions.width}
          height={dimensions.height}
          size="fixed"
          minWidth={200}
          maxWidth={800}
          minHeight={300}
          maxHeight={1000}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          className="flip-book"
          ref={bookRef}
          onFlip={onFlip}
          usePortrait={isMobile}
          startZIndex={0}
          autoSize={true}
          clickEvent={true}
          swipeDistance={30}
          drawShadow={true}
          flippingTime={1000}
        >
          {PORTFOLIO_IMAGES.map((img, index) => (
            <Page
              key={index}
              pageNumber={index}
              image={img}
              total={PORTFOLIO_IMAGES.length}
            />
          ))}
        </HTMLFlipBook>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 md:bottom-12 flex items-center space-x-6 z-50 bg-black/60 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10 shadow-2xl transition-all duration-300 hover:bg-black/70">
        <button
          onClick={prev}
          disabled={currentPage === 0}
          className="p-2 rounded-full hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed group"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-5 h-5 text-white group-hover:text-blue-300 transition-colors" />
        </button>

        <div className="text-white/90 font-serif text-sm tracking-widest min-w-[80px] text-center">
           <span className="text-xs text-white/40 mr-1">PAGE</span>
           {currentPage + 1} <span className="text-white/30">/</span> {PORTFOLIO_IMAGES.length}
        </div>

        <button
          onClick={next}
          disabled={currentPage >= PORTFOLIO_IMAGES.length - 1}
          className="p-2 rounded-full hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed group"
          aria-label="Next Page"
        >
          <ChevronRight className="w-5 h-5 text-white group-hover:text-blue-300 transition-colors" />
        </button>

        <div className="w-px h-6 bg-white/20 mx-2"></div>

        <button
          onClick={reset}
          disabled={currentPage === 0}
          className="p-2 rounded-full hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed group"
          aria-label="Back to Start"
        >
          <RotateCcw className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
        </button>
      </div>
      
      {/* Interaction Hint */}
      <div className={`absolute bottom-24 md:bottom-32 text-white/30 text-[10px] tracking-[0.2em] uppercase font-sans animate-pulse pointer-events-none transition-opacity duration-500 ${currentPage > 0 ? 'opacity-0' : 'opacity-100'}`}>
        {isMobile ? 'Swipe or tap corners' : 'Drag corners to flip'}
      </div>
    </div>
  );
};
