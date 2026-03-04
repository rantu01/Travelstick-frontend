"use client";
import { FaGlobeAmericas } from "react-icons/fa";
import { FaShieldAlt } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import { FaBolt } from "react-icons/fa";

const FeatureBar = () => {
  return (
    <div className="w-full pt-28 md:pt-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">

          {/* Item 1 */}
          <div className="flex items-center gap-4">
            <FaGlobeAmericas className="text-blue-600 text-3xl" />
            <p className="text-gray-800 font-medium text-sm md:text-base">
              Largest Selection of Global Flights
            </p>
          </div>

          {/* Item 2 */}
          <div className="flex items-center gap-4">
            <FaShieldAlt className="text-yellow-500 text-3xl" />
            <p className="text-gray-800 font-medium text-sm md:text-base">
              Secure Payments & Protected Data
            </p>
          </div>

          {/* Item 3 */}
          <div className="flex items-center gap-4">
            <FaCreditCard className="text-teal-500 text-3xl" />
            <p className="text-gray-800 font-medium text-sm md:text-base">
              EMI Facilities with Major Banks
            </p>
          </div>

          {/* Item 4 */}
          <div className="flex items-center gap-4">
            <FaBolt className="text-red-500 text-3xl" />
            <p className="text-gray-800 font-medium text-sm md:text-base">
              Real-time Availability & Support
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeatureBar;