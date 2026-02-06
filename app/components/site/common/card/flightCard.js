"use client";
import Image from "next/image";
import { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdLocationOn } from "react-icons/md";
import { IoDiamondOutline, IoAirplane } from "react-icons/io5";
import { AiOutlineClockCircle } from "react-icons/ai";
import { HiOutlineCurrencyBangladeshi } from "react-icons/hi";

const FlightCard = ({ data }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // For Details Tab (DAC-CXB or CXB-DAC)

  return (
    <div className="w-full bg-white border border-[#E8EAE8] rounded-[15px] overflow-hidden shadow-sm hover:shadow-md transition-all mb-4">
      {/* --- Main Card Section --- */}
      <div className="flex flex-col md:flex-row">
        <div className="flex-grow p-5 flex flex-col gap-8">
          {data.segments.map((segment, idx) => (
            <div key={idx} className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-[150px]">
                <div className="w-10 h-10 relative">
                  <Image src={segment.logo} alt={segment.airline} fill className="object-contain" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#1A1A1A] uppercase">{segment.from} - {segment.to}</p>
                  <p className="text-[11px] text-gray-500 font-medium uppercase">{segment.airline}</p>
                  <p className="text-[10px] text-gray-400">{segment.duration}</p>
                </div>
              </div>

              <div className="flex flex-col min-w-[100px]">
                <p className="text-[16px] font-bold text-[#1A1A1A]">{segment.departure_time}</p>
                <p className="text-[11px] text-gray-500 font-medium">{segment.departure_date}</p>
                <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{segment.departure_airport}</p>
              </div>

              <div className="flex flex-col min-w-[100px]">
                <p className="text-[16px] font-bold text-[#1A1A1A]">{segment.arrival_time}</p>
                <p className="text-[11px] text-gray-500 font-medium">{segment.arrival_date}</p>
                <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{segment.arrival_airport}</p>
              </div>

              <div className="flex flex-col text-start min-w-[80px]">
                <p className="text-[14px] font-bold text-[#1A1A1A]">{segment.stops}</p>
                <p className="text-[11px] text-gray-500 font-medium uppercase">{segment.to_code}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full md:w-[180px] bg-[#F2F6FF] p-5 flex flex-col items-end justify-center border-l border-[#E8EAE8] gap-2">
          <div className="flex items-center gap-1 self-end mb-2">
            <span className="w-4 h-4 bg-green-600 rounded-sm flex items-center justify-center">
               <div className="w-1 h-2 border-r-2 border-b-2 border-white rotate-45 mb-0.5"></div>
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{data.flight_code}</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-[22px] font-bold text-[#1A1A1A]">
               <span className="text-[18px] mr-0.5">৳</span>
               {data.current_price.toLocaleString()}
            </div>
            <p className="text-[12px] text-gray-400 line-through">৳ {data.regular_price.toLocaleString()}</p>
          </div>
          <button className="w-full bg-[#1882FF] text-white font-bold py-2.5 rounded-full text-[14px] mt-2 flex items-center justify-center gap-2 hover:bg-[#0069D9]">
            Select <span className="text-[12px] opacity-80">{">"}</span>
          </button>
        </div>
      </div>

      {/* --- Footer Strip --- */}
      <div className="px-5 py-2 bg-white border-t border-[#F5F5F5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-1 bg-[#E8F5E9] rounded-full text-[11px] text-[#2E7D32] font-medium">
            <IoDiamondOutline className="text-[12px]" /> Partially Refundable
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-[#FFF8E1] rounded-full text-[11px] text-[#F57F17] font-bold">
            <HiOutlineCurrencyBangladeshi className="text-[14px]" /> 8
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-[#E3F2FD] rounded-full text-[11px] text-[#1976D2] font-medium">
            <AiOutlineClockCircle className="text-[12px]" /> Pay Later
          </div>
        </div>
        
        <button 
          onClick={() => setShowDetail(!showDetail)}
          className="text-[13px] font-bold text-[#1882FF] flex items-center gap-1 hover:underline"
        >
          {showDetail ? "Hide Detail" : "View Detail"} 
          {showDetail ? <MdKeyboardArrowUp className="text-lg" /> : <MdKeyboardArrowDown className="text-lg" />}
        </button>
      </div>

      {/* --- Hubuhu Detail Section (Expands on Click) --- */}
      {showDetail && (
        <div className="p-5 border-t border-[#F5F5F5] bg-[#F9FBFF] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Left Column: Flight Details Tab */}
            <div className="flex-grow">
              {/* Tab Header */}
              <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
                {data.segments.map((seg, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`px-6 py-2 text-[13px] font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === i ? 'bg-[#1882FF] text-white border-[#1882FF] rounded-t-md' : 'text-gray-500 border-transparent hover:text-[#1882FF]'}`}
                  >
                    {seg.from}-{seg.to} <span className="ml-2 font-normal opacity-80">{seg.duration}</span>
                  </button>
                ))}
              </div>

              {/* Journey Timeline UI */}
              <div className="bg-white p-6 rounded-lg border border-[#E8EAE8]">
                <div className="flex items-center gap-3 mb-6">
                   <MdLocationOn className="text-gray-400 text-xl" />
                   <p className="text-[13px] font-medium text-gray-700">Departure from <span className="font-bold text-[#1A1A1A]">{data.segments[activeTab].departure_airport}</span></p>
                </div>

                <div className="flex items-start gap-6 ml-2 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-[1px] border-l-2 border-dashed border-gray-200"></div>
                  
                  <div className="z-10 bg-white">
                    <Image src={data.segments[activeTab].logo} alt="airline" width={30} height={30} className="object-contain" />
                  </div>

                  <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-[15px] font-bold text-[#1A1A1A]">{data.segments[activeTab].from} - {data.segments[activeTab].to}</p>
                      <p className="text-[11px] text-gray-400 uppercase">{data.segments[activeTab].duration}</p>
                      <p className="text-[12px] font-bold text-gray-600 mt-2 uppercase">{data.segments[activeTab].airline}</p>
                      <p className="text-[11px] text-gray-400">Flight no: <span className="text-gray-600 font-medium">VQ921</span></p>
                    </div>

                    <div>
                      <p className="text-[15px] font-bold text-[#1A1A1A]">{data.segments[activeTab].departure_time}</p>
                      <p className="text-[12px] text-gray-500 font-medium">{data.segments[activeTab].departure_date}</p>
                      <p className="text-[11px] text-gray-400 mt-2">Class: <span className="text-gray-600 font-medium uppercase">ECONOMY-I (I)</span></p>
                    </div>

                    <div>
                      <p className="text-[15px] font-bold text-[#1A1A1A]">{data.segments[activeTab].arrival_time}</p>
                      <p className="text-[12px] text-gray-500 font-medium">{data.segments[activeTab].arrival_date}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                   <MdLocationOn className="text-[#1882FF] text-xl" />
                   <p className="text-[13px] font-medium text-gray-700">Destination at <span className="font-bold text-[#1A1A1A]">{data.segments[activeTab].arrival_airport}</span></p>
                </div>
              </div>
            </div>

            {/* Right Column: Baggage & Policy */}
            <div className="w-full lg:w-[350px]">
              <div className="flex bg-gray-100 p-1 rounded-md mb-4">
                <button className="flex-1 py-2 text-[13px] font-bold text-gray-600">Baggage</button>
                <button className="flex-1 py-2 text-[13px] font-bold bg-[#1882FF] text-white rounded shadow-sm">Policy</button>
              </div>

              <div className="bg-white p-5 rounded-lg border border-[#E8EAE8] text-[13px] leading-relaxed text-gray-600">
                <p className="mb-4">Refunds and Date Changes are done as per the following policies.</p>
                <p className="mb-4">Refund is calculated by deducting Airline's fee and ST fee from the paid amount.</p>
                <p className="mb-4">Date Change fee is calculated by adding Airline's fee, fare difference and ST fee.</p>
                
                <p className="font-bold text-[#1A1A1A] mt-4 mb-2">*Fees are shown for all traveler</p>
                <p className="text-[11px] opacity-70 italic">*ST Convenience fee is non-refundable. We cannot guarantee the accuracy of airline refund/date change fees as they are subject to change without prior notice.</p>
                
                <button className="text-[#1882FF] font-bold mt-4 hover:underline">Show More Information</button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default FlightCard;