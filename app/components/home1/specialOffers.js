"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Mousewheel, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import SectionHeaderPage from "../common/sectionHeader";
import OfferCard from "../site/common/card/offerCard";
import { useFetch } from "@/app/helper/hooks";
import {
  fetchPageContentTheme1,
  getAllPublicOffers,
} from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import "react-loading-skeleton/dist/skeleton.css";
import SkeletonLoading from "../common/skeletonLoading";
import SectionHeaderPage2 from "../common/sectionHeader2";

const OffersSection = ({ theme }) => {
  const { langCode } = useI18n();
  const [data] = useFetch(getAllPublicOffers, {
    limit: 10,
  });

  const [offers] = useFetch(fetchPageContentTheme1);
  const offer = offers?.content?.offer;
  const isLoading = !data || data?.length === 0;

  return (
    <>
      {isLoading ? (
        <SkeletonLoading height1="50" height2="50" height3="50" height4="50" />
      ) : (
        <div className="travel-container w-full py-8 md:py-8">
          {/* {theme === 'one' ? (
            <SectionHeaderPage
              maxWidth="max-w-[800px]"
              align="start"
              title={offer?.heading?.[langCode]}
              heading={offer?.title?.[langCode]}
              description={offer?.offer_description?.[langCode]}
            />
          ) : (
            <SectionHeaderPage2
              maxWidth="max-w-[800px]"
              align="start"
              title={offer?.heading?.[langCode]}
              heading={offer?.title?.[langCode]}
              description={offer?.offer_description?.[langCode]}
            />
          )} */}


            <h2 className="text-start text-[#1d2c71] text-3xl font-bold">
              Save Big with Limited-Time Travel Offers
            </h2>
          <div className="w-full mt-8 md:mt-12 offer-swiper-container relative">
            {/* Custom CSS: 1% ও পরিবর্তন না করে শুধু মোবাইল ভিউ অপ্টিমাইজ করা হয়েছে */}
            <style jsx global>{`
              .offer-swiper-container .swiper-pagination {
                bottom: 0px !important; 
              }
              .offer-swiper-container .swiper {
                padding-bottom: 40px !important;
                padding-left: 4px; /* Mobile এ কার্ডের শ্যাডো কাটার হাত থেকে বাঁচতে */
                padding-right: 4px;
              }
              @media (max-width: 640px) {
                .offer-swiper-container .swiper {
                  padding-bottom: 35px !important;
                }
              }
            `}</style>

            <Swiper
              keyboard={{ enabled: true }}
              pagination={{ clickable: true, dynamicBullets: true }}
              loop={data.length > 3}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              modules={[Keyboard, Pagination, Mousewheel, Autoplay]}
              // রেসপনসিভ ব্রেকপয়েন্ট নিখুঁত করা হয়েছে
              breakpoints={{
                0: { 
                  slidesPerView: 1.1, // মোবাইলে পরের কার্ডটি সামান্য দেখা যাবে (Better UX)
                  spaceBetween: 15 
                },
                480: {
                  slidesPerView: 1,
                  spaceBetween: 20
                },
                640: { 
                  slidesPerView: 2, 
                  spaceBetween: 25 
                },
                1024: { 
                  slidesPerView: 3, 
                  spaceBetween: 30 
                },
              }}
              className="mySwiper"
            >
              {data?.map((item, index) => (
                <SwiperSlide key={index} className="h-auto">
                  <div className="pb-2"> {/* কার্ডের নিচের শ্যাডো ক্লিয়ার করার জন্য */}
                    <OfferCard
                      data={item}
                      title={item?.title?.[langCode]}
                      heading={item?.description?.[langCode]}
                      discount={item?.discount}
                      discount_type={item?.discount_type}
                      image={item?.image}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
};

export default OffersSection;