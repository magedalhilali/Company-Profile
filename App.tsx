import React, { useState, useEffect } from 'react';
import { Flipbook } from './components/Flipbook';
import { LoadingSpinner } from './components/LoadingSpinner';
import { PORTFOLIO_IMAGES } from './constants';

const App: React.FC = () => {
  const [ready, setReady] = useState(false);

  // Preload just the first few images to ensure the initial render isn't empty.
  // The rest will lazy load via the browser.
  useEffect(() => {
    const preloadImages = async () => {
      const imagesToPreload = PORTFOLIO_IMAGES.slice(0, 4);
      
      const promises = imagesToPreload.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve; // Continue even if error
        });
      });

      await Promise.all(promises);
      // Add a small artificial delay for the premium "loading" feel if connection is too fast
      setTimeout(() => setReady(true), 800);
    };

    preloadImages();
  }, []);

  return (
    <div className="relative w-full h-screen bg-neutral-900 flex flex-col overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
          Portfolio <span className="text-white/40 font-normal">.24</span>
        </h1>
        <div className="hidden md:block text-xs font-mono text-white/30">
          INTERACTIVE 3D COMPONENT
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center relative z-10 w-full">
        {!ready ? (
          <div className="animate-fade-in">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="w-full h-full animate-fade-in-up">
            <Flipbook />
          </div>
        )}
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;