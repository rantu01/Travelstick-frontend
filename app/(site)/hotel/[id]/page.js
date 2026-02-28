"use client";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { CiLocationOn } from "react-icons/ci";
import { FiShare2, FiHeart } from "react-icons/fi";
import { useFetch } from "@/app/helper/hooks";
import { getAllPublicHotel } from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import Banner from "@/app/components/site/common/component/Banner";
import RoomSelection from "./RoomSelection";
import { FaCheck } from "react-icons/fa6";

const HotelDetails = () => {
  const params = useParams();
  const { id } = params;
  const { langCode } = useI18n();
  const [data, getData] = useFetch(getAllPublicHotel, {}, false);

  useEffect(() => {
    if (id) getData({ _id: id });
  }, [id, getData]);

  const hotelName = useMemo(() => {
    if (!data?.name) return "Blissful Heaven Residence at BTS Phromphong Emdistrict Shopping Area";
    if (typeof data.name === "object") return data.name?.[langCode] || data.name?.en || "Hotel Name";
    return data.name;
  }, [data, langCode]);

  const hotelAddress = useMemo(() => {
    if (!data?.destination) return "595/13, Sukhumvit road, Khlong Tan Nuea, Watthana, 10110 Bangkok, Thailand";
    const dest = data.destination;
    if (typeof dest === "string") return dest;
    if (typeof dest === "object") {
      if (typeof dest.name === "object") return dest.name?.[langCode] || dest.name?.en;
      return dest.name || dest.address;
    }
    return "Unknown location";
  }, [data, langCode]);

  return (
    <div className="bg-white min-h-screen pb-20 font-sans text-[#1a1a1a]">
      <Banner title="Hotel Details" />

      <div className="max-w-6xl mx-auto mt-6">

        {/* Top Actions & Breadcrumb Style */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#8E8E8E] text-white text-[10px] px-1 rounded-sm uppercase font-bold">Hotel</span>
              <div className="flex text-yellow-400 text-xs">★★★★</div>
            </div>
            <h1 className="text-[24px] font-bold leading-tight">{hotelName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <FiHeart className="text-[#006ce4] cursor-pointer" size={22} />
            <FiShare2 className="text-[#006ce4] cursor-pointer" size={22} />
            <button className="bg-[#006ce4] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-[#005bb8]">
              Reserve
            </button>
          </div>
        </div>


        {/* Address Section */}
        <div className="flex items-center gap-1 mb-4 text-[14px]">
          <CiLocationOn className="text-[#006ce4] font-bold" />
          <p className="text-[#006ce4] underline cursor-pointer font-medium">{hotelAddress}</p>
          <span className="text-[#006ce4] cursor-pointer ml-1">— Great location - show map</span>
        </div>

        {/* IMAGE + SIDEBAR SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* LEFT IMAGE AREA */}
          <div className="lg:col-span-2">

            {/* Image Grid */}
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[450px] overflow-hidden rounded-lg">

              {/* বড় ছবি */}
              <div className="col-span-2 row-span-2">
                <img
                  src={data?.banner_image || "https://cf.bstatic.com/xdata/images/hotel/max1024x768/531435345.jpg"}
                  className="w-full h-full object-cover rounded-l-lg"
                />
              </div>

              {/* ছোট ছবি ১ */}
              <div>
                <img
                  src={data?.images?.[0] || "https://cf.bstatic.com/xdata/images/hotel/max1024x768/531435255.jpg"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* ছোট ছবি ২ */}
              <div>
                <img
                  src={data?.images?.[1] || "https://cf.bstatic.com/xdata/images/hotel/max1024x768/531435352.jpg"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* ছোট ছবি ৩ */}
              <div>
                <img
                  src={data?.images?.[2] || "https://cf.bstatic.com/xdata/images/hotel/max1024x768/531435348.jpg"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* ছোট ছবি ৪ (নতুন যোগ) */}
              <div className="relative">
                <img
                  src={data?.images?.[3] || "https://img.freepik.com/free-photo/modern-living-room-style_53876-144814.jpg?semt=ais_rp_progressive&w=740&q=80"}
                  className="w-full h-full object-cover rounded-br-lg"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold">
                  +{data?.images?.length || 42} photos
                </div>
              </div>

            </div>

            {/* Thumbnail Row */}
            <div className="grid grid-cols-6 gap-2 mt-2 h-24">
              <img src="https://img.freepik.com/free-photo/modern-living-room-style_53876-144814.jpg?semt=ais_rp_progressive&w=740&q=80" className="w-full h-full object-cover rounded" />
              <img src="https://img.freepik.com/free-photo/modern-living-room-style_53876-144814.jpg?semt=ais_rp_progressive&w=740&q=80" className="w-full h-full object-cover rounded" />
              <img src="https://img.freepik.com/free-photo/modern-living-room-style_53876-144814.jpg?semt=ais_rp_progressive&w=740&q=80" className="w-full h-full object-cover rounded" />
              <img src="https://img.freepik.com/free-photo/modern-living-room-style_53876-144814.jpg?semt=ais_rp_progressive&w=740&q=80" className="w-full h-full object-cover rounded" />
              <img src="https://img.freepik.com/free-photo/modern-living-room-style_53876-144814.jpg?semt=ais_rp_progressive&w=740&q=80" className="w-full h-full object-cover rounded" />
              <div className="relative">
                <img src="https://img.freepik.com/free-photo/modern-living-room-style_53876-144814.jpg?semt=ais_rp_progressive&w=740&q=80" className="w-full h-full object-cover rounded" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                  +42 photos
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-4">

            {/* Review Card */}
            <div className="border rounded-lg p-4">

              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-bold">Very good</p>
                  <p className="text-xs text-gray-500">7 reviews</p>
                </div>
                <div className="bg-[#003580] text-white px-2 py-1 rounded">
                  8.1
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-2">
                “The location was in the very heart of where you want to be.
                Step outside for shops, restaurants...”
              </p>

              <div className="flex items-center gap-2 mt-3">
                <div className="w-6 h-6 rounded-full bg-green-700 text-white flex items-center justify-center text-xs">
                  J
                </div>
                <span className="text-xs font-medium">John 🇬🇧 United Kingdom</span>
              </div>

            </div>

            {/* Location Card */}
            <div className="border rounded-lg p-4">

              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">Great location!</p>
                <div className="border px-2 py-1 rounded text-sm">8.9</div>
              </div>

              <img
                src="https://maps.googleapis.com/maps/api/staticmap?center=23.81,90.41&zoom=13&size=400x200&markers=color:blue%7C23.81,90.41"
                className="w-full rounded mb-3"
              />

              <button className="w-full bg-[#006ce4] text-white py-2 rounded font-semibold hover:bg-[#005bb8]">
                Show on map
              </button>

            </div>

          </div>

        </div>

        {/* Property Info + Sidebar Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-6">

            {/* About Property */}
            <div>
              <h2 className="text-lg font-bold mb-3">About this property</h2>

              <div className="space-y-4 text-[14px] text-gray-700 leading-relaxed">

                <div>
                  <h3 className="font-semibold">Comfortable Accommodations:</h3>
                  <p>
                    {data?.description ||
                      "Blissful Heaven Residence offers family rooms with air-conditioning, private bathrooms, and balconies. Each room includes a kitchenette, terrace, and free WiFi."}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Convenient Facilities:</h3>
                  <p>
                    Guests benefit from free WiFi, daily housekeeping, express check-in and check-out, and paid on-site parking.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Prime Location:</h3>
                  <p>
                    Located near shopping malls, embassies and key attractions with easy transport access.
                  </p>
                </div>

              </div>
            </div>

            {/* Most Popular Facilities */}
            <div>
              <h2 className="text-lg font-bold mb-3">Most popular facilities</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[14px]">

                {[
                  "Non-smoking rooms",
                  "Parking on site",
                  "Free WiFi",
                  "Family rooms",
                  "Air conditioning",
                  "Daily housekeeping"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FaCheck className="text-green-600" />
                    <span>{item}</span>
                  </div>
                ))}

              </div>
            </div>

          </div>


          {/* RIGHT SIDEBAR */}
          <div className="bg-[#f0f6ff] p-5 rounded-lg border h-fit">

            <h3 className="font-bold mb-4">Property highlights</h3>

            <div className="space-y-4 text-[14px]">

              <div>
                <p className="font-semibold">Perfect for a 1-night stay!</p>
                <p className="text-gray-600">Top location: Highly rated by recent guests</p>
              </div>

              <div>
                <p className="font-semibold mb-1">Rooms with:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Terrace</li>
                  <li>• City view</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold">Parking available at the hotel</p>
              </div>

              <button className="w-full mt-4 bg-[#006ce4] hover:bg-[#005bb8] text-white py-2 rounded-md font-semibold">
                Reserve
              </button>

            </div>

          </div>

        </div>


        {/* Room Selection Section */}
        <RoomSelection />

      </div>
    </div>
  );
};

export default HotelDetails;