import React from 'react';

const OurHeritage = () => {
  return (
    <section className="bg-[#f8f9fa] py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Content Section */}
        <div className="lg:w-1/2 space-y-6">
          <h4 className="text-[#a8894d] font-bold text-xs tracking-widest uppercase">
            Our Heritage
          </h4>
          <h2 className="text-[#003366] text-3xl md:text-4xl font-bold leading-tight">
            From a Love for Exploration to <br className="hidden md:block" /> a Trusted Legacy.
          </h2>
          <div className="text-gray-600 space-y-4 text-sm md:text-base leading-relaxed">
            <p>
              Banglaco.com began not in a boardroom, but on the rugged trails of the Himalayas 
              and the pristine beaches of the Andaman. Our founders, seasoned explorers 
              themselves, realized that the modern voyager sought more than just a 
              destination—they sought a narrative.
            </p>
            <p>
              Over two decades, we've evolved from a small boutique agency into a premier 
              digital concierge, curating high-end adventures that respect local cultures 
              and preserve natural wonders. We don't just book trips; we architect 
              life-changing experiences.
            </p>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="lg:w-1/2 flex items-center justify-center gap-4">
          {/* First Image - Illustration */}
          <div className="relative w-1/2 overflow-hidden rounded-tl-[80px] rounded-br-[80px] shadow-xl">
            <img 
              src="https://i1.pickpik.com/photos/970/1018/402/people-holidays-man-nature-23af7727ae72575466aafab4546d2f2a.jpg" 
              alt="Safe Work Illustration" 
              className="w-full h-[400px] object-cover"
            />
            {/* Optional Overlay text similar to "SAFE WORK" */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
               <span className="text-cyan-400 font-bold tracking-tighter text-xl opacity-80">SAFE WORK</span>
            </div>
          </div>

          {/* Second Image - Resort/Pool */}
          <div className="w-1/2 overflow-hidden rounded-tr-[80px] rounded-bl-[80px] shadow-xl translate-y-8">
            <img 
              src="https://5.imimg.com/data5/SELLER/Default/2023/10/351676184/JC/OA/WI/30189946/hotel-swimming-pool.jpg" 
              alt="Luxury Resort" 
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default OurHeritage;