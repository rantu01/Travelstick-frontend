"use client";
import React, { use, useEffect } from "react";
import SectionHeaderPage from "../common/sectionHeader";
import Link from "next/link";
import PackageCard from "../site/common/card/packageCard";
import { useI18n } from "@/app/contexts/i18n";
import { useFetch } from "@/app/helper/hooks";
import {
  fetchPageContentTheme1,
  getAllPublicPackages,
} from "@/app/helper/backend";
import SkeletonLoading from "../common/skeletonLoading";
import SectionHeaderPage2 from "../common/sectionHeader2";
import PackageCard2 from "../site/common/card/packageCard2";
const Package = ({ theme }) => {
  const { langCode } = useI18n();
  const [packages] = useFetch(fetchPageContentTheme1);
  const packageData = packages?.content?.packages;
  const [data, getData, { loading }] = useFetch(getAllPublicPackages, {
    limit: 4,
  });
  const i18n = useI18n();
  useEffect(() => {
    getData();
  }, []);
  const isLoading = data?.docs?.length === 0;
  return (
    <>
      {isLoading ? (

        <SkeletonLoading cols={4} />

      ) : (
        <div className="travel-container w-full">
          {
            theme === 'one' ?
              <SectionHeaderPage
                maxWidth="max-w-[800px]"
                align="center"
                title={packageData?.heading?.[langCode]}
                heading={packageData?.title?.[langCode]}
                description={packageData?.offer_description?.[langCode]}
              /> :
              <SectionHeaderPage2
                maxWidth="max-w-[800px]"
                align="center"
                title={packageData?.heading?.[langCode]}
                heading={packageData?.title?.[langCode]}
                description={packageData?.offer_description?.[langCode]}
              />
          }
          <div className="mt-6 sm:mt-7 lg:mt-9 xl:mt-[44px] w-full grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 xl:gap-6 lg:gap-5 md:gap-4 gap-3">
            {data?.docs?.map((item, index) => (
              theme === 'one' ?
                <PackageCard key={index} data={item} index={index} /> :
                <PackageCard2 key={index} data={item} index={index} />
            ))}
          </div>
          {data?.docs?.length > 0 && (
            <div className="flex justify-center xl:mt-14 lg:mt-10 md:mt-8 sm:mt-5 mt-5">
              <Link
                href="/package"
                className="common-btn animate-bounceLeftRight"
              >
                {i18n.t("See All Package")}
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Package;
