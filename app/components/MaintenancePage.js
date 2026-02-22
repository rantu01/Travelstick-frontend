import React, { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';

const MaintenancePage = () => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Close animation handle korar function
  const handleClose = () => {
    setIsClosing(true);
    // 500ms por purapuri vanished hobe (CSS transition time er sathe mil rekhe)
    setTimeout(() => {
      setIsVisible(false);
    }, 500);
  };

  const handleOpen = () => {
    setIsClosing(false);
    setIsVisible(true);
  };

  return (
    <>
      {/* Floating Gear Icon (Jokhon popup thakbe na) */}
      {!isVisible && (
        <div 
          onClick={handleOpen}
          className="fixed top-24 right-5 z-[9999] cursor-pointer group animate-in fade-in zoom-in duration-500"
        >
          <div className="bg-[#1a4fa0] p-2 rounded-full shadow-lg border-2 border-white animate-bounce">
            <Settings size={20} className="text-white animate-spin-slow" />
          </div>
          <span className="absolute right-10 top-1 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-sans">
            Under Maintenance
          </span>
        </div>
      )}

      {/* Main Maintenance Popup with Fly-away Animation */}
      {isVisible && (
        <div className={`fixed inset-0 z-[10000] flex items-center justify-center px-4 transition-all duration-500 ${isClosing ? 'pointer-events-none' : ''}`}>
          
          {/* Backdrop Blur - Close korle dhire dhire vanish hobe */}
          <div 
            className={`absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500 ${isClosing ? 'opacity-0' : 'opacity-100'}`} 
            onClick={handleClose} 
          />

          {/* Modal Card with Target Animation */}
          <div className={`
            relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-100 
            transition-all duration-500 ease-in-out font-sans
            ${isClosing 
              ? 'scale-0 opacity-0 translate-x-[40%] -translate-y-[40%] rotate-12' 
              : 'scale-100 opacity-100 translate-x-0 translate-y-0 rotate-0'}
          `}
          style={{ 
            transformOrigin: 'top right', // Eta animation-ke upore-dan-dike (Gear icon er dike) niye jabe
          }}>
          
            
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all"
            >
              <X size={24} />
            </button>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mb-6 rotate-12">
                <Settings size={45} className="text-amber-600 animate-spin-slow" />
              </div>

              <h1 className="text-3xl font-extrabold text-[#333C4E] mb-3">
                Improving Things!
              </h1>
              
              <p className="text-gray-500 font-medium leading-relaxed mb-8">
                Our site is currently under maintenance. We are adding new features to make your experience smoother.
              </p>

              <button 
                onClick={handleClose}
                className="w-full py-4 bg-[#333C4E] text-white rounded-xl font-bold hover:bg-black transition-all shadow-xl active:scale-95"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default MaintenancePage;