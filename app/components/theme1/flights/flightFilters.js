"use client";
import { Checkbox, Radio, Slider, Button } from "antd";
import { useI18n } from "@/app/contexts/i18n";
import { ClockCircleOutlined, SunOutlined, MoonOutlined, CloudOutlined } from "@ant-design/icons";

const FlightFilters = ({ getData }) => {
  const i18n = useI18n();

  return (
    <div className="flex flex-col gap-[10px] w-full max-w-[300px]">
      
      {/* 1. Time Remaining Widget */}
      <div className="bg-white border border-[#E8EAE8] rounded-[10px] p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 text-[#3583FE]">
          <ClockCircleOutlined />
          <span className="text-[13px] font-medium text-[#05073C]">Time Remaining</span>
        </div>
        <span className="text-[15px] font-bold text-[#3583FE]">29:46</span>
      </div>

      {/* 2. Price Range with Slider */}
      <div className="bg-white border border-[#E8EAE8] rounded-[10px] overflow-hidden">
        <div className="p-4 border-b border-[#F5F5F5] flex justify-between items-center">
          <h4 className="text-[15px] font-bold text-[#05073C]">Price Range</h4>
          <span className="text-[10px] text-gray-400 opacity-50">▲</span>
        </div>
        <div className="p-4">
          <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
            Starts from <b className="text-[#05073C]">৳ 15,228 — ৳ 22,137</b> against your search. Price is subject to change.
          </p>
          <Slider 
            range 
            defaultValue={[15228, 22137]} 
            min={10000} 
            max={30000}
            trackStyle={[{ backgroundColor: '#3583FE' }]}
            handleStyle={[{ borderColor: '#3583FE' }, { borderColor: '#3583FE' }]}
          />
          <div className="text-center mt-2 text-[11px] font-bold text-[#05073C]">
            BDT 15,228 - BDT 22,137
          </div>
        </div>
      </div>

      {/* 3. Flight Schedules (Departure/Arrival Tabs) */}
      <div className="bg-white border border-[#E8EAE8] rounded-[10px] overflow-hidden">
        <div className="p-4 border-b border-[#F5F5F5] flex justify-between items-center">
          <h4 className="text-[15px] font-bold text-[#05073C]">Flight Schedules</h4>
          <span className="text-[10px] text-gray-400 opacity-50">▲</span>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div className="flex bg-[#F2F6FF] p-1 rounded-md">
            <button className="flex-1 py-1.5 text-[12px] font-medium bg-white shadow-sm rounded text-[#3583FE]">Departure</button>
            <button className="flex-1 py-1.5 text-[12px] font-medium text-gray-500">Arrival</button>
          </div>

          {/* Dhaka Departure */}
          <div>
            <p className="text-[12px] font-bold text-[#05073C] mb-3">Departure Dhaka: Anytime</p>
            <div className="grid grid-cols-2 gap-2">
              <TimeBox icon={<CloudOutlined />} label="12 AM-06 AM" />
              <TimeBox icon={<SunOutlined />} label="06 AM-12 PM" />
              <TimeBox icon={<SunOutlined />} label="12 PM-06 PM" />
              <TimeBox icon={<MoonOutlined />} label="06 PM-12 AM" />
            </div>
          </div>
          
          {/* Cox's Bazar Departure */}
          <div>
            <p className="text-[12px] font-bold text-[#05073C] mb-3">Departure Cox's Bazar: Anytime</p>
            <div className="grid grid-cols-2 gap-2">
              <TimeBox icon={<CloudOutlined />} label="12 AM-06 AM" />
              <TimeBox icon={<SunOutlined />} label="06 AM-12 PM" />
              <TimeBox icon={<SunOutlined />} label="12 PM-06 PM" />
              <TimeBox icon={<MoonOutlined />} label="06 PM-12 AM" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Airlines with Price Tags */}
      <div className="bg-white border border-[#E8EAE8] rounded-[10px] overflow-hidden">
        <div className="p-4 border-b border-[#F5F5F5] flex justify-between items-center">
          <h4 className="text-[15px] font-bold text-[#05073C]">Airlines</h4>
          <span className="text-[10px] text-gray-400 opacity-50">▲</span>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <AirlineItem label="NOVOAIR" price="16,334" />
          <AirlineItem label="US-Bangla Airlines" price="15,814" />
          <AirlineItem label="Air Astra" price="15,228" />
          <AirlineItem label="Biman Bangladesh Air..." price="15,379" />
        </div>
      </div>

      {/* 5. Number of Stops */}
      <div className="bg-white border border-[#E8EAE8] rounded-[10px] overflow-hidden">
        <div className="p-4 border-b border-[#F5F5F5] flex justify-between items-center">
          <h4 className="text-[15px] font-bold text-[#05073C]">Number of Stops</h4>
          <span className="text-[10px] text-gray-400 opacity-50">▲</span>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <Checkbox className="text-[13px] text-[#05073C] bg-[#F8F9FA] p-2 rounded w-full">Non-Stop</Checkbox>
          <Checkbox className="text-[13px] text-[#05073C]">1 Stop</Checkbox>
          <Checkbox className="text-[13px] text-[#05073C]">2 Stops</Checkbox>
        </div>
      </div>

      {/* 6. Baggage Policy */}
      <div className="bg-white border border-[#E8EAE8] rounded-[10px] overflow-hidden">
        <div className="p-4 border-b border-[#F5F5F5] flex justify-between items-center">
          <h4 className="text-[15px] font-bold text-[#05073C]">Baggage Policy</h4>
          <span className="text-[10px] text-gray-400 opacity-50">▲</span>
        </div>
        <div className="p-4 flex flex-col gap-3">
          {["20 Kg", "30 Kg", "35 Kg", "25 Kg", "1 Pieces"].map((item, i) => (
            <Checkbox key={i} className="text-[13px] text-[#05073C]">{item}</Checkbox>
          ))}
          <span className="text-[#3583FE] text-[12px] font-medium cursor-pointer mt-1">Show 3 More ∨</span>
        </div>
      </div>

    </div>
  );
};

// Helper Components
const TimeBox = ({ icon, label }) => (
  <div className="flex flex-col items-center justify-center border border-[#E8EAE8] rounded-md p-2 hover:border-[#3583FE] cursor-pointer transition-all">
    <div className="text-gray-400 text-[16px] mb-1 opacity-60">{icon}</div>
    <span className="text-[9px] text-gray-600 font-medium whitespace-nowrap uppercase">{label}</span>
  </div>
);

const AirlineItem = ({ label, price }) => (
  <div className="flex items-center justify-between">
    <Checkbox className="text-[12px] text-[#05073C]">{label}</Checkbox>
    <span className="text-[11px] font-bold text-gray-500 italic">৳ {price}</span>
  </div>
);

export default FlightFilters;