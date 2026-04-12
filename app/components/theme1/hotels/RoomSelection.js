"use client";
import React, { useEffect, useState } from 'react';
import { ShowerHead, Wind, Construction, Bath, Plus, Minus, Wifi, Tv, GlassWater, Coffee, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useFetch } from "@/app/helper/hooks";
import { getRoomsByHotel, getRoomAvailability } from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";

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
  const { formatPrice } = useCurrency();
  const params = useParams();
  const hotelId = params?.id;

  const [rooms, getRooms, { loading }] = useFetch(getRoomsByHotel, { hotelId }, false);
  // availability: { [roomId]: { total, booked, available } }
  const [availability, setAvailability] = useState({});

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

  // Fetch availability for each room after rooms load
  useEffect(() => {
    if (!rooms || rooms.length === 0) return;
    const fetchAll = async () => {
      const entries = await Promise.all(
        rooms.map(async (room) => {
          try {
            const res = await getRoomAvailability({ id: room._id });
            return [room._id, res?.data ?? { total: 1, booked: 0, available: 1 }];
          } catch {
            return [room._id, { total: 1, booked: 0, available: 1 }];
          }
        })
      );
      setAvailability(Object.fromEntries(entries));
    };
    fetchAll();
  }, [rooms]);

  const [roomCounts, setRoomCounts] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    if (showModal) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showModal]);

  const handleCountChange = (id, delta) => {
    const avail = availability[id]?.available ?? Infinity;
    setRoomCounts(prev => {
      const current = prev[id] || 1;
      const next = current + delta;
      if (next < 1) return { ...prev, [id]: 1 };
      if (next > avail) return prev; // block exceeding availability
      return { ...prev, [id]: next };
    });
  };

  if (loading) {
    return <div className="p-6 text-center">Loading rooms...</div>;
  }

  if (!rooms || rooms.length === 0) {
    return <div className="p-6 text-center">No rooms available for this hotel.</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6 rounded-xl">
      <h2 className="text-2xl font-bold self-start max-w-6xl w-full mx-auto">Select your room</h2>

      {rooms.map((room) => {
        const count = roomCounts[room._id] || 1;
        const roomName = room.name?.[langCode] || room.name?.en || room.type || "Room";
        const totalCapacity = (room.capacity?.adults || 0) + (room.capacity?.children || 0);
        const avail = availability[room._id];
        const availableCount = avail?.available ?? null;
        const isMaxed = availableCount !== null && count >= availableCount;
        const isUnavailable = availableCount !== null && availableCount <= 0;

        return (
          <div key={room._id} className="w-full max-w-6xl bg-white border border-gray-300 rounded-[20px] overflow-hidden flex flex-col md:flex-row p-4 gap-4 shadow-sm font-sans mb-6">

            {/* Left: Image Section */}
            <div className="md:w-[240px] w-full shrink-0">
              <img
                src={getImageUrl(room.images?.[0])}
                alt={roomName}
                onClick={() => { setSelectedRoom(room); setShowModal(true); }}
                className="w-full h-full min-h-[180px] object-cover rounded-lg cursor-pointer"
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
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center border border-gray-400 rounded-lg overflow-hidden h-[40px] bg-white">
                      <button
                        onClick={() => handleCountChange(room._id, 1)}
                        disabled={isMaxed || isUnavailable}
                        className="px-3 hover:bg-gray-100 border-r border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={14} />
                      </button>
                      <div className="px-4 font-bold text-md min-w-[45px] text-center">
                        {count < 10 ? `0${count}` : count}
                      </div>
                      <button
                        onClick={() => handleCountChange(room._id, -1)}
                        disabled={count <= 1}
                        className="px-3 hover:bg-gray-100 border-l border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                    {availableCount !== null && (
                      isUnavailable ? (
                        <span className="text-[11px] font-bold text-red-600">No rooms available</span>
                      ) : isMaxed ? (
                        <span className="text-[11px] font-bold text-orange-500">Max {availableCount} room{availableCount > 1 ? 's' : ''} left</span>
                      ) : (
                        <span className="text-[11px] text-gray-500">{availableCount} available</span>
                      )
                    )}
                  </div>

                  {/* Book Now Button */}
                  {isUnavailable ? (
                    <button disabled className="bg-gray-400 cursor-not-allowed text-white px-8 py-2.5 rounded-lg text-[16px] font-bold shadow-sm opacity-60">
                      Sold Out
                    </button>
                  ) : (
                    <Link href={`/hotel/${hotelId}/booking?room=${room._id}&count=${count}`}>
                      <button className="bg-[#1e3a8a] hover:bg-[#172554] text-white px-8 py-2.5 rounded-lg text-[16px] font-bold transition-all shadow-sm">
                        Book Now
                      </button>
                    </Link>
                  )}
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

      {/* Modal: image on top, details below */}
      {showModal && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center pt-6 md:pt-24 p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative max-w-3xl w-full mx-2 sm:mx-6 bg-white rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 scale-100 animate-in fade-in zoom-in max-h-[90vh] md:max-h-[80vh] overflow-y-auto">

            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 z-20 bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Section */}
            <div className="relative w-full bg-gray-100">
              <img
                src={getImageUrl(selectedRoom.images?.[0])}
                alt={selectedRoom.name?.[langCode] || selectedRoom.name?.en || 'Room image'}
                className="w-full h-48 md:h-56 lg:h-64 object-cover cursor-pointer"
              />
              {/* Image overlay gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8">
              {/* Title and Price Row */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {selectedRoom.name?.[langCode] || selectedRoom.name?.en || 'Room'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {selectedRoom.size}
                    </span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {selectedRoom.bed_type}
                    </span>
                  </div>
                </div>

                <div className="text-right bg-gradient-to-r from-[#1a4fa0]/5 to-transparent px-4 py-2 rounded-lg">
                  <div className="text-3xl font-bold text-[#1a4fa0]">{formatPrice(selectedRoom.price?.amount || 0)}</div>
                  <div className="text-sm text-gray-500">Per night before taxes</div>
                </div>
              </div>

              {/* Capacity & Room Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1a4fa0]/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#1a4fa0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Adults</div>
                    <div className="font-semibold">{selectedRoom.capacity?.adults || 0}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1a4fa0]/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#1a4fa0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Children</div>
                    <div className="font-semibold">{selectedRoom.capacity?.children || 0}</div>
                  </div>
                </div>
                {typeof selectedRoom.total_rooms !== 'undefined' && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1a4fa0]/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#1a4fa0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Total Rooms</div>
                      <div className="font-semibold">{selectedRoom.total_rooms}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Meal Plan & Refundability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {selectedRoom.meal_plan && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                    <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-xs text-green-600 uppercase font-semibold">Meal Plan</div>
                      <div className="font-medium text-gray-800">{selectedRoom.meal_plan}</div>
                    </div>
                  </div>
                )}

                {selectedRoom.refundability && (
                  <div className={`flex items-start gap-3 p-3 rounded-lg border ${selectedRoom.refundability.toLowerCase().includes('free') ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'}`}>
                    <svg className={`w-5 h-5 mt-0.5 ${selectedRoom.refundability.toLowerCase().includes('free') ? 'text-green-600' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-xs text-gray-600 uppercase font-semibold">Refundability</div>
                      <div className="font-medium text-gray-800">{selectedRoom.refundability}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-[#1a4fa0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <strong className="text-gray-900 text-lg">Amenities & Features</strong>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(selectedRoom.amenities && selectedRoom.amenities.length > 0) ? (
                    selectedRoom.amenities.map((a, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <AmenityIcon amenity={a} />
                        </div>
                        <span className="text-gray-700">{a}</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      No amenities listed
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <Link href={`/hotel/${hotelId}/booking?room=${selectedRoom._id}&count=1`}>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-[#1a4fa0] hover:bg-[#0e3a7a] text-white px-8 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Book Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomSelection;