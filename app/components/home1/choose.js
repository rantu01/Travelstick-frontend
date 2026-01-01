"use client";
import React, { use, useEffect } from "react";
import Image from "next/image";
import SectionHeaderPage from "../common/sectionHeader";
import { useFetch } from "@/app/helper/hooks";
import { fetchDynamicSettings } from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import AnimatedContent from "../ui/animatedContent";
import SkeletonLoading from "../common/skeletonLoading";

const Choose = ({ position = "lg:flex-row" }) => {
  const [data] = useFetch(fetchDynamicSettings, { limit: 100 });
  const chooseData = data?.[0];
  const { langCode } = useI18n();
  const isLoading = chooseData?.content?.data;
  return (
    <>
      {isLoading ? (
        <SkeletonLoading cols={2} />
      ) : (
        <div>
          {chooseData && (
            <div className="relative w-full overflow-hidden">
              <Image
                src="/theme1/choose/bg.png"
                alt="Background"
                fill
                className="object-cover"
                priority
              />
              <div
                className={`travel-container relative z-10 w-full h-full flex flex-col ${position} xl:gap-10 lg:gap-8 md:gap-6 gap-4 xl:my-[60px] lg:my-12 md:my-10 `}
              >
                <div className="w-full lg:w-[45%]  flex flex-col   justify-center  items-center !mx-auto">
                  <AnimatedContent
                    distance={100}
                    direction="horizontal"
                    reverse={true}
                  >
                    <div className="relative xl:w-[443px] sm:w-[380px] sm:h-[500px] w-[350px] xl:h-[583px]  mx-auto">
                      <Image
                        src="/theme1/choose/choseBg.png"
                        alt="Background"
                        width={443}
                        height={583}
                        className="object-cover xl:w-[443px] sm:w-[380px] sm:h-[500px] w-[350px] xl:h-[583px] rounded-md"
                      />

                      <div className="absolute inset-0 flex items-center justify-center xl:w-[443px] sm:w-[380px] w-[350px]  sm:h-[500px] xl:h-[583px] !z-5">
                        {chooseData?.content?.image && (
                          <AnimatedContent
                            distance={50}
                            direction="horizontal"
                            reverse={false}
                          >
                            <Image
                              src={
                                chooseData?.content?.image ||
                                "/theme1/choose/card.png"
                              }
                              alt="Main Image"
                              width={443}
                              height={583}
                              className="rounded-t-[250px]  xl:w-[443px] sm:w-[380px] w-[350px] sm:h-[500px] xl:h-[583px] !ml-5 "
                            />
                          </AnimatedContent>
                        )}
                      </div>

                      <div className="absolute -top-3 right-0 !z-20 -mr-16 hidden xl:block">
                        <AnimatedContent
                          distance={50}
                          direction="vertical"
                          reverse={false}
                        >
                          <Image
                            src="/theme1/choose/rightD.png"
                            alt="Top Right"
                            width={280}
                            height={222}
                          />
                        </AnimatedContent>
                      </div>
                      <div className="absolute -bottom-2 xl:w-[463px] sm:w-[400px] w-[350px] h-[75px] -mb-3 !z-50 hidden sm:block">
                        <Image
                          src="/theme1/choose/bottom.png"
                          alt="Bottom Effect"
                          width={463}
                          height={75}
                          className="xl:w-[463px] sm:w-[400px] w-[350px] h-[75px] relative !z-50"
                        />
                      </div>
                    </div>
                  </AnimatedContent>
                </div>
                <div className="w-full lg:w-[55%] xl:w-[65%] flex">
                  <div className="w-full md:mt-10 mt-10">
                    <SectionHeaderPage
                      maxWidth="max-w-[673px]"
                      align="right"
                      title={chooseData?.content?.title?.[langCode]}
                      heading={
                        chooseData?.content?.short_description?.[langCode]
                      }
                    />
                    <p
                      className="description text-[#717171]"
                      dangerouslySetInnerHTML={{
                        __html: chooseData?.content?.description?.[langCode],
                      }}
                    ></p>
                    <div className="xl:mt-10 lg:mt-8 md:mt-7 sm:mt-6 mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 xl:gap-6 lg:gap-5 md:gap-4 sm:gap-3 gap-2">
                      {chooseData?.content?.features?.map((item, index) => (
                        <div
                          key={index}
                          className={`${
                            index === 0
                              ? "bg-[#E0F3FE] animate-bounceLeftRight"
                              : index === 1
                              ? "bg-[#FCE9D8] animate-bounceUpDown"
                              : index === 2
                              ? "bg-[#FFF2EA] animate-bounceLeftRight"
                              : "bg-[#BAE7FD] animate-bounceUpDown"
                          } flex items-center border  lg:gap-3 gap-2 xl:p-6 lg:p-5 md:p-4 sm:p-3 p-2 rounded-[20px] shadow-[0px_0px_70px_rgba(0,0,0,0.001)]`}
                        >
                          <div>
                            <div
                              className={`${
                                index === 0
                                  ? "bg-[#0EA9E9]"
                                  : index === 1
                                  ? "bg-[#EF8248]"
                                  : index === 2
                                  ? "bg-[#EB6224]"
                                  : "bg-[#0288C7]"
                              } relative w-14 h-14 rounded-full`}
                            >
                              <Image
                                src={item?.feature_icon}
                                alt={"Image"}
                                width={1000}
                                height={1000}
                                className="object-fill w-full h-full p-2 flex items-center justify-center"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <h3 className="description-2 !font-semibold text-[#05073C]">
                              {item?.feature_title?.[langCode]}
                            </h3>
                            <p className="description-1 !font-normal text-[#717171]">
                              {item?.feature_shortDescription?.[langCode]}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Choose;
