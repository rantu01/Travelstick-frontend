"use client";
import ImageVideo from "@/app/components/common/imageVideo";
import HotelCard from "@/app/components/site/common/card/hotelCard";
import PackageCard from "@/app/components/site/common/card/packageCard";
import Banner from "@/app/components/site/common/component/Banner";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFetch } from "@/app/helper/hooks";
import { fetchPageContentTheme1, getAllPublicDestination } from "@/app/helper/backend";
import { useParams } from "next/navigation";
import { useI18n } from "@/app/contexts/i18n";
import { MapSelector } from "@/app/components/form/location";
import Banner2 from "@/app/components/site/common/component/Banner2";

const DestinationDetails = () => {
  const params = useParams();
  const { langCode } = useI18n();
  const i18n = useI18n();
  const { _id } = params;
  const [data, getData] = useFetch(getAllPublicDestination, {}, false);
  useEffect(() => {
    getData({ _id: _id });
  }, [_id]);
  const packageInfo = [
    {
      id: 1,
      title: "Destination",
      value: data?.name,
      icon: "/theme1/package/tour.png",
      bgColor: "#F2FFF0",
    },
    {
      id: 2,
      title: "Language",
      value: data?.language,
      icon: "/theme1/destination/lan.png",
      bgColor: "#FFF3ECEC",
    },
    {
      id: 3,
      title: "Capital",
      value: data?.capital,
      icon: "/theme1/destination/loc.png",
      bgColor: "#2125291A",
    },
    {
      id: 4,
      title: "Currency",
      value: data?.currency,
      icon: "/theme1/destination/cur.png",
      bgColor: "#2125290A",
    },
  ];
  const location = data?.address;
  const [googleAddress, setGoogleAddress] = useState(location);

  const [data1] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  const theme = data1?.theme;

  return (
    <div className="">
      {
        theme === 'one' ?
          <Banner title="Destination Details" /> :
          <Banner2 title="Destination Details" />
      }
      <div className="travel-container xl:mt-[106px] lg:mt-[90px] md:mt-20 xm:mt-16 mt-12 relative">
        <ImageVideo data={data} />
        <div className="xl:mt-10 lg:mt-8 md:mt-7 sm:mt-6 mt-5 ">
          <div className="xl:mt-6 lg:mt-5 md:mt-4 mt-4 flex flex-col lg:flex-row gap-6 ">
            <div className="w-full lg:w-[60%]">
              <div className="border border-[#E8EAE8] rounded-[10px] lg:rounded-[20px] xl:p-6 lg:p-5 md:p-4 p-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                {packageInfo?.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex lg:gap-3 gap-2 ${index !== packageInfo?.length - 1 ? "xl:border-r" : ""
                      }`}
                  >
                    <div
                      className="w-14 h-14 flex justify-center items-center rounded-full"
                      style={{ backgroundColor: item.bgColor }}
                    >
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={32}
                        height={32}
                      />
                    </div>
                    <div>
                      <h4 className="description-1 !font-medium text-[#717171]">
                        {i18n.t(item.title)}
                      </h4>
                      <p className="description-2 !font-bold text-[#05073C]">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="heading-3 text-[#05073C] xl:mt-8 lg:mt-5 md:mt-4 mt-3">
                  {data?.address?.name}
                </h3>
                <p className="description-1 text-[#717171] mt-4">
                  {data?.description?.[langCode]}
                </p>
              </div>
            </div>
            {/* Book This Tour */}
            <div className="w-full lg:w-[40%] xl:w-[40%]">
              <div className="border rounded-[10px] lg:rounded-[40px] border-[#E8EAE8] overflow-hidden">
                <div className="w-full xl:h-[450px] lg:h-[400px] md:h-[350px] h-[300px]">
                  <MapSelector
                    height={400}
                    isGoogleMap={true}
                    onChange={(e) => {
                      setGoogleAddress(e);
                    }}
                    value={location}
                    inputHidden
                  />
                  <p className="text-center font-semibold mt-2">
                    {location?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {data?.packages.length > 0 && (
          <div className=" sm:mt-12 mt-10 w-full ">
            <h1 className="heading-3 text-[#05073C] mb-6">
              {i18n.t("Explore Related Destinations")}
            </h1>
            <p className="description-1 text-[#717171]">
              {i18n.t(
                "Discover more handpicked destinations that complement your journey and inspire your next adventure"
              )}
            </p>
            <div className="mt-6 sm:mt-7 lg:mt-9 xl:mt-[44px] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 lg:gap-5 md:gap-4 gap-3">
              {data?.packages?.map((item, index) => (
                <PackageCard key={index} data={item} index={index} />
              ))}
            </div>

            <div className="flex justify-center xl:mt-14 lg:mt-10 md:mt-8 sm:mt-5 mt-5">
              <Link href="/service" className="">
                <button className="common-btn">{i18n.t("Explore More")}</button>
              </Link>
            </div>
          </div>
        )}
        {data?.hotels.length > 0 && (
          <div className=" sm:mt-12 mt-10 w-full ">
            <h1 className="heading-3 text-[#05073C] mb-6 text-center">
              {i18n.t("Discover Nearby Hotels")}
            </h1>
            <p className="description-1 text-[#717171] text-center">
              {i18n.t(
                "Find top-rated hotels close to your destination for a comfortable and convenient stay."
              )}
            </p>
            <div className="w-full mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 lg:gap-5 md:gap-4 gap-3">
                {data?.hotels?.map((item, index) => (
                  <HotelCard key={index} data={item} index={index} />
                ))}
              </div>
            </div>
            <div className="flex justify-center xl:mt-14 lg:mt-10 md:mt-8 sm:mt-5 mt-5">
              <Link href="/service" className="">
                <button className="common-btn">{i18n.t("Explore More")}</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationDetails;
