"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useFetch } from "@/app/helper/hooks";
import { fetchPageContentTheme1 } from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import HeroFilters from "../common/heroFiltersComponent/heroFilters";

const Hero = () => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const [data, getData] = useFetch(fetchPageContentTheme1, {}, false);
  
  const hero = data?.content?.hero;
  const bgImage = "/homeBg.jpg";

  useEffect(() => {
    getData();
  }, []);

  const heroRef = useRef(null);
  const filterRef = useRef(null);
  const [spacerHeight, setSpacerHeight] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const update = () => {
      try {
        if (!filterRef.current || !heroRef.current) {
          setSpacerHeight(0);
          return;
        }
        const fRect = filterRef.current.getBoundingClientRect();
        const hRect = heroRef.current.getBoundingClientRect();
        const overlap = Math.max(0, fRect.bottom - hRect.bottom);
        setSpacerHeight(Math.ceil(overlap));
      } catch (e) {
        setSpacerHeight(0);
      }
    };

    update();

    const ro = new ResizeObserver(update);
    if (filterRef.current) ro.observe(filterRef.current);
    if (heroRef.current) ro.observe(heroRef.current);
    window.addEventListener('resize', update);

    return () => {
      try { ro.disconnect(); } catch (e) {}
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <>
      <div
        ref={heroRef}
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

        {/* Mobile gradient overlay: top #1a4fa0 to white at bottom */}
        <div
          className="absolute inset-0 md:hidden z-10"
          style={{ background: "linear-gradient(to bottom, #1a4fa0 0%, #ffffff 100%)" }}
          aria-hidden="true"
        />

        {/* Mobile e overlay hide thakbe */}
        {/* <div className="absolute inset-0 bg-black/40 hidden md:block"></div> */}

        {/* HeroFilters Section - Mobile e top e thakbe, Desktop e bottom */}
        <div className="absolute left-0 right-0 top-10 md:top-auto md:bottom-14 md:translate-y-1/2 z-10 w-full px-4">
          <div className="max-w-[1200px] mx-auto">
            <HeroFilters ref={filterRef} />
          </div>
        </div>
      </div>

      <div
        style={spacerHeight ? { height: `${spacerHeight}px` } : undefined}
        className={spacerHeight ? "" : "h-[250px] sm:h-[300px] md:h-[80px] lg:h-[70px]"}
      />
    </>
  );
};

export default Hero;