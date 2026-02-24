"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import { LuCalendarDays } from "react-icons/lu"; // 5 Days iconer jonno
import { useCurrency } from "@/app/contexts/site";
import { useI18n } from "@/app/contexts/i18n";
import TextWithTooltip from "@/app/helper/utils";
import AnimatedContent from "@/app/components/ui/animatedContent";

const PackageCard = ({ data, index }) => {
  const { currency_symbol } = useCurrency();
  const { langCode } = useI18n();
  const i18n = useI18n();

  return (
    <AnimatedContent direction="vertical" reverse={false}>
      <div className="group relative w-full max-w-[380px] bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
        
        {/* Top Image Section with Overlay */}
        <div className="relative h-[280px] w-full overflow-hidden">
          {data?.card_image && (
            <Image
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              src={data?.card_image}
              width={400}
              height={300}
              alt="package image"
            />
          )}
          
          {/* Duration Badge (Top Left) */}
          <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[12px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <LuCalendarDays className="text-[14px]" />
            {data?.duration} Days
          </div>

          {/* Blue Gradient Overlay (Image er moto bottom section) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#3B82F6]/90 via-[#3B82F6]/40 to-transparent flex flex-col justify-end p-5">
            <h3 className="text-white text-xl font-bold leading-tight mb-2">
              <TextWithTooltip limit={45} text={data?.name?.[langCode]} />
            </h3>
            <p className="text-white/90 text-[13px]">
              Starts From (per person) <span className="font-bold">{currency_symbol}{data?.current_price?.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Bottom Info Section */}
        <div className="p-5">
          <div className="flex items-start gap-1 mb-6">
            <MdOutlineLocationOn className="text-[#3B82F6] text-lg mt-0.5 shrink-0" />
            <div>
              <p className="text-[#1A1A1A] font-semibold text-[14px] leading-tight">
                {data?.destination?.name}
              </p>
              <p className="text-gray-400 text-[12px]">
                 {data?.destination?.name}, Thailand
              </p>
            </div>
          </div>

          {/* Features (Amenities - Optional display based on image style) */}
          {/* <div className="flex gap-3 mb-6 overflow-hidden">
             {data?.feathers?.slice(0, 3).map((item, idx) => (
               <div key={idx} className="bg-gray-50 p-2 rounded-lg shrink-0" title={item?.text?.[langCode]}>
                  <Image src={item?.logo} width={14} height={14} alt="icon" className="opacity-60" />
               </div>
             ))}
          </div> */}

          {/* View Details Button */}
          <Link
            href={`/package/${data?._id}`}
            className="block w-full bg-[#1a4fa0] hover:bg-black text-white text-center font-semibold py-3.5 rounded-xl transition-colors duration-300 text-[15px]"
          >
            {i18n.t("View Details")}
          </Link>
        </div>
      </div>
    </AnimatedContent>
  );
};

export default PackageCard;