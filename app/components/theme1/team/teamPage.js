
"use client";
import Banner from "@/app/components/site/common/component/Banner";
import React from "react";
import { useI18n } from "@/app/contexts/i18n";
import { useFetch } from "@/app/helper/hooks";
import { fetchPageContentTheme1, GetPublicProviders } from "@/app/helper/backend";
import ExpertCard1 from "../../site/common/card/expertCard1";
import SectionHeaderPage from "../../common/sectionHeader";
import Banner2 from "../../site/common/component/Banner2";
import SectionHeaderPage2 from "../../common/sectionHeader2";

const TeamPage = () => {
  const [data] = useFetch(GetPublicProviders, { limit: 100 },);
  const [experts] = useFetch(fetchPageContentTheme1);
  const expert = experts?.content?.tourGuides;
  const { langCode } = useI18n();

  const [data1] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  const theme = data1?.theme;

  return (
    <div className="">
      {
        theme === 'one' ?
          <Banner title="Tour Guiders" /> :
          <Banner2 title="Tour Guiders" />
      }
      <div className="travel-container xl:mt-[100px] lg:mt-[90px] md:mt-20 xm:mt-16 mt-12 relative overflow-hidden pt-2">

        {
          theme === 'one' ?
            <SectionHeaderPage
              maxWidth="max-w-[580px]"
              align="right"
              title={expert?.heading?.[langCode]}
              heading={expert?.title?.[langCode]}
              description={expert?.offer_description?.[langCode]}
            /> :
            <SectionHeaderPage2
              maxWidth="max-w-[580px]"
              align="right"
              title={expert?.heading?.[langCode]}
              heading={expert?.title?.[langCode]}
              description={expert?.offer_description?.[langCode]}
            />
        }
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 xl:gap-6">
          {
            data?.docs?.map((item, index) => (
              <ExpertCard1 key={index} data={item} />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
