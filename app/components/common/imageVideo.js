import Image from "next/image";
import ProductImageSlider from "../site/common/card/imageSlider";
import { FaPlay } from "react-icons/fa6";
import { useState } from "react";
import { Modal } from "antd";

const ImageVideo = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getEmbedUrl = (url) => {
    if (!url) return "";
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="w-full h-full relative">
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        <div className="w-full lg:w-3/5">
          <ProductImageSlider
            banner_image={data?.banner_image}
            images={data?.images}
          />
        </div>
        <div className="w-full lg:w-2/5">
          <div className="w-full max-w-5xl mx-auto">
            <div className="relative w-full h-[290px] rounded-xl overflow-hidden mb-4">
              {data?.card_image && (
                <Image
                  src={data?.card_image}
                  alt="Video Thumbnail"
                  layout="fill"
                  objectFit="cover"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsOpen(true)}
                  className="w-14 h-14 bg-white bg-opacity-60 backdrop-blur-md rounded-full flex items-center justify-center"
                >
                  <div className="w-10 h-10 bg-[#FEF5EE] text-primary rounded-full flex items-center justify-center">
                    <FaPlay className="text-2xl" />
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative w-full h-[290px] rounded-xl overflow-hidden">
                {data?.images?.[0] && (
                  <Image
                    src={data?.images?.[0]}
                    alt="Small Image 1"
                    layout="fill"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="relative w-full h-[290px] rounded-xl overflow-hidden">
                {data?.images?.[1] && (
                  <Image
                    src={data?.images?.[1]}
                    alt="Small Image 2"
                    layout="fill"
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        width="70%"
        centered
        destroyOnClose
      >
        <div className="w-full h-0 pb-[56.25%] relative mt-6">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={getEmbedUrl(data?.banner_video_url || data?.video_url)}
            title="Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Modal>
    </div>
  );
};

export default ImageVideo;
