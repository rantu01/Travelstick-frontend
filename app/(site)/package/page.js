"use client";
import PackagePage from "@/app/components/theme1/package/package";
import { fetchPageContentTheme1 } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useSearchParams } from "next/navigation";
const Package = () => {
  const params = useSearchParams();
  const discount = params.get("discount");
  const discount_type = params.get("discount_type");
  const destination = params.get("destination");
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");
  const tourType = params.get("tourType");

  const [data] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  const theme = data?.theme;
  return (
    <div>
      <PackagePage theme={theme} destination={destination} startDate={startDate} endDate={endDate} tourType={tourType} discount={discount} discount_type={discount_type} />
    </div>
  );
};

export default Package;