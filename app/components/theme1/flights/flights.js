"use client";
import { Drawer, Empty, Popover, DatePicker } from "antd";
import { useState } from "react";
import Image from "next/image";
import Banner from "../../site/common/component/Banner";
import FlightFilters from "./flightFilters";
import FlightCard from "../../site/common/card/flightCard";
import dayjs from "dayjs";
import { FaSearch, FaTimesCircle, FaExchangeAlt } from "react-icons/fa";

// FAKE DATA ... (আপনার দেওয়া ডাটা এখানে থাকবে)
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

const FlightsPage = ({ from: initialFrom, to: initialTo, date: initialDate, flightClass, theme }) => {
    const [openDrawer, setOpenDrawer] = useState(false);

    // --- Search States ---
    const [searchFrom, setSearchFrom] = useState(initialFrom || "Dhaka (DAC)");
    const [searchTo, setSearchTo] = useState(initialTo || null);
    const [travelDate, setTravelDate] = useState(initialDate ? dayjs(initialDate) : null);
    const [openPopover, setOpenPopover] = useState(null);

    const disabledDate = (current) => {
        return current && current < dayjs().startOf('day');
    };

    const SelectionList = ({ options, onSelect, type }) => (
        <div className="flex flex-col w-64 max-h-72 overflow-y-auto bg-white rounded-md shadow-xl border border-gray-100">
            {options.map((opt, idx) => (
                <button
                    key={idx}
                    onClick={() => { onSelect(opt); setOpenPopover(null); }}
                    className="text-left px-4 py-3 hover:bg-blue-50 text-sm font-semibold text-gray-700 border-b border-gray-50 last:border-none transition-colors"
                >
                    {opt}
                </button>
            ))}
        </div>
    );

    const airportOptions = ["Dhaka (DAC)", "Chittagong (CGP)", "Sylhet (ZYL)", "Cox's Bazar (CXB)", "Saidpur (SPD)", "Jashore (JSR)"];

    return (
        <div className="w-full">
            <Banner title="Flights" />

            {/* --- Flight Search Bar --- */}
            <div className="travel-container -mt-10 relative z-30">
                <div className="bg-white rounded-xl shadow-2xl flex flex-col md:flex-row items-stretch border border-gray-100 overflow-hidden">

                    {/* From */}
                    <div className="flex-1 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer relative group">
                        <Popover
                            open={openPopover === 'from'}
                            onOpenChange={(v) => setOpenPopover(v ? 'from' : null)}
                            content={<SelectionList options={airportOptions} onSelect={(v) => setSearchFrom(v)} />}
                            trigger="click" placement="bottomLeft"
                        >
                            <div className="w-full">
                                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">From</p>
                                <div className="mt-1 font-bold text-gray-700 text-lg leading-tight truncate">
                                    {searchFrom || "Select City"}
                                </div>
                            </div>
                        </Popover>
                    </div>

                    {/* To */}
                    <div className="flex-1 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50 cursor-pointer group">
                        <div className="flex justify-between items-center">
                            <Popover
                                open={openPopover === 'to'}
                                onOpenChange={(v) => setOpenPopover(v ? 'to' : null)}
                                content={<SelectionList options={airportOptions.filter(a => a !== searchFrom)} onSelect={(v) => setSearchTo(v)} />}
                                trigger="click" placement="bottomLeft"
                            >
                                <div className="flex-1">
                                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">To</p>
                                    <div className="mt-1 font-bold text-gray-700 text-lg leading-tight truncate">
                                        {searchTo || "Select Destination"}
                                    </div>
                                </div>
                            </Popover>
                            {searchTo && (
                                <button onClick={() => setSearchTo(null)} className="text-gray-300 hover:text-red-500 transition-colors">
                                    <FaTimesCircle size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Date */}
                    <div className="flex-1 border-b md:border-b-0 md:border-r p-4 hover:bg-gray-50">
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Departure Date</p>
                        <div className="flex items-center justify-between">
                            <DatePicker
                                onChange={(d) => setTravelDate(d)}
                                disabledDate={disabledDate}
                                variant="borderless"
                                className="p-0 font-bold text-lg w-full mt-1"
                                value={travelDate}
                                format="DD MMM, YYYY"
                                placeholder="Pick a date"
                                suffixIcon={null}
                            />
                            {travelDate && <FaTimesCircle className="text-gray-300 hover:text-red-400 cursor-pointer" onClick={() => setTravelDate(null)} />}
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="p-3 bg-white flex items-center justify-center">
                        <button className="bg-[#1A4FA0] hover:bg-blue-900 text-white w-full md:w-20 h-12 md:h-14 rounded-lg flex items-center justify-center shadow-lg transition-all active:scale-95">
                            <FaSearch size={20} className="md:hidden mr-2" />
                            <span className="md:hidden font-bold">Search Flights</span>
                            <FaSearch size={20} className="hidden md:block" />
                        </button>
                    </div>
                </div>
            </div>

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
                        <h2 className="mb-4 font-bold text-xl text-gray-800">{FAKE_FLIGHTS.length} Flights Available</h2>
                        <div className="grid grid-cols-1 gap-4 md:gap-6">
                            {FAKE_FLIGHTS.length > 0 ? (
                                FAKE_FLIGHTS.map((item, index) => (
                                    <FlightCard key={index} data={item} />
                                ))
                            ) : (
                                <Empty description="No Flights Found" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightsPage;