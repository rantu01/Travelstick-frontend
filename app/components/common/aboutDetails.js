"use client";
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";
import Image from "next/image";
const AboutDetails = ({ data, slug }) => {
  const i18n = useI18n();
  const {langCode} = useI18n();
  const { currency_symbol } = useCurrency();
  const packageInfo = [
    {
      id: 1,
      title: "Price",
      value: `${currency_symbol}${data?.current_price}`,
      icon: "/theme1/package/price.png",
      bgColor: "#F2FFF0",
    },
    {
      id: 2,
      title: "Duration",
      value: `${data?.duration || 0} Days`,
      icon: "/theme1/package/duration.png",
      bgColor: "#FFF3ECEC",
    },
    {
      id: 3,
      title: "Groups",
      value: `${data?.group_size || 0} People`,
      icon: "/theme1/package/group.png",
      bgColor: "#2125291A",
    },
    {
      id: 4,
      title: "Tour",
      value: data?.tour_type,
      icon: "/theme1/package/tour.png",
      bgColor: "#2125290A",
    },
  ];
  return (
    <div className="">
      {
        slug === "package" && (
          <div className="border border-[#E8EAE8] rounded-[10px] lg:rounded-[20px] xl:p-6 lg:p-5 md:p-4 p-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {packageInfo.map((item, index) => (
              <div
                key={item.id}
                className={`flex lg:gap-3 gap-2 ${index !== packageInfo.length - 1 ? "xl:border-r" : ""
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
        )
      }
      <div className="xl:mt-10 lg:mt-8 md:mt-7 mt-5">
        <h3 className="heading-3">{
          slug === "package" ? i18n.t("About This Package") : i18n.t("About This Hotel")
        }</h3>
        <p dangerouslySetInnerHTML={{ __html: data?.about?.[langCode] }} className="description-1 text-[#717171] xl:mt-6 lg:mt-5 md:mt-4 mt-4" />
      </div>
      {/* Highlights */}
      <div className="xl:mt-10 lg:mt-8 md:mt-7 mt-5">
        <h3 className="heading-3">{i18n.t("Highlights")}</h3>
        <div className="xl:mt-6 lg:mt-5 md:mt-4 mt-4">
          <ul className="flex flex-col">
            {data?.highlight?.map((item, index) => (
              <li key={index} className="description-1 text-[#717171] xl:mt-4 md:mt-3 mt-2 first:mt-0 flex items-center lg:gap-3 gap-2">
                <Image
                  src="/theme1/package/check.png"
                  alt="Check"
                  width={24}
                  height={24}
                />
                {item?.[langCode]}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Included and Excluded */}
      <div className="xl:mt-10 lg:mt-8 md:mt-7 mt-5">
        <h3 className="heading-3">{i18n.t("Included and Excluded")}</h3>
        <div className="xl:mt-6 lg:mt-5 md:mt-4 mt-4 flex flex-col xl:flex-row gap-4 md:gap-6 lg:gap-28 xl:gap-40">
          <div className="">
            <ul className="flex flex-col">
              {data?.include?.map((item, index) => (
                <li key={index} className="description-1 text-[#717171] xl:mt-6 lg:mt-5 md:mt-4 mt-4 first:mt-0 flex items-center lg:gap-3 gap-2">
                  <Image
                    src="/theme1/package/right.png"
                    alt="Check"
                    width={24}
                    height={24}
                  />
                  {item?.[langCode]}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 md:mt-6 lg:mt-10 xl:mt-0 ">
            <ul className="flex flex-col">
              {data?.exclude?.map((item, index) => (
                <li key={index} className="description-1 text-[#717171] xl:mt-6 lg:mt-5 md:mt-4 mt-4 first:mt-0 flex items-center lg:gap-3 gap-2">
                  <Image
                    src="/theme1/package/wrong.png"
                    alt="Check"
                    width={24}
                    height={24}
                  />
                  {item?.[langCode]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutDetails;