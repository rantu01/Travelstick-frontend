import { useState } from "react";
import { FaPlane, FaHotel, FaUmbrellaBeach, FaPassport, FaSearch, FaExchangeAlt } from "react-icons/fa";
import { DatePicker, message } from "antd";
import { useRouter } from "next/navigation";
import { useI18n } from "@/app/contexts/i18n";
import { useFetch } from "@/app/helper/hooks";
import { getHeroFilterData } from "@/app/helper/backend";

const HeroFilters = () => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const router = useRouter();
  
  // Default tab 'flight'
  const [tab, setTab] = useState("flight");
  
  // States
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [destination, setDestination] = useState(null);
  const [tourType, setTourType] = useState(null);
  const [hotelType, setHotelType] = useState(null);
  const [roomType, setRoomType] = useState(null);
  const [reputation, setReputation] = useState(null);
  const [visaType, setVisaType] = useState(null);
  const [visaMode, setVisaMode] = useState(null);
  const [country, setCountry] = useState(null);
  const [validity, setValidity] = useState(null);

  const [filterData] = useFetch(getHeroFilterData);

  const handleSearch = () => {
    // Flight and Holiday (Tour) both go to /package as per your request
    if (tab === "flight" || tab === "tour") {
      if (destination || startDate || endDate) {
        const query = new URLSearchParams();
        if (startDate) query.append("startDate", startDate);
        if (endDate) query.append("endDate", endDate);
        if (destination) query.append("destination", destination);
        if (tourType) query.append("tourType", tourType);
        router.push(`/package?${query.toString()}`);
      } else {
        message.error(i18n.t("Please select at least one filter option."));
      }
    }

    if (tab === "hotel") {
      if (destination || hotelType || roomType || reputation) {
        const query = new URLSearchParams();
        if (destination) query.append("destination", destination);
        if (hotelType) query.append("hotelType", hotelType);
        if (roomType) query.append("roomType", roomType);
        if (reputation) query.append("reputation", reputation);
        router.push(`/hotel?${query.toString()}`);
      } else {
        message.error(i18n.t("Please select at least one filter option."));
      }
    }

    if (tab === "visa") {
      if (visaType || visaMode || country || validity) {
        const query = new URLSearchParams();
        if (visaType) query.append("visaType", visaType);
        if (visaMode) query.append("visaMode", visaMode);
        if (country) query.append("country", country);
        if (validity) query.append("validity", validity);
        router.push(`/visa?${query.toString()}`);
      } else {
        message.error(i18n.t("Please select at least one filter option."));
      }
    }
  };

  const tabs = [
    { id: "flight", label: "Flight", icon: <FaPlane /> },
    { id: "hotel", label: "Hotel", icon: <FaHotel /> },
    { id: "tour", label: "Holiday", icon: <FaUmbrellaBeach /> },
    { id: "visa", label: "Visa", icon: <FaPassport /> },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 mt-10">
      {/* Tab Buttons - Centered and Responsive */}
      <div className="flex justify-center">
        <div className="flex bg-white rounded-t-xl overflow-x-auto no-scrollbar shadow-sm border-b max-w-full">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 sm:px-8 py-4 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                tab === t.id ? "bg-[#E8F3FF] text-[#1A4FA0]" : "text-[#4A4A4A] hover:bg-gray-50"
              }`}
            >
              <span className={tab === t.id ? "text-[#1A4FA0]" : "text-blue-500"}>{t.icon}</span>
              {i18n.t(t.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Filter Box */}
      <div className="bg-white p-6 rounded-2xl md:rounded-tr-none shadow-2xl relative z-10">
        
        {/* Radio options for Flight/Tour Style */}
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
          
          {/* Destination Field */}
          <div className="md:col-span-4 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 transition-all relative group">
            <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">{i18n.t("Destination")}</p>
            <select 
              className="w-full bg-transparent font-bold text-base sm:text-lg outline-none appearance-none cursor-pointer mt-1"
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="">{i18n.t("Select Destination")}</option>
              {filterData?.find(i => i.key === (tab === "hotel" ? "hotel_destination" : "package_destination"))?.values?.map(v => (
                <option key={v._id} value={v._id}>{v.name}</option>
              ))}
            </select>
            {(tab === "tour" || tab === "flight") && (
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 bg-white border rounded-full p-1.5 text-cyan-500 hidden md:block shadow-sm">
                    <FaExchangeAlt size={12} />
                </div>
            )}
          </div>

          {/* Conditional Fields */}
          {(tab === "tour" || tab === "flight") && (
             <>
                <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                    <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">{i18n.t("Departure")}</p>
                    <DatePicker 
                        className="w-full border-none p-0 font-bold text-base sm:text-lg shadow-none mt-1" 
                        suffixIcon={null}
                        placeholder="Select Date"
                        onChange={(date, dateStr) => setStartDate(dateStr)}
                    />
                </div>
                <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                    <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">{i18n.t("Return")}</p>
                    <DatePicker 
                        className="w-full border-none p-0 font-bold text-base sm:text-lg shadow-none mt-1" 
                        suffixIcon={null}
                        placeholder="Select Date"
                        onChange={(date, dateStr) => setEndDate(dateStr)}
                    />
                </div>
             </>
          )}

          {tab === "hotel" && (
              <>
                <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                    <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">{i18n.t("Check In / Out")}</p>
                    <DatePicker.RangePicker className="w-full border-none p-0 font-bold text-base sm:text-lg shadow-none mt-1" />
                </div>
                <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                    <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">{i18n.t("Room & Guests")}</p>
                    <select className="w-full bg-transparent font-bold text-base sm:text-lg outline-none appearance-none mt-1">
                        <option>1 Room, 2 Adults</option>
                    </select>
                </div>
              </>
          )}

          {tab === "visa" && (
              <>
                <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                    <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">{i18n.t("Country")}</p>
                    <select onChange={(e) => setCountry(e.target.value)} className="w-full bg-transparent font-bold text-base sm:text-lg outline-none appearance-none mt-1">
                        <option value="">{i18n.t("Select Country")}</option>
                        {filterData?.find(i => i.key === "visa_country")?.values?.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
                    </select>
                </div>
                <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                    <p className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">{i18n.t("Visa Category")}</p>
                    <select onChange={(e) => setVisaType(e.target.value)} className="w-full bg-transparent font-bold text-base sm:text-lg outline-none appearance-none mt-1">
                        <option value="">{i18n.t("Select Category")}</option>
                        {filterData?.find(i => i.key === "visa_type")?.values?.map(v => <option key={v._id} value={v._id}>{v.name[langCode]}</option>)}
                    </select>
                </div>
              </>
          )}

          {/* Search Button Section */}
          <div className="md:col-span-2 flex items-center justify-center p-3 bg-white">
            <button 
                onClick={handleSearch}
                className="bg-[#1A4FA0] hover:bg-blue-800 text-white w-full h-14 md:h-16 rounded-xl flex items-center justify-center transition-all shadow-md group"
            >
              <FaSearch size={22} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroFilters;