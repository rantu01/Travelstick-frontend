"use client";
import React, { useState, useEffect, forwardRef } from "react";
import { FaPlane, FaHotel, FaUmbrellaBeach, FaPassport, FaSearch, FaExchangeAlt, FaMinus, FaPlus, FaTimesCircle, FaUser, FaTrash } from "react-icons/fa";
import { DatePicker, Popover } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { useI18n } from "@/app/contexts/i18n";
import { useFetch } from "@/app/helper/hooks";
import { getHeroFilterData, getAllPublicVisa } from "@/app/helper/backend";
import dayjs from "dayjs";
import Image from "next/image";

import SelectionList from "./SelectionList";
import GuestContent from "./GuestContent";
import HotelGuestContent from "./HotelGuestContent";
import MultiCityRow from "./MultiCityRow";

const bangladeshFixedHolidays = new Set([
  "02-21", "03-17", "03-26", "04-14", "05-01", "08-15", "12-16",
]);
const bangladeshIslamicHolidays = new Set([
  "2025-03-30", "2025-03-31", "2025-04-01", "2025-06-06", "2025-06-07",
  "2025-06-08", "2025-09-04", "2025-07-27", "2026-03-19", "2026-03-20",
  "2026-03-21", "2026-05-26", "2026-05-27", "2026-05-28", "2026-08-25", "2026-07-16",
]);

const isHoliday = (date) => {
  const mmdd = date.format("MM-DD");
  const full = date.format("YYYY-MM-DD");
  const dayOfWeek = date.day();
  return (
    dayOfWeek === 5 || dayOfWeek === 6 ||
    bangladeshFixedHolidays.has(mmdd) ||
    bangladeshIslamicHolidays.has(full)
  );
};

// dateRender moved inside component so it can access startDate/endDate

const HeroFilters = (props, ref) => {
  const i18n = useI18n();
  const router = useRouter();

  const [tab, setTab] = useState("flight");
  const [tripType, setTripType] = useState("One Way");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [destination, setDestination] = useState("Dhaka, Bangladesh");
  const [fromLocation, setFromLocation] = useState("Dhaka");
  const [toLocation, setToLocation] = useState("Cox's Bazar");

  const [citizenOf, setCitizenOf] = useState(null);
  const [travellingTo, setTravellingTo] = useState(null);
  const [visaCategory, setVisaCategory] = useState(null);

  const [travellingToOptions, setTravellingToOptions] = useState([]);
  const [visaCategoryOptions, setVisaCategoryOptions] = useState([]);
  const [matchedVisaId, setMatchedVisaId] = useState(null);

  const [loadingTravellingTo, setLoadingTravellingTo] = useState(false);
  const [loadingVisaCategory, setLoadingVisaCategory] = useState(false);
  const [visaSearching, setVisaSearching] = useState(false);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState([]);
  const [infants, setInfants] = useState(0);
  const [bookingClass, setBookingClass] = useState("Economy");
  const [rooms, setRooms] = useState(1);
  const [withPets, setWithPets] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [datesOpen, setDatesOpen] = useState(false);
  const pathname = usePathname();
  const isHotelPage = pathname?.startsWith("/hotel");
  const isPackagePage = pathname?.startsWith("/package");
  const [isMobile, setIsMobile] = useState(false);
  const [dateOpenTarget, setDateOpenTarget] = useState(null); // 'start' | 'end' | null
  const [rangeOpen, setRangeOpen] = useState(false);

  const [multiCityFlights, setMultiCityFlights] = useState([
    { from: "Dhaka", to: "Cox's Bazar", date: null },
    { from: "Cox's Bazar", to: "Dhaka", date: null },
  ]);

  const [filterData] = useFetch(getHeroFilterData);

  const visaCitizenOptions =
    filterData?.find(f => f.key === "visa_citizen_of")?.values?.map(v => v.name) ||
    filterData?.find(f => f.key === "visa_country")?.values?.map(v => v.name) ||
    [];

  useEffect(() => {
    if (!citizenOf) {
      setTravellingTo(null);
      setTravellingToOptions([]);
      setVisaCategory(null);
      setVisaCategoryOptions([]);
      setMatchedVisaId(null);
      return;
    }

    const fetchTravellingTo = async () => {
      setLoadingTravellingTo(true);
      setTravellingTo(null);
      setVisaCategory(null);
      setVisaCategoryOptions([]);
      setMatchedVisaId(null);
      try {
        const { data } = await getAllPublicVisa({ citizen_of: citizenOf, limit: 100 });
        const docs = data?.docs || [];
        const unique = [...new Set(docs.map(v => v.travelling_to).filter(Boolean))];
        setTravellingToOptions(unique);
      } catch {
        setTravellingToOptions([]);
      } finally {
        setLoadingTravellingTo(false);
      }
    };

    fetchTravellingTo();
  }, [citizenOf]);

  useEffect(() => {
    if (tripType !== "Round Trip") {
      setDatesOpen(false);
      setDateOpenTarget(null);
    }
  }, [tripType]);

  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (!citizenOf || !travellingTo) {
      setVisaCategory(null);
      setVisaCategoryOptions([]);
      setMatchedVisaId(null);
      return;
    }

    const fetchVisaCategories = async () => {
      setLoadingVisaCategory(true);
      setVisaCategory(null);
      setMatchedVisaId(null);
      try {
        const { data } = await getAllPublicVisa({
          citizen_of: citizenOf,
          travelling_to: travellingTo,
          limit: 100,
        });
        const docs = data?.docs || [];

        const seen = new Map();
        docs.forEach(v => {
          if (v.visa_type?._id && !seen.has(v.visa_type._id)) {
            seen.set(v.visa_type._id, {
              label: v.visa_type?.name?.[i18n.langCode] || v.visa_type?.name?.en || "",
              visaId: v._id,
            });
          }
        });

        const options = Array.from(seen.entries()).map(([typeId, val]) => ({
          label: val.label,
          visaId: val.visaId,
        }));

        setVisaCategoryOptions(options);

        if (docs.length === 1) {
          setMatchedVisaId(docs[0]._id);
        }
      } catch {
        setVisaCategoryOptions([]);
      } finally {
        setLoadingVisaCategory(false);
      }
    };

    fetchVisaCategories();
  }, [citizenOf, travellingTo]);

  const disabledDate = (current) => current && current < dayjs().startOf("day");

  const handleSelect = (setter, value) => {
    setter(value);
    setOpenPopover(null);
  };

  const dateRender = (current) => {
    const holiday = isHoliday(current);
    const isStart = startDate && current.isSame(startDate, "day");
    const isEnd = endDate && current.isSame(endDate, "day");

    return (
      <div style={{ position: "relative", display: "inline-block", width: "100%", textAlign: "center" }}>
        <div className="ant-picker-cell-inner" style={{ display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 9999,
            backgroundColor: isEnd ? "#1a4fa0" : (isStart ? "#e6f6ff" : "transparent"),
            color: isEnd ? "#ffffff" : undefined,
            fontWeight: isEnd || isStart ? 700 : 400,
            position: "relative",
          }}>
            {current.date()}
          </div>
        </div>
        {holiday && (
          <div style={{
            position: "absolute",
            bottom : -2,
            left: "50%",
            transform: "translateX(-50%)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#e11d48",
            boxShadow: "0 0 0 2px rgba(225,29,72,0.08)",
            pointerEvents: "none",
            zIndex: 0,
          }} />
        )}
      </div>
    );
  };

  const handleVisaCategorySelect = (option) => {
    setVisaCategory(option.label);
    setMatchedVisaId(option.visaId);
    setOpenPopover(null);
  };

  const handleChildrenChange = (newChildren) => {
    setChildren(newChildren);
    if (newChildren > childrenAges.length) {
      const newAges = [...childrenAges];
      for (let i = childrenAges.length; i < newChildren; i++) newAges.push(5);
      setChildrenAges(newAges);
    } else {
      setChildrenAges(childrenAges.slice(0, newChildren));
    }
  };

  const handleChildAgeChange = (index, age) => {
    const newAges = [...childrenAges];
    newAges[index] = age;
    setChildrenAges(newAges);
  };

  const handleSwapLocations = (e) => {
    e.stopPropagation();
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleMultiCityChange = (index, field, value) => {
    const updated = [...multiCityFlights];
    updated[index][field] = value;
    setMultiCityFlights(updated);
  };

  const handleSwapMultiCity = (index) => {
    const updated = [...multiCityFlights];
    const temp = updated[index].from;
    updated[index].from = updated[index].to;
    updated[index].to = temp;
    setMultiCityFlights(updated);
  };

  const handleAddMultiCityFlight = () => {
    if (multiCityFlights.length < 5) {
      const last = multiCityFlights[multiCityFlights.length - 1];
      setMultiCityFlights([...multiCityFlights, { from: last.to, to: "", date: null }]);
    }
  };

  const handleRemoveMultiCityFlight = (index) => {
    if (multiCityFlights.length > 2) {
      setMultiCityFlights(multiCityFlights.filter((_, i) => i !== index));
    }
  };

  const handleSearch = async () => {
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
      if (citizenOf && travellingTo && visaCategory && matchedVisaId) {
        router.push(`/visa/${matchedVisaId}`);
        return;
      }
      if (citizenOf) query.append("citizen_of", citizenOf);
      if (travellingTo) query.append("travelling_to", travellingTo);
      router.push(`/visa?${query.toString()}`);
    }
  };

  const guestContent = (
    <GuestContent
      adults={adults} setAdults={setAdults}
      children={children} setChildren={handleChildrenChange}
      childrenAges={childrenAges} setChildAge={handleChildAgeChange}
      infants={infants} setInfants={setInfants}
      bookingClass={bookingClass} setBookingClass={setBookingClass}
      onApply={() => setOpenPopover(null)}
    />
  );

  const hotelGuestContent = (
    <HotelGuestContent
      rooms={rooms} setRooms={setRooms}
      adults={adults} setAdults={setAdults}
      children={children} setChildren={setChildren}
      withPets={withPets} setWithPets={setWithPets}
      onReset={() => { setRooms(1); setAdults(2); setChildren(0); setChildrenAges([]); setWithPets(false); }}
      onApply={() => setOpenPopover(null)}
    />
  );

  const tabs = [
    { id: "flight", label: "Flight", icon: <Image src="/Header Icon/2.png" width={40} height={40} alt="Flight" /> },
    { id: "hotel", label: "Hotel", icon: <Image src="/Header Icon/1.png" width={40} height={40} alt="Hotel" /> },
    { id: "tour", label: "Holiday", icon: <Image src="/Header Icon/3.png" width={40} height={40} alt="Holiday" /> },
    { id: "visa", label: "Visa", icon: <Image src="/Header Icon/4.png" width={40} height={40} alt="Visa" /> },
  ];

  // ── [FIX 2] Multi City: Traveller/Class একবার উপরে, প্রতিটি row-এ আর নেই ──
  const renderMultiCity = () => (
    <div className="flex flex-col gap-3">
      {multiCityFlights.map((flight, index) => (
        <MultiCityRow
          key={index}
          flight={flight}
          index={index}
          openPopover={openPopover}
          setOpenPopover={setOpenPopover}
          handleMultiCityChange={handleMultiCityChange}
          handleSwapMultiCity={handleSwapMultiCity}
          handleRemoveMultiCityFlight={handleRemoveMultiCityFlight}
          multiCityFlightsLength={multiCityFlights.length}
          adults={adults}
          children={children}
          childrenAges={childrenAges}
          infants={infants}
          bookingClass={bookingClass}
          disabledDate={disabledDate}
          dateRender={dateRender}
          filterData={filterData}
          langCode={i18n.langCode}
          hideGuest={true}
          sideElement={
            index === 0 ? (
              <Popover
                open={openPopover === "multi-guests"}
                onOpenChange={(v) => setOpenPopover(v ? "multi-guests" : null)}
                content={guestContent}
                trigger="click"
                placement="bottomLeft"
              >
                <div className="cursor-pointer p-2 w-full text-left">
                  <p className="text-[11px] text-gray-400 font-bold">Traveller, Class</p>
                  <h4 className="font-bold text-gray-700 text-lg leading-tight mt-1">
                    {adults} Adult{adults > 1 ? "s" : ""}, {children} Child{children > 1 ? "ren" : ""}
                  </h4>
                  <p className="text-[10px] text-gray-400">{bookingClass}</p>
                </div>
              </Popover>
            ) : index === 1 ? (
              multiCityFlights.length < 5 ? (
                <button
                  onClick={handleAddMultiCityFlight}
                  className="w-full flex items-center justify-center gap-2 bg-[#1A4FA0] text-white font-bold px-4 py-2 rounded-full hover:bg-[#1661a1] transition-all"
                >
                  <FaPlus size={12} /> Add City
                </button>
              ) : (
                <span className="text-xs text-gray-400">Max 5</span>
              )
            ) : null
          }
        />
      ))}

      <div className="flex justify-center mt-1">
        <button
          onClick={handleSearch}
          className="bg-[#1A4FA0] hover:bg-blue-900 text-white px-8 h-12 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 font-bold"
        >
          <FaSearch size={16} /> Search
        </button>
      </div>
    </div>
  );

  return (
    <div ref={ref} className="w-full max-w-[1200px] mx-auto px-4 mt-10 font-sans md:sticky md:top-24 md:z-40  ">
      <div className="flex justify-center">
        <div className="grid grid-cols-4 w-full md:w-auto bg-white rounded-xl shadow-sm border-b overflow-hidden relative z-50 top-3 p-2">
          {tabs.map((t) => (
            <button
              key={t.id} onClick={() => setTab(t.id)}
              className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-2 md:px-8 py-3 md:py-4 text-[12px] md:text-sm font-semibold transition-all ${tab === t.id ? "bg-[#E8F3FF] text-[#1A4FA0]" : "text-[#4A4A4A] hover:bg-gray-50"}`}
            >
              <span className="flex items-center justify-center">{t.icon}</span>
              <span className="text-center">{i18n.t(t.label)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm relative z-10 border border-gray-100">
        {tab === "flight" && (
          <div className="flex flex-nowrap gap-2 mb-6 overflow-x-auto">
              {["One Way", "Round Trip", "Multi City"].map((type) => (
                <button
                key={type} onClick={() => setTripType(type)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 border ${tripType === type ? "bg-[#1a4fa0] border-[#1a4fa0] text-white" : "bg-[#F2F4F7] border-transparent text-gray-500"}`}
              >
                <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${tripType === type ? "border-white" : "border-gray-400"}`}>
                  {tripType === type && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                {type}
              </button>
            ))}
          </div>
        )}

        {tab === "flight" && tripType === "Multi City" ? renderMultiCity() : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {tab === "hotel" && !isHotelPage ? (
              <>
                <div className="md:col-span-3 border rounded-xl p-4 hover:bg-gray-50 cursor-pointer bg-white">
                  <Popover open={openPopover === "hotel-dest"} onOpenChange={(v) => setOpenPopover(v ? "hotel-dest" : null)} content={<SelectionList options={filterData?.find(f => f.key === 'hotel_destination')?.values?.map(v => v.name?.[i18n.langCode] || v.name?.en || v.name) || []} onSelect={(v) => handleSelect(setDestination, v)} />} trigger="click" placement="bottomLeft">
                    <div>
                      <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Destination")}</p>
                      <div className="mt-1 font-bold text-gray-500 text-lg leading-tight truncate">{destination}</div>
                    </div>
                  </Popover>
                </div>
                <div className="md:col-span-2 border rounded-xl p-4 hover:bg-gray-50 bg-white">
                  <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Check In")}</p>
                  <DatePicker onChange={(d) => setStartDate(d)} placeholder="Select date" disabledDate={disabledDate} variant="borderless" className={`p-0 font-bold text-lg w-full mt-1 ${startDate ? "text-gray-700" : "text-gray-400"}`} value={startDate} format="DD MMM, YYYY" suffixIcon={null} dateRender={dateRender} />
                </div>
                <div className="md:col-span-2 border rounded-xl p-4 hover:bg-gray-50 bg-white">
                  <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Check Out")}</p>
                  <div className="flex items-center justify-between">
                    <DatePicker onChange={(d) => setEndDate(d)} placeholder="Select date" disabledDate={disabledDate} variant="borderless" className={`p-0 font-bold text-lg w-full mt-1 ${endDate ? "text-gray-700" : "text-gray-400"}`} value={endDate} format="DD MMM, YYYY" suffixIcon={null} dateRender={dateRender} />
                    <FaTimesCircle className="text-gray-400 cursor-pointer" onClick={() => setEndDate(null)} />
                  </div>
                </div>
                <div className="md:col-span-4 border rounded-xl p-4 hover:bg-gray-50 bg-white">
                  <Popover open={openPopover === "hotel-guests"} onOpenChange={(v) => setOpenPopover(v ? "hotel-guests" : null)} content={hotelGuestContent} trigger="click" placement="bottomRight">
                    <div className="cursor-pointer">
                      <p className="text-[11px] text-gray-400 font-bold leading-none">{i18n.t("Rooms & Guests")}</p>
                      <h4 className="font-bold text-[17px] leading-tight mt-1 whitespace-nowrap text-gray-800">{rooms} Room, {adults} Adults, {children} Child</h4>
                    </div>
                  </Popover>
                </div>
              </>
            ) : tab === "visa" ? (
              <>
                <div className="md:col-span-4 border rounded-xl p-4 hover:bg-gray-50 cursor-pointer bg-white">
                  <Popover
                    open={openPopover === "visa-cit"}
                    onOpenChange={(v) => setOpenPopover(v ? "visa-cit" : null)}
                    content={
                      <SelectionList
                        options={visaCitizenOptions}
                        onSelect={(v) => handleSelect(setCitizenOf, v)}
                      />
                    }
                    trigger="click" placement="bottomLeft"
                  >
                    <div>
                      <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Citizen of")}</p>
                      <div className={`mt-1 font-bold text-lg leading-tight ${!citizenOf ? "text-gray-400" : "text-gray-700"}`}>
                        {citizenOf || i18n.t("Select country")}
                      </div>
                    </div>
                  </Popover>
                </div>
                <div className={`md:col-span-4 border rounded-xl p-4 bg-white ${!citizenOf ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}`}>
                  <Popover
                    open={citizenOf ? openPopover === "visa-to" : false}
                    onOpenChange={(v) => citizenOf && setOpenPopover(v ? "visa-to" : null)}
                    content={
                      loadingTravellingTo ? (
                        <div className="p-4 text-sm text-gray-500">Loading...</div>
                      ) : (
                        <SelectionList
                          options={travellingToOptions}
                          onSelect={(v) => handleSelect(setTravellingTo, v)}
                        />
                      )
                    }
                    trigger="click" placement="bottomLeft"
                  >
                    <div>
                      <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Travelling to")}</p>
                      <div className={`mt-1 font-bold text-lg leading-tight ${!travellingTo ? "text-gray-400" : "text-gray-700"}`}>
                        {loadingTravellingTo ? "Loading..." : travellingTo || i18n.t("Select destination")}
                      </div>
                    </div>
                  </Popover>
                </div>
                <div className={`md:col-span-3 border rounded-xl p-4 bg-white ${!travellingTo ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}`}>
                  <Popover
                    open={travellingTo ? openPopover === "visa-cat" : false}
                    onOpenChange={(v) => travellingTo && setOpenPopover(v ? "visa-cat" : null)}
                    content={
                      loadingVisaCategory ? (
                        <div className="p-4 text-sm text-gray-500">Loading...</div>
                      ) : (
                        <SelectionList
                          options={visaCategoryOptions.map(o => o.label)}
                          onSelect={(label) => {
                            const found = visaCategoryOptions.find(o => o.label === label);
                            handleVisaCategorySelect(found);
                          }}
                        />
                      )
                    }
                    trigger="click" placement="bottomLeft"
                  >
                    <div>
                      <p className="text-[11px] text-gray-400 font-bold">{i18n.t("Visa Category")}</p>
                      <div className={`mt-1 font-bold text-lg leading-tight ${!visaCategory ? "text-gray-400" : "text-gray-700"}`}>
                        {loadingVisaCategory ? "Loading..." : visaCategory || i18n.t("Select category")}
                      </div>
                    </div>
                  </Popover>
                </div>
              </>
            ) : tab === "tour" && !isPackagePage ? (
              <>
                <div className="md:col-span-6 border rounded-xl p-4 hover:bg-gray-50 cursor-pointer bg-white">
                  <Popover open={openPopover === "tour-dest"} onOpenChange={(v) => setOpenPopover(v ? "tour-dest" : null)} content={<SelectionList options={filterData?.find(f => f.key === 'package_destination')?.values?.map(v => v.name?.[i18n.langCode] || v.name?.en || v.name) || []} onSelect={(v) => handleSelect(setDestination, v)} />} trigger="click" placement="bottomLeft">
                    <div>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{i18n.t("Destination")}</p>
                      <div className="mt-1 font-bold text-gray-700 text-lg leading-tight">{destination}</div>
                    </div>
                  </Popover>
                </div>
                <div className="md:col-span-5 border rounded-xl p-4 hover:bg-gray-50 bg-white">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{i18n.t("Prefered Date")}</p>
                  <DatePicker onChange={(d) => setStartDate(d)} placeholder="Select date" disabledDate={disabledDate} variant="borderless" className={`p-0 font-bold text-lg w-full mt-1 ${startDate ? "text-gray-700" : "text-gray-400"}`} value={startDate} format="DD MMM, YYYY" suffixIcon={null} dateRender={dateRender} />
                </div>
              </>
            ) : (
              // ── Flight (One Way / Round Trip) ──
              <>
                <div className="md:col-span-2 border rounded-xl p-4 hover:bg-gray-50 relative cursor-pointer bg-white">
                  <Popover open={openPopover === "flight-from"} onOpenChange={(v) => setOpenPopover(v ? "flight-from" : null)} content={<SelectionList options={filterData?.find(f => f.key === 'package_destination')?.values?.map(v => v.name?.[i18n.langCode] || v.name?.en || v.name) || []} onSelect={(v) => handleSelect(setFromLocation, v)} />} trigger="click" placement="bottomLeft">
                    <div>
                      <p className="text-[11px] text-gray-400 font-bold">From</p>
                      <h4 className="font-bold text-gray-700 text-lg leading-tight mt-1">{fromLocation}</h4>
                      <p className="text-[10px] text-gray-400 truncate">DAC, Hazrat Shahjalal Int....</p>
                    </div>
                  </Popover>
                  <div onClick={handleSwapLocations} className="absolute -right-4 md:-right-5 top-1/2 -translate-y-1/2 z-20 bg-[#00BCE4] text-white rounded-full p-1 border-2 border-white shadow-md cursor-pointer hover:bg-[#1A4FA0] transition-colors">
                    <FaExchangeAlt size={20} className="rotate-90 md:rotate-0" />
                  </div>
                </div>
                <div className="md:col-span-2 border rounded-xl p-4 hover:bg-gray-50 cursor-pointer bg-white">
                  <Popover open={openPopover === "flight-to"} onOpenChange={(v) => setOpenPopover(v ? "flight-to" : null)} content={<SelectionList options={filterData?.find(f => f.key === 'package_destination')?.values?.map(v => v.name?.[i18n.langCode] || v.name?.en || v.name) || []} onSelect={(v) => handleSelect(setToLocation, v)} />} trigger="click" placement="bottomLeft">
                    <div>
                      <p className="text-[11px] text-gray-400 font-bold">To</p>
                      <h4 className="font-bold text-gray-700 text-lg leading-tight mt-1">{toLocation}</h4>
                      <p className="text-[10px] text-gray-400">CXB, Cox's Bazar</p>
                    </div>
                  </Popover>
                </div>
                {/* Departure + Return: use RangePicker on desktop (side-by-side), single pickers on mobile (one at a time) */}
                <div className={`${tripType === "Round Trip" ? "md:col-span-4" : "md:col-span-2"} flex gap-3`}>
                  {tripType === "Round Trip" && !isMobile ? (
                    <div className="flex-1 md:col-span-4 border rounded-xl p-4 hover:bg-gray-50 bg-white relative">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <p className="text-[11px] text-gray-400 font-bold">Departure</p>
                          <button onClick={() => setRangeOpen(true)} className={`w-full text-left mt-1 p-0 font-bold text-lg ${startDate ? "text-gray-700" : "text-gray-400"}`}>
                            {startDate ? startDate.format("DD MMM, YYYY") : "Select date"}
                          </button>
                          <p className="text-[10px] text-gray-400">{startDate ? startDate.format("dddd") : ""}</p>
                        </div>

                        <div className="w-[1px] bg-gray-200 self-stretch" />

                        <div className="flex-1">
                          <p className="text-[11px] text-gray-400 font-bold">Return</p>
                          <button onClick={() => setRangeOpen(true)} className={`w-full text-left mt-1 p-0 font-bold text-lg ${endDate ? "text-gray-700" : "text-gray-400"}`}>
                            {endDate ? endDate.format("DD MMM, YYYY") : "Select date"}
                          </button>
                          <p className="text-[10px] text-gray-400">{endDate ? endDate.format("dddd") : ""}</p>
                        </div>
                      </div>

                      {/* Hidden RangePicker kept for calendar logic/positioning. Open controlled by `rangeOpen`. */}
                      <div className="mt-16" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                        <div style={{ position: 'relative', pointerEvents: 'auto' }}>
                          <DatePicker.RangePicker
                            value={[startDate, endDate]}
                            onChange={(vals) => {
                              setStartDate(vals?.[0] || null);
                              setEndDate(vals?.[1] || null);
                            }}
                            open={rangeOpen}
                            onOpenChange={(open) => setRangeOpen(open)}
                            placement="bottomLeft"
                            getPopupContainer={(trigger) => trigger?.parentElement || document.body}
                            popupStyle={{ zIndex: 10000 }}
                            disabledDate={disabledDate}
                            variant="borderless"
                            className={`opacity-0 h-0 w-0 p-0`}
                            format="DD MMM, YYYY"
                            suffixIcon={null}
                            dateRender={dateRender}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 border rounded-xl p-4 hover:bg-gray-50 bg-white">
                        <p className="text-[11px] text-gray-400 font-bold">Departure</p>
                        <DatePicker
                          onChange={(d) => setStartDate(d)}
                          onOpenChange={(open) => { if (tripType === "Round Trip") setDateOpenTarget(open ? 'start' : null); }}
                          open={tripType === "Round Trip" ? (dateOpenTarget === 'start') : undefined}
                          placement="bottomLeft"
                          getPopupContainer={(trigger) => trigger?.parentElement || document.body}
                          popupStyle={{ zIndex: 10000 }}
                          placeholder="Select date"
                          disabledDate={disabledDate}
                          variant="borderless"
                          className={`p-0 font-bold text-lg w-full mt-1 ${startDate ? "text-gray-700" : "text-gray-400"}`}
                          value={startDate}
                          format="DD MMM, YYYY"
                          suffixIcon={null}
                          dateRender={dateRender}
                        />
                        <p className="text-[10px] text-gray-400">{startDate ? startDate.format("dddd") : ""}</p>
                      </div>

                      {tripType === "Round Trip" && (
                        <div className="flex-1 border rounded-xl p-4 hover:bg-gray-50 bg-white">
                          <p className="text-[11px] text-gray-400 font-bold">Return</p>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <DatePicker
                                onChange={(d) => setEndDate(d)}
                                onOpenChange={(open) => { if (tripType === "Round Trip") setDateOpenTarget(open ? 'end' : null); }}
                                open={tripType === "Round Trip" ? (dateOpenTarget === 'end') : undefined}
                                placement="bottomLeft"
                                getPopupContainer={(trigger) => trigger?.parentElement || document.body}
                                popupStyle={{ zIndex: 10000 }}
                                placeholder="Select date"
                                disabledDate={disabledDate}
                                variant="borderless"
                                className={`p-0 font-bold text-lg w-full mt-1 ${endDate ? "text-gray-700" : "text-gray-400"}`}
                                value={endDate}
                                format="DD MMM, YYYY"
                                suffixIcon={null}
                                dateRender={dateRender}
                              />
                              <p className="text-[10px] text-gray-400">{endDate ? endDate.format("dddd") : ""}</p>
                            </div>
                            <FaTimesCircle className="text-gray-400 cursor-pointer" onClick={() => setEndDate(null)} />
                          </div>
                        </div>
                      )}
                    </> 
                  )}
                </div>

                <div className={`${tripType === "Round Trip" ? "md:col-span-3" : "md:col-span-5"} border rounded-xl p-4 hover:bg-gray-50 bg-white`}>
                  <Popover open={openPopover === "flight-guests"} onOpenChange={(v) => setOpenPopover(v ? "flight-guests" : null)} content={guestContent} trigger="click" placement="bottomRight">
                    <div className="cursor-pointer">
                      <p className="text-[11px] text-gray-400 font-bold">Traveller, Class</p>
                      <h4 className="font-bold text-gray-700 text-lg leading-tight mt-1">
                        {adults} Adult{adults > 1 ? "s" : ""}, {children} Child{children > 1 ? "ren" : ""}, {infants} Infant{infants > 1 ? "s" : ""}
                        {children > 0 && childrenAges.length > 0 && (
                          <span className="text-sm text-gray-500 block">Ages: {childrenAges.join(", ")}</span>
                        )}
                      </h4>
                      <p className="text-[10px] text-gray-400">{bookingClass}</p>
                    </div>
                  </Popover>
                </div>
              </>
            )}

            <div className="md:col-span-1 flex items-center justify-center">
              <button
                onClick={handleSearch}
                disabled={visaSearching}
                className="bg-[#1A4FA0] hover:bg-blue-900 text-white w-full h-full min-h-[60px] md:min-h-0 rounded-xl flex items-center justify-center shadow-lg transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {visaSearching ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaSearch size={20} />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default forwardRef(HeroFilters);