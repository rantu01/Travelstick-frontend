"use client";
import Banner from "@/app/components/site/common/component/Banner";
import { useI18n } from "@/app/contexts/i18n";
import { fetchPageContentTheme1, getLatestPublicBlogSite } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Drawer } from "antd";
import BlogFilters from "@/app/components/common/blogFilters";
import Banner2 from "@/app/components/site/common/component/Banner2";
const BlogDetails = () => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const [data, getData] = useFetch(getLatestPublicBlogSite, {}, false);
  const params = useParams();
  const { _id } = params;
  useEffect(() => {
    getData({ _id: _id });
  }, []);
  const [openDrawer, setOpenDrawer] = useState(false);
  const blogDetailsData = [
    {
      heading: data?.author?.name,
      title: "Admin",
      image: data?.author?.image,
    },
    {
      heading: i18n.t("Published On"),
      title: dayjs(data?.created_at).format("DD MMMM YYYY"),
      image: "/theme1/blog/calender.png",
    },
    {
      heading: i18n.t("Read Time"),
      title: `${data?.read_time} min`,
      image: "/theme1/blog/watch.png",
    },
  ]

  const [data1] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  const theme = data1?.theme;

  return (
    <div className="">
      {
        theme === 'one' ?
          <Banner title="Blog Details" /> :
          <Banner2 title="Blog Details" />
      }
      <div className="travel-container xl:mt-[106px] lg:mt-[90px] md:mt-20 xm:mt-16 mt-12 relative">
        <div className="w-full rounded-[10px] lg:rounded-[20px] overflow-hidden">
          {
            data?.banner_image && (
              <Image src={data?.banner_image} alt="Image"
                width={2000}
                height={2000}
                className="w-[1320px] xl:h-[560px] lg:h-[400px] md:h-[300px] h-[250px]  rounded-[10px] lg:rounded-[20px]"
              />
            )
          }
        </div>
        {/* Filter icon for mobile */}
        <div className="flex gap-2 items-center justify-end lg:hidden my-4 md:my-6">
          <button
            className="text-xl p-2 border border-gray-300 rounded-md"
            onClick={() => setOpenDrawer(true)}
          >
            <Image
              src="/theme1/filter.png"
              alt="Filter"
              width={20}
              height={20}
              className="w-[20px] h-[20px]"
            />
          </button>
          <p className="heading-1 text-[#000000]">{i18n.t("Filters")}</p>
        </div>
        {/* Drawer for filters */}
        <Drawer
          title={i18n.t("Filters")}
          onClose={() => setOpenDrawer(false)}
          open={openDrawer}
          className="sm:hidden"
        >
          <BlogFilters />
        </Drawer>
        <div className="flex xl:gap-14 lg:gap-6 md:gap-4 gap-3 xl:mt-10 lg:mt-8 md:mt-6 mt-5">
          <div className="w-full lg:w-[70%]">
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:gap-4 lg:gap-3 md:gap-2 gap-3">
                {
                  blogDetailsData?.map((item, index) => (
                    <div key={index} className="flex lg:gap-3 gap-2 last:border-0 xl:border-r">
                      <div className="w-14 h-14 flex justify-center items-center rounded-full bg-[#FEF5EE]">
                        {
                          item?.image && (
                            <Image
                              src={item?.image}
                              alt="Book"
                              width={1000}
                              height={1000}
                              className={`object-cover h-full w-full ${index === 0 ? "rounded-full p-1" : "p-3"}`}
                            />
                          )
                        }
                      </div>
                      <div>
                        <h3 className="description-2 !font-bold text-[#05073C]">{i18n.t(item?.heading)}</h3>
                        <p className="description-1 !font-medium text-[#717171]">{item?.title}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className="xl:mt-10 lg:mt-8 md:mt-6 mt-5">
                <p className="description-1 text-[#717171]">{data?.short_description?.[langCode]}</p>
              </div>
              <div className="overflow-hidden xl:mt-10 lg:mt-8 md:mt-6 mt-5 flex justify-between lg:gap-6 md:gap-4 gap-2">
                {
                  data?.card_image && (
                    <Image
                      src={data?.card_image}
                      alt="Book"
                      width={1000}
                      height={1000}
                      className="object-cover w-[464px] xl:h-[314px] lg:h-[280px] md:h-[250px] h-[200px] rounded-[10px] lg:rounded-[20px]"
                    />
                  )
                }
                {
                  data?.banner_image && (
                    <Image
                      src={data?.banner_image}
                      alt="Book"
                      width={1000}
                      height={1000}
                      className="object-cover w-full xl:w-[464px] xl:h-[314px] lg:h-[280px] md:h-[250px] h-[200px] rounded-[10px] lg:rounded-[20px]"
                    />
                  )
                }
              </div>
              <div className="xl:mt-10 lg:mt-8 md:mt-6 mt-5">
                <p dangerouslySetInnerHTML={{ __html: data?.description?.[langCode] }} className="description-1 text-[#717171]" />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[30%] hidden lg:block">
            <BlogFilters />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
