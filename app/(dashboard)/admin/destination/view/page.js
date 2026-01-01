'use client';

import React, { useEffect } from "react";
import { getDestination } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { useI18n } from "@/app/contexts/i18n";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import { useCurrency } from "@/app/contexts/site";
import Image from "next/image";
import { Image as AntdImage } from "antd";

const ViewDestination = () => {
  const [data, getData] = useFetch(getDestination, {}, false);
  const searchParams = useSearchParams();
  const id = searchParams.get("_id");
  const i18n = useI18n();
  const { langCode } = i18n;
  const { currency_symbol } = useCurrency();
  useEffect(() => {
    if (id) getData({ _id: id });
  }, [id]);
  const destination = data;

  return (
    <div className="w-full overflow-x-auto mt-7 px-6">
      <div className="rounded dashboardInput bg-white">
        <div className="flex justify-between px-6 pt-6 items-center">
          <h1 className="text-[#05073C] heading-3">{i18n.t("View Destination Details")}</h1>
          <BackButton />
        </div>
        {
          destination && (
            <div className="mt-8 p-6">
              <h2 className="heading-4 text-[#05073C] mb-2">{i18n.t("Images")}</h2>
              <div className="flex flex-col 2xl:flex-row gap-6">
                <div className="w-full 2xl:w-2/5">
                  {destination?.banner_image && (
                    <Image
                      src={destination?.banner_image}
                      width={450}
                      height={300}
                      alt={destination?.name}
                      className="rounded-md border border-[#D5D5D5]"
                    />
                  )}
                </div>
                <div className="relative w-full overflow-hidden flex items-start flex-wrap gap-4 lg:gap-4 justify-start">
                  {destination?.images?.map((item, index) => (
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

              <h1 className="heading-4 text-[#05073C] mt-8">{i18n.t("Destination Name:")} {destination.name}</h1>

              <div className="grid md:grid-cols-2 gap-8 bg-white mt-3">
                <div>
                  <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">{i18n.t("Destination Capital Name")}:</span> {destination.capital}</p>
                  <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">{i18n.t("Destination Language Name")}:</span> {destination.language}</p>
                  <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">{i18n.t("Destination Currency Name")}:</span> {destination.currency}</p>
                  <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">{i18n.t("Destination Location")}:</span> {destination.location.name}</p>
                </div>
                <div>
                  <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">{i18n.t("Destination Video URL")}:</span> <a href={destination.video_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">{destination.video_url}</a></p>
                  <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">{i18n.t("Address")}:</span> {destination.address?.name}</p>
                  <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">{i18n.t("Created At")}:</span> {dayjs(destination.createdAt).format("DD MMM YYYY")}</p>
                </div>
              </div>
              <div className="mt-8">
                <h2 className="heading-4 text-[#05073C] mb-2">{i18n.t("About Destination")}</h2>
                <div
                  className="prose prose-sm max-w-none description-1 text-[#717171]" >
                  {destination.short_description?.[langCode]}
                </div>
              </div>
              <div className="mt-8">
                <h2 className="heading-4 text-[#05073C] mb-2">{i18n.t("Description")}</h2>
                <div
                  className="prose prose-sm max-w-none description-1 text-[#717171]" >
                  {destination.description?.[langCode]}
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default ViewDestination;
