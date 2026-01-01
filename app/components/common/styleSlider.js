"use client";
import Image from "next/image";
import AnimatedContent from "../ui/animatedContent";

export default function ImageSlider({ data }) {
  return (
    <div
      className="relative bg-no-repeat bg-center bg-contain py-20 min-h-[600px] flex justify-center items-center -mt-60"
      style={{ backgroundImage: "url('/theme1/whyWe/leftBg.png')" }} // Background image
    >
      <div className="relative w-full max-w-7xl flex justify-center items-center gap-6 top-60">
        <AnimatedContent direction="horizontal" reverse distance={100}>
          <div className="relative w-[230px] h-[320px] lg:w-[270px] lg:!h-[375px] transform rotate-[-33deg] !z-20 -mr-20">
            {data?.leftImage && (
              <Image
                src={data?.leftImage}
                alt="Card 1"
                loading="lazy"
                quality={100}
                width={270}
                height={375}
                className="w-[230px] h-[320px] lg:w-[270px] lg:!h-[375px] border-4 border-[#F4AE7D] rounded-[30px]"
              />
            )}
          </div>
        </AnimatedContent>
        <AnimatedContent direction="vertical" reverse distance={100}>
          <div className="relative w-[280px] h-[390px] lg:w-[315px] lg:!h-[435px] transform rotate-0 !z-30 scale-100 ">
            {data?.centerImage && (
              <Image
                src={data?.centerImage}
                alt="Card 2"
                loading="lazy"
                quality={100}
                width={315}
                height={435}
                className="w-[280px] h-[390px] lg:w-[315px] lg:!h-[435px]  border-4 border-[#F4AE7D] rounded-[30px]"
              />
            )}
          </div>
        </AnimatedContent>
        <AnimatedContent direction="horizontal" reverse={false} distance={100}>
          <div className="relative w-[230px] h-[320px] lg:w-[270px] lg:!h-[375px] transform rotate-[25deg] !z-50 -ml-20">
            {data?.rightImage && (
              <Image
                src={data?.rightImage}
                alt="Card 3"
                loading="lazy"
                quality={100}
                width={270}
                height={375}
                className="w-[230px] h-[320px] lg:w-[270px] lg:!h-[375px] border-4 border-[#F4AE7D] rounded-[30px]"
              />
            )}
          </div>
        </AnimatedContent>
      </div>
    </div>
  );
}
