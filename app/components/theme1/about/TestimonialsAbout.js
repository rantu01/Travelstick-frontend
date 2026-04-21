import React from 'react';
import { Star } from 'lucide-react';

const testimonialsData = [
  {
    name: "James Henderson",
    location: "London, UK",
    text: '"An absolutely flawless experience from start to finish. The attention to detail in our Patagonia itinerary was remarkable."',
  },
  {
    name: "Sarah Miller",
    location: "New York, USA",
    text: '"The \'Best Airfare\' promise is real. They saved us thousands on business class seats to Tokyo while providing concierge support."',
  },
  {
    name: "David Chen",
    location: "Singapore",
    text: '"Expert guides who truly know the soul of the city. We saw sides of Rome that most tourists never even hear about."',
  },
  {
    name: "Isabella Rossi",
    location: "Milan, Italy",
    text: '"Banglaco redefined luxury for us. It wasn\'t about gold taps; it was about genuine connection and peace of mind."',
  },
  {
    name: "Robert Waugh",
    location: "Sydney, Australia",
    text: '"The safari was magical. Every camp was perfectly chosen for its ethical practices and incredible wildlife access."',
  },
  {
    name: "Elena Petrova",
    location: "Berlin, Germany",
    text: '"Professional, discrete, and incredibly efficient. Our corporate retreat was a massive success thanks to their team."',
  },
  {
    name: "Marcus Thorne",
    location: "Toronto, Canada",
    text: '"A truly bespoke adventure. They listened to our weird requests and turned them into a seamless reality in Iceland."',
  },
  {
    name: "Sophia G.",
    location: "Dubai, UAE",
    text: '"The 24/7 support was a lifesaver when our flight was delayed. They had us rebooked before we even landed."',
  }
];

const TestimonialsAbout = () => {
  return (
    <section className="bg-white py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h4 className="text-[#B4975A] font-bold text-xs tracking-widest uppercase mb-4">
          Testimonials
        </h4>
        <h2 className="text-[#002D72] text-4xl md:text-5xl font-bold">
          Voices of Our Voyagers
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonialsData.map((item, index) => (
          <div 
            key={index} 
            className="bg-[#F8F9FA] p-8 rounded-xl border border-gray-100 flex flex-col justify-between"
          >
            <div>
              {/* Star Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-[#B4975A] text-[#B4975A]" />
                ))}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                {item.text}
              </p>
            </div>

            {/* Author Info */}
            <div className="text-left">
              <h5 className="text-[#002D72] font-bold text-sm">
                {item.name}
              </h5>
              <p className="text-gray-400 text-xs mt-1">
                {item.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsAbout;