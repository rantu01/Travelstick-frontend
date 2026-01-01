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
  return (
    <div className="group w-full rounded-[10px] border border-[#E8EAE8]">
      <div className="relative w-full overflow-hidden group">
        {data?.card_image && (
          <Image
            className="w-full md:w-[424px] h-[200px] lg:h-[245px] object-cover rounded-[10px]"
            src={data?.card_image}
            width={424}
            height={380}
            alt="images"
          />
        )}
        <p className={`bg-white text-[#05073C] description-4 absolute top-4 left-4 rounded-full px-3 py-1`}>{data?.star}  Star Hotel</p>
      </div>
      <div className="xl:p-4 lg:p-3 p-2">
        <h3 className="description-2 !font-semibold text-[#1A1A1A]">
          {data?.name?.[langCode]}
        </h3>
        <div className="flex items-center lg:mt-4 md:mt-3 mt-2">
          <div className="flex items-center gap-2">
            <MdOutlineLocationOn className="description-4" />
            <p className="description-4 text-[#717171]">{data?.destination?.name}</p>
          </div>
        </div>
        <div className="xl:mt-4 lg:mt-3 mt-2 flex items-center justify-between">
          <p className="heading-4 text-[#EB662B]">
            {currency_symbol} {data?.current_price?.toFixed(1)}
            <span className="description-4 text-[#717171]"> {currency_symbol} <del>{data?.regular_price?.toFixed(1)}</del></span> <br />
            <span className="description-4 text-[#717171]">/per night</span>
          </p>
          <div className="flex items-center gap-1">
            <FaStar className="text-[#FBAD17]" />
            <p className="description-4 text-[#05073C]">
              {data?.average_review?.toFixed(1)}
              <span className="description-4 text-[#717171]"> ({data?.reviews_count})</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center xl:mt-5 lg:mt-4 mt-3">
        <Link href={`/hotel/${data?._id}`} className="view-button !rounded-t-none !text-center !rounded-b-[10px] w-full">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default HotelCard;

;
