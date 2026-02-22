'use client';
import { useI18n } from "@/app/contexts/i18n";
import TextWithTooltip from "@/app/helper/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

const OfferCard = ({ title, heading, discount, discount_type, image, data }) => {
  const router = useRouter();
  const i18n = useI18n();

  return (
    /* w-full এবং mx-auto নিশ্চিত করা হয়েছে যাতে স্লাইডারের ভেতর ঠিকঠাক বসে */
    <div className="relative overflow-hidden rounded-xl shadow-md 
                    h-[200px] sm:h-[220px] 
                    w-full max-w-full group cursor-pointer bg-gray-100 mx-auto">
      
      {/* ১. মেইন ইমেজ - অবজেক্ট ফিট কভার দেওয়া হয়েছে */}
      <div className="absolute inset-0 w-full h-full">
        {image ? (
          <Image
            src={image}
            alt={title || "Offer Image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-xs">
            No Image Available
          </div>
        )}
      </div>

      {/* ২. ব্লু ওভারলে কন্টেন্ট - মোবাইল ফ্রেন্ডলি প্যাডিং ও ফন্ট সাইজ */}
      <div className="absolute inset-0 bg-[#007bff]/90 flex flex-col justify-center 
                      px-5 sm:px-6 py-4 text-white 
                      transform translate-y-full 
                      transition-transform duration-500 ease-in-out 
                      group-hover:translate-y-0">
        
        <h3 className="text-base sm:text-lg font-bold mb-1 
                       opacity-0 group-hover:opacity-100 
                       transition-opacity duration-500 delay-100 leading-tight">
          Enjoy {discount_type === "percent" ? `Flat ${discount}% Discount` : `$${discount} Off`}
        </h3>

        <div className="text-xs sm:text-sm mb-3 sm:mb-4 
                        opacity-0 group-hover:opacity-100 
                        transition-opacity duration-500 delay-200 line-clamp-3">
          <TextWithTooltip limit={70} text={heading} />
        </div>

        <div className="opacity-0 group-hover:opacity-100 
                        transition-opacity duration-500 delay-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/package?discount=${data?.discount}&discount_type=${data?.discount_type}`);
            }}
            className="text-white font-bold text-[11px] sm:text-sm 
                       underline underline-offset-4 
                       hover:text-blue-200 transition-colors uppercase tracking-wider">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;