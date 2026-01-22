"use client";
import { useState } from "react";
import { MdFlight, MdHotel, MdDescription, MdOutlineWbSunny } from "react-icons/md";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { DatePicker, message } from "antd";
import { useRouter } from "next/navigation";
import { useI18n } from "@/app/contexts/i18n";
import { useFetch } from "@/app/helper/hooks";
import { getHeroFilterData } from "@/app/helper/backend";

const HeroFilters = () => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const router = useRouter();
  const [tab, setTab] = useState("tour"); // Maps to "Flight" in visual logic
  
  // States
  const [destination, setDestination] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [filterData] = useFetch(getHeroFilterData);

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (destination) query.append("destination", destination);
    if (startDate) query.append("startDate", startDate);
    
    // Redirect based on active tab
    router.push(`/${tab === "tour" ? "package" : tab}?${query.toString()}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tab Navigation (The floating small bar) */}
      <div className="flex justify-center relative z-20">
        <div className="bg-white rounded-xl shadow-xl flex p-1 border border-gray-100">
          <TabButton 
            active={tab === "tour"} 
            onClick={() => setTab("tour")} 
            icon={<MdFlight size={20} />} 
            label="Flight" // Backend uses "tour"
          />
          <TabButton 
            active={tab === "hotel"} 
            onClick={() => setTab("hotel")} 
            icon={<MdHotel size={20} />} 
            label="Hotel" 
          />
          <TabButton 
            active={tab === "visa"} 
            onClick={() => setTab("visa")} 
            icon={<MdDescription size={20} />} 
            label="Visa" 
          />
          <TabButton 
            active={tab === "holiday"} 
            onClick={() => setTab("holiday")} 
            icon={<MdOutlineWbSunny size={20} />} 
            label="Holiday" 
          />
        </div>
      </div>

      {/* Search Content Card */}
      <div className="bg-white rounded-[24px] shadow-2xl p-8 pt-12 w-full">
        {/* Mini Radio Selectors (Trip Type) */}
        <div className="flex gap-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600">
            <input type="radio" name="trip" defaultChecked className="accent-primary" /> Round Trip
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600">
            <input type="radio" name="trip" className="accent-primary" /> One Way
          </label>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          
          {/* FROM / TO Logic (Mapped to Destination in backend) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-2 relative">
            <div className="border rounded-lg p-3 hover:border-primary transition-colors">
              <p className="text-[10px] uppercase text-gray-400 font-bold">From</p>
              <h3 className="font-bold text-lg">DAC</h3>
              <p className="text-[11px] text-gray-500 truncate">Dhaka, Bangladesh</p>
            </div>
            
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border rounded-md p-1 shadow-md z-10">
              <HiOutlineSwitchHorizontal className="text-primary" />
            </div>

            <div className="border rounded-lg p-3 hover:border-primary transition-colors">
              <p className="text-[10px] uppercase text-gray-400 font-bold">To</p>
              <select 
                className="w-full font-bold text-lg bg-transparent outline-none appearance-none"
                onChange={(e) => setDestination(e.target.value)}
              >
                <option value="">Select</option>
                {filterData?.find(i => i.key === "package_destination")?.values?.map(v => (
                  <option key={v._id} value={v._id}>{v.name}</option>
                ))}
              </select>
              <p className="text-[11px] text-gray-500">Destination</p>
            </div>
          </div>

          {/* DATES */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-2">
            <div className="border rounded-lg p-3">
              <p className="text-[10px] uppercase text-gray-400 font-bold">Departure</p>
              <DatePicker 
                variant="borderless" 
                className="p-0 font-bold" 
                onChange={(d, s) => setStartDate(s)}
              />
            </div>
            <div className="border rounded-lg p-3">
              <p className="text-[10px] uppercase text-gray-400 font-bold">Return</p>
              <DatePicker 
                variant="borderless" 
                className="p-0 font-bold"
                onChange={(d, s) => setEndDate(s)}
              />
            </div>
          </div>

          {/* SEARCH BUTTON */}
          <div className="lg:col-span-3">
            <button 
              onClick={handleSearch}
              className="w-full bg-[#1A237E] hover:bg-black text-white h-[60px] rounded-lg font-bold text-lg transition-all"
            >
              Search {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </div>

        </div>

        {/* Bottom Options (Student/Regular Fee) */}
        <div className="flex gap-6 mt-6">
           <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
              <input type="radio" name="fee" className="accent-primary" /> Regular Fee
           </label>
           <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
              <input type="radio" name="fee" defaultChecked className="accent-primary" /> Student Fee
           </label>
        </div>
      </div>
    </div>
  );
};

// Helper Sub-component for Tabs
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium ${
      active ? "bg-[#E3F2FD] text-primary" : "text-gray-500 hover:bg-gray-50"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default HeroFilters;