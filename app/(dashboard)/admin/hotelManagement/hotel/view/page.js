'use client';

import React, { use, useEffect } from "react";
import { getAllHotel } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { useI18n } from "@/app/contexts/i18n";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import { useCurrency } from "@/app/contexts/site";
import Image from "next/image";
import { Image as AntdImage } from "antd";

const ViewHotel = () => {
  const [data, getData] = useFetch(getAllHotel, {}, false);
  const searchParams = useSearchParams();
  const id = searchParams.get("_id");
  let { langCode } = useI18n();
  useEffect(() => {
    if (id) getData({ _id: id });
  }, [id]);
  const i18n = useI18n();
  const hotel = data;
  const { currency_symbol } = useCurrency();

  return (
    <div className="w-full overflow-x-auto mt-7 px-6">
      <div className="rounded dashboardInput bg-white">
        <div className="flex justify-between px-6 pt-6 items-center">
          <h1 className="text-[#05073C] heading-3">{i18n.t("View Hotel Details")}</h1>
          <BackButton />
        </div>
        {
          hotel && (
            <div className="mt-8 px-6">
              <h2 className="heading-4 text-[#05073C] mb-2">{i18n.t("Images")}</h2>
              <div className=" flex flex-col 2xl:flex-row gap-6">
                <div className="w-full 2xl:w-2/5">
                  {hotel?.banner_image && (
                    <Image
                      src={hotel?.banner_image}
                      width={450}
                      height={300}
                      alt={hotel?.name}
                      className="rounded-md border border-[#D5D5D5]"
                    />
                  )}
                </div>
                <div className="relative w-full overflow-hidden flex items-start flex-wrap gap-4 lg:gap-4 justify-start">
                  {hotel?.images?.map((item, index) => (
                    <div key={index}>
                      <AntdImage
                        className="md:w-[150px] w-[120px] h-[100px] object-fill rounded-[10px] lg:rounded-[12px] border border-[#D5D5D5]"
                        src={item}
                        width={150}
                        height={100}
                        alt="images"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <h1 className="heading-4 text-[#05073C]  mt-8">{i18n.t("Name:")} {hotel.name?.[langCode]}</h1>
              <div className="grid md:grid-cols-2 gap-8 bg-white  mt-3">
                <div>
                  <p className="description-1 text-[#717171] capitalize"><span className="description-2 text-[#05073C]">{i18n.t("Hotel Type")}:</span> {hotel.hotel_type}</p>
                  <p className="description-1 text-[#717171] capitalize"><span className="description-2 text-[#05073C]">{i18n.t("Room Type")}:</span> {hotel.room_type}</p>
                  <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">{i18n.t("Capacity")}:</span> {hotel.limit} People</p>
                  <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">{i18n.t("Reputation")}:</span> {hotel.star} Star Hotel</p>
                </div>
                <div>
                  <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">{i18n.t("Price")}:</span> {currency_symbol} {hotel.price?.amount}</p>
                  <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">{i18n.t("Discount")}:</span>
                    {hotel.price?.discount_type === 'percent'
                      ? `${hotel.price?.discount}%`
                      : `${currency_symbol} ${hotel.price?.discount}`
                    }
                  </p>
                  <p className="description-1 text-[#717171] capitalize"><span className="description-2 text-[#05073C]">{i18n.t("Discount Type")}:</span> {hotel.price?.discount_type}</p>
                  <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">{i18n.t("Created At")}:</span> {dayjs(hotel.createdAt).format("DD MMM YYYY")}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8 ">
                <h2 className="heading-4 text-[#05073C] mb-2">{i18n.t("Hotel Description")}</h2>
                <div
                  className="prose prose-sm max-w-none description-1 text-[#717171]"
                  dangerouslySetInnerHTML={{ __html: hotel.about?.[langCode] }}
                />
              </div>

              {/* Highlights */}
              {hotel.highlight?.length > 0 && (
                <div className="mt-8">
                  <h2 className="heading-4 text-[#05073C] mb-2">{i18n.t("Highlights")}</h2>
                  <ul className="list-disc list-inside space-y-1 description-1 text-[#717171]">
                    {hotel.highlight.map((h, i) => (
                      <li key={i}>{h?.[langCode]}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Includes */}
              {hotel.include?.length > 0 && (
                <div className="mt-8 ">
                  <h2 className="heading-4 text-[#05073C] mb-2">{i18n.t("Includes")}</h2>
                  <ul className="list-disc list-inside space-y-1 description-1 text-[#717171]">
                    {hotel.include.map((inc, i) => (
                      <li key={i}>{inc?.[langCode]}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Excludes */}
              {hotel.exclude?.length > 0 && (
                <div className="mt-2 pb-6 mb-10">
                  <h2 className="heading-4 text-[#05073C] mb-2">{i18n.t("Excludes")}</h2>
                  <ul className="list-disc list-inside space-y-1 description-1 text-[#717171]">
                    {hotel.exclude.map((ex, i) => (
                      <li key={i}>{ex?.[langCode]}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default ViewHotel;
