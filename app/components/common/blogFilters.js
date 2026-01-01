"use client";
import { useI18n } from "@/app/contexts/i18n";
import { useFetch } from "@/app/helper/hooks";
import { getLatestPublicBlog } from "@/app/helper/backend";
import Image from "next/image";
import Link from "next/link";
const BlogFilters = () => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const [latestBlog] = useFetch(getLatestPublicBlog, { limit: 3 });
  return (
    <div>
      <div className="xl:mt-6 lg:mt-5 mt-4 border border-[#E8EAE8] rounded-[10px] lg:rounded-[20px] xl:p-6 lg:p-5 md:p-4 p-3">
        <h4 className="description-2 text-[#05073C] !font-bold border-b border-[#E8EAE8] pb-2">{i18n.t("Recent Posts")}</h4>
        {
          latestBlog?.docs?.map((item, index) => (
            <Link href={`/blog/${item?._id}`} key={index} className="flex items-center gap-2 xl:mt-5 lg:mt-4 mt-3">
              <div>
                {
                  item?.card_image && (
                    <Image src={item?.card_image} alt="Image"
                      width={2000}
                      height={2000}
                      className="w-10 h-10 rounded-[10px]"
                    />
                  )
                }
              </div>
              <div>
                <p className="text-[#05073C] description-1">{item?.title?.[langCode]}</p>
                <p className="text-[#717171] description-1">{item?.read_time} min</p>
              </div>
            </Link>
          ))
        }
      </div>
    </div>
  );
}

export default BlogFilters;