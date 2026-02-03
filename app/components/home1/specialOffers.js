"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Mousewheel, Pagination } from "swiper/modules";
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
    limit: 10, // আরও বেশি অফার দেখানোর জন্য লিমিট বাড়ানো হয়েছে
  });

  const [offers] = useFetch(fetchPageContentTheme1);
  const offer = offers?.content?.offer;
  const isLoading = !data || data?.length === 0;

  return (
    <>
      {isLoading ? (
        <SkeletonLoading height1="50" height2="50" height3="50" height4="50" />
      ) : (
        <div className="travel-container w-full py-16">
          {theme === 'one' ? (
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
          )}

          <div className="w-full mt-12 offer-swiper-container">
            <Swiper
              keyboard={{ enabled: true }}
              pagination={{ clickable: true, dynamicBullets: true }}
              loop={data.length > 3}
              modules={[Keyboard, Pagination, Mousewheel]}
              breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 20 },
                640: { slidesPerView: 2, spaceBetween: 25 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
              }}
              className="pb-12"
            >
              {data?.map((item, index) => (
                <SwiperSlide key={index} className="h-auto">
                  <OfferCard
                    data={item}
                    title={item?.title?.[langCode]}
                    heading={item?.description?.[langCode]}
                    discount={item?.discount}
                    discount_type={item?.discount_type}
                    image={item?.image}
                  />
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