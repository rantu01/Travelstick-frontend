"use client";
import { useState } from "react";
import { DatePicker } from "antd";
import { FaExchangeAlt, FaSearch, FaTimesCircle, FaPlus } from "react-icons/fa";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const FlightSearchBar = ({ defaultTo }) => {
  const router = useRouter();

  const [tripType, setTripType] = useState("Round Trip");
  
  // Multi-city logic handle করার জন্য flights array
  const [flights, setFlights] = useState([
    { from: "Dhaka", to: defaultTo || "Cox's Bazar", departure: null },
  ]);
  
  const [returnDate, setReturnDate] = useState(null);

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const handleSwap = (index) => {
    const newFlights = [...flights];
    const temp = newFlights[index].from;
    newFlights[index].from = newFlights[index].to;
    newFlights[index].to = temp;
    setFlights(newFlights);
  };

  const updateFlight = (index, field, value) => {
    const newFlights = [...flights];
    newFlights[index][field] = value;
    setFlights(newFlights);
  };

  const addFlight = () => {
    if (flights.length < 5) {
      setFlights([...flights, { from: "", to: "", departure: null }]);
    }
  };

  const removeFlight = (index) => {
    const newFlights = flights.filter((_, i) => i !== index);
    setFlights(newFlights);
  };

  const handleSearch = () => {
    const query = new URLSearchParams();
    query.append("type", tripType);
    
    flights.forEach((f, i) => {
      query.append(`from${i}`, f.from);
      query.append(`to${i}`, f.to);
      if (f.departure) query.append(`dep${i}`, f.departure.format("YYYY-MM-DD"));
    });

    if (tripType === "Round Trip" && returnDate)
      query.append("return", returnDate.format("YYYY-MM-DD"));

    router.push(`/flight?${query.toString()}`);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
      
      {/* Trip Type */}
      <div className="flex gap-3 mb-4">
        {["One Way", "Round Trip", "Multi City"].map((type) => (
          <button
            key={type}
            onClick={() => {
              setTripType(type);
              if (type !== "Multi City") setFlights([flights[0]]);
            }}
            className={`px-4 py-1.5 rounded-md text-xs font-bold border ${
              tripType === type
                ? "bg-[#00BCE4] text-white border-[#00BCE4]"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Search Grid Container */}
      <div className="space-y-3">
        {flights.map((flight, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-12 border rounded-xl overflow-hidden relative">
            
            {/* From */}
            <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-4 relative">
              <p className="text-xs text-gray-400 font-bold">From</p>
              <input 
                className="font-bold text-lg mt-1 w-full outline-none" 
                value={flight.from} 
                onChange={(e) => updateFlight(index, "from", e.target.value)}
              />
              <div
                onClick={() => handleSwap(index)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-[#00BCE4] text-white rounded-full p-1 cursor-pointer z-10 border-2 border-white"
              >
                <FaExchangeAlt size={12} />
              </div>
            </div>

            {/* To */}
            <div className="md:col-span-3 border-b md:border-b-0 md:border-r p-4">
              <p className="text-xs text-gray-400 font-bold">To</p>
              <input 
                className="font-bold text-lg mt-1 w-full outline-none" 
                value={flight.to} 
                onChange={(e) => updateFlight(index, "to", e.target.value)}
              />
            </div>

            {/* Departure */}
            <div className={`${tripType === "Round Trip" ? "md:col-span-2" : "md:col-span-4"} border-b md:border-b-0 md:border-r p-4`}>
              <p className="text-xs text-gray-400 font-bold">Departure</p>
              <DatePicker
                onChange={(d) => updateFlight(index, "departure", d)}
                disabledDate={disabledDate}
                variant="borderless"
                className="p-0 font-bold text-lg w-full mt-1"
                value={flight.departure}
                format="DD MMM, YYYY"
                placeholder="Select date"
              />
            </div>

            {/* Return (Only for Round Trip) */}
            {tripType === "Round Trip" && index === 0 && (
              <div className="md:col-span-2 border-b md:border-b-0 md:border-r p-4">
                <p className="text-xs text-gray-400 font-bold">Return</p>
                <div className="flex items-center justify-between">
                  <DatePicker
                    onChange={(d) => setReturnDate(d)}
                    disabledDate={disabledDate}
                    variant="borderless"
                    className="p-0 font-bold text-lg w-full mt-1"
                    value={returnDate}
                    format="DD MMM, YYYY"
                    placeholder="Select date"
                  />
                </div>
              </div>
            )}

            {/* Remove Flight Button (For Multi City) */}
            {tripType === "Multi City" && flights.length > 1 && (
                <button 
                  onClick={() => removeFlight(index)}
                  className="absolute -right-2 -top-2 text-red-400 bg-white rounded-full shadow-md"
                >
                    <FaTimesCircle size={20} />
                </button>
            )}

            {/* Search Button (Hidden in rows except last or special handling) */}
            {tripType !== "Multi City" && (
                <div className="md:col-span-2 flex items-center justify-center p-4">
                    <button
                        onClick={handleSearch}
                        className="bg-[#1A4FA0] hover:bg-blue-900 text-white w-full h-12 rounded-lg flex items-center justify-center gap-2 font-bold"
                    >
                        <FaSearch /> Search
                    </button>
                </div>
            )}
          </div>
        ))}
      </div>

      {/* Multi City Bottom Controls */}
      {tripType === "Multi City" && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
          <button
            onClick={addFlight}
            disabled={flights.length >= 5}
            className="border-2 border-[#1A4FA0] text-[#1A4FA0] px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-50 transition-all"
          >
            <FaPlus size={14} /> Add Another Flight
          </button>

          <button
            onClick={handleSearch}
            className="bg-[#1A4FA0] hover:bg-blue-900 text-white px-12 h-12 rounded-lg flex items-center justify-center gap-2 font-bold min-w-[200px]"
          >
            <FaSearch /> Search
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightSearchBar;