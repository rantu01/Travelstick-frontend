'use client';
import BackButton from "@/app/(dashboard)/components/common/backButton";
import { GetAllProviders } from "@/app/helper/backend";
import { useSearchParams } from "next/navigation";
import { useFetch } from "@/app/helper/hooks";
import { useEffect } from "react";
import ProviderForm from "../providerForm/page";
import { useI18n } from "@/app/contexts/i18n";


const EditProvider = () => {
  const i18n = useI18n();
  const searchParams = useSearchParams();
  const id = searchParams.get("_id");
  const [data, getData] = useFetch(GetAllProviders, {}, false);
  useEffect(() => {
    getData({ _id: id });
  }, [id]);
  return (
    <div className="w-full overflow-x-auto mt-7 px-6">
      <div className="rounded dashboardInput bg-white px-8 pt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-[#05073C] heading-3">{i18n.t("Edit tour Guider")}</h2>
          <BackButton />
        </div>
        <div>
          <ProviderForm isEdit={true} data={data} />
        </div>
      </div>
    </div>
  );
};

export default EditProvider;
