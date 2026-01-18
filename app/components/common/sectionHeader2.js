"use client";
import { useI18n } from "@/app/contexts/i18n";
import Image from "next/image";
import AnimatedContent from "../ui/animatedContent";

const SectionHeaderPage2 = ({
  align = "center",
  maxWidth = "max-w-[710px]",
  title,
  heading,
  description,
  testimonial = false,
}) => {
  const i18n = useI18n();
  const isCenter = align === "center";

  return (
    <div className="agency-container">
      <div
        className={`flex flex-col w-full ${
          isCenter ? "items-center justify-center text-center" : "items-start text-left"
        }`}
      >
        {/* Title Badge Section with Star */}
        {title && (
          <div className={`flex items-center animate-bounceUpDown ${isCenter ? "justify-center" : ""}`}>
            <Image
              src="/theme2/star.png"
              width={56} // w-14 is 56px
              height={56}
              className="object-cover w-14 h-14 relative z-10"
              alt="star"
            />
            <p
              className={` ${
                testimonial ? "text-[#FFFFFF]" : "text-[#05073C]"
              } text-sm lg:text-base font-lato capitalize px-4 lg:px-6 py-2 lg:py-3.5 rounded-full border-2 -ml-2`}
            >
              {i18n.t(title)}
            </p>
          </div>
        )}

        {/* Heading Section */}
        <div className={`w-full ${isCenter ? "flex justify-center" : ""}`}>
          <AnimatedContent direction="horizontal" distance={100} reverse={true}>
            <h1
              className={`heading-1 ${
                testimonial ? "text-[#FFFFFF]" : "text-[#05073C]"
              } md:mt-4 mt-3 ${maxWidth} ${isCenter ? "mx-auto" : ""}`}
            >
              {i18n.t(heading)}
            </h1>
          </AnimatedContent>
        </div>

        {/* Description Section */}
        <div className={`w-full ${isCenter ? "flex justify-center" : ""}`}>
          <AnimatedContent direction="horizontal" distance={100} reverse={false}>
            <p
              className={`description-1 ${
                testimonial ? "text-[#FFFFFF]" : "text-[#717171]"
              } lg:mt-6 md:mt-5 mt-4 ${maxWidth} ${isCenter ? "mx-auto" : ""}`}
            >
              {i18n.t(description)}
            </p>
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
};

export default SectionHeaderPage2;