'use client';

import React, { useEffect } from "react";
import { getAllVisa } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/app/contexts/i18n";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import { useCurrency } from "@/app/contexts/site";
import Image from "next/image";
import { Image as AntdImage } from "antd";

const ViewVisa = () => {
  const [data, getData] = useFetch(getAllVisa, {}, false);
  const searchParams = useSearchParams();
  const id = searchParams.get("_id");
  const { langCode } = useI18n();
  const i18n = useI18n();
  const { currency_symbol } = useCurrency();

  useEffect(() => {
    if (id) getData({ _id: id });
  }, [id]);

  const visa = data;

  return (
    <div className="w-full overflow-x-auto mt-7 px-6">
      <div className="rounded dashboardInput bg-white">
        <div className="flex justify-between px-6 pt-6 items-center">
          <h1 className="text-[#05073C] heading-3">{i18n.t("View Visa Details")}</h1>
          <BackButton />
        </div>

        {visa && (
          <div className="mt-8 px-6">
            {/* Images */}
            <h2 className="heading-4 text-[#05073C] mb-2">{i18n.t("Images")}</h2>
            <div className="flex flex-col 2xl:flex-row gap-6">
              <div className="w-full 2xl:w-2/5">
                {visa?.banner_image && (
                  <Image
                    src={visa?.banner_image}
                    width={450}
                    height={300}
                    alt={visa?.title?.[langCode]}
                    className="rounded-md border border-[#D5D5D5]"
                  />
                )}
              </div>
              <div className="relative w-full overflow-hidden flex items-start flex-wrap gap-4 lg:gap-4 justify-start">
                {visa?.images?.map((item, index) => (
                  <div key={index}>
                    <AntdImage
                      className="md:w-[150px] w-[120px] h-[100px] object-fill rounded-[10px] border border-[#D5D5D5]"
                      src={item}
                      width={150}
                      height={100}
                      alt="Visa Images"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <h1 className="heading-4 text-[#05073C] mt-8">{i18n.t("Visa Title:")} {visa?.title?.[langCode]}</h1>
            <div className="grid md:grid-cols-2 gap-8 bg-white mt-3">
              <div>
                <p className="description-1 text-[#717171] capitalize"><span className="description-2 text-[#05073C]">Visa Type:</span> {visa?.visa_type?.name?.[langCode]}</p>
                <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">Visa Mode:</span> {visa?.visa_mode}</p>
                <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">Processing Type:</span> {visa?.processing_type}</p>
                <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">Validity:</span> {visa?.validity}</p>
                <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">Country:</span> {visa?.country}</p>
              </div>
              <div>
                <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">Price:</span> {currency_symbol}{visa?.price?.amount}</p>
                <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">Discount:</span> 
                  {visa?.price?.discount_type === 'percent'
                    ? `${visa?.price?.discount}%`
                    : `${currency_symbol}${visa?.price?.discount}`
                  }
                </p>
                <p className="description-1 text-[#717171]"><span className="description-2 text-[#05073C]">Discount Type:</span> {visa?.price?.discount_type}</p>
              </div>
            </div>

            {/* Overview */}
            <div className="mt-8">
              <h2 className="heading-4 text-[#05073C] mb-2">Overview</h2>
              {/* <p className="description-1 text-[#717171]">{visa?.overview?.[langCode]}</p> */}
              <div
                  className="prose prose-sm max-w-none description-1 text-[#717171]"
                  dangerouslySetInnerHTML={{ __html: visa?.overview?.[langCode] }}
                />
            </div>

            {/* Documents */}
            {visa?.documents?.length > 0 && (
              <div className="mt-8">
                <h2 className="heading-4 text-[#05073C] mb-2">Required Documents</h2>
                <ul className="list-disc list-inside space-y-1 description-1 text-[#717171]">
                  {visa?.documents.map((doc, i) => (
                    <li key={i}>
                      <strong>{doc.key?.[langCode]}:</strong> {doc.value?.[langCode]}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Document About */}
            {visa?.document_about?.[langCode] && (
              <div className="mt-4">
                <h2 className="heading-4 text-[#05073C] mb-2">Note on Documents</h2>
                <p className="description-1 text-[#717171]">{visa?.document_about?.[langCode]}</p>
              </div>
            )}

            {/* Features */}
            {visa?.feathers?.length > 0 && (
              <div className="mt-8">
                <h2 className="heading-4 text-[#05073C] mb-2">Features</h2>
                <ul className="list-disc list-inside space-y-1 description-1 text-[#717171]">
                  {visa?.feathers?.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Image src={feature?.logo} width={20} height={20} alt="icon" />
                      {feature?.text?.[langCode]}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQs */}
            {visa?.faqs?.length > 0 && (
              <div className="mt-8 pb-6 mb-10">
                <h2 className="heading-4 text-[#05073C] mb-2">FAQs</h2>
                {visa?.faqs?.map((faq, i) => (
                  <div key={i} className="mb-3">
                    <p className="font-semibold text-[#05073C]">{faq?.heading?.[langCode]}</p>
                    <p className="text-[#717171]">{faq.description?.[langCode]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewVisa;
