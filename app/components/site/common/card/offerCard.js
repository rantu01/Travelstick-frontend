'use client';
import { useI18n } from "@/app/contexts/i18n";
import AnimatedContent from "@/app/components/ui/animatedContent";
import TextWithTooltip from "@/app/helper/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

const OfferCard = ({ title, heading, discount, discount_type, image, path = "one", data }) => {
  const router = useRouter();
  const i18n = useI18n();
  return (
    <div className={`${path === "one" ? "bg-[#FEF5EE]" : "bg-[#FCE9D8]"
      } rounded-xl shadow-md px-4 max-w-[424px] mx-auto offerPath !h-[260px]`}>
      <div className="flex justify-between h-full overflow-hidden">
        <AnimatedContent direction="horizontal" reverse={true} distancce={50} >
        <div className="py-6 flex flex-col">
          <p className="text-[#EB662B] description-1 !font-dancingScript mb-4">
            {title}
          </p>
          <h3 className="max-w-[130px] heading-3 whitespace-pre lg:text-3xl font-bold xl:text-[32px] text-[#05073C] !font-dancingScript mb-2 leading-tight">
            {
              discount_type === "percent" ?
              (<TextWithTooltip limit={10} text={`${discount} % OFF`}  />) :

              (<TextWithTooltip limit={10} text={`$ ${discount} Save`} />)
            }
            
            
          </h3>
          <p className="text-[#717171] description-1 mt-2 max-w-[130px]">
           <TextWithTooltip limit={30} text={heading} />
          </p>
          <div className="flex-grow" />
            <button
              className="details-button mt-4"
              onClick={() => {
                router.push(`/package?discount=${data?.discount}&discount_type=${data?.discount_type}`);
              }}
            >
              {i18n.t("View Offer")}
            </button>
         
        </div>
        </AnimatedContent>
        <AnimatedContent direction="horizontal" reverse={false} distancce={50}>
        <div className={`${path === "one" ? "image2Path w-[150px] xs:w-[248px] h-[183px] mt-8" : "image1Path w-[140px] xs:w-[192px] h-[228px] mt-3"} relative`}>
          <Image
            src={image}
            alt="Image"
            layout="fill"
            objectFit="cover"
          />
        </div>
        </AnimatedContent>
      </div>
    </div>
  );
};

export default OfferCard;
