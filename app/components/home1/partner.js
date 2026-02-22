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
          <div className="py-8 md:py-8 xl:py-8 max-w-6xl mx-auto px-4">
            <div className="py-4">
              <h2 className="text-center text-[#1d2c71] text-3xl font-bold">
                Save Big with Limited-Time Travel Offers
              </h2>
              <p className="text-center text-[#4b5687] max-w-4xl  mx-auto mb-8 leading-relaxed">
                With Banglaco, your journey begins With the best names in the sky
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 bg-white py-6">
              {partnerImages.map((image, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 rounded-xl transition-all duration-300 border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-xl cursor-pointer"
                >
                  <Image
                    className="w-[120px] h-[60px] md:w-[150px] md:h-[70px] object-contain"
                    src={image}
                    width={200}
                    height={100}
                    alt={`partner-image-${index}`}
                  />

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