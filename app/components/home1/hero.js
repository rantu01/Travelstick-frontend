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
        className="
          relative 
          h-[450px] sm:h-[500px] md:h-[350px]
          flex flex-col items-center justify-center
          overflow-visible
          bg-white
        "
      >
        {/* ভিডিও ট্যাগ যোগ করা হয়েছে যা শুধুমাত্র md স্ক্রিন থেকে দেখা যাবে */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover hidden md:block"
        >
          <source src="/tiny.webm" type="video/webm" />
        </video>

        {/* Mobile e overlay hide thakbe */}
        <div className="absolute inset-0 bg-black/40 hidden md:block"></div>

        {/* HeroFilters Section - Mobile e top e thakbe, Desktop e bottom */}
        <div className="absolute left-0 right-0 top-10 md:top-auto md:bottom-14 md:translate-y-1/2 z-[999] w-full px-4">
          <div className="max-w-[1200px] mx-auto">
            <HeroFilters />
          </div>
        </div>
      </div>

      <div className="h-[250px] sm:h-[300px] md:h-[80px] lg:h-[70px]"></div>
    </>
  );
};

export default Hero;