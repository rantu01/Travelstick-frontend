"use client";
import React, { use, useEffect, useState } from "react";
import SectionHeaderPage from "../common/sectionHeader";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Keyboard, Mousewheel, Pagination } from "swiper/modules";
import TestimonialCard from "../site/common/card/testimonialCard";
import {
  fetchPageContentTheme1,
  getAllPublicReviews,
} from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import { useFetch } from "@/app/helper/hooks";
import SkeletonLoading from "../common/skeletonLoading";
import SectionHeaderPage2 from "../common/sectionHeader2";

const Testimonials = ({theme}) => {
  const [data] = useFetch(getAllPublicReviews, { limit: 10 });
  const { langCode } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const [testimonials] = useFetch(fetchPageContentTheme1);
  const testimonial = testimonials?.content?.testimonial;
  const isLoading = data?.docs?.length === 0;

  return (
    <>
      {isLoading ? (
        <SkeletonLoading cols={4} />
      ) : (
        <div className="relative w-full max-h-[835px]">
          <div
            className="absolute inset-0 "
            style={{
              backgroundImage: "url('/theme1/testimonials/bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          ></div>
          <div className="absolute inset-0 bg-black opacity-80 z-0" />
          <div className="relative z-10 max-w-[800px] px-4 sm:px-0 mx-auto w-full xl:py-[60px] lg:py-12 md:py-10 py-8">
            {
              theme === 'one' ?
                <SectionHeaderPage
                  maxWidth="max-w-[718px]"
                  align="center"
                  title={testimonial?.heading?.[langCode]}
                  heading={testimonial?.title?.[langCode]}
                  description={testimonial?.offer_description?.[langCode]}
                  testimonial={true}
                /> :
                <SectionHeaderPage2
                  maxWidth="max-w-[718px]"
                  align="center"
                  title={testimonial?.heading?.[langCode]}
                  heading={testimonial?.title?.[langCode]}
                  description={testimonial?.offer_description?.[langCode]}
                  testimonial={true}
                />
            }
            <div className="w-full mt-10 testiPagination">
              <Swiper
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                keyboard={{ enabled: true }}
                pagination={{ clickable: true }}
                centeredSlides={true}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                breakpoints={{
                  0: { slidesPerView: 1, spaceBetween: 12 },
                  768: { slidesPerView: 3, spaceBetween: 24 },
                  1024: { slidesPerView: 5, spaceBetween: 10 },
                }}
                modules={[Keyboard, Pagination, Mousewheel, Autoplay]}
                className="w-full"
              >
                {data?.docs?.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="mt-36">
                      <TestimonialCard
                        data={item}
                        isActive={activeIndex === index}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Testimonials;
