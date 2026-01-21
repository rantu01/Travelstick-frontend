"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdOutlineLocationOn, MdChevronRight } from "react-icons/md";
import { FaStar } from "react-icons/fa6";
import { useCurrency } from "@/app/contexts/site";
import { useI18n } from "@/app/contexts/i18n";
import TextWithTooltip from "@/app/helper/utils";
import AnimatedContent from "@/app/components/ui/animatedContent";

const PackageCard = ({ data, index }) => {
  const { currency_symbol } = useCurrency();
  const { langCode } = useI18n();
  const i18n = useI18n();

  return (
    <AnimatedContent direction="horizontal" reverse={false}>
      <div className="group w-full flex flex-col md:flex-row rounded-xl border border-[#E8EAE8] overflow-hidden bg-white hover:shadow-md transition-shadow">
        
        {/* বাম পাশের ইমেজ সেকশন */}
        <div className="relative w-full md:w-[35%] h-[200px] md:h-auto overflow-hidden">
          {data?.card_image && (
            <Image
              className="w-full h-full object-cover"
              src={data?.card_image}
              width={424}
              height={380}
              alt="hotel images"
            />
          )}
        </div>

        {/* মাঝখানের ইনফরমেশন সেকশন */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1">
              <h3 className="text-xl font-bold text-[#1A1A1A]">
                <TextWithTooltip limit={30} text={data?.name?.[langCode]} />
              </h3>
              <div className="flex text-[#FBAD17] ml-2">
                {[...Array(3)].map((_, i) => (
                  <FaStar key={i} size={14} />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-1 text-gray-500 text-sm">
              <span>Hotel</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MdOutlineLocationOn />
                <TextWithTooltip limit={20} text={data?.destination?.name} />
              </div>
            </div>

            {/* Features/Amenities - Grid layout like image */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 mt-4 border-t pt-4">
              {data?.feathers?.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Image src={item?.logo} width={18} height={18} alt="icon" />
                  <span className="text-sm text-gray-600">
                    <TextWithTooltip limit={15} text={item?.text?.[langCode]} />
                  </span>
                </div>
              ))}
              {data?.feathers?.length > 5 && (
                <div className="text-blue-500 text-sm font-medium cursor-pointer">
                  + {data.feathers.length - 5} more
                </div>
              )}
            </div>

            {/* Room Type and Perks */}
            <div className="mt-4 flex items-center gap-4 border-t pt-3">
               <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium">Deluxe</span>
               </div>
               <div className="flex gap-3 text-sm">
                  <span className="text-green-600 font-medium">Free Cancellation</span>
                  <span className="text-gray-500">• Breakfast Included</span>
               </div>
            </div>
          </div>
        </div>

        {/* ডান পাশের প্রাইস সেকশন */}
        <div className="w-full md:w-[20%] bg-[#E8F1FF] p-4 flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-[#E8EAE8]">
          <div className="text-right">
            <p className="text-xs text-gray-500">Starts From</p>
            <div className="text-2xl font-bold text-[#1A1A1A]">
              {currency_symbol}{data?.current_price?.toLocaleString()}
            </div>
            {data?.regular_price && (
              <del className="text-gray-400 text-sm block">
                {currency_symbol}{data?.regular_price?.toLocaleString()}
              </del>
            )}
            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
              Per Night/Room
            </p>
          </div>

          <Link
            href={`/package/${data?._id}`}
            className="mt-6 w-full py-2 bg-[#2589FF] text-white rounded-full flex items-center justify-center gap-1 hover:bg-blue-600 transition-colors text-sm font-semibold"
          >
            Details <MdChevronRight size={18} />
          </Link>
        </div>
      </div>
    </AnimatedContent>
  );
};

export default PackageCard;