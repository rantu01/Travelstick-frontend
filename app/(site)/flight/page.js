"use client";
import FlightsPage from "@/app/components/theme1/flights/flights";
import { useSearchParams } from "next/navigation";

const Flights = () => {
  const params = useSearchParams();
  
  // URL parameters nibo search engine theke
  const from = params.get("from");
  const to = params.get("to");
  const date = params.get("date");
  const flightClass = params.get("class");

  return (
    <div>
      <FlightsPage 
        from={from} 
        to={to} 
        date={date} 
        flightClass={flightClass} 
        theme="one" 
      />
    </div>
  );
}

export default Flights;