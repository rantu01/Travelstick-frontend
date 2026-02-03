"use client";
import { useState } from "react";
import { MdFlight, MdHotel, MdDescription, MdOutlineWbSunny } from "react-icons/md";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { DatePicker } from "antd";
import { useRouter } from "next/navigation";
import { useI18n } from "@/app/contexts/i18n";
import { useFetch } from "@/app/helper/hooks";
import { getHeroFilterData } from "@/app/helper/backend";

const HeroFilters = () => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const router = useRouter();

  const [tab, setTab] = useState("flight");
  const [destination, setDestination] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [filterData] = useFetch(getHeroFilterData);

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (destination) query.append("destination", destination);
    if (startDate) query.append("startDate", startDate);

    let targetRoute = tab;
    if (tab === "holiday") targetRoute = "package";

    router.push(`/${targetRoute}?${query.toString()}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Tab Navigation */}
      <div className="flex justify-center relative z-20 -mb-4">
        <div className="bg-white rounded-t-xl shadow-sm flex border-x border-t border-gray-100 overflow-hidden">
          <TabButton active={tab === "flight"} onClick={() => setTab("flight")} icon={<MdFlight size={20} className="rotate-45" />} label="Flight" />
          <TabButton active={tab === "hotel"} onClick={() => setTab("hotel")} icon={<MdHotel size={20} />} label="Hotel" />
          <TabButton active={tab === "holiday"} onClick={() => setTab("holiday")} icon={<MdOutlineWbSunny size={20} />} label="Holiday" />
          <TabButton active={tab === "visa"} onClick={() => setTab("visa")} icon={<MdDescription size={20} />} label="Visa" />
        </div>
      </div>

      {/* Main Search Box */}
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 w-full relative z-10 border border-gray-50">

        {tab === "flight" && (
          <div className="flex gap-4 mb-6">
            <TripType label="One Way" name="flight_trip" defaultChecked />
            <TripType label="Round Trip" name="flight_trip" />
            <TripType label="Multi City" name="flight_trip" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">

          {/* Destination Section */}
          <div className={`${tab === "hotel" ? "lg:col-span-4" : tab === "holiday" ? "lg:col-span-6" : "lg:col-span-5"} border rounded-xl overflow-hidden`}>
            <div className="p-3 hover:bg-gray-50 transition-all">
              <p className="text-[11px] text-gray-400 font-semibold uppercase">
                {tab === "hotel" || tab === "holiday" ? "Destination" : tab === "visa" ? "Travelling to" : "To"}
              </p>
              <select
                className="w-full font-bold text-base text-[#1A237E] bg-transparent outline-none appearance-none cursor-pointer"
                onChange={(e) => setDestination(e.target.value)}
              >
                <option value="">Dhaka, Bangladesh</option>
                {filterData?.find(i => i.key === "package_destination")?.values?.map(v => (
                  <option key={v._id} value={v._id}>{v.name}</option>
                ))}
              </select>
              <p className="text-[11px] text-gray-500">Select city or area</p>
            </div>
          </div>

          {/* Date & Guests Section */}
          <div className={`${tab === "hotel" ? "lg:col-span-6" : "lg:col-span-5"} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border rounded-xl overflow-hidden`}>
            {/* Check In */}
            <div className="p-3 border-r hover:bg-gray-50 transition-all">
              <p className="text-[11px] text-gray-400 font-semibold uppercase">Check In</p>
              <DatePicker
                variant="borderless"
                className="p-0 font-bold text-[#1A237E] w-full"
                placeholder="05 Feb, 2026"
                onChange={(d, s) => setStartDate(s)}
              />
            </div>

            {/* Check Out */}
            <div className="p-3 border-r hover:bg-gray-50 transition-all">
              <p className="text-[11px] text-gray-400 font-semibold uppercase">Check Out</p>
              <DatePicker
                variant="borderless"
                className="p-0 font-bold text-[#1A237E] w-full"
                placeholder="05 Feb, 2026"
                onChange={(d, s) => setEndDate(s)}
              />
            </div>

            {/* Room & Guests - Only show when Hotel is active */}
            <div className="p-3 hover:bg-gray-50 transition-all md:col-span-2 lg:col-span-1 border-t md:border-t-0">
              <p className="text-[11px] text-gray-400 font-semibold uppercase">Room & Guests</p>
              <h3 className="font-bold text-base text-[#1A237E]">1 Room, @ Adults, 1 Child</h3>
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:col-span-2">
            <button
              onClick={handleSearch}
              className="w-full bg-[#1A237E] hover:bg-blue-900 text-white h-full min-h-[60px] rounded-xl flex items-center justify-center transition-all shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TripType = ({ label, name, defaultChecked }) => (
  <label className="flex items-center gap-2 cursor-pointer group">
    <div className="relative flex items-center justify-center">
      <input type="radio" name={name} defaultChecked={defaultChecked} className="peer appearance-none w-4 h-4 border-2 border-gray-300 rounded-full checked:border-blue-500 transition-all" />
      <div className="absolute w-2 h-2 bg-blue-500 rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
    </div>
    <span className="text-xs font-bold text-gray-600 group-hover:text-blue-500">{label}</span>
  </label>
);

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 transition-all border-b-2 font-bold text-sm ${active
        ? "bg-[#E3F2FD] text-blue-600 border-blue-500"
        : "bg-white text-gray-500 border-transparent hover:bg-gray-50"
      }`}
  >
    <span className={active ? "text-blue-600" : "text-gray-400"}>{icon}</span>
    <span>{label}</span>
  </button>
);

export default HeroFilters;