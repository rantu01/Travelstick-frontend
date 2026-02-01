import React from 'react';

const MaintenancePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[200px] bg-[#F8F9FB] px-4 font-sans">
      {/* Main Heading */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#333C4E] mb-4 text-center">
        Site is under maintenance
      </h1>
      
      {/* Subtext */}
      <p className="text-sm md:text-base text-gray-500 font-medium text-center tracking-wide">
        We're working hard to improve the user experience. Stay tuned!
      </p>
    </div>
  );
};

export default MaintenancePage;