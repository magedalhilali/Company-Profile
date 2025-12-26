import React, { useState, useEffect } from 'react';
import { Flipbook } from './components/Flipbook';
import { LoadingSpinner } from './components/LoadingSpinner';
import { PORTFOLIO_IMAGES } from './constants';

const App: React.FC = () => {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update mobile status on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const preloadImages = async () => {
      const imagesToPreload = PORTFOLIO_IMAGES.slice(0, 4);
      const promises = imagesToPreload.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });

      await Promise.all(promises);
      setTimeout(() => setReady(true), 800);
    };
    preloadImages();
  }, []);

  return (
    /* h-screen and overflow-hidden ensure the app stays within the phone screen */
    <div className="relative w-full h-screen bg-[#0f0f0f] flex flex-col overflow-hidden m-0 p-0">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Header - Scaled down for mobile to save space */}
      <header className={`absolute top-0 left-0 w-full z-50 flex justify-between items-center ${isMobile ? 'p-4' : 'p-6'}`}>
        <h1 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-serif font-bold text-white tracking-tight`}>
          RGCT Profile <span className="text-white/40 font-normal">.26</span>
        </h1>
        <div className="hidden md:block text-xs font-mono text-white/30">
          RAMAH GENERAL CONTRACTING & TRANSPORT L.L.C-S.P.C
        </div>
      </header>

      {/* Main Content - Takes up all available space */}
      <main className="flex-1 flex items-center justify-center relative z-10 w-full h-full overflow-hidden">
        {!ready ? (
          <div className="animate-fade-in">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="w-full h-full animate-fade-in-up">
            {/* We pass the mobile status to the Flipbook component if needed */}
            <Flipbook isMobile={isMobile} />
          </div>
        )}
      </main>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
        
        /* Forces the HTML PageFlip library to fill the mobile viewport */
        .stf__parent { width: 100% !important; height: 100% !important; }
      `}</style>
    </div>
  );
};

export default App;
