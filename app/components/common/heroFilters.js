"use client";
import { useState } from "react";
import { FaPlane, FaHotel, FaUmbrellaBeach, FaPassport, FaSearch, FaExchangeAlt, FaMinus, FaPlus } from "react-icons/fa";
import { DatePicker, message, Popover } from "antd"; 
import { useRouter } from "next/navigation";
import { useI18n } from "@/app/contexts/i18n";
import { useFetch } from "@/app/helper/hooks";
import { getHeroFilterData } from "@/app/helper/backend";

const HeroFilters = () => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const router = useRouter();

  const [tab, setTab] = useState("flight");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [destination, setDestination] = useState(null);
  const [fromLocation, setFromLocation] = useState(null); // Added for flight
  const [tourType, setTourType] = useState(null);
  const [hotelType, setHotelType] = useState(null);
  const [reputation, setReputation] = useState(null);
  const [visaType, setVisaType] = useState(null);
  const [visaMode, setVisaMode] = useState(null);
  const [country, setCountry] = useState(null);
  const [validity, setValidity] = useState(null);

  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const [filterData] = useFetch(getHeroFilterData);

  const handleSearch = () => {
    if (tab === "flight" || tab === "tour") {
      if (destination || startDate || fromLocation) {
        const query = new URLSearchParams();
        if (startDate) query.append("startDate", startDate);
        if (endDate) query.append("endDate", endDate);
        if (destination) query.append("destination", destination);
        if (fromLocation) query.append("from", fromLocation);
        router.push(`/${tab === "flight" ? "flight" : "package"}?${query.toString()}`);
      } else {
        message.error(i18n.t("Please select at least one filter option."));
      }
    }

    if (tab === "hotel") {
      if (destination || hotelType || reputation) {
        const query = new URLSearchParams();
        if (destination) query.append("destination", destination);
        query.append("rooms", rooms);
        query.append("adults", adults);
        query.append("children", children);
        router.push(`/hotel?${query.toString()}`);
      } else {
        message.error(i18n.t("Please select at least one filter option."));
      }
    }

    if (tab === "visa") {
      if (visaType || country) {
        const query = new URLSearchParams();
        if (country) query.append("country", country);
        if (visaType) query.append("visaType", visaType);
        router.push(`/visa?${query.toString()}`);
      } else {
        message.error(i18n.t("Please select at least one filter option."));
      }
    }
  };

  const guestContent = (
    <div className="w-72 p-4 bg-white rounded-lg">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-bold text-gray-800 mb-4">Travellers</p>
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <img src="/icon/user-red.svg" alt="" className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700">Adult</p>
                  <p className="text-[10px] text-gray-400">12 years and above</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-300 hover:text-red-500"><FaMinus size={8} /></button>
                <span className="w-4 text-center font-bold text-gray-700">{adults}</span>
                <button onClick={() => setAdults(adults + 1)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-red-500"><FaPlus size={8} /></button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <img src="/icon/user-red.svg" alt="" className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700">Children</p>
                  <p className="text-[10px] text-gray-400">2 years - under 12 years</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-300 hover:text-red-500"><FaMinus size={8} /></button>
                <span className="w-4 text-center font-bold text-gray-700">{children}</span>
                <button onClick={() => setChildren(children + 1)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-red-500"><FaPlus size={8} /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-bold text-gray-800 mb-3">Booking Class</p>
          <div className="flex flex-col gap-3">
            {["Economy", "Premium Economy", "Business", "First Class"].map((cls) => (
              <label key={cls} className="flex items-center gap-3 cursor-pointer group">
                <input type="radio" name="bookingClass" defaultChecked={cls === "Economy"} className="w-4 h-4 accent-red-600 border-gray-300" />
                <span className="text-sm text-gray-600 group-hover:text-black transition-colors">{cls}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="w-full bg-red-50 text-red-500 py-2.5 rounded-lg font-bold mt-2 hover:bg-red-500 hover:text-white transition-all">
          Apply
        </button>
      </div>
    </div>
  );

  const tabs = [
    { id: "flight", label: "Flight", icon: <FaPlane /> },
    { id: "hotel", label: "Hotel", icon: <FaHotel /> },
    { id: "tour", label: "Holiday", icon: <FaUmbrellaBeach /> },
    { id: "visa", label: "Visa", icon: <FaPassport /> },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 mt-10">
      <div className="flex justify-center">
        <div className="flex bg-white rounded-t-xl overflow-x-auto no-scrollbar shadow-sm border-b max-w-full">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 sm:px-8 py-4 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${tab === t.id ? "bg-[#E8F3FF] text-[#1A4FA0]" : "text-[#4A4A4A] hover:bg-gray-50"}`}
            >
              <span className={tab === t.id ? "text-[#1A4FA0]" : "text-blue-500"}>{t.icon}</span>
              {i18n.t(t.label)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-2xl relative z-10">
        {(tab === "tour" || tab === "flight") && (
          <div className="flex flex-wrap gap-4 mb-5">
            {['One Way', 'Round Trip', 'Multi City'].map(type => (
              <label key={type} className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer font-medium text-gray-600">
                <input type="radio" name="trip" defaultChecked={type === 'One Way'} className="w-4 h-4 accent-cyan-500" />
                {type}
              </label>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border rounded-xl overflow-hidden shadow-inner">
          
          {/* From / Destination Logic for Flight */}
          <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 transition-all relative group">
            <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">{i18n.t(tab === "flight" ? "From" : "Destination")}</p>
            <select className="w-full bg-transparent font-bold text-base sm:text-lg outline-none appearance-none cursor-pointer mt-1" onChange={(e) => tab === "flight" ? setFromLocation(e.target.value) : setDestination(e.target.value)}>
              <option value="">{i18n.t("Select Location")}</option>
              {filterData?.find(i => i.key === "package_destination")?.values?.map(v => (
                <option key={v._id} value={v._id}>{v.name}</option>
              ))}
            </select>
            {tab === "flight" && (
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 bg-white border rounded-full p-1.5 text-cyan-500 hidden md:block shadow-sm">
                <FaExchangeAlt size={12} />
              </div>
            )}
          </div>

          <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 transition-all relative group">
            <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">{i18n.t(tab === "flight" ? "To" : "Type")}</p>
            <select className="w-full bg-transparent font-bold text-base sm:text-lg outline-none appearance-none cursor-pointer mt-1" onChange={(e) => setDestination(e.target.value)}>
              <option value="">{i18n.t("Select Destination")}</option>
              {filterData?.find(i => i.key === (tab === "hotel" ? "hotel_destination" : "package_destination"))?.values?.map(v => (
                <option key={v._id} value={v._id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
            <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">{i18n.t(tab === "hotel" ? "Check In" : "Travel Date")}</p>
            <DatePicker className="w-full border-none p-0 font-bold text-base sm:text-lg shadow-none mt-1" suffixIcon={null} placeholder="Select Date" onChange={(date, dateStr) => setStartDate(dateStr)} />
          </div>

          <div className="md:col-span-2 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer">
            <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">{i18n.t(tab === "hotel" ? "Guests" : "Travellers & Class")}</p>
            <Popover content={guestContent} trigger="click" placement="bottomRight">
              <div className="w-full font-bold text-base sm:text-lg mt-1 truncate">
                {adults + children} {i18n.t("Person")}, Economy
              </div>
            </Popover>
          </div>

          <div className="md:col-span-2 flex items-center justify-center p-3 bg-white">
            <button onClick={handleSearch} className="bg-[#1A4FA0] hover:bg-blue-800 text-white w-full h-14 md:h-16 rounded-xl flex items-center justify-center transition-all shadow-md group">
              <FaSearch size={22} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroFilters;