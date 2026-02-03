"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";
import TextWithTooltip from "@/app/helper/utils";

const VisaCard1 = ({ data }) => {
  const i18n = useI18n();
  const { langCode } = i18n;
  const { currency_symbol } = useCurrency();

  return (
    <Link href={`/visa/${data?._id}`} className="block group">
      <div className="relative w-full h-[250px] md:h-[280px] rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl">
        
        {/* ব্যাকগ্রাউন্ড ইমেজ */}
        <div className="absolute inset-0 w-full h-full">
          {data?.card_image && (
            <Image
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src={data?.card_image}
              fill
              alt={data?.title?.[langCode] || "visa images"}
            />
          )}
          {/* কালো গ্র্যাডিয়েন্ট ওভারলে */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
        </div>

        {/* ওপরের বাম পাশের ব্যাজ */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white text-[10px] font-semibold uppercase">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          Visa
        </div>

        {/* নিচের টেক্সট কন্টেন্ট */}
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <h3 className="text-xl md:text-2xl font-bold mb-1 tracking-tight">
            <TextWithTooltip limit={25} text={data?.title?.[langCode]} />
          </h3>
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-light text-gray-300 uppercase tracking-widest leading-none">Starts From</p>
              <p className="text-lg font-bold text-white leading-none mt-1">
                {currency_symbol} {data?.current_price?.toFixed(0)}
              </p>
            </div>
            
            <span className="text-[12px] font-bold bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-lg group-hover:bg-white group-hover:text-black transition-all duration-300">
              {i18n.t("Details")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VisaCard1;