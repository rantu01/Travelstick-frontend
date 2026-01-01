"use client";
import Image from "next/image";
import React from "react";
import { FiInstagram } from "react-icons/fi";
import { BiLogoFacebook } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { FaLinkedinIn } from "react-icons/fa6";
import Link from "next/link";
import { useI18n } from "@/app/contexts/i18n";
import TextWithTooltip from "@/app/helper/utils";

const ExpertCard1 = ({ data }) => {
  const router = useRouter();
  const { langCode } = useI18n();
  const socialLinks = [
    {
      icon: <BiLogoFacebook className="text-xl" />,
      link: data?.facebook_url,
      key: 4,
    },
    {
      icon: <FiInstagram className="text-xl" />,
      link: data?.instagram_url,
      key: 2,
    },
    {
      icon: <FaLinkedinIn className="text-xl" />,
      link: data?.linkedin_url,
      key: 3,
    },
  ];
  return (
  
      <div>
        <div className="flex justify-center relative top-16 xl:top-[100px] 2xl:top-20">
          <Image
            width={1000}
            height={1000}
            className="xl:w-[180px] xl:h-[180px] 2xl:w-[200px] 2xl:h-[200px] lg:w-[170px] lg:h-[170px] md:w-[130px] md:h-[130px] w-[150px] h-[150px] object-fill rounded-[200px] border-[2px] border-dashed border-[#EF8248] shadow-lg z-50"
            src={data?.image}
            alt="Expert"
          />
        </div>
        <div
          onClick={() => router.push(`/team/${data?._id}`)}
          className="group cursor-pointer relative rounded-[20px] p-6 overflow-visible"
          style={{
            backgroundImage: "url('/theme1/expert/teambg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 z-0 rounded-[20px]" />
          <div className="relative z-10 mt-20 ">
            <div className="text-center">
              <h1 className="heading-3 xl:pt-4 2xl:pt-0">
                <TextWithTooltip limit={15} text={data?.name} />
              </h1>
              <h5 className="description-1 mt-3 ">
                <TextWithTooltip limit={15} text={data?.specialist} />
              </h5>
            </div>
            <div className="flex justify-center gap-4 mt-8 pb-4">
              {socialLinks.map(({ icon, link, key }) => (
                <Link
                  key={key}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white hover:bg-primary hover:text-white transform-all duration-300"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    {icon}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
 
  );
};

export default ExpertCard1;
