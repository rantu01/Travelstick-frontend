"use client";
import React, { use, useEffect } from "react";
import Link from "next/link";
import { useFetch } from "@/app/helper/hooks";
import { fetchPageContentTheme1 } from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import HeroFilters from "../common/heroFilters";
import { BackgroundLines } from "../ui/backgroundlines";
import SplitText from "../ui/splitText";
import BlurText from "../ui/blurText";
import AnimatedContent from "../ui/animatedContent";
import SkeletonLoading from "../common/skeletonLoading";

const Hero = () => {
  const i18n = useI18n();
  const [data, getData, { loading }] = useFetch(
    fetchPageContentTheme1,
    {},
    false
  );
  const hero = data?.content?.hero;
  const { langCode } = useI18n();
  const bgImage = hero?.image || "/theme1/hero/hero-banner.png";

  useEffect(() => {
    getData();
  }, []);

  return (
    <div
      style={{
        backgroundImage: "url(" + bgImage + ")",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="h-[1250px] xs:h-[1170px] sm:h-[1000px] md:h-[1050px] lg:h-[900px] xl:h-[1024px] -mt-[144px] overflow-hidden"
    >
      <div className="w-full h-full bg-black bg-opacity-[50%]">
        <div className="travel-container flex flex-col justify-center items-center pt-[172px]">
          <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
            <button
              style={{
                backgroundImage: 'url("/theme1/hero/btn-bg.png")',
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              className=" !font-dancingScript text-[#05073C] w-[273px] h-[68px] flex flex-col justify-center section-heading animate-bounceUpDown"
            >
              {hero?.heading?.[langCode] || "Banglaco Ltd."}
            </button>
            <div className="hero-header mt-[16px] xl:w-[1095px] lg:w-[1000px] sm:w-[580px] w-full text-white">
              <SplitText
                text={hero?.title?.[langCode]}
                className="text-center"
                delay={20}
                heighlightsword={[2, 4, 7]}
                heighlightclass={"text-primary"} // Tailwind config theke #28B6EA nibe
              />
            </div>
            <div className=" description-2 !text-center lg:w-[871px] md:w-[668px] sm:w-[580px] md:px-0 px-2 w-full text-white mt-[24px]">
              <BlurText
                text={hero?.short_description?.[langCode]}
                className="!text-center flex justify-center"
                delay={200}
              />
            </div>
          </BackgroundLines>
          <div>
            <AnimatedContent direction="horizontal" distance={100}>
              <HeroFilters />
            </AnimatedContent>
          </div>
          
          {/* Background primary (#28B6EA) ebong hover navy blue (#2A3479) */}
          <Link
            href="/package"
            className="leading-[26px] relative z-50 animate-bounceLeftRight lg:mt-[59px] mt-[30px] font-lato font-medium sm:text-[18px] text-sm sm:px-[55px] px-6 sm:py-[18px] py-2 bg-primary hover:bg-[#2A3479] transition-all duration-300 text-white rounded-full"
          >
            {i18n.t("View Packages")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;