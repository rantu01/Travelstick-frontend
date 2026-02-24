"use client";
import { Drawer, Empty, Popover, DatePicker } from "antd";
import { useEffect, useState } from "react";
import Banner from "@/app/components/site/common/component/Banner";
import React from "react";
import { useI18n } from "@/app/contexts/i18n";
import Image from "next/image";
import HotelFilters from "../../common/hotelFilters";
import HotelCard from "../../site/common/card/hotelCard";
import { useFetch } from "@/app/helper/hooks";
import { getAllPublicHotel } from "@/app/helper/backend";
import Banner2 from "../../site/common/component/Banner2";
import dayjs from "dayjs";
import { FaUser, FaMinus, FaPlus, FaTimesCircle, FaSearch } from "react-icons/fa";

const HotelsPage = ({ destination: initialDest, hotelType, roomType, reputation, theme }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [data, getData] = useFetch(getAllPublicHotel, { limit: 100 }, false);

  // --- Form States (Inspired by HeroFilters) ---
  const [searchDest, setSearchDest] = useState(undefined);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [openPopover, setOpenPopover] = useState(null);

  useEffect(() => {
    getData({
      destination: searchDest,
      hotel_type: hotelType,
      room_type: roomType,
      star: reputation,
    });
  }, [searchDest, hotelType, roomType, reputation]);

  const i18n = useI18n();

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const handleSearch = () => {
    getData({
      destination: searchDest,
      // অন্য প্যারামিটার প্রয়োজন হলে এখানে যোগ করতে পারেন
    });
  };

  const SelectionList = ({ options, onSelect }) => (
    <div className="flex flex-col w-60 max-h-64 overflow-y-auto bg-white rounded-md shadow-lg border border-gray-100">
      {options.map((opt, idx) => (
        <button
          key={idx}
          onClick={() => { onSelect(opt); setOpenPopover(null); }}
          className="text-left px-4 py-3 hover:bg-gray-50 text-sm font-semibold text-gray-700 border-b border-gray-50 last:border-none"
        >
          {opt}
        </button>
      ))}
    </div>
  );

  const guestContent = (
    <div className="w-80 p-5 bg-white rounded-lg shadow-2xl border border-gray-100">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-base font-bold text-gray-800 mb-4 border-b pb-2">Travellers & Rooms</p>
          <div className="flex flex-col gap-5">
            {/* Adult */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1A4FA0]">
                  <FaUser size={12} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700">Adult</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400"><FaMinus size={8} /></button>
                <span className="w-4 text-center font-bold text-gray-700 text-sm">{adults}</span>
                <button onClick={() => setAdults(adults + 1)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center bg-white text-[#1A4FA0]"><FaPlus size={8} /></button>
              </div>
            </div>
            {/* Rooms */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1A4FA0]">
                  <div className="text-[10px] font-bold">R</div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700">Rooms</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setRooms(Math.max(1, rooms - 1))} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400"><FaMinus size={8} /></button>
                <span className="w-4 text-center font-bold text-gray-700 text-sm">{rooms}</span>
                <button onClick={() => setRooms(rooms + 1)} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center bg-white text-[#1A4FA0]"><FaPlus size={8} /></button>
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => setOpenPopover(null)} className="w-full bg-[#1A4FA0] text-white py-3 rounded-lg font-bold hover:bg-[#123a7a] transition-all">Apply</button>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {
        theme === 'one' ?
          <Banner title="Hotels" /> :
          <Banner2 title="Hotels" />
      }

      {/* --- Workable Search Section (Inspired by HeroFilters) --- */}
      <div className="travel-container -mt-10 relative z-20">
        <div className="bg-white rounded-xl shadow-xl flex flex-col md:flex-row items-stretch border border-gray-200 overflow-hidden">

          {/* Destination */}
          <div className="flex-1 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer group">
            <div className="flex justify-between items-center">
              <Popover
                open={openPopover === 'dest'}
                onOpenChange={(v) => setOpenPopover(v ? 'dest' : null)}
                content={<SelectionList options={["Dhaka, Bangladesh", "Chittagong", "Sylhet", "Cox's Bazar"]} onSelect={(v) => setSearchDest(v)} />}
                trigger="click"
                placement="bottomLeft"
              >
                <div className="flex-1">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Destination</p>
                  <div className="mt-1 font-bold text-gray-700 text-lg leading-tight truncate">
                    {searchDest || "Select City"}
                  </div>
                </div>
              </Popover>

              {/* Remove/Cross Button */}
              {searchDest && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Popover ওপেন হওয়া আটকানোর জন্য
                    setSearchDest(undefined);
                  }}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                >
                  <FaTimesCircle size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Check In */}
          <div className="flex-1 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Check In</p>
            <DatePicker
              onChange={(d) => setStartDate(d)}
              placeholder="Select date"
              disabledDate={disabledDate}
              variant="borderless"
              className={`p-0 font-bold text-lg w-full mt-1 ${startDate ? "text-gray-700" : "text-gray-400"}`}
              value={startDate} format="DD MMM, YYYY" suffixIcon={null}
            />
          </div>

          {/* Check Out */}
          <div className="flex-1 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Check Out</p>
            <div className="flex items-center justify-between">
              <DatePicker
                onChange={(d) => setEndDate(d)}
                placeholder="Select date"
                disabledDate={(current) => current && current < (startDate || dayjs().startOf('day'))}
                variant="borderless"
                className={`p-0 font-bold text-lg w-full mt-1 ${endDate ? "text-gray-700" : "text-gray-400"}`}
                value={endDate} format="DD MMM, YYYY" suffixIcon={null}
              />
              {endDate && <FaTimesCircle className="text-gray-300 hover:text-red-400 cursor-pointer" onClick={() => setEndDate(null)} />}
            </div>
          </div>

          {/* Room & Guests */}
          <div className="flex-1 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer">
            <Popover
              open={openPopover === 'guests'}
              onOpenChange={(v) => setOpenPopover(v ? 'guests' : null)}
              content={guestContent} trigger="click" placement="bottomRight"
            >
              <div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Room & Guests</p>
                <h4 className="font-bold text-gray-700 text-lg leading-tight mt-1 truncate">
                  {rooms} Room, {adults + children + infants} Guest
                </h4>
              </div>
            </Popover>
          </div>

          {/* Search Button */}
          <div className="p-3 bg-white flex items-center justify-center">
            <button
              onClick={handleSearch}
              className="bg-[#1A4FA0] hover:bg-blue-900 text-white w-full md:w-16 h-12 md:h-14 rounded-lg flex items-center justify-center shadow-lg transition-all active:scale-95"
            >
              <FaSearch size={20} className="md:hidden mr-2" />
              <span className="md:hidden font-bold">Search Hotels</span>
              <FaSearch size={20} className="hidden md:block" />
            </button>
          </div>

        </div>
      </div>

      <div className="travel-container xl:mt-[106px] lg:mt-[90px] md:mt-20 xm:mt-16 mt-12 relative pb-20">

        {/* মোবাইল ফিল্টার বাটন */}
        <div className="flex gap-2 items-center justify-end md:hidden mb-4 overflow-hidden">
          <button
            className="text-xl p-2 border border-gray-300 rounded-md"
            onClick={() => setOpenDrawer(true)}
          >
            <Image
              src="/theme1/filter.png"
              alt="Filter"
              width={20}
              height={20}
            />
          </button>
          <p className="font-semibold text-[#000000]">{i18n.t("Filters")}</p>
        </div>

        {/* মোবাইল ড্রয়ার */}
        <Drawer
          title={i18n.t("Filters")}
          onClose={() => setOpenDrawer(false)}
          open={openDrawer}
          className="sm:hidden"
        >
          <HotelFilters getData={getData} />
        </Drawer>

        <div className="flex flex-col md:flex-row xl:gap-8 lg:gap-6 md:gap-4 gap-3">

          {/* সাইডবার ফিল্টার (Desktop) */}
          <div className="w-full md:w-[30%] xl:w-[25%] hidden md:block">
            <div className="sticky top-24">
              <HotelFilters getData={getData} />
            </div>
          </div>

          {/* হোটেল কার্ড গ্রিড */}
          <div className="w-full md:w-[70%] xl:w-[75%]">
            {
              data?.docs?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-4 md:gap-6">
                  {
                    data?.docs?.map((item, index) => (
                      <HotelCard key={index} data={item} index={index} />
                    ))
                  }
                </div>
              ) : (
                <div className="flex justify-center items-center min-h-[300px] w-full bg-gray-50 rounded-2xl">
                  <Empty description="No Hotels Found" />
                </div>
              )
            }
          </div>

        </div>
      </div>
    </div>
  );
};

export default HotelsPage;