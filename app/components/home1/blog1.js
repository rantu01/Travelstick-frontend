"use client";
import React, { use, useEffect } from "react";
import { useFetch } from "@/app/helper/hooks";
import SectionHeaderPage from "../common/sectionHeader";
import {
  fetchPageContentTheme1,
  getLatestPublicBlogSite,
} from "../../helper/backend";
import BlogCard from "../site/common/card/blogCard1";
import { useI18n } from "@/app/contexts/i18n";
import Link from "next/link";
import SkeletonLoading from "../common/skeletonLoading";
import SectionHeaderPage2 from "../common/sectionHeader2";

const Blog1 = ({ theme }) => {
  const [blogs] = useFetch(getLatestPublicBlogSite, { limit: 3 });
  const { langCode } = useI18n();
  const [blogsData] = useFetch(fetchPageContentTheme1);
  const blogData = blogsData?.content?.blog;
  const i18n = useI18n();

  const isLoading = blogs?.docs?.length === 0;

  return (
    <div className="travel-container w-full">
      {isLoading ? (
        <SkeletonLoading cols={1} />
      ) : (
        theme === 'one' ?
          <SectionHeaderPage
            maxWidth="max-w-[583px]"
            align="center"
            title={blogData?.heading?.[langCode]}
            heading={blogData?.title?.[langCode]}
            description={blogData?.offer_description?.[langCode]}
          /> :
          <SectionHeaderPage2
            maxWidth="max-w-[583px]"
            align="center"
            title={blogData?.heading?.[langCode]}
            heading={blogData?.title?.[langCode]}
            description={blogData?.offer_description?.[langCode]}
          />
      )}
      {isLoading ? (
        <SkeletonLoading cols={3} />
      ) : (
        <div>
          <div className="mt-6 sm:mt-7 lg:mt-9 xl:mt-[44px] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6 lg:gap-5 md:gap-4 gap-3">
            {blogs?.docs?.map((item, index) => (
              <BlogCard key={index} data={item} />
            ))}
          </div>
          {blogs?.docs?.length > 0 && (
            <div className="flex justify-center xl:mt-14 lg:mt-10 md:mt-8 sm:mt-5 mt-5">
              <Link href="/blog">
                <button className="common-btn animate-bounceLeftRight">
                  {i18n.t("Explore More")}
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog1;
