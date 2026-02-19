"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useFetch } from "@/app/helper/hooks";
import { fetchPageContentTheme1 } from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import HeroFilters from "../common/heroFilters";

const Hero = () => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const [data, getData] = useFetch(fetchPageContentTheme1, {}, false);
  
  const hero = data?.content?.hero;
  const bgImage = "/homeBg.jpg";

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div
        // Inline style theke backgroundImage remove kora hoyeche
        // Responsive bg Tailwind diye control kora hocche
        className="
          relative 
          h-[450px] sm:h-[500px] md:h-[350px]
          flex flex-col items-center justify-center
          overflow-visible
          bg-white
          bg-none
          md:bg-[url('/homeBg.jpg')]
          md:bg-cover
          md:bg-center
        "
      >
        {/* Mobile e overlay hide thakbe */}
        <div className="absolute inset-0 bg-black/40 hidden md:block"></div>

        {/* <div className="travel-container relative z-10 w-full flex flex-col items-center px-4 text-center">
          
          <div className="mb-6 animate-fadeInUp">
            <h1 className="text-white text-3xl sm:text-4xl md:text-6xl font-bold drop-shadow-2xl leading-tight">
              {hero?.title?.[langCode] || "Explore the World"}
            </h1>
            <p className="text-white mt-4 text-sm sm:text-base md:text-xl max-w-2xl mx-auto opacity-90 px-2">
              {hero?.short_description?.[langCode]}
            </p>
          </div>

          <Link
            href="/package"
            className="mt-4 bg-primary hover:bg-[#2A3479] text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full font-medium transition-all shadow-lg active:scale-95"
          >
            {i18n.t("View Packages")}
          </Link>
        </div> */}

        {/* HeroFilters Section - Mobile e top e thakbe, Desktop e bottom */}
        <div className="absolute left-0 right-0 top-10 md:top-auto md:bottom-14 md:translate-y-1/2 z-[999] w-full px-4">
          <div className="max-w-[1200px] mx-auto">
            <HeroFilters />
          </div>
        </div>
      </div>

      {/* Age eikhane h-[120px] ba h-[180px] chilo, seta komiye deya hoyeche */}
      <div className="h-[250px] sm:h-[300px] md:h-[80px] lg:h-[70px]"></div>
    </>
  );
};

export default Hero;
