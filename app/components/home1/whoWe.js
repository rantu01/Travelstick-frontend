"use client";
import Image from "next/image";
import SectionHeaderPage from "../common/sectionHeader";
import { useFetch } from "@/app/helper/hooks";
import { fetchPageContent } from "@/app/helper/backend";
import { useEffect } from "react";
import { useI18n } from "@/app/contexts/i18n";
import Link from "next/link";
import ImageSlider from "../common/styleSlider";
import SkeletonLoading from "../common/skeletonLoading";
import SectionHeaderPage2 from "../common/sectionHeader2";

const WhoWeAre = ({ path, theme }) => {
  const [data, getData] = useFetch(fetchPageContent, {}, false);
  const { langCode } = useI18n();
  const about = data?.content;
  useEffect(() => {
    getData({ slug: "about" });
  }, []);
  const i18n = useI18n();
  const isLoading = !about;
  return (
    <>
      {isLoading ? (
        <SkeletonLoading cols={2} />
      ) : (
        <section
          className="py-16 bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: 'url("/theme1/whyWe/bg.png")' }}
        >
          <div className="travel-container mx-auto px-4 flex flex-col 2xl:flex-row items-center justify-between gap-6">
            <div className="w-full 2xl:w-1/2 sm:flex justify-center 2xl:-ml-40 mt-24 mb-40 2xl:mb-0 2xl:mt-0  hidden">
              <ImageSlider data={about} />
            </div>
            <div className="w-full 2xl:w-1/2">
              {
                theme == 'one' ?
                  <SectionHeaderPage
                    maxWidth="max-w-[650px]"
                    align="left"
                    heading={`${about?.short_description?.[langCode]}`}
                    title={`${about?.title?.[langCode]}`}
                  /> :
                  <SectionHeaderPage2
                    maxWidth="max-w-[650px]"
                    align="left"
                    heading={`${about?.short_description?.[langCode]}`}
                    title={`${about?.title?.[langCode]}`}
                  />
              }
              <p
                className="description text-[#717171]"
                dangerouslySetInnerHTML={{
                  __html: about?.description?.[langCode],
                }}
              />
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 xl:gap-6">
                {about?.features?.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-start gap-4">
                    <div className="bg-[#F4AE7D] rounded-full w-[70px] h-[70px]  flex items-center justify-center animate-bounceUpDown">
                      <Image
                        src={item?.feature_icon}
                        alt={"icon"}
                        width={100}
                        height={100}
                        className="!w-[60px] !h-[60px] p-2 object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold font-lato text-[#05073C] mb-3">
                        {item?.feature_title?.[langCode]}
                      </h4>
                      <p className="text-base font-lato text-[#717171] max-w-[200px]">
                        {item?.feature_shortDescription?.[langCode]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-base font-lato  mb-10 mt-5 text-[#05073C] max-w-[600px]">
                {about?.text?.[langCode]}
              </p>
              {path !== "about" && (
                <Link href="/about">
                  <button className="common-btn animate-bounceLeftRight">
                    {i18n.t("Discover More")}
                  </button>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
export default WhoWeAre;
