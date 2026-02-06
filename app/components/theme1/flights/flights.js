"use client";
import { Drawer, Empty } from "antd";
import { useState } from "react";
import Image from "next/image";
import Banner from "../../site/common/component/Banner";
import FlightFilters from "./flightFilters";
import FlightCard from "../../site/common/card/flightCard";

// FAKE DATA for UI
const FAKE_FLIGHTS = [
    {
        _id: "1",
        flight_code: "STLRS DQ126",
        current_price: 8621,
        regular_price: 9998,
        segments: [
            {
                airline: "NOVOAIR",
                logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdeRfGhoJbGk0a5oPGfKB6YAl7WvtTWFwDLg&s",
                from: "DAC",
                to: "CXB",
                from_code: "DAC",
                to_code: "CXB",
                departure_time: "7:10 AM",
                departure_date: "7 Feb, Saturday",
                departure_airport: "Hazrat Shahjalal...",
                arrival_time: "8:15 AM",
                arrival_date: "7 Feb, Saturday",
                arrival_airport: "Cox's Bazar Airp...",
                duration: "1hr 5min",
                stops: "Non-Stop"
            },
            {
                airline: "NOVOAIR",
                logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdeRfGhoJbGk0a5oPGfKB6YAl7WvtTWFwDLg&s",
                from: "CXB",
                to: "DAC",
                from_code: "CXB",
                to_code: "DAC",
                departure_time: "9:55 AM",
                departure_date: "9 Feb, Monday",
                departure_airport: "Cox's Bazar Airp...",
                arrival_time: "11:00 AM",
                arrival_date: "9 Feb, Monday",
                arrival_airport: "Hazrat Shahjalal...",
                duration: "1hr 5min",
                stops: "Non-Stop"
            }
        ]
    },
    {
        _id: "2",
        flight_code: "USB BS143",
        current_price: 9200,
        regular_price: 10500,
        segments: [
            {
                airline: "US-Bangla",
                logo: "https://images.seeklogo.com/logo-png/53/2/us-bangla-airlines-logo-png_seeklogo-534134.png",
                from: "DAC",
                to: "CGP",
                from_code: "DAC",
                to_code: "CGP",
                departure_time: "10:30 AM",
                departure_date: "10 Feb, Tuesday",
                departure_airport: "Hazrat Shahjalal...",
                arrival_time: "11:25 AM",
                arrival_date: "10 Feb, Tuesday",
                arrival_airport: "Shah Amanat Intl...",
                duration: "55min",
                stops: "Non-Stop"
            },
            {
                airline: "US-Bangla",
                logo: "https://images.seeklogo.com/logo-png/53/2/us-bangla-airlines-logo-png_seeklogo-534134.png",
                from: "CGP",
                to: "DAC",
                from_code: "CGP",
                to_code: "DAC",
                departure_time: "4:00 PM",
                departure_date: "12 Feb, Thursday",
                departure_airport: "Shah Amanat Intl...",
                arrival_time: "4:55 PM",
                arrival_date: "12 Feb, Thursday",
                arrival_airport: "Hazrat Shahjalal...",
                duration: "55min",
                stops: "Non-Stop"
            }
        ]
    },
    {
        _id: "3",
        flight_code: "ASTRA 2A45",
        current_price: 7500,
        regular_price: 8200,
        segments: [
            {
                airline: "Air Astra",
                logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYAqp5WIR04hrlVzT_iaz5DhJF5iKCGR48qg&s",
                from: "DAC",
                to: "SPD",
                from_code: "DAC",
                to_code: "SPD",
                departure_time: "1:20 PM",
                departure_date: "15 Feb, Sunday",
                departure_airport: "Hazrat Shahjalal...",
                arrival_time: "2:20 PM",
                arrival_date: "15 Feb, Sunday",
                arrival_airport: "Saidpur Airport",
                duration: "1hr 0min",
                stops: "Non-Stop"
            },
            {
                airline: "Air Astra",
                logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYAqp5WIR04hrlVzT_iaz5DhJF5iKCGR48qg&s",
                from: "SPD",
                to: "DAC",
                from_code: "SPD",
                to_code: "DAC",
                departure_time: "3:45 PM",
                departure_date: "18 Feb, Wednesday",
                departure_airport: "Saidpur Airport",
                arrival_time: "4:45 PM",
                arrival_date: "18 Feb, Wednesday",
                arrival_airport: "Hazrat Shahjalal...",
                duration: "1hr 0min",
                stops: "Non-Stop"
            }
        ]
    },
    {
        _id: "4",
        flight_code: "BIMAN BG071",
        current_price: 11000,
        regular_price: 13500,
        segments: [
            {
                airline: "Biman Bangladesh",
                logo: "https://www.logo.wine/a/logo/Biman_Bangladesh_Airlines/Biman_Bangladesh_Airlines-Logo.wine.svg",
                from: "DAC",
                to: "ZYL",
                from_code: "DAC",
                to_code: "ZYL",
                departure_time: "8:00 AM",
                departure_date: "20 Feb, Friday",
                departure_airport: "Hazrat Shahjalal...",
                arrival_time: "8:45 AM",
                arrival_date: "20 Feb, Friday",
                arrival_airport: "Osmani Intl Airport",
                duration: "45min",
                stops: "Non-Stop"
            },
            {
                airline: "Biman Bangladesh",
                logo: "https://www.logo.wine/a/logo/Biman_Bangladesh_Airlines/Biman_Bangladesh_Airlines-Logo.wine.svg",
                from: "ZYL",
                to: "DAC",
                from_code: "ZYL",
                to_code: "DAC",
                departure_time: "6:30 PM",
                departure_date: "22 Feb, Sunday",
                departure_airport: "Osmani Intl Airport",
                arrival_time: "7:15 PM",
                arrival_date: "22 Feb, Sunday",
                arrival_airport: "Hazrat Shahjalal...",
                duration: "45min",
                stops: "Non-Stop"
            }
        ]
    },
    {
        _id: "5",
        flight_code: "NV 303",
        current_price: 10500,
        regular_price: 12000,
        segments: [
            {
                airline: "NOVOAIR",
                logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdeRfGhoJbGk0a5oPGfKB6YAl7WvtTWFwDLg&s",
                from: "DAC",
                to: "JSR",
                from_code: "DAC",
                to_code: "JSR",
                departure_time: "2:00 PM",
                departure_date: "25 Feb, Wednesday",
                departure_airport: "Hazrat Shahjalal...",
                arrival_time: "2:50 PM",
                arrival_date: "25 Feb, Wednesday",
                arrival_airport: "Jashore Airport",
                duration: "50min",
                stops: "Non-Stop"
            },
            {
                airline: "NOVOAIR",
                logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdeRfGhoJbGk0a5oPGfKB6YAl7WvtTWFwDLg&s",
                from: "JSR",
                to: "DAC",
                from_code: "JSR",
                to_code: "DAC",
                departure_time: "4:30 PM",
                departure_date: "27 Feb, Friday",
                departure_airport: "Jashore Airport",
                arrival_time: "5:20 PM",
                arrival_date: "27 Feb, Friday",
                arrival_airport: "Hazrat Shahjalal...",
                duration: "50min",
                stops: "Non-Stop"
            }
        ]
    },
    {
        _id: "6",
        flight_code: "USB BS202",
        current_price: 14500,
        regular_price: 16000,
        segments: [
            {
                airline: "US-Bangla",
                logo: "https://images.seeklogo.com/logo-png/53/2/us-bangla-airlines-logo-png_seeklogo-534134.png",
                from: "DAC",
                to: "BZR",
                from_code: "DAC",
                to_code: "BZR",
                departure_time: "11:45 AM",
                departure_date: "01 Mar, Sunday",
                departure_airport: "Hazrat Shahjalal...",
                arrival_time: "12:40 PM",
                arrival_date: "01 Mar, Sunday",
                arrival_airport: "Barishal Airport",
                duration: "55min",
                stops: "Non-Stop"
            },
            {
                airline: "US-Bangla",
                logo: "https://images.seeklogo.com/logo-png/53/2/us-bangla-airlines-logo-png_seeklogo-534134.png",
                from: "BZR",
                to: "DAC",
                from_code: "BZR",
                to_code: "DAC",
                departure_time: "2:15 PM",
                departure_date: "03 Mar, Tuesday",
                departure_airport: "Barishal Airport",
                arrival_time: "3:10 PM",
                arrival_date: "03 Mar, Tuesday",
                arrival_airport: "Hazrat Shahjalal...",
                duration: "55min",
                stops: "Non-Stop"
            }
        ]
    },
    {
        _id: "7",
        flight_code: "ASTRA 7Y9",
        current_price: 6800,
        regular_price: 7500,
        segments: [
            {
                airline: "Air Astra",
                logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYAqp5WIR04hrlVzT_iaz5DhJF5iKCGR48qg&s",
                from: "CGP",
                to: "CXB",
                from_code: "CGP",
                to_code: "CXB",
                departure_time: "5:00 PM",
                departure_date: "05 Mar, Thursday",
                departure_airport: "Shah Amanat Intl...",
                arrival_time: "5:30 PM",
                arrival_date: "05 Mar, Thursday",
                arrival_airport: "Cox's Bazar Airp...",
                duration: "30min",
                stops: "Non-Stop"
            },
            {
                airline: "Air Astra",
                logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYAqp5WIR04hrlVzT_iaz5DhJF5iKCGR48qg&s",
                from: "CXB",
                to: "CGP",
                from_code: "CXB",
                to_code: "CGP",
                departure_time: "10:00 AM",
                departure_date: "07 Mar, Saturday",
                departure_airport: "Cox's Bazar Airp...",
                arrival_time: "10:30 AM",
                arrival_date: "07 Mar, Saturday",
                arrival_airport: "Shah Amanat Intl...",
                duration: "30min",
                stops: "Non-Stop"
            }
        ]
    }
];


const FlightsPage = ({ from, to, date, flightClass, theme }) => {
    const [openDrawer, setOpenDrawer] = useState(false);

    return (
        <div className="w-full">
            <Banner title="Flights" />

            <div className="travel-container xl:mt-[106px] lg:mt-[90px] md:mt-20 xm:mt-16 mt-12 relative pb-20">

                {/* Mobile Filter Button */}
                <div className="flex gap-2 items-center justify-end md:hidden mb-4 overflow-hidden">
                    <button onClick={() => setOpenDrawer(true)} className="text-xl p-2 border border-gray-300 rounded-md">
                        <Image src="/theme1/filter.png" alt="Filter" width={20} height={20} />
                    </button>
                    <p className="font-semibold text-[#000000]">Filters</p>
                </div>

                <Drawer title="Filters" onClose={() => setOpenDrawer(false)} open={openDrawer} className="sm:hidden">
                    <FlightFilters />
                </Drawer>

                <div className="flex flex-col md:flex-row xl:gap-8 lg:gap-6 md:gap-4 gap-3">
                    {/* Sidebar */}
                    <div className="w-full md:w-[30%] xl:w-[25%] hidden md:block">
                        <div className="sticky top-24">
                            <FlightFilters />
                        </div>
                    </div>

                    {/* Flight List */}
                    <div className="w-full md:w-[70%] xl:w-[75%]">
                        <h2 className="mb-4 font-bold text-xl">{FAKE_FLIGHTS.length} Flights Available</h2>
                        <div className="grid grid-cols-1 gap-4 md:gap-6">
                            {FAKE_FLIGHTS.map((item, index) => (
                                <FlightCard key={index} data={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightsPage;