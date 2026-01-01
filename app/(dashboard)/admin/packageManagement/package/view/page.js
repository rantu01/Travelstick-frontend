'use client';

import React, { useEffect } from "react";
import { getAllPackages } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { useI18n } from "@/app/contexts/i18n";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import { useCurrency } from "@/app/contexts/site";
import Image from "next/image";
import { Image as AntdImage } from "antd";

const ViewPackage = () => {
  const [data, getData] = useFetch(getAllPackages, {}, false);
  const searchParams = useSearchParams();
  const id = searchParams.get("_id");
  let { langCode } = useI18n();
  useEffect(() => {
    if (id) getData({ _id: id });
  }, [id]);

  const i18n = useI18n();
  const packageData = data;
  const { currency_symbol } = useCurrency();

  return (
    <div className="w-full overflow-x-auto mt-7 px-6">
      <div className="rounded dashboardInput bg-white">
        <div className="flex justify-between px-6 pt-6 items-center">
          <h1 className="text-[#05073C] heading-3">{i18n.t("View Package Details")}</h1>
          <BackButton />
        </div>
        {
          packageData && (
            <div className="mt-8 p-6">
              <h2 className="heading-4 text-[#05073C] mb-2">{i18n.t("Images")}</h2>
              <div className="flex flex-col 2xl:flex-row gap-6">
                <div className="w-full 2xl:w-2/5">
                  {packageData?.banner_image && (
                    <Image
                      src={packageData?.banner_image}
                      width={450}
                      height={300}
                      alt={packageData?.name}
                      className="rounded-md border border-[#D5D5D5]"
                    />
                  )}
                </div>
                <div className="relative w-full overflow-hidden flex items-start flex-wrap gap-4 lg:gap-4 justify-start">
                  {packageData?.images?.map((item, index) => (
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
              <h1 className="heading-4 text-[#05073C] mt-8">{i18n.t("Package Name:")} {packageData.name?.[langCode]}</h1>
              <div className="grid md:grid-cols-2 gap-8 bg-white mt-3">
                <div>
                  <p className="description-1 text-[#717171] capitalize"><span className="description-2 text-[#05073C]">Check-in Date:</span> {dayjs(packageData.check_in).format("DD MMM YYYY")}</p>
                  <p className="description-1 text-[#717171] capitalize"><span className="description-2 text-[#05073C]">Check-out Date:</span> {dayjs(packageData.check_out).format("DD MMM YYYY")}</p>
                  <p className="description-1 text-[#717171] capitalize"><span className="description-2 text-[#05073C]">Tour Type:</span> {packageData.tour_type}</p>
                  <p className="description-1 text-[#717171] capitalize"><span className="description-2 text-[#05073C]">Group size:</span> {packageData.group_size} People</p>
                  <p className="description-1 text-[#717171] capitalize"><span className="description-2 text-[#05073C]">Destination:</span> {packageData.destination.name} </p>
                </div>
                <div>
                  <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">Price:</span> {currency_symbol} {packageData.price?.amount}</p>
                  <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">Discount:</span>
                    {packageData?.price?.discount_type === 'percent'
                      ? `${packageData?.price?.discount}%`
                      : `${currency_symbol} ${packageData?.price?.discount}`
                    }
                  </p>
                  <p className="description-1 text-[#717171] capitalize"><span className="description-2 text-[#05073C]">Discount Type:</span> {packageData.price?.discount_type}</p>
                  <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">Created At:</span> {dayjs(packageData.createdAt).format("DD MMM YYYY")}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h2 className="heading-4 text-[#05073C] mb-2">Package Description</h2>
                <div
                  className="prose prose-sm max-w-none description-1 text-[#717171]"
                  dangerouslySetInnerHTML={{ __html: packageData?.about?.[langCode] }}
                />
              </div>

              {/* Highlights */}
              {packageData?.highlight?.length > 0 && (
                <div className="mt-8">
                  <h2 className="heading-4 text-[#05073C] mb-2">Highlights</h2>
                  <ul className="list-disc list-inside space-y-1 description-1 text-[#717171]">
                    {packageData?.highlight?.map((h, i) => (
                      <li key={i}>{h?.[langCode]}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Includes */}
              {packageData?.include?.length > 0 && (
                <div className="mt-8">
                  <h2 className="heading-4 text-[#05073C] mb-2">Includes</h2>
                  <ul className="list-disc list-inside space-y-1 description-1 text-[#717171]">
                    {packageData?.include?.map((inc, i) => (
                      <li key={i}>{inc?.[langCode]}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Excludes */}
              {packageData?.exclude?.length > 0 && (
                <div className="mt-2 pb-6 mb-10">
                  <h2 className="heading-4 text-[#05073C] mb-2">Excludes</h2>
                  <ul className="list-disc list-inside space-y-1 description-1 text-[#717171]">
                    {packageData?.exclude?.map((ex, i) => (
                      <li key={i}>{ex?.[langCode]}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Itinerary About */}
              {packageData.itinerary_about && (
                <div className="mt-8">
                  <h2 className="heading-4 text-[#05073C] mb-2">Itinerary Overview</h2>
                  <p className="description-1 text-[#717171]">{packageData?.itinerary_about?.[langCode]}</p>
                </div>
              )}

              {/* Itinerary */}
              {packageData?.itinerary?.length > 0 && (
                <div className="mt-8">
                  <h2 className="heading-4 text-[#05073C] mb-2">Itinerary</h2>
                  <ul className="list-disc list-inside space-y-1 description-1 text-[#717171]">
                    {packageData.itinerary.map((item, index) => (
                      <li key={index}>
                        <strong>{item?.heading?.[langCode]}</strong>: {item?.description?.[langCode]}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Feathers */}
              {packageData?.feathers?.length > 0 && (
                <div className="my-8">
                  <h2 className="heading-4 text-[#05073C] mb-2">Features</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {packageData?.feathers?.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {feature?.logo && (
                          <Image src={feature?.logo} alt={feature?.text?.[langCode]} width={24} height={24} className="w-6 h-6" />
                        )}
                        <span className="description-1 text-[#717171]">{feature?.text?.[langCode]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default ViewPackage;
