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

  const isLoading = !data || data?.docs?.length === 0;

  return (
    <div className="travel-container w-full py-10 md:py-16">
      {isLoading ? (
        <SkeletonLoading cols={4} />
      ) : (
        <>
          <SectionHeaderPage
            maxWidth="max-w-[583px]"
            align="center"
            title={visaData?.heading?.[langCode]}
            heading={visaData?.title?.[langCode]}
            description={visaData?.offer_description?.[langCode]}
          />

          {/* গ্রিড লেআউট */}
          <div className="mt-8 sm:mt-10 lg:mt-12 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {data?.docs?.map((item, index) => (
              <VisaCard1 key={index} data={item} />
            ))}
          </div>

          {data?.docs?.length > 0 && (
            <div className="flex justify-center mt-10 md:mt-14">
              <Link href="/visa" className="common-btn px-10 py-3 bg-[#007bff] text-white rounded-full font-bold hover:bg-blue-700 transition-all">
                {i18n.t("Explore More")}
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VisaService;