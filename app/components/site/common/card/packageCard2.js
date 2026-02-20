"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useCurrency } from "@/app/contexts/site";
import { useI18n } from "@/app/contexts/i18n";
import AnimatedContent from "@/app/components/ui/animatedContent";
import { HiOutlineCube } from "react-icons/hi2"; 

const PackageCard = ({ data, index }) => {
  const { currency_symbol } = useCurrency();
  const { langCode } = useI18n();

  return (
    <AnimatedContent direction="horizontal" reverse={false}>
      <Link href={`/package/${data?._id}`}>
        {/* 'isolate' যোগ করা হয়েছে যাতে স্ট্যাকিং কনটেক্সট ঠিক থাকে এবং ওভারফ্লো প্রপারলি কাজ করে */}
        <div className="group relative w-full h-[250px] md:h-[250px] rounded-[20px] overflow-hidden isolate cursor-pointer shadow-md transition-all duration-300">
          
          {/* Main Background Image */}
          {data?.card_image && (
            <Image
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              src={data?.card_image}
              width={400}
              height={500}
              alt="package image"
            />
          )}

          {/* Top Left Badge (e.g., 7 Packages) */}
          <div className="absolute top-4 left-4 z-20">
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm border border-white/40 text-white px-3 py-1.5 rounded-full">
              <HiOutlineCube className="text-sm" />
              <span className="text-[12px] font-medium">
                {data?.total_packages || "0"} Packages
              </span>
            </div>
          </div>

          {/* Red Overlay Gradient - এখানে 'rounded-[20px]' যোগ করা হয়েছে কোণার সমস্যা দূর করতে */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#7f1b3d] via-[#7f1b3d]/40 to-transparent opacity-80 z-10 rounded-[20px]"></div>
          
          {/* Hover Maroon Tint - এখানেও 'rounded-[20px]' যোগ করা হয়েছে */}
          <div className="absolute inset-0 bg-[#7f1b3d]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-15 rounded-[20px]"></div>

          {/* Content (Bottom Left) */}
          <div className="absolute bottom-6 left-6 z-20 text-white">
            <h3 className="text-2xl font-bold mb-0.5 group-hover:translate-x-1 transition-transform duration-300">
              {data?.destination?.name || data?.name?.[langCode]}
            </h3>
            <div className="flex items-center gap-1.5 opacity-90">
              <span className="text-[13px] font-normal">Starts From</span>
              <span className="text-[13px] font-bold">
                {currency_symbol} {data?.current_price?.toLocaleString() || data?.price?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </AnimatedContent>
  );
};

export default PackageCard;