"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";
import TextWithTooltip from "@/app/helper/utils";
import AnimatedContent from "@/app/components/ui/animatedContent";

const VisaCard2 = ({ data, slug }) => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const { currency_symbol } = useCurrency();

  return (
    <AnimatedContent direction="horizontal" distance={50} reverse={true}>
      <div className="flex flex-col sm:flex-row group w-full !rounded-[10px] lg:!rounded-[20px] border border-[#E8EAE8] ">
        <div className="relative overflow-hidden">
          {data?.card_image && (
            <Image
              className="w-full sm:w-[294px] h-[220px] lg:h-[242px] object-fill rounded-l-[10px] lg:rounded-l-[20px]"
              src={data?.card_image}
              width={424}
              height={380}
              alt="images"
            />
          )}
        </div>

        <div className="lg:p-4 p-3 flex flex-col w-full">
          <p className="description-3 text-[#1A1A1A] whitespace-pre">
            <TextWithTooltip limit={30} text={data?.title?.[langCode]} />
          </p>
          <div className="grid grid-cols-2 justify-between items-center xl:mt-4 lg:mt-3 mt-2 border-b pb-3 lg:pb-4 border-[#E8EAE8]">
            {data?.feathers?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="lg:mt-3 mt-2 flex items-center gap-2"
                >
                  <Image src={item?.logo} width={20} height={20} alt="icon" />
                  <p className="description-4 text-[#717171] whitespace-pre">
                    {
                      slug === 'page' ?
                        <TextWithTooltip limit={10} text={item?.text?.[langCode]} />
                        :
                        <TextWithTooltip limit={20} text={item?.text?.[langCode]} />
                    }
                  </p>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center mt-auto pt-3">
            <Link
              href={`/visa/${data?._id}`}
              className="details-button"
            >
              {i18n.t("View Details")}
            </Link>
            <p className="heading-4 text-[#EB662B] whitespace-pre">
              {currency_symbol} {data?.current_price?.toFixed(1)}
              <span className="description-4 text-[#717171]">/per person</span>
            </p>
          </div>
        </div>
      </div>
    </AnimatedContent>
  );
};

export default VisaCard2;
