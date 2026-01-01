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
  return (
    <div className="agency-container">
      <div
        className={`${align === "center"
          ? "flex flex-col items-center justify-center text-center"
          : ""
          } `}
      >
        {title && (
          <div className="relative w-[271px] h-[63px] animate-bounceUpDown">
            <Image
              src="/theme1/footer/bg.png"
              width={1000}
              height={1000}
              className="object-cover"
              alt="background"
            />
            <p
              className={`absolute inset-0 flex items-center justify-center text-[#05073C] section-heading -mt-1 capitalize`}
            >
              {i18n.t(title)}
            </p>
          </div>
        )}
        <AnimatedContent direction="horizontal" distance={100} reverse={true}>
          <h1
            className={`heading-1 ${testimonial ? "text-[#FFFFFF]" : "text-[#05073C]"
              } md:mt-4 mt-3 ${maxWidth}`}
          >
            {i18n.t(heading)}
          </h1>
        </AnimatedContent>

        <AnimatedContent
          direction="horizontal"
          distance={100}
          reverse={false}
        >
          <p
            className={`description-1 ${testimonial ? "text-[#FFFFFF]" : "text-[#717171]"
              } lg:mt-6 md:mt-5 mt-4 ${maxWidth}`}
          >
            {i18n.t(description)}
          </p>
        </AnimatedContent>
      </div>
    </div>
  );
};
export default SectionHeaderPage;
