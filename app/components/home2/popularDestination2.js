"use client";
import { useFetch } from "@/app/helper/hooks";
import {
  fetchPageContentTheme1,
  getAllPublicDestination,
} from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import Link from "next/link";
import AnimatedContent from "../ui/animatedContent";
import TextWithTooltip from "@/app/helper/utils";
import SkeletonLoading from "../common/skeletonLoading";
import SectionHeaderPage2 from "../common/sectionHeader2";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";

const PopularDestination2 = () => {
  const [data] = useFetch(getAllPublicDestination, { limit: 100 });
  const [offers] = useFetch(fetchPageContentTheme1);
  const destination = offers?.content?.destination;
  const { langCode } = useI18n();
  const i18n = useI18n();
  const swiperRef = useRef(null);
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.update();
    }
  }, []);

  const Next = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const Previous = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };
  const isLoading = data?.docs?.length === 0;

  return (
    <>
      {isLoading ? (
        <SkeletonLoading cols={3} />
      ) : (
        <div className="w-full ">
          <div className="travel-container">
            <SectionHeaderPage2
              maxWidth="max-w-[790px]"
              align="center"
              title={destination?.heading?.[langCode]}
              heading={destination?.title?.[langCode]}
              description={destination?.offer_description?.[langCode]}
            />
          </div>

          <AnimatedContent direction="vertical" reverse={false} distance={50}>
            <div className="w-full destination mt-6 md:mt-6">
              <Swiper
                keyboard={{ enabled: true }}
                pagination={{ clickable: true }}
                breakpoints={{
                  320: { slidesPerView: 1.2, spaceBetween: 10 },
                  640: { slidesPerView: 2.2, spaceBetween: 10 },
                  768: { slidesPerView: 3.2, spaceBetween: 16 },
                  1024: { slidesPerView: 4.5, spaceBetween: 20 },
                  1440: { slidesPerView: 5.5, spaceBetween: 20 },
                }}
                centeredSlides={true}
                loop={true}
                mousewheel={true}
                modules={[Keyboard, Navigation, Pagination]}
                ref={swiperRef}
                className="w-full"
              >
                {data?.docs?.map((item, index) => (
                  <SwiperSlide
                    key={index}
                    className="!w-[380px] group transform transition-transform duration-1000 ease-in-out hover:scale-105 pt-10"
                  >
                    <div className="relative mx-auto flex items-center justify-center">
                      <Image
                        src={item?.banner_image}
                        width={1000}
                        height={1000}
                        alt={item?.name || "Destination"}
                        className="w-full xl:h-[530px] lg:h-[500px] h-[400px] object-cover rounded-xl transition-all duration-500 group-hover:hidden"
                      />
                      <div className="w-full l:h-[530px] lg:h-[500px] h-[400px] transform transition-transform duration-1000 ease-in-out z-50 relative -top-10">
                        <Image
                          src={item?.card_image}
                          width={1000}
                          height={1000}
                          alt={item?.name || "Destination"}
                          className="w-full xl:h-[450px] lg:h-[400px] h-[350px] object-cover rounded-xl transition-all duration-500 hidden group-hover:flex"
                        />
                      </div>
                      <div className="absolute opacity-0 inset-0 bg-black/30 rounded-xl"></div>
                      <Link href={`/destination/${item?._id}`}>
                        <div className="absolute 2xl:-bottom-2 xl:-bottom-1 lg:bottom-10 md:-bottom-1 bottom-1 opacity-0 group-hover:opacity-100 left-0 w-full p-3 rounded-b-xl">
                          <p className="text-[#05073C] text-base lg:text-lg font-semibold">
                            <TextWithTooltip
                              text={item?.short_description?.[langCode]}
                              limit={35}
                            />
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FaMapMarkerAlt className="text-[#717171]" />
                              <p className="text-[#717171] text-sm mt-1">
                                {item?.address?.name}
                              </p>
                            </div>
                            <div href={`/destination/${item?._id}`}>
                              <div className="border border-[#E8EAE8] bg-white hover:!bg-[#EB662B] p-3 rounded-full">
                                <MdArrowOutward className="text-xl  text-[#05073C] hover:text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            {/* <div className="max-w-[920px] mx-auto relative flex items-center justify-center -mt-8">
              <button
                onClick={Previous}
                className={`absolute top-1/2 left-1 z-50 transition-all duration-300 text-primary border hover:border-[#E8EAE8] hover:bg-primary border-[#D7D7D7] hover:text-white flex items-center justify-center w-10 h-10 rounded-full shadow-md`}
              >
                <GoArrowLeft size={20} />
              </button>
              <button
                onClick={Next}
                className={`absolute top-1/2 right-1 z-50 transition-all duration-300 text-primary border hover:border-[#E8EAE8] hover:bg-primary border-[#D7D7D7] hover:text-white flex items-center justify-center w-10 h-10 rounded-full shadow-md`}
              >
                <GoArrowRight size={20} />
              </button>
            </div> */}
          </AnimatedContent>
        </div>
      )}
    </>
  );
};

export default PopularDestination2;
