"use client";
import Banner3 from '@/app/components/site/common/component/Banner3';
import React from 'react';
import FlightSearchBar from './FlightSearchBar';
import BanglacoRoutes from '@/app/components/home1/BanglacoRoutes';

const RouteDetails = ({ params }) => {
    const routeId = params.id;
    const readableRoute = routeId.replace(/-/g, ' ');

    // কাল্পনিক ডেটা (আপনি পরে এটি API থেকে নিয়ে আসতে পারেন)
    const flightOffers = [
        {
            airline: "NOVOAIR",
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzUrR1V87dqXahPjoSJnK1bFcRYR2jKtR4dg&s",
            price: "4,382",
            from: "Dhaka",
            to: readableRoute
        },
        {
            airline: "US-Bangla Airlines",
            logo: "https://images.seeklogo.com/logo-png/53/2/us-bangla-airlines-logo-png_seeklogo-534134.png",
            price: "4,418",
            from: "Dhaka",
            to: readableRoute
        },
        {
            airline: "Biman Bangladesh Airlines",
            logo: "https://www.logo.wine/a/logo/Biman_Bangladesh_Airlines/Biman_Bangladesh_Airlines-Logo.wine.svg",
            price: "4,418",
            from: "Dhaka",
            to: readableRoute
        }
    ];

    return (
        <div className=" min-h-screen">
            <Banner3 title={`Flights to ${readableRoute}`} />

            {/* Search Bar Half Over Banner */}
            <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
                <FlightSearchBar defaultTo={readableRoute} />
            </div>

            <div className='max-w-6xl mx-auto py-16 px-4'>
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#1a2b6d] capitalize mb-4">
                        Cheap Flights from Dhaka to {readableRoute}
                    </h1>
                    <p className="text-gray-500 max-w-3xl mx-auto leading-relaxed">
                        Banglaco provides with the best deals on domestic and international routes from hundreds
                        of airlines to help you find the cheapest flights. Whether you are looking for a last-minute
                        flight or a cheap air ticket for a later date, you can find the best deals only at Banglaco.
                    </p>
                </div>

                {/* Flight Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {flightOffers.map((flight, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 flex items-center justify-center">
                                        <img
                                            src={flight.logo}
                                            alt={flight.airline}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <span className="capitalize">{flight.from}</span>
                                            <span className="text-gray-400">→</span>
                                            <span className="capitalize">{flight.to}</span>
                                        </h3>
                                        <p className="text-sm text-gray-500 font-medium">{flight.airline}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between items-end">
                                {/* Decorative Plane Icon Background */}
                                <div className="opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 16.5L13 11.5V4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4V11.5L3 16.5V18.5L11 16V21L9 22.5V24L12 23L15 24V22.5L13 21V16L21 18.5V16.5Z" fill="#1a73e8" />
                                    </svg>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Starts from</p>
                                    <p className="text-2xl font-bold text-[#1a73e8]">BDT {flight.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <BanglacoRoutes></BanglacoRoutes>
            </div>
        </div>
    );
};

export default RouteDetails;