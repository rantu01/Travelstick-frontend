"use client";
import BackButton from "@/app/(dashboard)/components/common/backButton";
import { getDestination } from "@/app/helper/backend";
import { useSearchParams } from "next/navigation";
import { useFetch } from "@/app/helper/hooks";
import { useEffect } from "react";
import { useI18n } from "@/app/contexts/i18n";
import DestinationForm from "../destinationForm/page";

const EditDestination = () => {
  const i18n = useI18n();
  const searchParams = useSearchParams();
  const id = searchParams.get("_id");
  const [data, getData] = useFetch(getDestination, {}, false);
  useEffect(() => {
    getData({ _id: id });
  }, [id]);
  return (
    <div className="w-full overflow-x-auto my-8 dashboardModal">
      <div className=" rounded dashboardInput px-8 py-8 mx-6 bg-white">
        <div className="flex justify-between  items-center">
          <h2 className="heading-3 text-[#05073C] font-medium">
            {i18n.t("Edit Destination")}
          </h2>
          <BackButton />
        </div>
        <div>
          <DestinationForm data={data} isEdit={true} />
        </div>
      </div>
    </div>
  );
};

export default EditDestination;
