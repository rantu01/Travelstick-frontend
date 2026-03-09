'use client'
import React from 'react';
import { useFetch } from '@/app/helper/hooks';
import Banner from '../../site/common/component/Banner';
import { fetchPageContentTheme1, getBlogCategoriesPublic, getLatestPublicBlogSite } from '@/app/helper/backend';
import BlogCard from '../../site/common/card/blogCard1';
import SectionHeaderPage from '../../common/sectionHeader';
import { useI18n } from '@/app/contexts/i18n';
import Banner2 from '../../site/common/component/Banner2';
import SectionHeaderPage2 from '../../common/sectionHeader2';
import { FaSearch } from 'react-icons/fa';
import { Select, Input } from 'antd';

const { Option } = Select;

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState(null);

  const [data, getData] = useFetch(getLatestPublicBlogSite, { limit: 100 }, false);
  const [categories] = useFetch(getBlogCategoriesPublic);
  const [blogsData] = useFetch(fetchPageContentTheme1);
  const blogData = blogsData?.content?.blog;
  const { langCode, t } = useI18n();

  const [data1] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  const theme = data1?.theme;

  React.useEffect(() => {
    getData({
      search: searchTerm,
      category: selectedCategory,
    });
  }, [searchTerm, selectedCategory]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

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

        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-8">
          <div className="relative w-full md:w-1/2">
            <Input
              placeholder={t("Search blogs...")}
              size="large"
              prefix={<FaSearch className="text-gray-400 mr-2" />}
              value={searchTerm}
              onChange={handleSearch}
              className="rounded-lg"
              allowClear
            />
          </div>
          <div className="w-full md:w-1/3">
            <Select
              placeholder={t("Select Category")}
              size="large"
              className="w-full"
              onChange={(v) => setSelectedCategory(v)}
              allowClear
              value={selectedCategory}
            >
              {categories?.docs?.map((cat) => (
                <Option key={cat._id} value={cat._id}>
                  {cat.name?.[langCode] || cat.name?.en || cat.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-6 sm:mt-7 lg:mt-9 xl:mt-[44px] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6 lg:gap-5 md:gap-4 gap-3">
          {
            data?.docs?.map((item, index) => (
              <BlogCard key={index} data={item} />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default BlogPage;