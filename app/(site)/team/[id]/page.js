"use client";
import Banner from "@/app/components/site/common/component/Banner";
import { useI18n } from "@/app/contexts/i18n";
import { fetchPageContentTheme1, GetPublicProviders } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { BiLogoFacebook } from "react-icons/bi";
import { FaLinkedinIn, FaTwitter } from "react-icons/fa6";
import { FiInstagram } from "react-icons/fi";

const TeamDetails = () => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const [data, getData] = useFetch(GetPublicProviders, {}, false);
  const params = useParams();
  const { id } = params;
  useEffect(() => {
    getData({ _id: id });
  }, []);
  const socialLinks = [
    { icon: <BiLogoFacebook className="text-xl" />, link: data?.facebook_url || "#", key: 1 },
    { icon: <FiInstagram className="text-xl" />, link: data?.instagram_url || "#", key: 2 },
    { icon: <FaLinkedinIn className="text-xl" />, link: data?.linkedin_url || "#", key: 3 },
    { icon: <FaTwitter className="text-xl" />, link: data?.x_url || "#", key: 4 },
  ];


  const [data1] = useFetch(fetchPageContentTheme1, {
    status: true,
  });
  const theme = data1?.theme;

  return (
    <div className="">
      {
        theme === 'one' ?
          <Banner title="Tour Guider Details" /> :
          <Banner title="Tour Guider Details" />
      }
      <div className="travel-container xl:mt-[106px] lg:mt-[90px] md:mt-20 xm:mt-16 mt-12 relative">
        <div className="w-full  relative z-0 rounded-[10px] lg:rounded-[20px]">
          <div
            className="absolute inset-0 bg-fill bg-center bg-opacity-100 bg-no-repeat z-10 rounded-[10px] lg:rounded-[20px]"
            style={{
              backgroundImage: `url('/theme1/expert/ebg.png')`,
            }}
          />
          <div
            className="absolute inset-0 rounded-[10px] lg:rounded-[20px]"
            style={{ backgroundColor: "#fef5ee", opacity: 100 }}
          />
          <div className="relative z-50 h-full">
            <div className="xl:p-10 lg:p-8 md:p-6 p-4 flex flex-col md:flex-row xl:gap-10 lg:gap-8 md:gap-6 gap-4">
              <div className="">
                {
                  data?.image && (
                    <Image
                      width={1000}
                      height={1000}
                      src={data?.image}
                      alt="Expert"
                      className="xl:w-[424px] xl:h-[420px] lg:w-[370px] lg:h-[420px] md:w-[280px] md:h-[300px] w-[200px] h-[250px] object-fill rounded-[10px] lg:rounded-[20px] border-[2px] border-dashed border-[#EF8248] shadow-lg"
                    />
                  )
                }
              </div>
              <div className="">
                <div>
                  <h1 className="heading-6">{data?.name}</h1>
                  <p className="description-1 xl:mt-6 lg:mt-5 md:mt-4 mt-3 text-[#717171]">{data?.about?.[langCode]}</p>
                </div>
                <div className="xl:mt-6 lg:mt-5 md:mt-4 mt-3">
                  <h3 className="heading-3 text-[#05073C]">{i18n.t("Specialties")}:</h3>
                  <div className="lg:mt-4 mt-3">
                    {data?.specialists?.length > 0 && (
                      <ul className="list-disc pl-5">
                        {data.specialists.map((item, index) => (
                          <li key={index} className="description-1 text-[#05073C]">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="xl:mt-6 lg:mt-5 md:mt-4 mt-3">
                  <h3 className="heading-3 text-[#05073C]">{i18n.t("Qualifications")}:</h3>
                  <div className="lg:mt-4 mt-3">
                    {data?.qualifications?.length > 0 && (
                      <ul className="list-disc pl-5">
                        {data.qualifications.map((item, index) => (
                          <li key={index} className="description-1 text-[#05073C]">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="xl:mt-6 lg:mt-5 md:mt-4 mt-3 flex gap-4">
                  {socialLinks
                    .map(({ icon, link, key }) => (
                      <Link
                        key={key}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-primary transform-all duration-300"
                      >
                        <div className="flex items-center justify-center w-full h-full text-white">
                          {icon}
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:mt-10 lg:mt-8 md:mt-6 mt-5">
          <h3 className="heading-3 text-[#05073C]">{i18n.t("Personal Information")}:</h3>
          <p className="xl:mt-6 lg:mt-5 md:mt-4 mt-3">
            {data?.personal_info?.[langCode]}
          </p>
        </div>
        <div className="xl:mt-10 lg:mt-8 md:mt-6 mt-5">
          <h3 className="heading-3 text-[#05073C]">{i18n.t("Professional Information")}:</h3>
          <p className="xl:mt-6 lg:mt-5 md:mt-4 mt-3">
            {data?.professional_info?.[langCode]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
