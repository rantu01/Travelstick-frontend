"use client";
import React from 'react';
import { FaCheck } from 'react-icons/fa';

const RoomSelection = () => {
  const rooms = [
    {
      id: 1,
      type: "Standard Double Room",
      size: "20 m²",
      sleeps: "2 adults",
      bed: "1 double bed",
      price: 23,
      oldPrice: 28,
      discount: "17%",
      image: "https://img.freepik.com/free-photo/modern-living-room-style_53876-144814.jpg?semt=ais_rp_progressive&w=740&q=80"
    },
    {
      id: 2,
      type: "Deluxe Double Room",
      size: "20 m²",
      sleeps: "2 adults",
      bed: "1 double bed",
      price: 23,
      oldPrice: 38,
      discount: "37%",
      image: "https://img.freepik.com/free-photo/modern-living-room-style_53876-144814.jpg?semt=ais_rp_progressive&w=740&q=80"
    },
    {
      id: 3,
      type: "Standard Triple Room",
      size: "23 m²",
      sleeps: "3 adults",
      bed: "1 single bed and 1 double bed",
      price: 26,
      oldPrice: 35,
      discount: "25%",
      image: "https://img.freepik.com/free-photo/modern-living-room-style_53876-144814.jpg?semt=ais_rp_progressive&w=740&q=80"
    },
  ];

  return (
    <div className="mt-8 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Select your room</h2>

      <div className="space-y-4">
        {rooms.map((room) => (
          <div key={room.id} className="flex flex-col md:flex-row border border-gray-200 rounded shadow-sm overflow-hidden hover:shadow-md">
            
            {/* Left Image */}
            <div className="md:w-1/4 w-full">
              <img src={room.image} alt={room.type} className="w-full h-full object-cover"/>
            </div>

            {/* Room Details */}
            <div className="md:w-3/4 w-full flex flex-col md:flex-row justify-between p-4 bg-white">
              
              {/* Left Info */}
              <div className="md:w-1/2 space-y-2">
                <h3 className="text-blue-600 font-bold underline text-sm cursor-pointer">{room.type}</h3>
                <p className="text-xs text-gray-500">{room.size} • Max {room.sleeps} • {room.bed}</p>
                <div className="mt-2 text-xs text-gray-600 space-y-1">
                  <p className="flex items-center gap-1"><FaCheck size={10}/> Private bathroom</p>
                  <p className="flex items-center gap-1"><FaCheck size={10}/> Air conditioning</p>
                  <p className="flex items-center gap-1"><FaCheck size={10}/> Balcony/terrace</p>
                </div>
              </div>

              {/* Middle Options */}
              <div className="md:w-1/4 mt-4 md:mt-0 text-xs space-y-1">
                <p className="text-green-700 font-bold flex items-center gap-1"><FaCheck size={12}/> Breakfast Included</p>
                <p className="text-green-700 font-bold flex items-center gap-1"><FaCheck size={12}/> Free Cancellation</p>
                <p className="text-gray-600 flex items-center gap-1"><FaCheck size={12}/> Book without credit card</p>
              </div>

              {/* Price & Action */}
              <div className="md:w-1/4 mt-4 md:mt-0 flex flex-col items-end justify-between">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 line-through text-[10px]">USD {room.oldPrice}</span>
                    <span className="text-red-600 font-bold text-[10px]">-{room.discount}</span>
                  </div>
                  <div className="text-lg font-bold text-black">USD {room.price}</div>
                  <p className="text-[9px] text-gray-500">Per night before taxes</p>
                </div>

                <div className="mt-2 flex flex-col items-end gap-1">
                  <select className="border border-gray-300 p-1 rounded text-xs">
                    <option>1 room</option>
                    <option>2 rooms</option>
                  </select>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm font-bold shadow-sm mt-1">
                    Book <br/>
                    <span className="text-[10px] font-normal italic">Pay at hotel</span>
                  </button>
                  <p className="text-green-700 text-[10px] font-bold mt-1">FREE Cancellation</p>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomSelection;