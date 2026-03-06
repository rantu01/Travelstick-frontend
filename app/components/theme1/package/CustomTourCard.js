import { useRouter } from 'next/navigation';
import React from 'react';

const CustomTourBanner = () => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push('/custom-tour-request');
  };

  return (
    <div className="group relative w-full mb-10 overflow-hidden rounded-2xl bg-gradient-to-br from-white via-blue-50 to-white border border-blue-100 flex items-center p-8 md:p-10 shadow-xl transition-all duration-300 hover:shadow-2xl min-h-[160px]">
      
      {/* Background decorative elements - like the dotted map pattern from image */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none select-none">
        <svg width="100%" height="100%" viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Dotted path lines */}
          <path d="M-100 60 C50 20 250 150 450 90 C650 30 850 140 1050 80 C1250 20 1450 100 1650 50" stroke="#1E3A8A" strokeWidth="2" strokeDasharray="8 8" opacity="0.4"/>
          <path d="M-50 140 C150 100 350 180 550 130 C750 80 950 170 1150 120" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.3"/>
          
          {/* Location markers */}
          <circle cx="250" cy="90" r="4" fill="#2563EB" opacity="0.5" />
          <circle cx="550" cy="130" r="4" fill="#2563EB" opacity="0.5" />
          <circle cx="850" cy="90" r="4" fill="#2563EB" opacity="0.5" />
          <circle cx="1150" cy="120" r="4" fill="#2563EB" opacity="0.5" />
          
          {/* Small dots scattered */}
          <circle cx="180" cy="60" r="2" fill="#1E3A8A" opacity="0.3" />
          <circle cx="380" cy="150" r="2" fill="#1E3A8A" opacity="0.3" />
          <circle cx="680" cy="70" r="2" fill="#1E3A8A" opacity="0.3" />
          <circle cx="980" cy="140" r="2" fill="#1E3A8A" opacity="0.3" />
        </svg>
      </div>
      
      {/* Floating gradient orbs for visual interest */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full gap-8">
        
        {/* Left side: Text with improved typography */}
        <div className="text-center md:text-left flex-1 space-y-1">
          <p className="text-blue-600 text-lg md:text-xl font-medium tracking-wide animate-fade-in">
            Need a
          </p>
          <h2 className="text-gray-800 text-3xl md:text-5xl font-black tracking-tight leading-none">
            <span className="bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
              CUSTOMISED
            </span>{' '}
            <span className="text-blue-600">TOUR?</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-md mt-2 hidden md:block">
            Tailor-made experiences designed just for you
          </p>
        </div>
        
        {/* Right side: Enhanced button with micro-interactions */}
        <div className="flex items-center justify-center">
          <button
            onClick={handleNavigation}
            className="relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold h-14 md:h-16 px-10 md:px-14 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 whitespace-nowrap uppercase tracking-wider text-sm md:text-base group/btn"
          >
            <span className="relative z-10 flex items-center gap-2">
              Request Now
              <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
      
      {/* Decorative corner accent */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-600 opacity-5 rounded-tl-full pointer-events-none"></div>
    </div>
  );
};

export default CustomTourBanner;