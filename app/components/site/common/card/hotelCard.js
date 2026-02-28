"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaStar } from "react-icons/fa6";
import { useCurrency } from "@/app/contexts/site";
import { useI18n } from "@/app/contexts/i18n";

const HotelCard = ({ data }) => {
  const { currency_symbol } = useCurrency();
  const { langCode } = useI18n();

  const safeDestination =
    typeof data?.destination === "object"
      ? data?.destination?.name || data?.destination?.address || "Unknown location"
      : data?.destination || "Unknown location";

  return (
    <div className="group w-full rounded-[15px] border border-[#E8EAE8] bg-white overflow-hidden flex flex-col md:flex-row transition-shadow hover:shadow-md min-h-[220px]">
      
      <div className="relative w-full md:w-[280px] lg:w-[320px] flex-shrink-0 p-3 md:p-4">
        {data?.card_image && (
          <Image
            className="w-full h-[200px] md:h-full object-cover rounded-[10px]"
            src={data?.card_image}
            width={400}
            height={300}
            alt="hotel image"
          />
        )}
      </div>

      <div className="flex flex-col flex-grow p-4 md:py-5 md:px-2 justify-start">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-[20px] font-bold text-[#1A1A1A] leading-tight">
            {data?.name?.[langCode]}
          </h3>
          <div className="flex items-center gap-0.5">
            {[...Array(Number(data?.star) || 0)].map((_, i) => (
              <FaStar key={i} className="text-[#FBAD17] text-sm" />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 text-[#717171] mb-4">
          <span className="text-[14px]">Hotel</span>
          <span className="text-[14px] ml-1">• 2.46 km</span>
          <MdOutlineLocationOn className="ml-1 text-[16px]" />
          <p className="text-[14px]">{safeDestination}</p>
        </div>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
          <div className="flex items-center gap-2 text-[13px] text-[#555]">
             <span className="opacity-60">🧳</span> Luggage storage
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#555]">
             <span className="opacity-60">♿</span> Accessibility
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#555]">
             <span className="opacity-60">📶</span> Free Wi-Fi
          </div>
          <div className="text-[13px] text-blue-500 cursor-pointer">+ 3 more</div>
        </div>

        <div className="mt-auto border-t pt-3 flex items-start gap-3">
            <span className="text-xl opacity-40">🛏️</span>
            <div>
                <p className="font-semibold text-sm text-[#1A1A1A]">Standard</p>
                <p className="text-[12px] text-[#717171]">Non Refundable • Breakfast Included</p>
            </div>
        </div>
      </div>

      <div className="w-full md:w-[180px] bg-[#EBF3FF] flex flex-col items-center justify-center p-5 text-center gap-2 md:m-3 md:rounded-[12px]">
        <p className="text-[12px] text-[#717171]">Starts From</p>
        <div className="flex flex-col">
            <span className="text-[22px] font-bold text-[#1A1A1A]">
                {currency_symbol}{data?.current_price?.toLocaleString()}
            </span>
            <span className="text-[14px] text-[#717171] line-through">
                {currency_symbol}{data?.regular_price?.toLocaleString()}
            </span>
        </div>
        <p className="text-[11px] text-[#717171] mb-2">Per Night/Room</p>

        <Link 
          href={`/hotel/${data?._id}`} 
          className="bg-[#3583FE] text-white font-medium py-2 px-6 rounded-full text-[14px] flex items-center gap-2 hover:bg-[#2866cc] transition-all w-full justify-center"
        >
          Details <span className="text-[10px]">{">"}</span>
        </Link>
      </div>

    </div>
  );
};

export default HotelCard;