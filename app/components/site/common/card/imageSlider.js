"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/thumbs";
import { Thumbs } from "swiper/modules";
import Image from "next/image";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

const ProductImageSlider = ({ banner_image, images = [], color = "text-white" }) => {
  
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainImage, setMainImage] = useState(banner_image);
  const swiperRef = useRef(null);

  useEffect(() => {
    setMainImage(banner_image);
  }, [banner_image]);

  const handleNext = () => swiperRef.current?.slideNext();
  const handlePrev = () => swiperRef.current?.slidePrev();

  return (
    <div className="w-full flex flex-col items-center mb-14 lg:mb-0">
      {/* Main Image */}
      <div className="w-full flex justify-center mb-4">
        <div className="w-full max-w-[900px] h-full lg:h-[480px] xl:h-[470px] aspect-video relative rounded-[20px] overflow-hidden">
          {
            mainImage && (
              <Image
                src={mainImage}
                alt="Product Main Image"
                layout="fill"
                className="object-fill"
              />
            )
          }
        </div>
      </div>

      {/* Thumbnail Swiper */}
      <Swiper
        modules={[Thumbs]}
        watchSlidesProgress
        onSwiper={setThumbsSwiper}
        spaceBetween={16}
        breakpoints={{
          320: { slidesPerView: 2 },
          480: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
        className="w-full max-w-[900px] px-4"
        onBeforeInit={(swiper) => (swiperRef.current = swiper)}
      >
        {[banner_image, ...images].map((image, index) => (
          <SwiperSlide key={index} onClick={() => setMainImage(image)}>
            <div className={`relative aspect-[4/3] rounded-[20px] overflow-hidden cursor-pointer border-2 transition-all duration-200 ${mainImage === image ? "border-[#FF5C2C]" : "border-transparent"
              }`}>
              {
                image && (
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    layout="fill"
                    className="object-cover"
                  />
                )
              }
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <div className="flex justify-between -mt-20 sm:-mt-24 lg:-mt-[70px] 2xl:-mt-20 w-full max-w-[900px]">
        <button
          onClick={handlePrev}
          className={`bg-[#FEF5EE] text-gray-500 z-20 hover:bg-primary hover:${color} -ml-4 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md`}
        >
          <GoArrowLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          className={`bg-[#FEF5EE] text-gray-500 z-20 hover:bg-primary hover:${color} -mr-4 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md`}
        >
          <GoArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProductImageSlider;
