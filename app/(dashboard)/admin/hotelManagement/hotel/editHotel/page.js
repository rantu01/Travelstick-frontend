'use client';
import BackButton from "@/app/(dashboard)/components/common/backButton";
import { getAllHotel } from "@/app/helper/backend";
import { useSearchParams } from "next/navigation";
import { useFetch } from "@/app/helper/hooks";
import { useEffect } from "react";
import { useI18n } from "@/app/contexts/i18n";
import HotelForm from "../hotelForm/page";

const EditHotel = () => {
  const i18n = useI18n();
  const searchParams = useSearchParams();
  const id = searchParams.get("_id");
  const [data, getData] = useFetch(getAllHotel, {}, false);
  useEffect(() => {
    getData({ _id: id });
  }, [ ]);
  return (
    <div className="w-full overflow-x-auto mt-7 dashboardModal">
      <div className="rounded dashboardInput mx-6 px-6 bg-white ">
      <div className="flex justify-between  pt-8 items-center">
          <h2 className="pt-3 pb-2 text-xl text-primary font-medium">{i18n.t("Edit Hotel")}</h2>
          <BackButton />
        </div>
        <div>
          <HotelForm data={data} isEdit={true} />
        </div>
      </div>
    </div>
  );
};

export default EditHotel;
