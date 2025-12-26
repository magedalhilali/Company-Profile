import React, { forwardRef, useState } from 'react';
import { PageProps } from '../types';
import { Loader2 } from 'lucide-react';

export const Page = forwardRef<HTMLDivElement, PageProps>(({ image, pageNumber, total }, ref) => {
  const [loaded, setLoaded] = useState(false);

  // Even pages (0, 2, 4...) are on the Right in LTR mode (Wait, standard book: 0=Cover(Right), 1=Left, 2=Right)
  // Actually, let's treat the gradient based on odd/even logic relative to the spine.
  // In a spread:
  // Left Page (Odd index in array? No, usually p1 is left, p2 is right).
  // React-PageFlip index 0: Cover (Right).
  // Index 1: Left.
  // Index 2: Right.
  // So: Even indices = Right Page = Spine on Left.
  // Odd indices = Left Page = Spine on Right.
  
  const isRightPage = pageNumber % 2 === 0;

  return (
    <div className="bg-white h-full w-full overflow-hidden relative shadow-inner" ref={ref}>
      {/* Loading State */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 z-0">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
        </div>
      )}

      <div className="relative h-full w-full group">
        <img
          src={image}
          alt={`Page ${pageNumber + 1}`}
          className={`h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
        
        {/* Spine Shadow Gradient */}
        <div 
          className={`absolute inset-y-0 w-16 pointer-events-none opacity-20 mix-blend-multiply
            ${!isRightPage ? 'right-0 bg-gradient-to-l from-black/60 to-transparent' : 'left-0 bg-gradient-to-r from-black/60 to-transparent'}
          `} 
        />
        
        {/* Page Shine/Lighting */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none opacity-50" />

        {/* Page Number */}
        <div className={`absolute bottom-6 ${isRightPage ? 'right-6' : 'left-6'} text-xs font-serif text-black/60 font-medium tracking-widest z-20 bg-white/80 px-2 py-1 rounded backdrop-blur-sm`}>
           {pageNumber + 1} <span className="text-black/30">/</span> {total}
        </div>
        
        {/* Corner Hint (Only visible on hover/desktop) */}
        <div className={`absolute bottom-0 ${isRightPage ? 'right-0 rounded-tl-3xl' : 'left-0 rounded-tr-3xl'} w-12 h-12 bg-white/0 group-hover:bg-white/10 transition-colors duration-300`} />
      </div>
    </div>
  );
});

Page.displayName = 'Page';