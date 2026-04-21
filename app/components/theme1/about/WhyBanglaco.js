import React from 'react';
// Note: You can use Lucide-React or FontAwesome for icons. 
// I'll use standard SVG paths that match the visual style.
import { Headphones, Plane, Briefcase, Tag } from 'lucide-react';

const FeatureCard = ({ Icon, title, description }) => (
  <div className="flex flex-col items-center text-center px-4">
    <div className="bg-[#EDF2F7] p-5 rounded-2xl mb-6">
      <Icon className="w-8 h-8 text-[#003580]" strokeWidth={1.5} />
    </div>
    <h3 className="text-[#1A202C] text-xl font-bold mb-3">{title}</h3>
    <p className="text-[#4A5568] text-sm leading-relaxed max-w-[250px]">
      {description}
    </p>
  </div>
);

const WhyBanglaco = () => {
  const features = [
    {
      Icon: Headphones,
      title: "24/7 Support",
      description: "Our dedicated concierge team is always one call away, no matter where in the world you are."
    },
    {
      Icon: Plane,
      title: "Best Airfare",
      description: "Access exclusive rates and premium cabins through our global airline network partnerships."
    },
    {
      Icon: Briefcase, // Using Briefcase icon for "Packages"
      title: "Tailor-made Packages",
      description: "No two journeys are the same. We craft your itinerary around your specific passions and pace."
    },
    {
      Icon: Tag,
      title: "Best Price Guarantee",
      description: "Luxury shouldn't be opaque. We ensure premium value through our exclusive global partnerships."
    }
  ];

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-[#003580] text-4xl md:text-5xl font-bold mb-6">
            Why Banglaco?
          </h2>
          <p className="text-[#4A5568] text-lg max-w-2xl mx-auto leading-relaxed">
            We provide a concierge-level service that prioritizes your comfort, safety, and curiosity at every step of the journey.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              Icon={feature.Icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBanglaco;