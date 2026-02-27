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