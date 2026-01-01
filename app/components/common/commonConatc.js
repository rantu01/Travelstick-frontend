"use client";
import { useI18n } from "@/app/contexts/i18n";
import { fetchPageContent } from "@/app/helper/backend";
import { useFetch } from "@/app/helper/hooks";
import React, { useEffect } from "react";
import { IoCallOutline } from "react-icons/io5";
const CommonContact = () => {
  const i18n = useI18n();
  const [contacts, getContacts] = useFetch(fetchPageContent, {}, false);

  useEffect(() => {
    getContacts({ slug: "contact_us" });
  }, []);
  const getYouTubeEmbedUrl = (url) => {
    if (!url || typeof url !== "string") return null;

    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    if (!match) return null;

    const videoId = match[1];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1`;
  };

  const videoUrl = contacts?.content?.video_url;
  const embedUrl = getYouTubeEmbedUrl(videoUrl);
  return (
    <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:min-h-[513px] overflow-hidden rounded-[10px] lg:rounded-[20px] bg-black">
      {/* Video iframe - full width & height */}
      <iframe
        src={embedUrl}
        title="YouTube video"
        allow="autoplay; encrypted-media"
        allowFullScreen
        className="w-[135vh] h-[65vh] absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none"
      />

      {/* Opacity layer over video */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />

      {/* Contact text - above everything */}
      <div className="relative z-20 w-full h-full flex items-end justify-center xl:pb-8 lg:pb-6 md:pb-5 pb-4">
        <div>
          <div className="flex items-center justify-center gap-1">
            <IoCallOutline className="text-primary description-3" />
            <p className="description-3 !font-bold !font-montserrat text-white flex justify-center">
              {i18n.t("Contact Us")}
            </p>
          </div>
          <p className="description-1 text-white lg:mt-3 md:mt-2 mt-1 flex justify-center ml-4">
            {contacts?.content?.company_phone}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommonContact;
