import React, { useState } from 'react';
import { Settings, X, Mail, Cog, Wrench } from 'lucide-react';

const MaintenancePage = () => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 500);
  };

  const handleOpen = () => {
    setIsClosing(false);
    setIsVisible(true);
  };

  return (
    <>
      {/* Floating Toggle Button (When Hidden) */}
      {!isVisible && (
        <button 
          onClick={handleOpen}
          className="fixed top-16 right-5 z-[9999] bg-[#00BCE4] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2 group"
        >
          <Settings className="animate-spin-slow" size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-bold">
            Status Update
          </span>
        </button>
      )}

      {isVisible && (
        <div className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 transition-all duration-500 ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#004a59]/60 backdrop-blur-sm" onClick={handleClose} />

          {/* Modal Container */}
          <div className="relative bg-white rounded-[40px] shadow-2xl max-w-2xl w-full overflow-hidden border-4 border-white">
            
            {/* Header Red Label (Like Image) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#1a4fa0] text-white px-10 py-2 rounded-b-3xl font-black text-sm uppercase tracking-widest shadow-lg z-20">
              Under Maintenance
            </div>

            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-6 text-gray-400 hover:text-gray-800 z-30 transition-colors"
            >
              <X size={28} />
            </button>

            <div className="p-8 md:p-12">
              {/* Creative Illustration Area */}
              <div className="relative flex justify-center items-center py-10">
                {/* Background Rotating Gears */}
                <Cog className="absolute top-0 left-20 text-[#00BCE4]/20 animate-spin-slow" size={100} />
                <Cog className="absolute bottom-4 right-20 text-[#00BCE4]/10 animate-spin-reverse" size={140} />
                
                {/* Central Laptop Card */}
                <div className="relative z-10 bg-[#004a59] p-4 rounded-2xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-[#eef2f3] w-48 h-32 md:w-64 md:h-40 rounded-lg flex flex-col p-2 gap-2 overflow-hidden">
                    <div className="flex gap-1">
                       <div className="w-2 h-2 rounded-full bg-red-400"></div>
                       <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                       <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                    <div className="space-y-2 pt-2">
                       <div className="h-2 w-3/4 bg-gray-300 rounded animate-pulse"></div>
                       <div className="h-2 w-full bg-gray-200 rounded"></div>
                       <div className="grid grid-cols-2 gap-2">
                          <div className="h-10 bg-[#00BCE4]/20 rounded border border-[#00BCE4]/30 flex items-center justify-center">
                             <Wrench size={14} className="text-[#00BCE4]" />
                          </div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                       </div>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-[#002f38] mt-2 rounded-full"></div>
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center space-y-4 max-w-lg mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-[#004a59]">
                  Enhancing Your Travel Experience
                </h2>
                <p className="text-gray-600 font-medium leading-relaxed">
                  We are working on providing an enhanced travel booking experience. 
                  Some of our services may be temporarily unavailable.
                </p>

                <div className="bg-[#f0f9fb] p-6 rounded-3xl border border-[#00BCE4]/20">
                  <p className="text-[#004a59] font-semibold text-sm md:text-base leading-relaxed">
                    Our support team is available <span className="text-[#00BCE4]">24/7</span> to assist with your existing bookings.
                  </p>
                  <a 
                    href="mailto:ask@banglaco.com" 
                    className="mt-3 flex items-center justify-center gap-2 text-[#1a4fa0] font-bold hover:underline"
                  >
                    <Mail size={18} />
                    ask@banglaco.com
                  </a>
                </div>

                <p className="text-gray-400 font-bold italic text-sm pt-4">
                  Thank you for your patience.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 20s linear infinite;
        }
      `}</style>
    </>
  );
};

export default MaintenancePage;