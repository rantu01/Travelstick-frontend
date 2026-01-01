"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import { LuAlarmClockCheck } from "react-icons/lu";
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
      <div className="group w-full rounded-t-[10px] lg:rounded-t-[20px] border border-[#E8EAE8]">
        <div className="relative w-full overflow-hidden group">
          {data?.card_image && (
            <Image
              className="w-full md:w-[424px] h-[220px] lg:h-[245px] object-fill rounded-t-[10px] lg:rounded-t-[20px]"
              src={data?.card_image}
              width={424}
              height={380}
              alt="images"
            />
          )}
          <p
            className={`${index === 0
              ? "bg-[#F38035]"
              : index === 1
                ? "bg-[#F0691F]"
                : index === 2
                  ? "bg-[#EF4444]"
                  : "bg-[#F0691F]"
              } capitalize description-4 absolute top-4 right-4 rounded-full px-3 py-1 text-white`}
          >
            {data?.section?.[0]}
          </p>
        </div>
        <div className="xl:p-4 lg:p-3 p-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MdOutlineLocationOn className="description-4" />
              <div className="description-4 text-[#717171]">
                <TextWithTooltip limit={15} text={data?.destination?.name} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LuAlarmClockCheck className="description-4" />
              <p className="description-4 text-[#717171]">
                {data?.duration} Days
              </p>
            </div>
          </div>
          <h3 className="description-3 xl:mt-4 lg:mt-3 mt-2 text-[#1A1A1A]">
            <TextWithTooltip limit={25} text={data?.name?.[langCode]} />
          </h3>
          <div className="grid grid-cols-2 justify-between items-center xl:mt-4 lg:mt-3 mt-2 ">
            {data?.feathers?.map((item, index) => (
              <div key={index} className="lg:mt-3 mt-2 flex items-center gap-2">
                <Image src={item?.logo} width={20} height={20} alt="images" />
                <p className="description-4 text-[#717171]">
                  <TextWithTooltip limit={12} text={item?.text?.[langCode]} />
                </p>
              </div>
            ))}
          </div>
          <div className="xl:mt-4 lg:mt-3 mt-2 flex items-center gap-2 border-b pb-3 lg:pb-4 border-[#E8EAE8]">
            <FaStar className="text-[#FBAD17]" />
            <p className="description-4 text-[#05073C]">
              {data?.average_review?.toFixed(1)}
              <span className="description-4 text-[#717171]">
                ({data?.reviews_count})
              </span>
            </p>
          </div>
          <div className="flex justify-between items-center xl:mt-4 lg:mt-3 mt-2">
            <p className="heading-4 text-[#EB662B] ">
              {currency_symbol}
              {data?.current_price?.toFixed(1)}
              <span className="description-4 text-[#717171] ml-1">
                <del className="text-red-600">({currency_symbol} {data?.regular_price?.toFixed(1)})</del>
              </span>
              <br />
              <span className="description-4 text-[#717171]">per person</span>
            </p>
            <Link
              href={`/package/${data?._id}`}
              className="details-button "
            >
              {i18n.t("View Details")}
            </Link>
          </div>
        </div>
      </div>
    </AnimatedContent>
  );
};

export default PackageCard;
