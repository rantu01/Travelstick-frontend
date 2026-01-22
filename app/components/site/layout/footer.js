/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { useI18n } from "@/app/contexts/i18n";
import { fetchPublicSettings, postNewsletterList } from "@/app/helper/backend";
import { useAction, useFetch } from "@/app/helper/hooks";
import { Form, Image as ImageAntd } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";
import { IoCallOutline, IoLocationSharp } from "react-icons/io5";

const Footer = () => {
  const i18n = useI18n();
  const [form] = Form.useForm();
  const [setting] = useFetch(fetchPublicSettings);
  const [currentYear, setCurrentYear] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentYear(new Date().getFullYear());
    }
  }, []);

  const handleSubmit = async (values) => {
    await useAction(postNewsletterList, values, null, true);
    form.resetFields();
  };

  // Navbar এর logic অনুযায়ী Product module check করা হয়েছে
  const isProduct = setting?.is_product_module;

  // Navbar এর pagesItems এবং অন্যান্য প্রয়োজনীয় লিংকগুলো এখানে সাজানো হয়েছে
  const navLinks1 = [
    { name: "About Us", link: "/about" },
    { name: "Destination", link: "/destination" },
    { name: "Tour Packages", link: "/package" },
    ...(isProduct ? [{ name: "Product", link: "/product" }] : []),
    { name: "Blog", link: "/blog" },
    { name: "Tour Guiders", link: "/team" },
    { name: "FAQ", link: "/faq" },
    { name: "Visa Services", link: "/visa" },
    { name: "Privacy Policy", link: "/privacyPolicy" },
    { name: "Terms and Conditions", link: "/termsCondition" },
    { name: "Refund Policy", link: "/refundPolicy" },
    { name: "Why Choose Us", link: "/choose" },
    { name: "Testimonials", link: "/testimonials" },
    { name: "Contact Us", link: "/contact" },
  ];

  const navIcons = [
    {
      icon: FaLinkedinIn,
      link: `${setting?.social_media_link?.[3]?.link || "/"}`,
    },
    {
      icon: FaInstagram,
      link: `${setting?.social_media_link?.[2]?.link || "/"}`,
    },
    {
      icon: FaFacebookF,
      link: `${setting?.social_media_link?.[0]?.link || "/"}`,
    },
    {
      icon: FaTwitter,
      link: `${setting?.social_media_link?.[1]?.link || "/"}`,
    },
  ];

  return (
    <div className="xl:mt-[140px] lg:mt-24 md:mt-20 sm:mt-16 mt-12 w-full xl:pt-10 lg:pt-9 md:pt-7 pt-5 pb-1 relative overflow-hidden bg-[#D3D3D3]">
      <div
        className="absolute inset-0 z-0 pointer-events-none "
        style={{
          background: "url('/theme1/footer/footerBg.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
      <div className="travel-container relative z-10">
        <div className="flex flex-col md:flex-row justify-center xl:gap-[142px] lg:gap-[100px] md:gap-12 gap-8">
          <div className="w-full lg:w-[50%] flex xl:gap-[142px] justify-between xl:justify-start">
            <div>
              {setting?.site_logo && (
                <Image
                  className=""
                  src={setting.site_logo}
                  alt="logo"
                  width={168}
                  height={44}
                  priority
                />
              )}
              <p className="description-1 !font-normal lg:mt-4 md:mt-3 mt-2 text-[#FFFFFF] max-w-[160px] md:max-w-[296px]">{setting?.site_description}</p>
              <div className="xl:mt-10 lg:mt-8 md:mt-5 mt-4">
                <h5 className="description-3 !font-montserrat !font-bold text-[#FFFFFF]">{i18n.t("Follow Us On")}</h5>
                <div className="flex gap-2 md:gap-3 lg:gap-4 lg:mt-5 mt-3">
                  {navIcons.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        className="group transition-all duration-300 w-10 h-10 flex items-center justify-center rounded-full border-white border hover:border-primary"
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconComponent className="transition-all duration-300 p-[0.5px] text-white text-xl group-hover:text-primary" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            <div>
              <h3 className="description-3 !font-montserrat !font-bold text-[#FFFFFF]">{i18n.t("Useful link")}</h3>
              <ul className="lg:mt-6 md:mt-5 mt-4">
                {navLinks1?.map((item, index) => (
                  <li
                    key={index}
                    className="first:mt-0 xl:mt-[14px] lg:mt-3 mt-2 description-2 text-white transform duration-300 hover:text-primary cursor-pointer"
                  >
                    <div className="relative pl-6 group flex items-center">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white transition-colors duration-300 group-hover:bg-primary"></span>
                      <Link href={item?.link} className="whitespace-pre transition-colors duration-300 group-hover:text-primary">
                        {i18n.t(item?.name)}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* বাকি অংশ আগের মতোই থাকবে */}
          <div className="w-full lg:w-[50%] flex justify-between lg:gap-8 md:gap-4 gap-8">
            <div>
              <h5 className="description-3 !font-montserrat !font-bold text-[#FFFFFF]">{i18n.t("Our Image Gallery")}</h5>
              <div className="lg:mt-6 md:mt-5 mt-4 grid grid-cols-2 xl:grid-cols-3 gap-x-2 gap-y-1 lg:gap-x-3 lg:gap-y-1 ">
                {
                  setting?.gallery?.map((image, index) => (
                    <div key={index} className=" relative">
                      <ImageAntd
                        className="w-full h-full object-cover rounded-[10px]"
                        src={image}
                        alt="image"
                        width={68}
                        height={60}
                      />
                    </div>
                  ))
                }
              </div>
            </div>
            <div>
              <div>
                <div className="flex items-center gap-2">
                  <IoCallOutline className="description-3 text-primary" />
                  <h5 className="description-3 !font-montserrat !font-bold text-[#FFFFFF]">{i18n.t("Contact Us")}</h5>
                </div>
                <p className="description-1 !font-medium lg:mt-4 md:mt-3 mt-2 text-[#FFFFFF]">{setting?.site_phone}</p>
              </div>
              <div className="lg:mt-6 md:mt-5 mt-4">
                <div className="flex items-center gap-2">
                  <FiSend className="description-3 text-primary" />
                  <h5 className="description-3 !font-montserrat !font-bold text-[#FFFFFF]">{i18n.t("Email Us")}</h5>
                </div>
                <p className="description-1 !font-medium lg:mt-4 md:mt-3 mt-2 text-[#FFFFFF]">{setting?.site_email}</p>
              </div>
              <div className="lg:mt-6 md:mt-5 mt-4">
                <div className="flex items-center gap-2">
                  <IoLocationSharp className="description-3 text-primary" />
                  <h5 className="description-3 !font-montserrat !font-bold text-[#FFFFFF]">{i18n.t("Address")}</h5>
                </div>
                <p className="description-1 !font-medium lg:mt-4 md:mt-3 mt-2 text-[#FFFFFF] max-w-[150px] lg:max-w-[200px] xl:max-w-[250px]">{setting?.site_address}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:mt-14 lg:mt-12 md:mt-10 mt-5 bg-[#E8EAE8] w-full h-[1px]"></div>
        <div className="xl:my-7 lg:my-6 md:my-5 my-4 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-[#FFFFFF] description-1 mt-3 sm:mt-0 ">
            Copyright © {currentYear || new Date().getFullYear()} All rights reserved by
            <Link className="text-primary text-lg ml-1" href="/"> <span className="description-2"> {` ${setting?.site_name}`} </span> </Link>
          </p>
          <div className="flex items-center gap-2 sm:gap-4 lg:mt-5 md:mt-4 mt-3">
            <h5 className="description-1 !font-semibold text-[#FFFFFF]">{i18n.t("Payment Partners")}: </h5>
            <div className="flex items-center gap-2 lg:gap-3">
              {
                setting?.payment_methods_logo?.map((image, index) => (
                  <div key={index} className="w-[34px] h-[24px] relative">
                    <ImageAntd
                      className="w-full h-full object-cover rounded"
                      src={image}
                      alt="image"
                      width={34}
                      height={24}
                    />
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;