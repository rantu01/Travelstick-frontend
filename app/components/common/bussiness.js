"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import ExploreBtn from "../btn/ExploreBtn";
import { useFetch } from "@/app/helper/hooks";
import { fetchPageContent } from "@/app/helper/backend";
import { useI18n } from "@/app/contexts/i18n";

const Business = ({ theme, exploreBtn }) => {
  const [data, getData, loading] = useFetch(fetchPageContent, {}, false);
  const i18n = useI18n();
  const {langCode} = useI18n();
  useEffect(() => {
    getData({ slug: "about" });
  }, []);

  return (
    <div className={`${theme === "theme2" ? "lg:pb-20" : ""} travel-container`}>
      <h1 className="heading-2 text-white max-w-[814px]">
        {data?.content?.title}
      </h1>
      <div className="sm:flex md:gap-6 justify-between lg:gap-16 items-start lg:mt-12 mt-6 md:mt-8">
        <div className="md:w-1/2 lg:w-2/3 relative">
          <Image
            className="lg:w-36 hidden lg:block absolute -top-16  -right-16"
            src="/Design_Ellement.png"
            width={1000}
            height={1000}
            alt="image"
          />
          {data?.content?.image ? (
            <Image
              className="relative z-20"
              src={data?.content?.image}
              width={1000}
              height={1000}
              alt="image"
            />)
            :

            (<Image
              className="relative z-20"
              src={"/about2.png"}
              width={1000}
              height={1000}
              alt="image"
            />
            )}

          <div className="bg-[#333333] common-bg text-white z-30 lg:gap-16 flex items-center absolute -bottom-12 lg:-bottom-20 right-0 md:-right-0 lg:-right-3 xl:-right-36 justify-center lg:py-8 lg:px-12  p-2 md:p-4 gap-5 lg:p-0">
            <div className="flex gap-2 lg:gap-4 items-center">
              {
                data?.content?.project?.iconImg1 && (
                  <Image
                    className="w-5 md:w-12 lg:w-20"
                    src={data?.content?.project?.iconImg1}
                    width={80}
                    height={50}
                    alt="image"
                  />
                )
              }

              <div>
                <h1 className="heading-7">
                  {data?.content?.project?.num_projects}+
                </h1>
                <h4 className="description-1 font-normal">{i18n.t("Project Complete")}</h4>
              </div>
            </div>
            <div className="flex gap-2 lg:gap-4 items-center">
              {
                data?.content?.experience?.iconImg2 && (
                  <Image
                    className="w-5 md:w-12 lg:w-20"
                    src={data?.content?.experience?.iconImg2}
                    width={80}
                    height={50}
                    alt="image"
                  />
                )
              }
              <div>
                <h1 className="heading-7">
                  {data?.content?.experience?.year_experiences}+
                </h1>
                <h4 className="description-1 font-normal">
                  {i18n.t("Years of Experiences")}
                </h4>
              </div>
            </div>
          </div>
          <Image
            className="w-36 hidden lg:block absolute bottom-0 -left-16 z-30"
            src="/Design_Ellement (1).png"
            width={1000}
            height={1000}
            alt="image"
          />
        </div>
        <div className="lg:w-1/3 md:w-1/2 banner_paragraph text-white mt-[20%] md:mt-0 lg:mt-0 flex flex-col justify-center items-center">
          <p
            className="description-2 text-[#888AA0] capitalize"
            dangerouslySetInnerHTML={{
              __html: data?.content?.description?.[langCode],
            }}
          ></p>
          {
            !exploreBtn && (
              <div className="lg:my-8">
                <ExploreBtn
                  theme={theme}
                  link="about"
                  iconColor={"#55E6A5"}
                  textColor={"#888AA0"}
                />
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Business;
