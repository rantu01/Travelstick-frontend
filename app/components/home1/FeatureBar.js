"use client";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaAward } from "react-icons/fa6";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaHandPointer } from "react-icons/fa";

const FeatureBar = () => {
  return (
    <div className="w-full pt-28 md:pt-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">

          {/* Item 1 */}
          <div className="flex items-center gap-4">
            <FaMapMarkedAlt className="text-blue-600 text-3xl" />
            <p className="text-gray-800 font-medium text-sm md:text-base">
              Top Travel App in Bangladesh
            </p>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-4">
            <FaAward className="text-yellow-500 text-3xl" />
            <p className="text-gray-800 font-medium text-sm md:text-base">
              Travel With Confidence
            </p>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-4">
            <FaMoneyBillWave className="text-teal-500 text-3xl" />
            <p className="text-gray-800 font-medium text-sm md:text-base">
              Pay The Way You Want
            </p>
          </div>

          {/* Item 4 */}
          <div className="flex items-center gap-4">
            <FaHandPointer className="text-red-500 text-3xl" />
            <p className="text-gray-800 font-medium text-sm md:text-base">
              Instant Bookings, Anytime, Anywhere
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeatureBar;