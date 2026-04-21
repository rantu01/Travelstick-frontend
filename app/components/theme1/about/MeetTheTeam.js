import React from 'react';

// Data array for easy editing and scalability
const teamMembers = [
  {
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWQfuqulGMo8Xtk38C_xLsFbWdbaRKKzCUfA&s', // placeholder art style for Adrian Sterling
    name: 'Adrian Sterling',
    role: 'FOUNDER & CEO',
    quote: '"Travel is the only thing you buy that makes you richer."',
  },
  {
    image: 'https://img.freepik.com/free-photo/high-angle-buisness-man_23-2148479585.jpg?semt=ais_hybrid&w=740&q=80', // placeholder for Elena Rodriguez
    name: 'Elena Rodriguez',
    role: 'SENIOR TRAVEL CONSULTANT',
    quote: '"Curating the extraordinary is not a job, it\'s an art form."',
  },
];

const MeetTheTeam = () => {
  return (
    <section className="bg-[#f0f3f6] py-20 px-6 md:px-10 lg:px-20 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="text-center md:text-left mb-16 max-w-2xl">
          <p className="text-[#A78BFA] uppercase tracking-[0.2em] text-sm font-semibold mb-4">
            The Visionaries
          </p>
          <h2 className="text-[#0D1B2A] text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Meet the Team
          </h2>
          <p className="text-[#6C757D] text-lg leading-relaxed">
            A collective of globetrotters, logistics wizards, and cultural enthusiasts 
            dedicated to your adventure.
          </p>
        </div>

        {/* --- Team Cards Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center justify-center">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col items-center p-0"
            >
              {/* Image Container with precise rounded top corners */}
              <div className="w-full h-80 overflow-hidden rounded-t-3xl">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Content Container */}
              <div className="p-8 text-center flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-[#0D1B2A] text-2xl font-bold mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#A78BFA] uppercase tracking-[0.15em] text-xs font-semibold mb-4">
                    {member.role}
                  </p>
                </div>
                <p className="text-[#6C757D] text-sm md:text-base leading-relaxed italic px-4">
                  {member.quote}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default MeetTheTeam;