"use client";
import React, { useState } from "react";
import { Collapse, Empty } from "antd";
import { useI18n } from "@/app/contexts/i18n";
import SectionHeaderPage from "./sectionHeader";
import Image from "next/image";

const Iternary = ({ data }) => {
  const [activeKey, setActiveKey] = useState(null);
  const i18n = useI18n();
  const { langCode } = useI18n();

  const handlePanelChange = (key) => {
    setActiveKey(key === activeKey ? null : key);
  };
  return (
    <section>
      <div className="">

        <h1 className="heading-3 text-[#05073C]">{i18n.t("Itinerary")}</h1>
        <p className="description-1 text-[#717171]">{i18n.t("Enjoy 5 magical days in Paris with guided tours of iconic landmarks, a Seine River dinner cruise, and a visit to the Palace of Versailles. Savor local cuisine on a walking food tour, explore world-class museums, and relax with seamless transfers and elegant hotel stays")}</p>
        <div className=" rounded-[20px] mt-8 md:mt-10 lg:mt-12 home1Faq">
          {data?.itinerary?.length > 0 ? (
            <Collapse
              accordion
              activeKey={activeKey}
              onChange={handlePanelChange}
              expandIconPosition="end"
              className="rounded-[20px]"
            >
              {data?.itinerary?.map((item, index) => (
                <Collapse.Panel
                  key={index}
                  header={
                    <div className="flex items-center pl-3 justify-between">
                      <Image
                        src="/theme1/package/it.png"
                        alt="icon"
                        width={1000}
                        height={1000}
                        className="w-7 h-7"
                      />
                      <span className="description-2 text-[#717171] mx-4">
                        Day {String(index + 1).padStart(2, "0")}.
                      </span>
                      <p
                        className={`description-2 flex-1 ${activeKey === item.key
                          ? "text-[#05073C]"
                          : "text-[#05073C]"
                          }`}
                      >
                        {item?.heading?.[langCode]}
                      </p>

                    </div>
                  }
                  className="mb-2 mt-1"
                >
                  <p className="px-2 description-1 text-[#717171]">
                    {item?.description?.[langCode]}
                  </p>
                </Collapse.Panel>
              ))}
            </Collapse>
          ) : (
            <Empty
              className="description"
              description={i18n.t("No Faq Found")}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Iternary;
