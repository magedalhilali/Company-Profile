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

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      const mobile = width < 768;
      
      setIsMobile(mobile);

      // MOBILE OPTIMIZATION: Use more of the screen height (90% instead of 80%)
      const maxWidth = mobile ? width : Math.min(1200, width * 0.85);
      const maxHeight = mobile ? height * 0.85 : height * 0.8;

      let pageH = maxHeight;
      let pageW = (pageH * 2) / 3; // 2:3 Portrait Aspect Ratio

      // Single-page view for mobile, double-page for desktop
      const totalWidthNeeded = mobile ? pageW : pageW * 2;

      if (totalWidthNeeded > maxWidth) {
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

  const next = () => bookRef.current?.pageFlip()?.flipNext();
  const prev = () => bookRef.current?.pageFlip()?.flipPrev();
  const reset = () => bookRef.current?.pageFlip()?.flip(0);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative p-0 m-0" ref={containerRef}>
      
      {/* Book Container */}
      <div className="relative shadow-2xl rounded-sm" style={{ height: dimensions.height }}>
        <HTMLFlipBook
          width={dimensions.width}
          height={dimensions.height}
          size="stretch" // CHANGED: 'stretch' helps fill parent containers
          minWidth={mobile ? 280 : 200} // Increased min-width for mobile readability
          maxWidth={1200}
          minHeight={400}
          maxHeight={1500}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          className="flip-book"
          ref={bookRef}
          onFlip={onFlip}
          usePortrait={isMobile} // Crucial for single-page mobile view
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

      {/* Responsive Controls - Smaller for mobile to prevent overlap */}
      <div className={`absolute bottom-4 md:bottom-12 flex items-center ${isMobile ? 'scale-90 space-x-2' : 'space-x-6'} z-50 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-2xl transition-all duration-300`}>
        <button onClick={prev} disabled={currentPage === 0} className="p-2 rounded-full hover:bg-white/10 transition disabled:opacity-30">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <div className="text-white/90 font-serif text-xs tracking-widest min-w-[60px] text-center">
           {currentPage + 1} <span className="text-white/30">/</span> {PORTFOLIO_IMAGES.length}
        </div>

        <button onClick={next} disabled={currentPage >= PORTFOLIO_IMAGES.length - 1} className="p-2 rounded-full hover:bg-white/10 transition disabled:opacity-30">
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        <div className="w-px h-6 bg-white/20 mx-1"></div>

        <button onClick={reset} disabled={currentPage === 0} className="p-2 rounded-full hover:bg-white/10 transition disabled:opacity-30">
          <RotateCcw className="w-4 h-4 text-white/70" />
        </button>
      </div>
      
      {/* Interaction Hint */}
      <div className={`absolute bottom-20 md:bottom-32 text-white/30 text-[10px] tracking-[0.2em] uppercase font-sans animate-pulse pointer-events-none transition-opacity duration-500 ${currentPage > 0 ? 'opacity-0' : 'opacity-100'}`}>
        {isMobile ? 'Swipe or tap corners' : 'Drag corners to flip'}
      </div>
    </div>
  );
};
