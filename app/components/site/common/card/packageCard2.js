"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useCurrency } from "@/app/contexts/site";
import { useI18n } from "@/app/contexts/i18n";

const PackageCard2 = ({ data }) => {
  const { currency_symbol } = useCurrency();
  const { langCode } = useI18n();

  return (
    <Link href={`/package/${data?._id}`}>
      <div className="group relative w-full h-[250px] md:h-[300px] rounded-2xl overflow-hidden cursor-pointer shadow-lg transition-all duration-500">
        
        {/* ১. মেইন ব্যাকগ্রাউন্ড ইমেজ */}
        <div className="absolute inset-0 w-full h-full">
          {data?.card_image && (
            <Image
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              src={data?.card_image}
              fill
              alt={data?.name?.[langCode] || "package image"}
            />
          )}
          {/* ডার্ক গ্র্যাডিয়েন্ট ওভারলে */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        </div>

        {/* ২. ওপরের বাম পাশের প্যাকেজ কাউন্ট ব্যাজ */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 text-white text-[10px] font-medium uppercase">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          {data?.feathers?.length || 0} Packages
        </div>

        {/* ৩. নিচের টেক্সট কন্টেন্ট */}
        <div className="absolute bottom-6 left-6 text-white">
          <h3 className="text-xl md:text-2xl font-bold mb-1 tracking-tight">
            {data?.name?.[langCode]}
          </h3>
          <p className="text-sm font-light text-gray-200">
            Starts From <span className="font-bold text-white ml-1">{currency_symbol}{data?.current_price?.toLocaleString()}</span>
          </p>
        </div>

      </div>
    </Link>
  );
};

export default PackageCard2;