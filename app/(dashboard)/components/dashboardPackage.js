"use client";
import DashboardPackageCard from "@/app/components/site/common/card/dashboardpackageCard";
import { useI18n } from "@/app/contexts/i18n";
import { getAllPublicPackages } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { Empty } from "antd";

const DashboardPackage = () => {
  const i18n = useI18n();
  const [data] = useFetch(getAllPublicPackages, { limit: 3 });
  return (
    <div className="w-full bg-white xl:p-6 lg:p-4 p-3 rounded-md">
      <h2 className="heading-3 mb-4 text-[#05073C]">
        {i18n.t("Latest Packages")}
      </h2>
      {data?.docs?.length > 0 ? (
        <div className="mt-6 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 2xl:grid-cols-3 xl:gap-6 lg:gap-5 md:gap-4 gap-3">
          { data?.docs?.map((item, index) => (
            <DashboardPackageCard key={index} data={item} index={index} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center text-[#717171]">
          <Empty description="No Packages Found" />
        </div>
      )}
    </div>
  );
};

export default DashboardPackage;
