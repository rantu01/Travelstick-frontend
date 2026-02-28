import React from 'react';

const RoomList = ({ primaryColor }) => {
    // static data as per your image 2
    const rooms = [
        { id: 1, name: "Standard Double Room", price: 23, oldPrice: 28, discount: "-17%", size: "20 m²", capacity: "2 adults", beds: "1 double bed" },
        { id: 2, name: "Deluxe Double Room", price: 23, oldPrice: 37, discount: "-37%", size: "20 m²", capacity: "2 adults", beds: "1 double bed" },
        { id: 3, name: "Standard Triple Room", price: 26, oldPrice: 35, discount: "-25%", size: "23 m²", capacity: "3 adults", beds: "1 single bed and 1 double bed" },
    ];

    return (
        <div className="space-y-6">
            {rooms.map((room) => (
                <div key={room.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row">
                    {/* Room Photo & Basic Info */}
                    <div className="md:w-[30%] p-4 border-r border-gray-100">
                        <div className="relative rounded-lg overflow-hidden h-36 bg-gray-100 mb-3">
                            <img src="https://via.placeholder.com/400x300" alt="room" className="w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 bg-[#d4111e] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">Last 5 rooms!</span>
                        </div>
                        <h3 className="text-[#1a4fa0] font-bold text-lg hover:underline cursor-pointer leading-tight">{room.name}</h3>
                        <p className="text-[12px] text-gray-500 mt-1">{room.size} / {room.capacity} / {room.beds}</p>
                        <div className="mt-3 space-y-1 text-[13px] text-[#008009]">
                            <p className="flex items-center gap-1">✓ Private bathroom</p>
                            <p className="flex items-center gap-1">✓ Shower</p>
                            <p className="flex items-center gap-1">✓ Air conditioning</p>
                            <p className="flex items-center gap-1">✓ Balcony/terrace</p>
                        </div>
                    </div>

                    {/* Features Column */}
                    <div className="md:w-[35%] p-5 border-r border-gray-100 bg-[#f9fbff]">
                        <div className="space-y-2 text-[13px] font-semibold text-[#008009]">
                            <p className="flex items-center gap-2">🍽️ Breakfast Included</p>
                            <p className="flex items-center gap-2">✓ Free Cancellation</p>
                            <p className="flex items-center gap-2">✓ Book without credit card</p>
                            <p className="flex items-center gap-2">✓ Parking</p>
                            <p className="flex items-center gap-2">✓ Free WiFi</p>
                        </div>
                    </div>

                    {/* Pricing & Booking */}
                    <div className="md:w-[35%] p-5 flex flex-col items-center justify-center text-center">
                        <div className="mb-4">
                            <span className="text-[12px] text-gray-400 line-through">USD {room.oldPrice}</span>
                            <span className="ml-2 bg-[#d4111e] text-white text-[10px] px-1 rounded">{room.discount}</span>
                            <div className="text-3xl font-bold text-[#1a1a1a]">USD {room.price}</div>
                            <p className="text-[11px] text-gray-500">Per night before taxes</p>
                        </div>
                        <button 
                            className="w-full max-w-[180px] py-2.5 rounded-md text-white font-bold text-md mb-2 shadow-md transition-transform hover:scale-105"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Book <br/><span className="text-[11px] font-normal">Pay at hotel</span>
                        </button>
                        <p className="text-[#008009] text-[12px] font-bold uppercase tracking-tight">FREE Cancellation</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RoomList;