"use client";
import { useI18n } from "@/app/contexts/i18n";
import { fetchPublicSettings } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import Image from "next/image";
import React, { useEffect } from "react";
import BlurText from "../ui/blurText";
import SkeletonLoading from "../common/skeletonLoading";

const Partner = () => {
  const i18n = useI18n();
  const [setting, getSettings, { loading }] = useFetch(
    fetchPublicSettings,
    {},
    false
  );

  // লোগো স্থির রাখতে চাইলে ডুপ্লিকেট করার দরকার নেই, তাই array spread বাদ দেওয়া হয়েছে
  const partnerImages = setting?.partner || [];

  useEffect(() => {
    getSettings();
  }, []);

  const isLoading = loading && partnerImages.length === 0;

  return (
    <>
      {isLoading ? (
        <SkeletonLoading cols={1} />
      ) : (
        <div className="py-8 md:py-12 xl:py-16 max-w-7xl mx-auto px-4">
          <div className="font-medium sm:text-xl md:text-2xl font-montserrat text-[#05073C] text-center mb-10">
            <BlurText
              text={i18n.t("Trusted by over 32K growing companies")}
              className="flex justify-center text-center"
              delay={400}
            />
          </div>

          {/* Marquee বাদ দিয়ে flex-wrap ব্যবহার করা হয়েছে */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 lg:gap-16">
            {partnerImages.map((image, index) => (
              <div key={index} className="flex-shrink-0 transition-transform hover:scale-105 duration-300">
                <Image
                  className="w-[120px] h-[60px] md:w-[150px] md:h-[70px] object-contain"
                  src={image}
                  width={200}
                  height={100}
                  alt={`partner-image-${index}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Partner;