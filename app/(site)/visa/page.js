"use client";
import VisaPage from "@/app/components/theme1/visa/visa";
import { fetchPageContentTheme1 } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useSearchParams } from "next/navigation";
const Hotels = () => {
  const params = useSearchParams();
  const visaType = params.get("visaType");
  const visaMode = params.get("visaMode");
  const country = params.get("country");
  const validity = params.get("validity");

  const [data] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  const theme = data?.theme;

  return (
    <div>
      <VisaPage theme={theme} visaType={visaType} visaMode={visaMode} country={country} validity={validity} />
    </div>
  );
}

export default Hotels;