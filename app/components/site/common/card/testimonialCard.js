"use client";
import TextWithTooltip from "@/app/helper/utils";
import { Rate } from "antd";
import Image from "next/image";
import React from "react";

const TestimonialCard = ({ data, isActive }) => {
  if (!isActive) {
    return (
      <div className="flex justify-center items-center ">
        {
          data?.user?.image ? (
            <Image
              width={1000}
              height={1000}
              className="lg:w-[120px] lg:h-[120px] md:w-[100px] md:h-[100px] w-[70px] h-[70px] object-cover rounded-full shadow-lg"
              src={data?.user?.image || "/theme1/user.jpg"}
              alt="Traveler"
            />
          ) : (
            <Image
              width={1000}
              height={1000}
              className="lg:w-[120px] lg:h-[120px] md:w-[100px] md:h-[100px] w-[70px] h-[70px] object-cover rounded-full shadow-lg"
              src="/theme1/user.jpg"
              alt="Traveler"
            />
          )
        }
      </div>
    );
  }

  return (
    <div className="w-full max-w-[750px] mx-auto flex flex-col items-center transition-all duration-300 relative bottom-36">
      {/* Rating */}
      <div className="relative text-center w-[300px] sm:w-[650px] lg:w-[700px] mb-6">
        <Rate
          className="text-primary mb-4"
          allowHalf
          disabled
          value={data?.rating}
        />

        {/* Comment Full Width */}
        <div className="w-full px-4 mb-4 h-[50px]">
          <p className="description-1 text-center text-white w-full ">
            <TextWithTooltip limit={160} text={data?.comment} />
          </p>
        </div>
      </div>

      {/* Image */}
      <div className="flex justify-center ">
        {
          data?.user?.image ? (
            <Image
              width={1000}
              height={1000}
              className=" md:w-[150px] md:h-[150px] w-[130px] h-[130px] object-cover rounded-full border-[2px] border-dashed border-[#EF8248] shadow-lg"
              src={data?.user?.image || "/theme1/user.jpg"}
              alt="Traveler"
            />
          ) : (
            <Image
              width={1000}
              height={1000}
              className="md:w-[150px] md:h-[150px] w-[130px] h-[130px] object-cover rounded-full border-[2px] border-dashed border-[#EF8248] shadow-lg"
              src="/theme1/user.jpg"
              alt="Traveler"
            />
          )
        }
      </div>

      {/* Name & Role */}
      <div className="mt-4 flex flex-col justify-center items-center w-full">
        <p className="description-2 text-white whitespace-pre">{data?.user?.name}</p>
        <p className="description-1 text-white">{data?.user?.role}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
