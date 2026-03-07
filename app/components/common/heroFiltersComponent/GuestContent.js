import { FaUser, FaMinus, FaPlus } from "react-icons/fa";
import React from "react";

const GuestContent = ({
  adults,
  setAdults,
  children,
  setChildren,
  childrenAges,
  setChildAge,
  infants,
  setInfants,
  bookingClass,
  setBookingClass,
  onApply,
}) => (
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
              <button
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1A4FA0] hover:text-[#1A4FA0] transition-colors"
              >
                <FaMinus size={8} />
              </button>
              <span className="w-4 text-center font-bold text-gray-700 text-sm">{adults}</span>
              <button
                onClick={() => setAdults(adults + 1)}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center bg-white text-[#1A4FA0] hover:bg-[#1A4FA0] hover:text-white transition-all"
              >
                <FaPlus size={8} />
              </button>
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
              <button
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1A4FA0] hover:text-[#1A4FA0] transition-colors"
              >
                <FaMinus size={8} />
              </button>
              <span className="w-4 text-center font-bold text-gray-700 text-sm">{children}</span>
              <button
                onClick={() => setChildren(children + 1)}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center bg-white text-[#1A4FA0] hover:bg-[#1A4FA0] hover:text-white transition-all"
              >
                <FaPlus size={8} />
              </button>
            </div>
          </div>
          {children > 0 && (
            <div className="ml-11 mt-2">
              <p className="text-xs font-semibold text-gray-600 mb-2">Children's Ages</p>
              <div className="flex flex-wrap gap-2">
                {childrenAges.map((age, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <label className="text-xs text-gray-500">Child {index + 1}</label>
                    <select
                      value={age}
                      onChange={(e) => setChildAge(index, parseInt(e.target.value))}
                      className="w-16 h-8 text-xs border border-gray-300 rounded px-1 focus:outline-none focus:border-[#1A4FA0]"
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 2).map((ageOption) => (
                        <option key={ageOption} value={ageOption}>
                          {ageOption}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              <button
                onClick={() => setInfants(Math.max(0, infants - 1))}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#1A4FA0] hover:text-[#1A4FA0] transition-colors"
              >
                <FaMinus size={8} />
              </button>
              <span className="w-4 text-center font-bold text-gray-700 text-sm">{infants}</span>
              <button
                onClick={() => setInfants(infants + 1)}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center bg-white text-[#1A4FA0] hover:bg-[#1A4FA0] hover:text-white transition-all"
              >
                <FaPlus size={8} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p className="text-base font-bold text-gray-800 mb-4 border-b pb-2">Booking Class</p>
        <div className="flex flex-col gap-3">
          {[
            "Economy",
            "Premium Economy",
            "First",
            "Business",
            "First Class",
          ].map((cls) => (
            <label key={cls} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="bookingClass"
                  className="sr-only"
                  checked={bookingClass === cls}
                  onChange={() => setBookingClass(cls)}
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    bookingClass === cls ? "border-[#1A4FA0]" : "border-gray-400 group-hover:border-[#1A4FA0]"
                  }`}
                >
                  {bookingClass === cls && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1A4FA0]"></div>
                  )}
                </div>
              </div>
              <span
                className={`text-sm font-semibold transition-colors ${
                  bookingClass === cls ? "text-gray-800" : "text-gray-500 group-hover:text-[#1A4FA0]"
                }`}
              >
                {cls}
              </span>
            </label>
          ))}
        </div>
      </div>
      <button
        onClick={onApply}
        className="w-full bg-[#1A4FA0] text-white py-3 rounded-lg font-bold hover:bg-[#123a7a] shadow-lg transition-all active:scale-[0.98]"
      >
        Apply
      </button>
    </div>
  </div>
);

export default GuestContent;
