//@ts-nocheck

import { useCurrency } from "@/app/contexts/site";
import Image from "next/image";

const CheckOutCard = ({ data }) => {
  const item = data?.product;
  const { currency_symbol } = useCurrency()
  return (
    <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 xl:gap-5 items-center p-3 md:p-4 lg:p-5 xl:p-6 border-b">
      {
        item?.thumb_image && (
          <Image
            loading="eager"
            className="rounded-[20px] w-[100px] h-[100px] object-fill"
            src={item?.thumb_image}
            width={100}
            height={100}
            alt="cat product"
          />
        )
      }
      <div className="mt-3 sm:mt-0 description w-full">
        <p className="capitalize !font-semibold">{item?.name}</p>
        <div className="mt-2 flex items-center justify-between description !font-semibold">
          <p className="text-[#44433F]">
            <del>{currency_symbol} {item?.price?.amount}</del>
          </p>
          <p className="text-primary">{currency_symbol} {item?.current_price}</p>
        </div>
        <p className="mt-2 text-[#44433F] capitalize"><span className="font-semibold text-[#05073C]">quantity: </span> {data?.quantity} pcs</p>
      </div>
    </div>
  );
};

export default CheckOutCard;