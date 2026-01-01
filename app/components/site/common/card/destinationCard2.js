"use client";
import TextWithTooltip from "@/app/helper/utils";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useI18n } from "@/app/contexts/i18n";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";

const DestinationCard2 = ({ item }) => {
  const { langCode } = useI18n();

  return (
    <div className="relative mx-auto flex items-center justify-center group transform transition-transform duration-1000 ease-in-out hover:scale-105 pt-10">
      {/* Default Banner Image */}
      <Image
        src={item?.banner_image}
        width={1000}
        height={1000}
        alt={item?.name || "Destination"}
        className="w-full xl:h-[530px] lg:h-[340px] md:h-[280px] h-[280px] object-cover rounded-xl transition-all duration-500 group-hover:hidden"
      />

      {/* Hover Card Image */}
      <div className="w-full xl:h-[530px] lg:h-[340px] md:h-[280px] h-[280px] transition-all duration-1000 ease-in-out hidden group-hover:flex">
        <Image
          src={item?.card_image}
          width={1000}
          height={1000}
          alt={item?.name || "Destination"}
          className="w-full xl:h-[450px] lg:h-[340px] md:h-[280px] h-[280px] object-cover rounded-xl"
        />
      </div>

      {/* Bottom Content */}
      <Link
        href={`/destination/${item?._id}`}
        className="absolute -bottom-5 opacity-0 group-hover:opacity-100 left-0 w-full p-3 rounded-b-xl transition-opacity duration-500"
      >
        <p className="text-[#05073C] text-base lg:text-lg font-semibold">
          <TextWithTooltip
            text={item?.short_description?.[langCode]}
            limit={35}
          />
        </p>

        <div className="flex items-center justify-between">
          {/* Address */}
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#717171]" />
            <p className="text-[#717171] text-sm mt-1">
              {item?.address?.name}
            </p>
          </div>

          {/* Arrow Button */}
          <Link href={`/destination/${item?._id}`}>
            <div className="border border-[#E8EAE8] bg-white hover:!bg-[#EB662B] p-3 rounded-full transition-all duration-500">
              <MdArrowOutward className="text-xl !text-[#05073C] hover:!bg-[#EB662B] group-hover:text-white" />
            </div>
          </Link>
        </div>
      </Link>
    </div>
  );
};

export default DestinationCard2;

