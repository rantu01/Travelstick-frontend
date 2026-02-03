"use client";
import React, { use, useEffect } from "react";
import SectionHeaderPage from "../common/sectionHeader";
import Link from "next/link";
import PackageCard from "../site/common/card/packageCard";
import { useI18n } from "@/app/contexts/i18n";
import { useFetch } from "@/app/helper/hooks";
import {
  fetchPageContentTheme1,
  getAllPublicPackages,
} from "@/app/helper/backend";
import SkeletonLoading from "../common/skeletonLoading";
import SectionHeaderPage2 from "../common/sectionHeader2";
import PackageCard2 from "../site/common/card/packageCard2";
const Package = ({ theme }) => {
  const { langCode } = useI18n();
  const [packages] = useFetch(fetchPageContentTheme1);
  const packageData = packages?.content?.packages;
  const [data, getData, { loading }] = useFetch(getAllPublicPackages, {
    limit: 4,
  });
  const i18n = useI18n();
  useEffect(() => {
    getData();
  }, []);
  const isLoading = data?.docs?.length === 0;
  return (
    <>
      {isLoading ? (

        <SkeletonLoading cols={4} />

      ) : (
        <div className="travel-container w-full">
          {
            theme === 'one' ?
              <SectionHeaderPage
                maxWidth="max-w-[800px]"
                align="center"
                title={packageData?.heading?.[langCode]}
                heading={packageData?.title?.[langCode]}
                description={packageData?.offer_description?.[langCode]}
              /> :
              <SectionHeaderPage2
                maxWidth="max-w-[800px]"
                align="center"
                title={packageData?.heading?.[langCode]}
                heading={packageData?.title?.[langCode]}
                description={packageData?.offer_description?.[langCode]}
              />
          }
          <div className="mt-6 sm:mt-7 lg:mt-9 xl:mt-[44px] w-full overflow-hidden">
            {/* স্লাইডিং কন্টেইনার */}
            <div className="flex w-max animate-marquee space-x-4 md:space-x-6 hover:[animation-play-state:paused]">
              {/* ডাটা ডুপ্লিকেট করা হয়েছে যাতে লুপটি নিরবচ্ছিন্ন বা স্মুথ হয় */}
              {[...(data?.docs || []), ...(data?.docs || [])].map((item, index) => (
                <div
                  key={index}
                  className="w-[280px] sm:w-[320px] md:w-[380px] flex-shrink-0 transition-all duration-500 ease-in-out"
                >
                  {theme === 'one' ? (
                    <PackageCard data={item} index={index} />
                  ) : (
                    <PackageCard2 data={item} index={index} />
                  )}
                </div>
              ))}
            </div>

            {/* CSS অ্যানিমেশন (আপনি এটি আপনার গ্লোবাল CSS ফাইলে অথবা নিচের মতো ইনলাইন রাখতে পারেন) */}
            <style jsx>{`
    .animate-marquee {
      display: flex;
      width: max-content;
      animation: marquee 30s linear infinite;
    }

    @keyframes marquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    /* মোবাইল ডিভাইসে অ্যানিমেশন কিছুটা দ্রুত করতে চাইলে */
    @media (max-width: 640px) {
      .animate-marquee {
        animation: marquee 20s linear infinite;
      }
    }
  `}</style>
          </div>
          {data?.docs?.length > 0 && (
            <div className="flex justify-center xl:mt-14 lg:mt-10 md:mt-8 sm:mt-5 mt-5">
              <Link
                href="/package"
                className="common-btn animate-bounceLeftRight"
              >
                {i18n.t("See All Package")}
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Package;
