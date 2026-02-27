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

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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


  const [withPets, setWithPets] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const [filterData] = useFetch(getHeroFilterData);

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const handleSelect = (setter, value) => {
    setter(value);
    setOpenPopover(null);
  };

  const handleSwapLocations = (e) => {
    e.stopPropagation();
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
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
      if (startDate) query.append("startDate", startDate.format("YYYY-MM-DD"));
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
        <button onClick={() => setOpenPopover(null)} className="w-full bg-[#1A4FA0] text-white py-3 rounded-lg font-bold hover:bg-[#123a7a] shadow-lg transition-all active:scale-[0.98]">Apply</button>
      </div>
    </div>
  );

  const hotelGuestContent = (
    <div className="w-80 p-5 bg-white rounded-lg shadow-2xl border border-gray-100">
      <div className="flex flex-col gap-5">

        {/* Room Selection */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-bold text-base">Room</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setRooms(Math.max(1, rooms - 1))}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${rooms > 1 ? "border-[#1a4fa0] text-[#1a4fa0]" : "border-gray-200 text-gray-300"}`}
            >
              <FaMinus size={10} />
            </button>
            <span className="font-bold text-gray-700 w-4 text-center">{rooms}</span>
            <button
              onClick={() => setRooms(rooms + 1)}
              className="w-8 h-8 rounded-full border border-[#1a4fa0] text-[#1a4fa0] flex items-center justify-center hover:bg-red-50"
            >
              <FaPlus size={10} />
            </button>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Adults Selection */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-bold text-base">Adults</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAdults(Math.max(1, adults - 1))}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${adults > 1 ? "border-[#1a4fa0] text-[#1a4fa0]" : "border-gray-200 text-gray-300"}`}
            >
              <FaMinus size={10} />
            </button>
            <span className="font-bold text-gray-700 w-4 text-center">{adults}</span>
            <button
              onClick={() => setAdults(adults + 1)}
              className="w-8 h-8 rounded-full border border-[#1a4fa0] text-[#1a4fa0] flex items-center justify-center hover:bg-red-50"
            >
              <FaPlus size={10} />
            </button>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Child Selection */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700 font-bold text-base">Child</p>
            <p className="text-[10px] text-gray-400">0-12 Years</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setChildren(Math.max(0, children - 1))}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${children > 0 ? "border-[#1a4fa0] text-[#1a4fa0]" : "border-gray-200 text-gray-300"}`}
            >
              <FaMinus size={10} />
            </button>
            <span className="font-bold text-gray-700 w-4 text-center">{children}</span>
            <button
              onClick={() => setChildren(children + 1)}
              className="w-8 h-8 rounded-full border border-[#1a4fa0] text-[#1a4fa0] flex items-center justify-center hover:bg-red-50"
            >
              <FaPlus size={10} />
            </button>
          </div>
        </div>

        {/* Traveling with Pets Section */}
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-bold text-sm">Traveling with pets?</span>
            <div
              onClick={() => setWithPets(!withPets)}
              className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${withPets ? 'bg-red-500' : 'bg-gray-300'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${withPets ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 leading-tight">
            Assistance animals are not classified as pets. <span className=" text-[#1a4fa0] cursor-pointer hover:underline">Learn more about traveling with assistance animals.</span>
          </p>
        </div>

        {/* Action Buttons: Reset & Apply */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => { setRooms(1); setAdults(2); setChildren(0); setWithPets(false); }}
            className="text-[#1a4fa0] font-bold text-sm hover:underline"
          >
            Reset
          </button>
          <button
            onClick={() => setOpenPopover(null)}
            className="border-[#1a4fa0] text-[#1a4fa0] px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-red-50 transition-all active:scale-95 shadow-sm"
          >
            Apply
            <span className="flex items-center justify-center w-4 h-4 rounded-full border border-[#1a4fa0] text-[10px]">✓</span>
          </button>
        </div>
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
      {/* Tabs Section - Fixed for Mobile scroll */}
      <div className="flex justify-center">
        <div className="grid grid-cols-4 w-full md:w-auto bg-white rounded-t-xl shadow-sm border-b overflow-hidden">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-8 py-3 md:py-4 text-[12px] md:text-sm font-semibold transition-all ${tab === t.id ? "bg-[#E8F3FF] text-[#1A4FA0]" : "text-[#4A4A4A] hover:bg-gray-50"}`}
            >
              <span className={tab === t.id ? "text-[#1A4FA0]" : "text-blue-500"}>{t.icon}</span>
              <span className="text-center">{i18n.t(t.label)}</span>
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
                <Popover
                  open={openPopover === 'hotel-dest'}
                  onOpenChange={(v) => setOpenPopover(v ? 'hotel-dest' : null)}
                  content={<SelectionList options={["Dhaka, Bangladesh", "Chittagong", "Sylhet", "Cox's Bazar"]} onSelect={(v) => handleSelect(setDestination, v)} />}
                  trigger="click" placement="bottomLeft"
                >
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Destination")}</p>
                    <div className="mt-1 font-bold text-gray-500 text-lg leading-tight truncate">{destination}</div>
                  </div>
                </Popover>
              </div>

              <div className="md:col-span-2 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Check In")}</p>
                <DatePicker onChange={(d) => setStartDate(d)} placeholder="Select date" disabledDate={disabledDate} variant="borderless" className={`p-0 font-bold text-lg w-full mt-1 ${startDate ? "text-gray-700" : "text-gray-400"}`} value={startDate} format="DD MMM, YYYY" suffixIcon={null} />
              </div>

              <div className="md:col-span-2 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Check Out")}</p>
                <div className="flex items-center justify-between">
                  <DatePicker onChange={(d) => setEndDate(d)} placeholder="Select date" disabledDate={disabledDate} variant="borderless" className={`p-0 font-bold text-lg w-full mt-1 ${endDate ? "text-gray-700" : "text-gray-400"}`} value={endDate} format="DD MMM, YYYY" suffixIcon={null} />
                  <FaTimesCircle className="text-gray-400 cursor-pointer" onClick={() => setEndDate(null)} />
                </div>
              </div>

              <div className="md:col-span-4 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                <Popover
                  open={openPopover === 'hotel-guests'}
                  onOpenChange={(v) => setOpenPopover(v ? 'hotel-guests' : null)}
                  /* এখানে আগের বানানো hotelGuestContent ব্যবহার করুন */
                  content={hotelGuestContent}
                  trigger="click"
                  placement="bottomRight"
                >
                  <div className="cursor-pointer">
                    <p className="text-[11px] text-gray-400 font-bold leading-none">{i18n.t("Rooms & Guests")}</p>
                    <h4 className="font-bold text-[17px] leading-tight mt-1 whitespace-nowrap text-gray-800">
                      {rooms} Room, {adults} Adults, {children} Child
                    </h4>
                  </div>
                </Popover>
              </div>
            </>
          ) : tab === "visa" ? (
            <>
              <div className="md:col-span-4 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer">
                <Popover
                  open={openPopover === 'visa-cit'}
                  onOpenChange={(v) => setOpenPopover(v ? 'visa-cit' : null)}
                  content={<SelectionList options={["Bangladesh", "India", "USA"]} onSelect={(v) => handleSelect(setCitizenOf, v)} />}
                  trigger="click" placement="bottomLeft"
                >
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Citizen of")}</p>
                    <div className="mt-1 font-bold text-gray-700 text-lg leading-tight">{citizenOf}</div>
                  </div>
                </Popover>
              </div>
              <div className="md:col-span-4 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer">
                <Popover
                  open={openPopover === 'visa-to'}
                  onOpenChange={(v) => setOpenPopover(v ? 'visa-to' : null)}
                  content={<SelectionList options={["Thailand", "Malaysia", "Saudi Arabia"]} onSelect={(v) => handleSelect(setTravellingTo, v)} />}
                  trigger="click" placement="bottomLeft"
                >
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Travelling to")}</p>
                    <div className={`mt-1 font-bold text-lg leading-tight ${travellingTo.includes("Select") ? "text-gray-400" : "text-gray-700"}`}>{travellingTo}</div>
                  </div>
                </Popover>
              </div>
              <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer">
                <Popover
                  open={openPopover === 'visa-cat'}
                  onOpenChange={(v) => setOpenPopover(v ? 'visa-cat' : null)}
                  content={<SelectionList options={["Tourist Visa", "Business Visa", "Student Visa"]} onSelect={(v) => handleSelect(setVisaCategory, v)} />}
                  trigger="click" placement="bottomLeft"
                >
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
                <Popover
                  open={openPopover === 'tour-dest'}
                  onOpenChange={(v) => setOpenPopover(v ? 'tour-dest' : null)}
                  content={<SelectionList options={["Dubai", "Maldives", "Bhutan"]} onSelect={(v) => handleSelect(setDestination, v)} />}
                  trigger="click" placement="bottomLeft"
                >
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{i18n.t("Destination")}</p>
                    <div className="mt-1 font-bold text-gray-700 text-lg leading-tight">{destination}</div>
                  </div>
                </Popover>
              </div>
              <div className="md:col-span-5 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{i18n.t("Prefered Date")}</p>
                <DatePicker onChange={(d) => setStartDate(d)} placeholder="Select date" disabledDate={disabledDate} variant="borderless" className={`p-0 font-bold text-lg w-full mt-1 ${startDate ? "text-gray-700" : "text-gray-400"}`} value={startDate} format="DD MMM, YYYY" suffixIcon={null} />
              </div>
            </>
          ) : (
            <>
              <div className="md:col-span-2 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 relative cursor-pointer">
                <Popover
                  open={openPopover === 'flight-from'}
                  onOpenChange={(v) => setOpenPopover(v ? 'flight-from' : null)}
                  content={<SelectionList options={["Dhaka", "Chittagong", "Sylhet"]} onSelect={(v) => handleSelect(setFromLocation, v)} />}
                  trigger="click" placement="bottomLeft"
                >
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold">From</p>
                    <h4 className="font-bold text-gray-700 text-lg leading-tight mt-1">{fromLocation}</h4>
                    <p className="text-[10px] text-gray-400 truncate">DAC, Hazrat Shahjalal Int....</p>
                  </div>
                </Popover>
                <div
                  onClick={handleSwapLocations}
                  className="absolute right-4 md:-right-3 top-1/2 -translate-y-1/2 z-20 bg-[#00BCE4] text-white rounded-full p-1 border-2 border-white shadow-md cursor-pointer hover:bg-[#1A4FA0] transition-colors"
                >
                  <FaExchangeAlt size={10} className="rotate-90 md:rotate-0" />
                </div>
              </div>
              <div className="md:col-span-2 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer">
                <Popover
                  open={openPopover === 'flight-to'}
                  onOpenChange={(v) => setOpenPopover(v ? 'flight-to' : null)}
                  content={<SelectionList options={["Cox's Bazar", "Bangkok", "Dubai"]} onSelect={(v) => handleSelect(setToLocation, v)} />}
                  trigger="click" placement="bottomLeft"
                >
                  <div>
                    <p className="text-[11px] text-gray-400 font-bold">To</p>
                    <h4 className="font-bold text-gray-700 text-lg leading-tight mt-1">{toLocation}</h4>
                    <p className="text-[10px] text-gray-400">CXB, Cox's Bazar</p>
                  </div>
                </Popover>
              </div>
              <div className="md:col-span-2 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                <p className="text-[11px] text-gray-400 font-bold">Departure</p>
                <DatePicker onChange={(d) => setStartDate(d)} placeholder="Select date" disabledDate={disabledDate} variant="borderless" className={`p-0 font-bold text-lg w-full mt-1 ${startDate ? "text-gray-700" : "text-gray-400"}`} value={startDate} format="DD MMM, YYYY" suffixIcon={null} />
                <p className="text-[10px] text-gray-400">{startDate ? startDate.format('dddd') : ""}</p>
              </div>
              <div className="md:col-span-2 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 group">
                <p className="text-[11px] text-gray-400 font-bold">Return</p>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <DatePicker onChange={(d) => setEndDate(d)} placeholder="Select date" disabledDate={disabledDate} variant="borderless" className={`p-0 font-bold text-lg w-full mt-1 ${endDate ? "text-gray-700" : "text-gray-400"}`} value={endDate} format="DD MMM, YYYY" suffixIcon={null} />
                    <p className="text-[10px] text-gray-400">{endDate ? endDate.format('dddd') : ""}</p>
                  </div>
                  <FaTimesCircle className="text-gray-400 cursor-pointer" onClick={() => setEndDate(null)} />
                </div>
              </div>
              <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                <Popover
                  open={openPopover === 'flight-guests'}
                  onOpenChange={(v) => setOpenPopover(v ? 'flight-guests' : null)}
                  content={guestContent} trigger="click" placement="bottomRight"
                >
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