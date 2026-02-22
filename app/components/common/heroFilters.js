"use client";
import { useState } from "react";
import { FaPlane, FaHotel, FaUmbrellaBeach, FaPassport, FaSearch, FaExchangeAlt, FaMinus, FaPlus, FaTimesCircle, FaUser } from "react-icons/fa";
import { DatePicker, Popover } from "antd";
import { useRouter } from "next/navigation";
import { useI18n } from "@/app/contexts/i18n";
import { useFetch } from "@/app/helper/hooks";
import { getHeroFilterData } from "@/app/helper/backend";
import dayjs from "dayjs";

const HeroFilters = () => {
  const i18n = useI18n();
  const router = useRouter();

  const [tab, setTab] = useState("flight");
  const [tripType, setTripType] = useState("One Way");
  const [startDate, setStartDate] = useState(dayjs("2026-02-05"));
  const [endDate, setEndDate] = useState(dayjs("2026-02-05"));

  const [destination, setDestination] = useState("Dhaka, Bangladesh");
  const [fromLocation, setFromLocation] = useState("Dhaka");
  const [toLocation, setToLocation] = useState("Cox's Bazar");
  const [citizenOf, setCitizenOf] = useState("Bangladesh");
  const [travellingTo, setTravellingTo] = useState("Select you country");
  const [visaCategory, setVisaCategory] = useState("Select visa category");

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [bookingClass, setBookingClass] = useState("Economy");
  const [rooms, setRooms] = useState(1);

  const [filterData] = useFetch(getHeroFilterData);

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const SelectionList = ({ options, onSelect }) => (
    <div className="flex flex-col w-60 max-h-64 overflow-y-auto bg-white rounded-md shadow-lg border border-gray-100">
      {options.map((opt, idx) => (
        <button key={idx} onClick={() => onSelect(opt)} className="text-left px-4 py-3 hover:bg-gray-50 text-sm font-semibold text-gray-700 border-b border-gray-50 last:border-none">
          {opt}
        </button>
      ))}
    </div>
  );

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (tab === "flight") {
      query.append("from", fromLocation);
      query.append("to", toLocation);
      query.append("startDate", startDate?.format("YYYY-MM-DD"));
      router.push(`/flight?${query.toString()}`);
    } else if (tab === "hotel") {
      query.append("destination", destination);
      router.push(`/hotel?${query.toString()}`);
    } else if (tab === "tour") {
      query.append("destination", destination);
      router.push(`/package?${query.toString()}`);
    } else if (tab === "visa") {
      query.append("citizen", citizenOf);
      router.push(`/visa?${query.toString()}`);
    }
  };

  const guestContent = (
    <div className="w-80 p-5 bg-white rounded-lg shadow-2xl border border-gray-100">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-base font-bold text-gray-800 mb-4 border-b pb-2">Travellers</p>
          <div className="flex flex-col gap-5">
            {/* Adult */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1A4FA0]">
                  <FaUser size={12} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700">Adult</p>
                  <p className="text-[10px] text-gray-400">12 years and above</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1A4FA0] hover:text-[#1A4FA0] transition-colors"><FaMinus size={8} /></button>
                <span className="w-4 text-center font-bold text-gray-700 text-sm">{adults}</span>
                <button onClick={() => setAdults(adults + 1)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center bg-white text-[#1A4FA0] hover:bg-[#1A4FA0] hover:text-white transition-all"><FaPlus size={8} /></button>
              </div>
            </div>
            {/* Children */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1A4FA0]">
                  <FaUser size={10} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700">Children</p>
                  <p className="text-[10px] text-gray-400">2 years - under 12 years</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1A4FA0] hover:text-[#1A4FA0] transition-colors"><FaMinus size={8} /></button>
                <span className="w-4 text-center font-bold text-gray-700 text-sm">{children}</span>
                <button onClick={() => setChildren(children + 1)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center bg-white text-[#1A4FA0] hover:bg-[#1A4FA0] hover:text-white transition-all"><FaPlus size={8} /></button>
              </div>
            </div>
            {/* Infants */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1A4FA0]">
                  <FaUser size={8} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700">Infants</p>
                  <p className="text-[10px] text-gray-400">Below 2 years</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setInfants(Math.max(0, infants - 1))} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1A4FA0] hover:text-[#1A4FA0] transition-colors"><FaMinus size={8} /></button>
                <span className="w-4 text-center font-bold text-gray-700 text-sm">{infants}</span>
                <button onClick={() => setInfants(infants + 1)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center bg-white text-[#1A4FA0] hover:bg-[#1A4FA0] hover:text-white transition-all"><FaPlus size={8} /></button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-base font-bold text-gray-800 mb-4 border-b pb-2">Booking Class</p>
          <div className="flex flex-col gap-3">
            {["Economy", "Economy/Premium Economy", "Premium Economy", "First/Business", "Business", "First Class"].map((cls) => (
              <label key={cls} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="radio" name="bookingClass" className="sr-only" checked={bookingClass === cls} onChange={() => setBookingClass(cls)} />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${bookingClass === cls ? "border-[#1A4FA0]" : "border-gray-400 group-hover:border-[#1A4FA0]"}`}>
                    {bookingClass === cls && <div className="w-2.5 h-2.5 rounded-full bg-[#1A4FA0]"></div>}
                  </div>
                </div>
                <span className={`text-sm font-semibold transition-colors ${bookingClass === cls ? "text-gray-800" : "text-gray-500 group-hover:text-[#1A4FA0]"}`}>{cls}</span>
              </label>
            ))}
          </div>
        </div>
        <button className="w-full bg-[#1A4FA0] text-white py-3 rounded-lg font-bold hover:bg-[#123a7a] shadow-lg transition-all active:scale-[0.98]">Apply</button>
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
    <div className="w-full max-w-[1200px] mx-auto px-4 mt-10 font-sans">
      <div className="flex justify-center">
        <div className="flex bg-white rounded-t-xl shadow-sm border-b overflow-x-auto no-scrollbar max-w-full">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-6 md:px-8 py-4 text-sm font-semibold transition-all whitespace-nowrap ${tab === t.id ? "bg-[#E8F3FF] text-[#1A4FA0]" : "text-[#4A4A4A] hover:bg-gray-50"}`}>
              <span className={tab === t.id ? "text-[#1A4FA0]" : "text-blue-500"}>{t.icon}</span>
              {i18n.t(t.label)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm relative z-10 border border-gray-100">
        {tab === "flight" && (
          <div className="flex flex-wrap gap-2 mb-6">
            {['One Way', 'Round Trip', 'Multi City'].map(type => (
              <button key={type} onClick={() => setTripType(type)} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 border ${tripType === type ? "bg-[#00BCE4] border-[#00BCE4] text-white" : "bg-[#F2F4F7] border-transparent text-gray-500"}`}>
                <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${tripType === type ? "border-white" : "border-gray-400"}`}>
                  {tripType === type && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
                {type}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border rounded-xl overflow-hidden">
          {tab === "hotel" ? (
            <>
              <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer">
                <Popover content={<SelectionList options={["Dhaka, Bangladesh", "Chittagong", "Sylhet", "Cox's Bazar"]} onSelect={setDestination} />} trigger="click" placement="bottomLeft">
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Destination")}</p>
                    <div className="mt-1 font-bold text-gray-500 text-lg leading-tight truncate">{destination}</div>
                  </div>
                </Popover>
              </div>
              <div className="md:col-span-2 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Check In")}</p>
                <DatePicker onChange={(d) => setStartDate(d)} disabledDate={disabledDate} variant="borderless" className={`p-0 font-bold text-lg w-full mt-1 ${startDate ? "text-gray-700" : "text-gray-400"}`} value={startDate} format="DD MMM, YYYY" suffixIcon={null} />
              </div>
              <div className="md:col-span-2 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Check Out")}</p>
                <div className="flex items-center justify-between">
                  <DatePicker onChange={(d) => setEndDate(d)} disabledDate={disabledDate} variant="borderless" className={`p-0 font-bold text-lg w-full mt-1 ${endDate ? "text-gray-700" : "text-gray-400"}`} value={endDate} format="DD MMM, YYYY" suffixIcon={null} />
                  <FaTimesCircle className="text-gray-400 cursor-pointer" onClick={() => setEndDate(null)} />
                </div>
              </div>
              <div className="md:col-span-4 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                <Popover content={guestContent} trigger="click" placement="bottomRight">
                  <div className="cursor-pointer">
                    <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Room & Guests")}</p>
                    <h4 className={`font-bold text-lg leading-tight mt-1 whitespace-nowrap text-gray-700`}>
                      {rooms} Room, {adults + children + infants} Guests
                    </h4>
                  </div>
                </Popover>
              </div>
            </>
          ) : tab === "visa" ? (
            <>
              <div className="md:col-span-4 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer">
                <Popover content={<SelectionList options={["Bangladesh", "India", "USA"]} onSelect={setCitizenOf} />} trigger="click" placement="bottomLeft">
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Citizen of")}</p>
                    <div className="mt-1 font-bold text-gray-700 text-lg leading-tight">{citizenOf}</div>
                  </div>
                </Popover>
              </div>
              <div className="md:col-span-4 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer">
                <Popover content={<SelectionList options={["Thailand", "Malaysia", "Saudi Arabia"]} onSelect={setTravellingTo} />} trigger="click" placement="bottomLeft">
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Travelling to")}</p>
                    <div className={`mt-1 font-bold text-lg leading-tight ${travellingTo.includes("Select") ? "text-gray-400" : "text-gray-700"}`}>{travellingTo}</div>
                  </div>
                </Popover>
              </div>
              <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer">
                <Popover content={<SelectionList options={["Tourist Visa", "Business Visa", "Student Visa"]} onSelect={setVisaCategory} />} trigger="click" placement="bottomLeft">
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Visa Category")}</p>
                    <div className={`mt-1 font-bold text-lg leading-tight ${visaCategory.includes("Select") ? "text-gray-400" : "text-gray-700"}`}>{visaCategory}</div>
                  </div>
                </Popover>
              </div>
            </>
          ) : tab === "tour" ? (
            <>
              <div className="md:col-span-6 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer">
                <Popover content={<SelectionList options={["Dubai", "Maldives", "Bhutan"]} onSelect={setDestination} />} trigger="click" placement="bottomLeft">
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{i18n.t("Destination")}</p>
                    <div className="mt-1 font-bold text-gray-700 text-lg leading-tight">{destination}</div>
                  </div>
                </Popover>
              </div>
              <div className="md:col-span-5 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{i18n.t("Prefered Date")}</p>
                <DatePicker onChange={(d) => setStartDate(d)} disabledDate={disabledDate} variant="borderless" className={`p-0 font-bold text-lg w-full mt-1 ${startDate ? "text-gray-700" : "text-gray-400"}`} value={startDate} format="DD MMM, YYYY" suffixIcon={null} />
              </div>
            </>
          ) : (
            <>
              <div className="md:col-span-2 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 relative cursor-pointer">
                <Popover content={<SelectionList options={["Dhaka", "Chittagong", "Sylhet"]} onSelect={setFromLocation} />} trigger="click" placement="bottomLeft">
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold">From</p>
                    <h4 className="font-bold text-gray-700 text-lg leading-tight mt-1">{fromLocation}</h4>
                    <p className="text-[10px] text-gray-400 truncate">DAC, Hazrat Shahjalal Int....</p>
                  </div>
                </Popover>
                <div className="absolute right-4 md:-right-3 top-1/2 -translate-y-1/2 z-20 bg-[#00BCE4] text-white rounded-full p-1 border-2 border-white shadow-md">
                  <FaExchangeAlt size={10} className="rotate-90 md:rotate-0" />
                </div>
              </div>
              <div className="md:col-span-2 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer">
                <Popover content={<SelectionList options={["Cox's Bazar", "Bangkok", "Dubai"]} onSelect={setToLocation} />} trigger="click" placement="bottomLeft">
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold">To</p>
                    <h4 className="font-bold text-gray-700 text-lg leading-tight mt-1">{toLocation}</h4>
                    <p className="text-[10px] text-gray-400">CXB, Cox's Bazar</p>
                  </div>
                </Popover>
              </div>
              <div className="md:col-span-2 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                <p className="text-[11px] text-gray-400 font-bold">Departure</p>
                <DatePicker onChange={(d) => setStartDate(d)} disabledDate={disabledDate} variant="borderless" className={`p-0 font-bold text-lg w-full mt-1 ${startDate ? "text-gray-700" : "text-gray-400"}`} value={startDate} format="DD MMM, YYYY" suffixIcon={null} />
                <p className="text-[10px] text-gray-400">{startDate?.format('dddd')}</p>
              </div>
              <div className="md:col-span-2 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 group">
                <p className="text-[11px] text-gray-400 font-bold">Departure</p>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <DatePicker onChange={(d) => setEndDate(d)} disabledDate={disabledDate} variant="borderless" className={`p-0 font-bold text-lg w-full mt-1 ${endDate ? "text-gray-700" : "text-gray-400"}`} value={endDate} format="DD MMM, YYYY" suffixIcon={null} />
                    <p className="text-[10px] text-gray-400">{endDate?.format('dddd')}</p>
                  </div>
                  <FaTimesCircle className="text-gray-400 cursor-pointer" onClick={() => setEndDate(null)} />
                </div>
              </div>
              <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                <Popover content={guestContent} trigger="click" placement="bottomRight">
                  <div className="cursor-pointer">
                    <p className="text-[11px] text-gray-400 font-bold">Traveller, Class</p>
                    <h4 className="font-bold text-gray-700 text-lg leading-tight mt-1">{adults + children + infants} Traveller</h4>
                    <p className="text-[10px] text-gray-400">{bookingClass}</p>
                  </div>
                </Popover>
              </div>
            </>
          )}

          <div className="md:col-span-1 flex items-center justify-center p-4 md:p-2 bg-white">
            <button onClick={handleSearch} className="bg-[#1A4FA0] hover:bg-blue-900 text-white w-full h-14 rounded-lg flex items-center justify-center shadow-lg transition-transform active:scale-95">
              <FaSearch size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroFilters;