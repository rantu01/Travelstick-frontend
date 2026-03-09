"use client";
import React, { useEffect, useState } from 'react';
import { ShowerHead, Wind, Construction, Bath, Plus, Minus, Wifi, Tv, GlassWater, Coffee, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useFetch } from "@/app/helper/hooks";
import { getRoomsByHotel } from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site"; // Import useCurrency

const AmenityIcon = ({ amenity, size = 20 }) => {
  const iconMap = {
    "Free WiFi": <Wifi size={size} className="text-gray-600" />,
    "Air Conditioning": <Wind size={size} className="text-gray-600" />,
    "Private Bathroom": <Bath size={size} className="text-gray-600" />,
    "Flat-screen TV": <Tv size={size} className="text-gray-600" />,
    "Balcony/Terrace": <Construction size={size} className="text-gray-600" />,
    "Mini Bar": <GlassWater size={size} className="text-gray-600" />,
    "Coffee Machine": <Coffee size={size} className="text-gray-600" />,
    "Safe Box": <Lock size={size} className="text-gray-600" />,
    "Ironing Facilities": <CheckCircle size={size} className="text-gray-600" />,
    "Electric Kettle": <Coffee size={size} className="text-gray-600" />,
  };

  return iconMap[amenity] || <Bath size={size} className="text-gray-600" />;
};

const RoomSelection = () => {
  const { langCode } = useI18n();
  const { formatPrice } = useCurrency(); // Use formatPrice from context
  const params = useParams();
  const hotelId = params?.id;

  const [rooms, getRooms, { loading }] = useFetch(getRoomsByHotel, { hotelId }, false);

  const getImageUrl = (image) => {
    if (!image) return "/placeholder-room.jpg";
    const url = typeof image === 'string' ? image : image?.url;
    if (!url) return "/placeholder-room.jpg";

    if (url.startsWith('http')) return url;

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    return `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/${url.startsWith('/') ? url.slice(1) : url}`;
  };

  useEffect(() => {
    if (hotelId) {
      getRooms({ hotelId });
    }
  }, [hotelId]);

  const [roomCounts, setRoomCounts] = useState({});

  const handleCountChange = (id, delta) => {
    setRoomCounts(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 1) + delta)
    }));
  };

  if (loading) {
    return <div className="p-6 text-center">Loading rooms...</div>;
  }

  if (!rooms || rooms.length === 0) {
    return <div className="p-6 text-center">No rooms available for this hotel.</div>;
  }

  return (
    <div className="p-6 bg-gray-50  flex flex-col items-center gap-6 rounded-xl">
      <h2 className="text-2xl font-bold self-start max-w-6xl w-full mx-auto">Select your room</h2>

      {rooms.map((room) => {
        const count = roomCounts[room._id] || 1;
        const roomName = room.name?.[langCode] || room.name?.en || room.type || "Room";
        const totalCapacity = (room.capacity?.adults || 0) + (room.capacity?.children || 0);

        return (
          <div key={room._id} className="w-full max-w-6xl bg-white border border-gray-300 rounded-[20px] overflow-hidden flex flex-col md:flex-row p-4 gap-4 shadow-sm font-sans mb-6">

            {/* Left: Image Section */}
            <div className="md:w-[240px] w-full shrink-0">
              <img
                src={getImageUrl(room.images?.[0])}
                alt={roomName}
                className="w-full h-full min-h-[180px] object-cover rounded-lg"
              />
            </div>

            {/* Right: Content Section */}
            <div className="flex-1">
              {/* Header Row: Title and Top Action Bar */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h2 className="text-[28px] md:text-[32px] font-bold text-black leading-tight">
                    {roomName}
                  </h2>
                  <p className="text-[14px] font-semibold text-gray-700 mt-1">
                    {room.size} | Max {totalCapacity} Persons | {room.bed_type}
                  </p>
                </div>

                {/* Price, Counter & Button - Exact Image Layout */}
                <div className="flex items-center gap-6 self-end md:self-start">
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* formatPrice used here */}
                      <span className="text-[22px] font-bold text-gray-800">
                        {formatPrice(room.price?.amount || 0)}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 -mt-1 whitespace-nowrap">Per night before taxes</p>
                  </div>

                  {/* Counter Input */}
                  <div className="flex items-center border border-gray-400 rounded-lg overflow-hidden h-[40px] bg-white">
                    <button
                      onClick={() => handleCountChange(room._id, 1)}
                      className="px-3 hover:bg-gray-100 border-r border-gray-400"
                    >
                      <Plus size={14} />
                    </button>
                    <div className="px-4 font-bold text-md min-w-[45px] text-center">
                      {count < 10 ? `0${count}` : count}
                    </div>
                    <button
                      onClick={() => handleCountChange(room._id, -1)}
                      className="px-3 hover:bg-gray-100 border-l border-gray-400"
                    >
                      <Minus size={14} />
                    </button>
                  </div>

                  {/* Book Now Button */}
                  <Link href={`/hotel/${hotelId}/booking?room=${room._id}&count=${count}`}>
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
                  {room.amenities && room.amenities.length > 0 ? (
                    room.amenities.slice(0, 4).map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                        <AmenityIcon amenity={amenity} />
                        <span className="text-[15px]">{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center gap-3 text-gray-700 font-medium">
                        <AmenityIcon amenity="Private Bathroom" />
                        <span className="text-[15px]">Private bathroom</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 font-medium">
                        <AmenityIcon amenity="Air Conditioning" />
                        <span className="text-[15px]">Air conditioning</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 font-medium">
                        <AmenityIcon amenity="Balcony/Terrace" />
                        <span className="text-[15px]">Balcony/terrace</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 font-medium">
                        <ShowerHead size={20} className="text-gray-600" />
                        <span className="text-[15px]">Shower</span>
                      </div>
                    </>
                  )}
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
        );
      })}
    </div>
  );
};

export default RoomSelection;