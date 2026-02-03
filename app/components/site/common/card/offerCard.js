'use client';
import { useI18n } from "@/app/contexts/i18n";
import TextWithTooltip from "@/app/helper/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

const OfferCard = ({ title, heading, discount, discount_type, image, data }) => {
  const router = useRouter();
  const i18n = useI18n();

  return (
    <div className="relative overflow-hidden rounded-xl shadow-md h-[220px] w-full group cursor-pointer bg-gray-100">
      
      {/* ১. মেইন ইমেজ (যা সবসময় দেখা যাবে) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={image}
          alt={title || "Offer Image"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* ২. ব্লু ওভারলে কন্টেন্ট (Hover করলে নিচ থেকে উঠবে) */}
      <div className="absolute inset-0 bg-[#007bff]/90 flex flex-col justify-center px-6 py-4 text-white transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0">
        
        {/* টাইটেল বা ডিসকাউন্ট টেক্সট */}
        <h3 className="text-lg font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
           Enjoy {discount_type === "percent" ? `Flat ${discount}% Discount` : `$${discount} Off`}
        </h3>

        {/* ডেসক্রিপশন */}
        <div className="text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
          <TextWithTooltip limit={80} text={heading} />
        </div>

        {/* বাটন (ইমেজের মতো 'View Details' স্টাইল) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
          <button
            onClick={(e) => {
              e.stopPropagation(); // স্লাইড ক্লিক হ্যান্ডেল করার জন্য
              router.push(`/package?discount=${data?.discount}&discount_type=${data?.discount_type}`);
            }}
            className="text-white font-bold text-sm underline underline-offset-4 hover:text-blue-200 transition-colors uppercase"
          >
             View Details
          </button>
        </div>
      </div>
      
      {/* ৩. ডিফল্ট অবস্থায় যদি ইমেজের ওপর হালকা কোনো টেক্সট রাখতে চান (ঐচ্ছিক) */}
      {!image && (
         <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
            No Image Available
         </div>
      )}
    </div>
  );
};

export default OfferCard;