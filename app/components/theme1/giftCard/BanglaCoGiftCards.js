"use client";
import React from 'react';
import { useFetch } from '@/app/helper/hooks';
import { getPublicGiftCards } from '@/app/helper/backend';
import { useI18n } from '@/app/contexts/i18n';
import { useRouter } from 'next/navigation'; // Routing er jonno import korun

const BanglaCoGiftCards = () => {
    const { langCode } = useI18n();
    const router = useRouter(); // Router initialize korun
    const [data, getData, { loading }] = useFetch(getPublicGiftCards, { limit: 100 }, true);

    const cards = (data && (data.docs || data)) || [];

    const getText = (mapOrString) => {
        if (!mapOrString) return '';
        if (typeof mapOrString === 'string') return mapOrString;
        if (mapOrString[langCode]) return mapOrString[langCode];
        const keys = Object.keys(mapOrString);
        return keys.length ? mapOrString[keys[0]] : '';
    };

    // Click handler function
    const handleCardClick = (id) => {
        if (id) {
            router.push(`/gift-card/${id}`); // Dynamic route e niye jabe
        }
    };

    return (
        <div className="bg-white min-h-screen font-sans pb-10">
            {/* Banner Section */}
            <div className="relative h-64 flex flex-col items-center justify-center text-white text-center p-4 overflow-hidden  shadow-lg">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-110"
                    style={{ backgroundImage: "url('https://img.freepik.com/free-photo/red-gift-box-with-gold-ribbon-red-background-copy-space_123827-28746.jpg?semt=ais_hybrid&w=740&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-0" />
                <div className="relative z-10">
                    <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-2xl">Send Gift Cards</h1>
                    <div className="h-1 w-20 bg-yellow-400 mx-auto my-3 rounded-full shadow-lg" />
                    <p className="text-xl font-medium text-gray-100 opacity-90 drop-shadow-md">A special way to greet the loved people</p>
                </div>
            </div>

            <div className="text-center my-10">
                <h2 className="text-3xl font-bold text-blue-900">Gift Cards</h2>
                <p className="text-gray-500 text-sm mt-1">Choose Gift card applicable for specific service purchase</p>
            </div>

            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
                {loading ? (
                    <div className="col-span-2 text-center py-10">Loading...</div>
                ) : cards.length === 0 ? (
                    <div className="col-span-2 text-center py-10">No gift cards found.</div>
                ) : (
                    cards.map((card, index) => (
                        <div 
                            key={card._id || index} 
                            // Click event add kora hoyeche
                            onClick={() => handleCardClick(card._id || index)}
                            className="flex rounded-xl overflow-hidden shadow-lg h-44 cursor-pointer hover:scale-[1.02] transition-transform active:scale-95"
                        >
                            {/* Left Side: Image */}
                            <div className="w-2/5 relative">
                                <img src={card.image || '/theme1/hero/default.jpg'} alt={getText(card.title)} className="h-full w-full object-cover" />
                                <div className="absolute bottom-2 left-2 flex items-center">
                                    <span className="text-white text-[10px] font-bold italic opacity-80">BanglaCo</span>
                                </div>
                            </div>

                            {/* Right Side: Details */}
                            <div className={`w-3/5 ${card.color || 'bg-blue-600'} text-white p-6 relative flex flex-col justify-center`}>
                                <div className="absolute top-0 bottom-0 -left-6 w-12 bg-inherit origin-bottom-right -skew-x-[15deg]" />
                                <div className="absolute top-0 bottom-0 -left-1 w-1 bg-yellow-400 opacity-50" />
                                <div className="z-10">
                                    <h3 className="text-2xl font-serif italic mb-1 leading-tight">{getText(card.title)}</h3>
                                    <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-90">Gift Card</p>
                                    <div className="h-[1px] w-12 bg-white mb-2 opacity-50" />
                                    <p className="text-[11px] leading-relaxed font-medium line-clamp-2">{getText(card.subtitle)}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BanglaCoGiftCards;