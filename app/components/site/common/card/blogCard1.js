"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsCalendar4Week } from "react-icons/bs";
import dayjs from "dayjs";
import { useI18n } from "@/app/contexts/i18n";
import CommonButton from "../../../btn/commonButton";
import AnimatedContent from "@/app/components/ui/animatedContent";
import TextWithTooltip from "@/app/helper/utils";
const BlogCard = ({ data }) => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  return (
    <AnimatedContent direction="horizontal" distance={100} reverse={false}>
      <div className="group w-full rounded-[10px] lg:rounded-[20px] border border-[#E8EAE8] hover:shadow-custom-light transition-all duration-300 ease-in-out">
        <div className="relative w-full overflow-hidden group">
          {data?.card_image && (
            <Image
              className="w-full md:w-[424px] h-[220px] md:h-[280px] lg:h-[348px] object-cover rounded-t-[10px] lg:rounded-t-[20px]"
              src={data?.card_image}
              width={424}
              height={380}
              alt="images"
            />
          )}
        </div>
        <div className="xl:p-6 lg:p-5 md:p-4 p-3">
          <div className="md:text-sm lg:text-xl">
            <div className="">
              <div className="flex items-center gap-2">
                <BsCalendar4Week className="description-1 text-[#717171]" />
                <h3 className="description-1 text-[#717171]">
                  {dayjs(data?.createdAt).format("MMM DD, YYYY")}
                </h3>
              </div>
            </div>
            <h1 className="description-3 lg:mt-4 mt-3 text-[#05073C] group-hover:text-primary transform duration-300">
              <TextWithTooltip limit={35} text={data?.title?.[langCode]} /> 
            </h1>
            <p className="description-1 lg:mt-4 mt-3 text-[#717171]">
              <TextWithTooltip limit={90} text={data?.short_description?.[langCode]} />
            </p>
            <div className="flex items-center justify-between gap-2 mt-5 sm:mt-6 lg:mt-8 xl:mt-10">
              <div className="flex gap-2">
                <div>
                  {data?.author?.image ? (
                    <Image
                      className="rounded-full w-[40px] h-[40px] object-fill"
                      src={data?.author?.image}
                      width={400}
                      height={400}
                      alt="image"
                    />
                  ) : (
                    <Image
                      className="rounded-full w-[40px] h-[40px] object-fill"
                      src="/theme1/user.jpg"
                      width={400}
                      height={400}
                      alt="image"
                    />
                  )}
                </div>
                <div>
                  <h1 className="description-1 text-[#05073C] !font-semibold">
                    {" "}
                    {data?.author?.name}
                  </h1>
                  <h1 className="font-lato text-[#717171] lg:text-xs text-[10px]">
                    Admin
                  </h1>
                </div>
              </div>
              <Link
                href={`/blog/${data?._id}`}
                className="flex items-center group gap-4 description-1 font-normal"
              >
                {/* <CommonButton text={i18n.t("Read more")} /> */}
                <button className="view-button">{i18n.t("Read more")}</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedContent>
  );
};

export default BlogCard;
