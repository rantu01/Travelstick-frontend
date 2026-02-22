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
        <div className="w-full bg-white">

          <div className="py-8 md:py-8 xl:py-8 max-w-6xl mx-auto">
            {/* <div className="font-medium sm:text-xl md:text-2xl font-montserrat text-[#05073C] text-center mb-10">
            <BlurText
              text={i18n.t("Trusted by over 32K growing companies")}
              className="flex justify-center text-center"
              delay={400}
            />
          </div> */}

            <div className="py-4">

              <h2 className="text-center text-[#1d2c71] text-3xl font-bold">
                Save Big with Limited-Time Travel Offers
              </h2>
              <p className="text-center text-[#1d2c71] text-2xl font-bold">
                With Banglaco, your journey begins With the best names in the sky
              </p>
            </div>

            {/* Marquee বাদ দিয়ে flex-wrap ব্যবহার করা হয়েছে */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10 lg:gap-16 bg-white py-6 rouned-xl">
              {partnerImages.map((image, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between transition-transform hover:scale-105 duration-300"
                >
                  {/* ইমেজের সাইজ আপনার কোড অনুযায়ী একই রাখা হয়েছে */}
                  <Image
                    className="w-[120px] h-[60px] md:w-[150px] md:h-[70px] object-contain"
                    src={image}
                    width={200}
                    height={100}
                    alt={`partner-image-${index}`}
                  />

                  {/* অ্যারো আইকন */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>

      )}
    </>
  );
};

export default Partner;