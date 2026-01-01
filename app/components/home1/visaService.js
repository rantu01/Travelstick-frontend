"use client";
import React from "react";
import SectionHeaderPage from "../common/sectionHeader";
import Link from "next/link";
import { useI18n } from "@/app/contexts/i18n";
import { useFetch } from "@/app/helper/hooks";
import { fetchPageContentTheme1, getAllPublicVisa } from "@/app/helper/backend";
import SkeletonLoading from "../common/skeletonLoading";
import VisaCard1 from "../site/common/card/visaCard1";
const VisaService = () => {
  const { langCode } = useI18n();
  const [services] = useFetch(fetchPageContentTheme1);
  const visaData = services?.content?.visa;
  const [data] = useFetch(getAllPublicVisa, { limit: 100 });
  const i18n = useI18n();

  const isLoading = data?.docs?.leghth === 0;

  return (
    <>
      {isLoading ? (
        <SkeletonLoading cols={4} />
      ) : (
        <div className="travel-container w-full">
          <SectionHeaderPage
            maxWidth="max-w-[583px]"
            align="right"
            title={visaData?.heading?.[langCode]}
            heading={visaData?.title?.[langCode]}
            description={visaData?.offer_description?.[langCode]}
          />
          <div className="mt-6 sm:mt-7 lg:mt-9 xl:mt-[44px] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 lg:gap-5 md:gap-4 gap-3">
            {data?.docs?.map((item, index) => (
              <VisaCard1 key={index} data={item} />
            ))}
          </div>
          { data?.docs?.length > 0 && (
            <div className="flex justify-center xl:mt-14 lg:mt-10 md:mt-8 sm:mt-5 mt-5">
              <Link href="/visa" className="common-btn animate-bounceLeftRight">
                {i18n.t("Explore More")}
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VisaService;
