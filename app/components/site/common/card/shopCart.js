// @ts-nocheck
"use client";
import ProductButtonCart from "@/app/components/btn/productButtonCart";
import { useCart } from "@/app/contexts/cartContext";
import { useI18n } from "@/app/contexts/i18n";
import { useCurrency } from "@/app/contexts/site";
import Image from "next/image";
import { useEffect, useState } from "react";

const ShopCart = ({ data }) => {
  const i18n = useI18n();
  const item = data?.product;
  const { currency_symbol } = useCurrency();
  const [count, setCount] = useState(data?.quantity || 1); 
  const [isLoading, setIsLoading] = useState(false);
  const { removeItem, getCart, getCalculatedPrice, cart } = useCart();
  const { langCode } = useI18n();
  useEffect(() => {
    if (data?.quantity !== undefined) {
      setCount(data?.quantity);
    }
    getCart();
  }, [data?.quantity, count]);

  const handleRemove = () => {
    removeItem(item?._id);
    getCart();
    getCalculatedPrice();
  };

  if (!item) return null;

  return (
    <div className="p-3 lg:p-4 xl:p-6 flex items-start gap-2 lg:gap-3 xl:gap-4">
      <Image
        className="rounded-[20px] w-[100px] h-[100px] object-fill"
        src={item?.thumb_image}
        width={100}
        height={100}
        alt="Product Image"
      />
      <div className="w-full">
        <h4 className="heading4 !font-semibold">
          {item?.name?.[langCode]}
        </h4>
        <div className="mt-2 lg:mt-3 flex items-center justify-between gap-3 description">
          <div className="description-1 flex items-center gap-2">
            <p>
              <del>{`${currency_symbol} ${item.price.amount}`}</del>
            </p>
            <p className="text-primary">{`${currency_symbol} ${item?.current_price}`}</p>
          </div>
          <button
            onClick={handleRemove}
            className="flex items-center gap-4"
            disabled={isLoading}
          >
            <p className="hidden description-1 md:flex !text-2xl">×</p> <p>{i18n.t("Remove")}</p>
          </button>
        </div>
        <div className="mt-2 lg:mt-3">
          <span className="description-1 border rounded-[10px] px-2 py-1">
            {item?.price?.discount_type === "percent"
              ? `Save ${item.price.discount}%`
              : `Save ${currency_symbol} ${item.price.discount}`}
          </span>
        </div>
        <div className="flex items-center justify-between mt-6 lg:mt-7 xl:mt-8">
          <ProductButtonCart
            getCartList={getCart}
            getCalculation={getCalculatedPrice}
            count={data?.quantity}
            id={item?._id}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopCart;
