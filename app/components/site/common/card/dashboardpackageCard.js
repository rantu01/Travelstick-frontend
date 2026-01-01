"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import { LuAlarmClockCheck } from "react-icons/lu";
import { useCurrency } from "@/app/contexts/site";
import { useI18n } from "@/app/contexts/i18n";
const DashboardPackageCard = ({ data, index }) => {
  const { currency_symbol } = useCurrency();
  const { langCode } = useI18n();
  return (
    <div className="group w-full rounded-[10px] lg:rounded-t-[20px] border border-[#E8EAE8]">
      <div className="relative w-full overflow-hidden group">
        {data?.card_image && (
          <Image
            className="w-full md:w-[424px] h-[200px] lg:h-[245px] object-fill rounded-t-[20px]"
            src={data?.card_image}
            width={424}
            height={380}
            alt="images"
          />
        )}
      </div>
      <div className="xl:p-4 lg:p-3 p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MdOutlineLocationOn className="description-4" />
            <p className="description-4 text-[#717171]">{data?.destination?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <LuAlarmClockCheck className="description-4" />
            <p className="description-4 text-[#717171]">{data?.duration} Days</p>
          </div>
        </div>
        <h3 className="description-3 xl:mt-4 lg:mt-3 mt-2 text-[#1A1A1A]">
          {data?.name?.[langCode]}
        </h3>
        <div className="flex justify-between items-center xl:mt-4 lg:mt-3 mt-2">
          <p className="heading-4 text-[#EB662B] ">
            {currency_symbol}{data?.current_price}
            <span className="description-4 text-[#717171]"> {currency_symbol}{data?.regular_price}</span> <br />
            <span className="description-4 text-[#717171]">per person</span>
          </p>
          <Link href={`/package/${data?._id}`} className="view-button">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPackageCard;

;
