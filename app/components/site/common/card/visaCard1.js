"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";
import TextWithTooltip from "@/app/helper/utils";
import AnimatedContent from "@/app/components/ui/animatedContent";

const VisaCard1 = ({ data }) => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const { currency_symbol } = useCurrency();

  return (
    <AnimatedContent direction="horizontal" distance={50} reverse={true}>
      <div className="group w-full rounded-[10px] lg:rounded-[20px] border border-[#E8EAE8] flex flex-col">
        <div className="relative w-full overflow-hidden group">
          {data?.card_image && (
            <Image
              className="w-full md:w-[424px] h-[220px] lg:h-[250px] object-fill rounded-[10px] lg:rounded-[12px]"
              src={data?.card_image}
              width={424}
              height={380}
              alt="images"
            />
          )}
        </div>

        <div className="xl:p-4 lg:p-3 p-2 flex flex-col flex-1">
          <p className="description-3 text-[#1A1A1A] whitespace-pre">
            <TextWithTooltip limit={20} text={data?.title[langCode]} />
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
                    <TextWithTooltip limit={12} text={item?.text[langCode]} />
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

export default VisaCard1;
