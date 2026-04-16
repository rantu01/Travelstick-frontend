"use client";
import { useState } from "react";
import { HiOutlineShoppingCart } from "react-icons/hi";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCurrency } from "@/app/contexts/site";
import AuthModal from "../component/authModal";
import { LuView } from "react-icons/lu";
import { useUser } from "@/app/contexts/user";
import { useCart } from "@/app/contexts/cartContext";
import AnimatedContent from "@/app/components/ui/animatedContent";
import TextWithTooltip from "@/app/helper/utils";
import { useI18n } from "@/app/contexts/i18n";
import { usePathname } from 'next/navigation';

const ProductCard = ({ data }) => {
  const { user } = useUser();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const i18n = useI18n();
  const { langCode } = useI18n();
  const currentPath = usePathname()
  return (
    <section>
      <AnimatedContent direction="horizontal" distance={100} reverse={false}>
        <div className="relative p-4 border border-[#D9D9D9] rounded-[8px] group">
          <div className="relative">
            <div className="overflow-hidden h-[220px] sm:h-[290px] rounded-[8px] bg-primary/15">
              <Link href={`/product/${data?._id}`}>
                <motion.img
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-[220px] sm:h-[290px] object-cover bg-primary/15"
                  height={300}
                  width={284}
                  alt={data?.name}
                  src={data?.thumb_image || data?.images?.[0]}
                />
                {data?.images?.[0] && (
                  <motion.img
                    initial={{ scale: 1, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-[220px] sm:h-[290px] object-cover absolute top-0 !rounded-[8px] left-0 bg-primary/15"
                    height={300}
                    width={284}
                    alt={`${data?.name || "Product"} Hover`}
                    src={data?.images?.[0] || data?.images?.[1]}
                  />
                )}
              </Link>
            </div>
            <div className="absolute right-2 top-0 flex flex-col space-y-2 opacity-0 pt-6 group-hover:opacity-100 transition-opacity duration-1000">
              <button
                onClick={() => {
                  if (user) {
                    addItem(data?._id, 1, "product");
                  } else {
                    setAuthModalOpen(true);
                  }
                }}
              >
                <HiOutlineShoppingCart className="bg-[#F8D9CC] rounded-full p-2 text-4xl hover:bg-primary hover:text-[#fff] transition-colors duration-300" />
              </button>
              <Link href={`/product/${data?._id}`}>
                <LuView className="bg-[#F8D9CC] rounded-full p-2 text-4xl hover:bg-primary hover:text-white transition-colors duration-300" />
              </Link>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Link href={`/product/${data?._id}`} className="">
              <h1 className="description-3 text-[#05073C] group-hover:text-primary multi-line-ellipsis-2 break-words whitespace-normal">
                <TextWithTooltip limit={60} text={data?.name} />
              </h1>
            </Link>
          </div>
          <p className="mt-3 description-2 whitespace-normal break-words">
            {i18n?.t("Category")}: <TextWithTooltip limit={30} text={data?.category?.name?.[langCode]} />
          </p>
          <div className="flex justify-between items-center mt-3">
            <p className="capitalize description-1 text-[#05073C] whitespace-normal break-words">
              {i18n?.t("Quantity")}: {data?.quantity}
            </p>
            <div className="flex items-baseline gap-2 whitespace-nowrap">
              <p className="heading-3 text-primary leading-none inline-block">{formatPrice(data?.final_price)}</p>
              {data?.regular_price && (
                <p className="description-1 text-red-400 line-through ml-2">
                  <del className="inline-block">{formatPrice(data?.regular_price)}</del>
                </p>
              )}
            </div>
          </div>
        </div>
      </AnimatedContent>
      <AuthModal authModalOpen={authModalOpen} setAuthModalOpen={setAuthModalOpen} slug={currentPath} />
    </section>
  );
};

export default ProductCard;
