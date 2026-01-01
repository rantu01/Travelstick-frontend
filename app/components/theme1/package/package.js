
"use client";
import { Drawer, Empty } from "antd";
import { useEffect, useState } from "react";
import Banner from "@/app/components/site/common/component/Banner";
import React from "react";
import PackageCard from "../../site/common/card/packageCard";
import Filters from "../../common/filters";
import { useI18n } from "@/app/contexts/i18n";
import Image from "next/image";
import { useFetch } from "@/app/helper/hooks";
import { getAllPublicPackages } from "@/app/helper/backend";
import Banner2 from "../../site/common/component/Banner2";
import PackageCard2 from "../../site/common/card/packageCard2";

const PackagePage = ({ discount, discount_type, destination, startDate, endDate, tourType, theme }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const i18n = useI18n();
  const [data, getData] = useFetch(getAllPublicPackages, { limit: 100 }, false);
  useEffect(() => {
    getData({
      discount: discount,
      discount_type: discount_type,
      destination: destination,
      check_in: startDate,
      check_out: endDate,
      tour_type: tourType
    });
  }, [discount, discount_type, destination, startDate, endDate, tourType]);
  return (
    <div className="">
      {
        theme === 'one' ?
          <Banner title="Tour Packages" /> :
          <Banner2 title="Tour Packages" />
      }
      <div className="travel-container xl:mt-[106px] lg:mt-[90px] md:mt-20 xm:mt-16 mt-12 relative">
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
        <Drawer
          title={i18n.t("Filters")}
          onClose={() => setOpenDrawer(false)}
          open={openDrawer}
          className="sm:hidden"
        >
          {data && <Filters getData={getData} />}
        </Drawer>
        <div className="flex flex-col sm:flex-row xl:gap-6 lg:gap-5 md:gap-4 gap-3">
          <div className="w-full md:w-[30%] xl:w-[25%] hidden md:block">
            <Filters getData={getData} />
          </div>
          {/* Package Card */}
          <div className="w-full md:w-[70%] xl:w-[75%]">
            {
              data?.docs?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:gap-6 lg:gap-5 md:gap-4 gap-3">
                  {
                    data?.docs?.map((item, index) => (
                      theme === 'one' ?
                        <PackageCard key={index} data={item} index={index} /> :
                        <PackageCard2 key={index} data={item} index={index} />
                    ))
                  }
                </div>
              ) : (
                <Empty description="No Packages Found" />
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagePage;
