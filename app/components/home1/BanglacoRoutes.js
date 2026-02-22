import React, { useState } from 'react';
import { Plane } from 'lucide-react';

const BanglacoRoutes = () => {
    const [activeTab, setActiveTab] = useState('domestic');

    const domesticRoutes = [
        { from: 'Dhaka', fromAir: 'Hazrat Shahjalal I...', to: 'Cox\'s Bazar', toAir: 'Cox\'s Bazar Airport' },
        { from: 'Dhaka', fromAir: 'Hazrat Shahjalal I...', to: 'Jashore', toAir: 'Jashore Airport' },
        { from: 'Dhaka', fromAir: 'Hazrat Shahjalal I...', to: 'Chattogram', toAir: 'Shah Amanat Int...' },
        { from: 'Dhaka', fromAir: 'Hazrat Shahjalal I...', to: 'Sylhet', toAir: 'Osmany Internati...' },
        { from: 'Dhaka', fromAir: 'Hazrat Shahjalal I...', to: 'Barisal', toAir: 'Barisal Airport' },
        { from: 'Dhaka', fromAir: 'Hazrat Shahjalal I...', to: 'Saidpur', toAir: 'Saidpur Airport' },
    ];

    const internationalRoutes = [
        { from: 'Dhaka', fromAir: 'Hazrat Shahjalal I...', to: 'Dubai', toAir: 'Dubai Intl Airport' },
        { from: 'Dhaka', fromAir: 'Hazrat Shahjalal I...', to: 'London', toAir: 'Heathrow Airport' },
    ];

    const currentRoutes = activeTab === 'domestic' ? domesticRoutes : internationalRoutes;

    return (
        <div className="bg-white py-10 font-sans ">
            <div className="max-w-6xl mx-auto text-center ">
                {/* Title Section */}
                <h2 className="text-[#1a2b6d] text-3xl font-bold mb-3">
                    Top Domestic & International Routes
                </h2>
                <p className="text-[#4b5687] max-w-4xl  mx-auto mb-8 leading-relaxed">
                    Make your next trip unforgettable with Banglaco! From business class to economy class flights on international trips or domestic ones, choose from hundreds of airlines
                </p>
                <div className='bg-white p-2 rouned-xl'>
                    {/* Tab Switcher */}
                    <div className="flex justify-center mb-10">
                        <div className="bg-[#e8edf5] p-1 rounded-md flex">
                            <button
                                onClick={() => setActiveTab('domestic')}
                                className={`px-8 py-2 rounded-md transition-all ${activeTab === 'domestic'
                                    ? 'bg-[#1a73e8] text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-200'
                                    }`}
                            >
                                Domestic
                            </button>
                            <button
                                onClick={() => setActiveTab('international')}
                                className={`px-8 py-2 rounded-md transition-all ${activeTab === 'international'
                                    ? 'bg-[#1a73e8] text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-200'
                                    }`}
                            >
                                International
                            </button>
                        </div>
                    </div>

                    {/* Routes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentRoutes.map((route, index) => (
                            <div
                                key={index}
                                className="bg-[#fafbfd] p-5 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
                            >
                                {/* Departure */}
                                <div className="text-left">
                                    <h4 className="font-bold text-gray-800 text-lg">{route.from}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{route.fromAir}</p>
                                </div>

                                {/* Icon & Line */}
                                <div className="flex-grow flex items-center justify-center px-4 relative">
                                    <div className="h-[1px] bg-gray-200 w-full absolute top-1/2 transform -translate-y-1/2 border-dashed border-t"></div>
                                    <div className="bg-white p-1 z-10">
                                        <Plane className="w-4 h-4 text-[#1a73e8] rotate" />
                                    </div>
                                </div>

                                {/* Arrival */}
                                <div className="text-right">
                                    <h4 className="font-bold text-gray-800 text-lg">{route.to}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{route.toAir}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>



            </div>
        </div>
    );
};

export default BanglacoRoutes;