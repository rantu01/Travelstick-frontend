"use client";
import { Empty, message, Modal, Radio } from "antd";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import "swiper/css";
import { useParams, useRouter } from "next/navigation";
import {
  createProductPayment,

  getPublicProducts,
} from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";
import { useUser } from "@/app/contexts/user";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Keyboard, Mousewheel, Navigation } from "swiper/modules";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import Banner from "../../site/common/component/Banner";
import ProductButton from "../../btn/productButton";
import Button from "@/app/(dashboard)/components/common/button";
import ProductCard from "../../site/common/card/productCard";
import { useCart } from "@/app/contexts/cartContext";
import AuthModal from "../../site/common/component/authModal";
import Banner2 from "../../site/common/component/Banner2";

const ProductDetailsPage = ({ theme }) => {
  const { user } = useUser();
  const { addItem } = useCart()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const i18n = useI18n();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { currency_symbol } = useCurrency();
  const params = useParams();
  const { _id } = params;
  const [data, getData] = useFetch(getPublicProducts, {}, false);
  const { langCode } = useI18n();
  const router = useRouter();
  useEffect(() => {
    getData({ _id: _id });
  }, [_id]);

  const handlePayment = async () => {
    const values = {
      data: _id,
      method: paymentMethod,
    };
    const response = await createProductPayment({ body: values });

    if (response?.success) {
      if (response?.data?.url) {
        router.push(response.data.url);
        message.success(response.message);
      } else {
        message.error("Payment URL not received. Please try again.");
      }
      setIsModalOpen(false);
    } else {
      message.error(response?.errorMessage || "Payment failed.");
    }
  };
  const swiperRef = useRef(null);

  const Next = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const Previous = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };
  const handleAddToCart = async (productId) => {
    try {
      await addItem(productId, count, "product");
    } catch (error) {
      console.error("Error submitting add to cart:", error);
      message.error("An error occurred while adding to the cart.");
    }
  };

  const [count, setCount] = useState(1);
  const handleCountChange = (newCount) => {
    setCount(newCount);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  // Get paginated data
  const paginatedData = data?.related_products?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="">
      {
        theme === 'one' ?
          <Banner title="Product Details" /> :
          <Banner2 title="Product Details" />
      }
      <div className="lg:py-[100px] md:py-20 sm:py-16 py-12 travel-container">
        <div className="flex flex-col sm:flex-row xl:gap-10 lg:gap-8 md:gap-6 gap-4">
          <div className="w-full sm:w-[50%] bg-primary/10 rounded-[10px] lg:rounded-[20px]">
            <div className="relative  rounded-[10px] lg:rounded-[20px]">
              <Swiper
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                keyboard={{ enabled: true }}
                mousewheel={true}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                loop={true}
                modules={[Autoplay, Keyboard, Mousewheel, Navigation]}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 10 },
                  480: { slidesPerView: 1, spaceBetween: 12 },
                  640: { slidesPerView: 1, spaceBetween: 14 },
                  768: { slidesPerView: 1, spaceBetween: 16 },
                  1024: { slidesPerView: 1, spaceBetween: 24 },
                }}
                className="w-full"
              >
                {[data?.thumb_image, data?.images?.[0], data?.images?.[1]].map(
                  (imgSrc, index) =>
                    imgSrc && (
                      <SwiperSlide key={index}>
                        <div className="w-full">
                          <Image
                            className="w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[450px] xl:h-[576px] object-cover rounded-[10px] lg:rounded-[20px]"
                            src={imgSrc}
                            width={1000}
                            height={1000}
                            alt={`slide-${index}`}
                          />
                        </div>
                      </SwiperSlide>
                    )
                )}
              </Swiper>
              <div className="absolute inset-0 flex items-center justify-between px-4 z-50 pointer-events-none">
                <button
                  onClick={Previous}
                  className="bg-primary hover:bg-[#EB662B] -ml-10  transform duration-300 text-white flex items-center justify-center w-12 h-12 rounded-full shadow-md pointer-events-auto"
                >
                  <GoArrowLeft size={20} />
                </button>
                <button
                  onClick={Next}
                  className="bg-primary hover:bg-[#EB662B]  -mr-10 transform duration-300 text-white flex items-center justify-center w-12 h-12 rounded-full shadow-md pointer-events-auto"
                >
                  <GoArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-0 w-full sm:w-[50%] flex flex-col !justify-center ">
            <h4 className="heading-3">
              {data?.name}
            </h4>
            <div className="mt-3 lg:mt-4 xl:mt-5 flex items-center gap-2 md:gap-3 lg:gap-4 xl:gap-6 description text-[#44433F]">
              <p className="capitalize">
                <span className="text-[#05073C] description-2">{i18n.t("Category")}: </span>{" "}
                {data?.category?.name?.[langCode]}
              </p>
              {data?.quantity == 0 ? (
                <p className="capitalize bg-red-100 text-red-800  px-2 py-[6px] md:py-0 rounded-md">
                  {i18n.t("Out of Stock")}
                </p>
              ) : (
                <p className="capitalize bg-green-100 text-green-800 px-2 py-[6px] md:py-0 rounded-md">
                  {i18n.t("In Stock")}
                </p>
              )}
            </div>
            <div className="mt-3 lg:mt-4 xl:mt-5 flex items-center gap-2 md:gap-3 lg:gap-4 xl:gap-6 heading2">
              <span className="text-[#05073C] description-2">{i18n.t("Price")}: </span>
              <p className="text-primary description-2">
                {currency_symbol}
                {data?.final_price}
              </p>
              <p className="text-red-400 description-2">
                <del>
                  {currency_symbol}
                  {data?.price?.amount}
                </del>
              </p>
            </div>
            <p className="mt-3 lg:mt-4 xl:mt-5">
              <span
                dangerouslySetInnerHTML={{
                  __html: data?.description?.[langCode].slice(0, 800),
                }}
                className="description-1 text-[#44433F]"
              ></span>
            </p>

            <div className="flex items-center gap-4 mt-3 lg:mt-4 xl:mt-5">
              <p className="description text-[#05073C] font-semibold">
                {i18n.t("Quantity")}:
              </p>
              <ProductButton
                productQuantity={data?.quantity}
                onCountChange={handleCountChange}
              />
            </div>
            <div className="flex items-center gap-4 mt-3 lg:mt-4 xl:mt-5">
              <Button
                onClick={() => {
                  if (user) {
                    handleAddToCart(data?._id);
                    router.push("/cart/checkout");
                  } else {
                    setAuthModalOpen(true);
                  }
                }}
                className="rounded-[10px]"
              >
                {i18n.t("Buy Now")}
              </Button>

              <Button
                onClick={() => {
                  if (user) {
                    handleAddToCart(data?._id);
                  } else {
                    setAuthModalOpen(true);
                  }
                }}
                className="rounded-[10px]"
              >
                {i18n.t("Add to Cart")}
              </Button>
            </div>
          </div>
        </div>
        <div>
          <h1 className="heading-3 text-[#05073C] mt-10">
            {i18n.t("Related Products")}
          </h1>
          <div className="xl:mt-14 lg:mt-10 md:mt-8 mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 md:gap-5 sm:gap-4 gap-3">
            {paginatedData?.length > 0 ? (
              paginatedData.map((item, index) => (
                <ProductCard key={index} data={item} />
              ))
            ) : (
              <div className="flex justify-center mt-10 col-span-full">
                <Empty description={i18n.t("No Related Products Found")} />
              </div>
            )}
          </div>

          {/* Pagination */}
          {data?.related_products?.length > pageSize && (
            <div className="flex justify-center mt-10 theme4Ant">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={data?.related_products?.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                className="text-primary"
                itemRender={(page, type, originalElement) => {
                  if (type === "page") {
                    return (
                      <a className="!text-primary hover:!text-primary font-medium">
                        {page}
                      </a>
                    );
                  }
                  return originalElement;
                }}
              />
            </div>
          )}
        </div>
      </div>
      <Modal
        title="Select Payment Method"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Radio.Group
          onChange={(e) => setPaymentMethod(e.target.value)}
          value={paymentMethod}
          className="flex flex-col gap-3"
        >
          <Radio value="stripe">Stripe</Radio>
          <Radio value="paypal">PayPal</Radio>
          <Radio value="razorpay">Razorpay</Radio>
        </Radio.Group>
        <button
          className="xl:mt-8 lg:mt-6 mt-5 w-full bg-[#14634E] text-white common-btn"
          onClick={handlePayment}
        >
          {i18n.t("Pay Now")}
        </button>
      </Modal>
      <AuthModal authModalOpen={authModalOpen} slug={`/product/${data?._id}`} setAuthModalOpen={setAuthModalOpen} />
    </div>
  );
};

export default ProductDetailsPage;
