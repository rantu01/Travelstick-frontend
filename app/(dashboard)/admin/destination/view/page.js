'use client';

import React, { useEffect } from "react";
import { getDestination } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { useI18n } from "@/app/contexts/i18n";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import Image from "next/image";

const ViewDestination = () => {
  const [data, getData] = useFetch(getDestination, {}, false);
  const searchParams = useSearchParams();
  const id = searchParams.get("_id");
  const i18n = useI18n();
  const { langCode } = i18n;

  useEffect(() => {
    if (id) getData({ _id: id });
  }, [id]);
  const destination = data;
  const destinationImage =
    destination?.image ||
    destination?.card_image ||
    destination?.banner_image ||
    destination?.images?.[0];

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
              <div className="w-full md:w-[450px]">
                  {destinationImage && (
                    <Image
                      src={destinationImage}
                      width={450}
                      height={300}
                      alt={destination?.name}
                      className="rounded-md border border-[#D5D5D5]"
                    />
                  )}
              </div>

              <h1 className="heading-4 text-[#05073C] mt-8">{i18n.t("Destination Name:")} {destination.name}</h1>

              <div className="grid md:grid-cols-2 gap-8 bg-white mt-3">
                <div>
                  <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">{i18n.t("Destination Country")}:</span> {destination.country}</p>
                </div>
                <div>
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
