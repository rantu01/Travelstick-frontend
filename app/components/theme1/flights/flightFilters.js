"use client";
import { Checkbox, Slider } from "antd";
import { useI18n } from "@/app/contexts/i18n";
import { ClockCircleOutlined, SunOutlined, MoonOutlined, CloudOutlined } from "@ant-design/icons";

const FlightFilters = ({ getData }) => {
  const i18n = useI18n();

  return (
    <div className="flex flex-col gap-[12px] w-full max-w-[310px]">
      
      {/* 1. Time Remaining Widget */}
      <div className="bg-white border border-[#E8EAE8] rounded-[10px] p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 text-[#3583FE]">
          <ClockCircleOutlined className="text-lg" />
          <span className="text-[15px] font-medium text-[#05073C]">Time Remaining</span>
        </div>
        <span className="text-[17px] font-bold text-[#3583FE]">29:46</span>
      </div>

      {/* 2. Price Range with Slider */}
      <div className="bg-white border border-[#E8EAE8] rounded-[10px] overflow-hidden">
        <div className="p-4 border-b border-[#F5F5F5] flex justify-between items-center">
          <h4 className="text-[16px] font-bold text-[#05073C]">Price Range</h4>
          <span className="text-[12px] text-gray-400 opacity-50">▲</span>
        </div>
        <div className="p-4">
          <p className="text-[13px] text-gray-500 mb-4 leading-relaxed">
            Starts from <b className="text-[#05073C]">৳ 15,228 — ৳ 22,137</b> against your search.
          </p>
          <Slider 
            range 
            defaultValue={[15228, 22137]} 
            min={10000} 
            max={30000}
            trackStyle={[{ backgroundColor: '#3583FE' }]}
            handleStyle={[{ borderColor: '#3583FE' }, { borderColor: '#3583FE' }]}
          />
          <div className="text-center mt-2 text-[13px] font-bold text-[#05073C]">
            BDT 15,228 - BDT 22,137
          </div>
        </div>
      </div>

      {/* 3. Flight Schedules */}
      <div className="bg-white border border-[#E8EAE8] rounded-[10px] overflow-hidden">
        <div className="p-4 border-b border-[#F5F5F5] flex justify-between items-center">
          <h4 className="text-[16px] font-bold text-[#05073C]">Flight Schedules</h4>
          <span className="text-[12px] text-gray-400 opacity-50">▲</span>
        </div>
        <div className="p-4 flex flex-col gap-5">
          <div className="flex bg-[#F2F6FF] p-1 rounded-md">
            <button className="flex-1 py-2 text-[13px] font-medium bg-white shadow-sm rounded text-[#3583FE]">Departure</button>
            <button className="flex-1 py-2 text-[13px] font-medium text-gray-500">Arrival</button>
          </div>

          <div>
            <p className="text-[13px] font-bold text-[#05073C] mb-3">Departure Dhaka: Anytime</p>
            <div className="grid grid-cols-2 gap-2">
              <TimeBox icon={<CloudOutlined />} label="12 AM-06 AM" />
              <TimeBox icon={<SunOutlined />} label="06 AM-12 PM" />
              <TimeBox icon={<SunOutlined />} label="12 PM-06 PM" />
              <TimeBox icon={<MoonOutlined />} label="06 PM-12 AM" />
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-5">
          <div className="flex bg-[#F2F6FF] p-1 rounded-md">
            <button className="flex-1 py-2 text-[13px] font-medium bg-white shadow-sm rounded text-[#3583FE]">Departure</button>
            <button className="flex-1 py-2 text-[13px] font-medium text-gray-500">Arrival</button>
          </div>

          <div>
            <p className="text-[13px] font-bold text-[#05073C] mb-3">Departure Cox's Bazar: Anytime</p>
            <div className="grid grid-cols-2 gap-2">
              <TimeBox icon={<CloudOutlined />} label="12 AM-06 AM" />
              <TimeBox icon={<SunOutlined />} label="06 AM-12 PM" />
              <TimeBox icon={<SunOutlined />} label="12 PM-06 PM" />
              <TimeBox icon={<MoonOutlined />} label="06 PM-12 AM" />
            </div>
          </div>
        </div>
      </div>


      {/* 4. Airlines */}
      <div className="bg-white border border-[#E8EAE8] rounded-[10px] overflow-hidden">
        <div className="p-4 border-b border-[#F5F5F5] flex justify-between items-center">
          <h4 className="text-[16px] font-bold text-[#05073C]">Airlines</h4>
          <span className="text-[12px] text-gray-400 opacity-50">▲</span>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <AirlineItem label="NOVOAIR" count="10" price="16,334" />
          <AirlineItem label="US-Bangla Airlines" count="14" price="15,814" />
          <AirlineItem label="Air Astra" count="8" price="15,228" />
          <AirlineItem label="Biman Bangladesh" count="12" price="15,379" />
        </div>
      </div>

      {/* NEW: Transit Time Section */}
      <div className="bg-white border border-[#E8EAE8] rounded-[10px] overflow-hidden">
        <div className="p-4 border-b border-[#F5F5F5] flex justify-between items-center">
          <h4 className="text-[16px] font-bold text-[#05073C]">Transit Time</h4>
          <span className="text-[12px] text-gray-400 opacity-50">▲</span>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <FilterItem label="Less than 5h" count="12" />
          <FilterItem label="More than 5h" count="8" />
          <FilterItem label="Less than 10h" count="15" />
          <FilterItem label="More than 10h" count="4" />
        </div>
      </div>

      {/* 5. Number of Stops */}
      <div className="bg-white border border-[#E8EAE8] rounded-[10px] overflow-hidden">
        <div className="p-4 border-b border-[#F5F5F5] flex justify-between items-center">
          <h4 className="text-[16px] font-bold text-[#05073C]">Number of Stops</h4>
          <span className="text-[12px] text-gray-400 opacity-50">▲</span>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <FilterItem label="Non-Stop" count="15" />
          <FilterItem label="1 Stop" count="20" />
          <FilterItem label="2 Stops" count="5" />
        </div>
      </div>

      

      

      {/* 6. Baggage Policy */}
      <div className="bg-white border border-[#E8EAE8] rounded-[10px] overflow-hidden">
        <div className="p-4 border-b border-[#F5F5F5] flex justify-between items-center">
          <h4 className="text-[16px] font-bold text-[#05073C]">Baggage Policy</h4>
          <span className="text-[12px] text-gray-400 opacity-50">▲</span>
        </div>
        <div className="p-4 flex flex-col gap-3">
          {["20 Kg", "30 Kg", "35 Kg", "25 Kg"].map((item, i) => (
            <Checkbox key={i} className="text-[14px] text-[#05073C]">{item}</Checkbox>
          ))}
          <span className="text-[#3583FE] text-[13px] font-medium cursor-pointer mt-1">Show More ∨</span>
        </div>
      </div>

    </div>
  );
};

// Helper Components
const TimeBox = ({ icon, label }) => (
  <div className="flex flex-col items-center justify-center border border-[#E8EAE8] rounded-md p-2 hover:border-[#3583FE] cursor-pointer transition-all">
    <div className="text-gray-400 text-[18px] mb-1 opacity-70">{icon}</div>
    <span className="text-[10px] text-gray-600 font-bold whitespace-nowrap uppercase text-center">{label}</span>
  </div>
);

// Unified filter item for Stops & Transit
const FilterItem = ({ label, count }) => (
  <div className="flex items-center justify-between">
    <Checkbox className="text-[14px] text-[#05073C] font-medium">{label} ({count})</Checkbox>
  </div>
);

// Specialized for Airlines with Price
const AirlineItem = ({ label, count, price }) => (
  <div className="flex items-center justify-between">
    <Checkbox className="text-[14px] text-[#05073C] font-medium">
        {label} <span className="text-gray-400 font-normal">({count})</span>
    </Checkbox>
    <span className="text-[13px] font-bold text-gray-600 italic">৳ {price}</span>
  </div>
);

export default FlightFilters;