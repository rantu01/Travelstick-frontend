"use client";
import TextWithTooltip, { TextWithTooltip2 } from "@/app/helper/utils";
import Image from "next/image";
import React from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import Link from "next/link";
import { useI18n } from "@/app/contexts/i18n";

const DestinationCard = ({ data, index }) => {
  const { langCode } = useI18n();
  return (
    <div key={index}>
      <Link href={`/destination/${data?._id}`}>
        <div className="group w-full rounded-[20px] lg:rounded-[20px] border border-[#E8EAE8]">
          <div className="relative w-full overflow-hidden group">
            {data?.card_image && (
              <Image
                className="w-full xl:max-w-[424px] h-[258px] object-cover rounded-t-[20px]"
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
                <MdOutlineLocationOn className="description-4 !text-[#05073C]" />
                <p className="description-4 text-[#05073C]">
                  {/* {data?.name} */}
                  <TextWithTooltip limit={25} text={data?.name} />
                </p>
              </div>
            </div>
            <h3 className="description-3 lg:mt-3 mt-2 text-[#05073C]">
              <TextWithTooltip limit={25} text={data?.short_description?.[langCode]} />
            </h3>
            <div className="flex justify-between table-description text-[#717171 items-center lg:mt-3 mt-2">
              <TextWithTooltip2 limit={60} text={data?.description?.[langCode]} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default DestinationCard;
