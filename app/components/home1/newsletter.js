/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect } from "react";
import NewsletterBannerPage from "../common/newletterBanner";
import { Form } from "antd";
import { useAction, useFetch } from "@/app/helper/hooks";
import {
  fetchPageContentTheme1,
  postNewsletterList,
} from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import SkeletonLoading from "../common/skeletonLoading";

const Newsletter = ({theme}) => {
  const [form] = Form.useForm();
  const i18n = useI18n();
  const { langCode } = useI18n();
  const [newsLetter, getNewsLetter] = useFetch(
    fetchPageContentTheme1,
    {},
    false
  );
  useEffect(() => {
    getNewsLetter();
  }, []);
  const videoURL = newsLetter?.content?.newsletter_video;
  const news = newsLetter?.content?.newsletter;
  const handleSubmit = async (values) => {
    await useAction(postNewsletterList, values, null, true);
    form.resetFields();
  };
  const extractYouTubeId = (url) => {
    const regExp =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url?.match(regExp);
    return match ? match[1] : null;
  };
  const isLoading = !news;
  return (
    <>
      {isLoading ? (
        <SkeletonLoading cols={1} />
      ) : (
        <div className="travel-container w-full pb-[80px] mt-[80px]">
          <div className="border relative w-full xl:h-[500px] lg:h-[400px] md:h-[350px] sm:h-[300px] h-[320px] overflow-hidden rounded-[10px] lg:rounded-[20px]">
            {/* Background Video */}
            <iframe
              className="w-[177.77vh] h-[100vh] absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none"
              src={`https://www.youtube.com/embed/${extractYouTubeId(
                videoURL
              )}?autoplay=1&mute=1&loop=1&playlist=${extractYouTubeId(
                videoURL
              )}&controls=0&showinfo=0&modestbranding=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-10" />
            {/* Overlay Content */}
            <div className="relative z-10 w-full h-full flex ">
              <div className="hidden md:block flex-1" />
              <div
                className="w-full md:w-1/2"
                style={{
                  backgroundImage: 'url("/theme1/newsletter/videoBg.png")',
                }}
              >
                <div className="xl:px-[74px] lg:px-[50px] md:px-[40px] sm:px-[30px] px-[50px] xl:py-11 lg:py-9 md:py-8 sm:py-7 py-5">
                  <NewsletterBannerPage
                    maxWidth="max-w-[583px]"
                    align="right"
                    title={news?.heading?.[langCode]}
                    heading={news?.title?.[langCode]}
                    description={news?.offer_description?.[langCode]}
                    theme={theme}
                  />
                  <div className="xl:mt-10 lg:mt-8 md:mt-7 sm:mt-6 mt-5 w-full">
                    <div className="relative w-full">
                      <form
                        className="w-full"
                        form={form}
                        onSubmit={(e) => {
                          e.preventDefault();
                          const email = e.target.email.value;
                          handleSubmit({ body: { email } });
                          e.target.reset();
                        }}
                      >
                        <input
                          type="email"
                          name="email"
                          placeholder="Your Email"
                          required
                          onInvalid={(e) =>
                            e.target.setCustomValidity(
                              "Please enter a valid email address."
                            )
                          }
                          onInput={(e) => e.target.setCustomValidity("")}
                          className="w-full bg-white/70 xl:p-4 lg:p-3 p-2 pr-[22%] rounded-full focus:outline-none focus:ring-0 description-1"
                        />
                        <button
                          type="submit"
                          className="absolute top-0 right-0 h-full w-[30%] bg-primary text-white rounded-r-full description-1 hover:bg-[#2A3479] transition duration-300"
                        >
                          {i18n.t("Subscribe")}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Newsletter;