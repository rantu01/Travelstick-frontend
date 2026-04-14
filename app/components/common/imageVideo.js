import Image from "next/image";
import ProductImageSlider from "../site/common/card/imageSlider";
import { FaPlay } from "react-icons/fa6";
import { useState } from "react";
import { Modal } from "antd";

const ImageVideo = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const primaryImage =
    data?.image || data?.banner_image || data?.card_image || data?.images?.[0];
  const galleryImages =
    data?.images?.length > 0
      ? data.images
      : primaryImage
        ? [primaryImage]
        : [];

  const getEmbedUrl = (url) => {
    if (!url) return "";
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="w-full h-full relative">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Left Side: Image Slider */}
        <div className="w-full lg:w-[60%]">
          <ProductImageSlider
            banner_image={primaryImage}
            images={galleryImages}
          />
        </div>

        {/* Right Side: Video and Small Images */}
        <div className="w-full lg:w-[40%] flex flex-col gap-4">
          {/* Video Thumbnail Section */}
          <div className="relative w-full h-[220px] md:h-[290px] lg:h-[240px] xl:h-[290px] rounded-2xl overflow-hidden shadow-sm">
            {primaryImage && (
              <Image
                src={primaryImage}
                alt="Video Thumbnail"
                fill
                className="object-cover"
              />
            )}
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center transition-colors hover:bg-black/20">
              <button
                onClick={() => setIsOpen(true)}
                className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 transition-transform hover:scale-110"
              >
                <div className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center shadow-lg">
                  <FaPlay className="text-xl ml-1" />
                </div>
              </button>
            </div>
          </div>

          {/* Bottom Two Small Images */}
          <div className="grid grid-cols-2 gap-4 h-[150px] md:h-[200px] lg:h-[180px] xl:h-[235px]">
            {/* First Small Image - fallback to banner_image if images[0] is missing */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm">
              <Image
                src={galleryImages?.[0] || primaryImage || "/placeholder.jpg"}
                alt="Gallery 1"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Second Small Image - fallback to banner_image or placeholder if images[1] is missing */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm">
              <Image
                src={galleryImages?.[1] || galleryImages?.[0] || primaryImage || "/placeholder.jpg"}
                alt="Gallery 2"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Modal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
        width="75%"
        centered
        destroyOnClose
        styles={{ body: { padding: '25px 10px 10px 10px' } }}
      >
        <div className="w-full h-0 pb-[56.25%] relative rounded-xl overflow-hidden">
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