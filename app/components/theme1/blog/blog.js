'use client'
import React from 'react';
import { useFetch } from '@/app/helper/hooks';
import Banner from '../../site/common/component/Banner';
import { fetchPageContentTheme1, getLatestPublicBlogSite } from '@/app/helper/backend';
import BlogCard from '../../site/common/card/blogCard1';
import SectionHeaderPage from '../../common/sectionHeader';
import { useI18n } from '@/app/contexts/i18n';
import Banner2 from '../../site/common/component/Banner2';
import SectionHeaderPage2 from '../../common/sectionHeader2';
const BlogPage = () => {
  const [data] = useFetch(getLatestPublicBlogSite, { limit: 100 },);
  const [blogsData] = useFetch(fetchPageContentTheme1);
  const blogData = blogsData?.content?.blog;
  const { langCode } = useI18n();

  const [data1] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  const theme = data1?.theme;

  return (
    <div className="">
      {
        theme === 'one' ?
          <Banner title="Blogs" /> :
          <Banner2 title="Blogs" />
      }
      <div className="travel-container xl:mt-[100px] lg:mt-[82px] md:mt-20 xm:mt-16 mt-12 relative overflow-hidden pt-2">
        {
          theme === 'one' ?
            <SectionHeaderPage
              maxWidth="max-w-[583px]"
              align="right"
              title={blogData?.heading?.[langCode]}
              heading={blogData?.title?.[langCode]}
              description={blogData?.offer_description?.[langCode]}
            /> :
            <SectionHeaderPage2
              maxWidth="max-w-[583px]"
              align="right"
              title={blogData?.heading?.[langCode]}
              heading={blogData?.title?.[langCode]}
              description={blogData?.offer_description?.[langCode]}
            />
        }
        <div className="mt-6 sm:mt-7 lg:mt-9 xl:mt-[44px] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6 lg:gap-5 md:gap-4 gap-3">
          {
            data?.docs?.map((item, index) => (
              <BlogCard key={index} data={item} />
            ))
          }
        </div>
      </div>
    </div >
  );
};

export default BlogPage;