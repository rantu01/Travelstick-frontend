"use client";
import FormInput from "@/app/components/form/input";
import Banner from "@/app/components/site/common/component/Banner";
import { Form } from "antd";
import { SiGooglemaps } from "react-icons/si";
import React, { useEffect, useState } from "react";
import { FaFacebook, FaPhoneVolume } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaTwitter } from "react-icons/fa";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa6";
import { useAction, useFetch } from "@/app/helper/hooks";
import {
  createContact,
  fetchPageContent,
  fetchPublicSettings,
} from "@/app/helper/backend";
import Button from "@/app/(dashboard)/components/common/button";
import { useI18n } from "@/app/contexts/i18n";
import Banner2 from "../../site/common/component/Banner2";

const ContactPage = ({ theme }) => {
  const i18n = useI18n();
  const { langCode } = useI18n();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [setting] = useFetch(fetchPublicSettings);
  const [data, getData] = useFetch(fetchPageContent, {}, false);

  useEffect(() => {
    getData({ slug: "contact_us" });
  }, []);
  const contactInfo = data?.content;
  const location = `${contactInfo?.company_name}, ${contactInfo?.company_address} || "Appstick, 85, KDA Outer Bypass Rd, Khulna 9100, Bangladesh]"`;
  const handleSubmit = async (values) => {
    setLoading(true);
    await useAction(createContact, { body: values });
    form.resetFields();
    setLoading(false);
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url || typeof url !== "string") return null;

    const match = url.match(
      /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:v\/|e(?:mbed)?\/|watch\?v=|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (!match) return null;

    const videoId = match[1];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1`;
  };

  const videoUrl = contactInfo?.video_url || "https://youtu.be/5v6u_U6QRQA?t=6";
  const embedUrl = getYouTubeEmbedUrl(videoUrl);
  return (
    <div className="">
      {
        theme === 'one' ?
          <Banner title="Contact Us" /> :
          <Banner2 title="Contact Us" />
      }
      <div className="travel-container xl:mt-[106px] lg:mt-[90px] md:mt-20 xm:mt-16 mt-12 relative">
        <div className="">
          <div className="flex flex-col sm:flex-row xl:gap-[70px] lg:gap-12 md:gap-8 gap-5">
            <div className="w-full md:w-[50%]">
              <div className="relative">
                <h3 className="heading-1 text-[#05073C]">
                  {i18n.t(contactInfo?.title)}
                </h3>
                <p
                  className="xl:mt-6 lg:mt-5 md:mt-4 mt-3 description-1 text-[#717171]"
                  dangerouslySetInnerHTML={{
                    __html: contactInfo?.description?.[langCode],
                  }}
                ></p>
                <div className="xl:mt-10 lg:mt-8 md:mt-7 sm:mt-6 mt-5">
                  <div className="flex gap-2">
                    <div className="bg-primary w-14 h-14 rounded-full flex items-center justify-center">
                      <FaPhoneVolume className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="description-2 text-[#05073C] !font-semibold">
                        {i18n.t("Phone Number")}
                      </p>
                      <p className="description-1 text-[#717171] mt-1">
                        {" "}
                        {setting?.site_phone}{" "}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 xl:mt-8 lg:mt-6 md:mt-5 mt-4">
                    <div className="bg-primary w-14 h-14 rounded-full flex items-center justify-center">
                      <MdEmail className="text-white" size={28} />
                    </div>
                    <div>
                      <p className="description-2 text-[#05073C] !font-semibold">
                        {i18n.t("Email Address")}
                      </p>
                      <p className="description-1 text-[#717171] mt-1">
                        {setting?.site_email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 xl:mt-8 lg:mt-6 md:mt-5 mt-4 xl:pb-8 lg:pb-6 md:pb-5 pb-4 border-b">
                    <div className="bg-primary w-14 h-14 rounded-full flex items-center justify-center">
                      <SiGooglemaps className="text-white" size={28} />
                    </div>
                    <div>
                      <p className="description-2 text-[#05073C] !font-semibold">
                        {i18n.t("Address")}
                      </p>
                      <p className="description-1 text-[#717171] mt-1">
                        {setting?.site_address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="xl:mt-8 lg:mt-6 md:mt-5 mt-4">
                  <p className="description-2 text-[#05073C] !font-semibold">
                    {i18n.t("Follow Us")}:
                  </p>
                  <div className="xl:mt-6 lg:mt-5 md:mt-4 mt-3 flex items-center md:gap-4 gap-3">
                    <Link
                      href={setting?.social_media_link[0]?.link || "/"}
                      className="group flex items-center justify-center w-10 h-10 rounded-full transform duration-300 hover:bg-primary/80 bg-primary"
                    >
                      <FaFacebook
                        className="text-white transform duration-300"
                        size={20}
                      />
                    </Link>
                    <Link
                      href={setting?.social_media_link[1]?.link || "/"}
                      className="group flex items-center justify-center w-10 h-10 rounded-full transform duration-300 hover:bg-primary/80 bg-primary"
                    >
                      <FaTwitter
                        className="text-white transform duration-300"
                        size={20}
                      />
                    </Link>
                    <Link
                      href={setting?.social_media_link[3]?.link || "/"}
                      className="group flex items-center justify-center w-10 h-10 rounded-full transform duration-300 hover:bg-primary/80 bg-primary"
                    >
                      <FaLinkedin
                        className="text-white transform duration-300"
                        size={20}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full md:w-[50%] overflow-hidden rounded-[10px] lg:rounded-[20px] bg-black">
              {/* Video Background */}
              <div className="absolute top-0 left-0 w-full h-full z-0 ">
                <iframe
                  src={embedUrl}
                  title="YouTube video"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  className="w-[177.77vh] h-[100vh] absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none"
                />
              </div>

              {/* Form Content */}
              <div className="relative z-10 w-full h-full xl:p-8 lg:p-6 md:p-6 p-4 bg-black/80 rounded-[10px] lg:rounded-[20px]">
                <p className="heading-5 text-white">{i18n.t("Send Message")}</p>
                <Form
                  className="xl:mt-[30px] lg:mt-6 md:mt-5 mt-4 z-50 relative contact-input-form"
                  layout="vertical"
                  onFinish={handleSubmit}
                  form={form}
                >
                  <div>
                    <FormInput
                      className="text-white w-full p-3 md:p-4 bg-transparent rounded focus:outline-none"
                      label="Name"
                      name="name"
                      placeholder="Enter your name"
                      required={true}
                    />
                  </div>
                  <div>
                    <FormInput
                      className="text-white w-full p-3 md:p-4 bg-transparent rounded focus:outline-none"
                      label="Email"
                      name="email"
                      isEmail={true}
                      placeholder="Enter your email"
                      required={true}
                    />
                  </div>
                  <div>
                    <FormInput
                      className="text-white w-full p-3 md:p-4 bg-transparent rounded focus:outline-none"
                      label="Subject"
                      name="subject"
                      placeholder="Enter your subject"
                      required={true}
                    />
                  </div>
                  <div className="mt-3">
                    <FormInput
                      textArea={true}
                      rows={3}
                      className="text-white border w-full min-h-[112px] p-2 sm:p-3 xl:p-4 rounded bg-transparent focus:outline-none"
                      label="Message"
                      type="text"
                      name="message"
                      placeholder="Enter your message ..."
                      required={true}
                    />
                  </div>
                  <div className="mt-4">
                    <Button
                      type="submit"
                      className="common-btn w-full bg-primary text-white"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="xl:mt-[120px] lg:mt-20 md:mt-16 mt-12 border rounded-[10px] lg:rounded-[20px] xl:rounded-[30px] border-[#E8EAE8] overflow-hidden">
            <div className="w-full xl:h-[500px] lg:h-[400px] md:h-[350px] h-[300px]">
              <iframe
                title="My Location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  location
                )}&output=embed`}
                className="w-full h-full border-0 rounded-2xl shadow-lg"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
