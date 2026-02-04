"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";
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
      <div className="group w-full flex flex-col md:flex-row bg-white rounded-[15px] border border-[#E8EAE8] overflow-hidden hover:shadow-lg transition-shadow duration-300 min-h-[250px]">
        
        {/* Left Side: Image Section */}
        <div className="relative w-full md:w-[35%] overflow-hidden">
          {data?.card_image && (
            <Image
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-[200px] md:min-h-full"
              src={data?.card_image}
              width={400}
              height={300}
              alt="package image"
            />
          )}
          {/* Badge */}
          <p className="capitalize absolute top-3 left-3 bg-[#F0691F] text-[10px] font-bold rounded-full px-3 py-1 text-white z-10">
            {data?.section?.[0] || "Featured"}
          </p>
        </div>

        {/* Middle Side: Information */}
        <div className="flex-1 p-4 md:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8EAE8]">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <h3 className="text-xl font-bold text-[#1A1A1A]">
                <TextWithTooltip limit={30} text={data?.name?.[langCode]} />
              </h3>
              <div className="flex items-center ml-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={`text-[12px] ${i < Math.floor(data?.average_review || 5) ? "text-[#FBAD17]" : "text-gray-300"}`} />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-[#717171] mb-4">
               <span className="flex items-center gap-1">
                 Hotel • {data?.duration} Days
               </span>
               <span className="flex items-center gap-1">
                 <MdOutlineLocationOn className="text-[#1A4FA0]" />
                 {data?.destination?.name}
               </span>
            </div>

            {/* Features/Amenities */}
            <div className="grid grid-cols-2 gap-y-2">
              {data?.feathers?.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Image src={item?.logo} width={16} height={16} alt="icon" className="opacity-70" />
                  <p className="text-[12px] text-[#717171]">
                    <TextWithTooltip limit={15} text={item?.text?.[langCode]} />
                  </p>
                </div>
              ))}
              {data?.feathers?.length > 4 && (
                <p className="text-[12px] text-[#1A4FA0] font-medium">
                   + {data?.feathers.length - 4} more
                </p>
              )}
            </div>
          </div>

          {/* Review text as per design */}
          <div className="mt-4 pt-4 border-t border-[#f1f1f1] flex items-center gap-2">
             <Image src="/hotel-icon.png" width={20} height={20} alt="bed" className="opacity-50" />
             <p className="text-[13px] text-[#4A4A4A] font-medium">
                Standard Room • Non Refundable
             </p>
          </div>
        </div>

        {/* Right Side: Pricing Section */}
        <div className="w-full md:w-[25%] bg-[#F5F9FF] p-6 flex flex-col items-center justify-center text-center">
          <p className="text-[12px] text-gray-500 mb-1">Starts From</p>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-[#1A1A1A]">
              {currency_symbol}{data?.current_price?.toLocaleString()}
            </h2>
            {data?.regular_price > data?.current_price && (
              <p className="text-sm text-gray-400 line-through">
                {currency_symbol}{data?.regular_price?.toLocaleString()}
              </p>
            )}
            <p className="text-[11px] text-gray-400 mt-1">Per Person/Package</p>
          </div>

          <Link
            href={`/package/${data?._id}`}
            className="w-full bg-[#3B82F6] hover:bg-[#1A4FA0] text-white font-medium py-2 px-6 rounded-full transition-colors duration-300 text-sm flex items-center justify-center gap-2 group-hover:shadow-md"
          >
            {i18n.t("Details")} &gt;
          </Link>
        </div>
      </div>
    </AnimatedContent>
  );
};

export default PackageCard;