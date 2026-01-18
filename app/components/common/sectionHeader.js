"use client";
import { useI18n } from "@/app/contexts/i18n";
import Image from "next/image";
import AnimatedContent from "../ui/animatedContent";

const SectionHeaderPage = ({
  align = "center",
  maxWidth = "max-w-[710px]",
  title,
  heading,
  description,
  testimonial = false,
}) => {
  const i18n = useI18n();

  // এলাইনমেন্টের ওপর ভিত্তি করে ক্লাস নির্ধারণ
  const isCenter = align === "center";

  return (
    <div className="agency-container">
      <div
        className={`flex flex-col w-full ${
          isCenter ? "items-center justify-center text-center" : "items-start text-left"
        }`}
      >
        {/* Title Badge Section */}
        {title && (
          <div className="relative w-[271px] h-[63px] animate-bounceUpDown flex items-center justify-center">
            <Image
              src="/theme1/footer/bg.png"
              width={271}
              height={63}
              className="object-cover absolute inset-0"
              alt="background"
            />
            <p className="relative z-10 text-[#05073C] section-heading -mt-1 capitalize">
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

export default SectionHeaderPage;