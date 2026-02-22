"use client";
import React, { useEffect } from "react";
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

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Package = ({ theme }) => {
  const { langCode } = useI18n();
  const [packages] = useFetch(fetchPageContentTheme1);
  const packageData = packages?.content?.packages;
  const [data, getData] = useFetch(getAllPublicPackages, {
    limit: 10,
  });
  const i18n = useI18n();

  useEffect(() => {
    getData();
  }, []);

  const isLoading = !data?.docs || data?.docs?.length === 0;

  return (
    <>
      {isLoading ? (
        <SkeletonLoading cols={4} />
      ) : (
        <div className="w-full bg-white ">

          <div className="max-w-6xl mx-auto  py-6 rouned-xl">
          {/* {theme === 'one' ? (
            <SectionHeaderPage
              maxWidth="max-w-[800px]"
              align="center"
              title={packageData?.heading?.[langCode]}
              heading={packageData?.title?.[langCode]}
              description={packageData?.offer_description?.[langCode]}
            />
          ) : (
            <SectionHeaderPage2
              maxWidth="max-w-[800px]"
              align="center"
              title={packageData?.heading?.[langCode]}
              heading={packageData?.title?.[langCode]}
              description={packageData?.offer_description?.[langCode]}
            />
          )} */}

          <div className="mb-6 ml-4">
            <h2 className="relative inline-block text-3xl font-bold text-black pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-[60%] after:h-[2px] after:bg-[#1a4fa0]">
              Our <span className="text-[#1d2c71]">Tour Packages</span>
            </h2>
          </div>

          <div className="mt-6 sm:mt-7 lg:mt-9 xl:mt-[44px] w-full px-4">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="package-swiper pb-12"
            >
              {data?.docs?.map((item, index) => (
                <SwiperSlide key={item._id || index}>
                  <div className="h-full">
                    {theme === 'one' ? (
                      <PackageCard data={item} index={index} />
                    ) : (
                      <PackageCard2 data={item} index={index} />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {data?.docs?.length > 0 && (
            <div className="flex justify-center mt-5 ">
              <Link
                href="/package"
                className=" animate-bounceLeftRight text-white bg-[#1a4fa0] px-4 py-2 rounded-2xl"
              >
                {i18n.t("View All Packages")}
              </Link>
            </div>
          )}
        </div>
        </div>
        
      )}

      <style jsx global>{`
        .package-swiper .swiper-pagination-bullet-active {
          background: #1a4fa0 !important;
          width: 20px !important;
          border-radius: 5px !important;
        }

        .package-swiper .swiper-pagination-bullet {
           background: #1a4fa0;
           opacity: 0.3;
        }

        .package-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 20px !important;
          border-radius: 5px !important;
        }
        .package-swiper .swiper-pagination {
          bottom: -12px !important;
        }
      `}</style>
    </>
  );
};

export default Package;