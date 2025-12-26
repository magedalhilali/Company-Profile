import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-t-2 border-white rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-t-2 border-white/50 rounded-full animate-spin [animation-direction:reverse]"></div>
      </div>
      <p className="text-white/60 font-serif text-sm tracking-widest uppercase">Loading Portfolio</p>
    </div>
  );
};