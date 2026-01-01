"use client";
import HotelsPage from "@/app/components/theme1/hotels/hotels";
import { fetchPageContentTheme1 } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import { useSearchParams } from "next/navigation";
const Hotels = () => {
  const params = useSearchParams();
  const destination = params.get("destination");
  const hotelType = params.get("hotelType");
  const roomType = params.get("roomType");
  const reputation = params.get("reputation");

  const [data] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  const theme = data?.theme;

  return (
    <div>
      <HotelsPage theme={theme} destination={destination} hotelType={hotelType} roomType={roomType} reputation={reputation} />
    </div>
  );
}

export default Hotels;