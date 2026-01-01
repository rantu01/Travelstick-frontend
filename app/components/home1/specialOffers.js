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
    limit: 5,
  });

  const [offers] = useFetch(fetchPageContentTheme1);
  const offer = offers?.content?.offer;
  const isLoading = data?.length === 0;
  return (
    <>
      {isLoading ? (
        <SkeletonLoading height1="50" height2="50" height3="50" height4="50" />
      ) : (
        <div className="travel-container w-full pt-2.5">
          {
            theme === 'one' ? <SectionHeaderPage
              maxWidth="max-w-[580px]"
              align="left"
              title={offer?.heading?.[langCode]}
              heading={offer?.title?.[langCode]}
              description={offer?.offer_description?.[langCode]}
            /> :
              <SectionHeaderPage2
                maxWidth="max-w-[580px]"
                align="left"
                title={offer?.heading?.[langCode]}
                heading={offer?.title?.[langCode]}
                description={offer?.offer_description?.[langCode]}
              />
          }

          <div className="w-full expert mt-10">
            <Swiper
              keyboard={{ enabled: true }}
              pagination={{ clickable: true }}
              loop={true}
              modules={[Keyboard, Pagination, Mousewheel]}
              breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 12 },
                768: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
              }}
              className="w-full"
            >
              {data?.map((offer, index) => (
                <SwiperSlide key={index}>
                  <OfferCard
                    data={offer}
                    title={offer?.title[langCode]}
                    heading={offer?.description[langCode]}
                    discount={offer?.discount}
                    discount_type={offer?.discount_type}
                    image={offer?.image}
                    path={index % 2 === 0 ? "one" : "two"}
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
