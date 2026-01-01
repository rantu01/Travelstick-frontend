"use client";
import { useI18n } from "@/app/contexts/i18n";
import { fetchPublicSettings } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import Image from "next/image";
import React, { useEffect } from "react";
import Marquee from "react-fast-marquee";
import BlurText from "../ui/blurText";
import SkeletonLoading from "../common/skeletonLoading";

const Partner = () => {
  const i18n = useI18n();
  const [setting, getSettings, { loading }] = useFetch(
    fetchPublicSettings,
    {},
    false
  );
  const partnerImages = setting?.partner
    ? [...setting.partner, ...setting.partner]
    : [];
  useEffect(() => {
    getSettings();
  }, []);
  const isLoading = partnerImages.length === 0;
  return (
    <>
      {isLoading ? (
       
          <SkeletonLoading cols={1} />
    
      ) : (
        <div className={`py-4 md:py-6 xl:py-8`}>
          <div className="font-medium sm:text-xl md:text-2xl font-montserrat text-[#05073C] text-center mb-10">
            <BlurText
              text={i18n.t("Trusted by over 32K growing companies")}
              className=" flex justify-center text-center"
              delay={400}
            />
          </div>
          <Marquee speed={50} pauseOnHover={true}>
            <div className="flex items-center gap-0">
              {partnerImages.map((image, index) => (
                <div key={index} className="flex-shrink-0 mx-3">
                  <Image
                    className="!w-[165px] !h-[80px] object-contain"
                    src={image}
                    width={568}
                    height={500}
                    alt={`partner-image-${index}`}
                  />
                </div>
              ))}
            </div>
          </Marquee>
        </div>
      )}
    </>
  );
};

export default Partner;
