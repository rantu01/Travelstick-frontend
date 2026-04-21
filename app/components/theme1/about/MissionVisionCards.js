import React from 'react';

// For the icons, you can use React Icons like this:
// npm install react-icons
import { FaGlobeAmericas } from 'react-icons/fa'; // Earth icon
import { MdOutlineRemoveRedEye } from 'react-icons/md'; // Eye icon

const MissionVisionCards = () => {
  return (
    <section className="bg-gray-100 py-16 px-6 md:px-10 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-center justify-center">
        
        {/* --- Card 1: Our Mission (White) --- */}
        <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-lg p-10 flex flex-col h-full border border-gray-100">
          
          {/* Icon Container */}
          <div className="bg-[#EAEFF4] w-14 h-14 rounded-full flex items-center justify-center mb-10">
            <FaGlobeAmericas className="text-[#102C7B] text-2xl" />
          </div>

          {/* Heading */}
          <h2 className="text-[#102C7B] text-4xl md:text-5xl font-bold mb-8">
            Our Mission
          </h2>

          {/* Description */}
          <p className="text-[#3B4C63] text-base leading-relaxed mb-12 flex-grow">
            To redefine luxury travel through the lens of sustainability and 
            authenticity. We empower global citizens to explore the 
            world’s most delicate ecosystems responsibly, ensuring that 
            our presence leaves a positive footprint on every community 
            we touch.
          </p>

          {/* Tag Badges Container */}
          <div className="flex flex-wrap gap-4 mt-auto">
            <span className="bg-[#FFEAC1] text-[#9A7016] font-semibold text-sm uppercase px-5 py-2 rounded-full tracking-wider">
              Sustainable
            </span>
            <span className="bg-[#FFEAC1] text-[#9A7016] font-semibold text-sm uppercase px-5 py-2 rounded-full tracking-wider">
              Ethical
            </span>
          </div>
        </div>

        {/* --- Card 2: Our Vision (Dark Blue) --- */}
        <div className="w-full lg:w-1/2 bg-[#002D82] rounded-xl shadow-lg p-10 flex flex-col h-full text-white">
          
          {/* Icon Container */}
          <div className="bg-[#1C438D] w-14 h-14 rounded-full flex items-center justify-center mb-10">
            <MdOutlineRemoveRedEye className="text-white text-3xl" />
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Our Vision
          </h2>

          {/* Description */}
          <p className="text-[#BCCFEE] text-base leading-relaxed mb-12 flex-grow">
            To become the world's most respected curator of 
            transformative travel, where every journey is a bespoke 
            masterpiece. We envision a future where high-end travel and 
            deep cultural immersion coexist seamlessly, bridging gaps 
            and fostering global understanding.
          </p>

          {/* Tag Badges Container */}
          <div className="flex flex-wrap gap-4 mt-auto">
            <span className="bg-[#1C438D] text-white font-semibold text-sm uppercase px-5 py-2 rounded-full tracking-wider">
              Authentic
            </span>
            <span className="bg-[#1C438D] text-white font-semibold text-sm uppercase px-5 py-2 rounded-full tracking-wider">
              Transformative
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MissionVisionCards;