
"use client";
import { Drawer, Empty } from "antd";
import { useEffect, useState } from "react";
import Banner from "@/app/components/site/common/component/Banner";
import React from "react";
import { useI18n } from "@/app/contexts/i18n";
import Image from "next/image";
import VisaFilters from "../../common/visaFilters";
import { getAllPublicVisa } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import VisaCard1 from "../../site/common/card/visaCard1";
import VisaCard2 from "../../site/common/card/visaCard2";
import Banner2 from "../../site/common/component/Banner2";

const VisaPage = ({ visaType, visaMode, country, validity, theme }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [data, getData] = useFetch(getAllPublicVisa, { limit: 100 }, false);

  useEffect(() => {
    getData({
      visa_type: visaType,
      visa_mode: visaMode,
      country: country,
      validity: validity,
    });
  }, [visaType, visaMode, country, validity]);
  const i18n = useI18n();
  return (
    <div className="">
      {
        theme === 'one' ?
          <Banner title="Visa" /> :
          <Banner2 title="Visa" />
      }
      <div className="travel-container xl:mt-[106px] lg:mt-[90px] md:mt-20 xm:mt-16 mt-12 relative">
        {/* Filter icon for mobile */}
        <div className="flex gap-2 items-center justify-end md:hidden mb-4">
          <button
            className="text-xl p-2 border border-gray-300 rounded-md"
            onClick={() => setOpenDrawer(true)}
          >
            <Image
              src="/theme1/filter.png"
              alt="Filter"
              width={20}
              height={20}
            />
          </button>
          <p className="heading-1 text-[#000000]">{i18n.t("Filters")}</p>
        </div>

        {/* Drawer for filters */}
        <Drawer
          title={i18n.t("Filters")}
          onClose={() => setOpenDrawer(false)}
          open={openDrawer}
          className="sm:hidden"
        >
          <VisaFilters getData={getData} />
        </Drawer>
        <div className="flex flex-col sm:flex-row xl:gap-6 lg:gap-5 md:gap-4 gap-3">
          {/* Filter part */}
          <div className="w-full md:w-[30%] xl:w-[25%] hidden md:block">
            <VisaFilters getData={getData} />
          </div>
          {/* Visa Card */}
          <div className="w-full md:w-[70%] xl:w-[75%]">
            {
              data?.docs?.length > 0 ? (
                theme === 'one' ?
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:gap-6 lg:gap-5 md:gap-4 gap-3">
                    {
                      data?.docs?.map((item, index) => (
                        <VisaCard1 key={index} data={item} />
                      ))
                    }
                  </div> :
                  <div className="w-full grid grid-cols-1 xl:grid-cols-2 xl:gap-6 lg:gap-5 md:gap-4 gap-3">
                    {
                      data?.docs?.map((item, index) => (
                        <VisaCard2 key={index} data={item} slug='page' />
                      ))
                    }
                  </div>
              ) : (
                <Empty
                  description={i18n.t("No Visa Found")}
                  className="flex items-center justify-center h-[300px]"
                />
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaPage;
