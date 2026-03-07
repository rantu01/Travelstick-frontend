import { FaMinus, FaPlus } from "react-icons/fa";
import React from "react";

const HotelGuestContent = ({
  rooms,
  setRooms,
  adults,
  setAdults,
  children,
  setChildren,
  withPets,
  setWithPets,
  onReset,
  onApply,
}) => (
  <div className="w-80 p-5 bg-white rounded-lg shadow-2xl border border-gray-100">
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-gray-700 font-bold text-base">Room</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setRooms(Math.max(1, rooms - 1))}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
              rooms > 1 ? "border-[#1a4fa0] text-[#1a4fa0]" : "border-gray-200 text-gray-300"
            }`}
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
      <div className="flex items-center justify-between">
        <span className="text-gray-700 font-bold text-base">Adults</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAdults(Math.max(1, adults - 1))}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
              adults > 1 ? "border-[#1a4fa0] text-[#1a4fa0]" : "border-gray-200 text-gray-300"
            }`}
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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-700 font-bold text-base">Child</p>
          <p className="text-[10px] text-gray-400">0-12 Years</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setChildren(Math.max(0, children - 1))}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
              children > 0 ? "border-[#1a4fa0] text-[#1a4fa0]" : "border-gray-200 text-gray-300"
            }`}
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
      <div className="mt-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-bold text-sm">Traveling with pets?</span>
          <div
            onClick={() => setWithPets(!withPets)}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              withPets ? "bg-red-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                withPets ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 leading-tight">
          Assistance animals are not classified as pets. {" "}
          <span className="text-[#1a4fa0] cursor-pointer hover:underline">
            Learn more about traveling with assistance animals.
          </span>
        </p>
      </div>
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onReset}
          className="text-[#1a4fa0] font-bold text-sm hover:underline"
        >
          Reset
        </button>
        <button
          onClick={onApply}
          className="border-[#1a4fa0] text-[#1a4fa0] px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-red-50 transition-all active:scale-95 shadow-sm"
        >
          Apply
          <span className="flex items-center justify-center w-4 h-4 rounded-full border border-[#1a4fa0] text-[10px]">
            ✓
          </span>
        </button>
      </div>
    </div>
  </div>
);

export default HotelGuestContent;
