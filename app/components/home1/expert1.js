"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Keyboard, Mousewheel, Pagination } from "swiper/modules";
import ExpertCard1 from "../site/common/card/expertCard1";
import { useFetch } from "@/app/helper/hooks";
import {
  fetchPageContentTheme1,
  GetPublicProviders,
} from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import SectionHeaderPage from "../common/sectionHeader";
import AnimatedContent from "../ui/animatedContent";
import SkeletonLoading from "../common/skeletonLoading";
import SectionHeaderPage2 from "../common/sectionHeader2";

const Expert1 = ({ theme }) => {
  const { langCode } = useI18n();
  const [providers] = useFetch(
    GetPublicProviders,
    { limit: 100 },
  );
  const [experts] = useFetch(fetchPageContentTheme1);
  const expert = experts?.content?.tourGuides;
  const isLoading = providers?.docs?.length === 0;
  return (
    <>
      {isLoading ? (

        <SkeletonLoading height1="50" height2="50" height3="50" height4="50" />

      ) : (
        <div className="travel-container w-full">
          {
            theme === 'one' ?
              <SectionHeaderPage
                maxWidth="max-w-[580px]"
                align="right"
                title={expert?.heading?.[langCode]}
                heading={expert?.title?.[langCode]}
                description={expert?.offer_description?.[langCode]}
              /> :
              <SectionHeaderPage2
                maxWidth="max-w-[580px]"
                align="right"
                title={expert?.heading?.[langCode]}
                heading={expert?.title?.[langCode]}
                description={expert?.offer_description?.[langCode]}
              />
          }
          <div className="w-full expert">
            <AnimatedContent direction="vertical" reverse={true} distancce={20}>
              <Swiper
                keyboard={{ enabled: true }}
                pagination={{ clickable: true }}
                breakpoints={{
                  0: { slidesPerView: 1, spaceBetween: 12 },
                  640: { slidesPerView: 2, spaceBetween: 24 },
                  768: { slidesPerView: 3, spaceBetween: 24 },
                  1024: { slidesPerView: 3, spaceBetween: 30 },
                  1190: { slidesPerView: 4, spaceBetween: 30 },
                }}
                loop={true}
                modules={[Keyboard, Pagination, Mousewheel]}
                className="w-full"
              >
                {providers?.docs?.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="w-full">
                      <ExpertCard1 data={item} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </AnimatedContent>
          </div>
        </div>
      )}
    </>
  );
};

export default Expert1;
