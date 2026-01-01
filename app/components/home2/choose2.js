"use client";
import React from "react";
import Image from "next/image";
import { useFetch } from "@/app/helper/hooks";
import { fetchDynamicSettings, fetchPublicSettings } from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";
import AnimatedContent from "../ui/animatedContent";
import SkeletonLoading from "../common/skeletonLoading";
import SectionHeaderPage2 from "../common/sectionHeader2";

const Choose2 = ({ position = "lg:flex-row" }) => {
  const [data] = useFetch(fetchDynamicSettings, { limit: 100 });
  const [setting] = useFetch(fetchPublicSettings);
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
                src="/theme2/left.png"
                alt={"Image"}
                width={1000}
                height={1000}
                className="absolute hidden top-28 left-0 object-fill w-[184px] h-[174px] p-2 xl:flex items-center justify-center"
              />
              <Image
                src="/theme2/right.png"
                alt={"Image"}
                width={1000}
                height={1000}
                className="absolute hidden -bottom-12 right-0 object-fill w-[282px] h-[451px] p-2 2xl:flex items-center justify-center"
              />
              <div
                className={`travel-container relative z-10 w-full h-full flex flex-col ${position} xl:gap-10 lg:gap-8 md:gap-6 gap-4 xl:my-[60px] lg:my-12 md:my-10 `}>
                <div className="w-full flex flex-col relative">
                  <AnimatedContent
                    distance={100}
                    direction="horizontal"
                    reverse={true}
                  >
                    <div className="xl:w-[443px] sm:w-[380px] sm:h-[500px] w-[350px] xl:h-[583px] ">
                      <div className="flex items-center">
                        <AnimatedContent
                          distance={100}
                          direction="vertical"
                          reverse={true}
                        >
                          <Image
                            src="/theme2/support.jpg"
                            width={1000}
                            height={1000}
                            className="object-cover w-36 h-36 md:w-[224px] md:h-[224px] rounded-full"
                            alt="Travel support"
                          />
                        </AnimatedContent>
                        <div className="shadow-custom-light bg-white/60 backdrop-blur-[10px] animate-bounceLeftRight rounded-xl lg:rounded-[20px] px-4 lg:px-6 py-2 lg:py-4 relative z-20 -ml-4">
                          <p className="text-[#05073C] text-sm md:text-base font-semibold">
                            Customer support
                          </p>
                          <h3 className="text-black text-lg md:text-xl font-bold">
                           {setting?.site_phone}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-start justify-end md:!ml-40 lg:!ml-0 w-full">
                        <AnimatedContent
                          distance={100}
                          direction="vertical"
                          reverse={true}
                        >
                          <Image
                            src="/theme2/bag.PNG"
                            width={1000}
                            height={1000}
                            className="!mr-8 -mt-10 object-fill w-[245px] h-[300px] md:h-[350px] xl:h-[457px] opacity-0 md:opacity-100"
                            alt="Travel support"
                          />
                        </AnimatedContent>
                        <div className="flex items-center absolute bottom-1/2 right-0">
                          <AnimatedContent
                            distance={100}
                            direction="vertical"
                            reverse={false}
                          >
                            <Image
                              src="/theme2/woman.jpg"
                              width={1000}
                              height={1000}
                              className="object-cover w-20 h-20 md:w-[140px] md:h-[140px] rounded-full"
                              alt="Travel support"
                            />
                          </AnimatedContent>
                          <div className="shadow-custom-light bg-white/60 backdrop-blur-[10px]  animate-bounceUpDown rounded-[20px] lg:rounded-[50px] px-4 md:px-6 py-2 md:py-4 relative z-20 -ml-4">
                            <h3 className="text-black text-base md:text-lg font-bold whitespace-pre">
                              Tour Guide
                            </h3>
                          </div>
                        </div>
                        <div className="absolute top-1/2 left-0">
                          <AnimatedContent
                            distance={100}
                            direction="horizontal"
                            reverse={false}
                          >
                            <Image
                              src="/theme2/ticket.jpg"
                              width={1000}
                              height={1000}
                              className="object-cover w-20 h-20 md:w-[140px] md:h-[140px] rounded-full"
                              alt="Travel support"
                            />
                          </AnimatedContent>
                          <div className="mt-3 lg:mt-6 shadow-custom-light  animate-bounceUpDown bg-white/60 backdrop-blur-[10px] rounded-[20px] md:rounded-[50px] px-4 md:px-6 py-2 md:py-4 relative z-20 ">
                            <h3 className="text-black text-base md:text-lg font-bold whitespace-pre">
                              Flight Tickets
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedContent>
                </div>
                <div className="w-full  flex">
                  <div className="w-full md:mt-10 mt-10">
                    <SectionHeaderPage2
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
                          className={`flex items-center lg:gap-3 gap-2 xl:p-6 lg:p-5 md:p-4 sm:p-3 p-2 rounded-[20px] shadow-[0px_0px_70px_rgba(0,0,0,0.001)]`}
                        >
                          <div>
                            <div
                              className={`relative w-14 h-14 rounded-full`}
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

export default Choose2;
