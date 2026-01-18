'use client';
import { useI18n } from "@/app/contexts/i18n";
import TextWithTooltip from "@/app/helper/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

const OfferCard = ({ title, heading, discount, discount_type, image, data }) => {
  const router = useRouter();
  const i18n = useI18n();

  return (
    <div className="flex flex-col rounded-sm overflow-hidden shadow-lg max-w-[400px] mx-auto group h-full">
      {/* ইমেজ সেকশন */}
      <div className="relative w-full h-[220px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* কন্টেন্ট সেকশন (ব্লু ব্যাকগ্রাউন্ড) */}
      <div className="bg-[#1D2B7A] p-6 flex flex-col items-center text-center flex-grow">
        <h3 className="text-white text-4xl font-bold mb-4">
          {discount_type === "percent" ? `${discount}%` : `$${discount}`}
        </h3>
        
        <div className="text-gray-200 text-sm mb-6 leading-relaxed flex-grow">
          <TextWithTooltip limit={120} text={heading} />
        </div>

        <button
          onClick={() => {
            router.push(`/package?discount=${data?.discount}&discount_type=${data?.discount_type}`);
          }}
          className="w-full py-3 bg-[#00BFFF] hover:bg-[#009ED9] text-white font-bold rounded-md transition-colors duration-300 uppercase tracking-wider"
        >
          {i18n.t("Get Offer")}
        </button>
      </div>
    </div>
  );
};

export default OfferCard;