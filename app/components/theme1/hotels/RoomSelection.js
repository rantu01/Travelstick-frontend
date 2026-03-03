"use client";
import React, { useState } from 'react';
import { ShowerHead, Wind, Construction, Bath, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const RoomSelection = () => {
  const params = useParams();
  const hotelId = params?.id;

  // ২. ডিবাগিং এর জন্য কনসোলে চেক করে নিন আইডি আসছে কি না
  console.log("Current Hotel ID:", hotelId);

  // ১. এখানে আপনার সব রুমের ডেটা রাখা হয়েছে
  const [roomData, setRoomData] = useState([
    {
      id: 1,
      type: "Standard Double Room",
      size: "20 m²",
      sleeps: "2 adults",
      bed: "1 double bed",
      price: 5000,
      count: 1,
      image: "https://img.freepik.com/free-photo/modern-living-room-style_53876-144814.jpg"
    },
    {
      id: 2,
      type: "Deluxe Double Room",
      size: "25 m²",
      sleeps: "2 adults",
      bed: "1 king bed",
      price: 7500,
      count: 1,
      image: "https://img.freepik.com/free-photo/luxury-bedroom-suite-resort-high-rise-hotel-with-working-table_1150-10790.jpg"
    },
    {
      id: 3,
      type: "Standard Triple Room",
      size: "30 m²",
      sleeps: "3 adults",
      bed: "1 single and 1 double bed",
      price: 9000,
      count: 1,
      image: "https://img.freepik.com/free-photo/interior-hotel-bedroom_23-2148084981.jpg"
    }
  ]);

  // ২. রুমের সংখ্যা কমানো বা বাড়ানোর ফাংশন
  const handleCountChange = (id, delta) => {
    setRoomData(prevData =>
      prevData.map(room =>
        room.id === id
          ? { ...room, count: Math.max(0, room.count + delta) }
          : room
      )
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold self-start max-w-6xl w-full mx-auto">Select your room</h2>

      {roomData.map((room) => (
        <div key={room.id} className="w-full max-w-6xl bg-white border border-gray-300 rounded-[20px] overflow-hidden flex flex-col md:flex-row p-4 gap-4 shadow-sm font-sans mb-6">

          {/* Left: Image Section */}
          <div className="md:w-[240px] w-full shrink-0">
            <img
              src={room.image}
              alt={room.type}
              className="w-full h-full min-h-[180px] object-cover rounded-lg"
            />
          </div>

          {/* Right: Content Section */}
          <div className="flex-1">
            {/* Header Row: Title and Top Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-[28px] md:text-[32px] font-bold text-black leading-tight">
                  {room.type}
                </h2>
                <p className="text-[14px] font-semibold text-gray-700 mt-1">
                  {room.size} | Max {room.sleeps} | {room.bed}
                </p>
              </div>

              {/* Price, Counter & Button - Exact Image Layout */}
              <div className="flex items-center gap-6 self-end md:self-start">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-[22px] font-bold text-gray-800">{room.price} ৳</span>
                  </div>
                  <p className="text-[10px] text-gray-500 -mt-1 whitespace-nowrap">Per night before taxes</p>
                </div>

                {/* Counter Input */}
                <div className="flex items-center border border-gray-400 rounded-lg overflow-hidden h-[40px] bg-white">
                  <button
                    onClick={() => handleCountChange(room.id, 1)}
                    className="px-3 hover:bg-gray-100 border-r border-gray-400"
                  >
                    <Plus size={14} />
                  </button>
                  <div className="px-4 font-bold text-md min-w-[45px] text-center">
                    {room.count < 10 ? `0${room.count}` : room.count}
                  </div>
                  <button
                    onClick={() => handleCountChange(room.id, -1)}
                    className="px-3 hover:bg-gray-100 border-l border-gray-400"
                  >
                    <Minus size={14} />
                  </button>
                </div>

                {/* Book Now Button */}
                <Link href={`/hotel/${hotelId}/booking`}>
                  <button className="bg-[#1e3a8a] hover:bg-[#172554] text-white px-8 py-2.5 rounded-lg text-[16px] font-bold transition-all shadow-sm">
                    Book Now
                  </button>
                </Link>
              </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Details Row: Amenities and Benefits */}
            <div className="flex flex-col md:flex-row justify-between gap-6">
              {/* Column 1: Icons */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  <Bath size={20} className="text-gray-600" />
                  <span className="text-[15px]">Private bathroom</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  <Wind size={20} className="text-gray-600" />
                  <span className="text-[15px]">Air conditioning</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  <Construction size={20} className="text-gray-600" />
                  <span className="text-[15px]">Balcony/terrace</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                  <ShowerHead size={20} className="text-gray-600" />
                  <span className="text-[15px]">Shower</span>
                </div>
              </div>

              {/* Column 2: Green Checkmarks */}
              <div className="space-y-2">
                {["Breakfast Included", "Free Cancellation", "Book without credit Card", "Parking"].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-[#10a310]">
                    <span className="text-[18px] font-bold italic">✓</span>
                    <span className="text-[15px] font-bold">{item}</span>
                  </div>
                ))}
              </div>

              {/* Placeholder for spacing alignment */}
              <div className="hidden md:block w-32"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomSelection;