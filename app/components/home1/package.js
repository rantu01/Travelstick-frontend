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
        <div className="travel-container w-full">
          {theme === 'one' ? (
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
          )}

          <div className="mt-6 sm:mt-7 lg:mt-9 xl:mt-[44px] w-full">
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
            <div className="flex justify-center xl:mt-10 lg:mt-8 md:mt-6 sm:mt-5 mt-5">
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

      <style jsx global>{`
        .package-swiper .swiper-pagination-bullet-active {
          background: #1A4FA0 !important;
          width: 20px !important;
          border-radius: 5px !important;
        }

        .package-swiper .swiper-pagination-bullet-active {
        background: #28b6ea !important;
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